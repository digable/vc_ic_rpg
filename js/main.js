// Iowa City Quest - Main Coordinator
// This file imports all modules and runs the game loop

import { COLORS, CONFIG } from './constants.js';
import { game, actions, setActionDebugEnabled, isActionDebugEnabled } from './game-state.js';
import { setupInputHandlers, handleInput } from './input.js';
import { maps } from './maps.js';
import { cambusRoutes } from './data.js';
import { loadGameFromLocal } from './save.js';
import {
  setBackgroundMusicMode,
  triggerBattleMusicCue,
  triggerExploreMusicCue,
  triggerDeathMusicCue
} from './features/music/index.js';
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

// Make game modules available to tests
window.gameModules = { maps, cambusRoutes };
window.debugActions = {
  setActionDebugEnabled,
  isActionDebugEnabled
};

console.log('Iowa City Quest - Modular version loading...');
console.log('All modules imported successfully!');
console.log('Test modules available: window.gameModules');

// Setup
const { canvas, ctx } = setupCanvas();
setupInputHandlers();

// Do not auto-load saved games on page reload
// Game starts fresh, user can load saves manually from menu
// const loadedFromSave = loadGameFromLocal();
// if (loadedFromSave.success) {
//   console.log('Loaded local save data.');
// }

// Game loop
let previousState = game.state;

function gameLoop() {
  // Handle input
  handleInput();

  if (previousState !== 'battle' && game.state === 'battle') {
    triggerBattleMusicCue();
  }
  if (previousState === 'battle' && game.state !== 'battle' && game.state !== 'gameOver') {
    triggerExploreMusicCue();
  }
  if (previousState !== 'gameOver' && game.state === 'gameOver') {
    triggerDeathMusicCue();
  }

  // Adaptive music mood
  if (game.state === 'gameOver') {
    setBackgroundMusicMode('death');
  } else if (game.state === 'battle') {
    setBackgroundMusicMode('adventure');
  } else {
    setBackgroundMusicMode('explore');
  }

  // Show deferred level-up dialogue only after battle teardown is fully complete
  if (
    game.state === 'explore' &&
    previousState !== 'battle' &&
    !game.battleState &&
    !game.dialogue &&
    game.pendingLevelUp
  ) {
    const levelUpData = game.pendingLevelUp;
    actions.pendingLevelUpSet(null);
    actions.levelUpDialogSet(levelUpData);
    actions.dialogueStarted([
      `LEVEL UP!\nYou have reached Level ${levelUpData.level}!\n\nHP: +${levelUpData.hpGain} | MP: +${levelUpData.mpGain}\nATK: +${levelUpData.attackGain} | MAG: +${levelUpData.magicGain} | DEF: +${levelUpData.defenseGain}`
    ], {
      type: 'levelUp'
    });
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
  previousState = game.state;
  
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();

console.log('Game started!');
