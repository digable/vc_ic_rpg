# Complete Modularization Guide

## ✅ Completed Modules

### Data Modules (Completed)
1. **constants.js** - Game configuration, colors, settings
2. **data.js** - Items, spells, shops, training, cambus routes  
3. **quests.js** - Quest database with all side quests
4. **enemies.js** - Enemy definitions and stats
5. **maps.js** - Map layouts and NPC positions
6. **game-state.js** - Initial game state

## 🔧 To Complete Full Modularization

The remaining game logic (~2500 lines) from game.js needs to be organized into:

### 7. input.js - Input Handling (~200 lines)
Extract from game.js lines 604-900:
```javascript
export function setupInputHandlers(game, keys, handlers) {
  // Mobile touch setup
  // Keyboard event listeners  
  // handleInput() function with all state-based input logic
}
```

### 8. battle.js - Battle System (~400 lines)
Extract from game.js lines 1376-1710:
```javascript
export function startBattle(game, enemies, maps) { }
export function executeBattleAction(game, spellData) { }
export function executeSpell(game, spellData) { }
export function useItemInBattle(game, consumableItems) { }
export function useItemFromMenu(game, consumableItems) { }
export function applyItemEffect(game, item) { }
export function enemyTurn(game) { }
export function victoryBattle(game) { }
export function gameOver(game) { }
```

### 9. rendering.js - All Drawing Functions (~1500 lines)
Extract from game.js lines 1714-3190:
```javascript
export function drawMap(ctx, game, maps, COLORS, tileColors) { }
export function drawPlayer(ctx, game, COLORS) { }
export function drawNPCs(ctx, game, maps, COLORS, questDatabase) { }
export function drawNPC(ctx, npc, COLORS) { }
export function drawHUD(ctx, game, COLORS) { }
export function drawDialogue(ctx, game, COLORS) { }
export function drawBattle(ctx, game, COLORS, spellData) { }
export function drawEnemySprite(ctx, enemy, x, y, COLORS) { }
export function drawMenu(ctx, game, COLORS, maps) { }
export function drawShop(ctx, game, COLORS, shopItems) { }
export function drawMagicTrainer(ctx, game, COLORS, magicTraining) { }
export function drawYoga(ctx, game, COLORS, yogaTechniques) { }
export function drawCambus(ctx, game, COLORS, cambusRoutes, maps) { }
export function drawFoodCart(ctx, game, COLORS, consumableItems) { }
```

### 10. interactions.js - NPC & Shop Interactions (~400 lines)
Extract shop, magic trainer, yoga, cambus, food cart functions:
```javascript
export function checkNPCInteraction(game, maps, questDatabase) { }
export function getNearbyNPC(game, maps) { }
export function startDialogue(game, dialogue) { }
export function handleShopPurchase(game, shopItems) { }
export function handleMagicTraining(game, magicTraining) { }
export function handleYogaTraining(game, yogaTechniques) { }
export function handleCambusTravel(game, cambusRoutes) { }
export function handleFoodCartPurchase(game, consumableItems) { }
```

### 11. quests-logic.js - Quest Management (~200 lines)
Extract quest functions:
```javascript
export function offerQuest(game, questDatabase, questId) { }
export function canCompleteQuest(game, activeQuest) { }
export function completeQuest(game, questDatabase, consumableItems, questId) { }
export function updateQuestProgress(game, type, value) { }
```

### 12. main.js - Game Loop & Initialization (~150 lines)
```javascript
import * as modules from './all-modules.js';

// Setup
// Input handling setup
// Game loop
function gameLoop() {
  handleInput();
  updateGame();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
```

## Quick Implementation Steps

1. **Create each module file** - Copy relevant functions from game.js
2. **Add exports** - Prefix functions with `export`
3. **Update imports** - Each module imports what it needs
4. **Create main.js** - Imports all modules and runs game loop
5. **Update index.html** - Change to `<script type="module" src="js/main.js"></script>`
6. **Test thoroughly** - Ensure all functionality works

## Helper Script

Run this to extract sections:
```bash
# Extract input handling
sed -n '604,900p' game.js > js/input-raw.txt

# Extract battle system  
sed -n '1376,1710p' game.js > js/battle-raw.txt

# Extract rendering
sed -n '1714,3190p' game.js > js/rendering-raw.txt

# Then add exports and imports to each file
```

## Current Working State

- ✅ **game.js** - Original monolithic version (WORKS)
- ✅ **Data modules** - All extracted and ready
- ⏳ **Logic modules** - Need to be created from game.js
- ⏳ **main.js** - Needs to import and coordinate all modules

## Benefits After Complete Modularization

- **10 files** instead of 1 giant 3000+ line file
- **Easy debugging** - Find issues faster
- **Team collaboration** - Multiple people can work simultaneously  
- **Code reuse** - Import specific modules where needed
- **Maintenance** - Update one system without touching others
