import { useNavigate } from 'react-router-dom'

const FEATURES = ['RICE Scoring', 'App Review Analysis', 'Competitor Intel', 'VP-Ready Brief']

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
      <div className="relative z-10 flex flex-col items-center text-center max-w-md">

        {/* Logo mark */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#d94f1a] flex items-center justify-center shadow-2xl shadow-[#FF6B35]/30 mb-8">
          <span className="text-white font-black text-3xl select-none leading-none">P</span>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#FF6B35] bg-[#FF6B35]/10 border border-[#FF6B35]/20 px-3.5 py-1.5 rounded-full mb-6 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
          Growth Intelligence · Glovo
        </div>

        {/* Headline */}
        <h1 className="text-[3.25rem] font-extrabold text-white tracking-tight leading-[1.1] mb-5">
          Your growth analyst,<br />on demand.
        </h1>

        {/* Subtext */}
        <p className="text-base text-white/40 leading-relaxed mb-10 max-w-[340px]">
          Describe a retention or growth problem. Pulse researches past experiments, competitor signals, and app sentiment — then produces a VP-ready brief in seconds.
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate('/app')}
          className="group px-8 py-3.5 bg-[#FF6B35] hover:bg-[#e55c28] active:scale-[0.97] text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-[#FF6B35]/25 hover:shadow-xl hover:shadow-[#FF6B35]/40 flex items-center gap-2.5"
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

      {/* Bottom status bar */}
      <div className="absolute bottom-6 flex items-center gap-2">
        <div
          className="w-1.5 h-1.5 rounded-full bg-emerald-400"
          style={{ boxShadow: '0 0 5px #34d399, 0 0 10px #34d39950' }}
        />
        <span className="text-white/20 text-[11px] font-mono tracking-wide">Glovo HQ · Barcelona</span>
      </div>
    </div>
  )
}
