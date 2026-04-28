'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LockOpen, Hash, Key, Eye, EyeOff, Check } from 'lucide-react'

export function ResetNuevaForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [codigo, setCodigo] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [showPwd2, setShowPwd2] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!codigo || !password || !password2) { setError('Completá todos los campos.'); return }
    if (password.length < 8) { setError('Mínimo 8 caracteres.'); return }
    if (password !== password2) { setError('Las contraseñas no coinciden.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, codigo: codigo.trim(), nuevaPassword: password }),
      })
      const data = await res.json()
      if (!data.ok) { setError(data.error || 'Error al cambiar contraseña.'); return }
      setSuccess('Contraseña actualizada. Ya podés iniciar sesión.')
      setTimeout(() => router.push('/login'), 2000)
    } catch {
      setError('Error de conexión. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="text-center mb-7">
        <div className="w-14 h-14 bg-[#6366f1] rounded-[14px] flex items-center justify-center mx-auto mb-3">
          <LockOpen className="text-white w-7 h-7" />
        </div>
        <h2 className="text-[#1A2A36] text-xl font-black">Nueva contraseña</h2>
        <p className="text-[#64748b] text-xs mt-1">Ingresá el código recibido y tu nueva contraseña</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">Código de verificación</label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] w-4 h-4 pointer-events-none" />
            <input
              type="text"
              value={codigo}
              onChange={e => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              maxLength={6}
              className="w-full py-3 pl-10 pr-4 border border-[#e2e8f0] rounded-[10px] text-sm text-[#1A2A36] bg-white outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 transition-all tracking-widest font-bold"
            />
          </div>
        </div>

        {[
          { label: 'Nueva contraseña', value: password, set: setPassword, show: showPwd, toggle: () => setShowPwd(!showPwd), placeholder: 'Mínimo 8 caracteres' },
          { label: 'Repetir nueva contraseña', value: password2, set: setPassword2, show: showPwd2, toggle: () => setShowPwd2(!showPwd2), placeholder: 'Repetí la contraseña' },
        ].map(({ label, value, set, show, toggle, placeholder }) => (
          <div key={label}>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">{label}</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] w-4 h-4 pointer-events-none" />
              <input
                type={show ? 'text' : 'password'}
                value={value}
                onChange={e => set(e.target.value)}
                placeholder={placeholder}
                className="w-full py-3 pl-10 pr-10 border border-[#e2e8f0] rounded-[10px] text-sm text-[#1A2A36] bg-white outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 transition-all"
              />
              <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#6366f1] transition-colors">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-4 py-2.5 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg px-4 py-2.5 text-center">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold rounded-[10px] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(99,102,241,.3)] transition-all disabled:bg-[#94a3b8] disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Check className="w-4 h-4" />
              Cambiar contraseña
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-[#64748b] mt-6">
        <Link href="/login" className="text-[#4272bb] font-semibold hover:underline">
          ← Volver al login
        </Link>
      </p>
    </>
  )
}
