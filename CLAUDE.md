# Pulse — Growth Intelligence Agent

## What this project is

Pulse is an AI agent prototype built for a Digital Product Management course at ESADE Business School (MSc Business Analytics). It is anchored to Glovo's Senior Growth Analyst role and will be used as both a class deliverable and a job application artifact.

The prototype must be demo-ready for a live classroom presentation (Session 9). The key demo moment: analyst types a problem in plain language, watches the agent reason step-by-step, and receives a structured growth experiment recommendation brief in under 5 seconds (simulated) or real API time.

---

## The product

**Name:** Pulse  
**Tagline:** Growth intelligence agent for Glovo analysts  
**Core value prop:** Turns a plain-language growth problem into a ranked experiment brief — in minutes, not hours.

### The persona

**Catalina R.** — Senior Growth Analyst, Glovo HQ Barcelona  
- Works on Q-commerce growth: pricing, promotions, loyalty, CRM, performance marketing  
- Pain: gathering evidence for a prioritisation decision takes 3–4 hours across Looker, Notion, Slack, and manual Googling  
- Goal: describe a business problem → get a VP-ready brief with ranked experiments, evidence, and confidence scores  
- Quote: "By the time I've dug through past experiments, competitor pricing, and app reviews — the moment to act has passed."

### The problem statement

Glovo Growth Analysts spend most of their research time on evidence-gathering, not on the actual decision. The bottleneck is not analytical capability — it's the cost of pulling context from fragmented sources before judgment can be applied. Pulse eliminates that research tax.

---

## Agent architecture

Pulse is a **single agent with a reasoning loop** — not a pipeline. The distinction matters: the agent decides what to search for based on what it finds, loops back if evidence gaps remain, and self-critiques its own confidence before producing output.

### Reasoning loop (5 steps)

1. **Understand** — Parse the problem. Extract: market, metric, growth levers mentioned, time horizon.
2. **Plan** — Identify evidence gaps. What does the agent need to know to make a confident recommendation? E.g. competitor pricing, past experiment results, app store sentiment.
3. **Research** — Run tool calls to fill gaps. Web search, app store review scraping, analogous experiment retrieval. Loop back to Plan if new gaps emerge.
4. **Synthesise** — Apply RICE scoring (Reach × Impact × Confidence ÷ Effort) across candidate experiments. Rank top 3.
5. **Critique** — Self-evaluate confidence. Flag any lever where evidence is thin or data is stale. Cap confidence score accordingly. Then generate the output brief.

### Tools the agent uses

- `web_search` — competitor signals, market context, pricing changes
- `search_app_reviews` — Apple App Store / Google Play sentiment for Glovo and competitors in the target market
- `get_past_experiments` — retrieves analogous growth experiments from a mock knowledge base (hardcoded JSON for MVP)
- `apply_rice_framework` — structured scoring function the agent calls with its gathered evidence

### What makes it a real agent (not a pipeline)

- The agent decides *which* tools to call and *in what order* based on what it finds
- It loops: if after web search it identifies a new gap (e.g. "I need app review data for this market"), it calls another tool
- It self-critiques before output — explicitly flags low-confidence recommendations
- It can handle ambiguous input and ask a clarifying question if the problem is under-specified

---

## Tech stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS (core utility classes only)
- **AI:** Anthropic Claude API (`claude-sonnet-4-5` model) via `@anthropic-ai/sdk`
- **API key:** stored in `.env` as `VITE_ANTHROPIC_API_KEY`
- **No backend for MVP** — API calls made client-side via a simple proxy approach or directly (demo context only)
- **Mock data:** past experiments stored as a hardcoded JSON file (`src/data/experiments.json`)

### Key dependencies
```
@anthropic-ai/sdk
react
react-dom
vite
tailwindcss
```

---

## Project structure

```
pulse/
├── CLAUDE.md                  ← this file
├── .env                       ← VITE_ANTHROPIC_API_KEY=sk-ant-...
├── .env.example
├── index.html
├── vite.config.js
├── tailwind.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── agent/
│   │   ├── pulseAgent.js      ← core agent logic, tool calling loop
│   │   ├── tools.js           ← tool definitions and mock implementations
│   │   └── prompts.js         ← system prompt and output format instructions
│   ├── data/
│   │   └── experiments.json   ← mock past Glovo experiments knowledge base
│   ├── components/
│   │   ├── ProblemInput.jsx   ← the text input + Run button
│   │   ├── AgentSteps.jsx     ← live reasoning steps with status indicators
│   │   ├── OutputBrief.jsx    ← ranked levers + confidence + flags
│   │   └── TopBar.jsx         ← Pulse branding bar
│   └── index.css
```

---

## The agent system prompt

The system prompt lives in `src/agent/prompts.js`. Key instructions for the agent:

```
You are Pulse, a growth intelligence agent for Glovo's Growth Analytics team.

Your job: when given a growth problem, autonomously research and produce a structured experiment recommendation brief.

You have access to these tools:
- web_search: search for competitor signals, market news, pricing changes
- search_app_reviews: get app store sentiment for a specific market and app
- get_past_experiments: retrieve analogous experiments from Glovo's knowledge base
- apply_rice_framework: score a set of experiment candidates using RICE

Process:
1. Parse the problem — extract market, metric, levers
2. Identify what evidence you need
3. Call tools to gather it. If you discover new gaps while researching, call more tools.
4. Apply RICE scoring to rank candidate experiments
5. Self-critique: for each recommendation, rate your confidence (0-100). If below 70%, explain why and what data would raise it.
6. Output a structured JSON brief (schema below)

Output schema:
{
  "problem_parsed": { "market": "", "metric": "", "levers": [] },
  "research_steps": [ { "tool": "", "query": "", "finding": "" } ],
  "recommendations": [
    {
      "rank": 1,
      "experiment": "",
      "rationale": "",
      "evidence": "",
      "rice_score": 0,
      "confidence": 0,
      "confidence_note": ""
    }
  ],
  "flags": [ { "type": "low_confidence|stale_data|missing_evidence", "message": "" } ]
}

Always output valid JSON. Never truncate.
```

---

## Mock experiments knowledge base

`src/data/experiments.json` — a set of 10–15 realistic Glovo-style past experiments the agent can retrieve:

```json
[
  {
    "id": "exp_001",
    "name": "Loyalty cashback for churned users",
    "market": "Rome",
    "metric": "retention",
    "lever": "loyalty",
    "result": "+11% retention recovery in 3 weeks",
    "uplift": 11,
    "effort": "medium",
    "notes": "Targeted users with 0 orders in 14 days. 15% cashback on next 3 orders."
  },
  {
    "id": "exp_002",
    "name": "Dynamic delivery fee by time slot",
    "market": "Lisbon",
    "metric": "order_frequency",
    "lever": "pricing",
    "result": "+7% uplift in off-peak orders",
    "uplift": 7,
    "effort": "high",
    "notes": "Reduced fee by 30% in 14:00-17:00 window. Required pricing infra changes."
  },
  {
    "id": "exp_003",
    "name": "Win-back CRM sequence day 7 + 14",
    "market": "Global",
    "metric": "retention",
    "lever": "crm",
    "result": "18% of at-risk users recovered",
    "uplift": 18,
    "effort": "low",
    "notes": "Day 7 push notification, day 14 email with discount code. Automated."
  },
  {
    "id": "exp_004",
    "name": "Free delivery for first 3 orders new users",
    "market": "Warsaw",
    "metric": "activation",
    "lever": "promotions",
    "result": "+23% D7 retention vs control",
    "uplift": 23,
    "effort": "low",
    "notes": "Acquisition focused but strong downstream retention signal."
  },
  {
    "id": "exp_005",
    "name": "Restaurant partner badge (top rated)",
    "market": "Barcelona",
    "metric": "conversion",
    "lever": "product",
    "result": "+4% CVR on badged partners",
    "uplift": 4,
    "effort": "low",
    "notes": "Social proof signal. Small but consistent uplift across cohorts."
  }
]
```

---

## Demo scenario (memorise this)

**Input:** "Retention is dropping in Madrid (-8% WoW). We need to decide which experiment to run next across pricing, promotions, or CRM."

**Expected agent behaviour:**
1. Parses: market=Madrid, metric=retention, levers=[pricing, promotions, CRM]
2. Calls `get_past_experiments` → finds exp_001 (Rome cashback), exp_003 (CRM win-back)
3. Calls `web_search("Glovo competitor pricing Madrid 2025")` → finds Uber Eats and Bolt Food signals
4. Calls `search_app_reviews("Glovo Madrid")` → finds delivery cost complaints
5. Calls `apply_rice_framework` with 3 candidates
6. Self-critiques: flags that Madrid pricing elasticity data may be stale
7. Outputs ranked brief: #1 cashback, #2 dynamic pricing, #3 CRM sequence

**The classroom moment:** Analyst hits Run, watches 5 steps animate with real findings, brief appears. Agent flags its own uncertainty on lever #2. That flag is the detail that impresses the professors.

---

## Syllabus deliverables checklist

This prototype satisfies the ESADE DPM course requirements:

- [x] **Persona** — Catalina R., Senior Growth Analyst, Glovo Barcelona
- [x] **Digital solution description** — Pulse agent brief above
- [x] **Prototype illustration** — working React app with real API calls
- [x] **Product roadmap** — 3 horizons: single-problem intelligence → memory + market coverage → experiment lifecycle integration
- [x] **Live demo** — input a problem, watch agent reason, get brief (Session 9)

---

## Build order for Claude Code

Work in this sequence:

1. Scaffold the Vite + React project, install dependencies
2. Build `experiments.json` mock data
3. Build `tools.js` — mock implementations of all 4 tools
4. Build `prompts.js` — system prompt and output schema
5. Build `pulseAgent.js` — the agentic loop with tool calling
6. Build UI components: `TopBar`, `ProblemInput`, `AgentSteps`, `OutputBrief`
7. Wire everything in `App.jsx`
8. Test with the demo scenario
9. Polish: loading states, error handling, confidence bar visualisation

---

## Important constraints

- Keep the UI minimal and professional — Glovo orange (#FF6B35) as accent only, mostly neutral palette
- The agent reasoning steps must animate sequentially as they complete — this is the core demo UX
- Each step in `AgentSteps` must show: step name, what it did, key finding (one line)
- Confidence scores render as a coloured progress bar (green >75%, amber 50-75%, red <50%)
- Low-confidence flags render in a distinct warning block below the recommendations
- The "Share with VP" button can be a no-op for MVP but must exist in the UI
- Mobile layout is not a priority — optimise for a laptop screen demo
- No auth, no database, no deployment needed — this runs locally for the demo
