'use client'
import { useState } from 'react'
import { Plus, Eye, EyeOff } from 'lucide-react'

const ROLES = [
  { value: 'admin', label: 'Administrador' },
  { value: 'lector', label: 'Lector' },
  { value: 'profesor', label: 'Profesor' },
  { value: 'prueba', label: 'Prueba' },
]

const ESTADOS = [
  { value: 'aprobado', label: 'Aprobado' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'rechazado', label: 'Rechazado' },
]

export function CrearUsuarioForm({ onUsuarioCreado }: { onUsuarioCreado: () => void }) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState('lector')
  const [estado, setEstado] = useState('aprobado')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!nombre || !email || !password || !rol) {
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
          estado,
        }),
      })

      const data = await res.json()

      if (!data.ok) {
        setError(data.error || 'Error al crear usuario.')
        return
      }

      setSuccess(`Usuario ${nombre} creado exitosamente.`)
      setNombre('')
      setEmail('')
      setPassword('')
      setRol('lector')
      setEstado('aprobado')
      onUsuarioCreado()
    } catch {
      setError('Error de conexión. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-[#e2e8f0] p-6">
      <h3 className="text-[#1A2A36] font-black text-lg mb-4">Crear nuevo usuario</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            Nombre completo
          </label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Juan Pérez"
            className="w-full py-2.5 px-3 border border-[#e2e8f0] rounded-lg text-sm text-[#1A2A36] bg-white outline-none focus:border-[#4272bb] focus:ring-2 focus:ring-[#4272bb]/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="juan@ejemplo.com"
            className="w-full py-2.5 px-3 border border-[#e2e8f0] rounded-lg text-sm text-[#1A2A36] bg-white outline-none focus:border-[#4272bb] focus:ring-2 focus:ring-[#4272bb]/20 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••"
              className="w-full py-2.5 px-3 pr-10 border border-[#e2e8f0] rounded-lg text-sm text-[#1A2A36] bg-white outline-none focus:border-[#4272bb] focus:ring-2 focus:ring-[#4272bb]/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#4272bb]"
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            Rol
          </label>
          <select
            value={rol}
            onChange={e => setRol(e.target.value)}
            className="w-full py-2.5 px-3 border border-[#e2e8f0] rounded-lg text-sm text-[#1A2A36] bg-white outline-none focus:border-[#4272bb] focus:ring-2 focus:ring-[#4272bb]/20 transition-all appearance-none cursor-pointer"
          >
            {ROLES.map(r => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            Estado
          </label>
          <select
            value={estado}
            onChange={e => setEstado(e.target.value)}
            className="w-full py-2.5 px-3 border border-[#e2e8f0] rounded-lg text-sm text-[#1A2A36] bg-white outline-none focus:border-[#4272bb] focus:ring-2 focus:ring-[#4272bb]/20 transition-all appearance-none cursor-pointer"
          >
            {ESTADOS.map(e => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-4 py-2.5 mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg px-4 py-2.5 mb-4">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-[#4272bb] hover:bg-[#2d5a9e] text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(66,114,187,.3)] transition-all disabled:bg-[#94a3b8] disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
        Crear usuario
      </button>
    </form>
  )
}
