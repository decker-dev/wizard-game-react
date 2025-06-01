# Arquitectura del Juego - Separación de Responsabilidades

## Problema Original

El archivo `app/page.tsx` original tenía **muchas responsabilidades**:
- Manejo de estado del juego (score, wave, health, etc.)
- Navegación entre pantallas 
- Carga de assets
- Manejo de eventos
- Lógica de UI
- Efectos y lifecycle
- Renderizado de múltiples pantallas

Esto resultaba en un archivo de **397 líneas** difícil de mantener y testear.

## Nueva Arquitectura con Next.js App Router

### 🚀 Estructura de Rutas

La aplicación ahora usa el **App Router de Next.js 13+** con rutas separadas:

```
app/
├── page.tsx              # Página de inicio (home)
├── game/
│   └── page.tsx          # Página del juego
├── settings/
│   └── page.tsx          # Página de configuración
├── credits/
│   └── page.tsx          # Página de créditos
└── layout.tsx            # Layout global
```

### 🎯 Hooks Especializados

#### `useGameScreens.ts`
**Responsabilidad**: Manejo del estado de las pantallas y navegación
- Estado centralizado de todas las pantallas
- Funciones de navegación entre pantallas
- Setters específicos para cada valor del estado

#### `useGameController.ts` 
**Responsabilidad**: Orchestador principal que coordina todos los hooks
- Combina todos los hooks existentes
- Expone una API limpia al componente principal
- Maneja la lógica de coordinación entre diferentes sistemas
- **Auto-start**: Parámetro para iniciar automáticamente el juego

#### `useGameEffects.ts`
**Responsabilidad**: Manejo de efectos y eventos del lifecycle
- Detección de dispositivos móviles
- Manejo de eventos de teclado
- Efectos del game over/won

### 🎨 Componentes Especializados

#### `LoadingScreen.tsx`
**Responsabilidad**: Pantalla de carga
- UI específica para el estado de loading
- Animaciones de carga
- Reutilizable en diferentes contextos

#### `GameScreen.tsx`
**Responsabilidad**: Pantalla principal del juego
- Layout del juego en ejecución
- Composición del canvas, UI y overlays
- Manejo de efectos visuales del fondo

#### `GameOverlay.tsx`
**Responsabilidad**: Overlay de game over/won
- Estadísticas finales del juego
- Botones de acción (reiniciar, volver al inicio)
- UI específica para el final del juego

#### `HomeScreen.tsx` (Actualizado)
**Responsabilidad**: Pantalla de inicio
- Menú principal del juego
- Navegación usando Next.js router
- Display de leaderboard
- Información del juego

### 📱 Páginas Next.js

#### `app/page.tsx` (Página de Inicio)
**Responsabilidades**:
- Renderizado del HomeScreen
- Navegación a otras rutas
- Carga de datos del leaderboard
- **Solo 30 líneas** (reducción del 92%)

#### `app/game/page.tsx` (Página del Juego)
**Responsabilidades**:
- Control total del gameplay
- Auto-inicio del juego
- Manejo de modales (score, share)
- Navegación de regreso al home

#### `app/settings/page.tsx` (Página de Configuración)
**Responsabilidades**:
- Configuración de audio
- Configuración de juego (dificultad, FPS)
- Persistencia en localStorage
- UI consistente con el tema del juego

#### `app/credits/page.tsx` (Página de Créditos)
**Responsabilidades**:
- Información del equipo de desarrollo
- Tecnologías utilizadas
- Agradecimientos
- Información del juego

## Beneficios de la Nueva Arquitectura

### ✅ Principio de Responsabilidad Única
Cada hook, componente y página tiene una responsabilidad bien definida

### ✅ Mejor SEO y Navegación
Cada sección tiene su propia URL, mejorando la experiencia del usuario

### ✅ Mejor Testabilidad  
Cada pieza puede ser testeada de forma aislada

### ✅ Reutilización
Componentes como `LoadingScreen` pueden reutilizarse fácilmente

### ✅ Mantenibilidad
Cambios en una funcionalidad específica solo afectan su módulo correspondiente

### ✅ Legibilidad
Código más fácil de entender y navegar

### ✅ Escalabilidad
Fácil agregar nuevas páginas o funcionalidades

### ✅ Performance
Code splitting automático de Next.js por ruta

## Estructura de Archivos Actualizada

```
app/
├── page.tsx              # Home page (30 líneas)
├── game/page.tsx         # Game page
├── settings/page.tsx     # Settings page  
├── credits/page.tsx      # Credits page
└── layout.tsx            # Global layout

hooks/
├── useGameScreens.ts     # Estado y navegación de pantallas
├── useGameController.ts  # Orchestador principal  
├── useGameEffects.ts     # Efectos y lifecycle
└── ... (hooks existentes)

components/
├── LoadingScreen.tsx     # Pantalla de carga
├── GameScreen.tsx        # Pantalla principal del juego
├── GameOverlay.tsx       # Overlay de game over/won
├── HomeScreen.tsx        # Pantalla de inicio (actualizada)
└── ... (componentes existentes)
```

## Flujo de Navegación

```
/ (home)
├── /game          # Inicia automáticamente el juego
├── /settings      # Configuración del juego
└── /credits       # Información del equipo
```

## Flujo de Datos

```
Página Next.js
    ↓
useGameController (orchestador)
    ↓
├── useGameScreens (estado UI)
├── useGameState (estado del juego)  
├── useAssetLoader (assets)
├── useLeaderboard (scores)
├── useGameAudio (audio)
└── useInputHandlers (input)
    ↓
Componentes especializados
```

## Convenciones de Naming

- **useGame***: Hooks relacionados con la lógica del juego
- **Game*Screen**: Componentes que representan pantallas completas  
- **Game***: Componentes específicos del juego
- **on***: Props que son event handlers
- **set***: Props que son state setters
- **handle***: Funciones de manejo de eventos
- **Page**: Sufijo para páginas de Next.js

## Beneficios del App Router

### 🚀 **Performance**
- Code splitting automático por ruta
- Carga solo el código necesario para cada página

### 🔗 **SEO Friendly**
- URLs amigables (`/game`, `/settings`, `/credits`)
- Mejor indexación por motores de búsqueda

### 🎯 **User Experience**
- Navegación más intuitiva
- URLs que se pueden compartir
- Botón "atrás" del navegador funciona correctamente

### 📱 **Mobile Friendly**
- Navegación nativa del navegador
- Mejor experiencia en dispositivos móviles

## Próximos Pasos Recomendados

1. **Agregar metadata** a cada página para mejor SEO
2. **Implementar loading.tsx** para cada ruta
3. **Crear error.tsx** para manejo de errores por ruta
4. **Agregar TypeScript estricto** a todas las páginas
5. **Crear tests** para cada página y componente
6. **Implementar React.memo** en componentes que lo necesiten
7. **Considerar Server Components** donde sea apropiado
8. **Agregar PWA features** para mejor experiencia móvil 