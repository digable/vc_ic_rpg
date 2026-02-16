// Rendering Module Index - Central export point for all rendering functions
import { COLORS, tileColors } from '../constants.js';
import { game } from '../game-state.js';

// Import all rendering functions
import { drawMap, drawPlayer, drawNPCs, drawNPC } from './world.js';
import { drawHUD, drawDialogue, drawMenu } from './ui.js';
import { drawBattle, drawEnemySprite } from './battle.js';
import { drawShop, drawMagicTrainer, drawYoga, drawCambus, drawFoodCart } from './vendors.js';
import { drawGameOver } from './gamestate.js';
import { setCtx, wrapText, getButtonLabel, getMenuLabel } from './utils.js';

// Export canvas setup
export let ctx;

export function setupCanvas() {
  const canvas = document.getElementById('game-canvas');
  ctx = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 240;
  
  ctx.imageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  
  // Set context in utils module as well
  setCtx(ctx);
  
  return { canvas, ctx };
}

// Re-export all rendering functions for backward compatibility
export { drawMap, drawPlayer, drawNPCs, drawNPC };
export { drawHUD, drawDialogue, drawMenu };
export { drawBattle, drawEnemySprite };
export { drawShop, drawMagicTrainer, drawYoga, drawCambus, drawFoodCart };
export { drawGameOver };
export { wrapText, getButtonLabel, getMenuLabel };
