// Interaction Handlers Module
import { game, addConsumable, actions } from './game-state.js';
import { shopItems, magicTraining, yogaTechniques, consumableItems, cambusRoutes } from './data.js';
import { startDialogue } from './dialogue.js';
import { updateQuestProgress } from './features/quests/input.js';
import { travelToMapDestination } from './features/world/map-transition-service.js';

export function openShop() {
  actions.vendorScreenOpened('shop', 'shopOpen', {
    shopSelection: 0
  });
}

export function openMagicTrainer() {
  actions.vendorScreenOpened('magic_trainer', 'magicTrainerOpen', {
    magicTrainerSelection: 0,
    magicTrainerPage: 0
  });
}

export function openYoga() {
  actions.vendorScreenOpened('yoga', 'yogaOpen', {
    yogaSelection: 0
  });
}

export function openCambus() {
  actions.vendorScreenOpened('cambus', 'cambusOpen', {
    cambusSelection: 0,
    cambusPage: 0
  });
}

export function healPlayer() {
  actions.playerPatched({
    hp: game.player.maxHp,
    mp: game.player.maxMp
  }, 'playerHealedAtHealer');
  startDialogue(['Free refill!', 'Your HP and MP are fully restored!', 'Come back anytime!']);
}

export function handleShopPurchase() {
  const itemsPerPage = 5;
  const startIdx = game.shopPage * itemsPerPage;
  const pageItems = shopItems.slice(startIdx, startIdx + itemsPerPage);
  
  if (game.shopSelection === pageItems.length) {
    // Exit selected
    actions.vendorScreenClosed('shopOpen', {
      shopPage: 0,
      shopSelection: 0
    });
    return;
  }
  
  const actualIdx = startIdx + game.shopSelection;
  const item = shopItems[actualIdx];
  if (game.player.gold >= item.price) {
    const playerPatch = {
      gold: game.player.gold - item.price
    };
    
    // Apply item effect
    if (item.effect === 'heal') {
      playerPatch.hp = Math.min(game.player.maxHp, game.player.hp + item.amount);
    } else if (item.effect === 'healMP') {
      playerPatch.mp = Math.min(game.player.maxMp, game.player.mp + item.amount);
    } else if (item.effect === 'strengthUp') {
      playerPatch.strength = (game.player.strength || 0) + item.amount;
    } else if (item.effect === 'intellectUp') {
      playerPatch.intellect = (game.player.intellect || 0) + item.amount;
    } else if (item.effect === 'agilityUp') {
      playerPatch.agility = (game.player.agility || 0) + item.amount;
    } else if (item.effect === 'vitalityUp') {
      playerPatch.vitality = (game.player.vitality || 0) + item.amount;
      playerPatch.maxHp = game.player.maxHp + 20;
      playerPatch.hp = game.player.hp + 20;
    } else if (item.effect === 'luckUp') {
      playerPatch.luck = (game.player.luck || 0) + item.amount;
    } else if (item.effect === 'defenseUp') {
      playerPatch.defense = game.player.defense + item.amount;
    } else if (item.effect === 'attackUp') {
      playerPatch.attack = game.player.attack + item.amount;
    } else if (item.effect === 'maxHpUp') {
      playerPatch.maxHp = game.player.maxHp + item.amount;
      playerPatch.hp = game.player.hp + item.amount;
    }

    actions.playerPatched(playerPatch, 'shopPurchaseApplied');
    
    game.inventory.push(item.name);
    
    // Show purchase confirmation
    startDialogue([`Purchased ${item.name}!`, item.description]);
    actions.vendorScreenClosed('shopOpen', {}, 'dialogue');
  }
}

export function handleMagicTraining() {
  const itemsPerPage = 5;
  const startIdx = game.magicTrainerPage * itemsPerPage;
  const pageItems = magicTraining.slice(startIdx, startIdx + itemsPerPage);

  if (game.magicTrainerSelection === pageItems.length) {
    // Exit selected
    actions.vendorScreenClosed('magicTrainerOpen', {
      magicTrainerPage: 0,
      magicTrainerSelection: 0
    });
    return;
  }

  const actualIdx = startIdx + game.magicTrainerSelection;
  const training = magicTraining[actualIdx];
  
  // Check if already learned this spell
  if (training.spell && game.spells.includes(training.spell)) {
    actions.gameStatePatched({ battleState: { message: 'Already learned this spell!' } }, 'magicTrainingAlreadyLearned');
    return;
  }
  
  if (game.player.gold >= training.price) {
    const playerPatch = {
      gold: game.player.gold - training.price
    };
    
    // Apply training effect
    if (training.effect === 'magicUp') {
      playerPatch.intellect = (game.player.intellect || 0) + training.amount;
    } else if (training.effect === 'intellectUp') {
      playerPatch.intellect = (game.player.intellect || 0) + training.amount;
    } else if (training.effect === 'magicMpUp') {
      playerPatch.maxMp = game.player.maxMp + training.amount;
      playerPatch.mp = game.player.mp + training.amount;
    } else if (training.effect === 'magicCombo') {
      playerPatch.intellect = (game.player.intellect || 0) + 5;
      playerPatch.maxMp = game.player.maxMp + 15;
      playerPatch.mp = game.player.mp + 15;
    } else if (training.effect === 'spiritUp') {
      playerPatch.spirit = (game.player.spirit || 0) + training.amount;
    }

    actions.playerPatched(playerPatch, 'magicTrainingApplied');
    
    // Learn the spell
    if (training.spell && !game.spells.includes(training.spell)) {
      game.spells.push(training.spell);
    }
    game.inventory.push(training.name);
    
    // Show training confirmation
    const messages = [`Completed ${training.name}!`];
    if (training.spell) {
      messages.push(`Learned ${training.spell}!`);
    }
    if (training.effect === 'magicUp' || training.effect === 'intellectUp') {
      messages.push(`Intellect increased by ${training.amount}!`);
    } else if (training.effect === 'magicMpUp') {
      messages.push(`Max MP increased by ${training.amount}!`);
    } else if (training.effect === 'magicCombo') {
      messages.push(`Intellect +5, Max MP +15!`);
    } else if (training.effect === 'spiritUp') {
      messages.push(`Spirit increased by ${training.amount}!`);
    }
    startDialogue(messages);
    actions.vendorScreenClosed('magicTrainerOpen', {}, 'dialogue');
  }
}

export function handleYogaTraining() {
  const itemsPerPage = 5;
  const startIdx = game.yogaPage * itemsPerPage;
  const pageItems = yogaTechniques.slice(startIdx, startIdx + itemsPerPage);
  
  if (game.yogaSelection === pageItems.length) {
    // Exit selected
    actions.vendorScreenClosed('yogaOpen', {
      yogaPage: 0,
      yogaSelection: 0
    });
    return;
  }
  
  const actualIdx = startIdx + game.yogaSelection;
  const technique = yogaTechniques[actualIdx];
  
  // Check if already learned this skill
  if (technique.skill && game.skills.includes(technique.skill)) {
    return; // Just don't do anything, they already have it
  }
  
  if (game.player.gold >= technique.price) {
    const playerPatch = {
      gold: game.player.gold - technique.price
    };
    
    // Apply technique effects
    if (technique.effect === 'strengthUp') {
      playerPatch.strength = (game.player.strength || 0) + technique.amount;
    } else if (technique.effect === 'defenseUp') {
      playerPatch.defense = game.player.defense + technique.amount;
    } else if (technique.effect === 'vitalityUp') {
      playerPatch.vitality = (game.player.vitality || 0) + technique.amount;
    } else if (technique.effect === 'agilityUp') {
      playerPatch.agility = (game.player.agility || 0) + technique.amount;
    } else if (technique.effect === 'spiritUp') {
      playerPatch.spirit = (game.player.spirit || 0) + technique.amount;
    } else if (technique.effect === 'hpMpCombo') {
      playerPatch.maxHp = game.player.maxHp + 15;
      playerPatch.hp = game.player.hp + 15;
      playerPatch.maxMp = game.player.maxMp + 10;
      playerPatch.mp = game.player.mp + 10;
    } else if (technique.effect === 'defenseCombo') {
      playerPatch.defense = game.player.defense + technique.amount;
    }

    actions.playerPatched(playerPatch, 'yogaTrainingApplied');
    
    // Learn the skill
    if (technique.skill && !game.skills.includes(technique.skill)) {
      game.skills.push(technique.skill);
    }
    game.inventory.push(technique.name);
    
    // Show training confirmation
    const messages = [`Completed ${technique.name}!`];
    if (technique.skill) {
      messages.push(`Learned ${technique.skill}!`);
    }
    if (technique.effect === 'strengthUp') {
      messages.push(`Strength increased by ${technique.amount}!`);
    } else if (technique.effect === 'defenseUp') {
      messages.push(`Defense increased by ${technique.amount}!`);
    } else if (technique.effect === 'vitalityUp') {
      messages.push(`Vitality increased by ${technique.amount}!`);
    } else if (technique.effect === 'agilityUp') {
      messages.push(`Agility increased by ${technique.amount}!`);
    } else if (technique.effect === 'spiritUp') {
      messages.push(`Spirit increased by ${technique.amount}!`);
    } else if (technique.effect === 'hpMpCombo') {
      messages.push(`Max HP +15, Max MP +10!`);
    } else if (technique.effect === 'defenseCombo') {
      messages.push(`Defense increased by ${technique.amount}!`);
    }
    startDialogue(messages);
    actions.vendorScreenClosed('yogaOpen', {}, 'dialogue');
  }
}

export function handleFoodCartPurchase() {
  const vendorItems = consumableItems.filter(item => {
    if (!item.vendor || !game.currentVendor) return false;
    return item.vendor.toString().trim().toLowerCase() === String(game.currentVendor).trim().toLowerCase();
  });
  
  const itemsPerPage = 5;
  const startIdx = game.foodCartPage * itemsPerPage;
  const pageItems = vendorItems.slice(startIdx, startIdx + itemsPerPage);
  
  if (game.foodCartSelection === pageItems.length) {
    // Exit selected
    actions.vendorScreenClosed('foodCartOpen', {
      foodCartPage: 0,
      foodCartSelection: 0
    });
    return;
  }
  
  const actualIdx = startIdx + game.foodCartSelection;
  const item = vendorItems[actualIdx];
  if (game.player.gold >= item.price) {
    actions.playerPatched({ gold: game.player.gold - item.price }, 'foodCartPurchaseApplied');
    addConsumable(item);
    
    // Update quest progress for vendor purchases
    updateQuestProgress('buy_from_vendor', game.currentVendor);
  }
}

export function handleCambusTravel() {
  const itemsPerPage = 6;
  const startIdx = game.cambusPage * itemsPerPage;
  const pageItems = cambusRoutes.slice(startIdx, startIdx + itemsPerPage);
  const isExitSelected = game.cambusSelection === pageItems.length;

  if (isExitSelected) {
    // Exit selected
    actions.vendorScreenClosed('cambusOpen', {
      cambusPage: 0,
      cambusSelection: 0
    });
    return;
  }
  
  const actualIdx = startIdx + game.cambusSelection;
  const route = cambusRoutes[actualIdx];
  
  // Don't travel if already at this location
  if (game.map === route.map) {
    actions.vendorScreenClosed('cambusOpen', {
      cambusPage: 0,
      cambusSelection: 0
    });
    return;
  }
  
  travelToMapDestination({
    toMap: route.map,
    toX: route.x,
    toY: route.y,
    resetEncounterSteps: true,
    clearFlashlightMode: 'nonCaveDestination'
  });
  actions.vendorScreenClosed('cambusOpen', {
    cambusPage: 0,
    cambusSelection: 0
  });
}

export function interactBlackAngel() {
  const hasAngelWard = game.consumables.some(item => item.name === 'Angel Ward');

  if (hasAngelWard) {
    startDialogue([
      'The Black Angel stands unmoving.',
      'Its blessing is already with you.'
    ]);
    return;
  }

  const angelWard = consumableItems.find(item => item.name === 'Angel Ward');
  if (!angelWard) {
    startDialogue(['A strange stillness lingers here.']);
    return;
  }

  addConsumable(angelWard);
  startDialogue([
    'You kneel before the Black Angel statue.',
    'A cold light settles into your hands...',
    'Received Angel Ward!',
    'Use it in battle for a 50% dodge chance\non the next 3 enemy attacks.'
  ]);
}

