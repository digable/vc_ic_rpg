// Rendering World - Map, Player, and NPCs
import { COLORS, tileColors } from '../constants.js';
import { game } from '../game-state.js';
import { maps } from '../maps.js';
import { questDatabase } from '../quests.js';
import { canCompleteQuest } from '../quests-logic.js';
import { ctx } from './utils.js';

export function drawMap() {
  const map = maps[game.map];
  if (game.map === 'beer_caves' && !game.flashlightOn) {
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(0, 0, 256, 240);
    return;
  }
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const tile = map.tiles[y][x];
      let fillStyle = tileColors[tile];
      if (game.map === 'beer_caves' && game.flashlightOn) {
        if (tile === 0) fillStyle = COLORS.lightGray;
        if (tile === 6) fillStyle = COLORS.darkGray;
        if (tile === 2) fillStyle = COLORS.black;
      }
      ctx.fillStyle = fillStyle;
      ctx.fillRect(x * 16, y * 16, 16, 16);
      if (game.map === 'beer_caves' && game.flashlightOn && (tile === 6 || tile === 2)) {
        ctx.strokeStyle = COLORS.lightGray;
        ctx.strokeRect(x * 16 + 1, y * 16 + 1, 14, 14);
      }
      
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

  if (game.map === 'beer_caves' && game.flashlightOn) {
    const radius = Math.min(256, 240) * 0.2;
    const centerX = game.player.x;
    const centerY = game.player.y;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, 256, 240);
    ctx.globalCompositeOperation = 'destination-out';

    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
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

export function drawPlayer() {
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

export function drawNPCs() {
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

export function drawNPC(npc) {
  const x = npc.x;
  const y = npc.y;
  
  if (npc.name === 'Barista') {
    // Green apron, dark skin, bun hairstyle
    ctx.fillStyle = '#2d5016';
    ctx.fillRect(x - 6, y - 4, 12, 10);
    ctx.fillStyle = '#8d5524';
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 2, y - 14, 4, 3);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
  } else if (npc.name === 'Townie') {
    ctx.fillStyle = '#8b0000';
    ctx.fillRect(x - 7, y - 4, 14, 10);
    ctx.fillStyle = COLORS.tan;
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = COLORS.orange;
    ctx.fillRect(x - 6, y - 14, 12, 2);
    ctx.fillRect(x - 8, y - 13, 4, 1);
    ctx.fillStyle = COLORS.brown;
    ctx.fillRect(x - 4, y - 6, 8, 3);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    ctx.fillStyle = '#1a1a4e';
    ctx.fillRect(x - 6, y + 6, 5, 6);
    ctx.fillRect(x + 1, y + 6, 5, 6);
  } else if (npc.name === 'Shop Owner') {
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 6, y - 4, 12, 10);
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(x - 1, y - 3, 2, 8);
    ctx.fillStyle = '#c68642';
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 5, y - 13, 10, 2);
    ctx.strokeStyle = COLORS.black;
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 4, y - 10, 3, 3);
    ctx.strokeRect(x + 1, y - 10, 3, 3);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 1, 1);
    ctx.fillRect(x + 2, y - 9, 1, 1);
    ctx.fillStyle = '#c3b091';
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
  } else if (npc.name === 'Yoga Instructor') {
    ctx.fillStyle = COLORS.purple;
    ctx.fillRect(x - 5, y - 4, 10, 9);
    ctx.fillStyle = COLORS.pink;
    ctx.fillRect(x - 4, y - 13, 8, 9);
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(x + 3, y - 11, 3, 6);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 2, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    ctx.fillStyle = COLORS.purple;
    ctx.fillRect(x - 4, y + 5, 3, 7);
    ctx.fillRect(x + 1, y + 5, 3, 7);
  } else if (npc.name === 'Professor') {
    ctx.fillStyle = '#654321';
    ctx.fillRect(x - 6, y - 4, 12, 10);
    ctx.fillStyle = '#ffe0bd';
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = COLORS.gray;
    ctx.fillRect(x - 5, y - 13, 10, 3);
    ctx.fillRect(x - 6, y - 11, 2, 4);
    ctx.fillRect(x + 4, y - 11, 2, 4);
    ctx.strokeStyle = COLORS.black;
    ctx.strokeRect(x - 4, y - 10, 3, 3);
    ctx.strokeRect(x + 1, y - 10, 3, 3);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 1, 1);
    ctx.fillRect(x + 2, y - 9, 1, 1);
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
  } else if (npc.name === 'Student') {
    ctx.fillStyle = '#505050';
    ctx.fillRect(x - 6, y - 4, 12, 10);
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 4, y - 2, 2, 6);
    ctx.fillRect(x + 2, y - 2, 2, 6);
    ctx.fillStyle = COLORS.tan;
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = COLORS.brown;
    ctx.fillRect(x - 5, y - 13, 10, 4);
    ctx.fillRect(x - 6, y - 12, 2, 2);
    ctx.fillRect(x + 4, y - 11, 2, 2);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 8, 2, 1);
    ctx.fillRect(x + 1, y - 8, 2, 1);
    ctx.fillStyle = '#1a1a4e';
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
  } else if (npc.name === 'Librarian') {
    ctx.fillStyle = '#d2b48c';
    ctx.fillRect(x - 6, y - 4, 12, 10);
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(x - 8, y - 2, 3, 4);
    ctx.fillStyle = COLORS.tan;
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = COLORS.brown;
    ctx.fillRect(x - 2, y - 14, 4, 3);
    ctx.strokeStyle = COLORS.black;
    ctx.strokeRect(x - 4, y - 10, 3, 3);
    ctx.strokeRect(x + 1, y - 10, 3, 3);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 1, 1);
    ctx.fillRect(x + 2, y - 9, 1, 1);
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 6, y + 6, 12, 6);
  } else if (npc.name === 'Researcher') {
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 6, y - 4, 12, 10);
    ctx.fillStyle = COLORS.brown;
    ctx.fillRect(x + 6, y - 1, 3, 3);
    ctx.fillStyle = '#c68642';
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 6, y - 13, 12, 3);
    ctx.fillRect(x - 7, y - 11, 2, 2);
    ctx.fillRect(x + 5, y - 12, 2, 2);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
  } else if (npc.name === 'Jogger') {
    ctx.fillStyle = COLORS.orange;
    ctx.fillRect(x - 5, y - 4, 10, 9);
    ctx.fillStyle = '#8d5524';
    ctx.fillRect(x - 4, y - 13, 8, 9);
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 5, y - 11, 10, 2);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 2, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 4, y + 5, 3, 4);
    ctx.fillRect(x + 1, y + 5, 3, 4);
    ctx.fillStyle = '#8d5524';
    ctx.fillRect(x - 4, y + 9, 3, 3);
    ctx.fillRect(x + 1, y + 9, 3, 3);
  } else if (npc.name === 'Artist') {
    ctx.fillStyle = '#e8e8e8';
    ctx.fillRect(x - 6, y - 4, 12, 10);
    ctx.fillStyle = COLORS.blue;
    ctx.fillRect(x - 3, y - 2, 2, 2);
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(x + 2, y + 1, 2, 2);
    ctx.fillStyle = COLORS.brown;
    ctx.fillRect(x - 9, y - 1, 4, 3);
    ctx.fillStyle = COLORS.pink;
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 6, y - 14, 12, 2);
    ctx.fillRect(x - 4, y - 15, 8, 1);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    ctx.fillStyle = '#1a1a4e';
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
  } else if (npc.name === 'Food Cart Vendor') {
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(x - 6, y - 4, 12, 10);
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 5, y - 2, 10, 8);
    ctx.fillStyle = '#c68642';
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 6, y - 15, 12, 3);
    ctx.fillRect(x - 4, y - 16, 8, 1);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 4, y - 6, 8, 2);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x + 6, y - 2, 2, 6);
    ctx.fillRect(x + 5, y - 3, 4, 2);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
  } else if (npc.name === 'Bartender') {
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 6, y - 4, 12, 10);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 5, y - 2, 10, 8);
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(x - 3, y - 3, 6, 2);
    ctx.fillStyle = COLORS.tan;
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 5, y - 13, 10, 2);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x + 6, y, 3, 4);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
  } else if (npc.name === 'Regular') {
    ctx.fillStyle = '#808080';
    ctx.fillRect(x - 7, y - 4, 14, 11);
    ctx.fillStyle = COLORS.tan;
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = COLORS.orange;
    ctx.fillRect(x - 6, y - 14, 12, 2);
    ctx.fillRect(x - 8, y - 13, 4, 1);
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 3, y - 6, 6, 2);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    ctx.fillStyle = '#1a1a4e';
    ctx.fillRect(x - 6, y + 7, 5, 5);
    ctx.fillRect(x + 1, y + 7, 5, 5);
  } else if (npc.name === 'Pool Player') {
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 6, y - 4, 12, 10);
    ctx.fillStyle = '#8d5524';
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 5, y - 13, 10, 3);
    ctx.fillRect(x - 6, y - 11, 2, 2);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    ctx.fillStyle = COLORS.brown;
    ctx.fillRect(x + 6, y - 8, 1, 16);
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
  } else if (npc.name === 'Restaurant Owner' || npc.name === 'Chef') {
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 6, y - 4, 12, 10);
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 4, y - 2, 2, 2);
    ctx.fillRect(x - 4, y + 2, 2, 2);
    ctx.fillRect(x + 2, y - 2, 2, 2);
    ctx.fillRect(x + 2, y + 2, 2, 2);
    ctx.fillStyle = '#c68642';
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 6, y - 18, 12, 6);
    ctx.fillRect(x - 4, y - 19, 8, 1);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 4, y - 6, 8, 2);
    ctx.fillStyle = COLORS.gray;
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
  } else if (npc.name === 'Diner') {
    ctx.fillStyle = COLORS.blue;
    ctx.fillRect(x - 6, y - 4, 12, 10);
    ctx.fillStyle = COLORS.pink;
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(x - 5, y - 13, 10, 3);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    ctx.fillStyle = COLORS.brown;
    ctx.fillRect(x + 6, y - 1, 1, 6);
    ctx.fillRect(x + 7, y - 1, 1, 6);
    ctx.fillStyle = '#1a1a4e';
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
  } else if (npc.name === 'Food Critic') {
    ctx.fillStyle = COLORS.purple;
    ctx.fillRect(x - 6, y - 4, 12, 10);
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 9, y, 3, 4);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 9, y, 3, 1);
    ctx.fillStyle = COLORS.tan;
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 5, y - 13, 10, 3);
    ctx.fillRect(x + 3, y - 11, 3, 2);
    ctx.strokeStyle = COLORS.black;
    ctx.strokeRect(x - 4, y - 10, 3, 3);
    ctx.strokeRect(x + 1, y - 10, 3, 3);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 1, 1);
    ctx.fillRect(x + 2, y - 9, 1, 1);
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
  } else if (npc.name === 'Caver' || npc.name === 'Veteran Caver') {
    // Cave explorer - rugged, brown leather
    ctx.fillStyle = '#8b6914';
    ctx.fillRect(x - 6, y - 4, 12, 10);
    ctx.fillStyle = COLORS.tan;
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = COLORS.brown;
    ctx.fillRect(x - 5, y - 13, 10, 3);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    // Pickaxe
    ctx.fillStyle = COLORS.brown;
    ctx.fillRect(x + 5, y - 8, 1, 14);
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x + 4, y - 9, 3, 2);
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
  } else if (npc.name === 'Explorer') {
    // Adventure explorer - green outfit, gear
    ctx.fillStyle = '#2d5016';
    ctx.fillRect(x - 6, y - 4, 12, 10);
    ctx.fillStyle = '#c68642';
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 5, y - 13, 10, 3);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    // Rope/equipment
    ctx.fillStyle = COLORS.brown;
    ctx.fillRect(x - 9, y - 2, 3, 8);
    ctx.fillStyle = '#1a1a4e';
    ctx.fillRect(x - 5, y + 6, 4, 6);
    ctx.fillRect(x + 1, y + 6, 4, 6);
  } else {
    // Default NPC if none of the above
    ctx.fillStyle = COLORS.green;
    ctx.fillRect(x - 6, y - 4, 12, 8);
    ctx.fillStyle = COLORS.pink;
    ctx.fillRect(x - 4, y - 12, 8, 8);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 8, 2, 2);
    ctx.fillRect(x + 1, y - 8, 2, 2);
  }
}
