'use client'
import { useState } from 'react'
import { User, Mail, Lock, Shield, Eye, EyeOff, UserPlus, CheckCircle2 } from 'lucide-react'

const ROLES = [
  { value: 'empleado', label: 'Empleado' },
  { value: 'lector', label: 'Lector' },
  { value: 'superadmin', label: 'Superadministrador' },
]

const inputCls =
  'w-full py-2.5 px-3 pl-9 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all placeholder:text-slate-400'

const labelCls = 'block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide'

export function CrearUsuarioForm({ onUsuarioCreado }: { onUsuarioCreado: () => void }) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState('empleado')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!nombre || !email || !password) {
      setError('Completá todos los campos.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          email: email.trim().toLowerCase(),
          password,
          rol,
          estado: 'aprobado',
        }),
      })

      const data = await res.json()

      if (!data.ok) {
        setError(data.error || 'Error al crear usuario.')
        return
      }

      setSuccess(`Usuario ${nombre} creado correctamente.`)
      setNombre('')
      setEmail('')
      setPassword('')
      setRol('empleado')
      onUsuarioCreado()
    } catch {
      setError('Error de conexión. Intentá de nuevo.')
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
          <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="María García"
            className={inputCls}
            autoComplete="off"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className={labelCls}>Correo electrónico</label>
        <div className="relative">
          <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="maria@ejemplo.com"
            className={inputCls}
            autoComplete="off"
          />
        </div>
      </div>

      {/* Contraseña */}
      <div>
        <label className={labelCls}>Contraseña</label>
        <div className="relative">
          <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type={showPwd ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className={`${inputCls} pr-10`}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPwd(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
            tabIndex={-1}
          >
            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Rol */}
      <div>
        <label className={labelCls}>Rol</label>
        <div className="relative">
          <Shield className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={rol}
            onChange={e => setRol(e.target.value)}
            className={`${inputCls} appearance-none cursor-pointer`}
          >
            {ROLES.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <p className="mt-1.5 text-xs text-slate-400">
          {rol === 'empleado' && 'Puede cargar actividades y ver estadísticas.'}
          {rol === 'lector' && 'Solo puede ver estadísticas, sin acceso a carga.'}
          {rol === 'superadmin' && 'Acceso completo: gestión de usuarios y carga.'}
        </p>
      </div>

      {/* Feedback */}
      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          <span className="mt-0.5 flex-shrink-0">⚠</span>
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          {success}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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
