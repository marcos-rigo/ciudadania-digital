'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MailOpen, Check } from 'lucide-react'

export function VerificarForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [slots, setSlots] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [cooldown, setCooldown] = useState(0)

  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null))

  function handleChange(i: number, val: string) {
    const digit = val.replace(/\D/g, '').slice(-1)
    const next = [...slots]
    next[i] = digit
    setSlots(next)
    if (digit && i < 5) refs[i + 1].current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent, i: number) {
    if (e.key === 'Backspace' && !slots[i] && i > 0) refs[i - 1].current?.focus()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const codigo = slots.join('')
    if (codigo.length < 6) { setError('Ingresá los 6 dígitos.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/verificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, codigo }),
      })
      const data = await res.json()
      if (!data.ok) {
        setError(data.error || 'Error al verificar.')
        setSlots(['', '', '', '', '', ''])
        refs[0].current?.focus()
        return
      }
      router.push('/pendiente')
    } catch {
      setError('Error de conexión.')
    } finally {
      setLoading(false)
    }
  }

  async function handleReenviar() {
    if (cooldown > 0) return
    setSlots(['', '', '', '', '', ''])
    setError('')
    setSuccess('')
    try {
      await fetch('/api/auth/reenviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSuccess('Código reenviado. Revisá tu email.')
      setCooldown(60)
    } catch {
      setError('Error al reenviar.')
    }
  }

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setInterval(() => setCooldown(c => (c <= 1 ? (clearInterval(t), 0) : c - 1)), 1000)
    return () => clearInterval(t)
  }, [cooldown])

  return (
    <>
      <div className="text-center mb-7">
        <div className="w-14 h-14 bg-[#4272bb] rounded-[14px] flex items-center justify-center mx-auto mb-3">
          <MailOpen className="text-white w-7 h-7" />
        </div>
        <h2 className="text-[#1A2A36] text-xl font-black">Verificá tu email</h2>
        <p className="text-[#64748b] text-xs mt-1">
          {email ? `Enviamos un código a ${email}` : 'Ingresá el código de 6 dígitos que enviamos'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 justify-center mb-5">
          {slots.map((slot, i) => (
            <input
              key={i}
              ref={refs[i]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={slot}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(e, i)}
              className="w-11 h-14 text-center text-2xl font-black text-[#1A2A36] border-2 border-[#e2e8f0] rounded-[10px] bg-white outline-none focus:border-[#4272bb] focus:ring-2 focus:ring-[#4272bb]/20 transition-all"
            />
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-4 py-2.5 text-center mb-3">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg px-4 py-2.5 text-center mb-3">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#4272bb] hover:bg-[#2d5a9e] text-white font-bold rounded-[10px] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(66,114,187,.3)] transition-all disabled:bg-[#94a3b8] disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Check className="w-4 h-4" />
              Verificar código
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-[#64748b] mt-4">
        ¿No recibiste el código?{' '}
        <button
          onClick={handleReenviar}
          disabled={cooldown > 0}
          className="text-[#4272bb] font-semibold hover:underline disabled:text-[#94a3b8] disabled:cursor-not-allowed"
        >
          {cooldown > 0 ? `Reenviar (${cooldown}s)` : 'Reenviar'}
        </button>
      </p>
      <p className="text-center text-xs text-[#64748b] mt-3">
        <Link href="/login" className="text-[#4272bb] font-semibold hover:underline">
          ← Volver al login
        </Link>
      </p>
    </>
  )
}
