import { useState } from 'react'

const DEMO_PROBLEM =
  'Retention is dropping in Madrid (-8% WoW). We need to decide which experiment to run next across pricing, promotions, or CRM.'

export default function ProblemInput({ onRun, isRunning }) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)

  const handleRun = () => {
    if (value.trim() && !isRunning) onRun(value.trim())
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleRun()
  }

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 ${
        focused
          ? 'border-[#FF6B35]/50 shadow-[0_0_0_3px_rgba(255,107,53,0.1)]'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="px-5 pt-5 pb-4">
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.13em] mb-3">
          Growth Problem
        </label>
        <textarea
          className="w-full h-[100px] resize-none bg-transparent text-[15px] text-gray-800 placeholder-gray-300 focus:outline-none leading-relaxed"
          placeholder={`e.g. "${DEMO_PROBLEM}"`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={isRunning}
        />
      </div>
      <div className="px-5 py-3.5 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
        <button
          className="text-xs text-gray-400 hover:text-[#FF6B35] transition-colors disabled:pointer-events-none font-medium"
          onClick={() => setValue(DEMO_PROBLEM)}
          disabled={isRunning}
          type="button"
        >
          Try demo scenario →
        </button>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-gray-300 hidden sm:block font-mono">⌘↵</span>
          <button
            onClick={handleRun}
            disabled={!value.trim() || isRunning}
            type="button"
            className="px-5 py-2 bg-[#FF6B35] hover:bg-[#e55c28] active:scale-[0.97] text-white text-sm font-bold rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm shadow-[#FF6B35]/20"
          >
            {isRunning ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Running…
              </>
            ) : (
              'Run Pulse'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
