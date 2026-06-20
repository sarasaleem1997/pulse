export default function TopBar() {
  return (
    <header className="bg-[#0D1117] border-b border-white/[0.06] sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#d94f1a] flex items-center justify-center flex-shrink-0 shadow-sm shadow-[#FF6B35]/40">
            <span className="text-white font-black text-[11px] select-none">P</span>
          </div>
          <span className="text-white font-bold tracking-tight text-[15px]">Pulse</span>
          <span className="text-white/15 mx-0.5">·</span>
          <span className="text-white/35 text-xs font-medium">Growth Intelligence</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            style={{ boxShadow: '0 0 5px #34d399, 0 0 10px #34d39960' }}
          />
          <span className="text-white/25 text-[11px] font-mono tracking-wide">Glovo HQ</span>
        </div>
      </div>
    </header>
  )
}
