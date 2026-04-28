'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { KeyRound, Mail, Send } from 'lucide-react'

export function ResetForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) { setError('Ingresá tu email.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      const data = await res.json()
      if (!data.ok) { setError(data.error || 'Error al enviar el código.'); return }
      router.push(`/reset/nueva?email=${encodeURIComponent(email.trim().toLowerCase())}`)
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
          <KeyRound className="text-white w-7 h-7" />
        </div>
        <h2 className="text-[#1A2A36] text-xl font-black">Recuperar contraseña</h2>
        <p className="text-[#64748b] text-xs mt-1">Ingresá tu email y te enviamos un código</p>
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
              className="w-full py-3 pl-10 pr-4 border border-[#e2e8f0] rounded-[10px] text-sm text-[#1A2A36] bg-white outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 transition-all"
            />
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
          className="w-full py-3 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold rounded-[10px] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(99,102,241,.3)] transition-all disabled:bg-[#94a3b8] disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              Enviar código
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
