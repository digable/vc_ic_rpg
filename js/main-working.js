// Iowa City Quest - Main Game Module
// This file imports data modules and contains the game logic

import { COLORS, tileColors, isMobile, CONFIG } from './constants.js';
import { shopItems, magicTraining, yogaTechniques, spellData, consumableItems, cambusRoutes } from './data.js';
import { questDatabase } from './quests.js';
import { enemies } from './enemies.js';
import { maps } from './maps.js';
import { game } from './game-state.js';

// Canvas setup
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = CONFIG.canvasWidth;
canvas.height = CONFIG.canvasHeight;

// Disable image smoothing for crisp pixel art
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;

// Touch controls state
const touchControls = {
  up: false,
  down: false,
  left: false,
  right: false,
  action: false,
  menu: false
};

// Input state
const keys = {};
let lastKeyTime = 0;
const keyDelay = CONFIG.keyDelay;
let spacePressed = false;

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

// NOTE: The rest of the game logic (functions for input handling, rendering, 
// battle system, etc.) would continue here. Due to the size and complexity,
// keeping them in this file with the imported data modules provides a good
// balance between organization and functionality.

// This main.js file should contain:
// - Input handling functions
// - Game logic functions (movement, interactions, shops, etc.)
// - Rendering functions (drawMap, drawPlayer, drawBattle, etc.)
// - Battle system functions
// - Quest management functions
// - Game loop

// For a complete implementation, copy the remaining functions from game.js
// starting from line 700 onwards, which includes all the game logic.

console.log('Iowa City Quest - Modular version loading...');
console.log('Data modules imported successfully!');
// Input handling section continues from above (keys, lastKeyTime, keyDelay, spacePressed already declared)

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
    if (spacePressed) return; // Prevent multiple space presses
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
  if (e.key === ' ') {
    spacePressed = false;
  }
});

function handleInput() {
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
            openFoodCart();
          }
        }
        lastKeyTime = now;
      }
    }

    if (keys['Escape']) {
      game.menuOpen = !game.menuOpen;
      if (game.menuOpen) {
        game.menuSelection = 0;
        game.menuTab = 0;
      }
      lastKeyTime = now;
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

function openFoodCart() {
  const npc = checkNPCInteraction();
  game.state = 'food_cart';
  game.foodCartOpen = true;
  game.foodCartSelection = 0;
  game.currentVendor = npc ? npc.name : 'Food Cart Vendor';
}

function checkMapTransition() {
  const map = maps[game.map];
  if (!map.exits) return;
  
  for (let exit of map.exits) {
    const dist = Math.sqrt((game.player.x - exit.x) ** 2 + (game.player.y - exit.y) ** 2);
    if (dist < 20) {
      game.map = exit.toMap;
      game.player.x = exit.toX;
      game.player.y = exit.toY;
      game.enemyEncounterSteps = 0;
      return;
    }
  }
}

function checkCollision(x, y) {
  const tileX = Math.floor(x / 16);
  const tileY = Math.floor(y / 16);
  const map = maps[game.map];
  
  if (tileX < 0 || tileX >= map.width || tileY < 0 || tileY >= map.height) {
    return true;
  }
  
  const tile = map.tiles[tileY][tileX];
  
  // Roads (0) and sidewalks (1) are always walkable
  if (tile === 0 || tile === 1) {
    return false;
  }
  
  // Buildings, bookshelves, and water are always solid
  if (tile === 3 || tile === 4 || tile === 5) {
    return true;
  }
  
  // Grass (2) is walkable only if the map allows it
  if (tile === 2) {
    return !map.grassWalkable;
  }
  
  return false;
}

function checkNPCInteraction() {
  const map = maps[game.map];
  for (let npc of map.npcs) {
    const dist = Math.sqrt((game.player.x - npc.x) ** 2 + (game.player.y - npc.y) ** 2);
    if (dist < 24) {
      const specialTypes = ['shop', 'healer', 'magic_trainer', 'yoga', 'cambus', 'food_cart'];
      
      // Check if NPC has a quest
      if (npc.hasQuest) {
        const quest = questDatabase[npc.hasQuest];
        const activeQuest = game.quests.find(q => q.id === quest.id);
        
        if (!activeQuest) {
          // Offer new quest
          startDialogue(quest.dialogue.offer);
          offerQuest(quest.id);
          return npc;
        } else if (activeQuest.status === 'active') {
          // Check if quest can be completed
          if (canCompleteQuest(activeQuest)) {
            startDialogue(quest.dialogue.complete);
            completeQuest(quest.id);
            return npc;
          } else {
            startDialogue(quest.dialogue.progress);
            return npc;
          }
        } else if (activeQuest.status === 'completed') {
          // Quest already done
          startDialogue(npc.dialogue);
          return npc;
        }
      } else if (!npc.type || !specialTypes.includes(npc.type)) {
        startDialogue(npc.dialogue);
      }
      return npc;
    }
  }
  return null;
}

function offerQuest(questId) {
  const quest = questDatabase[questId];
  game.quests.push({
    id: questId,
    status: 'active',
    objectives: JSON.parse(JSON.stringify(quest.objectives))
  });
}

function canCompleteQuest(activeQuest) {
  return activeQuest.objectives.every(obj => {
    if (obj.type === 'bring_item') {
      return game.consumables.some(item => item.name === obj.item);
    } else if (obj.type === 'visit_location') {
      return obj.visited;
    } else if (obj.type === 'defeat_enemy') {
      return obj.count >= obj.needed;
    } else if (obj.type === 'collect_gold') {
      return obj.amount >= obj.needed;
    } else if (obj.type === 'reach_level') {
      return game.player.level >= obj.level;
    } else if (obj.type === 'buy_from_vendor') {
      return obj.bought;
    }
    return false;
  });
}

function completeQuest(questId) {
  const questIndex = game.quests.findIndex(q => q.id === questId);
  if (questIndex === -1) return;
  
  game.quests[questIndex].status = 'completed';
  const quest = questDatabase[questId];
  
  // Remove quest item if needed
  quest.objectives.forEach(obj => {
    if (obj.type === 'bring_item') {
      const itemIndex = game.consumables.findIndex(item => item.name === obj.item);
      if (itemIndex !== -1) {
        game.consumables.splice(itemIndex, 1);
      }
    } else if (obj.type === 'collect_gold') {
      game.player.gold -= obj.needed;
    }
  });
  
  // Give rewards
  if (quest.rewards.gold) game.player.gold += quest.rewards.gold;
  if (quest.rewards.exp) game.player.exp += quest.rewards.exp;
  if (quest.rewards.item) {
    const item = consumableItems.find(i => i.name === quest.rewards.item);
    if (item) game.consumables.push(item);
  }
  if (quest.rewards.maxHp) {
    game.player.maxHp += quest.rewards.maxHp;
    game.player.hp += quest.rewards.maxHp;
  }
  if (quest.rewards.maxMp) {
    game.player.maxMp += quest.rewards.maxMp;
    game.player.mp += quest.rewards.maxMp;
  }
  if (quest.rewards.spell && !game.spells.includes(quest.rewards.spell)) {
    game.spells.push(quest.rewards.spell);
  }
  if (quest.rewards.skill && !game.skills.includes(quest.rewards.skill)) {
    game.skills.push(quest.rewards.skill);
  }
}

function updateQuestProgress(type, value) {
  game.quests.forEach(quest => {
    if (quest.status !== 'active') return;
    
    quest.objectives.forEach(obj => {
      if (obj.type === type) {
        if (type === 'defeat_enemy' && obj.enemy === value) {
          obj.count++;
        } else if (type === 'visit_location' && obj.location === value) {
          obj.visited = true;
        } else if (type === 'collect_gold') {
          obj.amount = game.player.gold;
        } else if (type === 'buy_from_vendor' && obj.vendor === value) {
          obj.bought = true;
        }
      }
    });
  });
}

function getNearbyNPC() {
  const map = maps[game.map];
  for (let npc of map.npcs) {
    const dist = Math.sqrt((game.player.x - npc.x) ** 2 + (game.player.y - npc.y) ** 2);
    if (dist < 24) {
      return npc;
    }
  }
  return null;
}

function openShop() {
  game.state = 'shop';
  game.shopOpen = true;
  game.shopSelection = 0;
}

function openMagicTrainer() {
  game.state = 'magic_trainer';
  game.magicTrainerOpen = true;
  game.magicTrainerSelection = 0;
}

function openYoga() {
  game.state = 'yoga';
  game.yogaOpen = true;
  game.yogaSelection = 0;
}

function openCambus() {
  game.state = 'cambus';
  game.cambusOpen = true;
  game.cambusSelection = 0;
}

function healPlayer() {
  game.player.hp = game.player.maxHp;
  game.player.mp = game.player.maxMp;
  startDialogue(['Free refill!', 'Your HP and MP are fully restored!', 'Come back anytime!']);
}

function handleShopPurchase() {
  if (game.shopSelection === shopItems.length) {
    // Exit selected
    game.state = 'explore';
    game.shopOpen = false;
    return;
  }
  
  const item = shopItems[game.shopSelection];
  if (game.player.gold >= item.price) {
    game.player.gold -= item.price;
    
    // Apply item effect
    if (item.effect === 'heal') {
      game.player.hp = Math.min(game.player.maxHp, game.player.hp + item.amount);
    } else if (item.effect === 'healMP') {
      game.player.mp = Math.min(game.player.maxMp, game.player.mp + item.amount);
    } else if (item.effect === 'attackUp') {
      game.player.attack += item.amount;
    } else if (item.effect === 'maxHpUp') {
      game.player.maxHp += item.amount;
      game.player.hp += item.amount;
    }
    
    game.inventory.push(item.name);
  }
}

function handleMagicTraining() {
  if (game.magicTrainerSelection === magicTraining.length) {
    // Exit selected
    game.state = 'explore';
    game.magicTrainerOpen = false;
    return;
  }
  
  const training = magicTraining[game.magicTrainerSelection];
  
  // Check if already learned this spell
  if (training.spell && game.spells.includes(training.spell)) {
    game.battleState = { message: 'Already learned this spell!' };
    return;
  }
  
  if (game.player.gold >= training.price) {
    game.player.gold -= training.price;
    
    // Apply training effect
    if (training.effect === 'magicUp') {
      game.player.magic += training.amount;
    } else if (training.effect === 'magicMpUp') {
      game.player.maxMp += training.amount;
      game.player.mp += training.amount;
    } else if (training.effect === 'magicCombo') {
      game.player.magic += 5;
      game.player.maxMp += 15;
      game.player.mp += 15;
    }
    
    // Learn the spell
    if (training.spell && !game.spells.includes(training.spell)) {
      game.spells.push(training.spell);
    }
    game.inventory.push(training.name);
  }
}

function handleYogaTraining() {
  if (game.yogaSelection === yogaTechniques.length) {
    // Exit selected
    game.state = 'explore';
    game.yogaOpen = false;
    return;
  }
  
  const technique = yogaTechniques[game.yogaSelection];
  
  // Check if already learned this skill
  if (technique.skill && game.skills.includes(technique.skill)) {
    return; // Just don't do anything, they already have it
  }
  
  if (game.player.gold >= technique.price) {
    game.player.gold -= technique.price;
    
    // Apply technique effects
    if (technique.effect === 'defenseUp') {
      game.player.defense += technique.amount;
    } else if (technique.effect === 'hpMpCombo') {
      game.player.maxHp += 15;
      game.player.hp += 15;
      game.player.maxMp += 10;
      game.player.mp += 10;
    } else if (technique.effect === 'defenseCombo') {
      game.player.defense += technique.amount;
    }
    
    // Learn the skill
    if (technique.skill && !game.skills.includes(technique.skill)) {
      game.skills.push(technique.skill);
    }
    game.inventory.push(technique.name);
  }
}

function handleFoodCartPurchase() {
  const vendorItems = consumableItems.filter(item => item.vendor === game.currentVendor);
  
  if (game.foodCartSelection === vendorItems.length) {
    // Exit selected
    game.state = 'explore';
    game.foodCartOpen = false;
    return;
  }
  
  const item = vendorItems[game.foodCartSelection];
  if (game.player.gold >= item.price) {
    game.player.gold -= item.price;
    game.consumables.push(item);
    
    // Update quest progress for vendor purchases
    updateQuestProgress('buy_from_vendor', game.currentVendor);
  }
}

function handleCambusTravel() {
  if (game.cambusSelection === cambusRoutes.length) {
    // Exit selected
    game.state = 'explore';
    game.cambusOpen = false;
    return;
  }
  
  const route = cambusRoutes[game.cambusSelection];
  
  // Don't travel if already at this location
  if (game.map === route.map) {
    game.state = 'explore';
    game.cambusOpen = false;
    return;
  }
  
  // Fast travel!
  game.map = route.map;
  game.player.x = route.x;
  game.player.y = route.y;
  game.state = 'explore';
  game.cambusOpen = false;
  game.enemyEncounterSteps = 0;
}

function startDialogue(dialogue) {
  game.state = 'dialogue';
  game.dialogue = {
    lines: dialogue,
    currentLine: 0
  };
}

function advanceDialogue() {
  game.dialogue.currentLine++;
  if (game.dialogue.currentLine >= game.dialogue.lines.length) {
    game.state = 'explore';
    game.dialogue = null;
  }
}

function startBattle() {
  game.state = 'battle';
  
  // Determine which enemies can appear based on location
  const map = maps[game.map];
  const isOutdoor = map.grassWalkable; // Pentacrest and Riverside are outdoor
  
  let availableEnemies = enemies.filter(e => {
    if (e.outdoor && !isOutdoor) return false; // Parking meters only outside
    if (!e.outdoor && e.outdoor !== undefined) return true; // Indoor enemies
    return true; // Homework can be anywhere (outdoor undefined)
  });
  
  // Special: 20% chance for Raccoon in Riverside Park
  let enemy;
  if (game.map === 'riverside' && Math.random() < 0.2) {
    enemy = JSON.parse(JSON.stringify(enemies.find(e => e.name === 'Raccoon')));
  } else {
    const enemyIndex = Math.min(Math.floor(game.player.level / 2), availableEnemies.length - 1);
    enemy = JSON.parse(JSON.stringify(availableEnemies[enemyIndex]));
  }
  
  game.battleState = {
    enemy: enemy,
    selectedAction: 0,
    selectedSpell: 0,
    selectedItem: 0,
    inSpellMenu: false,
    inItemMenu: false,
    message: `A wild ${enemy.name} appeared!`,
    playerTurn: true,
    animating: false,
    defenseBoost: 0,
    boostTurnsLeft: 0
  };
}

function executeBattleAction() {
  if (game.battleState.animating) return;
  
  const actions = ['Attack', 'Magic', 'Item', 'Run'];
  const action = actions[game.battleState.selectedAction];
  
  if (action === 'Attack') {
    let attackPower = game.player.attack;
    if (game.activeBuff && game.activeBuff.type === 'attack') {
      attackPower += game.activeBuff.amount;
    }
    const damage = attackPower + Math.floor(Math.random() * 5);
    game.battleState.enemy.hp -= damage;
    game.battleState.enemy.hp = Math.max(0, game.battleState.enemy.hp);
    game.battleState.message = `You dealt ${damage} damage!`;
    game.battleState.animating = true;
    
    setTimeout(() => {
      if (game.battleState.enemy.hp <= 0) {
        game.battleState.message = `${game.battleState.enemy.name} was defeated!`;
        setTimeout(() => {
          victoryBattle();
        }, 800);
      } else {
        enemyTurn();
      }
    }, 1000);
  } else if (action === 'Magic') {
    // Open spell menu
    game.battleState.inSpellMenu = true;
    game.battleState.selectedSpell = 0;
    game.battleState.message = 'Choose a spell:';
  } else if (action === 'Item') {
    // Open item menu
    if (game.consumables.length === 0) {
      game.battleState.message = 'No items to use!';
    } else {
      game.battleState.inItemMenu = true;
      game.battleState.selectedItem = 0;
      game.battleState.message = 'Choose an item:';
    }
  } else if (action === 'Run') {
    if (Math.random() < 0.5) {
      game.battleState.message = 'You ran away!';
      setTimeout(() => {
        game.state = 'explore';
        game.battleState = null;
      }, 1000);
    } else {
      game.battleState.message = 'Could not escape!';
      setTimeout(() => enemyTurn(), 1000);
    }
  }
}

function executeSpell() {
  if (game.battleState.selectedSpell === game.spells.length) {
    // Back option
    game.battleState.inSpellMenu = false;
    game.battleState.selectedSpell = 0;
    game.battleState.message = 'What will you do?';
    return;
  }
  
  const spellName = game.spells[game.battleState.selectedSpell];
  const spell = spellData[spellName];
  
  if (game.player.mp < spell.mpCost) {
    game.battleState.message = 'Not enough MP!';
    game.battleState.animating = false;
    return;
  }
  
  game.player.mp -= spell.mpCost;
  game.battleState.inSpellMenu = false;
  game.battleState.animating = true;
  
  if (spell.type === 'attack') {
    let magicPower = game.player.magic;
    if (game.activeBuff && game.activeBuff.type === 'magic') {
      magicPower += game.activeBuff.amount;
    }
    const damage = Math.floor(magicPower * spell.power) + Math.floor(Math.random() * 5);
    game.battleState.enemy.hp -= damage;
    game.battleState.enemy.hp = Math.max(0, game.battleState.enemy.hp);
    game.battleState.message = `${spellName} dealt ${damage} damage!`;
    
    setTimeout(() => {
      if (game.battleState.enemy.hp <= 0) {
        game.battleState.message = `${game.battleState.enemy.name} was defeated!`;
        setTimeout(() => {
          victoryBattle();
        }, 800);
      } else {
        enemyTurn();
      }
    }, 1000);
  } else if (spell.type === 'defense') {
    game.battleState.defenseBoost = spell.boost;
    game.battleState.boostTurnsLeft = spell.duration;
    game.battleState.message = `Defense increased by ${spell.boost}!`;
    setTimeout(() => enemyTurn(), 1000);
  } else if (spell.type === 'heal') {
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + spell.amount);
    game.battleState.message = `Restored ${spell.amount} HP!`;
    setTimeout(() => {
      game.battleState.animating = false;
      enemyTurn();
    }, 1000);
  }
}

function useItemInBattle() {
  if (game.battleState.selectedItem === game.consumables.length) {
    // Back option
    game.battleState.inItemMenu = false;
    game.battleState.selectedItem = 0;
    game.battleState.message = 'What will you do?';
    return;
  }
  
  const item = game.consumables[game.battleState.selectedItem];
  game.battleState.inItemMenu = false;
  game.battleState.animating = true;
  
  applyItemEffect(item);
  
  // Remove item from inventory
  game.consumables.splice(game.battleState.selectedItem, 1);
  
  setTimeout(() => {
    game.battleState.animating = false;
    enemyTurn();
  }, 1000);
}

function useItemFromMenu() {
  if (game.itemMenuSelection >= game.consumables.length) return;
  
  const item = game.consumables[game.itemMenuSelection];
  applyItemEffect(item);
  
  // Remove item from inventory
  game.consumables.splice(game.itemMenuSelection, 1);
  
  // Adjust selection if needed
  if (game.itemMenuSelection >= game.consumables.length && game.consumables.length > 0) {
    game.itemMenuSelection = game.consumables.length - 1;
  }
}

function applyItemEffect(item) {
  if (item.effect === 'healHP') {
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + item.amount);
    if (game.battleState) {
      game.battleState.message = `Used ${item.name}! Restored ${item.amount} HP!`;
    }
  } else if (item.effect === 'healMP') {
    game.player.mp = Math.min(game.player.maxMp, game.player.mp + item.amount);
    if (game.battleState) {
      game.battleState.message = `Used ${item.name}! Restored ${item.amount} MP!`;
    }
  } else if (item.effect === 'healBoth') {
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + item.hpAmount);
    game.player.mp = Math.min(game.player.maxMp, game.player.mp + item.mpAmount);
    if (game.battleState) {
      game.battleState.message = `Used ${item.name}! Restored ${item.hpAmount} HP & ${item.mpAmount} MP!`;
    }
  } else if (item.effect === 'buffAttack') {
    game.activeBuff = { type: 'attack', amount: item.amount, turnsLeft: item.turns };
    if (game.battleState) {
      game.battleState.message = `Used ${item.name}! Attack +${item.amount} for ${item.turns} turns!`;
    }
  } else if (item.effect === 'buffDefense') {
    game.activeBuff = { type: 'defense', amount: item.amount, turnsLeft: item.turns };
    if (game.battleState) {
      game.battleState.message = `Used ${item.name}! Defense +${item.amount} for ${item.turns} turns!`;
    }
  } else if (item.effect === 'buffMagic') {
    game.activeBuff = { type: 'magic', amount: item.amount, turnsLeft: item.turns };
    if (game.battleState) {
      game.battleState.message = `Used ${item.name}! Magic +${item.amount} for ${item.turns} turns!`;
    }
  }
}

function enemyTurn() {
  // Reduce defense boost duration
  if (game.battleState.boostTurnsLeft > 0) {
    game.battleState.boostTurnsLeft--;
    if (game.battleState.boostTurnsLeft === 0) {
      game.battleState.defenseBoost = 0;
    }
  }
  
  // Reduce active buff duration
  if (game.activeBuff && game.activeBuff.turnsLeft > 0) {
    game.activeBuff.turnsLeft--;
    if (game.activeBuff.turnsLeft === 0) {
      game.activeBuff = null;
    }
  }
  
  const enemy = game.battleState.enemy;
  let damage = 0;
  let attackName = 'attacked';
  let specialEffect = null;
  
  // 30% chance to use special attack if available
  if (enemy.specialAttack && Math.random() < 0.3) {
    damage = enemy.specialAttack.damage;
    attackName = enemy.specialAttack.name;
    specialEffect = enemy.specialAttack.effect;
    
    if (specialEffect === 'drainMP') {
      game.player.mp = Math.max(0, game.player.mp - enemy.specialAttack.drainAmount);
    }
  } else {
    damage = enemy.attack + Math.floor(Math.random() * 3);
  }
  
  // Apply defense (including buff)
  let totalDefense = game.player.defense + game.battleState.defenseBoost;
  if (game.activeBuff && game.activeBuff.type === 'defense') {
    totalDefense += game.activeBuff.amount;
  }
  damage = Math.max(1, damage - Math.floor(totalDefense / 2));
  
  game.player.hp -= damage;
  game.battleState.message = `${enemy.name} used ${attackName}! ${damage} damage!`;
  game.battleState.animating = true;
  
  setTimeout(() => {
    game.battleState.animating = false;
    if (game.player.hp <= 0) {
      gameOver();
    } else {
      game.battleState.message = 'What will you do?';
    }
  }, 1000);
}

function victoryBattle() {
  const exp = game.battleState.enemy.exp;
  const gold = game.battleState.enemy.gold;
  game.player.exp += exp;
  game.player.gold += gold;
  
  // Update quest progress for enemy defeats
  updateQuestProgress('defeat_enemy', game.battleState.enemy.name);
  updateQuestProgress('collect_gold', game.player.gold);
  
  game.battleState.message = `Victory! Gained ${exp} EXP and $${gold}!`;
  
  // Level up check
  if (game.player.exp >= game.player.level * 30) {
    game.player.level++;
    game.player.maxHp += 10;
    game.player.maxMp += 5;
    game.player.attack += 2;
    game.player.magic += 2;
    game.player.defense += 1;
    game.battleState.message += ` LEVEL UP to ${game.player.level}! ATK+2 MAG+2 DEF+1`;
  }
  
  // Apply post-battle regeneration skills
  let regenMessage = '';
  
  if (game.skills.includes('Regenerate')) {
    const hpRegen = Math.floor(game.player.maxHp * 0.1);
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + hpRegen);
    regenMessage += ` Regenerate: +${hpRegen} HP!`;
  }
  
  if (game.skills.includes('Meditation')) {
    const mpRegen = Math.floor(game.player.maxMp * 0.15);
    game.player.mp = Math.min(game.player.maxMp, game.player.mp + mpRegen);
    regenMessage += ` Meditation: +${mpRegen} MP!`;
  }
  
  if (regenMessage) {
    game.battleState.message += regenMessage;
  }
  
  setTimeout(() => {
    game.state = 'explore';
    game.battleState = null;
  }, 2500);
}

function gameOver() {
  game.battleState.message = 'You were defeated... Game Over';
  setTimeout(() => {
    game.player.hp = game.player.maxHp;
    game.player.gold = Math.floor(game.player.gold / 2);
    game.state = 'explore';
    game.battleState = null;
  }, 3000);
}

// Rendering
function drawMap() {
  const map = maps[game.map];
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const tile = map.tiles[y][x];
      ctx.fillStyle = tileColors[tile];
      ctx.fillRect(x * 16, y * 16, 16, 16);
      
      // Add texture for buildings
      if (tile === 3) {
        ctx.fillStyle = COLORS.darkGray;
        ctx.fillRect(x * 16 + 2, y * 16 + 2, 5, 5);
        ctx.fillRect(x * 16 + 9, y * 16 + 2, 5, 5);
        ctx.fillRect(x * 16 + 2, y * 16 + 9, 5, 5);
        ctx.fillRect(x * 16 + 9, y * 16 + 9, 5, 5);
      }
      
      // Draw bridge effect for road tiles in riverside that connect to water
      if (game.map === 'riverside' && tile === 0 && y === 7 && x >= 10) {
        // Add bridge railings
        ctx.fillStyle = COLORS.brown;
        ctx.fillRect(x * 16, y * 16, 16, 2); // top railing
        ctx.fillRect(x * 16, y * 16 + 14, 16, 2); // bottom railing
      }
    }
  }
  
  // Draw exit labels
  if (map.exits) {
    ctx.font = '5px "Press Start 2P"';
    for (let exit of map.exits) {
      const destMap = maps[exit.toMap];
      const labelX = exit.x;
      const labelY = exit.y;
      
      // Draw background for text
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      const textWidth = ctx.measureText(destMap.name).width;
      
      if (exit.direction === 'up') {
        ctx.fillRect(labelX - textWidth/2 - 2, labelY - 12, textWidth + 4, 8);
        ctx.fillStyle = COLORS.yellow;
        ctx.fillText(destMap.name, labelX - textWidth/2, labelY - 6);
        // Arrow
        ctx.fillText('^', labelX - 3, labelY + 2);
      } else if (exit.direction === 'down') {
        ctx.fillRect(labelX - textWidth/2 - 2, labelY + 8, textWidth + 4, 8);
        ctx.fillStyle = COLORS.yellow;
        ctx.fillText(destMap.name, labelX - textWidth/2, labelY + 14);
        // Arrow
        ctx.fillText('v', labelX - 3, labelY - 2);
      } else if (exit.direction === 'left') {
        ctx.fillRect(labelX - textWidth - 10, labelY - 6, textWidth + 4, 8);
        ctx.fillStyle = COLORS.yellow;
        ctx.fillText(destMap.name, labelX - textWidth - 8, labelY);
        // Arrow
        ctx.fillText('<', labelX + 2, labelY);
      } else if (exit.direction === 'right') {
        ctx.fillRect(labelX + 6, labelY - 6, textWidth + 4, 8);
        ctx.fillStyle = COLORS.yellow;
        ctx.fillText(destMap.name, labelX + 8, labelY);
        // Arrow
        ctx.fillText('>', labelX - 4, labelY);
      }
    }
  }
}

function drawPlayer() {
  const frame = Math.floor(game.animFrame / 15) % 2;
  
  // Body - blue hoodie
  ctx.fillStyle = COLORS.blue;
  ctx.fillRect(game.player.x - 6, game.player.y - 4, 12, 10);
  
  // Head - skin tone
  ctx.fillStyle = COLORS.tan;
  ctx.fillRect(game.player.x - 5, game.player.y - 13, 10, 9);
  
  // Hair - brown
  ctx.fillStyle = COLORS.brown;
  ctx.fillRect(game.player.x - 5, game.player.y - 13, 10, 3);
  
  // Eyes based on direction
  ctx.fillStyle = COLORS.black;
  if (game.player.facing === 'down') {
    ctx.fillRect(game.player.x - 3, game.player.y - 9, 2, 1);
    ctx.fillRect(game.player.x + 1, game.player.y - 9, 2, 1);
  } else if (game.player.facing === 'up') {
    ctx.fillRect(game.player.x - 3, game.player.y - 11, 2, 1);
    ctx.fillRect(game.player.x + 1, game.player.y - 11, 2, 1);
  } else if (game.player.facing === 'left') {
    ctx.fillRect(game.player.x - 4, game.player.y - 10, 2, 1);
  } else if (game.player.facing === 'right') {
    ctx.fillRect(game.player.x + 2, game.player.y - 10, 2, 1);
  }
  
  // Legs - dark blue jeans
  ctx.fillStyle = '#1a1a4e';
  const legOffset = frame * 2;
  ctx.fillRect(game.player.x - 5 + legOffset, game.player.y + 6, 4, 6);
  ctx.fillRect(game.player.x + 1 - legOffset, game.player.y + 6, 4, 6);
  
  // Shoes
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(game.player.x - 5 + legOffset, game.player.y + 11, 4, 2);
  ctx.fillRect(game.player.x + 1 - legOffset, game.player.y + 11, 4, 2);
}

function drawNPCs() {
  const map = maps[game.map];
  for (let npc of map.npcs) {
    if (npc.isSign) {
      // Draw bus stop sign
      // Post
      ctx.fillStyle = COLORS.darkGray;
      ctx.fillRect(npc.x - 2, npc.y - 4, 4, 12);
      
      // Sign
      ctx.fillStyle = COLORS.yellow;
      ctx.fillRect(npc.x - 6, npc.y - 12, 12, 8);
      
      // Border
      ctx.strokeStyle = COLORS.black;
      ctx.lineWidth = 1;
      ctx.strokeRect(npc.x - 6, npc.y - 12, 12, 8);
      
      // Bus symbol (simplified)
      ctx.fillStyle = COLORS.black;
      ctx.fillRect(npc.x - 4, npc.y - 10, 8, 4);
      ctx.fillRect(npc.x - 3, npc.y - 7, 2, 1);
      ctx.fillRect(npc.x + 1, npc.y - 7, 2, 1);
    } else {
      // Draw NPC based on their name/role
      drawNPC(npc);
      
      // Draw quest marker
      if (npc.hasQuest) {
        const quest = questDatabase[npc.hasQuest];
        const activeQuest = game.quests.find(q => q.id === quest.id);
        
        if (!activeQuest) {
          // Yellow ! for new quest
          ctx.fillStyle = COLORS.yellow;
          ctx.font = '12px "Press Start 2P"';
          ctx.fillText('!', npc.x - 2, npc.y - 18);
        } else if (activeQuest.status === 'active' && canCompleteQuest(activeQuest)) {
          // Green ? for completable quest
          ctx.fillStyle = COLORS.lightGreen;
          ctx.font = '12px "Press Start 2P"';
          ctx.fillText('?', npc.x - 2, npc.y - 18);
        }
      }
    }
  }
}

function drawNPC(npc) {
  const x = npc.x;
  const y = npc.y;
  
  if (npc.name === 'Barista') {
    // Green apron, dark skin, bun hairstyle
    // Body - green apron
    ctx.fillStyle = '#2d5016';
    ctx.fillRect(x - 6, y - 4, 12, 10);
    // Head - darker skin
    ctx.fillStyle = '#8d5524';
    ctx.fillRect(x - 5, y - 13, 10, 9);
    // Hair bun
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 2, y - 14, 4, 3);
    // Eyes
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    // Legs - black pants
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
    
  } else if (npc.name === 'Townie') {
    // Flannel shirt, beard, baseball cap
    // Body - red flannel
    ctx.fillStyle = '#8b0000';
    ctx.fillRect(x - 7, y - 4, 14, 10);
    // Head - light skin
    ctx.fillStyle = COLORS.tan;
    ctx.fillRect(x - 5, y - 13, 10, 9);
    // Baseball cap
    ctx.fillStyle = COLORS.orange;
    ctx.fillRect(x - 6, y - 14, 12, 2);
    ctx.fillRect(x - 8, y - 13, 4, 1);
    // Beard
    ctx.fillStyle = COLORS.brown;
    ctx.fillRect(x - 4, y - 6, 8, 3);
    // Eyes
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    // Legs - blue jeans
    ctx.fillStyle = '#1a1a4e';
    ctx.fillRect(x - 6, y + 6, 5, 6);
    ctx.fillRect(x + 1, y + 6, 5, 6);
    
  } else if (npc.name === 'Shop Owner') {
    // White shirt, tie, slicked hair, glasses
    // Body - white shirt with tie
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 6, y - 4, 12, 10);
    // Tie
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(x - 1, y - 3, 2, 8);
    // Head - medium skin
    ctx.fillStyle = '#c68642';
    ctx.fillRect(x - 5, y - 13, 10, 9);
    // Hair - black slicked
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 5, y - 13, 10, 2);
    // Glasses
    ctx.strokeStyle = COLORS.black;
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 4, y - 10, 3, 3);
    ctx.strokeRect(x + 1, y - 10, 3, 3);
    // Eyes
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 1, 1);
    ctx.fillRect(x + 2, y - 9, 1, 1);
    // Legs - khaki
    ctx.fillStyle = '#c3b091';
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
    
  } else if (npc.name === 'Yoga Instructor') {
    // Purple yoga outfit, long ponytail, slim build
    // Body - purple yoga top (slim)
    ctx.fillStyle = COLORS.purple;
    ctx.fillRect(x - 5, y - 4, 10, 9);
    // Head - light skin
    ctx.fillStyle = COLORS.pink;
    ctx.fillRect(x - 4, y - 13, 8, 9);
    // Ponytail
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(x + 3, y - 11, 3, 6);
    // Eyes
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 2, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    // Legs - purple yoga pants (slim)
    ctx.fillStyle = COLORS.purple;
    ctx.fillRect(x - 4, y + 5, 3, 7);
    ctx.fillRect(x + 1, y + 5, 3, 7);
    
  } else if (npc.name === 'Professor') {
    // Tweed jacket, glasses, gray hair, older
    // Body - brown tweed jacket
    ctx.fillStyle = '#654321';
    ctx.fillRect(x - 6, y - 4, 12, 10);
    // Head - pale skin
    ctx.fillStyle = '#ffe0bd';
    ctx.fillRect(x - 5, y - 13, 10, 9);
    // Gray hair
    ctx.fillStyle = COLORS.gray;
    ctx.fillRect(x - 5, y - 13, 10, 3);
    ctx.fillRect(x - 6, y - 11, 2, 4);
    ctx.fillRect(x + 4, y - 11, 2, 4);
    // Glasses
    ctx.strokeStyle = COLORS.black;
    ctx.strokeRect(x - 4, y - 10, 3, 3);
    ctx.strokeRect(x + 1, y - 10, 3, 3);
    // Eyes
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 1, 1);
    ctx.fillRect(x + 2, y - 9, 1, 1);
    // Legs - dark pants
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
    
  } else if (npc.name === 'Student') {
    // Hoodie, backpack, tired look, messy hair
    // Body - gray hoodie
    ctx.fillStyle = '#505050';
    ctx.fillRect(x - 6, y - 4, 12, 10);
    // Backpack straps
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 4, y - 2, 2, 6);
    ctx.fillRect(x + 2, y - 2, 2, 6);
    // Head
    ctx.fillStyle = COLORS.tan;
    ctx.fillRect(x - 5, y - 13, 10, 9);
    // Messy hair
    ctx.fillStyle = COLORS.brown;
    ctx.fillRect(x - 5, y - 13, 10, 4);
    ctx.fillRect(x - 6, y - 12, 2, 2);
    ctx.fillRect(x + 4, y - 11, 2, 2);
    // Tired eyes
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 8, 2, 1);
    ctx.fillRect(x + 1, y - 8, 2, 1);
    // Legs - jeans
    ctx.fillStyle = '#1a1a4e';
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
    
  } else if (npc.name === 'Librarian') {
    // Cardigan, bun, glasses, book in hand
    // Body - beige cardigan
    ctx.fillStyle = '#d2b48c';
    ctx.fillRect(x - 6, y - 4, 12, 10);
    // Book in hand
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(x - 8, y - 2, 3, 4);
    // Head
    ctx.fillStyle = COLORS.tan;
    ctx.fillRect(x - 5, y - 13, 10, 9);
    // Hair bun
    ctx.fillStyle = COLORS.brown;
    ctx.fillRect(x - 2, y - 14, 4, 3);
    // Glasses
    ctx.strokeStyle = COLORS.black;
    ctx.strokeRect(x - 4, y - 10, 3, 3);
    ctx.strokeRect(x + 1, y - 10, 3, 3);
    // Eyes
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 1, 1);
    ctx.fillRect(x + 2, y - 9, 1, 1);
    // Legs - long skirt
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 6, y + 6, 12, 6);
    
  } else if (npc.name === 'Researcher') {
    // Lab coat, disheveled, coffee mug
    // Body - white lab coat
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 6, y - 4, 12, 10);
    // Coffee mug
    ctx.fillStyle = COLORS.brown;
    ctx.fillRect(x + 6, y - 1, 3, 3);
    // Head
    ctx.fillStyle = '#c68642';
    ctx.fillRect(x - 5, y - 13, 10, 9);
    // Wild hair
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 6, y - 13, 12, 3);
    ctx.fillRect(x - 7, y - 11, 2, 2);
    ctx.fillRect(x + 5, y - 12, 2, 2);
    // Eyes
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    // Legs - dark pants
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
    
  } else if (npc.name === 'Jogger') {
    // Athletic wear, headband, runner build
    // Body - bright athletic shirt (slim)
    ctx.fillStyle = COLORS.orange;
    ctx.fillRect(x - 5, y - 4, 10, 9);
    // Head - darker skin
    ctx.fillStyle = '#8d5524';
    ctx.fillRect(x - 4, y - 13, 8, 9);
    // Headband
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 5, y - 11, 10, 2);
    // Eyes
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 2, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    // Legs - running shorts (slim)
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 4, y + 5, 3, 4);
    ctx.fillRect(x + 1, y + 5, 3, 4);
    // Legs visible below shorts
    ctx.fillStyle = '#8d5524';
    ctx.fillRect(x - 4, y + 9, 3, 3);
    ctx.fillRect(x + 1, y + 9, 3, 3);
    
  } else if (npc.name === 'Artist') {
    // Paint-stained smock, beret, palette
    // Body - paint-stained smock
    ctx.fillStyle = '#e8e8e8';
    ctx.fillRect(x - 6, y - 4, 12, 10);
    // Paint stains
    ctx.fillStyle = COLORS.blue;
    ctx.fillRect(x - 3, y - 2, 2, 2);
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(x + 2, y + 1, 2, 2);
    // Palette in hand
    ctx.fillStyle = COLORS.brown;
    ctx.fillRect(x - 9, y - 1, 4, 3);
    // Head
    ctx.fillStyle = COLORS.pink;
    ctx.fillRect(x - 5, y - 13, 10, 9);
    // Beret
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 6, y - 14, 12, 2);
    ctx.fillRect(x - 4, y - 15, 8, 1);
    // Eyes
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    // Legs - jeans
    ctx.fillStyle = '#1a1a4e';
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
    
  } else if (npc.name === 'Food Cart Vendor') {
    // Street food vendor - apron, chef hat, holding spatula
    // Body - white apron over red shirt
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(x - 6, y - 4, 12, 10);
    // White apron
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 5, y - 2, 10, 8);
    // Head - medium skin
    ctx.fillStyle = '#c68642';
    ctx.fillRect(x - 5, y - 13, 10, 9);
    // Chef hat
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 6, y - 15, 12, 3);
    ctx.fillRect(x - 4, y - 16, 8, 1);
    // Mustache
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 4, y - 6, 8, 2);
    // Eyes
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    // Spatula in hand
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x + 6, y - 2, 2, 6);
    ctx.fillRect(x + 5, y - 3, 4, 2);
    // Legs - dark pants
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
    
  } else if (npc.name === 'Bartender') {
    // Bartender - vest, bow tie, slicked hair
    // Body - black vest over white shirt
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 6, y - 4, 12, 10);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 5, y - 2, 10, 8);
    // Bow tie
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(x - 3, y - 3, 6, 2);
    // Head
    ctx.fillStyle = COLORS.tan;
    ctx.fillRect(x - 5, y - 13, 10, 9);
    // Slicked hair
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 5, y - 13, 10, 2);
    // Eyes
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    // Towel in hand
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x + 6, y, 3, 4);
    // Legs - black pants
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
    
  } else if (npc.name === 'Regular') {
    // Bar regular - casual, baseball cap, beer belly
    // Body - gray t-shirt (wider)
    ctx.fillStyle = '#808080';
    ctx.fillRect(x - 7, y - 4, 14, 11);
    // Head
    ctx.fillStyle = COLORS.tan;
    ctx.fillRect(x - 5, y - 13, 10, 9);
    // Baseball cap
    ctx.fillStyle = COLORS.orange;
    ctx.fillRect(x - 6, y - 14, 12, 2);
    ctx.fillRect(x - 8, y - 13, 4, 1);
    // Beard stubble
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 3, y - 6, 6, 2);
    // Eyes
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    // Legs - jeans
    ctx.fillStyle = '#1a1a4e';
    ctx.fillRect(x - 6, y + 7, 5, 5);
    ctx.fillRect(x + 1, y + 7, 5, 5);
    
  } else if (npc.name === 'Pool Player') {
    // Pool player - leather jacket, holding pool cue
    // Body - black leather jacket
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 6, y - 4, 12, 10);
    // Head
    ctx.fillStyle = '#8d5524';
    ctx.fillRect(x - 5, y - 13, 10, 9);
    // Cool hair
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 5, y - 13, 10, 3);
    ctx.fillRect(x - 6, y - 11, 2, 2);
    // Eyes
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    // Pool cue
    ctx.fillStyle = COLORS.brown;
    ctx.fillRect(x + 6, y - 8, 1, 16);
    // Legs - dark jeans
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
    
  } else if (npc.name === 'Restaurant Owner' || npc.name === 'Chef') {
    // Chef/Restaurant owner - chef whites, toque hat
    // Body - white chef coat
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 6, y - 4, 12, 10);
    // Double breasted buttons
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 4, y - 2, 2, 2);
    ctx.fillRect(x - 4, y + 2, 2, 2);
    ctx.fillRect(x + 2, y - 2, 2, 2);
    ctx.fillRect(x + 2, y + 2, 2, 2);
    // Head
    ctx.fillStyle = '#c68642';
    ctx.fillRect(x - 5, y - 13, 10, 9);
    // Toque (tall chef hat)
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 6, y - 18, 12, 6);
    ctx.fillRect(x - 4, y - 19, 8, 1);
    // Eyes
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    // Mustache
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 4, y - 6, 8, 2);
    // Legs - checkered pants
    ctx.fillStyle = COLORS.gray;
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
    
  } else if (npc.name === 'Diner') {
    // Casual diner - hoodie, relaxed
    // Body - blue hoodie
    ctx.fillStyle = COLORS.blue;
    ctx.fillRect(x - 6, y - 4, 12, 10);
    // Head
    ctx.fillStyle = COLORS.pink;
    ctx.fillRect(x - 5, y - 13, 10, 9);
    // Hair
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(x - 5, y - 13, 10, 3);
    // Eyes
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    // Chopsticks in hand
    ctx.fillStyle = COLORS.brown;
    ctx.fillRect(x + 6, y - 1, 1, 6);
    ctx.fillRect(x + 7, y - 1, 1, 6);
    // Legs - jeans
    ctx.fillStyle = '#1a1a4e';
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
    
  } else if (npc.name === 'Food Critic') {
    // Food critic - fancy, notepad, stylish
    // Body - purple blazer
    ctx.fillStyle = COLORS.purple;
    ctx.fillRect(x - 6, y - 4, 12, 10);
    // Notepad
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 9, y, 3, 4);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 9, y, 3, 1);
    // Head
    ctx.fillStyle = COLORS.tan;
    ctx.fillRect(x - 5, y - 13, 10, 9);
    // Stylish hair
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 5, y - 13, 10, 3);
    ctx.fillRect(x + 3, y - 11, 3, 2);
    // Glasses
    ctx.strokeStyle = COLORS.black;
    ctx.strokeRect(x - 4, y - 10, 3, 3);
    ctx.strokeRect(x + 1, y - 10, 3, 3);
    // Eyes
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 1, 1);
    ctx.fillRect(x + 2, y - 9, 1, 1);
    // Legs - slacks
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
    
  } else {
    // Default NPC if none of the above
    // Body - green
    ctx.fillStyle = COLORS.green;
    ctx.fillRect(x - 6, y - 4, 12, 8);
    // Head
    ctx.fillStyle = COLORS.pink;
    ctx.fillRect(x - 4, y - 12, 8, 8);
    // Eyes
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 8, 2, 2);
    ctx.fillRect(x + 1, y - 8, 2, 2);
  }
}

function drawHUD() {
  // Top bar
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(0, 0, 256, 24);
  
  // Stats
  ctx.fillStyle = COLORS.white;
  ctx.font = '8px "Press Start 2P"';
  ctx.fillText(`HP:${game.player.hp}/${game.player.maxHp}`, 4, 10);
  ctx.fillText(`MP:${game.player.mp}/${game.player.maxMp}`, 4, 20);
  ctx.fillText(`LV:${game.player.level}`, 120, 10);
  ctx.fillText(`$${game.player.gold}`, 120, 20);
  
  // HP bar
  ctx.fillStyle = COLORS.red;
  const hpWidth = (game.player.hp / game.player.maxHp) * 60;
  ctx.fillRect(180, 6, hpWidth, 6);
  ctx.strokeStyle = COLORS.white;
  ctx.strokeRect(180, 6, 60, 6);
  
  // MP bar
  ctx.fillStyle = COLORS.lightBlue;
  const mpWidth = (game.player.mp / game.player.maxMp) * 60;
  ctx.fillRect(180, 14, mpWidth, 6);
  ctx.strokeRect(180, 14, 60, 6);
  
  // Contextual controls at bottom
  const nearbyNPC = getNearbyNPC();
  if (nearbyNPC) {
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(0, 226, 256, 14);
    ctx.fillStyle = COLORS.yellow;
    ctx.font = '6px "Press Start 2P"';
    if (nearbyNPC.type === 'shop') {
      ctx.fillText(`SPACE: Enter Shop`, 8, 235);
    } else if (nearbyNPC.type === 'healer') {
      ctx.fillText(`SPACE: Get Free Refill`, 8, 235);
    } else if (nearbyNPC.type === 'magic_trainer') {
      ctx.fillText(`SPACE: Learn Magic`, 8, 235);
    } else if (nearbyNPC.type === 'yoga') {
      ctx.fillText(`SPACE: Yoga Training`, 8, 235);
    } else if (nearbyNPC.type === 'cambus') {
      ctx.fillText(`SPACE: Use Cambus`, 8, 235);
    } else if (nearbyNPC.type === 'food_cart') {
      ctx.fillText(`SPACE: Buy Food`, 8, 235);
    } else {
      ctx.fillText(`SPACE: Talk to ${nearbyNPC.name}`, 8, 235);
    }
  }
  
  // Check for nearby exits
  const map = maps[game.map];
  if (map.exits) {
    for (let exit of map.exits) {
      const dist = Math.sqrt((game.player.x - exit.x) ** 2 + (game.player.y - exit.y) ** 2);
      if (dist < 30) {
        ctx.fillStyle = COLORS.black;
        ctx.fillRect(0, 226, 256, 14);
        ctx.fillStyle = COLORS.lightGreen;
        ctx.font = '6px "Press Start 2P"';
        const destName = maps[exit.toMap].name;
        ctx.fillText(`Entering: ${destName}`, 8, 235);
        break;
      }
    }
  }
}

function drawDialogue() {
  if (!game.dialogue) return;
  
  // Dialogue box
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(8, 160, 240, 70);
  ctx.strokeStyle = COLORS.white;
  ctx.lineWidth = 2;
  ctx.strokeRect(8, 160, 240, 70);
  
  // Text
  ctx.fillStyle = COLORS.white;
  ctx.font = '8px "Press Start 2P"';
  const text = game.dialogue.lines[game.dialogue.currentLine];
  wrapText(text, 16, 175, 220, 12);
  
  // Continue indicator
  if (Math.floor(game.animFrame / 30) % 2 === 0) {
    ctx.fillText('▼', 230, 220);
  }
}

function drawBattle() {
  if (!game.battleState) return;
  
  // Background
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(0, 0, 256, 240);
  
  // Draw enemy with unique sprite
  const enemy = game.battleState.enemy;
  const enemyX = 170;
  const enemyY = 70;
  
  drawEnemySprite(enemy, enemyX, enemyY);
  
  // Enemy name and HP
  ctx.fillStyle = COLORS.white;
  ctx.font = '8px "Press Start 2P"';
  ctx.fillText(enemy.name, 120, 30);
  ctx.fillText(`HP: ${enemy.hp}/${enemy.maxHp}`, 120, 42);
  
  // Enemy HP bar
  ctx.fillStyle = COLORS.red;
  const enemyHpWidth = (enemy.hp / enemy.maxHp) * 80;
  ctx.fillRect(120, 48, enemyHpWidth, 6);
  ctx.strokeStyle = COLORS.white;
  ctx.strokeRect(120, 48, 80, 6);
  
  // Player status
  ctx.fillText(`${game.player.name}`, 20, 120);
  ctx.fillText(`HP: ${game.player.hp}/${game.player.maxHp}`, 20, 132);
  ctx.fillText(`MP: ${game.player.mp}/${game.player.maxMp}`, 20, 144);
  
  // Defense boost indicator
  if (game.battleState.defenseBoost > 0) {
    ctx.fillStyle = COLORS.lightBlue;
    ctx.fillText(`+${game.battleState.defenseBoost} DEF`, 130, 132);
  }
  
  // Actions menu or spell menu
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(10, 155, 236, 75);
  ctx.strokeStyle = COLORS.white;
  ctx.strokeRect(10, 155, 236, 75);
  
  if (game.battleState.inSpellMenu) {
    // Spell menu
    ctx.fillStyle = COLORS.lightBlue;
    ctx.font = '7px "Press Start 2P"';
    ctx.fillText('SPELLS', 20, 167);
    
    ctx.font = '6px "Press Start 2P"';
    game.spells.forEach((spellName, i) => {
      const spell = spellData[spellName];
      const y = 180 + i * 12;
      ctx.fillStyle = COLORS.white;
      if (i === game.battleState.selectedSpell) {
        ctx.fillText('>', 20, y);
      }
      ctx.fillText(spellName, 35, y);
      ctx.fillText(`${spell.mpCost}MP`, 150, y);
      
      // Can't afford
      if (game.player.mp < spell.mpCost) {
        ctx.fillStyle = COLORS.gray;
        ctx.fillText(spellName, 35, y);
      }
    });
    
    // Back option
    const backY = 180 + game.spells.length * 12;
    ctx.fillStyle = COLORS.white;
    if (game.battleState.selectedSpell === game.spells.length) {
      ctx.fillText('>', 20, backY);
    }
    ctx.fillText('Back', 35, backY);
  } else if (game.battleState.inItemMenu) {
    // Item menu
    ctx.fillStyle = COLORS.orange;
    ctx.font = '7px "Press Start 2P"';
    ctx.fillText('ITEMS', 20, 167);
    
    ctx.font = '6px "Press Start 2P"';
    game.consumables.forEach((item, i) => {
      const y = 180 + i * 12;
      ctx.fillStyle = COLORS.white;
      if (i === game.battleState.selectedItem) {
        ctx.fillText('>', 20, y);
      }
      ctx.fillText(item.name, 35, y);
    });
    
    // Back option
    const backY = 180 + game.consumables.length * 12;
    ctx.fillStyle = COLORS.white;
    if (game.battleState.selectedItem === game.consumables.length) {
      ctx.fillText('>', 20, backY);
    }
    ctx.fillText('Back', 35, backY);
  } else {
    // Main battle menu
    const actions = ['Attack', 'Magic', 'Item', 'Run'];
    actions.forEach((action, i) => {
      ctx.fillStyle = COLORS.white;
      const y = 170 + i * 15;
      if (i === game.battleState.selectedAction) {
        ctx.fillText('>', 20, y);
      }
      ctx.fillText(action, 35, y);
    });
  }
  
  // Message
  ctx.fillStyle = COLORS.yellow;
  wrapText(game.battleState.message, 20, 100, 216, 10);
}

function drawEnemySprite(enemy, x, y) {
  if (enemy.name === 'Parking Meter') {
    // Parking meter - gray pole with red expired sign
    ctx.fillStyle = COLORS.gray;
    ctx.fillRect(x - 4, y, 8, 30); // pole
    ctx.fillRect(x - 10, y - 8, 20, 12); // meter box
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(x - 8, y - 6, 16, 8); // EXPIRED display
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 6, y - 4, 4, 2);
    ctx.fillRect(x + 2, y - 4, 4, 2);
    // Coin slot
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 2, y + 2, 4, 2);
    
  } else if (enemy.name === 'Late Assignment') {
    // Paper with red "LATE" stamp and stressed lines
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 12, y - 8, 24, 32); // paper
    ctx.strokeStyle = COLORS.black;
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 12, y - 8, 24, 32);
    // Lines on paper
    ctx.fillStyle = COLORS.blue;
    ctx.fillRect(x - 10, y, 20, 1);
    ctx.fillRect(x - 10, y + 4, 20, 1);
    ctx.fillRect(x - 10, y + 8, 20, 1);
    ctx.fillRect(x - 10, y + 12, 20, 1);
    // Red LATE stamp
    ctx.fillStyle = COLORS.red;
    ctx.font = '8px "Press Start 2P"';
    ctx.fillText('LATE', x - 10, y + 20);
    
  } else if (enemy.name === 'Midterm Exam') {
    // Test paper with multiple choice bubbles and scary face
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 14, y - 10, 28, 36);
    ctx.strokeStyle = COLORS.black;
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 14, y - 10, 28, 36);
    // Title
    ctx.fillStyle = COLORS.purple;
    ctx.font = '6px "Press Start 2P"';
    ctx.fillText('EXAM', x - 10, y - 4);
    // Multiple choice bubbles
    ctx.strokeStyle = COLORS.black;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(x - 10, y + 4 + i * 5, 2, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Scary face
    ctx.fillStyle = COLORS.purple;
    ctx.fillRect(x + 2, y + 8, 3, 3); // eyes
    ctx.fillRect(x + 7, y + 8, 3, 3);
    ctx.fillRect(x + 2, y + 16, 8, 2); // frown
    
  } else if (enemy.name === 'Group Project') {
    // Multiple stick figures arguing with speech bubbles
    ctx.fillStyle = COLORS.orange;
    // Person 1
    ctx.fillRect(x - 14, y - 4, 6, 8); // body
    ctx.fillRect(x - 12, y - 10, 4, 4); // head
    // Person 2
    ctx.fillRect(x - 4, y - 2, 6, 8);
    ctx.fillRect(x - 2, y - 8, 4, 4);
    // Person 3
    ctx.fillRect(x + 6, y - 4, 6, 8);
    ctx.fillRect(x + 8, y - 10, 4, 4);
    // Angry speech bubbles
    ctx.strokeStyle = COLORS.white;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x - 16, y - 14, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y - 12, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 14, y - 14, 4, 0, Math.PI * 2);
    ctx.stroke();
    // Exclamation marks
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(x - 17, y - 16, 2, 4);
    ctx.fillRect(x - 1, y - 14, 2, 4);
    ctx.fillRect(x + 13, y - 16, 2, 4);
    
  } else if (enemy.name === 'Raccoon') {
    // Raccoon with mask and garbage
    ctx.fillStyle = COLORS.darkGray;
    // Body
    ctx.fillRect(x - 8, y + 4, 16, 12);
    // Head
    ctx.fillRect(x - 6, y - 6, 12, 10);
    // Ears
    ctx.fillRect(x - 8, y - 8, 4, 4);
    ctx.fillRect(x + 4, y - 8, 4, 4);
    // Mask (black around eyes)
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 5, y - 2, 10, 4);
    // Eyes (white)
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 4, y - 1, 2, 2);
    ctx.fillRect(x + 2, y - 1, 2, 2);
    // Nose
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 1, y + 2, 2, 2);
    // Tail stripes
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x + 6, y + 8, 8, 4);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x + 8, y + 8, 2, 4);
    ctx.fillRect(x + 12, y + 8, 2, 4);
    // Garbage can
    ctx.fillStyle = COLORS.gray;
    ctx.fillRect(x - 14, y + 8, 6, 8);
    
  } else if (enemy.name === 'Coffee Withdrawal') {
    // Empty coffee cup with sad/angry face, steam lines
    ctx.fillStyle = COLORS.brown;
    // Cup
    ctx.fillRect(x - 8, y, 16, 14);
    ctx.fillRect(x - 10, y + 12, 20, 4);
    // Handle
    ctx.strokeStyle = COLORS.brown;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + 10, y + 6, 4, -Math.PI/2, Math.PI/2);
    ctx.stroke();
    // Empty interior (white)
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 6, y + 2, 12, 8);
    // Sad/angry face on cup
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 4, y + 4, 2, 2); // eyes
    ctx.fillRect(x + 2, y + 4, 2, 2);
    ctx.fillRect(x - 3, y + 8, 6, 1); // frown
    // No steam (it's empty!)
    ctx.fillStyle = COLORS.red;
    ctx.font = '6px "Press Start 2P"';
    ctx.fillText('EMPTY', x - 12, y - 4);
    
  } else if (enemy.name === 'Final Boss: Thesis') {
    // Massive book/document with chains and ominous aura
    ctx.fillStyle = COLORS.blue;
    // Large book
    ctx.fillRect(x - 16, y - 12, 32, 40);
    // Spine detail
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 16, y - 12, 4, 40);
    // Pages
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 12, y - 10, 26, 36);
    // Title
    ctx.fillStyle = COLORS.black;
    ctx.font = '6px "Press Start 2P"';
    ctx.fillText('THESIS', x - 10, y - 2);
    // Chains
    ctx.strokeStyle = COLORS.darkGray;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 12, y - 8);
    ctx.lineTo(x - 8, y - 4);
    ctx.lineTo(x - 12, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 12, y - 8);
    ctx.lineTo(x + 8, y - 4);
    ctx.lineTo(x + 12, y);
    ctx.stroke();
    // Scary eyes
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(x - 8, y + 8, 4, 4);
    ctx.fillRect(x + 4, y + 8, 4, 4);
    // Ominous aura
    ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
    ctx.fillRect(x - 18, y - 14, 36, 44);
    
  } else {
    // Default enemy sprite (fallback)
    ctx.fillStyle = enemy.color;
    ctx.fillRect(x - 10, y - 10, 20, 20);
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 6, y - 6, 4, 4);
    ctx.fillRect(x + 2, y - 6, 4, 4);
    ctx.fillRect(x - 4, y + 4, 8, 2);
  }
}

function drawMenu() {
  if (!game.menuOpen) return;
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
  ctx.fillRect(20, 30, 216, 180);
  ctx.strokeStyle = COLORS.white;
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 30, 216, 180);
  
  // Tab headers
  ctx.fillStyle = game.menuTab === 0 ? COLORS.yellow : COLORS.gray;
  ctx.font = '7px "Press Start 2P"';
  ctx.fillText('STATS', 35, 43);
  
  ctx.fillStyle = game.menuTab === 1 ? COLORS.yellow : COLORS.gray;
  ctx.fillText('MAP', 95, 43);
  
  ctx.fillStyle = game.menuTab === 2 ? COLORS.yellow : COLORS.gray;
  ctx.fillText('ITEMS', 145, 43);
  
  // Tab indicator
  ctx.fillStyle = COLORS.yellow;
  if (game.menuTab === 0) {
    ctx.fillRect(30, 46, 40, 2);
  } else if (game.menuTab === 1) {
    ctx.fillRect(90, 46, 25, 2);
  } else {
    ctx.fillRect(140, 46, 35, 2);
  }
  
  if (game.menuTab === 0) {
    // Stats tab
    ctx.fillStyle = COLORS.white;
    ctx.font = '6px "Press Start 2P"';
    ctx.fillText('CHARACTER', 30, 60);
    ctx.fillText(`Name: ${game.player.name}`, 30, 72);
    ctx.fillText(`Level: ${game.player.level}`, 30, 82);
    ctx.fillText(`HP: ${game.player.hp}/${game.player.maxHp}`, 30, 92);
    ctx.fillText(`MP: ${game.player.mp}/${game.player.maxMp}`, 30, 102);
    ctx.fillText(`Attack: ${game.player.attack}`, 30, 112);
    ctx.fillText(`Magic: ${game.player.magic}`, 130, 112);
    ctx.fillText(`Defense: ${game.player.defense}`, 30, 122);
    ctx.fillText(`EXP: ${game.player.exp}/${game.player.level * 30}`, 30, 132);
    ctx.fillText(`Gold: $${game.player.gold}`, 30, 142);
    
    // Skills
    if (game.skills.length > 0) {
      ctx.fillText('SKILLS', 30, 158);
      game.skills.slice(0, 2).forEach((skill, i) => {
        ctx.fillText(`- ${skill}`, 30, 170 + i * 10);
      });
    }
    
    // Spells
    if (game.spells.length > 0) {
      const spellY = game.skills.length > 0 ? 158 : 158;
      ctx.fillText('SPELLS', 130, spellY);
      game.spells.slice(0, 2).forEach((spell, i) => {
        ctx.fillText(`- ${spell}`, 130, spellY + 12 + i * 10);
      });
    }
  } else if (game.menuTab === 1) {
    // Map tab - draw minimap
    ctx.fillStyle = COLORS.white;
    ctx.font = '6px "Press Start 2P"';
    ctx.fillText('IOWA CITY MAP', 60, 60);
    
    // Draw simplified map layout
    const mapStartX = 40;
    const mapStartY = 70;
    const tileSize = 4;
    
    // Draw each area as a colored rectangle with label
    const areas = [
      { name: 'Downtown', x: 4, y: 4, w: 4, h: 3, color: COLORS.gray, map: 'downtown' },
      { name: 'Pentacrest', x: 4, y: 0, w: 4, h: 3, color: COLORS.green, map: 'pentacrest' },
      { name: 'Library', x: 9, y: 0, w: 3, h: 3, color: COLORS.brown, map: 'library' },
      { name: 'Riverside', x: 0, y: 4, w: 3, h: 3, color: COLORS.lightBlue, map: 'riverside' },
      { name: 'Deadwood', x: 9, y: 4, w: 3, h: 3, color: COLORS.orange, map: 'deadwood' },
      { name: 'Northside', x: 4, y: 8, w: 4, h: 3, color: COLORS.red, map: 'northside' }
    ];
    
    areas.forEach(area => {
      // Draw area
      ctx.fillStyle = area.color;
      ctx.fillRect(
        mapStartX + area.x * (tileSize + 1),
        mapStartY + area.y * (tileSize + 1),
        area.w * (tileSize + 1),
        area.h * (tileSize + 1)
      );
      
      // Highlight current location
      if (game.map === area.map) {
        ctx.strokeStyle = COLORS.yellow;
        ctx.lineWidth = 2;
        ctx.strokeRect(
          mapStartX + area.x * (tileSize + 1) - 1,
          mapStartY + area.y * (tileSize + 1) - 1,
          area.w * (tileSize + 1) + 2,
          area.h * (tileSize + 1) + 2
        );
      }
    });
    
    // Draw location names
    ctx.fillStyle = COLORS.white;
    ctx.font = '5px "Press Start 2P"';
    ctx.fillText('Riverside', 40, 95);
    ctx.fillText('Downtown', 95, 95);
    ctx.fillText('Deadwood', 133, 95);
    ctx.fillText('Pentacrest', 90, 77);
    ctx.fillText('Library', 145, 77);
    ctx.fillText('Northside', 95, 115);
    
    // Current location indicator
    const currentArea = areas.find(a => a.map === game.map);
    if (currentArea) {
      ctx.fillStyle = COLORS.yellow;
      ctx.font = '6px "Press Start 2P"';
      ctx.fillText(`You are: ${currentArea.name}`, 40, 125);
    }
    
    // Legend
    ctx.fillStyle = COLORS.gray;
    ctx.font = '5px "Press Start 2P"';
    ctx.fillText('Use Cambus for fast travel', 40, 145);
  } else if (game.menuTab === 2) {
    // Items tab
    ctx.fillStyle = COLORS.white;
    ctx.font = '6px "Press Start 2P"';
    ctx.fillText('CONSUMABLES', 70, 60);
    
    if (game.consumables.length === 0) {
      ctx.fillStyle = COLORS.gray;
      ctx.fillText('No items', 80, 80);
    } else {
      game.consumables.forEach((item, i) => {
        const y = 75 + i * 15;
        
        if (i === game.itemMenuSelection) {
          ctx.fillStyle = COLORS.yellow;
          ctx.fillText('>', 30, y);
        }
        
        ctx.fillStyle = COLORS.white;
        ctx.fillText(item.name, 45, y);
        
        ctx.fillStyle = COLORS.gray;
        ctx.font = '5px "Press Start 2P"';
        ctx.fillText(item.description, 45, y + 8);
        ctx.font = '6px "Press Start 2P"';
      });
      
      ctx.fillStyle = COLORS.gray;
      ctx.font = '5px "Press Start 2P"';
      ctx.fillText('SPACE: Use item', 60, 190);
    }
  }
  
  ctx.fillStyle = COLORS.gray;
  ctx.font = '5px "Press Start 2P"';
  ctx.fillText('<- -> Switch tabs', 60, 200);
  ctx.fillText('ESC: Close', 90, 190);
}

function drawShop() {
  if (!game.shopOpen) return;
  
  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
  ctx.fillRect(15, 25, 226, 190);
  ctx.strokeStyle = COLORS.yellow;
  ctx.lineWidth = 3;
  ctx.strokeRect(15, 25, 226, 190);
  
  ctx.fillStyle = COLORS.yellow;
  ctx.font = '8px "Press Start 2P"';
  ctx.fillText('SHOP', 105, 40);
  
  ctx.fillStyle = COLORS.white;
  ctx.font = '6px "Press Start 2P"';
  ctx.fillText(`Gold: $${game.player.gold}`, 25, 55);
  
  // Items
  shopItems.forEach((item, i) => {
    const y = 75 + i * 20;
    ctx.fillStyle = COLORS.white;
    
    if (i === game.shopSelection) {
      ctx.fillStyle = COLORS.yellow;
      ctx.fillText('>', 25, y);
    }
    
    ctx.fillText(item.name, 40, y);
    ctx.fillText(`$${item.price}`, 150, y);
    
    ctx.fillStyle = COLORS.gray;
    ctx.font = '5px "Press Start 2P"';
    ctx.fillText(item.description, 40, y + 8);
    ctx.font = '6px "Press Start 2P"';
  });
  
  // Exit option
  const exitY = 75 + shopItems.length * 20;
  ctx.fillStyle = game.shopSelection === shopItems.length ? COLORS.yellow : COLORS.white;
  if (game.shopSelection === shopItems.length) {
    ctx.fillText('>', 25, exitY);
  }
  ctx.fillText('Exit Shop', 40, exitY);
  
  ctx.fillStyle = COLORS.gray;
  ctx.font = '5px "Press Start 2P"';
  ctx.fillText('SPACE: Buy | ESC: Exit', 45, 205);
}

function drawMagicTrainer() {
  if (!game.magicTrainerOpen) return;
  
  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
  ctx.fillRect(15, 25, 226, 190);
  ctx.strokeStyle = COLORS.purple;
  ctx.lineWidth = 3;
  ctx.strokeRect(15, 25, 226, 190);
  
  ctx.fillStyle = COLORS.purple;
  ctx.font = '8px "Press Start 2P"';
  ctx.fillText('MAGIC TRAINING', 70, 40);
  
  ctx.fillStyle = COLORS.white;
  ctx.font = '6px "Press Start 2P"';
  ctx.fillText(`Gold: $${game.player.gold}`, 25, 55);
  ctx.fillText(`Magic: ${game.player.magic}`, 140, 55);
  
  // Training options
  magicTraining.forEach((training, i) => {
    const y = 75 + i * 20;
    const alreadyLearned = training.spell && game.spells.includes(training.spell);
    
    if (alreadyLearned) {
      ctx.fillStyle = COLORS.gray;
    } else {
      ctx.fillStyle = COLORS.white;
    }
    
    if (i === game.magicTrainerSelection && !alreadyLearned) {
      ctx.fillStyle = COLORS.purple;
      ctx.fillText('>', 25, y);
      ctx.fillStyle = COLORS.white;
    } else if (i === game.magicTrainerSelection && alreadyLearned) {
      ctx.fillStyle = COLORS.gray;
      ctx.fillText('>', 25, y);
    }
    
    ctx.fillText(training.name, 40, y);
    if (alreadyLearned) {
      ctx.fillText('LEARNED', 150, y);
    } else {
      ctx.fillText(`$${training.price}`, 150, y);
    }
    
    ctx.fillStyle = COLORS.gray;
    ctx.font = '5px "Press Start 2P"';
    ctx.fillText(training.description, 40, y + 8);
    ctx.font = '6px "Press Start 2P"';
  });
  
  // Exit option
  const exitY = 75 + magicTraining.length * 20;
  ctx.fillStyle = game.magicTrainerSelection === magicTraining.length ? COLORS.purple : COLORS.white;
  if (game.magicTrainerSelection === magicTraining.length) {
    ctx.fillText('>', 25, exitY);
  }
  ctx.fillText('Exit Training', 40, exitY);
  
  ctx.fillStyle = COLORS.gray;
  ctx.font = '5px "Press Start 2P"';
  ctx.fillText('SPACE: Train | ESC: Exit', 45, 205);
}

function drawYoga() {
  if (!game.yogaOpen) return;
  
  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
  ctx.fillRect(15, 25, 226, 190);
  ctx.strokeStyle = COLORS.lightGreen;
  ctx.lineWidth = 3;
  ctx.strokeRect(15, 25, 226, 190);
  
  ctx.fillStyle = COLORS.lightGreen;
  ctx.font = '8px "Press Start 2P"';
  ctx.fillText('YOGA STUDIO', 70, 40);
  
  ctx.fillStyle = COLORS.white;
  ctx.font = '6px "Press Start 2P"';
  ctx.fillText(`Gold: $${game.player.gold}`, 25, 55);
  ctx.fillText(`Defense: ${game.player.defense}`, 130, 55);
  
  // Yoga techniques
  yogaTechniques.forEach((technique, i) => {
    const y = 75 + i * 20;
    const alreadyLearned = technique.skill && game.skills.includes(technique.skill);
    
    if (alreadyLearned) {
      ctx.fillStyle = COLORS.gray;
    } else {
      ctx.fillStyle = COLORS.white;
    }
    
    if (i === game.yogaSelection && !alreadyLearned) {
      ctx.fillStyle = COLORS.lightGreen;
      ctx.fillText('>', 25, y);
      ctx.fillStyle = COLORS.white;
    } else if (i === game.yogaSelection && alreadyLearned) {
      ctx.fillStyle = COLORS.gray;
      ctx.fillText('>', 25, y);
    }
    
    ctx.fillText(technique.name, 40, y);
    if (alreadyLearned) {
      ctx.fillText('LEARNED', 150, y);
    } else {
      ctx.fillText(`$${technique.price}`, 150, y);
    }
    
    ctx.fillStyle = COLORS.gray;
    ctx.font = '5px "Press Start 2P"';
    ctx.fillText(technique.description, 40, y + 8);
    ctx.font = '6px "Press Start 2P"';
  });
  
  // Exit option
  const exitY = 75 + yogaTechniques.length * 20;
  ctx.fillStyle = game.yogaSelection === yogaTechniques.length ? COLORS.lightGreen : COLORS.white;
  if (game.yogaSelection === yogaTechniques.length) {
    ctx.fillText('>', 25, exitY);
  }
  ctx.fillText('Exit Studio', 40, exitY);
  
  ctx.fillStyle = COLORS.gray;
  ctx.font = '5px "Press Start 2P"';
  ctx.fillText('SPACE: Learn | ESC: Exit', 45, 205);
}

function drawCambus() {
  if (!game.cambusOpen) return;
  
  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
  ctx.fillRect(30, 40, 196, 160);
  ctx.strokeStyle = COLORS.yellow;
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 40, 196, 160);
  
  ctx.fillStyle = COLORS.yellow;
  ctx.font = '8px "Press Start 2P"';
  ctx.fillText('CAMBUS ROUTES', 60, 55);
  
  ctx.fillStyle = COLORS.white;
  ctx.font = '6px "Press Start 2P"';
  ctx.fillText('Fast Travel - Free!', 50, 70);
  
  // Routes
  cambusRoutes.forEach((route, i) => {
    const y = 90 + i * 15;
    ctx.fillStyle = COLORS.white;
    
    if (i === game.cambusSelection) {
      ctx.fillStyle = COLORS.yellow;
      ctx.fillText('>', 40, y);
    }
    
    // Highlight current location
    if (game.map === route.map) {
      ctx.fillStyle = COLORS.gray;
      ctx.fillText(route.name + ' (here)', 55, y);
    } else {
      ctx.fillText(route.name, 55, y);
    }
  });
  
  // Exit option
  const exitY = 90 + cambusRoutes.length * 15;
  ctx.fillStyle = game.cambusSelection === cambusRoutes.length ? COLORS.yellow : COLORS.white;
  if (game.cambusSelection === cambusRoutes.length) {
    ctx.fillText('>', 40, exitY);
  }
  ctx.fillText('Stay Here', 55, exitY);
  
  ctx.fillStyle = COLORS.gray;
  ctx.font = '5px "Press Start 2P"';
  ctx.fillText('SPACE: Travel | ESC: Exit', 50, 190);
}

function drawFoodCart() {
  if (!game.foodCartOpen) return;
  
  // Filter items for current vendor
  const vendorItems = consumableItems.filter(item => item.vendor === game.currentVendor);
  
  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
  ctx.fillRect(15, 25, 226, 190);
  ctx.strokeStyle = COLORS.orange;
  ctx.lineWidth = 3;
  ctx.strokeRect(15, 25, 226, 190);
  
  ctx.fillStyle = COLORS.orange;
  ctx.font = '8px "Press Start 2P"';
  ctx.fillText(game.currentVendor.toUpperCase(), 80, 40);
  
  ctx.fillStyle = COLORS.white;
  ctx.font = '6px "Press Start 2P"';
  ctx.fillText(`Gold: $${game.player.gold}`, 25, 55);
  
  // Food items
  vendorItems.forEach((item, i) => {
    const y = 75 + i * 20;
    ctx.fillStyle = COLORS.white;
    
    if (i === game.foodCartSelection) {
      ctx.fillStyle = COLORS.orange;
      ctx.fillText('>', 25, y);
    }
    
    ctx.fillText(item.name, 40, y);
    ctx.fillText(`$${item.price}`, 180, y);
    
    ctx.fillStyle = COLORS.gray;
    ctx.font = '5px "Press Start 2P"';
    ctx.fillText(item.description, 40, y + 8);
    ctx.font = '6px "Press Start 2P"';
  });
  
  // Exit option
  const exitY = 75 + vendorItems.length * 20;
  ctx.fillStyle = game.foodCartSelection === vendorItems.length ? COLORS.orange : COLORS.white;
  if (game.foodCartSelection === vendorItems.length) {
    ctx.fillText('>', 25, exitY);
  }
  ctx.fillText('Exit', 40, exitY);
  
  ctx.fillStyle = COLORS.gray;
  ctx.font = '5px "Press Start 2P"';
  ctx.fillText('SPACE: Buy | ESC: Exit', 50, 205);
}

function wrapText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let yPos = y;
  
  for (let word of words) {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && line !== '') {
      ctx.fillText(line, x, yPos);
      line = word + ' ';
      yPos += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, yPos);
}

// Game loop
function gameLoop() {
  game.animFrame++;
  handleInput();
  
  // Clear
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(0, 0, 256, 240);
  
  if (game.state === 'explore' || game.state === 'dialogue' || game.state === 'shop' || game.state === 'magic_trainer' || game.state === 'yoga' || game.state === 'cambus' || game.state === 'food_cart') {
    drawMap();
    drawNPCs();
    drawPlayer();
    drawHUD();
    if (game.dialogue) {
      drawDialogue();
    }
    if (game.menuOpen) {
      drawMenu();
    }
    if (game.shopOpen) {
      drawShop();
    }
    if (game.magicTrainerOpen) {
      drawMagicTrainer();
    }
    if (game.yogaOpen) {
      drawYoga();
    }
    if (game.cambusOpen) {
      drawCambus();
    }
    if (game.foodCartOpen) {
      drawFoodCart();
    }
  } else if (game.state === 'battle') {
    drawBattle();
  }
  
  requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
