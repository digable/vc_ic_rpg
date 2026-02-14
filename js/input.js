// Input Handling Module
import { game } from './game-state.js';
import { CONFIG, isMobile } from './constants.js';
import { cambusRoutes, consumableItems, shopItems, magicTraining, yogaTechniques } from './data.js';
import { 
  openShop, 
  openMagicTrainer, 
  openYoga, 
  openCambus, 
  handleShopPurchase,
  handleMagicTraining,
  handleYogaTraining,
  handleFoodCartPurchase,
  handleCambusTravel,
  healPlayer
} from './interactions.js';
import { advanceDialogue } from './dialogue.js';
import { executeBattleAction, startBattle, executeSpell, useItemFromMenu } from './battle.js';
import { checkNPCInteraction, getNearbyNPC, updateQuestProgress } from './quests-logic.js';
import { checkMapTransition, checkCollision, openFoodCart } from './world.js';

// Input state
export const keys = {};
export let lastKeyTime = 0;
export const keyDelay = CONFIG.keyDelay;
export let spacePressed = false;

export function setLastKeyTime(time) {
  lastKeyTime = time;
}

export function setSpacePressed(value) {
  spacePressed = value;
}

export function setupInputHandlers() {
  // Mobile touch control setup
  if (isMobile) {
    document.getElementById('mobile-controls').classList.add('active');
    
    // Update title screen text for mobile
    document.getElementById('start-text').textContent = 'PRESS A BUTTON TO START';
    document.getElementById('controls-text').textContent = 'D-PAD: Move | A: Action | M: Menu';
    
    // Handle touch events for virtual buttons
    document.querySelectorAll('.dpad-btn, .action-btn').forEach(btn => {
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const key = btn.dataset.key;
        
        if (key === 'up') keys['ArrowUp'] = true;
        else if (key === 'down') keys['ArrowDown'] = true;
        else if (key === 'left') keys['ArrowLeft'] = true;
        else if (key === 'right') keys['ArrowRight'] = true;
        else if (key === 'action') {
          keys[' '] = true;
          spacePressed = true;
          
          // Handle title screen start on mobile
          if (game.state === 'title') {
            document.getElementById('title-screen').classList.add('hidden');
            game.state = 'explore';
          }
        }
        else if (key === 'menu') keys['Escape'] = true;
      });
      
      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const key = btn.dataset.key;
        
        if (key === 'up') keys['ArrowUp'] = false;
        else if (key === 'down') keys['ArrowDown'] = false;
        else if (key === 'left') keys['ArrowLeft'] = false;
        else if (key === 'right') keys['ArrowRight'] = false;
        else if (key === 'action') {
          keys[' '] = false;
          spacePressed = false;
        }
        else if (key === 'menu') keys['Escape'] = false;
      });
      
      btn.addEventListener('touchcancel', (e) => {
        const key = btn.dataset.key;
        
        if (key === 'up') keys['ArrowUp'] = false;
        else if (key === 'down') keys['ArrowDown'] = false;
        else if (key === 'left') keys['ArrowLeft'] = false;
        else if (key === 'right') keys['ArrowRight'] = false;
        else if (key === 'action') {
          keys[' '] = false;
          spacePressed = false;
        }
        else if (key === 'menu') keys['Escape'] = false;
      });
    });
    
    // Prevent scrolling only on the control area
    document.getElementById('mobile-controls').addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      if (spacePressed) return;
      spacePressed = true;
    }
    keys[e.key] = true;
    
    if (game.state === 'title' && e.key === ' ') {
      document.getElementById('title-screen').classList.add('hidden');
      game.state = 'explore';
    }
  });

  document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    if (e.key === ' ') spacePressed = false;
  });
}

export function handleInput() {
  const now = Date.now();
  
  // Special handling for cambus menu - arrow keys should work immediately
  if (game.state === 'cambus') {
    if (keys['ArrowUp']) {
      game.cambusSelection = Math.max(0, game.cambusSelection - 1);
      keys['ArrowUp'] = false; // Prevent repeat
    }
    if (keys['ArrowDown']) {
      game.cambusSelection = Math.min(cambusRoutes.length, game.cambusSelection + 1);
      keys['ArrowDown'] = false; // Prevent repeat
    }
    if (keys[' '] && now - lastKeyTime > keyDelay) {
      handleCambusTravel();
      lastKeyTime = now;
    }
    if (keys['Escape'] && now - lastKeyTime > keyDelay) {
      game.state = 'explore';
      game.cambusOpen = false;
      lastKeyTime = now;
    }
    return;
  }
  
  // Escape key should always work to toggle menu or exit dialogs
  if (game.state === 'explore' && keys['Escape']) {
    if (now - lastKeyTime > keyDelay) {
      game.menuOpen = !game.menuOpen;
      if (game.menuOpen) {
        game.menuSelection = 0;
        game.menuTab = 0;
      }
      lastKeyTime = now;
    }
    return;
  }
  
  if (game.state === 'dialogue' && keys['Escape']) {
    if (now - lastKeyTime > keyDelay) {
      game.dialogue = null;
      game.state = 'explore';
      lastKeyTime = now;
    }
    return;
  }
  
  if (now - lastKeyTime < keyDelay) return;

  if (game.state === 'explore') {
    const speed = 16;
    let newX = game.player.x;
    let newY = game.player.y;
    let moved = false;

    // Only allow movement if menu is closed
    if (!game.menuOpen) {
      if (keys['ArrowUp']) {
        newY -= speed;
        game.player.facing = 'up';
        moved = true;
      }
      if (keys['ArrowDown']) {
        newY += speed;
        game.player.facing = 'down';
        moved = true;
      }
      if (keys['ArrowLeft']) {
        newX -= speed;
        game.player.facing = 'left';
        moved = true;
      }
      if (keys['ArrowRight']) {
        newX += speed;
        game.player.facing = 'right';
        moved = true;
      }
    }

    if (moved) {
      if (!checkCollision(newX, newY)) {
        game.player.x = newX;
        game.player.y = newY;
        lastKeyTime = now;
        game.enemyEncounterSteps++;
        
        // Check for map transitions
        checkMapTransition();
        
        // Update quest progress for location visits
        updateQuestProgress('visit_location', game.map);
        
        // Random encounters
        if (game.enemyEncounterSteps > 10 && Math.random() < 0.15) {
          startBattle();
          game.enemyEncounterSteps = 0;
        }
      }
    }

    if (keys[' ']) {
      if (now - lastKeyTime > keyDelay && !game.menuOpen) {
        const npc = checkNPCInteraction();
        if (npc) {
          if (npc.type === 'shop') {
            openShop();
          } else if (npc.type === 'healer') {
            healPlayer();
          } else if (npc.type === 'magic_trainer') {
            openMagicTrainer();
          } else if (npc.type === 'yoga') {
            openYoga();
          } else if (npc.type === 'cambus') {
            openCambus();
          } else if (npc.type === 'food_cart') {
            openFoodCart(npc.name);
          }
        }
        lastKeyTime = now;
      }
    }

    if (game.menuOpen) {
      if (keys['ArrowLeft']) {
        game.menuTab = Math.max(0, game.menuTab - 1);
        lastKeyTime = now;
      }
      if (keys['ArrowRight']) {
        game.menuTab = Math.min(2, game.menuTab + 1);
        lastKeyTime = now;
      }
      if (keys['ArrowUp'] && game.menuTab === 2) {
        game.itemMenuSelection = Math.max(0, game.itemMenuSelection - 1);
        lastKeyTime = now;
      }
      if (keys['ArrowDown'] && game.menuTab === 2) {
        game.itemMenuSelection = Math.min(game.consumables.length - 1, game.itemMenuSelection + 1);
        lastKeyTime = now;
      }
      if (keys[' '] && game.menuTab === 2 && game.consumables.length > 0) {
        if (now - lastKeyTime > keyDelay) {
          useItemFromMenu();
          lastKeyTime = now;
        }
      }
    }
  } else if (game.state === 'dialogue') {
    if (keys[' ']) {
      if (now - lastKeyTime > keyDelay) {
        advanceDialogue();
        if (!game.dialogue) {
          game.state = 'explore';
        }
        lastKeyTime = now;
      }
    }
  } else if (game.state === 'battle') {
    if (game.battleState.inSpellMenu) {
      // Spell menu navigation
      if (keys['ArrowUp']) {
        game.battleState.selectedSpell = Math.max(0, game.battleState.selectedSpell - 1);
        lastKeyTime = now;
      }
      if (keys['ArrowDown']) {
        game.battleState.selectedSpell = Math.min(game.spells.length, game.battleState.selectedSpell + 1);
        lastKeyTime = now;
      }
      if (keys[' ']) {
        if (now - lastKeyTime > keyDelay) {
          executeSpell();
          lastKeyTime = now;
        }
      }
      if (keys['Escape']) {
        game.battleState.inSpellMenu = false;
        game.battleState.selectedSpell = 0;
        lastKeyTime = now;
      }
    } else if (game.battleState.inItemMenu) {
      // Item menu navigation
      if (keys['ArrowUp']) {
        game.battleState.selectedItem = Math.max(0, game.battleState.selectedItem - 1);
        lastKeyTime = now;
      }
      if (keys['ArrowDown']) {
        game.battleState.selectedItem = Math.min(game.consumables.length, game.battleState.selectedItem + 1);
        lastKeyTime = now;
      }
      if (keys[' ']) {
        if (now - lastKeyTime > keyDelay) {
          useItemInBattle();
          lastKeyTime = now;
        }
      }
      if (keys['Escape']) {
        game.battleState.inItemMenu = false;
        game.battleState.selectedItem = 0;
        lastKeyTime = now;
      }
    } else {
      // Main battle menu
      if (keys['ArrowUp']) {
        game.battleState.selectedAction = Math.max(0, game.battleState.selectedAction - 1);
        lastKeyTime = now;
      }
      if (keys['ArrowDown']) {
        game.battleState.selectedAction = Math.min(3, game.battleState.selectedAction + 1);
        lastKeyTime = now;
      }
      if (keys[' ']) {
        if (now - lastKeyTime > keyDelay) {
          executeBattleAction();
          lastKeyTime = now;
        }
      }
    }
  } else if (game.state === 'shop') {
    if (keys['ArrowUp']) {
      game.shopSelection = Math.max(0, game.shopSelection - 1);
      lastKeyTime = now;
    }
    if (keys['ArrowDown']) {
      game.shopSelection = Math.min(shopItems.length, game.shopSelection + 1);
      lastKeyTime = now;
    }
    if (keys[' ']) {
      if (now - lastKeyTime > keyDelay) {
        handleShopPurchase();
        lastKeyTime = now;
      }
    }
    if (keys['Escape']) {
      game.state = 'explore';
      game.shopOpen = false;
      lastKeyTime = now;
    }
  } else if (game.state === 'magic_trainer') {
    if (keys['ArrowUp']) {
      game.magicTrainerSelection = Math.max(0, game.magicTrainerSelection - 1);
      lastKeyTime = now;
    }
    if (keys['ArrowDown']) {
      game.magicTrainerSelection = Math.min(magicTraining.length, game.magicTrainerSelection + 1);
      lastKeyTime = now;
    }
    if (keys[' ']) {
      if (now - lastKeyTime > keyDelay) {
        handleMagicTraining();
        lastKeyTime = now;
      }
    }
    if (keys['Escape']) {
      game.state = 'explore';
      game.magicTrainerOpen = false;
      lastKeyTime = now;
    }
  } else if (game.state === 'yoga') {
    if (keys['ArrowUp']) {
      game.yogaSelection = Math.max(0, game.yogaSelection - 1);
      lastKeyTime = now;
    }
    if (keys['ArrowDown']) {
      game.yogaSelection = Math.min(yogaTechniques.length, game.yogaSelection + 1);
      lastKeyTime = now;
    }
    if (keys[' ']) {
      if (now - lastKeyTime > keyDelay) {
        handleYogaTraining();
        lastKeyTime = now;
      }
    }
    if (keys['Escape']) {
      game.state = 'explore';
      game.yogaOpen = false;
      lastKeyTime = now;
    }
  } else if (game.state === 'food_cart') {
    const vendorItems = consumableItems.filter(item => item.vendor === game.currentVendor);
    
    if (keys['ArrowUp']) {
      game.foodCartSelection = Math.max(0, game.foodCartSelection - 1);
      lastKeyTime = now;
    }
    if (keys['ArrowDown']) {
      game.foodCartSelection = Math.min(vendorItems.length, game.foodCartSelection + 1);
      lastKeyTime = now;
    }
    if (keys[' ']) {
      if (now - lastKeyTime > keyDelay) {
        handleFoodCartPurchase();
        lastKeyTime = now;
      }
    }
    if (keys['Escape']) {
      game.state = 'explore';
      game.foodCartOpen = false;
      lastKeyTime = now;
    }
  }
}

