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

## Nueva Arquitectura

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

### 📱 Componente Principal Simplificado

#### `app/page.tsx` (Nuevo)
**Responsabilidades reducidas**:
- Únicamente orchestración de alto nivel
- Renderizado condicional basado en el estado
- Pasaje de props a componentes especializados
- **Solo 78 líneas** (reducción del 80%)

## Beneficios de la Nueva Arquitectura

### ✅ Principio de Responsabilidad Única
Cada hook y componente tiene una responsabilidad bien definida

### ✅ Mejor Testabilidad  
Cada pieza puede ser testeada de forma aislada

### ✅ Reutilización
Componentes como `LoadingScreen` pueden reutilizarse fácilmente

### ✅ Mantenibilidad
Cambios en una funcionalidad específica solo afectan su módulo correspondiente

### ✅ Legibilidad
Código más fácil de entender y navegar

### ✅ Escalabilidad
Fácil agregar nuevas pantallas o funcionalidades

## Estructura de Archivos

```
hooks/
├── useGameScreens.ts      # Estado y navegación de pantallas
├── useGameController.ts   # Orchestador principal  
├── useGameEffects.ts      # Efectos y lifecycle
└── ... (hooks existentes)

components/
├── LoadingScreen.tsx      # Pantalla de carga
├── GameScreen.tsx         # Pantalla principal del juego
├── GameOverlay.tsx        # Overlay de game over/won
└── ... (componentes existentes)

app/
└── page.tsx              # Orchestador principal (simplificado)
```

## Flujo de Datos

```
page.tsx
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

## Próximos Pasos Recomendados

1. **Agregar TypeScript estricto** a todos los hooks nuevos
2. **Crear tests unitarios** para cada hook y componente
3. **Implementar React.memo** en componentes que lo necesiten
4. **Considerar Context API** si el prop drilling se vuelve problemático
5. **Documentar interfaces** de todos los componentes nuevos 