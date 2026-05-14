'use client'
import { useState } from 'react'
import { User, Mail, Lock, Shield, Eye, EyeOff, UserPlus, CheckCircle2 } from 'lucide-react'

const ROLES = [
  { value: 'empleado', label: 'Empleado' },
  { value: 'lector', label: 'Lector' },
  { value: 'superadmin', label: 'Superadministrador' },
]

const NOMBRE_RE = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$/
const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/

function validarNombre(v: string) {
  if (!v.trim()) return 'El nombre es obligatorio.'
  if (!NOMBRE_RE.test(v)) return 'Solo se permiten letras y espacios.'
  if (v.trim().length > 15) return 'Máximo 15 caracteres.'
  return ''
}

function validarEmail(v: string) {
  if (!v.trim()) return 'El correo es obligatorio.'
  if (!EMAIL_RE.test(v.trim())) return 'Ingresá un correo electrónico válido.'
  return ''
}

function validarPassword(v: string) {
  if (!v) return 'La contraseña es obligatoria.'
  if (v.length < 6) return 'Mínimo 6 caracteres.'
  if (!/[A-Z]/.test(v)) return 'Debe incluir al menos una mayúscula.'
  if (!/[a-z]/.test(v)) return 'Debe incluir al menos una minúscula.'
  if (!/[0-9]/.test(v)) return 'Debe incluir al menos un número.'
  if (!/[^a-zA-Z0-9]/.test(v)) return 'Debe incluir al menos un signo especial (ej: @, #, !).'
  return ''
}

const inputCls = 'w-full py-2.5 px-3 pl-9 border rounded-lg text-sm text-slate-100 bg-slate-900/50 outline-none focus:ring-2 transition-all placeholder:text-slate-500'

function inputState(touched: boolean, error: string) {
  if (!touched) return 'border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20'
  if (error) return 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
  return 'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/20'
}

const labelCls = 'block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide'

export function CrearUsuarioForm({ onUsuarioCreado }: { onUsuarioCreado: () => void }) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState('empleado')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState('')

  const [touched, setTouched] = useState({ nombre: false, email: false, password: false })

  const errors = {
    nombre: validarNombre(nombre),
    email: validarEmail(email),
    password: validarPassword(password),
  }

  function touch(field: keyof typeof touched) {
    setTouched(t => ({ ...t, [field]: true }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setApiError('')
    setSuccess('')
    setTouched({ nombre: true, email: true, password: true })

    if (errors.nombre || errors.email || errors.password) return

    setLoading(true)
    try {
      const res = await fetch('/api/admin/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim().toLowerCase(),
          password,
          rol,
          estado: 'aprobado',
        }),
      })

      const data = await res.json()

      if (!data.ok) {
        setApiError(data.error || 'Error al crear usuario.')
        return
      }

      setSuccess(`Usuario ${nombre.trim()} creado correctamente.`)
      setNombre('')
      setEmail('')
      setPassword('')
      setRol('empleado')
      setTouched({ nombre: false, email: false, password: false })
      onUsuarioCreado()
    } catch {
      setApiError('Error de conexión. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre */}
      <div>
        <label className={labelCls}>Nombre completo</label>
        <div className="relative">
          <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            onBlur={() => touch('nombre')}
            placeholder="María García"
            maxLength={15}
            className={`${inputCls} ${inputState(touched.nombre, errors.nombre)}`}
            autoComplete="off"
          />
        </div>
        {touched.nombre && errors.nombre && (
          <p className="mt-1 text-xs text-red-400">{errors.nombre}</p>
        )}
        {!errors.nombre && touched.nombre && (
          <p className="mt-1 text-xs text-slate-500 text-right">{nombre.trim().length}/15</p>
        )}
        {!touched.nombre && (
          <p className="mt-1 text-xs text-slate-500">Solo letras, máximo 15 caracteres.</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className={labelCls}>Correo electrónico</label>
        <div className="relative">
          <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onBlur={() => touch('email')}
            placeholder="maria@ejemplo.com"
            className={`${inputCls} ${inputState(touched.email, errors.email)}`}
            autoComplete="off"
          />
        </div>
        {touched.email && errors.email && (
          <p className="mt-1 text-xs text-red-400">{errors.email}</p>
        )}
      </div>

      {/* Contraseña */}
      <div>
        <label className={labelCls}>Contraseña</label>
        <div className="relative">
          <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type={showPwd ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onBlur={() => touch('password')}
            placeholder="Ej: MiClave1!"
            className={`${inputCls} pr-10 ${inputState(touched.password, errors.password)}`}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPwd(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
            tabIndex={-1}
          >
            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {touched.password && errors.password ? (
          <p className="mt-1 text-xs text-red-400">{errors.password}</p>
        ) : !touched.password ? (
          <p className="mt-1 text-xs text-slate-500">
            Mín. 6 caracteres · mayúscula · minúscula · número · signo especial
          </p>
        ) : null}
      </div>

      {/* Rol */}
      <div>
        <label className={labelCls}>Rol</label>
        <div className="relative">
          <Shield className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select
            value={rol}
            onChange={e => setRol(e.target.value)}
            className={`${inputCls} border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20 appearance-none cursor-pointer`}
          >
            {ROLES.map(r => (
              <option key={r.value} value={r.value} className="bg-slate-900">{r.label}</option>
            ))}
          </select>
        </div>
        <p className="mt-1.5 text-xs text-slate-500">
          {rol === 'empleado' && 'Puede cargar actividades y ver estadísticas.'}
          {rol === 'lector' && 'Solo puede ver estadísticas, sin acceso a carga.'}
          {rol === 'superadmin' && 'Acceso completo: gestión de usuarios y carga.'}
        </p>
      </div>

      {/* Feedback */}
      {apiError && (
        <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
          <span className="mt-0.5 flex-shrink-0">⚠</span>
          {apiError}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg px-4 py-3">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          {success}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-900 font-semibold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <UserPlus className="w-4 h-4" />
        )}
        {loading ? 'Creando...' : 'Crear usuario'}
      </button>
    </form>
  )
}