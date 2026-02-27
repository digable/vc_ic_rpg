// UI Module - HUD, Dialogue, Menu rendering
import { COLORS, isMobile } from '../constants.js';
import { game } from '../game-state.js';
import { maps } from '../maps.js';
import { questDatabase } from '../quests.js';
import { getSaveCount, getSaveSlots, MAX_LOCAL_SAVES } from '../save.js';
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

  if (game.systemMessage && game.systemMessage.text) {
    if (Date.now() <= game.systemMessage.expiresAt) {
      const messageText = game.systemMessage.text;
      ctx.font = '6px "Press Start 2P"';
      const width = Math.min(236, Math.max(70, ctx.measureText(messageText).width + 10));
      const x = Math.floor((256 - width) / 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(x, 26, width, 12);
      ctx.strokeStyle = COLORS.yellow;
      ctx.strokeRect(x, 26, width, 12);
      ctx.fillStyle = COLORS.yellow;
      ctx.fillText(messageText, x + 5, 34);
    } else {
      game.systemMessage = null;
    }
  }
  
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
  ctx.font = '6px "Press Start 2P"';
  ctx.fillText('STATS', 28, 43);
  
  ctx.fillStyle = game.menuTab === 1 ? COLORS.yellow : COLORS.gray;
  ctx.fillText('MAP', 72, 43);
  
  ctx.fillStyle = game.menuTab === 2 ? COLORS.yellow : COLORS.gray;
  ctx.fillText('ITEMS', 104, 43);

  ctx.fillStyle = game.menuTab === 3 ? COLORS.yellow : COLORS.gray;
  ctx.fillText('QUESTS', 138, 43);

  ctx.fillStyle = game.menuTab === 4 ? COLORS.yellow : COLORS.gray;
  ctx.fillText('SAVE', 191, 43);
  
  // Tab indicator
  ctx.fillStyle = COLORS.yellow;
  if (game.menuTab === 0) {
    ctx.fillRect(30, 46, 40, 2);
  } else if (game.menuTab === 1) {
    ctx.fillRect(68, 46, 24, 2);
  } else if (game.menuTab === 2) {
    ctx.fillRect(100, 46, 32, 2);
  } else if (game.menuTab === 3) {
    ctx.fillRect(136, 46, 46, 2);
  } else {
    ctx.fillRect(186, 46, 30, 2);
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
      ctx.fillStyle = COLORS.white;
      ctx.fillText('SKILLS', 30, 158);
      game.skills.slice(0, 2).forEach((skill, i) => {
        ctx.fillText(`- ${skill}`, 30, 170 + i * 10);
      });
    }
    
    // Spells
    if (game.spells.length > 0) {
      const spellY = game.skills.length > 0 ? 158 : 158;
      ctx.fillStyle = COLORS.white;
      ctx.fillText('SPELLS', 130, spellY);
      game.spells.slice(0, 2).forEach((spell, i) => {
        ctx.fillText(`- ${spell}`, 130, spellY + 12 + i * 10);
      });
    }
  } else if (game.menuTab === 1) {
    // Map tab - clean map (top-level locations only)
    ctx.fillStyle = COLORS.white;
    ctx.font = '6px "Press Start 2P"';
    ctx.fillText('IOWA CITY MAP', 70, 56);

    const currentMapKey = game.map.indexOf('beer_caves_depths_') === 0 ? 'beer_caves' : game.map;

    const areas = [
      { map: 'kinnick_stadium', label: 'KIN', x: 82, y: 62, color: COLORS.yellow, textColor: COLORS.black },
      { map: 'pentacrest', label: 'PEN', x: 82, y: 78, color: COLORS.green, textColor: COLORS.black },
      { map: 'library', label: 'LIB', x: 124, y: 78, color: COLORS.brown, textColor: COLORS.white },
      { map: 'city_park', label: 'PRK', x: 40, y: 94, color: COLORS.lightBlue, textColor: COLORS.black },
      { map: 'downtown', label: 'DWT', x: 82, y: 94, color: COLORS.gray, textColor: COLORS.white },
      { map: 'deadwood', label: 'DED', x: 124, y: 94, color: COLORS.orange, textColor: COLORS.black },
      { map: 'ped_mall', label: 'PED', x: 166, y: 94, color: COLORS.lightGray, textColor: COLORS.black },
      { map: 'northside', label: 'NOR', x: 82, y: 110, color: COLORS.red, textColor: COLORS.white },
      { map: 'oakland_cemetery', label: 'CEM', x: 124, y: 110, color: COLORS.darkGray, textColor: COLORS.white },
      { map: 'old_capitol', label: 'CAP', x: 166, y: 110, color: COLORS.white, textColor: COLORS.black },
      { map: 'coralville_lake', label: 'LAK', x: 166, y: 126, color: COLORS.blue, textColor: COLORS.white },
      { map: 'beer_caves', label: 'CVE', x: 82, y: 126, color: COLORS.purple, textColor: COLORS.white }
    ];

    const links = [
      ['city_park', 'downtown'],
      ['downtown', 'pentacrest'],
      ['downtown', 'deadwood'],
      ['downtown', 'northside'],
      ['downtown', 'coralville_lake'],
      ['pentacrest', 'library'],
      ['pentacrest', 'kinnick_stadium'],
      ['kinnick_stadium', 'ped_mall'],
      ['ped_mall', 'old_capitol'],
      ['old_capitol', 'coralville_lake'],
      ['deadwood', 'oakland_cemetery'],
      ['northside', 'beer_caves']
    ];

    function findArea(mapKey) {
      for (let i = 0; i < areas.length; i++) {
        if (areas[i].map === mapKey) return areas[i];
      }
      return null;
    }

    ctx.strokeStyle = COLORS.darkGray;
    ctx.lineWidth = 1;
    links.forEach(([fromMap, toMap]) => {
      const from = findArea(fromMap);
      const to = findArea(toMap);
      if (!from || !to) return;
      ctx.beginPath();
      ctx.moveTo(from.x + 10, from.y + 6);
      ctx.lineTo(to.x + 10, to.y + 6);
      ctx.stroke();
    });

    areas.forEach(area => {
      ctx.fillStyle = area.color;
      ctx.fillRect(area.x, area.y, 20, 12);
      ctx.strokeStyle = COLORS.black;
      ctx.lineWidth = 1;
      ctx.strokeRect(area.x, area.y, 20, 12);

      if (currentMapKey === area.map) {
        ctx.strokeStyle = COLORS.yellow;
        ctx.lineWidth = 2;
        ctx.strokeRect(area.x - 1, area.y - 1, 22, 14);
      }

      ctx.fillStyle = area.textColor;
      ctx.font = '5px "Press Start 2P"';
      ctx.fillText(area.label, area.x + 3, area.y + 8);
    });

    const currentLocationName = maps[currentMapKey] ? maps[currentMapKey].name : 'Unknown';
    ctx.fillStyle = COLORS.yellow;
    ctx.font = '5px "Press Start 2P"';
    ctx.fillText(`YOU ARE: ${currentLocationName}`, 24, 148);


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
  } else if (game.menuTab === 3) {
    // Quests tab
    const inProgress = game.quests.filter(q => q.status === 'active');
    const completed = game.quests.filter(q => q.status === 'completed');
    const mainMission = game.quests.find(q => q.id === 'corruption_source');
    const mainMissionData = questDatabase.corruption_source;
    const maxInProgressShown = 1;
    const maxCompletedShown = 3;

    const inProgressPages = Math.max(1, Math.ceil(inProgress.length / maxInProgressShown));
    const completedPages = Math.max(1, Math.ceil(completed.length / maxCompletedShown));

    game.questInProgressPage = Math.max(0, Math.min(game.questInProgressPage, inProgressPages - 1));
    game.questCompletedPage = Math.max(0, Math.min(game.questCompletedPage, completedPages - 1));

    const inProgressStart = game.questInProgressPage * maxInProgressShown;
    const completedStart = game.questCompletedPage * maxCompletedShown;

    ctx.textBaseline = 'top';

    // Solid background panels for cleaner text readability
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(26, 52, 204, 40);
    ctx.strokeStyle = COLORS.darkGray;
    ctx.lineWidth = 1;
    ctx.strokeRect(26, 52, 204, 40);

    ctx.fillStyle = COLORS.black;
    ctx.fillRect(26, 104, 204, 52);
    ctx.strokeRect(26, 104, 204, 52);

    ctx.fillStyle = COLORS.black;
    ctx.fillRect(26, 158, 204, 26);
    ctx.strokeRect(26, 158, 204, 26);

    let caveBossDone = game.caveSovereignDefeated;
    let levelGateDone = game.player.level >= 10;
    let finalBossDone = false;

    if (mainMission && Array.isArray(mainMission.objectives)) {
      const caveObj = mainMission.objectives.find(obj => obj.type === 'defeat_enemy' && obj.enemy === 'Cave Sovereign');
      const levelObj = mainMission.objectives.find(obj => obj.type === 'reach_level');
      const finalObj = mainMission.objectives.find(obj => obj.type === 'defeat_enemy' && obj.enemy === 'Corrupted Administrator');

      if (caveObj) {
        caveBossDone = caveObj.count >= caveObj.needed;
      }
      if (levelObj) {
        levelGateDone = game.player.level >= levelObj.level;
      }
      if (finalObj) {
        finalBossDone = finalObj.count >= finalObj.needed;
      }
      if (mainMission.status === 'completed') {
        finalBossDone = true;
      }
    }

    ctx.fillStyle = COLORS.white;
    ctx.font = '6px "Press Start 2P"';
    ctx.fillText('MAIN MISSION', 30, 60);

    const mainMissionLines = [
      { done: caveBossDone, text: 'Beat Cave Sovereign' },
      { done: levelGateDone, text: 'Reach Level 10' },
      { done: finalBossDone, text: 'Beat Corrupted Admin' }
    ];

    let mainY = 70;
    mainMissionLines.forEach(line => {
      ctx.fillStyle = line.done ? COLORS.green : COLORS.yellow;
      ctx.font = '6px "Press Start 2P"';
      ctx.fillText(line.done ? '[x]' : '[ ]', 30, mainY);
      ctx.fillText(line.text, 48, mainY);
      mainY += 9;
    });

    ctx.fillStyle = COLORS.gray;
    ctx.font = '5px "Press Start 2P"';
    ctx.fillText(caveBossDone && levelGateDone ? 'Final boss unlocked' : 'Need top 2 to unlock final boss', 30, mainY);

    ctx.fillStyle = COLORS.yellow;
    ctx.font = '6px "Press Start 2P"';
    ctx.fillText('IN PROGRESS', 30, 112);
    if (game.questMenuSection === 0) {
      ctx.fillText('>', 22, 112);
    }
    ctx.fillStyle = COLORS.gray;
    ctx.font = '5px "Press Start 2P"';
    ctx.fillText(`${game.questInProgressPage + 1}/${inProgressPages}`, 170, 112);

    let y = 122;
    if (inProgress.length === 0) {
      ctx.fillStyle = COLORS.gray;
      ctx.font = '6px "Press Start 2P"';
      ctx.fillText('No active quests', 30, y);
      y += 12;
    } else {
      inProgress.slice(inProgressStart, inProgressStart + maxInProgressShown).forEach(activeQuest => {
        const questData = questDatabase[activeQuest.id];
        if (!questData) return;

        ctx.fillStyle = COLORS.yellow;
        ctx.font = '6px "Press Start 2P"';
        ctx.fillText(`- ${questData.name}`, 30, y);
        y += 8;

        ctx.fillStyle = COLORS.white;
        ctx.font = '6px "Press Start 2P"';
        wrapText(questData.description, 34, y, 168, 8);
        y += 24;
      });

      y += 2;
    }

    const completedHeaderY = Math.max(162, y + 2);
    ctx.fillStyle = COLORS.green;
    ctx.font = '6px "Press Start 2P"';
    ctx.fillText('COMPLETED', 30, completedHeaderY);
    if (game.questMenuSection === 1) {
      ctx.fillText('>', 22, completedHeaderY);
    }
    ctx.fillStyle = COLORS.gray;
    ctx.font = '5px "Press Start 2P"';
    ctx.fillText(`${game.questCompletedPage + 1}/${completedPages}`, 170, completedHeaderY);

    let completedY = completedHeaderY + 10;
    if (completed.length === 0) {
      ctx.fillStyle = COLORS.gray;
      ctx.font = '6px "Press Start 2P"';
      ctx.fillText('No completed quests', 30, completedY);
    } else {
      completed.slice(completedStart, completedStart + maxCompletedShown).forEach(doneQuest => {
        const questData = questDatabase[doneQuest.id];
        if (!questData) return;

        ctx.fillStyle = COLORS.green;
        ctx.font = '6px "Press Start 2P"';
        ctx.fillText(`- ${questData.name}`, 30, completedY);
        completedY += 8;
      });
    }

    ctx.fillStyle = COLORS.gray;
    ctx.font = '5px "Press Start 2P"';
    ctx.fillText('UP/DOWN: SCROLL QUESTS', 30, 183);
    ctx.fillText('SPACE: SWITCH SECTION', 30, 191);

    ctx.textBaseline = 'alphabetic';
  } else if (game.menuTab === 4) {
    const saveCount = getSaveCount();
    const saveExists = saveCount > 0;
    const saveActions = [
      { label: 'Save Game', enabled: true },
      { label: 'Load Game', enabled: saveExists },
      { label: 'Delete Save', enabled: saveExists }
    ];
    const actionName = game.saveMenuAction ? game.saveMenuAction.toUpperCase() : 'SAVE';
    const slots = getSaveSlots();

    ctx.fillStyle = COLORS.white;
    ctx.font = '6px "Press Start 2P"';
    ctx.fillText('SAVE DATA', 86, 58);
    ctx.fillStyle = COLORS.gray;
    ctx.fillText(`${saveCount}/${MAX_LOCAL_SAVES} saves`, 86, 68);

    if (game.saveMenuMode === 'slots') {
      ctx.fillStyle = COLORS.yellow;
      ctx.font = '5px "Press Start 2P"';
      ctx.fillText(`SELECT SLOT TO ${actionName}`, 40, 70);

      ctx.fillStyle = COLORS.black;
      ctx.fillRect(30, 80, 196, 58);
      ctx.strokeStyle = COLORS.gray;
      ctx.lineWidth = 1;
      ctx.strokeRect(30, 80, 196, 58);

      ctx.font = '5px "Press Start 2P"';
      slots.forEach((slot, i) => {
        const rowTop = 82 + i * 18;
        const y = rowTop + 11;

        ctx.fillStyle = COLORS.black;
        ctx.fillRect(32, rowTop, 192, 16);

        if (game.saveSlotSelection === i) {
          ctx.fillStyle = COLORS.yellow;
          ctx.fillRect(32, rowTop, 192, 16);
          ctx.strokeStyle = COLORS.yellow;
          ctx.lineWidth = 1;
          ctx.strokeRect(32, rowTop, 192, 16);
          ctx.fillStyle = COLORS.black;
          ctx.fillText('>', 38, y);
          ctx.fillText(`SLOT ${i + 1}: ${slot.label}`, 50, y);
        } else {
          ctx.fillStyle = slot.occupied ? COLORS.white : COLORS.gray;
          ctx.fillText(`SLOT ${i + 1}: ${slot.label}`, 50, y);
        }
      });

      ctx.fillStyle = COLORS.gray;
      ctx.font = '5px "Press Start 2P"';
      ctx.fillText('UP/DOWN + SPACE', 86, 166);
      ctx.fillText('ESC OR <-/-> TO CANCEL', 64, 176);
    } else {
      saveActions.forEach((action, i) => {
        const y = 98 + i * 16;
        if (game.menuSelection === i) {
          ctx.fillStyle = COLORS.yellow;
          ctx.fillText('>', 74, y);
        }
        ctx.fillStyle = action.enabled ? COLORS.white : COLORS.gray;
        ctx.fillText(action.label, 86, y);
      });

      ctx.fillStyle = COLORS.gray;
      ctx.font = '5px "Press Start 2P"';
      ctx.fillText('UP/DOWN + SPACE', 86, 166);
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
