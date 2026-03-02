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
let canvasRef = null;

function setSmoothingEnabled(enabled) {
  ctx.imageSmoothingEnabled = enabled;
  ctx.webkitImageSmoothingEnabled = enabled;
  ctx.mozImageSmoothingEnabled = enabled;
  ctx.msImageSmoothingEnabled = enabled;
}

export function applyGraphicsQuality(quality = 'low') {
  if (!canvasRef || !ctx) return quality === 'high' ? 'high' : 'low';

  const resolvedQuality = quality === 'high' ? 'high' : 'low';
  const highQuality = resolvedQuality === 'high';
  const renderScale = highQuality ? 2 : 1;

  canvasRef.width = 256 * renderScale;
  canvasRef.height = 240 * renderScale;

  ctx.setTransform(renderScale, 0, 0, renderScale, 0, 0);
  setSmoothingEnabled(highQuality);

  return resolvedQuality;
}

export function setupCanvas() {
  const canvas = document.getElementById('game-canvas');
  canvasRef = canvas;
  ctx = canvas.getContext('2d');

  applyGraphicsQuality(game.graphicsQuality);
  
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
