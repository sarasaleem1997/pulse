import Anthropic from '@anthropic-ai/sdk'
import { toolDefinitions, toolImplementations } from './tools.js'
import { SYSTEM_PROMPT } from './prompts.js'

const TOOL_QUERY_LABEL = {
  web_search: (input) => input.query,
  search_app_reviews: (input) => `${input.app} · ${input.market}`,
  get_past_experiments: (input) => {
    const parts = []
    if (input.market) parts.push(`market: ${input.market}`)
    if (input.lever) parts.push(`lever: ${input.lever}`)
    if (input.metric) parts.push(`metric: ${input.metric}`)
    return parts.length ? parts.join(', ') : 'all experiments'
  },
  apply_rice_framework: (input) =>
    `${input.candidates?.length || 0} candidates`,
}

function extractFinding(toolName, result) {
  if (toolName === 'web_search') {
    return result.results?.[0]?.snippet?.slice(0, 130) || 'No results found'
  }
  if (toolName === 'search_app_reviews') {
    const top = result.top_complaints?.[0]
    return `${result.app} ${result.market}: ${result.rating}/5 — top issue: "${top?.theme}" (${top?.percentage}% of reviews)`
  }
  if (toolName === 'get_past_experiments') {
    const first = result.experiments?.[0]
    return first
      ? `${result.total_found} experiment${result.total_found !== 1 ? 's' : ''} found — best: "${first.name}" (${first.result})`
      : `${result.total_found} experiments found`
  }
  if (toolName === 'apply_rice_framework') {
    const top = result.ranked_candidates?.[0]
    return top ? `#1: "${top.name}" with RICE score ${top.rice_score}` : 'Scoring complete'
  }
  return 'Done'
}

function parseJsonOutput(text) {
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]+?)\s*```/)
  if (codeBlock) return JSON.parse(codeBlock[1])

  const jsonObject = text.match(/\{[\s\S]+\}/)
  if (jsonObject) return JSON.parse(jsonObject[0])

  throw new Error('Agent response was not valid JSON.')
}

export async function runPulseAgent({ problem, onStep, onComplete, onError }) {
  const client = new Anthropic({
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
    dangerouslyAllowBrowser: true,
  })

  try {
    const messages = []
    let researchIndex = 0

    onStep({ id: 'understand', name: 'Understand', status: 'running', finding: null })

    messages.push({ role: 'user', content: problem })

    let response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools: toolDefinitions,
      messages,
    })

    const firstText = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join(' ')
      .trim()

    const firstToolCalls = response.content.filter((b) => b.type === 'tool_use')

    onStep({
      id: 'understand',
      name: 'Understand',
      status: 'done',
      finding: firstText
        ? firstText.split('\n')[0].slice(0, 140)
        : 'Problem parsed — market, metric, and growth levers extracted',
    })

    onStep({
      id: 'plan',
      name: 'Plan',
      status: 'done',
      finding:
        firstToolCalls.length > 0
          ? `${firstToolCalls.length} evidence gap${firstToolCalls.length !== 1 ? 's' : ''} identified → querying ${firstToolCalls.map((t) => t.name.replace(/_/g, ' ')).join(', ')}`
          : 'Evidence sufficient — synthesising directly from context',
    })

    // Agentic tool-calling loop (capped at 4 iterations)
    let loopCount = 0
    while (response.stop_reason === 'tool_use' && loopCount < 2) {
      loopCount++
      const toolUses = response.content.filter((b) => b.type === 'tool_use')
      const toolResults = []

      for (const toolUse of toolUses) {
        researchIndex++
        const stepId = `research_${researchIndex}`
        const queryLabel = TOOL_QUERY_LABEL[toolUse.name]?.(toolUse.input) ?? JSON.stringify(toolUse.input)

        onStep({
          id: stepId,
          name: 'Research',
          status: 'running',
          tool: toolUse.name,
          query: queryLabel,
          finding: null,
        })

        const result = toolImplementations[toolUse.name](toolUse.input)
        const finding = extractFinding(toolUse.name, result)

        onStep({
          id: stepId,
          name: 'Research',
          status: 'done',
          tool: toolUse.name,
          query: queryLabel,
          finding,
        })

        toolResults.push({
          type: 'tool_result',
          tool_use_id: toolUse.id,
          content: JSON.stringify(result),
        })
      }

      messages.push({ role: 'assistant', content: response.content })
      messages.push({ role: 'user', content: toolResults })

      response = await client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        tools: toolDefinitions,
        messages,
      })
    }

    onStep({ id: 'synthesise', name: 'Synthesise', status: 'running', finding: null })

    const finalText = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim()

    const brief = parseJsonOutput(finalText)

    const topRec = brief.recommendations?.[0]
    onStep({
      id: 'synthesise',
      name: 'Synthesise',
      status: 'done',
      finding: topRec
        ? `#1: "${topRec.experiment}" — RICE ${topRec.rice_score}, confidence ${topRec.confidence}%`
        : 'Recommendations ranked by RICE score',
    })

    const flags = brief.flags || []
    onStep({
      id: 'critique',
      name: 'Critique',
      status: 'done',
      finding:
        flags.length > 0
          ? `${flags.length} flag${flags.length !== 1 ? 's' : ''} raised — ${flags[0].message.slice(0, 100)}`
          : 'All recommendations meet confidence threshold',
    })

    onComplete(brief)
  } catch (err) {
    onError(err)
  }
}
