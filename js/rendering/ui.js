// UI Module - HUD, Dialogue, Menu rendering
import { COLORS, isMobile } from '../constants.js';
import { game } from '../game-state.js';
import { maps } from '../maps.js';
import { getButtonLabel, getMenuLabel, wrapText, setCtx } from './utils.js';

export function drawHUD() {
  const ctx = setCtx();
  
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
  const canInteractNow = game.state === 'explore' && !game.menuOpen && !game.dialogue;
  const cambusPromptActive = nearbyNPC && nearbyNPC.type === 'cambus' && canInteractNow;
  if (nearbyNPC) {
    if (nearbyNPC.type === 'cambus' && !canInteractNow) {
      // Hide Cambus prompt unless action can be used immediately
    } else {
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(0, 226, 256, 14);
    ctx.fillStyle = COLORS.yellow;
    ctx.font = '6px "Press Start 2P"';
    
    if (nearbyNPC.type === 'shop') {
      ctx.fillText(getButtonLabel('Enter Shop'), 8, 235);
    } else if (nearbyNPC.type === 'healer') {
      ctx.fillText(getButtonLabel('Get Free Refill'), 8, 235);
    } else if (nearbyNPC.type === 'magic_trainer') {
      ctx.fillText(getButtonLabel('Learn Magic'), 8, 235);
    } else if (nearbyNPC.type === 'yoga') {
      ctx.fillText(getButtonLabel('Yoga Training'), 8, 235);
    } else if (nearbyNPC.type === 'cambus') {
      ctx.fillText(getButtonLabel('Use Cambus'), 8, 235);
    } else if (nearbyNPC.type === 'food_cart') {
      ctx.fillText(getButtonLabel('Buy Food'), 8, 235);
    } else {
      ctx.fillText(getButtonLabel(`Talk to ${nearbyNPC.name}`), 8, 235);
    }
    }
  }
  
  // Check for nearby exits
  if (!cambusPromptActive) {
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
}

export function drawDialogue() {
  const ctx = setCtx();
  
  if (!game.dialogue) return;
  
  const isLevelUp = game.dialogue.type === 'levelUp';
  
  if (isLevelUp) {
    // Level up dialogue with special formatting
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(20, 80, 216, 160);
    ctx.strokeStyle = COLORS.yellow;
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 80, 216, 160);
    
    // Details
    ctx.fillStyle = COLORS.yellow;
    ctx.font = 'bold 8px "Press Start 2P"';
    ctx.textAlign = 'center';
    const currentMsg = game.dialogue.messages[game.dialogue.currentIndex];
    const lines = currentMsg.split('\n');
    
    let yPos = 105;
    lines.forEach((line, i) => {
      // First line in yellow bold (LEVEL UP!)
      if (i === 0) {
        ctx.fillStyle = COLORS.yellow;
        ctx.font = 'bold 8px "Press Start 2P"';
      } else {
        ctx.fillStyle = COLORS.white;
        ctx.font = '7px "Press Start 2P"';
      }
      ctx.textAlign = 'center';
      ctx.fillText(line, 128, yPos);
      yPos += line === '' ? 8 : 12;
    });
    
    ctx.textAlign = 'left';
  } else {
    // Regular dialogue box
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(8, 160, 240, 70);
    ctx.strokeStyle = COLORS.white;
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 160, 240, 70);
    
    // Text
    ctx.fillStyle = COLORS.white;
    ctx.font = '8px "Press Start 2P"';
    const text = game.dialogue.messages[game.dialogue.currentIndex];
    wrapText(text, 16, 175, 220, 12);
  }
  
  // Continue indicator
  if (Math.floor(game.animFrame / 30) % 2 === 0) {
    ctx.fillText('▼', 230, 220);
  }
}

export function drawMenu() {
  const ctx = setCtx();
  
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
      { name: 'City Park', x: 0, y: 4, w: 3, h: 3, color: COLORS.lightBlue, map: 'city_park' },
      { name: 'Deadwood', x: 9, y: 4, w: 3, h: 3, color: COLORS.orange, map: 'deadwood' },
      { name: 'Northside', x: 4, y: 8, w: 4, h: 3, color: COLORS.red, map: 'northside' },
      { name: 'Cemetery', x: 9, y: 8, w: 3, h: 3, color: COLORS.darkGray, map: 'oakland_cemetery' }
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
    ctx.fillText('City Park', 40, 95);
    ctx.fillText('Downtown', 95, 95);
    ctx.fillText('Deadwood', 133, 95);
    ctx.fillText('Pentacrest', 90, 77);
    ctx.fillText('Library', 145, 77);
    ctx.fillText('Northside', 95, 115);
    ctx.fillText('Cemetery', 133, 115);
    
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
        const countText = item.count && item.count > 1 ? ` (x${item.count})` : '';
        ctx.fillText(item.name + countText, 45, y);
        
        ctx.fillStyle = COLORS.gray;
        ctx.font = '5px "Press Start 2P"';
        ctx.fillText(item.description, 45, y + 8);
        ctx.font = '6px "Press Start 2P"';
      });
      
      ctx.fillStyle = COLORS.gray;
      ctx.font = '5px "Press Start 2P"';
      ctx.fillText(getButtonLabel('Use item'), 60, 190);
    }
  }
  
  ctx.fillStyle = COLORS.gray;
  ctx.font = '5px "Press Start 2P"';
  ctx.fillText('<- -> Switch tabs', 60, 200);
  ctx.fillText(getMenuLabel(), 90, 190);
}

// Helper function to get nearby NPC
function getNearbyNPC() {
  const map = maps[game.map];
  let nearestCambus = null;
  let nearestCambusDist = Infinity;
  let nearestNpc = null;
  let nearestNpcDist = Infinity;

  for (let npc of map.npcs) {
    const dist = Math.sqrt(
      (game.player.x - npc.x) ** 2 + (game.player.y - npc.y) ** 2
    );
    
    if (dist < 24) {
      if (npc.type === 'cambus') {
        if (dist < nearestCambusDist) {
          nearestCambus = npc;
          nearestCambusDist = dist;
        }
      } else if (dist < nearestNpcDist) {
        nearestNpc = npc;
        nearestNpcDist = dist;
      }
    }
  }

  return nearestCambus || nearestNpc;
}
