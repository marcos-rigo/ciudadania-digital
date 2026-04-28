'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Mail, Key, Eye, EyeOff, LogIn } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setError('Completá email y contraseña.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      })
      const data = await res.json()
      if (data.pendiente) { router.push('/pendiente'); return }
      if (data.verificar) { router.push(`/verificar?email=${encodeURIComponent(email.trim().toLowerCase())}`); return }
      if (!data.ok) { setError(data.error || 'Email o contraseña incorrectos.'); return }
      router.push(data.rol === 'admin' ? '/dashboard/admin' : '/dashboard/estadisticas')
    } catch {
      setError('Error de conexión. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="text-center mb-7">
        <div className="w-14 h-14 bg-[#4272bb] rounded-[14px] flex items-center justify-center mx-auto mb-3">
          <Lock className="text-white w-7 h-7" />
        </div>
        <h2 className="text-[#1A2A36] text-xl font-black">Iniciá sesión</h2>
        <p className="text-[#64748b] text-xs mt-1">Secretaría de Participación Ciudadana</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">Correo electrónico</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] w-4 h-4 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              autoComplete="email"
              className="w-full py-3 pl-10 pr-4 border border-[#e2e8f0] rounded-[10px] text-sm text-[#1A2A36] bg-white outline-none focus:border-[#4272bb] focus:ring-2 focus:ring-[#4272bb]/20 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">Contraseña</label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] w-4 h-4 pointer-events-none" />
            <input
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••"
              autoComplete="current-password"
              className="w-full py-3 pl-10 pr-10 border border-[#e2e8f0] rounded-[10px] text-sm text-[#1A2A36] bg-white outline-none focus:border-[#4272bb] focus:ring-2 focus:ring-[#4272bb]/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#4272bb] transition-colors"
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="text-right mt-1.5">
            <Link href="/reset" className="text-xs font-semibold text-[#4272bb] hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-4 py-2.5 text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#4272bb] hover:bg-[#2d5a9e] text-white font-bold rounded-[10px] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(66,114,187,.3)] hover:shadow-[0_6px_18px_rgba(66,114,187,.35)] transition-all disabled:bg-[#94a3b8] disabled:cursor-not-allowed mt-1"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Ingresar
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-[#64748b] mt-6">
        ¿No tenés cuenta?{' '}
        <Link href="/registro" className="text-[#4272bb] font-semibold hover:underline">
          Registrate
        </Link>
      </p>
    </>
  )
}
