# 🔥 Cheat Sheet - Tema Moderno SPC

Referencia rápida para usar el tema en nuevos componentes.

## 🎨 Colores

### Uso en className

```jsx
// Colores base
bg - primary; // Azul #0066ff
text - primary; // Azul
border - primary; // Borde azul

bg - secondary; // Púrpura
text - accent; // Cyan
bg - destructive; // Rojo

// Fondos y texto
bg - background; // Fondo principal
text - foreground; // Texto principal
bg - card; // Card background
text - card - foreground; // Card text

// Sidebar
bg - sidebar; // Fondo sidebar
text - sidebar - foreground; // Texto sidebar
bg - sidebar - primary; // Primario sidebar
bg - sidebar - accent; // Accent sidebar
```

---

## ✨ Efectos Glow

### Glow en Botones

```jsx
<Button className="glow bg-primary text-white">Botón Brillante</Button>
```

### Glow en Links

```jsx
<Link className={cn("glow shadow-glow-sm", isActive && "text-primary")}>
  Enlace Activo
</Link>
```

### Glow Accent

```jsx
<div className="glow-accent shadow-glow-accent p-4 rounded-lg">
  Elemento Cyan
</div>
```

---

## 🌫️ Glassmorphism

### Dropdowns

```jsx
<DropdownMenuContent align="end" className="glass">
  <DropdownMenuItem>Opción</DropdownMenuItem>
</DropdownMenuContent>
```

### Cards

```jsx
<div className="glass p-6 rounded-lg backdrop-blur">Contenido</div>
```

### Overlays

```jsx
<div className="fixed inset-0 glass bg-black/30">Modal</div>
```

---

## 🌈 Gradientes

### Logo/Badges

```jsx
<div className="bg-gradient-to-br from-primary to-accent glow">Logo</div>
```

### Botones

```jsx
<Button className="bg-gradient-to-r from-primary to-secondary">
  Botón Gradient
</Button>
```

### Hero

```jsx
<section className="bg-gradient-to-b from-primary/10 to-accent/10">
  Hero Section
</section>
```

---

## 🎬 Animaciones

### Floating

```jsx
<div className="animate-float">Elemento Flotante</div>
```

### Pulse Glow

```jsx
<div className="pulse-glow w-10 h-10 rounded-full bg-primary" />
```

### Shimmer (Loading)

```jsx
<div className="shimmer h-12 w-full rounded-lg" />
```

---

## 📱 Componentes Comunes

### Botón Primary

```jsx
<Button className="glow bg-primary hover:shadow-glow-lg">Acción</Button>
```

### Botón Secondary

```jsx
<Button variant="outline" className="hover:bg-secondary/10">
  Secundario
</Button>
```

### Input

```jsx
<input className="input-modern w-full" placeholder="Escribe..." />
```

### Card

```jsx
<div className="card-modern glow p-6">
  <h3>Título</h3>
  <p>Contenido</p>
</div>
```

### Badge

```jsx
<span className="badge-modern bg-primary text-primary-foreground">Nuevo</span>
```

### Avatar

```jsx
<div className="h-10 w-10 rounded-full glow bg-gradient-to-br from-primary to-accent" />
```

---

## 🎯 Navegación

### Link Activo

```jsx
<Link
  className={cn(
    "px-3 py-2 rounded-lg transition-all duration-200",
    isActive
      ? "bg-primary/10 text-primary glow shadow-glow-sm"
      : "text-muted-foreground hover:bg-muted/50",
  )}
>
  {label}
</Link>
```

### Sidebar Item

```jsx
<Link
  className={cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200",
    isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground glow-accent"
      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50",
  )}
>
  <Icon className="h-4 w-4" />
  {label}
</Link>
```

### Dropdown

```jsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" className="glow">
      Menu
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="glass">
    <DropdownMenuItem className="hover:bg-primary/10">Opción</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## 🎨 Sombras

### Pequeña

```jsx
className = "shadow-glow-sm"; // 0 0 10px cyan
```

### Normal

```jsx
className = "shadow-glow"; // 0 0 20px cyan
```

### Grande

```jsx
className = "shadow-glow-lg"; // 0 0 30px cyan
```

### Accent

```jsx
className = "shadow-glow-accent"; // cyan
className = "shadow-glow-accent-lg"; // cyan grande
```

---

## 🔄 Transiciones

### Transición Suave

```jsx
className = "transition-smooth"; // 300ms ease-out
```

### Transición Rápida

```jsx
className = "transition-all duration-200"; // 200ms
```

### Hover Elevation

```jsx
className = "hover:-translate-y-0.5 transition-smooth";
```

---

## 📦 Combos Útiles

### Card Interactiva

```jsx
<div className="card-modern glow p-6 group hover:shadow-glow-lg transition-smooth">
  <h3 className="group-hover:text-primary">Título</h3>
  <p className="text-muted-foreground">Descripción</p>
</div>
```

### Botón con Icono

```jsx
<Button className="glow bg-primary gap-2">
  <Icon className="h-4 w-4" />
  Acción
</Button>
```

### Link con Efecto

```jsx
<Link className="text-primary hover:text-accent glow transition-smooth">
  Enlace
</Link>
```

### Notificación Badge

```jsx
<div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive flex items-center justify-center text-xs font-bold text-white animate-pulse">
  3
</div>
```

### Status Indicator

```jsx
<div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
```

---

## 🌙 Dark Mode

### Condicional para Dark

```jsx
className = "dark:bg-sidebar dark:text-sidebar-foreground";
```

### Automático

- Todos los colores de variables CSS se ajustan automáticamente
- No necesitas código especial para dark mode
- Usa `dark:` solo si necesitas sobrescribir algo

---

## 🎯 Patrón Recomendado

Para un componente nuevo:

```jsx
// 1. Estructura
const isActive = pathname === href

// 2. ClassName con variantes
className={cn(
  "px-3 py-2 rounded-lg transition-all duration-200",
  isActive
    ? "bg-primary/10 text-primary glow"
    : "text-muted-foreground hover:bg-muted/50"
)}

// 3. Agregar interactividad
// 4. Probar en light y dark mode
// 5. Revisar en mobile
```

---

## ✅ Checklist para Componentes Nuevos

- [ ] Usa colores de la paleta
- [ ] Agrega `transition-smooth` o `transition-all`
- [ ] Usa `rounded-lg` mínimo
- [ ] Agrega `glow` si es importante
- [ ] Implementa estado active/hover
- [ ] Usa `glass` en overlays
- [ ] Prueba en light y dark
- [ ] Prueba en mobile
- [ ] Verifica accesibilidad

---

## 🚀 Tips de Rendimiento

```jsx
// ✅ Bueno - Animación GPU acelerada
className = "transition-smooth hover:shadow-glow";

// ✅ Bueno - Backdrop blur
className = "glass backdrop-blur-md";

// ❌ Evitar - Animaciones costosas
className = "animate-spin"; // En elementos grandes

// ✅ Bueno - Usar para elementos pequeños
className = "animate-pulse"; // Badge/indicador
```

---

## 📚 Referencia de Archivos

```
🎨 Colores:        app/globals.css
⚙️ Config:         tailwind.config.js
🎯 Toggle:         components/ui/theme-toggle.tsx
📱 Layouts:        components/layouts/*
📖 Guía:           THEME_GUIDE.md
```

---

¡Listo para crear componentes modernos! 🚀
