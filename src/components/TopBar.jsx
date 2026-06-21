import { useNavigate } from 'react-router-dom'

export default function TopBar() {
  const navigate = useNavigate()

  return (
    <header className="bg-[#0D1117] border-b border-white/[0.06] sticky top-0 z-10">
      <div className="w-full px-6 py-4 flex items-center justify-start gap-4">
        <img
          src="/glovo-logo.png"
          alt="Glovo"
          className="h-7 w-auto cursor-pointer"
          onClick={() => navigate('/')}
        />
        <div className="w-px h-6 bg-white/10" />
        <div className="flex flex-col leading-tight">
          <span className="text-white font-extrabold text-lg tracking-tight">Pulse</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#00A082' }}>Growth Intelligence Partner</span>
        </div>
      </div>
    </header>
  )
}
