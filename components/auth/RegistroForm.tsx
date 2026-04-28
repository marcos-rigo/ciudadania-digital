'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserPlus, User, Mail, Key, Eye, EyeOff, Send } from 'lucide-react'

export function RegistroForm() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [showPwd2, setShowPwd2] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre || !email || !password || !password2) { setError('Completá todos los campos.'); return }
    if (password !== password2) { setError('Las contraseñas no coinciden.'); return }
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.trim(), email: email.trim().toLowerCase(), password }),
      })
      const data = await res.json()
      if (!data.ok) { setError(data.error || 'Error al registrar.'); return }
      router.push(`/verificar?email=${encodeURIComponent(email.trim().toLowerCase())}`)
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
          <UserPlus className="text-white w-7 h-7" />
        </div>
        <h2 className="text-[#1A2A36] text-xl font-black">Crear cuenta</h2>
        <p className="text-[#64748b] text-xs mt-1">Completá tus datos para solicitar acceso</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Nombre completo', value: nombre, set: setNombre, icon: User, type: 'text', placeholder: 'Tu nombre y apellido' },
          { label: 'Correo electrónico', value: email, set: setEmail, icon: Mail, type: 'email', placeholder: 'tu@correo.com' },
        ].map(({ label, value, set, icon: Icon, type, placeholder }) => (
          <div key={label}>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">{label}</label>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] w-4 h-4 pointer-events-none" />
              <input
                type={type}
                value={value}
                onChange={e => set(e.target.value)}
                placeholder={placeholder}
                className="w-full py-3 pl-10 pr-4 border border-[#e2e8f0] rounded-[10px] text-sm text-[#1A2A36] bg-white outline-none focus:border-[#4272bb] focus:ring-2 focus:ring-[#4272bb]/20 transition-all"
              />
            </div>
          </div>
        ))}

        {[
          { label: 'Contraseña', value: password, set: setPassword, show: showPwd, toggle: () => setShowPwd(!showPwd), placeholder: 'Mínimo 8 caracteres' },
          { label: 'Repetir contraseña', value: password2, set: setPassword2, show: showPwd2, toggle: () => setShowPwd2(!showPwd2), placeholder: 'Repetí tu contraseña' },
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
                className="w-full py-3 pl-10 pr-10 border border-[#e2e8f0] rounded-[10px] text-sm text-[#1A2A36] bg-white outline-none focus:border-[#4272bb] focus:ring-2 focus:ring-[#4272bb]/20 transition-all"
              />
              <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#4272bb] transition-colors">
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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#4272bb] hover:bg-[#2d5a9e] text-white font-bold rounded-[10px] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(66,114,187,.3)] transition-all disabled:bg-[#94a3b8] disabled:cursor-not-allowed mt-1"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              Solicitar acceso
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-[#64748b] mt-6">
        ¿Ya tenés cuenta?{' '}
        <Link href="/login" className="text-[#4272bb] font-semibold hover:underline">
          Iniciá sesión
        </Link>
      </p>
    </>
  )
}
