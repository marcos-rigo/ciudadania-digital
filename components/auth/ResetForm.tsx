'use client'
import { useState } from 'react'
import Link from 'next/link'
import { KeyRound, Mail, Send, CheckCircle2 } from 'lucide-react'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/

export function ResetForm() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [sent, setSent]       = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const v = email.trim().toLowerCase()
    if (!v) { setError('Ingresá tu correo electrónico.'); return }
    if (!EMAIL_REGEX.test(v)) { setError('Ingresá un correo electrónico válido.'); return }

    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: v }),
      })
      const data = await res.json()
      if (!data.ok) { setError(data.error || 'Error al enviar la solicitud.'); return }
      setSent(true)
    } catch {
      setError('Error de conexión. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <>
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-green-100 rounded-[14px] flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="text-green-600 w-7 h-7" />
          </div>
          <h2 className="text-[#1A2A36] text-xl font-black">Solicitud enviada</h2>
          <p className="text-[#64748b] text-sm mt-2 leading-relaxed">
            Tu solicitud fue recibida. El administrador del sistema te enviará la nueva contraseña a tu correo electrónico a la brevedad.
          </p>
        </div>
        <Link
          href="/login"
          className="block w-full py-3 text-center bg-[#4272bb] hover:bg-[#2d5a9e] text-white font-bold rounded-[10px] transition-all text-sm"
        >
          Volver al login
        </Link>
      </>
    )
  }

  return (
    <>
      <div className="text-center mb-7">
        <div className="w-14 h-14 bg-[#6366f1] rounded-[14px] flex items-center justify-center mx-auto mb-3">
          <KeyRound className="text-white w-7 h-7" />
        </div>
        <h2 className="text-[#1A2A36] text-xl font-black">Recuperar contraseña</h2>
        <p className="text-[#64748b] text-xs mt-1">
          Ingresá tu email y el administrador te enviará una nueva contraseña
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            Correo electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] w-4 h-4 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value.toLowerCase().replace(/\s/g, ''))}
              placeholder="usuario@dominio.com"
              autoComplete="email"
              inputMode="email"
              className="w-full py-3 pl-10 pr-4 border border-[#e2e8f0] rounded-[10px] text-sm text-[#1A2A36] bg-white outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 transition-all"
            />
          </div>
          {error && (
            <p className="mt-1.5 text-xs text-red-500">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold rounded-[10px] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(99,102,241,.3)] transition-all disabled:bg-[#94a3b8] disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              Enviar solicitud
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
