# 🔮 Sistema de Habilidades - Mystic Realm Defender

## 📋 Resumen General

El sistema de habilidades en **Mystic Realm Defender** está basado en un **marketplace arcano** que aparece entre oleadas, donde el jugador puede gastar **cristales** para mejorar las capacidades de su mago. El sistema actual incluye dos categorías principales de mejoras: **Hechizos** y **Salud**.

## 🏗️ Arquitectura del Sistema

### 📁 Archivos Principales
- **`components/Marketplace.tsx`** - Interfaz del marketplace
- **`hooks/useGameState.ts`** - Lógica de upgrades (líneas 179-237)
- **`utils/marketplace.ts`** - Cálculos de costos
- **`constants/game.ts`** - Configuración de valores base
- **`types/game.ts`** - Definición de interfaces

### 🔧 Estructura de Datos

```typescript
interface PlayerUpgrades {
  spellDamage: number;      // Daño base de hechizos
  maxHealth: number;        // Vida máxima del jugador
  spellLevel: number;       // Nivel de mejora de hechizos (0-5)
  healthLevel: number;      // Nivel de mejora de salud (0-5)
  projectileCount: number;  // Cantidad de proyectiles por cast
  projectileSize: number;   // Tamaño de proyectiles (multiplicador)
  castRate: number;         // Tiempo entre hechizos (ms)
  spread: number;           // Dispersión angular (radianes)
}
```

## 🪄 Sistema de Hechizos

### 📊 Valores Base
```typescript
BASE_SPELL_DAMAGE = 25          // Daño inicial
BASE_PROJECTILE_COUNT = 1       // Un proyectil por defecto
BASE_PROJECTILE_SIZE = 1.0      // Tamaño normal
BASE_CAST_RATE = 250           // 250ms entre hechizos
BASE_SPREAD = 0                // Sin dispersión inicial
```

### 💰 Sistema de Costos
- **Costo base**: 6 cristales
- **Multiplicador**: 1.8x por nivel
- **Fórmula**: `Math.round(6 * 1.8^nivelActual)`

| Nivel | Costo | Costo Acumulado |
|-------|-------|-----------------|
| 0→1   | 6     | 6               |
| 1→2   | 11    | 17              |
| 2→3   | 20    | 37              |
| 3→4   | 36    | 73              |
| 4→5   | 65    | 138             |

### 🎯 Progresión por Niveles

#### **Nivel 0 → 1: Velocidad Arcana**
```typescript
spellDamage += 12        // 25 → 37
castRate = 200          // 250ms → 200ms (25% más rápido)
```
- **Beneficio**: Lanzamiento más rápido
- **Velocidad**: 5.0 hechizos/segundo

#### **Nivel 1 → 2: Proyección Dual**
```typescript
spellDamage += 12        // 37 → 49
projectileCount = 2      // Doble proyectil
spread = 0.2            // Dispersión de 0.2 radianes
castRate = 180          // 200ms → 180ms
```
- **Beneficio**: Dos hechizos simultáneos con dispersión
- **Velocidad**: 5.6 hechizos/segundo

#### **Nivel 2 → 3: Amplificación Mística**
```typescript
spellDamage += 12        // 49 → 61
projectileSize = 1.5     // 50% más grande
castRate = 160          // 180ms → 160ms
```
- **Beneficio**: Proyectiles más grandes y rápidos
- **Velocidad**: 6.25 hechizos/segundo

#### **Nivel 3 → 4: Tríada Arcana**
```typescript
spellDamage += 12        // 61 → 73
projectileCount = 3      // Triple proyectil
spread = 0.3            // Mayor dispersión
castRate = 150          // 160ms → 150ms
```
- **Beneficio**: Tres hechizos simultáneos
- **Velocidad**: 6.7 hechizos/segundo

#### **Nivel 4 → 5: Poder Supremo**
```typescript
spellDamage += 12        // 73 → 85
projectileCount = 4      // Cuádruple proyectil
spread = 0.4            // Máxima dispersión
projectileSize = 2.0     // Doble tamaño
castRate = 120          // 150ms → 120ms
```
- **Beneficio**: Máximo poder arcano
- **Velocidad**: 8.3 hechizos/segundo

## ❤️ Sistema de Salud

### 📊 Valores Base
```typescript
BASE_MAX_HEALTH = 100      // Vida inicial
HEALTH_INCREASE = 20       // Incremento por nivel
```

### 💰 Sistema de Costos
- **Costo base**: 5 cristales
- **Multiplicador**: 1.8x por nivel
- **Fórmula**: `Math.round(5 * 1.8^nivelActual)`

| Nivel | Costo | Vida Total | Costo Acumulado |
|-------|-------|------------|-----------------|
| 0→1   | 5     | 120        | 5               |
| 1→2   | 9     | 140        | 14              |
| 2→3   | 16    | 160        | 30              |
| 3→4   | 29    | 180        | 59              |
| 4→5   | 52    | 200        | 111             |

### 🔄 Mecánica de Mejora
```typescript
player.upgrades.maxHealth += HEALTH_INCREASE;
player.health = player.upgrades.maxHealth; // Restaura vida completa
```

## 🎮 Implementación en el Juego

### 🔄 Flujo de Upgrade
1. **Trigger**: Al completar una oleada
2. **Condición**: `gameState.showMarketplace = true`
3. **Validación**: Verificar cristales suficientes y nivel máximo
4. **Aplicación**: Actualizar stats del jugador
5. **Persistencia**: Los upgrades se mantienen durante toda la partida

### 🎯 Lógica de Disparo
```typescript
// En useInputHandlers.ts - Spacebar handling
if (now - lastCastTimeRef.current > player.upgrades.castRate) {
  if (projectileCount === 1) {
    // Hechizo simple
    createSingleProjectile();
  } else {
    // Múltiples hechizos con dispersión
    for (let i = 0; i < projectileCount; i++) {
      const angleOffset = calculateSpread(i, projectileCount, spread);
      createProjectileWithAngle(angleOffset);
    }
  }
}
```

### 📐 Cálculo de Dispersión
```typescript
// Para 2 proyectiles
angleOffset = (i - 0.5) * spread;

// Para 3+ proyectiles
angleOffset = (i - (projectileCount - 1) / 2) * (spread / (projectileCount - 1));
```

## 🎨 Interfaz de Usuario

### 🖼️ Componente Marketplace
- **Ubicación**: Modal overlay durante transición de oleadas
- **Información mostrada**:
  - Cristales actuales del jugador
  - Costo de cada mejora
  - Nivel actual y máximo
  - Preview de beneficios futuros
  - Stats actuales (velocidad, proyectiles, tamaño)

### 📱 Responsive Design
- **Mobile**: Layout compacto con información esencial
- **Desktop**: Información completa con previews detallados
- **Estados**: Botones deshabilitados cuando no hay cristales o nivel máximo

## 🔧 Configuración y Balanceo

### ⚖️ Constantes Clave
```typescript
MAX_UPGRADE_LEVEL = 5           // Nivel máximo para ambos tipos
SPELL_DAMAGE_INCREASE = 12      // Incremento de daño por nivel
UPGRADE_COST_MULTIPLIER = 1.8   // Escalado exponencial de costos
```

### 🎯 Puntos de Balanceo
1. **Costos exponenciales** previenen upgrades demasiado rápidos
2. **Niveles limitados** mantienen progresión finita
3. **Beneficios escalonados** crean decisiones estratégicas
4. **Restauración de vida** en upgrade de salud incentiva timing

## 🚀 Oportunidades de Refactorización

### 🔄 Problemas Actuales
1. **Lógica hardcodeada** en switch statements
2. **Acoplamiento fuerte** entre UI y lógica de negocio
3. **Escalado lineal** de algunos beneficios
4. **Falta de variedad** en tipos de mejoras

### 💡 Mejoras Sugeridas
1. **Sistema basado en configuración** JSON/YAML
2. **Árbol de habilidades** con dependencias
3. **Efectos especiales** (críticos, penetración, etc.)
4. **Mejoras temporales** vs permanentes
5. **Sinergias** entre diferentes tipos de upgrades

## 📊 Métricas de Rendimiento

### 🎯 DPS Teórico por Nivel
| Nivel | Daño | Proyectiles | Velocidad | DPS Total |
|-------|------|-------------|-----------|-----------|
| 0     | 25   | 1          | 4.0/s     | 100       |
| 1     | 37   | 1          | 5.0/s     | 185       |
| 2     | 49   | 2          | 5.6/s     | 549       |
| 3     | 61   | 2          | 6.25/s    | 763       |
| 4     | 73   | 3          | 6.7/s     | 1,467     |
| 5     | 85   | 4          | 8.3/s     | 2,822     |

### 📈 Escalado de Poder
- **Nivel 1**: +85% DPS
- **Nivel 2**: +197% DPS adicional
- **Nivel 3**: +39% DPS adicional
- **Nivel 4**: +92% DPS adicional
- **Nivel 5**: +92% DPS adicional

---

*Documentación generada para refactorización del sistema de habilidades*
*Mystic Realm Defender - Vibe Gaming Team* 