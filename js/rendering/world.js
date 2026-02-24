// Rendering World - Map, Player, and NPCs
import { COLORS, tileColors, CAVE_MAPS } from '../constants.js';
import { game } from '../game-state.js';
import { maps } from '../maps.js';
import { questDatabase } from '../quests.js';
import { canCompleteQuest } from '../quests-logic.js';
import { ctx } from './utils.js';

export function drawMap() {
  const map = maps[game.map];
  if (CAVE_MAPS.includes(game.map) && !game.flashlightOn) {
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(0, 0, 256, 240);
    return;
  }
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const tile = map.tiles[y][x];
      let fillStyle = tileColors[tile];
      if (game.map === 'oakland_cemetery') {
        if (tile === 3) {
          fillStyle = COLORS.green;
        } else if (tile === 1) {
          fillStyle = COLORS.lightGray;
        } else if (tile === 0) {
          fillStyle = COLORS.gray;
        }
      }
      if (CAVE_MAPS.includes(game.map) && game.flashlightOn) {
        if (tile === 0) fillStyle = COLORS.lightGray;
        if (tile === 6) fillStyle = COLORS.darkGray;
        if (tile === 2) fillStyle = COLORS.black;
      }
      ctx.fillStyle = fillStyle;
      ctx.fillRect(x * 16, y * 16, 16, 16);

      if (game.map === 'oakland_cemetery' && (tile === 0 || tile === 1)) {
        ctx.strokeStyle = COLORS.darkGray;
        ctx.strokeRect(x * 16 + 1, y * 16 + 1, 14, 14);
        if ((x + y) % 2 === 0) {
          ctx.fillStyle = COLORS.gray;
          ctx.fillRect(x * 16 + 6, y * 16 + 1, 1, 14);
        }
      }

      if (CAVE_MAPS.includes(game.map) && game.flashlightOn && (tile === 6 || tile === 2)) {
        ctx.strokeStyle = COLORS.lightGray;
        ctx.strokeRect(x * 16 + 1, y * 16 + 1, 14, 14);
      }
      
      // Add texture for buildings
      if (tile === 3) {
        if (game.map === 'oakland_cemetery') {
          ctx.fillStyle = COLORS.darkGray;
          ctx.fillRect(x * 16 + 5, y * 16 + 4, 6, 8);
          ctx.fillStyle = COLORS.lightGray;
          ctx.fillRect(x * 16 + 6, y * 16 + 5, 4, 1);
          ctx.fillStyle = COLORS.darkGray;
          ctx.fillRect(x * 16 + 7, y * 16 + 12, 2, 2);
        } else {
          ctx.fillStyle = COLORS.darkGray;
          ctx.fillRect(x * 16 + 2, y * 16 + 2, 5, 5);
          ctx.fillRect(x * 16 + 9, y * 16 + 2, 5, 5);
          ctx.fillRect(x * 16 + 2, y * 16 + 9, 5, 5);
          ctx.fillRect(x * 16 + 9, y * 16 + 9, 5, 5);
        }
      }
      
      // Draw bridge effect for road tiles in riverside that connect to water
      if (game.map === 'city_park' && tile === 0 && y === 7 && x >= 10) {
        // Add bridge railings
        ctx.fillStyle = COLORS.brown;
        ctx.fillRect(x * 16, y * 16, 16, 2); // top railing
        ctx.fillRect(x * 16, y * 16 + 14, 16, 2); // bottom railing
      }
    }
  }

  // Flashlight on shows full cave map (no vignette)
  
  // Draw exit labels
  if (map.exits) {
    // Always-visible directional markers near transition points
    ctx.font = '7px "Press Start 2P"';
    for (let exit of map.exits) {
      let markerX = exit.x;
      let markerY = exit.y;
      let marker = '';

      if (exit.direction === 'up') {
        marker = '^';
        markerY = exit.y + 6;
      } else if (exit.direction === 'down') {
        marker = 'v';
        markerY = exit.y - 6;
      } else if (exit.direction === 'left') {
        marker = '<';
        markerX = exit.x + 6;
      } else if (exit.direction === 'right') {
        marker = '>';
        markerX = exit.x - 6;
      }

      if (marker) {
        const drawX = Math.max(2, Math.min(250, markerX - 2));
        const drawY = Math.max(8, Math.min(236, markerY));

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(drawX - 2, drawY - 7, 8, 8);
        ctx.fillStyle = COLORS.lightGreen;
        ctx.fillText(marker, drawX, drawY);
      }
    }

    ctx.font = '5px "Press Start 2P"';
    const exitGroupCounts = {};
    for (let exit of map.exits) {
      const distToExit = Math.sqrt((game.player.x - exit.x) ** 2 + (game.player.y - exit.y) ** 2);
      if (distToExit > 20) {
        continue;
      }

      const destMap = maps[exit.toMap];
      const groupKey = `${exit.direction}:${exit.y}`;
      const groupIndex = exitGroupCounts[groupKey] || 0;
      exitGroupCounts[groupKey] = groupIndex + 1;

      let labelX = exit.x;
      let labelY = exit.y;

      // Stagger labels for nearby exits on the same edge so text stays readable
      if (exit.direction === 'up' || exit.direction === 'down') {
        if (groupIndex > 0) {
          const xShift = 18 * Math.ceil(groupIndex / 2);
          labelX += groupIndex % 2 === 1 ? xShift : -xShift;
        }
      } else if (groupIndex > 0) {
        const yShift = 10 * Math.ceil(groupIndex / 2);
        labelY += groupIndex % 2 === 1 ? yShift : -yShift;
      }

      // Draw background for text
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      const textWidth = ctx.measureText(destMap.name).width;
      
      if (exit.direction === 'up') {
        const bgX = Math.max(0, Math.min(256 - (textWidth + 4), labelX - textWidth / 2 - 2));
        const bgY = Math.max(0, labelY - 12);
        ctx.fillRect(bgX, bgY, textWidth + 4, 8);
        ctx.fillStyle = COLORS.yellow;
        ctx.fillText(destMap.name, bgX + 2, bgY + 6);
        // Arrow at exit location
        ctx.fillText('^', exit.x - 3, exit.y + 2);
      } else if (exit.direction === 'down') {
        const bgX = Math.max(0, Math.min(256 - (textWidth + 4), labelX - textWidth / 2 - 2));
        const bgY = Math.max(0, Math.min(232, labelY + 8));
        ctx.fillRect(bgX, bgY, textWidth + 4, 8);
        ctx.fillStyle = COLORS.yellow;
        ctx.fillText(destMap.name, bgX + 2, bgY + 6);
        // Arrow at exit location
        ctx.fillText('v', exit.x - 3, exit.y - 2);
      } else if (exit.direction === 'left') {
        const bgX = Math.max(0, Math.min(256 - (textWidth + 4), labelX - textWidth - 10));
        const bgY = Math.max(0, Math.min(232, labelY - 6));
        ctx.fillRect(bgX, bgY, textWidth + 4, 8);
        ctx.fillStyle = COLORS.yellow;
        ctx.fillText(destMap.name, bgX + 2, bgY + 6);
        // Arrow at exit location
        ctx.fillText('<', exit.x + 2, exit.y - 8);
      } else if (exit.direction === 'right') {
        const bgX = Math.max(0, Math.min(256 - (textWidth + 4), labelX + 6));
        const bgY = Math.max(0, Math.min(232, labelY - 6));
        ctx.fillRect(bgX, bgY, textWidth + 4, 8);
        ctx.fillStyle = COLORS.yellow;
        ctx.fillText(destMap.name, bgX + 2, bgY + 6);
        // Arrow at exit location
        ctx.fillText('>', exit.x - 4, exit.y);
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
    if (npc.type === 'boss' && game.caveSovereignDefeated) {
      continue;
    }
    if (npc.isSign) {
      // Compact, high-contrast Cambus sign
      // Post
      ctx.fillStyle = COLORS.darkGray;
      ctx.fillRect(npc.x - 1, npc.y - 2, 2, 10);

      // Sign plate
      ctx.fillStyle = COLORS.white;
      ctx.fillRect(npc.x - 5, npc.y - 12, 10, 8);
      ctx.strokeStyle = COLORS.black;
      ctx.lineWidth = 1;
      ctx.strokeRect(npc.x - 5, npc.y - 12, 10, 8);

      // Yellow route strip (top) for quick recognition
      ctx.fillStyle = COLORS.yellow;
      ctx.fillRect(npc.x - 4, npc.y - 11, 8, 2);

      // Bus glyph (center)
      ctx.fillStyle = COLORS.black;
      ctx.fillRect(npc.x - 3, npc.y - 8, 6, 2);
      ctx.fillRect(npc.x - 3, npc.y - 6, 1, 1);
      ctx.fillRect(npc.x + 2, npc.y - 6, 1, 1);

      // Tiny wheels
      ctx.fillRect(npc.x - 2, npc.y - 5, 1, 1);
      ctx.fillRect(npc.x + 1, npc.y - 5, 1, 1);

      // Tiny C marker for Cambus
      ctx.fillStyle = COLORS.black;
      ctx.fillRect(npc.x - 4, npc.y - 8, 1, 3);
      ctx.fillRect(npc.x - 3, npc.y - 8, 1, 1);
      ctx.fillRect(npc.x - 3, npc.y - 6, 1, 1);
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
  } else if (npc.name === 'Cave Sovereign') {
    // Cave Sovereign - imposing boss sprite
    const pulse = Math.sin(game.animFrame / 8) * 2;
    ctx.strokeStyle = 'rgba(128, 0, 128, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y + 2, 18 + pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(64, 0, 96, 0.4)';
    ctx.beginPath();
    ctx.arc(x, y + 2, 24 + pulse * 1.5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#2b2230';
    ctx.fillRect(x - 14, y - 14, 28, 24);
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 10, y - 22, 20, 8);

    // Horns
    ctx.fillStyle = COLORS.darkGray;
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 18);
    ctx.lineTo(x - 18, y - 28);
    ctx.lineTo(x - 6, y - 24);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 10, y - 18);
    ctx.lineTo(x + 18, y - 28);
    ctx.lineTo(x + 6, y - 24);
    ctx.closePath();
    ctx.fill();

    // Face
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 8, y - 8, 16, 8);
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(x - 4, y - 8, 2, 2);
    ctx.fillRect(x + 2, y - 8, 2, 2);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 6, y - 2, 12, 2);
  } else if (npc.name === 'Black Angel') {
    const pulse = Math.sin(game.animFrame / 12) * 1.5;

    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 10, y + 6, 20, 6);

    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 7, y - 8, 14, 16);

    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 14, y - 4, 7, 3);
    ctx.fillRect(x + 7, y - 4, 7, 3);

    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 8, y - 12, 16, 4);

    ctx.strokeStyle = `rgba(188, 0, 188, ${0.4 + (pulse / 8)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y - 2, 14 + pulse, 0, Math.PI * 2);
    ctx.stroke();
  } else if (npc.name === 'Historian Dr. Whitmore') {
    // Scholarly historian with glasses and research outfit
    ctx.fillStyle = '#5c4033'; // Brown suit
    ctx.fillRect(x - 6, y - 4, 12, 10);
    ctx.fillStyle = '#d2b48c'; // Tan face
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = '#8b7355'; // Brown hair, receding
    ctx.fillRect(x - 5, y - 13, 10, 3);
    ctx.fillRect(x - 6, y - 11, 2, 2);
    ctx.fillRect(x + 4, y - 11, 2, 2);
    // Glasses
    ctx.strokeStyle = COLORS.black;
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 4, y - 10, 2, 2);
    ctx.strokeRect(x + 2, y - 10, 2, 2);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 1, y - 9, 2, 1); // Nose bridge
    // Eyes behind glasses
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 1, 1);
    ctx.fillRect(x + 3, y - 9, 1, 1);
    // Book in hand
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(x + 6, y, 3, 4);
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x + 6, y + 1, 3, 1);
    // Legs
    ctx.fillStyle = '#2c1810';
    ctx.fillRect(x - 4, y + 6, 3, 6);  } else if (npc.name === 'Fisherman Hank') {
    // Weathered fisherman with hat and fishing gear
    ctx.fillStyle = '#8B6F47'; // Tan fishing jacket
    ctx.fillRect(x - 6, y - 4, 12, 10);
    ctx.fillStyle = '#D2B48C'; // Tan weathered face
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = '#4A3728'; // Dark brown hair
    ctx.fillRect(x - 5, y - 13, 10, 3);
    // Fishing hat visors
    ctx.fillStyle = COLORS.gray;
    ctx.fillRect(x - 7, y - 14, 2, 2); // left side
    ctx.fillRect(x + 5, y - 14, 2, 2); // right side
    ctx.fillStyle = '#5C4033';
    ctx.fillRect(x - 8, y - 13, 16, 1); // hat brim
    // Eyes weathered
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    // Beard
    ctx.fillStyle = '#4A3728';
    ctx.fillRect(x - 2, y - 4, 4, 2);
    // Fishing rod
    ctx.strokeStyle = COLORS.brown;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 8, y - 6);
    ctx.lineTo(x + 12, y - 14);
    ctx.stroke();
    // Fishing line
    ctx.strokeStyle = COLORS.gray;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 12, y - 14);
    ctx.lineTo(x + 14, y - 2);
    ctx.stroke();
    // Legs
    ctx.fillStyle = '#654321';
    ctx.fillRect(x - 4, y + 6, 3, 6);
  } else if (npc.name === 'Camper Jenny') {
    // Happy outdoor camper with backpack
    ctx.fillStyle = '#ff69b4'; // Pink/bright outdoor outfit
    ctx.fillRect(x - 6, y - 4, 12, 10);
    ctx.fillStyle = '#ffdbac'; // Peachy face
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = '#8B4513'; // Brown hair in ponytail
    ctx.fillRect(x - 5, y - 13, 10, 4);
    ctx.fillRect(x + 5, y - 10, 2, 5); // ponytail
    // Hat visor
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(x - 6, y - 14, 12, 1);
    // Happy face
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    ctx.beginPath();
    ctx.arc(x, y - 3, 2, 0, Math.PI);
    ctx.stroke();
    // Backpack
    ctx.fillStyle = '#228B22'; // Forest green
    ctx.fillRect(x - 8, y - 2, 3, 8);
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 7, y, 1, 2); // straps
    ctx.fillRect(x - 6, y, 1, 2);
    // Legs
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(x - 4, y + 6, 3, 6);
  } else if (npc.name === 'Park Ranger Steve') {
    // Official park ranger in uniform
    ctx.fillStyle = '#2d5016'; // Forest green ranger uniform
    ctx.fillRect(x - 6, y - 4, 12, 10);
    ctx.fillStyle = '#c68642'; // Tan face
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = '#4A3728'; // Dark brown hair
    ctx.fillRect(x - 5, y - 13, 10, 3);
    // Ranger hat
    ctx.fillStyle = '#2d5016';
    ctx.beginPath();
    ctx.moveTo(x - 6, y - 13);
    ctx.lineTo(x + 6, y - 13);
    ctx.lineTo(x + 5, y - 16);
    ctx.lineTo(x - 5, y - 16);
    ctx.closePath();
    ctx.fill();
    // Badge
    ctx.fillStyle = COLORS.yellow;
    ctx.fillRect(x - 2, y - 1, 4, 4);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 1, y, 2, 2);
    // Eyes
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    // Legs with boots
    ctx.fillStyle = '#1a1a4e';
    ctx.fillRect(x - 4, y + 6, 3, 6);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 4, y + 12, 3, 1); // boot line
  } else if (npc.name === 'Beach Vendor Rosa') {
    // Cheerful beach vendor
    ctx.fillStyle = '#FFD700'; // Golden vendor dress
    ctx.fillRect(x - 6, y - 4, 12, 10);
    ctx.fillStyle = '#ffdbac'; // Beige face
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = '#FF6347'; // Red/tomato hair
    ctx.fillRect(x - 5, y - 13, 10, 4);
    // Hair accessory
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 6, y - 10, 2, 1);
    ctx.fillRect(x + 4, y - 10, 2, 1);
    // Happy face
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    ctx.beginPath();
    ctx.arc(x, y - 3, 2, 0, Math.PI);
    ctx.stroke();
    // Apron pocket
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 4, y + 2, 8, 2);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 2, y + 3, 1, 1); // button
    ctx.fillRect(x + 1, y + 3, 1, 1);
    // Legs
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 4, y + 6, 3, 6);    ctx.fillRect(x + 1, y + 6, 3, 6);
  } else if (npc.name === 'Tour Guide Margaret') {
    // Friendly tour guide with camera and bright outfit
    ctx.fillStyle = '#ff69b4'; // Pink/bright outfit
    ctx.fillRect(x - 6, y - 4, 12, 10);
    ctx.fillStyle = '#ffdbac'; // Peachy face
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = '#ff8c00'; // Orange hair
    ctx.fillRect(x - 5, y - 13, 10, 4);
    ctx.fillRect(x - 6, y - 10, 2, 2);
    ctx.fillRect(x + 4, y - 11, 2, 2);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 3, y - 9, 2, 1);
    ctx.fillRect(x + 1, y - 9, 2, 1);
    // Smile
    ctx.strokeStyle = COLORS.black;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y - 3, 2, 0, Math.PI);
    ctx.stroke();
    // Camera
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x + 5, y - 2, 3, 3);
    ctx.fillStyle = COLORS.gray;
    ctx.fillRect(x + 5, y - 2, 1, 3);
    ctx.fillStyle = COLORS.yellow;
    ctx.fillRect(x + 6, y - 1, 1, 1);
    // Legs
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 4, y + 6, 3, 6);
    ctx.fillRect(x + 1, y + 6, 3, 6);
  } else if (npc.name === 'Curator Soren') {
    // Mystical curator with magical aura
    ctx.fillStyle = '#1a1a4e'; // Dark blue/purple robes
    ctx.fillRect(x - 6, y - 4, 12, 10);
    ctx.fillStyle = '#c68642'; // Medium skin tone
    ctx.fillRect(x - 5, y - 13, 10, 9);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 5, y - 13, 10, 3); // Black hair
    ctx.fillRect(x - 6, y - 11, 2, 2);
    ctx.fillRect(x + 4, y - 11, 2, 2);
    // Eyes glowing with magic
    ctx.fillStyle = COLORS.purple;
    ctx.fillRect(x - 3, y - 9, 2, 2);
    ctx.fillRect(x + 1, y - 9, 2, 2);
    ctx.fillStyle = COLORS.yellow;
    ctx.fillRect(x - 2, y - 8, 1, 1);
    ctx.fillRect(x + 2, y - 8, 1, 1);
    // Mystical aura
    ctx.strokeStyle = 'rgba(128, 0, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y + 2, 14, 0, Math.PI * 2);
    ctx.stroke();
    // Staff
    ctx.fillStyle = COLORS.gray;
    ctx.fillRect(x + 8, y - 8, 1, 14);
    ctx.fillStyle = COLORS.yellow;
    ctx.beginPath();
    ctx.arc(x + 8, y - 9, 2, 0, Math.PI * 2);
    ctx.fill();
    // Legs under robes
    ctx.fillStyle = '#5c4033';
    ctx.fillRect(x - 4, y + 6, 3, 6);
    ctx.fillRect(x + 1, y + 6, 3, 6);
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
