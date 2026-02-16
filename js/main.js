// Iowa City Quest - Main Coordinator
// This file imports all modules and runs the game loop

import { COLORS, CONFIG } from './constants.js';
import { game } from './game-state.js';
import { setupInputHandlers, handleInput } from './input.js';
import { 
  setupCanvas,
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
  drawFoodCart,
  drawGameOver 
} from './rendering/index.js';

console.log('Iowa City Quest - Modular version loading...');
console.log('All modules imported successfully!');

// Setup
const { canvas, ctx } = setupCanvas();
setupInputHandlers();

// Game loop
function gameLoop() {
  // Handle input
  handleInput();
  
  // Check for level up
  const expNeeded = game.player.level * 50;
  if (game.player.exp >= expNeeded && !game.levelUpDialog) {
    const oldMaxHp = game.player.maxHp;
    const oldMaxMp = game.player.maxMp;
    const oldAttack = game.player.attack;
    const oldMagic = game.player.magic;
    const oldDefense = game.player.defense;
    
    game.player.level++;
    game.player.exp -= expNeeded;
    game.player.maxHp += 10;
    game.player.hp += 10;
    game.player.maxMp += 5;
    game.player.mp += 5;
    game.player.attack += 2;
    game.player.magic += 1;
    game.player.defense += 1;
    
    // Store level up info for dialogue
    game.levelUpDialog = {
      level: game.player.level,
      hpGain: 10,
      mpGain: 5,
      attackGain: 2,
      magicGain: 1,
      defenseGain: 1
    };
    
    // Show level up dialogue
    game.state = 'dialogue';
    game.dialogue = {
      type: 'levelUp',
      messages: [
        `LEVEL UP!\nYou have reached Level ${game.player.level}!\n\nHP: +10 | MP: +5\nATK: +2 | MAG: +1 | DEF: +1`
      ],
      currentIndex: 0
    };
  }
  
  // Clear screen
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Render based on state
  if (game.state === 'explore' || game.state === 'dialogue') {
    drawMap();
    drawPlayer();
    drawNPCs();
    drawHUD();
    
    if (game.dialogue) {
      drawDialogue();
    }
    
    if (game.menuOpen) {
      drawMenu();
    }
  } else if (game.state === 'battle') {
    drawBattle();
  } else if (game.state === 'menu') {
    drawMap();
    drawPlayer();
    drawNPCs();
    drawMenu();
  } else if (game.state === 'shop') {
    drawShop();
  } else if (game.state === 'magic_trainer') {
    drawMagicTrainer();
  } else if (game.state === 'yoga') {
    drawYoga();
  } else if (game.state === 'cambus') {
    drawCambus();
  } else if (game.state === 'food_cart') {
    drawFoodCart();
  } else if (game.state === 'gameOver') {
    drawGameOver();
  }
  
  // Animation frame
  game.animFrame++;
  
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();

console.log('Game started!');
