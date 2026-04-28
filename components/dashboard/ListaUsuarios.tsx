'use client'
import { useState, useEffect } from 'react'
import { Mail, User, Shield, Clock } from 'lucide-react'

export function ListaUsuarios({ refetch }: { refetch: number }) {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargarUsuarios() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('/api/admin/usuarios')
        const data = await res.json()

        if (!data.ok) {
          setError(data.error || 'Error al cargar usuarios.')
          return
        }

        setUsuarios(data.usuarios || [])
      } catch {
        setError('Error de conexión.')
      } finally {
        setLoading(false)
      }
    }

    cargarUsuarios()
  }, [refetch])

  if (loading) {
    return <div className="text-center text-[#64748b] py-8">Cargando usuarios...</div>
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
        {error}
      </div>
    )
  }

  if (usuarios.length === 0) {
    return (
      <div className="bg-[#f8fafc] border border-[#e2e8f0] text-[#64748b] text-sm rounded-lg px-4 py-8 text-center">
        No hay usuarios creados aún.
      </div>
    )
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'aprobado':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'pendiente':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'rechazado':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-[#e2e8f0] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-[#374151]">Nombre</th>
              <th className="px-4 py-3 text-left font-semibold text-[#374151]">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-[#374151]">Rol</th>
              <th className="px-4 py-3 text-left font-semibold text-[#374151]">Estado</th>
              <th className="px-4 py-3 text-left font-semibold text-[#374151]">Verificado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0]">
            {usuarios.map((u, i) => (
              <tr key={i} className="hover:bg-[#f8fafc] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#94a3b8]" />
                    <span className="text-[#1A2A36] font-medium">{u.nombre}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#94a3b8]" />
                    <span className="text-[#64748b]">{u.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#4272bb]" />
                    <span className="text-[#4272bb] font-medium capitalize">{u.rol}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getEstadoColor(
                      u.estado
                    )}`}
                  >
                    {u.estado === 'aprobado' && '✓ Aprobado'}
                    {u.estado === 'pendiente' && '⊙ Pendiente'}
                    {u.estado === 'rechazado' && '✕ Rechazado'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {u.email_verificado ? (
                    <span className="text-green-600 font-bold">✓</span>
                  ) : (
                    <span className="text-red-600 font-bold">✕</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
