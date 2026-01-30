#!/bin/bash

# Script para verificar que el tema está correctamente instalado

echo "🎨 Verificación del Tema Moderno - SPC Tucumán"
echo "=============================================="
echo ""

# Verificar archivos principales
echo "✅ Verificando archivos..."

archivos=(
  "app/globals.css"
  "tailwind.config.js"
  "components/ui/theme-toggle.tsx"
  "components/theme-provider.tsx"
  "app/layout.tsx"
  "components/layouts/public-layout.tsx"
  "components/layouts/admin-layout.tsx"
  "components/layouts/gestion-layout.tsx"
  "components/layouts/ciudadania-layout.tsx"
)

for archivo in "${archivos[@]}"; do
  if [ -f "$archivo" ]; then
    echo "  ✓ $archivo"
  else
    echo "  ✗ $archivo - NO ENCONTRADO"
  fi
done

echo ""
echo "✅ Verificación completada"
echo ""
echo "📋 Próximos pasos:"
echo "  1. Ejecuta: npm run dev"
echo "  2. Abre: http://localhost:3000"
echo "  3. Busca el botón de tema en la esquina superior derecha"
echo "  4. Haz clic para cambiar entre modo claro y oscuro"
echo ""
echo "🎨 El tema moderno incluye:"
echo "  • Sistema de temas claro/oscuro"
echo "  • Efectos glow en elementos interactivos"
echo "  • Glassmorphism en dropdowns"
echo "  • Animaciones suaves"
echo "  • Colores vibrantes y modernos"
echo "  • Responsive design mejorado"
echo ""
