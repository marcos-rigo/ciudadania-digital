'use client'
import { Users, Sparkles } from 'lucide-react'
import { ListaUsuarios } from '@/components/dashboard/ListaUsuarios'

export default function UsuariosPage() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-slate-100 text-2xl font-black">Gestión de usuarios</h1>
            <p className="text-slate-400 text-sm">Creá, editá y eliminá usuarios del sistema</p>
          </div>
        </div>
      </div>

      <ListaUsuarios />
    </div>
  )
}