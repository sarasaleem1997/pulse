function ConfidenceBar({ value }) {
  const isHigh = value > 75
  const isMid = value >= 50 && value <= 75
  const barColor = isHigh ? 'bg-emerald-500' : isMid ? 'bg-amber-400' : 'bg-red-400'
  const textColor = isHigh ? 'text-emerald-600' : isMid ? 'text-amber-600' : 'text-red-500'

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-1000 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      <span className={`text-[11px] font-bold tabular-nums ${textColor}`}>{value}%</span>
    </div>
  )
}

function RankBadge({ rank }) {
  if (rank === 1) {
    return (
      <div className="flex-shrink-0 flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-[#FF6B35] text-white shadow-md shadow-[#FF6B35]/30">
        <span className="text-[9px] font-bold opacity-60 leading-none">#</span>
        <span className="text-xl font-black leading-none">{rank}</span>
      </div>
    )
  }
  if (rank === 2) {
    return (
      <div className="flex-shrink-0 flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-gray-800 text-white">
        <span className="text-[9px] font-bold opacity-40 leading-none">#</span>
        <span className="text-xl font-black leading-none">{rank}</span>
      </div>
    )
  }
  return (
    <div className="flex-shrink-0 flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-gray-100 text-gray-500">
      <span className="text-[9px] font-bold opacity-60 leading-none">#</span>
      <span className="text-xl font-black leading-none">{rank}</span>
    </div>
  )
}

function RecommendationCard({ rec }) {
  const isTop = rec.rank === 1
  const isLowConfidence = rec.confidence < 70

  return (
    <div
      className={`rounded-2xl border p-5 transition-all ${
        isTop
          ? 'border-[#FF6B35]/25 bg-gradient-to-br from-[#FF6B35]/[0.04] to-white shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-4">
        <RankBadge rank={rec.rank} />

        <div className="flex-1 min-w-0">
          <h3
            className={`font-bold leading-snug ${
              isTop ? 'text-[16px] text-gray-900' : 'text-[15px] text-gray-800'
            }`}
          >
            {rec.experiment}
          </h3>
          <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{rec.rationale}</p>
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed italic">{rec.evidence}</p>

          <div className="mt-4 flex items-end gap-8">
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.13em] mb-1">RICE Score</p>
              <p
                className={`font-black tabular-nums leading-none ${
                  isTop ? 'text-[2.75rem] text-[#FF6B35]' : 'text-[1.75rem] text-gray-700'
                }`}
              >
                {rec.rice_score}
              </p>
            </div>
            <div className="flex-1 pb-1">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.13em] mb-2">Confidence</p>
              <ConfidenceBar value={rec.confidence} />
            </div>
          </div>

          {isLowConfidence && rec.confidence_note && (
            <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
              <span className="text-amber-400 flex-shrink-0 text-sm">⚠</span>
              <p className="text-xs text-amber-700 leading-relaxed">{rec.confidence_note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const FLAG_STYLES = {
  low_confidence: 'text-amber-700 bg-amber-50 border-amber-200',
  stale_data: 'text-orange-700 bg-orange-50 border-orange-200',
  missing_evidence: 'text-red-700 bg-red-50 border-red-200',
}

export default function OutputBrief({ brief }) {
  if (!brief) return null

  const { problem_parsed, recommendations = [], flags = [] } = brief
  const levers = problem_parsed?.levers?.join(' · ') || ''

  return (
    <div className="mt-4 space-y-3 animate-brief-in">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.13em] mb-2">
            Experiment Brief
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {problem_parsed?.market && (
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-[#FF6B35]/10 text-[#FF6B35] rounded-full font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
                {problem_parsed.market}
              </span>
            )}
            {problem_parsed?.metric && (
              <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                {problem_parsed.metric}
              </span>
            )}
            {levers && (
              <span className="text-xs text-gray-400 font-medium">{levers}</span>
            )}
          </div>
        </div>
        <button
          type="button"
          className="flex-shrink-0 text-xs font-bold text-gray-600 border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 transition-all"
        >
          Share with VP ↗
        </button>
      </div>

      <div className="space-y-2.5">
        {recommendations.map((rec) => (
          <RecommendationCard key={rec.rank} rec={rec} />
        ))}
      </div>

      {flags.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.13em] mb-3">
            Agent Flags
          </p>
          <ul className="space-y-2">
            {flags.map((flag, i) => (
              <li
                key={i}
                className={`flex items-start gap-2 text-xs px-3 py-2.5 rounded-xl border ${
                  FLAG_STYLES[flag.type] || 'text-gray-700 bg-gray-50 border-gray-200'
                }`}
              >
                <span className="mt-px flex-shrink-0">⚠</span>
                <span className="leading-relaxed">{flag.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
