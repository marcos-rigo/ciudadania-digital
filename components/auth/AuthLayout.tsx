export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #1A2A36 0%, #2d4a6e 60%, #4272bb 100%)' }}
    >
      <div className="w-full max-w-[440px] bg-white rounded-[20px] px-10 py-12 shadow-[0_24px_60px_rgba(0,0,0,.35)]">
        {children}
      </div>
    </div>
  )
}
