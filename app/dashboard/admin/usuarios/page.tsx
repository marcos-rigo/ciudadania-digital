'use client'
import { useState } from 'react'
import { Users } from 'lucide-react'
import { CrearUsuarioForm } from '@/components/dashboard/CrearUsuarioForm'
import { ListaUsuarios } from '@/components/dashboard/ListaUsuarios'

export default function UsuariosPage() {
  const [refetchKey, setRefetchKey] = useState(0)

  const handleUsuarioCreado = () => {
    setRefetchKey(prev => prev + 1)
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#4272bb]/10 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-[#4272bb]" />
          </div>
          <div>
            <h1 className="text-[#1A2A36] text-2xl font-black">Gestión de usuarios</h1>
            <p className="text-[#64748b] text-sm">Crea y administra usuarios del sistema</p>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario */}
        <div className="lg:col-span-1">
          <CrearUsuarioForm onUsuarioCreado={handleUsuarioCreado} />
        </div>

        {/* Lista */}
        <div className="lg:col-span-2">
          <h2 className="text-[#1A2A36] font-bold text-lg mb-4">Usuarios registrados</h2>
          <ListaUsuarios refetch={refetchKey} />
        </div>
      </div>
    </div>
  )
}
