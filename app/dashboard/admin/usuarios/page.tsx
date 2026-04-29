'use client'
import { Users } from 'lucide-react'
import { ListaUsuarios } from '@/components/dashboard/ListaUsuarios'

export default function UsuariosPage() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#4272bb]/10 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-[#4272bb]" />
          </div>
          <div>
            <h1 className="text-[#1A2A36] text-2xl font-black">Gestión de usuarios</h1>
            <p className="text-[#64748b] text-sm">Creá, editá y eliminá usuarios del sistema</p>
          </div>
        </div>
      </div>

      <ListaUsuarios />
    </div>
  )
}
