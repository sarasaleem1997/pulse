import { useState } from 'react'
import TopBar from './components/TopBar'
import ProblemInput from './components/ProblemInput'
import AgentSteps from './components/AgentSteps'
import OutputBrief from './components/OutputBrief'
import { runPulseAgent } from './agent/pulseAgent'

export default function App() {
  const [status, setStatus] = useState('idle')
  const [steps, setSteps] = useState([])
  const [brief, setBrief] = useState(null)
  const [error, setError] = useState(null)

  const updateStep = (step) => {
    setSteps((prev) => {
      const idx = prev.findIndex((s) => s.id === step.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], ...step }
        return next
      }
      return [...prev, step]
    })
  }

  const handleRun = async (problem) => {
    setStatus('running')
    setSteps([])
    setBrief(null)
    setError(null)

    await runPulseAgent({
      problem,
      onStep: updateStep,
      onComplete: (result) => {
        setBrief(result)
        setStatus('done')
      },
      onError: (err) => {
        setError(err.message || 'Something went wrong. Check the browser console for details.')
        setStatus('error')
      },
    })
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="max-w-2xl mx-auto px-6 pt-10 pb-24 space-y-4">

        <div className="animate-step-in">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Growth Problem Analyser</h1>
          <p className="text-sm text-gray-400 mt-1">
            Describe a growth challenge — Pulse will research, score, and produce a VP-ready experiment brief.
          </p>
        </div>

        <ProblemInput onRun={handleRun} isRunning={status === 'running'} />

        {steps.length > 0 && <AgentSteps steps={steps} />}

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-sm text-red-700 animate-step-in">
            <span className="font-semibold">Error: </span>{error}
          </div>
        )}

        {brief && <OutputBrief brief={brief} />}
      </main>
    </div>
  )
}
