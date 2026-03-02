// UI Module - HUD, Dialogue, Menu rendering
import { COLORS, isMobile } from '../constants.js';
import { game } from '../game-state.js';
import { getHudPromptModel } from '../features/ui/logic.js';
import {
  getQuestTabModel,
  getMapTabModel,
  getStatsTabModel,
  getItemsTabModel,
  getSaveTabModel,
  getSettingsTabModel
} from '../features/ui/menu-decisions.js';
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
  }
  
  const hudPrompt = getHudPromptModel(getButtonLabel);
  if (hudPrompt) {
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(0, 226, 256, 14);
    ctx.fillStyle = COLORS[hudPrompt.color] || COLORS.yellow;
    ctx.font = '6px "Press Start 2P"';
    ctx.fillText(hudPrompt.text, 8, 235);
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
  ctx.fillText('STA', 26, 43);
  
  ctx.fillStyle = game.menuTab === 1 ? COLORS.yellow : COLORS.gray;
  ctx.fillText('MAP', 54, 43);
  
  ctx.fillStyle = game.menuTab === 2 ? COLORS.yellow : COLORS.gray;
  ctx.fillText('ITM', 82, 43);

  ctx.fillStyle = game.menuTab === 3 ? COLORS.yellow : COLORS.gray;
  ctx.fillText('QST', 110, 43);

  ctx.fillStyle = game.menuTab === 4 ? COLORS.yellow : COLORS.gray;
  ctx.fillText('SAV', 138, 43);

  ctx.fillStyle = game.menuTab === 5 ? COLORS.yellow : COLORS.gray;
  ctx.fillText('SET', 166, 43);
  
  // Tab indicator
  ctx.fillStyle = COLORS.yellow;
  if (game.menuTab === 0) {
    ctx.fillRect(24, 46, 24, 2);
  } else if (game.menuTab === 1) {
    ctx.fillRect(52, 46, 22, 2);
  } else if (game.menuTab === 2) {
    ctx.fillRect(80, 46, 24, 2);
  } else if (game.menuTab === 3) {
    ctx.fillRect(108, 46, 24, 2);
  } else if (game.menuTab === 4) {
    ctx.fillRect(136, 46, 24, 2);
  } else if (game.menuTab === 5) {
    ctx.fillRect(164, 46, 24, 2);
  }
  
  if (game.menuTab === 0) {
    // Stats tab
    const statsTab = getStatsTabModel();

    ctx.fillStyle = COLORS.white;
    ctx.font = '6px "Press Start 2P"';
    ctx.fillText(statsTab.title, 30, 60);
    statsTab.lines.forEach((line) => {
      ctx.fillText(line.text, line.x, line.y);
    });
    
    // Skills
    if (statsTab.skills.length > 0) {
      ctx.fillStyle = COLORS.white;
      ctx.fillText('SKILLS', 30, 158);
      statsTab.skills.forEach((skill, i) => {
        ctx.fillText(`- ${skill}`, 30, 170 + i * 10);
      });
    }
    
    // Spells
    if (statsTab.spells.length > 0) {
      const spellY = 158;
      ctx.fillStyle = COLORS.white;
      ctx.fillText('SPELLS', 130, spellY);
      statsTab.spells.forEach((spell, i) => {
        ctx.fillText(`- ${spell}`, 130, spellY + 12 + i * 10);
      });
    }
  } else if (game.menuTab === 1) {
    // Map tab - clean map (top-level locations only)
    const mapTab = getMapTabModel();

    ctx.fillStyle = COLORS.white;
    ctx.font = '6px "Press Start 2P"';
    ctx.fillText(mapTab.title, 70, 56);

    ctx.strokeStyle = COLORS.darkGray;
    ctx.lineWidth = 1;
    mapTab.links.forEach((link) => {
      ctx.beginPath();
      ctx.moveTo(link.fromX, link.fromY);
      ctx.lineTo(link.toX, link.toY);
      ctx.stroke();
    });

    mapTab.areas.forEach(area => {
      ctx.fillStyle = COLORS[area.color] || COLORS.white;
      ctx.fillRect(area.x, area.y, 20, 12);
      ctx.strokeStyle = COLORS.black;
      ctx.lineWidth = 1;
      ctx.strokeRect(area.x, area.y, 20, 12);

      if (area.isCurrent) {
        ctx.strokeStyle = COLORS.yellow;
        ctx.lineWidth = 2;
        ctx.strokeRect(area.x - 1, area.y - 1, 22, 14);
      }

      ctx.fillStyle = COLORS[area.textColor] || COLORS.white;
      ctx.font = '5px "Press Start 2P"';
      ctx.fillText(area.label, area.x + 3, area.y + 8);
    });

    ctx.fillStyle = COLORS.yellow;
    ctx.font = '5px "Press Start 2P"';
    ctx.fillText(mapTab.locationText, 24, 148);


  } else if (game.menuTab === 2) {
    // Items tab
    const itemsTab = getItemsTabModel(getButtonLabel);

    ctx.fillStyle = COLORS.white;
    ctx.font = '6px "Press Start 2P"';
    ctx.fillText(itemsTab.title, 70, 60);
    
    if (!itemsTab.hasItems) {
      ctx.fillStyle = COLORS.gray;
      ctx.fillText(itemsTab.emptyText, 80, 80);
    } else {
      itemsTab.items.forEach((item) => {
        const y = item.y;
        
        if (item.selected) {
          ctx.fillStyle = COLORS.yellow;
          ctx.fillText('>', 30, y);
        }
        
        ctx.fillStyle = COLORS.white;
        ctx.fillText(item.name + item.countText, 45, y);
        
        ctx.fillStyle = COLORS.gray;
        ctx.font = '5px "Press Start 2P"';
        ctx.fillText(item.description, 45, y + 8);
        ctx.font = '6px "Press Start 2P"';
      });
      
      ctx.fillStyle = COLORS.gray;
      ctx.font = '5px "Press Start 2P"';
      ctx.fillText(itemsTab.useHint, 60, 190);
    }
  } else if (game.menuTab === 3) {
    // Quests tab
    const questTab = getQuestTabModel();

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

    ctx.fillStyle = COLORS.white;
    ctx.font = '6px "Press Start 2P"';
    ctx.fillText('MAIN MISSION', 30, 60);

    let mainY = 70;
    questTab.mainMission.lines.forEach(line => {
      ctx.fillStyle = line.done ? COLORS.green : COLORS.yellow;
      ctx.font = '6px "Press Start 2P"';
      ctx.fillText(line.done ? '[x]' : '[ ]', 30, mainY);
      ctx.fillText(line.text, 48, mainY);
      mainY += 9;
    });

    ctx.fillStyle = COLORS.gray;
    ctx.font = '5px "Press Start 2P"';
    ctx.fillText(questTab.mainMission.hint, 30, mainY);

    ctx.fillStyle = COLORS.yellow;
    ctx.font = '6px "Press Start 2P"';
    ctx.fillText('IN PROGRESS', 30, 112);
    if (questTab.inProgress.selected) {
      ctx.fillText('>', 22, 112);
    }
    ctx.fillStyle = COLORS.gray;
    ctx.font = '5px "Press Start 2P"';
    ctx.fillText(`${questTab.inProgress.totalCount} total`, 122, 112);
    ctx.fillText(questTab.inProgress.pageDisplay, 190, 112);

    let y = 122;
    if (questTab.inProgress.totalCount === 0) {
      ctx.fillStyle = COLORS.gray;
      ctx.font = '6px "Press Start 2P"';
      ctx.fillText('No active quests', 30, y);
      y += 12;
    } else {
      questTab.inProgress.items.forEach((quest) => {
        ctx.fillStyle = COLORS.yellow;
        ctx.font = '6px "Press Start 2P"';
        ctx.fillText(`- ${quest.name}`, 30, y);
        y += 8;

        ctx.fillStyle = COLORS.white;
        ctx.font = '6px "Press Start 2P"';
        wrapText(quest.description, 34, y, 168, 8);
        y += 24;
      });

      y += 2;
    }

    const completedHeaderY = Math.max(162, y + 2);
    ctx.fillStyle = COLORS.green;
    ctx.font = '6px "Press Start 2P"';
    ctx.fillText('COMPLETED', 30, completedHeaderY);
    if (questTab.completed.selected) {
      ctx.fillText('>', 22, completedHeaderY);
    }
    ctx.fillStyle = COLORS.gray;
    ctx.font = '5px "Press Start 2P"';
    ctx.fillText(`${questTab.completed.totalCount} total`, 122, completedHeaderY);
    ctx.fillText(questTab.completed.pageDisplay, 190, completedHeaderY);

    let completedY = completedHeaderY + 10;
    if (questTab.completed.totalCount === 0) {
      ctx.fillStyle = COLORS.gray;
      ctx.font = '6px "Press Start 2P"';
      ctx.fillText('No completed quests', 30, completedY);
    } else {
      questTab.completed.items.forEach((quest) => {
        ctx.fillStyle = COLORS.green;
        ctx.font = '6px "Press Start 2P"';
        ctx.fillText(`- ${quest.name}`, 30, completedY);
        completedY += 8;
      });
    }

    ctx.fillStyle = COLORS.gray;
    ctx.font = '5px "Press Start 2P"';
        
    ctx.textBaseline = 'alphabetic';
  } else if (game.menuTab === 4) {
    const saveTab = getSaveTabModel();

    ctx.fillStyle = COLORS.white;
    ctx.font = '6px "Press Start 2P"';
    ctx.fillText(saveTab.title, 86, 58);
    ctx.fillStyle = COLORS.gray;
    ctx.fillText(saveTab.countText, 86, 68);

    if (saveTab.mode === 'slots') {
      ctx.fillStyle = COLORS.yellow;
      ctx.font = '5px "Press Start 2P"';
      ctx.fillText(`SELECT SLOT TO ${saveTab.actionName}`, 40, 70);

      ctx.fillStyle = COLORS.black;
      ctx.fillRect(30, 80, 196, 58);
      ctx.strokeStyle = COLORS.gray;
      ctx.lineWidth = 1;
      ctx.strokeRect(30, 80, 196, 58);

      ctx.font = '5px "Press Start 2P"';
      saveTab.slots.forEach((slot, i) => {
        const rowTop = slot.rowTop;
        const y = slot.y;

        ctx.fillStyle = COLORS.black;
        ctx.fillRect(32, rowTop, 192, 16);

        if (slot.selected) {
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
      saveTab.actions.forEach((action, i) => {
        const y = 98 + i * 16;
        if (action.selected) {
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
  } else if (game.menuTab === 5) {
    const settingsTab = getSettingsTabModel();

    ctx.fillStyle = COLORS.white;
    ctx.font = '6px "Press Start 2P"';
    ctx.fillText(settingsTab.title, 88, 62);

    ctx.fillStyle = COLORS.black;
    ctx.fillRect(38, 78, 180, 64);
    ctx.strokeStyle = COLORS.gray;
    ctx.lineWidth = 1;
    ctx.strokeRect(38, 78, 180, 64);

    if (settingsTab.selectedIndex === 0) {
      ctx.fillStyle = COLORS.yellow;
      ctx.fillText('>', 44, 98);
    }

    ctx.fillStyle = COLORS.yellow;
    ctx.fillText(settingsTab.musicLabel, 54, 98);

    const slider = settingsTab.slider;

    ctx.fillStyle = settingsTab.musicEnabled ? COLORS.white : COLORS.gray;
    ctx.fillRect(slider.x, slider.y, slider.width, slider.height);
    ctx.strokeStyle = COLORS.black;
    ctx.lineWidth = 1;
    ctx.strokeRect(slider.x, slider.y, slider.width, slider.height);

    ctx.fillStyle = COLORS.black;
    ctx.fillRect(slider.knobX, slider.knobY, slider.knobSize, slider.knobSize);
    ctx.strokeStyle = COLORS.white;
    ctx.strokeRect(slider.knobX, slider.knobY, slider.knobSize, slider.knobSize);

    if (settingsTab.selectedIndex === 1) {
      ctx.fillStyle = COLORS.yellow;
      ctx.fillText('>', 44, 118);
    }

    ctx.fillStyle = COLORS.yellow;
    ctx.fillText(settingsTab.graphicsLabel, 54, 118);
    ctx.fillStyle = settingsTab.graphicsValue === 'HIGH' ? COLORS.white : COLORS.gray;
    ctx.fillText(settingsTab.graphicsValue, 166, 118);

    ctx.fillStyle = COLORS.gray;
    ctx.font = '5px "Press Start 2P"';
    ctx.fillText(settingsTab.hint, 82, 132);
  }
  
  ctx.fillStyle = COLORS.gray;
  ctx.font = '5px "Press Start 2P"';
  ctx.fillText('<- -> Switch tabs', 60, 200);
  ctx.fillText(getMenuLabel(), 90, 190);
}


