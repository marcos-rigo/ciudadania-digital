'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Mail, Key, Eye, EyeOff, LogIn, Sparkles } from 'lucide-react'

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
        <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-violet-500 rounded-[14px] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-cyan-500/20">
          <Sparkles className="text-white w-7 h-7" />
        </div>
        <h2 className="text-slate-100 text-xl font-black">Iniciá sesión</h2>
        <p className="text-slate-500 text-xs mt-1">Secretaría de Participación Ciudadana</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Correo electrónico
          </label>
          <div className="relative">
            <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${emailInvalid ? 'text-red-400' : 'text-slate-500'}`} />
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
              className={`w-full py-3 pl-10 pr-4 border rounded-[10px] text-sm bg-slate-900/50 text-slate-100 placeholder:text-slate-500 outline-none transition-all
                ${emailInvalid
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                }`}
            />
          </div>
          {emailInvalid && (
            <p className="mt-1.5 text-xs text-red-400">{emailError}</p>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label htmlFor="password" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Contraseña
          </label>
          <div className="relative">
            <Key className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${passwordInvalid ? 'text-red-400' : 'text-slate-500'}`} />
            <input
              id="password"
              name="password"
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              onBlur={handlePasswordBlur}
              placeholder="••••••••••"
              autoComplete="current-password"
              className={`w-full py-3 pl-10 pr-10 border rounded-[10px] text-sm bg-slate-900/50 text-slate-100 placeholder:text-slate-500 outline-none transition-all
                ${passwordInvalid
                  ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
              tabIndex={-1}
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {passwordInvalid && (
            <p className="mt-1.5 text-xs text-red-400">{passwordError}</p>
          )}
          <div className="text-right mt-1.5">
            <Link href="/reset" className="text-xs font-semibold text-cyan-400 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        {/* Error de API */}
        {apiError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg px-4 py-2.5 text-center">
            {apiError}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-[10px] flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all disabled:bg-slate-700 disabled:cursor-not-allowed mt-1"
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