// Iowa City Quest - Main Coordinator
// This file imports all modules and runs the game loop

import { COLORS, CONFIG } from './constants.js';
import { game } from './game-state.js';
import { setupInputHandlers, handleInput } from './input.js';
import { setupCanvas, ctx } from './rendering.js';
import { 
  drawMap, 
  drawPlayer, 
  drawNPCs, 
  drawHUD, 
  drawDialogue, 
  drawBattle, 
  drawMenu, 
  drawShop, 
  drawMagicTrainer, 
  drawYoga, 
  drawCambus, 
  drawFoodCart 
} from './rendering.js';

console.log('Iowa City Quest - Modular version loading...');
console.log('All modules imported successfully!');

// Setup
const { canvas } = setupCanvas();
setupInputHandlers();

// Game loop
function gameLoop() {
  // Handle input
  handleInput();
  
  // Check for level up
  const expNeeded = game.player.level * 50;
  if (game.player.exp >= expNeeded) {
    game.player.level++;
    game.player.exp -= expNeeded;
    game.player.maxHp += 10;
    game.player.hp += 10;
    game.player.maxMp += 5;
    game.player.mp += 5;
    game.player.attack += 2;
    game.player.magic += 1;
    game.player.defense += 1;
  }
  
  // Clear screen
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Render based on state
  if (game.state === 'explore' || game.state === 'dialogue') {
    drawMap(ctx);
    drawPlayer(ctx);
    drawNPCs(ctx);
    drawHUD(ctx);
    
    if (game.dialogue) {
      drawDialogue(ctx);
    }
    
    if (game.menuOpen) {
      drawMenu(ctx);
    }
  } else if (game.state === 'battle') {
    drawBattle(ctx);
  } else if (game.state === 'menu') {
    drawMap(ctx);
    drawPlayer(ctx);
    drawNPCs(ctx);
    drawMenu(ctx);
  } else if (game.state === 'shop') {
    drawShop(ctx);
  } else if (game.state === 'magic_trainer') {
    drawMagicTrainer(ctx);
  } else if (game.state === 'yoga') {
    drawYoga(ctx);
  } else if (game.state === 'cambus') {
    drawCambus(ctx);
  } else if (game.state === 'food_cart') {
    drawFoodCart(ctx);
  }
  
  // Animation frame
  game.animFrame++;
  
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();

console.log('Game started!');
