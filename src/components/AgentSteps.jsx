const TOOL_LABELS = {
  web_search: 'Web Search',
  search_app_reviews: 'App Reviews',
  get_past_experiments: 'Past Experiments',
  apply_rice_framework: 'RICE Scoring',
}

function StatusDot({ status }) {
  if (status === 'running') {
    return <div className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse flex-shrink-0 mt-[5px]" />
  }
  if (status === 'done') {
    return (
      <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 mt-[5px]"
        style={{ boxShadow: '0 0 4px #34d399' }}
      />
    )
  }
  return <div className="w-2 h-2 rounded-full border border-white/20 flex-shrink-0 mt-[5px]" />
}

function StepRow({ step }) {
  return (
    <div className="flex gap-3 py-2.5 border-b border-white/[0.05] last:border-0 animate-step-in">
      <StatusDot status={step.status} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[13px] font-semibold ${
              step.status === 'running' ? 'text-[#FF6B35]' : 'text-white/75'
            }`}
          >
            {step.name}
          </span>
          {step.tool && (
            <span className="text-[10px] px-2 py-0.5 bg-white/[0.06] text-white/35 rounded font-mono">
              {TOOL_LABELS[step.tool] || step.tool}
            </span>
          )}
        </div>

        {step.query && (
          <p className="text-[11px] text-white/25 mt-0.5 font-mono truncate">→ "{step.query}"</p>
        )}

        {step.status === 'running' && !step.finding && (
          <div className="flex items-center gap-1 mt-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1 h-1 rounded-full bg-white/20 animate-bounce"
                style={{ animationDelay: `${i * 160}ms`, animationDuration: '0.9s' }}
              />
            ))}
          </div>
        )}

        {step.finding && (
          <p className="text-[12px] text-white/40 mt-1 leading-relaxed">{step.finding}</p>
        )}
      </div>
    </div>
  )
}

export default function AgentSteps({ steps }) {
  if (!steps.length) return null

  return (
    <div className="mt-4 bg-[#0D1117] rounded-2xl border border-white/[0.06] p-5 animate-step-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
        </div>
        <span className="text-[10px] font-mono text-white/20 tracking-widest uppercase ml-1">agent reasoning</span>
      </div>
      <div>
        {steps.map((step) => (
          <StepRow key={step.id} step={step} />
        ))}
      </div>
    </div>
  )
}
