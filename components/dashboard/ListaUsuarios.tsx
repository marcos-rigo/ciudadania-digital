'use client'
import { useState, useEffect } from 'react'
import { Mail, User, Shield, Edit, Trash2, Plus, Loader2, Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react'
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

  const [mostrarCrear, setMostrarCrear] = useState(false)
  const [usuarioEditar, setUsuarioEditar] = useState<Usuario | null>(null)
  const [usuarioEliminar, setUsuarioEliminar] = useState<Usuario | null>(null)

  const [editNombre, setEditNombre] = useState('')
  const [editRol, setEditRol] = useState('')
  const [editEstado, setEditEstado] = useState('')
  const [editPassword, setEditPassword] = useState('')
  const [showEditPwd, setShowEditPwd] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')

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
    setEditPassword('')
    setShowEditPwd(false)
    setEditError('')
  }

  function cerrarEditar() {
    setUsuarioEditar(null)
    setEditPassword('')
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
        body: JSON.stringify({
          nombre: editNombre,
          rol: editRol,
          ...(editPassword ? { password: editPassword } : {}),
        }),
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

  const inputCls = 'w-full py-2.5 px-3 pl-9 border border-slate-700 rounded-lg text-sm text-slate-100 bg-slate-900/50 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-slate-500'
  const labelCls = 'block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide'

  return (
    <>
      {/* Botón agregar */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setMostrarCrear(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-sm font-bold rounded-lg shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Agregar usuario
        </button>
      </div>

      {/* Tabla */}
      {loading && (
        <div className="text-center text-slate-400 py-8">Cargando usuarios...</div>
      )}

      {!loading && error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {!loading && !error && usuarios.length === 0 && (
        <div className="bg-slate-900/50 border border-slate-800 text-slate-400 text-sm rounded-lg px-4 py-8 text-center">
          No hay usuarios creados aún.
        </div>
      )}

      {!loading && !error && usuarios.length > 0 && (
        <>
          {/* Mobile: cards */}
          <div className="sm:hidden space-y-3">
            {usuarios.map((u, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 shadow-lg">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <User className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span className="text-slate-100 font-semibold text-sm truncate">{u.nombre}</span>
                    </div>
                    <div className="flex items-center gap-1.5 ml-6">
                      <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="text-slate-400 text-xs truncate">{u.email}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    {u.rol !== 'superadmin' && (
                      <>
                        <button
                          onClick={() => abrirEditar(u)}
                          title="Editar usuario"
                          className="p-2 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setUsuarioEliminar(u); setDeleteError('') }}
                          title="Eliminar usuario"
                          className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-cyan-400 text-xs font-semibold capitalize">{u.rol}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden sm:block rounded-2xl overflow-hidden border border-slate-800/50 bg-slate-900/30 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-900/80">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">Nombre</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">Rol</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {usuarios.map((u, i) => (
                    <tr key={i} className="hover:bg-cyan-500/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          <span className="text-slate-200 font-medium">{u.nombre}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          <span className="text-slate-400 text-xs">{u.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={
                          u.rol === 'superadmin' ? 'badge-rol-superadmin' :
                          u.rol === 'empleado'   ? 'badge-rol-empleado'   :
                          'badge-rol-lector'
                        }>
                          {u.rol === 'superadmin' ? 'Superadmin' : u.rol === 'empleado' ? 'Empleado' : 'Lector'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {u.rol !== 'superadmin' ? (
                            <>
                              <button
                                onClick={() => abrirEditar(u)}
                                title="Editar usuario"
                                className="p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => { setUsuarioEliminar(u); setDeleteError('') }}
                                title="Eliminar usuario"
                                className="p-1.5 rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-slate-600 italic px-2">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal: Agregar usuario */}
      <Dialog open={mostrarCrear} onOpenChange={setMostrarCrear}>
        <DialogContent className="bg-[#0d1220] border border-slate-800 shadow-2xl sm:max-w-md p-0 gap-0 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center flex-shrink-0">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-100">Nuevo usuario</DialogTitle>
              <p className="text-xs text-slate-500 mt-0.5">Completá los datos para crear la cuenta</p>
            </div>
          </div>
          <div className="px-6 py-5">
            <CrearUsuarioForm
              onUsuarioCreado={() => {
                setMostrarCrear(false)
                setInternalRefetch(n => n + 1)
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Editar usuario */}
      <Dialog open={!!usuarioEditar} onOpenChange={open => { if (!open) cerrarEditar() }}>
        <DialogContent className="bg-[#0d1220] border border-slate-800 shadow-2xl sm:max-w-md p-0 gap-0 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center flex-shrink-0">
              <Edit className="w-4 h-4 text-white" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-100">Editar usuario</DialogTitle>
              {usuarioEditar && (
                <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[260px]">{usuarioEditar.email}</p>
              )}
            </div>
          </div>

          {usuarioEditar && (
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className={labelCls}>Nombre completo</label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={editNombre}
                    onChange={e => setEditNombre(e.target.value)}
                    className={inputCls}
                    placeholder="Nombre completo"
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Rol</label>
                <div className="relative">
                  <Shield className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select
                    value={editRol}
                    onChange={e => setEditRol(e.target.value)}
                    className={`${inputCls} appearance-none cursor-pointer`}
                  >
                    {ROLES.map(r => (
                      <option key={r} value={r} className="bg-slate-900">{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>
                  Nueva contraseña
                  <span className="ml-1.5 normal-case font-normal text-slate-500">(dejar vacío para no cambiar)</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showEditPwd ? 'text' : 'password'}
                    value={editPassword}
                    onChange={e => setEditPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${inputCls} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
                    tabIndex={-1}
                  >
                    {showEditPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {editError && (
                <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
                  <span className="flex-shrink-0 mt-0.5">⚠</span>
                  {editError}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={cerrarEditar}
                  className="flex-1 py-2.5 border border-slate-700 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarEdicion}
                  disabled={editLoading}
                  className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
                >
                  {editLoading
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Edit className="w-3.5 h-3.5" />
                  }
                  {editLoading ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal: Confirmar eliminación */}
      <AlertDialog open={!!usuarioEliminar} onOpenChange={open => { if (!open) setUsuarioEliminar(null) }}>
        <AlertDialogContent className="bg-[#0d1220] border border-slate-800 shadow-2xl sm:max-w-sm p-0 gap-0 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <AlertDialogTitle className="text-base font-bold text-slate-100">
              ¿Eliminar usuario?
            </AlertDialogTitle>
          </div>

          <div className="px-6 py-5 space-y-4">
            <AlertDialogDescription className="text-sm text-slate-300 leading-relaxed">
              Estás por eliminar a{' '}
              <span className="font-semibold text-slate-100">{usuarioEliminar?.nombre}</span>.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>

            <div className="flex items-center gap-2.5 bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2.5">
              <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="text-sm text-slate-300 truncate">{usuarioEliminar?.email}</span>
            </div>

            {deleteError && (
              <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
                <span className="flex-shrink-0 mt-0.5">⚠</span>
                {deleteError}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <AlertDialogCancel
                disabled={deleteLoading}
                className="flex-1 py-2.5 border border-slate-700 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition-all bg-transparent"
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={e => { e.preventDefault(); confirmarEliminar() }}
                disabled={deleteLoading}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-400 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
              >
                {deleteLoading
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Trash2 className="w-3.5 h-3.5" />
                }
                {deleteLoading ? 'Eliminando...' : 'Eliminar'}
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}