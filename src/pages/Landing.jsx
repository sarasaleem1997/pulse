import { useNavigate } from 'react-router-dom'

const FEATURES = ['RICE Scoring', 'App Review Analysis', 'Competitor Intel', 'Past Experiment Search', 'VP-Ready Brief']

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(#ffffff07 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center top, rgba(255,107,53,0.18) 0%, transparent 65%)',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">

        {/* Logo mark */}
        <img src="/glovo-logo.png" alt="Glovo" className="h-12 w-auto mb-8" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#00A082] bg-[#00A082]/10 border border-[#00A082]/20 px-3.5 py-1.5 rounded-full mb-6 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#FFC244' }} />
          Growth Intelligence Partner
        </div>

        {/* Headline */}
        <h1 className="text-[3rem] font-extrabold text-white tracking-tight leading-[1.1] mb-5 whitespace-nowrap">
          Your AI-powered growth analyst
        </h1>

        {/* Subtext */}
        <p className="text-lg text-white/40 leading-relaxed mb-10">
          Tell Pulse what you're trying to solve. It researches, scores, and recommends the right experiment so you can move fast.
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate('/app')}
          className="group px-8 py-3.5 bg-[#00A082] hover:bg-[#00876e] active:scale-[0.97] text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-[#00A082]/25 hover:shadow-xl hover:shadow-[#00A082]/40 flex items-center gap-2.5"
        >
          Launch Pulse
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </button>

        {/* Feature pills */}
        <div className="flex items-center gap-2 mt-12 flex-wrap justify-center">
          {FEATURES.map((f) => (
            <span
              key={f}
              className="text-[11px] text-white/25 bg-white/[0.04] border border-white/[0.07] px-3 py-1.5 rounded-full font-medium"
            >
              {f}
            </span>
          ))}
        </div>
      </div>

    </div>
  )
}
