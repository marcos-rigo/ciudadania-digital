'use client'
import { useState, useEffect } from 'react'
import { Mail, User, Shield, Clock, Edit, Trash2, Plus, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CrearUsuarioForm } from '@/components/dashboard/CrearUsuarioForm'

const ROLES = ['superadmin', 'empleado', 'lector'] as const
const ESTADOS = ['aprobado', 'pendiente', 'rechazado'] as const

type Usuario = {
  nombre: string
  email: string
  rol: string
  estado: string
  email_verificado: boolean
}

export function ListaUsuarios({ refetch }: { refetch?: number }) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [internalRefetch, setInternalRefetch] = useState(0)

  // Modales
  const [mostrarCrear, setMostrarCrear] = useState(false)
  const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null)
  const [usuarioEliminar, setUsuarioEliminar] = useState<Usuario | null>(null)

  // Estado del formulario de edición
  const [editNombre, setEditNombre] = useState('')
  const [editRol, setEditRol] = useState('')
  const [editEstado, setEditEstado] = useState('')
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')

  // Estado de eliminación
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const refetchTotal = (refetch ?? 0) + internalRefetch

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
  }, [refetchTotal])

  function abrirEditar(u: Usuario) {
    setUsuarioEditar(u)
    setEditNombre(u.nombre)
    setEditRol(u.rol)
    setEditEstado(u.estado)
    setEditError('')
  }

  function cerrarEditar() {
    setUsuarioEditar(null)
    setEditError('')
  }

  async function guardarEdicion() {
    if (!usuarioEditar) return
    setEditLoading(true)
    setEditError('')
    try {
      const res = await fetch(`/api/admin/usuarios/${encodeURIComponent(usuarioEditar.email)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: editNombre, rol: editRol, estado: editEstado }),
      })
      const data = await res.json()
      if (!data.ok) {
        setEditError(data.error || 'Error al actualizar.')
        return
      }
      cerrarEditar()
      setInternalRefetch(n => n + 1)
    } catch {
      setEditError('Error de conexión.')
    } finally {
      setEditLoading(false)
    }
  }

  async function confirmarEliminar() {
    if (!usuarioEliminar) return
    setDeleteLoading(true)
    setDeleteError('')
    try {
      const res = await fetch(`/api/admin/usuarios/${encodeURIComponent(usuarioEliminar.email)}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!data.ok) {
        setDeleteError(data.error || 'Error al eliminar.')
        return
      }
      setUsuarioEliminar(null)
      setInternalRefetch(n => n + 1)
    } catch {
      setDeleteError('Error de conexión.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'aprobado':  return 'bg-green-50 text-green-700 border-green-200'
      case 'pendiente': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'rechazado': return 'bg-red-50 text-red-700 border-red-200'
      default:          return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const inputCls =
    'w-full py-2.5 px-3 border border-[#e2e8f0] rounded-lg text-sm text-[#1A2A36] bg-white outline-none focus:border-[#4272bb] focus:ring-2 focus:ring-[#4272bb]/20 transition-all'

  return (
    <>
      {/* Botón agregar */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setMostrarCrear(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#4272bb] hover:bg-[#2d5a9e] text-white text-sm font-bold rounded-lg shadow-[0_4px_14px_rgba(66,114,187,.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          Agregar usuario
        </button>
      </div>

      {/* Tabla */}
      {loading && (
        <div className="text-center text-[#64748b] py-8">Cargando usuarios...</div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {!loading && !error && usuarios.length === 0 && (
        <div className="bg-[#f8fafc] border border-[#e2e8f0] text-[#64748b] text-sm rounded-lg px-4 py-8 text-center">
          No hay usuarios creados aún.
        </div>
      )}

      {!loading && !error && usuarios.length > 0 && (
        <div className="bg-white rounded-lg border border-[#e2e8f0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-[#374151]">Nombre</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#374151]">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#374151]">Rol</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#374151]">Estado</th>
                  <th className="px-4 py-3 text-center font-semibold text-[#374151]">Verificado</th>
                  <th className="px-4 py-3 text-center font-semibold text-[#374151]">Acciones</th>
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
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getEstadoColor(u.estado)}`}
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
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => abrirEditar(u)}
                          title="Editar usuario"
                          className="p-1.5 rounded-md text-[#4272bb] hover:bg-[#4272bb]/10 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setUsuarioEliminar(u); setDeleteError('') }}
                          title="Eliminar usuario"
                          className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dialog: Agregar usuario */}
      <Dialog open={mostrarCrear} onOpenChange={setMostrarCrear}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Agregar usuario</DialogTitle>
          </DialogHeader>
          <CrearUsuarioForm
            onUsuarioCreado={() => {
              setMostrarCrear(false)
              setInternalRefetch(n => n + 1)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog: Editar usuario */}
      <Dialog open={!!usuarioEditar} onOpenChange={open => { if (!open) cerrarEditar() }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
          </DialogHeader>

          {usuarioEditar && (
            <div className="space-y-4 pt-2">
              <p className="text-sm text-[#64748b]">
                Editando: <span className="font-medium text-[#1A2A36]">{usuarioEditar.email}</span>
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={editNombre}
                  onChange={e => setEditNombre(e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Rol
                </label>
                <select
                  value={editRol}
                  onChange={e => setEditRol(e.target.value)}
                  className={`${inputCls} appearance-none cursor-pointer`}
                >
                  {ROLES.map(r => (
                    <option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Estado
                </label>
                <select
                  value={editEstado}
                  onChange={e => setEditEstado(e.target.value)}
                  className={`${inputCls} appearance-none cursor-pointer`}
                >
                  {ESTADOS.map(s => (
                    <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>

              {editError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-4 py-2.5">
                  {editError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={cerrarEditar}
                  className="flex-1 py-2.5 border border-[#e2e8f0] rounded-lg text-sm text-[#64748b] hover:bg-[#f8fafc] transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarEdicion}
                  disabled={editLoading}
                  className="flex-1 py-2.5 bg-[#4272bb] hover:bg-[#2d5a9e] text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all disabled:bg-[#94a3b8] disabled:cursor-not-allowed"
                >
                  {editLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar cambios'}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* AlertDialog: Confirmar eliminación */}
      <AlertDialog open={!!usuarioEliminar} onOpenChange={open => { if (!open) setUsuarioEliminar(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás por eliminar a{' '}
              <span className="font-semibold text-[#1A2A36]">{usuarioEliminar?.nombre}</span>{' '}
              ({usuarioEliminar?.email}). Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-4 py-2.5">
              {deleteError}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={e => { e.preventDefault(); confirmarEliminar() }}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleteLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Eliminando...
                </span>
              ) : (
                'Eliminar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
