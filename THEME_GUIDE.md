# 🎨 Guía de Tema Moderno y Tecnológico

Tu aplicación ahora tiene un tema completamente renovado con un diseño más moderno, dinámico y tecnológico.

## ✨ Características Principales

### 🎯 Paleta de Colores Mejorada

#### Modo Claro

- **Background**: Gradiente sutil #f8f9fb → #f0f4f9
- **Primary**: Azul vibrante #0066ff
- **Secondary**: Púrpura tecnológico #7c3aed
- **Accent**: Cyan eléctrico #00d9ff

#### Modo Oscuro

- **Background**: Gradiente profundo #0f172a → #1a1f3a
- **Primary**: Azul moderno #3b82f6
- **Secondary**: Púrpura brillante #8b5cf6
- **Accent**: Cyan luminoso #06b6d4

### 🌟 Nuevas Clases CSS Disponibles

#### Efecto Glassmorphism

```jsx
<div className="glass p-6">Contenido con efecto vidrio congelado</div>
```

Proporciona un efecto de vidrio esmerilado moderno.

#### Texto Gradiente

```jsx
<h1 className="gradient-text text-4xl font-bold">Título espectacular</h1>
```

Crea un efecto de texto con gradiente de colores.

#### Tarjeta Moderna

```jsx
<div className="card-modern p-6">
  <h2>Contenido moderno</h2>
</div>
```

Tarjeta con bordes suaves, sombra elegante y efecto hover mejorado.

#### Efecto Glow (Brillo)

```jsx
<button className="glow px-4 py-2 bg-primary text-white rounded-lg">
  Botón brillante
</button>
```

Añade un brillo luminoso que se intensifica al pasar el mouse.

#### Glow Accent

```jsx
<div className="glow-accent">Elemento con brillo cyan</div>
```

Brillo con el color accent (cyan eléctrico).

#### Entrada Moderna

```jsx
<input
  type="text"
  className="input-modern w-full"
  placeholder="Campo moderno"
/>
```

Inputs con efecto blur, bordes suaves y brillo en focus.

#### Animaciones

**Pulse Glow** - Latido luminoso

```jsx
<div className="pulse-glow"></div>
```

**Float** - Flotación suave

```jsx
<div className="float">Elemento flotante</div>
```

**Shimmer** - Efecto de brillo deslizante (útil para loading)

```jsx
<div className="shimmer h-12 w-full rounded-lg"></div>
```

#### Border Gradiente

```jsx
<div className="gradient-border p-4">Elemento con borde gradiente</div>
```

Borde con gradiente azul → cyan → púrpura.

### 🎯 Nuevas Sombras de Tailwind

```jsx
// Sombras con brillo
<div className="shadow-glow-sm">Sombra pequeña</div>
<div className="shadow-glow">Sombra normal</div>
<div className="shadow-glow-lg">Sombra grande</div>

// Con color accent
<div className="shadow-glow-accent">Brillo cyan</div>
<div className="shadow-glow-accent-lg">Brillo cyan grande</div>

// Sombra interior
<div className="shadow-inner-glow">Brillo interno</div>
```

### 📱 Componentes Recomendados

#### Botón Moderno

```jsx
<button className="btn-tech bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-smooth">
  Acción
</button>
```

#### Card con Glow

```jsx
<div className="card-modern glow p-6 space-y-4">
  <h3 className="text-lg font-semibold">Título</h3>
  <p className="text-muted-foreground">Descripción</p>
</div>
```

#### Hero Section

```jsx
<section className="relative min-h-screen flex items-center justify-center">
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary rounded-full blur-3xl opacity-20 animate-float"></div>
    <div
      className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent rounded-full blur-3xl opacity-20 animate-float"
      style={{ animationDelay: "1s" }}
    ></div>
  </div>

  <div className="relative z-10 text-center">
    <h1 className="gradient-text text-5xl font-bold mb-6">
      Bienvenido al futuro
    </h1>
    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
      Un diseño moderno, dinámico y totalmente tech
    </p>
  </div>
</section>
```

#### Grid Moderna

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map((item) => (
    <div key={item.id} className="card-modern glow-accent p-6 group">
      <div className="h-40 bg-accent/10 rounded-lg mb-4 group-hover:bg-accent/20 transition-smooth"></div>
      <h3 className="font-semibold mb-2">{item.title}</h3>
      <p className="text-sm text-muted-foreground">{item.description}</p>
    </div>
  ))}
</div>
```

### 🎨 Variantes de Color

Usa con las clases estándar:

- `bg-primary`, `text-primary`, `border-primary`
- `bg-secondary`, `text-secondary`, `border-secondary`
- `bg-accent`, `text-accent`, `border-accent`
- `bg-destructive`, `text-destructive`, `border-destructive`
- `bg-sidebar`, `text-sidebar-foreground`, `border-sidebar-border`

### 📊 Colores de Gráficos

Para tus gráficos, usa:

- `chart-1`: #0066ff (Azul primario)
- `chart-2`: #7c3aed (Púrpura)
- `chart-3`: #00d9ff (Cyan)
- `chart-4`: #f59e0b (Ámbar)
- `chart-5`: #ec4899 (Rosa)

## 🚀 Mejores Prácticas

1. **Combina efectos con moderación** - No uses glow en todo, úsalo para elementos importantes
2. **Mantén el contraste** - Asegúrate de que el texto sea legible en todos los fondos
3. **Anima con propósito** - Las animaciones deben mejorar la UX, no distraer
4. **Sombras en capas** - Usa diferentes sombras para crear jerarquía visual
5. **Responsive first** - Todos los componentes son mobile-first

## 🔄 Transiciones Suaves

Todos los efectos hover tienen transiciones suaves de 300ms por defecto.

Usa la clase `transition-smooth` para tus elementos personalizados:

```jsx
<div className="transition-smooth hover:scale-105 hover:shadow-glow">
  Elemento interactivo
</div>
```

## 📱 Dark Mode

El tema soporta dark mode automáticamente. Los colores se ajustan automáticamente basados en la preferencia del usuario.

Fuerza modo oscuro manualmente:

```jsx
<html className="dark">
```

¡Disfruta tu nuevo tema moderno y tecnológico! 🎉
