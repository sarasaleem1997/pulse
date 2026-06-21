import { useState, useEffect, useRef } from 'react'

const SCENARIOS = [
  {
    label: 'Madrid retention',
    problem: 'Retention is dropping in Madrid (-8% WoW). We need to decide which experiment to run next across pricing, promotions, or CRM.',
  },
  {
    label: 'Rome acquisition',
    problem: 'New user acquisition in Rome is down 15% MoM. Competitor activity is increasing. What growth experiment should we prioritise across paid channels, referrals, or first-order promotions?',
  },
  {
    label: 'Warsaw basket size',
    problem: 'Average basket size in Warsaw has dropped from €22 to €18 over the last 6 weeks. We need to identify the best experiment to recover AOV across upselling, bundling, or threshold discounts.',
  },
]

export default function ProblemInput({ onRun, isRunning }) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [tipOpen, setTipOpen] = useState(false)
  const tipRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (tipRef.current && !tipRef.current.contains(e.target)) setTipOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleRun = () => {
    if (value.trim() && !isRunning) onRun(value.trim())
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleRun()
  }

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm transition-all duration-200 ${
        focused
          ? 'border-[#00A082]/50 shadow-[0_0_0_3px_rgba(255,107,53,0.1)]'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-1.5 mb-3">
          <label className="text-sm font-semibold text-gray-800">
            What's the problem?
          </label>
          <div className="relative" ref={tipRef}>
            <span
              className="text-[11px] text-gray-400 cursor-pointer select-none hover:text-gray-600"
              onClick={() => setTipOpen((o) => !o)}
            >ⓘ</span>
            {tipOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 bg-gray-900 text-white text-xs rounded-xl p-3.5 shadow-xl z-50 leading-relaxed">
                <p className="font-semibold mb-2 text-white">For the best results, include:</p>
                <ul className="space-y-1 text-white/70">
                  <li>· The metric affected <span className="text-white/40">(e.g. retention, AOV, conversion)</span></li>
                  <li>· The market or city <span className="text-white/40">(e.g. Madrid, Rome)</span></li>
                  <li>· The magnitude <span className="text-white/40">(e.g. -8% WoW)</span></li>
                  <li>· Levers you're considering <span className="text-white/40">(e.g. pricing, CRM, promotions)</span></li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <textarea
          className="w-full h-[100px] resize-none bg-transparent text-[15px] text-gray-800 placeholder-gray-300 focus:outline-none leading-relaxed"
          placeholder="Describe any growth challenge — retention, acquisition, activation, engagement, or monetisation…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={isRunning}
        />
      </div>
      <div className="px-5 py-3 bg-gray-50/70 border-t border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.13em] mb-2">Try a scenario</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {SCENARIOS.map((s) => (
            <button
              key={s.label}
              type="button"
              disabled={isRunning}
              onClick={() => setValue(s.problem)}
              className="text-xs text-gray-500 hover:text-[#00A082] hover:border-[#00A082]/40 border border-gray-200 bg-white rounded-lg px-3 py-1.5 font-medium transition-all disabled:pointer-events-none"
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleRun}
            disabled={!value.trim() || isRunning}
            type="button"
            className="px-5 py-2 bg-[#00A082] hover:bg-[#00876e] active:scale-[0.97] text-white text-sm font-bold rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm shadow-[#00A082]/20"
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
