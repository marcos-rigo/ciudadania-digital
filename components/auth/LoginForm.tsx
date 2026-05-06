'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Mail, Key, Eye, EyeOff, LogIn } from 'lucide-react'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/

function validateEmail(value: string): string {
  const v = value.trim()
  if (!v) return 'El correo electrónico es obligatorio.'
  if (!EMAIL_REGEX.test(v)) return 'Ingresá un correo electrónico válido (ej: usuario@dominio.com).'
  return ''
}

function validatePassword(value: string): string {
  if (!value) return 'La contraseña es obligatoria.'
  if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres.'
  if (/\s/.test(value)) return 'La contraseña no puede contener espacios.'
  return ''
}

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [apiError, setApiError] = useState('')

  const [emailError, setEmailError]       = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [touched, setTouched] = useState({ email: false, password: false })

  function handleEmailChange(v: string) {
    // Forzar minúsculas y sin espacios mientras escribe
    const clean = v.toLowerCase().replace(/\s/g, '')
    setEmail(clean)
    if (touched.email) setEmailError(validateEmail(clean))
    setApiError('')
  }

  function handlePasswordChange(v: string) {
    setPassword(v)
    if (touched.password) setPasswordError(validatePassword(v))
    setApiError('')
  }

  function handleEmailBlur() {
    setTouched((t) => ({ ...t, email: true }))
    setEmailError(validateEmail(email))
  }

  function handlePasswordBlur() {
    setTouched((t) => ({ ...t, password: true }))
    setPasswordError(validatePassword(password))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Validar todo antes de enviar
    const eErr = validateEmail(email)
    const pErr = validatePassword(password)
    setTouched({ email: true, password: true })
    setEmailError(eErr)
    setPasswordError(pErr)
    if (eErr || pErr) return

    setLoading(true)
    setApiError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      })
      const data = await res.json()
      if (data.pendiente) { router.push('/pendiente'); return }
      if (data.verificar) { router.push(`/verificar?email=${encodeURIComponent(email.trim().toLowerCase())}`); return }
      if (!data.ok) { setApiError(data.error || 'Email o contraseña incorrectos.'); return }
      if (data.rol === 'superadmin') router.push('/dashboard/admin/usuarios')
      else if (data.rol === 'empleado') router.push('/dashboard/admin')
      else router.push('/dashboard/estadisticas')
    } catch {
      setApiError('Error de conexión. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const emailInvalid    = touched.email    && !!emailError
  const passwordInvalid = touched.password && !!passwordError

  return (
    <>
      <div className="text-center mb-7">
        <div className="w-14 h-14 bg-[#4272bb] rounded-[14px] flex items-center justify-center mx-auto mb-3">
          <Lock className="text-white w-7 h-7" />
        </div>
        <h2 className="text-[#1A2A36] text-xl font-black">Iniciá sesión</h2>
        <p className="text-[#64748b] text-xs mt-1">Secretaría de Participación Ciudadana</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-[#374151] mb-1.5">
            Correo electrónico
          </label>
          <div className="relative">
            <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${emailInvalid ? 'text-red-400' : 'text-[#94a3b8]'}`} />
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={handleEmailBlur}
              placeholder="usuario@dominio.com"
              autoComplete="email"
              inputMode="email"
              className={`w-full py-3 pl-10 pr-4 border rounded-[10px] text-sm text-[#1A2A36] bg-white outline-none transition-all
                ${emailInvalid
                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-[#e2e8f0] focus:border-[#4272bb] focus:ring-2 focus:ring-[#4272bb]/20'
                }`}
            />
          </div>
          {emailInvalid && (
            <p className="mt-1.5 text-xs text-red-500">{emailError}</p>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label htmlFor="password" className="block text-xs font-semibold text-[#374151] mb-1.5">
            Contraseña
          </label>
          <div className="relative">
            <Key className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${passwordInvalid ? 'text-red-400' : 'text-[#94a3b8]'}`} />
            <input
              id="password"
              name="password"
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              onBlur={handlePasswordBlur}
              placeholder="••••••••••"
              autoComplete="current-password"
              className={`w-full py-3 pl-10 pr-10 border rounded-[10px] text-sm text-[#1A2A36] bg-white outline-none transition-all
                ${passwordInvalid
                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-[#e2e8f0] focus:border-[#4272bb] focus:ring-2 focus:ring-[#4272bb]/20'
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#4272bb] transition-colors"
              tabIndex={-1}
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {passwordInvalid && (
            <p className="mt-1.5 text-xs text-red-500">{passwordError}</p>
          )}
          <div className="text-right mt-1.5">
            <Link href="/reset" className="text-xs font-semibold text-[#4272bb] hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        {/* Error de API */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-4 py-2.5 text-center">
            {apiError}
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

    </>
  )
}
