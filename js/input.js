// Input Handling Module
import { game, resetGameState } from './game-state.js';
import { CONFIG, isMobile, CAVE_MAPS } from './constants.js';
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
import { advanceDialogue, startDialogue } from './dialogue.js';
import { executeBattleAction, startBattle, executeSpell, useItemFromMenu, useItemInBattle } from './battle.js';
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
      game.state = 'dialogue';
      // Show intro story
      game.dialogue = {
        type: 'story',
        messages: [
          'Welcome to Iowa City!',
          'A dark corruption has spread across\nthe city, emanating from the historic\nOld Capitol building.',
          'As a student hero, you must explore\nIowa City, complete quests, and\ngrow stronger.',
          'Visit Kinnick Stadium, the Ped Mall,\nthe Old Capitol, Coralville Lake,\nthe mysterious Beer Caves, and more!',
          'Clear the Beer Caves, then reach\nLevel 10 to face the Corrupted\nAdministrator and save Iowa City!',
          'Good luck, hero!\nPress SPACE to begin your adventure!'
        ],
        currentIndex: 0,
        afterDialogue: () => {
          game.state = 'explore';
          game.dialogue = null;
        }
      };
    }
  });

  document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    if (e.key === ' ') spacePressed = false;
  });

  // Handle mouse/touch clicks for game over screen
  document.addEventListener('click', (e) => {
    if (game.state === 'gameOver') {
      // Get canvas and calculate relative position
      const canvas = document.getElementById('game-canvas');
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      
      // Check if click is on restart button (80-176 x, 160-190 y)
      if (x >= 80 && x <= 176 && y >= 160 && y <= 190) {
        resetGameState();
      }
    }
  });
}

export function handleInput() {
  const now = Date.now();
  
  // Special handling for cambus menu - arrow keys should work immediately
  if (game.state === 'cambus') {
    const itemsPerPage = 6;
    const totalPages = Math.ceil(cambusRoutes.length / itemsPerPage);
    const startIdx = game.cambusPage * itemsPerPage;
    const pageItems = cambusRoutes.slice(startIdx, startIdx + itemsPerPage);

    if (keys['ArrowUp']) {
      game.cambusSelection = Math.max(0, game.cambusSelection - 1);
      keys['ArrowUp'] = false; // Prevent repeat
    }
    if (keys['ArrowDown']) {
      game.cambusSelection = Math.min(pageItems.length, game.cambusSelection + 1);
      keys['ArrowDown'] = false; // Prevent repeat
    }
    if (keys['ArrowLeft']) {
      if (game.cambusPage > 0) {
        game.cambusPage--;
        game.cambusSelection = 0;
        keys['ArrowLeft'] = false;
      }
    }
    if (keys['ArrowRight']) {
      if (game.cambusPage < totalPages - 1) {
        game.cambusPage++;
        game.cambusSelection = 0;
        keys['ArrowRight'] = false;
      }
    }
    if (keys[' '] && now - lastKeyTime > keyDelay) {
      handleCambusTravel();
      lastKeyTime = now;
    }
    if (keys['Escape'] && now - lastKeyTime > keyDelay) {
      game.state = 'explore';
      game.cambusOpen = false;
      game.cambusPage = 0;
      game.cambusSelection = 0;
      lastKeyTime = now;
    }
    return;
  }
  
  // Handle dialogue (including level-up) regardless of current state
  if (game.dialogue) {
    if (game.state !== 'dialogue') {
      game.state = 'dialogue';
    }
    if (keys[' '] || keys['Enter']) {
      if (now - lastKeyTime > keyDelay) {
        advanceDialogue();
        if (!game.dialogue) {
          game.levelUpDialog = null; // Clear level up dialog when dialogue ends
          game.state = 'explore';
        }
        lastKeyTime = now;
      }
    }
    if (keys['Escape']) {
      if (now - lastKeyTime > keyDelay) {
        game.dialogue = null;
        game.levelUpDialog = null;
        game.state = 'explore';
        lastKeyTime = now;
      }
    }
    return; // Block all other input during dialogue
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
        const caveEncountersDisabled = game.caveSovereignDefeated && CAVE_MAPS.includes(game.map);
        if (!caveEncountersDisabled && game.enemyEncounterSteps > 10 && Math.random() < 0.15) {
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
          } else if (npc.type === 'boss' && !game.caveSovereignDefeated) {
            if (!game.caveSovereignIntroSeen) {
              startDialogue([
                'Sovereign: You dare step into my chamber?'
              , 'You: Your reign ends here, Sovereign.'
              ]);
              game.dialogue.afterDialogue = () => {
                game.caveSovereignIntroSeen = true;
                game.state = 'explore';
                startBattle('Cave Sovereign');
              };
              game.state = 'dialogue';
            } else {
              startBattle('Cave Sovereign');
            }
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
    const itemsPerPage = 5;
    const totalPages = Math.ceil(shopItems.length / itemsPerPage);
    const startIdx = game.shopPage * itemsPerPage;
    const pageItems = shopItems.slice(startIdx, startIdx + itemsPerPage);
    
    if (keys['ArrowUp']) {
      game.shopSelection = Math.max(0, game.shopSelection - 1);
      lastKeyTime = now;
    }
    if (keys['ArrowDown']) {
      game.shopSelection = Math.min(pageItems.length, game.shopSelection + 1);
      lastKeyTime = now;
    }
    if (keys['ArrowLeft']) {
      if (game.shopPage > 0) {
        game.shopPage--;
        game.shopSelection = 0;
        lastKeyTime = now;
      }
    }
    if (keys['ArrowRight']) {
      if (game.shopPage < totalPages - 1) {
        game.shopPage++;
        game.shopSelection = 0;
        lastKeyTime = now;
      }
    }
    if (keys[' ']) {
      if (now - lastKeyTime > keyDelay) {
        // Adjust selection index for pagination
        const actualSelection = game.shopSelection + (game.shopPage * itemsPerPage);
        if (game.shopSelection === pageItems.length) {
          // Exit selected
          game.state = 'explore';
          game.shopOpen = false;
        } else if (actualSelection < shopItems.length) {
          handleShopPurchase();
        }
        lastKeyTime = now;
      }
    }
    if (keys['Escape']) {
      game.state = 'explore';
      game.shopOpen = false;
      game.shopPage = 0;
      game.shopSelection = 0;
      lastKeyTime = now;
    }
  } else if (game.state === 'magic_trainer') {
    const itemsPerPage = 5;
    const totalPages = Math.ceil(magicTraining.length / itemsPerPage);
    const startIdx = game.magicTrainerPage * itemsPerPage;
    const pageItems = magicTraining.slice(startIdx, startIdx + itemsPerPage);

    if (keys['ArrowUp']) {
      game.magicTrainerSelection = Math.max(0, game.magicTrainerSelection - 1);
      lastKeyTime = now;
    }
    if (keys['ArrowDown']) {
      game.magicTrainerSelection = Math.min(pageItems.length, game.magicTrainerSelection + 1);
      lastKeyTime = now;
    }
    if (keys['ArrowLeft']) {
      if (game.magicTrainerPage > 0) {
        game.magicTrainerPage--;
        game.magicTrainerSelection = 0;
        lastKeyTime = now;
      }
    }
    if (keys['ArrowRight']) {
      if (game.magicTrainerPage < totalPages - 1) {
        game.magicTrainerPage++;
        game.magicTrainerSelection = 0;
        lastKeyTime = now;
      }
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
        game.magicTrainerPage = 0;
        game.magicTrainerSelection = 0;
      lastKeyTime = now;
    }
  } else if (game.state === 'yoga') {
    const itemsPerPage = 5;
    const totalPages = Math.ceil(yogaTechniques.length / itemsPerPage);
    const startIdx = game.yogaPage * itemsPerPage;
    const pageItems = yogaTechniques.slice(startIdx, startIdx + itemsPerPage);
    
    if (keys['ArrowUp']) {
      game.yogaSelection = Math.max(0, game.yogaSelection - 1);
      lastKeyTime = now;
    }
    if (keys['ArrowDown']) {
      game.yogaSelection = Math.min(pageItems.length, game.yogaSelection + 1);
      lastKeyTime = now;
    }
    if (keys['ArrowLeft']) {
      if (game.yogaPage > 0) {
        game.yogaPage--;
        game.yogaSelection = 0;
        lastKeyTime = now;
      }
    }
    if (keys['ArrowRight']) {
      if (game.yogaPage < totalPages - 1) {
        game.yogaPage++;
        game.yogaSelection = 0;
        lastKeyTime = now;
      }
    }
    if (keys[' ']) {
      if (now - lastKeyTime > keyDelay) {
        const actualSelection = game.yogaSelection + (game.yogaPage * itemsPerPage);
        if (game.yogaSelection === pageItems.length) {
          // Exit selected
          game.state = 'explore';
          game.yogaOpen = false;
        } else if (actualSelection < yogaTechniques.length) {
          handleYogaTraining();
        }
        lastKeyTime = now;
      }
    }
    if (keys['Escape']) {
      game.state = 'explore';
      game.yogaOpen = false;
      game.yogaPage = 0;
      game.yogaSelection = 0;
      lastKeyTime = now;
    }
  } else if (game.state === 'food_cart') {
    const vendorItems = consumableItems.filter(item => {
      if (!item.vendor || !game.currentVendor) return false;
      return item.vendor.toString().trim().toLowerCase() === String(game.currentVendor).trim().toLowerCase();
    });
    
    const itemsPerPage = 5;
    const totalPages = Math.ceil(vendorItems.length / itemsPerPage);
    const startIdx = game.foodCartPage * itemsPerPage;
    const pageItems = vendorItems.slice(startIdx, startIdx + itemsPerPage);
    
    if (keys['ArrowUp']) {
      game.foodCartSelection = Math.max(0, game.foodCartSelection - 1);
      lastKeyTime = now;
    }
    if (keys['ArrowDown']) {
      game.foodCartSelection = Math.min(pageItems.length, game.foodCartSelection + 1);
      lastKeyTime = now;
    }
    if (keys['ArrowLeft']) {
      if (game.foodCartPage > 0) {
        game.foodCartPage--;
        game.foodCartSelection = 0;
        lastKeyTime = now;
      }
    }
    if (keys['ArrowRight']) {
      if (game.foodCartPage < totalPages - 1) {
        game.foodCartPage++;
        game.foodCartSelection = 0;
        lastKeyTime = now;
      }
    }
    if (keys[' ']) {
      if (now - lastKeyTime > keyDelay) {
        const actualSelection = game.foodCartSelection + (game.foodCartPage * itemsPerPage);
        if (game.foodCartSelection === pageItems.length) {
          // Exit selected
          game.state = 'explore';
          game.foodCartOpen = false;
        } else if (actualSelection < vendorItems.length) {
          handleFoodCartPurchase();
        }
        lastKeyTime = now;
      }
    }
    if (keys['Escape']) {
      game.state = 'explore';
      game.foodCartOpen = false;
      game.foodCartPage = 0;
      game.foodCartSelection = 0;
      lastKeyTime = now;
    }
  } else if (game.state === 'gameOver') {
    if (keys[' '] || keys['Enter']) {
      if (now - lastKeyTime > keyDelay) {
        resetGameState();
        lastKeyTime = now;
      }
    }
  }
}

