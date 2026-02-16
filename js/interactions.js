// Interaction Handlers Module
import { game } from './game-state.js';
import { shopItems, magicTraining, yogaTechniques, consumableItems, cambusRoutes } from './data.js';
import { startDialogue } from './dialogue.js';
import { updateQuestProgress } from './quests-logic.js';

export function openShop() {
  game.state = 'shop';
  game.shopOpen = true;
  game.shopSelection = 0;
}

export function openMagicTrainer() {
  game.state = 'magic_trainer';
  game.magicTrainerOpen = true;
  game.magicTrainerSelection = 0;
}

export function openYoga() {
  game.state = 'yoga';
  game.yogaOpen = true;
  game.yogaSelection = 0;
}

export function openCambus() {
  game.state = 'cambus';
  game.cambusOpen = true;
  game.cambusSelection = 0;
  game.cambusPage = 0;
}

export function healPlayer() {
  game.player.hp = game.player.maxHp;
  game.player.mp = game.player.maxMp;
  startDialogue(['Free refill!', 'Your HP and MP are fully restored!', 'Come back anytime!']);
  game.state = 'dialogue';
}

export function handleShopPurchase() {
  const itemsPerPage = 5;
  const startIdx = game.shopPage * itemsPerPage;
  const pageItems = shopItems.slice(startIdx, startIdx + itemsPerPage);
  
  if (game.shopSelection === pageItems.length) {
    // Exit selected
    game.state = 'explore';
    game.shopOpen = false;
    game.shopPage = 0;
    game.shopSelection = 0;
    return;
  }
  
  const actualIdx = startIdx + game.shopSelection;
  const item = shopItems[actualIdx];
  if (game.player.gold >= item.price) {
    game.player.gold -= item.price;
    
    // Apply item effect
    if (item.effect === 'heal') {
      game.player.hp = Math.min(game.player.maxHp, game.player.hp + item.amount);
    } else if (item.effect === 'healMP') {
      game.player.mp = Math.min(game.player.maxMp, game.player.mp + item.amount);
    } else if (item.effect === 'strengthUp') {
      game.player.strength = (game.player.strength || 0) + item.amount;
    } else if (item.effect === 'intellectUp') {
      game.player.intellect = (game.player.intellect || 0) + item.amount;
    } else if (item.effect === 'agilityUp') {
      game.player.agility = (game.player.agility || 0) + item.amount;
    } else if (item.effect === 'vitalityUp') {
      game.player.vitality = (game.player.vitality || 0) + item.amount;
      game.player.maxHp += 20;
      game.player.hp += 20;
    } else if (item.effect === 'luckUp') {
      game.player.luck = (game.player.luck || 0) + item.amount;
    } else if (item.effect === 'defenseUp') {
      game.player.defense += item.amount;
    } else if (item.effect === 'attackUp') {
      game.player.attack += item.amount;
    } else if (item.effect === 'maxHpUp') {
      game.player.maxHp += item.amount;
      game.player.hp += item.amount;
    }
    
    game.inventory.push(item.name);
    
    // Show purchase confirmation
    startDialogue([`Purchased ${item.name}!`, item.description]);
    game.state = 'dialogue';
    game.shopOpen = false;
  }
}

export function handleMagicTraining() {
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
      game.player.intellect = (game.player.intellect || 0) + training.amount;
    } else if (training.effect === 'intellectUp') {
      game.player.intellect = (game.player.intellect || 0) + training.amount;
    } else if (training.effect === 'magicMpUp') {
      game.player.maxMp += training.amount;
      game.player.mp += training.amount;
    } else if (training.effect === 'magicCombo') {
      game.player.intellect = (game.player.intellect || 0) + 5;
      game.player.maxMp += 15;
      game.player.mp += 15;
    } else if (training.effect === 'spiritUp') {
      game.player.spirit = (game.player.spirit || 0) + training.amount;
    }
    
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
    game.state = 'dialogue';
    game.magicTrainerOpen = false;
  }
}

export function handleYogaTraining() {
  const itemsPerPage = 5;
  const startIdx = game.yogaPage * itemsPerPage;
  const pageItems = yogaTechniques.slice(startIdx, startIdx + itemsPerPage);
  
  if (game.yogaSelection === pageItems.length) {
    // Exit selected
    game.state = 'explore';
    game.yogaOpen = false;
    game.yogaPage = 0;
    game.yogaSelection = 0;
    return;
  }
  
  const actualIdx = startIdx + game.yogaSelection;
  const technique = yogaTechniques[actualIdx];
  
  // Check if already learned this skill
  if (technique.skill && game.skills.includes(technique.skill)) {
    return; // Just don't do anything, they already have it
  }
  
  if (game.player.gold >= technique.price) {
    game.player.gold -= technique.price;
    
    // Apply technique effects
    if (technique.effect === 'strengthUp') {
      game.player.strength = (game.player.strength || 0) + technique.amount;
    } else if (technique.effect === 'defenseUp') {
      game.player.defense += technique.amount;
    } else if (technique.effect === 'vitalityUp') {
      game.player.vitality = (game.player.vitality || 0) + technique.amount;
    } else if (technique.effect === 'agilityUp') {
      game.player.agility = (game.player.agility || 0) + technique.amount;
    } else if (technique.effect === 'spiritUp') {
      game.player.spirit = (game.player.spirit || 0) + technique.amount;
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
    game.state = 'dialogue';
    game.yogaOpen = false;
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
    game.state = 'explore';
    game.foodCartOpen = false;
    game.foodCartPage = 0;
    game.foodCartSelection = 0;
    return;
  }
  
  const actualIdx = startIdx + game.foodCartSelection;
  const item = vendorItems[actualIdx];
  if (game.player.gold >= item.price) {
    game.player.gold -= item.price;
    game.consumables.push(item);
    
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
    game.state = 'explore';
    game.cambusOpen = false;
    game.cambusPage = 0;
    game.cambusSelection = 0;
    return;
  }
  
  const actualIdx = startIdx + game.cambusSelection;
  const route = cambusRoutes[actualIdx];
  
  // Don't travel if already at this location
  if (game.map === route.map) {
    game.state = 'explore';
    game.cambusOpen = false;
    game.cambusPage = 0;
    game.cambusSelection = 0;
    return;
  }
  
  // Fast travel!
  game.map = route.map;
  game.player.x = route.x;
  game.player.y = route.y;
  game.state = 'explore';
  game.cambusOpen = false;
  game.cambusPage = 0;
  game.cambusSelection = 0;
  if (game.map !== 'beer_caves') {
    game.flashlightOn = false;
  }
  game.enemyEncounterSteps = 0;
}

