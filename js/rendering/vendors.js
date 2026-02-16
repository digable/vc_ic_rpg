// Vendors Module - Shop and NPC interaction screens
import { COLORS, isMobile } from '../constants.js';
import { game } from '../game-state.js';
import { shopItems, magicTraining, yogaTechniques, cambusRoutes, consumableItems } from '../data.js';
import { getButtonLabel, setCtx } from './utils.js';

export function drawShop() {
  const ctx = setCtx();
  
  if (!game.shopOpen) return;
  
  const itemsPerPage = 5;
  const startIdx = game.shopPage * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const pageItems = shopItems.slice(startIdx, endIdx);
  const totalPages = Math.ceil(shopItems.length / itemsPerPage);
  
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
  
  // Page indicator
  ctx.fillStyle = COLORS.gray;
  ctx.font = '5px "Press Start 2P"';
  ctx.fillText(`Page ${game.shopPage + 1}/${totalPages}`, 150, 55);
  
  // Items
  pageItems.forEach((item, i) => {
    const y = 75 + i * 20;
    ctx.fillStyle = COLORS.white;
    ctx.font = '6px "Press Start 2P"';
    
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
  const exitY = 75 + pageItems.length * 20;
  ctx.fillStyle = game.shopSelection === pageItems.length ? COLORS.yellow : COLORS.white;
  if (game.shopSelection === pageItems.length) {
    ctx.fillText('>', 25, exitY);
  }
  ctx.fillText('Exit Shop', 40, exitY);
  
  ctx.fillStyle = COLORS.gray;
  ctx.font = '5px "Press Start 2P"';
  ctx.fillText(isMobile ? 'A: Buy | M: Exit | </>: Pages' : 'SPACE: Buy | ESC: Exit | L/R: Pages', 35, 205);
}

export function drawMagicTrainer() {
  const ctx = setCtx();
  
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
  ctx.fillText(isMobile ? 'A: Train | M: Exit' : 'SPACE: Train | ESC: Exit', 45, 205);
}

export function drawYoga() {
  const ctx = setCtx();
  
  if (!game.yogaOpen) return;
  
  const itemsPerPage = 5;
  const startIdx = game.yogaPage * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const pageItems = yogaTechniques.slice(startIdx, endIdx);
  const totalPages = Math.ceil(yogaTechniques.length / itemsPerPage);
  
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
  
  // Page indicator
  ctx.fillStyle = COLORS.gray;
  ctx.font = '5px "Press Start 2P"';
  ctx.fillText(`Page ${game.yogaPage + 1}/${totalPages}`, 150, 55);
  
  // Yoga techniques
  pageItems.forEach((technique, i) => {
    const y = 75 + i * 20;
    const alreadyLearned = technique.skill && game.skills.includes(technique.skill);
    
    if (alreadyLearned) {
      ctx.fillStyle = COLORS.gray;
    } else {
      ctx.fillStyle = COLORS.white;
    }
    
    ctx.font = '6px "Press Start 2P"';
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
  });
  
  // Exit option
  const exitY = 75 + pageItems.length * 20;
  ctx.fillStyle = game.yogaSelection === pageItems.length ? COLORS.lightGreen : COLORS.white;
  ctx.font = '6px "Press Start 2P"';
  if (game.yogaSelection === pageItems.length) {
    ctx.fillText('>', 25, exitY);
  }
  ctx.fillText('Exit Studio', 40, exitY);
  
  ctx.fillStyle = COLORS.gray;
  ctx.font = '5px "Press Start 2P"';
  if (totalPages > 1) {
    ctx.fillText(isMobile ? 'A: Learn | M: Exit | </>: Pages' : 'SPACE: Learn | ESC: Exit | L/R: Pages', 30, 205);
  } else {
    ctx.fillText(isMobile ? 'A: Learn | M: Exit' : 'SPACE: Learn | ESC: Exit', 45, 205);
  }
}

export function drawCambus() {
  const ctx = setCtx();
  
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
  ctx.fillText(isMobile ? 'A: Travel | M: Exit' : 'SPACE: Travel | ESC: Exit', 50, 190);
}

export function drawFoodCart() {
  const ctx = setCtx();
  
  if (!game.foodCartOpen) return;
  
  // Filter items for current vendor (case-insensitive, trimmed)
  const vendorItems = consumableItems.filter(item => {
    if (!item.vendor || !game.currentVendor) return false;
    return item.vendor.toString().trim().toLowerCase() === String(game.currentVendor).trim().toLowerCase();
  });
  
  const itemsPerPage = 5;
  const startIdx = game.foodCartPage * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const pageItems = vendorItems.slice(startIdx, endIdx);
  const totalPages = Math.ceil(vendorItems.length / itemsPerPage);
  
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
  
  // Page indicator
  ctx.fillStyle = COLORS.gray;
  ctx.font = '5px "Press Start 2P"';
  if (totalPages > 1) {
    ctx.fillText(`Page ${game.foodCartPage + 1}/${totalPages}`, 150, 55);
  }
  
  // Food items
  pageItems.forEach((item, i) => {
    const y = 75 + i * 20;
    ctx.fillStyle = COLORS.white;
    ctx.font = '6px "Press Start 2P"';
    
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
  const exitY = 75 + pageItems.length * 20;
  ctx.fillStyle = game.foodCartSelection === pageItems.length ? COLORS.orange : COLORS.white;
  if (game.foodCartSelection === pageItems.length) {
    ctx.fillText('>', 25, exitY);
  }
  ctx.fillText('Exit', 40, exitY);
  
  ctx.fillStyle = COLORS.gray;
  ctx.font = '5px "Press Start 2P"';
  if (totalPages > 1) {
    ctx.fillText(isMobile ? 'A: Buy | M: Exit | </>: Pages' : 'SPACE: Buy | ESC: Exit | L/R: Pages', 40, 205);
  } else {
    ctx.fillText(isMobile ? 'A: Buy | M: Exit' : 'SPACE: Buy | ESC: Exit', 50, 205);
  }
}
