// Battle Module - Battle screen and enemy sprite rendering
import { COLORS } from '../constants.js';
import { game } from '../game-state.js';
import { spellData } from '../data.js';
import { getButtonLabel, setCtx, wrapText } from './utils.js';

export function drawBattle() {
  const ctx = setCtx();
  
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

export function drawEnemySprite(enemy, x, y) {
  const ctx = setCtx();
  
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
