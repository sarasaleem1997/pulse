import { useState } from 'react'
import TopBar from './components/TopBar'
import ProblemInput from './components/ProblemInput'
import AgentSteps from './components/AgentSteps'
import OutputBrief from './components/OutputBrief'
import { runPulseAgent } from './agent/pulseAgent'

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-10">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ backgroundColor: '#00A082' + '1a' }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00A082" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      </div>
      <p className="text-gray-800 font-semibold text-base mb-2">Your experiment brief will appear here</p>
      <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
        Describe a problem on the left and click Run Pulse. Pulse will research, score, and rank the best experiments for you.
      </p>
    </div>
  )
}

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

  const handleReset = () => {
    setStatus('idle')
    setSteps([])
    setBrief(null)
    setError(null)
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
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar />

      <div className="flex flex-1 overflow-hidden">

        {/* Left panel — input */}
        <div className="w-1/2 border-r border-gray-200 flex flex-col overflow-hidden">

          {/* Fixed: description + input */}
          <div className="p-6 flex flex-col gap-4 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-700">
              Describe any growth challenge across retention, acquisition, activation, engagement, or monetisation. Pulse will research, score, and produce a VP-ready experiment brief.
            </p>
            <ProblemInput onRun={handleRun} isRunning={status === 'running'} />
          </div>

          {/* Scrollable: agent steps + errors */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            {steps.length > 0 && <AgentSteps steps={steps} />}
            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-sm text-red-700 animate-step-in">
                <span className="font-semibold">Error: </span>{error}
              </div>
            )}
          </div>

        </div>

        {/* Right panel — output */}
        <div className="w-1/2 flex flex-col overflow-y-auto">
          {brief ? (
            <div className="p-6 flex flex-col gap-4">
              <OutputBrief brief={brief} />
              {status === 'done' && (
                <div className="flex justify-center pt-2 pb-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
                  >
                    ← Run another problem
                  </button>
                </div>
              )}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

      </div>
    </div>
  )
}
