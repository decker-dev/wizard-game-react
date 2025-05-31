# Game Architecture Documentation

## Overview
Este juego de Boxhead Zombie Siege ha sido refactorizado en una arquitectura modular para mejorar la mantenibilidad, reutilización y organización del código.

## Structure

### 📁 `/types/`
Contiene todas las definiciones de tipos TypeScript del juego.

- **`game.ts`** - Interfaces principales como `Vector2`, `Player`, `Zombie`, `Projectile`, `GameState`, etc.

### 📁 `/constants/`
Contiene todas las constantes de configuración del juego.

- **`game.ts`** - Configuraciones como dimensiones del canvas, velocidades, estadísticas de jugador/zombies, etc.

### 📁 `/data/`
Contiene datos estáticos del juego.

- **`obstacles.ts`** - Configuración de obstáculos del mapa

### 📁 `/utils/`
Funciones utilitarias reutilizables.

- **`math.ts`** - Funciones matemáticas como `normalize`, `distance`, `checkAABBCollision`, `getEntityRect`

### 📁 `/game/`
Lógica principal del juego dividida por responsabilidades.

- **`Player.ts`** - Lógica del jugador: creación, actualización, movimiento
- **`Zombies.ts`** - Lógica de zombies: spawn, IA, tipos diferentes, sprites
- **`Projectiles.ts`** - Lógica de proyectiles: creación, movimiento, colisiones con obstáculos
- **`Collisions.ts`** - Sistema de detección de colisiones entre entidades
- **`Renderer.ts`** - Sistema de renderizado del canvas, minimapa, UI en juego

### 📁 `/hooks/`
Custom hooks de React para manejo de estado y efectos.

- **`useGameState.ts`** - Manejo del estado principal del juego y transiciones de waves
- **`useAssetLoader.ts`** - Carga asíncrona de sprites y assets
- **`useInputHandlers.ts`** - Manejo de eventos de teclado y mouse

### 📁 `/components/`
Componentes React reutilizables.

- **`GameCanvas.tsx`** - Componente del canvas principal con game loop
- **`GameUI.tsx`** - Interfaz de usuario, overlays, información del juego

### 📁 `/app/`
Componente principal de la aplicación.

- **`page.tsx`** - Componente principal orquestador, mucho más limpio y enfocado

## Benefits of This Architecture

### 🎯 **Separation of Concerns**
Cada módulo tiene una responsabilidad específica y bien definida.

### 🔄 **Reusability**
Funciones utilitarias y hooks pueden ser reutilizados fácilmente.

### 🧪 **Testability**
Cada módulo puede ser probado independientemente.

### 📈 **Scalability**
Fácil añadir nuevas características sin afectar otros módulos.

### 🔧 **Maintainability**
Cambios en un módulo no afectan otros, código más fácil de entender y modificar.

### 👥 **Team Development**
Diferentes desarrolladores pueden trabajar en diferentes módulos sin conflictos.

## Usage Examples

### Adding a New Enemy Type
1. Actualizar el tipo `Zombie` en `/types/game.ts`
2. Añadir constantes en `/constants/game.ts`
3. Actualizar la lógica en `/game/Zombies.ts`
4. Actualizar sprites en `/game/Renderer.ts`

### Adding New Game Mechanics
1. Definir tipos en `/types/game.ts`
2. Crear hook específico en `/hooks/`
3. Crear módulo de lógica en `/game/`
4. Integrar en componentes

### Modifying UI
1. Actualizar `/components/GameUI.tsx`
2. Añadir nuevos componentes según necesidad

## Key Design Principles

- **Single Responsibility**: Cada archivo/función tiene una responsabilidad clara
- **Dependency Injection**: Los módulos reciben sus dependencias como parámetros
- **Immutability**: Se evitan mutaciones innecesarias del estado
- **Type Safety**: TypeScript fuerte en toda la aplicación
- **Performance**: Game loop optimizado y renderizado eficiente 