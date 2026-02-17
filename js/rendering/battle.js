// Battle Module - Battle screen and enemy sprite rendering
import { COLORS, CAVE_MAPS } from '../constants.js';
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
  
  // Cave monsters - only visible if flashlight is on or in battle
  const caveMonsters = ['Bat Swarm', 'Cave Spider', 'Stone Golem', 'Glowing Mushroom', 'Crystal Elemental', 'Cave Drake'];
  const isCaveMonster = caveMonsters.includes(enemy.name);
  
  if (isCaveMonster && !game.flashlightOn && CAVE_MAPS.includes(game.map)) {
    // Don't render cave monsters if flashlight is off in cave
    return;
  }
  
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
    
  } else if (enemy.name === 'Bat Swarm') {
    // Flying bats in formation
    ctx.fillStyle = COLORS.darkGray;
    // Left bat
    ctx.fillRect(x - 14, y - 4, 8, 10);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 13, y - 2, 3, 4); // wing left
    ctx.fillRect(x - 7, y - 2, 3, 4);  // wing right
    ctx.fillRect(x - 10, y + 4, 2, 2); // feet
    ctx.fillRect(x - 8, y + 4, 2, 2);
    
    // Center bat (larger, prominent)
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 6, y - 8, 12, 14);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 5, y - 6, 5, 6); // wing left
    ctx.fillRect(x + 1, y - 6, 5, 6); // wing right
    ctx.fillRect(x - 3, y + 4, 2, 2); // feet
    ctx.fillRect(x + 1, y + 4, 2, 2);
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(x - 2, y - 4, 2, 2); // eyes
    ctx.fillRect(x + 2, y - 4, 2, 2);
    
    // Right bat
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x + 6, y - 2, 8, 10);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x + 7, y, 3, 4); // wing left
    ctx.fillRect(x + 13, y, 3, 4); // wing right
    ctx.fillRect(x + 10, y + 6, 2, 2); // feet
    ctx.fillRect(x + 12, y + 6, 2, 2);
    
  } else if (enemy.name === 'Cave Spider') {
    // Large hairy spider with long legs
    ctx.fillStyle = COLORS.darkGray;
    // Main body (rounded)
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Head
    ctx.beginPath();
    ctx.arc(x, y - 10, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Fangs
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 2, y - 4, 1, 3);
    ctx.fillRect(x + 1, y - 4, 1, 3);
    
    // Eyes
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(x - 3, y - 12, 2, 2);
    ctx.fillRect(x + 1, y - 12, 2, 2);
    
    // Long spindly legs (8 legs, like a real spider)
    ctx.strokeStyle = COLORS.black;
    ctx.lineWidth = 1;
    // Front left
    ctx.beginPath();
    ctx.moveTo(x - 6, y - 4);
    ctx.lineTo(x - 16, y - 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 6, y - 4);
    ctx.lineTo(x - 18, y);
    ctx.stroke();
    // Front right
    ctx.beginPath();
    ctx.moveTo(x + 6, y - 4);
    ctx.lineTo(x + 16, y - 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 6, y - 4);
    ctx.lineTo(x + 18, y);
    ctx.stroke();
    // Back left
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 6);
    ctx.lineTo(x - 14, y + 16);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 6);
    ctx.lineTo(x - 16, y + 8);
    ctx.stroke();
    // Back right
    ctx.beginPath();
    ctx.moveTo(x + 4, y + 6);
    ctx.lineTo(x + 14, y + 16);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 4, y + 6);
    ctx.lineTo(x + 16, y + 8);
    ctx.stroke();
    
  } else if (enemy.name === 'Stone Golem') {
    // Large blocky stone creature
    ctx.fillStyle = '#888888'; // gray stone
    // Main body (large cube)
    ctx.fillRect(x - 14, y - 6, 28, 28);
    
    // Stone texture - cracks
    ctx.strokeStyle = COLORS.darkGray;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - 4, y - 6);
    ctx.lineTo(x - 4, y + 22);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 4, y - 6);
    ctx.lineTo(x + 4, y + 22);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 14, y + 6);
    ctx.lineTo(x + 14, y + 6);
    ctx.stroke();
    
    // Head/top part
    ctx.fillStyle = '#999999';
    ctx.fillRect(x - 10, y - 12, 20, 8);
    
    // Eyes (glowing)
    ctx.fillStyle = COLORS.orange;
    ctx.fillRect(x - 6, y - 8, 3, 3);
    ctx.fillRect(x + 3, y - 8, 3, 3);
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(x - 5, y - 7, 1, 1);
    ctx.fillRect(x + 4, y - 7, 1, 1);
    
    // Heavy arms
    ctx.fillStyle = '#888888';
    ctx.fillRect(x - 16, y + 2, 4, 14);
    ctx.fillRect(x + 12, y + 2, 4, 14);
    
  } else if (enemy.name === 'Glowing Mushroom') {
    // Magical glowing mushroom with aura
    ctx.fillStyle = '#ff00ff'; // magenta/purple
    // Cap (dome shape)
    ctx.beginPath();
    ctx.ellipse(x, y - 6, 10, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Stem
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(x - 3, y + 2, 6, 12);
    
    // Spots on cap
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 6, y - 8, 2, 2);
    ctx.fillRect(x + 4, y - 8, 2, 2);
    ctx.fillRect(x - 4, y - 4, 2, 2);
    ctx.fillRect(x + 2, y - 4, 2, 2);
    
    // Glow aura (multiple circles)
    ctx.strokeStyle = 'rgba(255, 0, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.strokeStyle = 'rgba(255, 0, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.stroke();
    
  } else if (enemy.name === 'Crystal Elemental') {
    // Geometric crystal shape
    ctx.fillStyle = '#00ffff'; // cyan/cyan crystal
    // Main diamond/crystal body
    ctx.beginPath();
    ctx.moveTo(x, y - 16); // top point
    ctx.lineTo(x + 12, y); // right point
    ctx.lineTo(x, y + 16); // bottom point
    ctx.lineTo(x - 12, y); // left point
    ctx.closePath();
    ctx.fill();
    
    // Crystal facets (lighter blue for shine)
    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    ctx.moveTo(x, y - 16);
    ctx.lineTo(x + 8, y - 4);
    ctx.lineTo(x - 8, y - 4);
    ctx.closePath();
    ctx.fill();
    
    // Core glow
    ctx.fillStyle = COLORS.white;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Glowing aura
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.stroke();
    
  } else if (enemy.name === 'Cave Drake') {
    // Large dragon-like creature with wings
    ctx.fillStyle = COLORS.darkGray;
    // Main body (large oval)
    ctx.beginPath();
    ctx.ellipse(x, y + 2, 14, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Head (extended forward)
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x + 12, y - 4, 8, 8);
    
    // Snout/mouth
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x + 18, y - 2, 2, 4);
    
    // Eyes (yellow/hostile)
    ctx.fillStyle = COLORS.yellow;
    ctx.fillRect(x + 14, y - 4, 2, 2);
    ctx.fillRect(x + 14, y + 2, 2, 2);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x + 14, y - 3, 1, 1);
    
    // Dragon wings (large, membraned)
    ctx.fillStyle = COLORS.darkGray;
    // Left wing
    ctx.beginPath();
    ctx.moveTo(x + 2, y - 4);
    ctx.lineTo(x - 14, y - 12);
    ctx.lineTo(x - 10, y + 4);
    ctx.closePath();
    ctx.fill();
    // Right wing
    ctx.beginPath();
    ctx.moveTo(x + 2, y - 4);
    ctx.lineTo(x + 18, y - 12);
    ctx.lineTo(x + 14, y + 4);
    ctx.closePath();
    ctx.fill();
    
    // Wing veins
    ctx.strokeStyle = COLORS.black;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - 8, y - 6);
    ctx.lineTo(x - 12, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 8, y - 6);
    ctx.lineTo(x + 12, y);
    ctx.stroke();
    
    // Tail (curved)
    ctx.strokeStyle = COLORS.darkGray;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x - 12, y + 8, 10, 0, Math.PI * 0.5);
    ctx.stroke();

  } else if (enemy.name === 'Fungal Stalker') {
    ctx.fillStyle = '#6a4b7a';
    ctx.beginPath();
    ctx.ellipse(x, y + 4, 12, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 10, y - 6, 20, 10);
    ctx.fillStyle = COLORS.lightGray;
    ctx.fillRect(x - 6, y - 4, 12, 6);
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(x - 4, y - 2, 2, 2);
    ctx.fillRect(x + 2, y - 2, 2, 2);

  } else if (enemy.name === 'Cave Leech') {
    ctx.fillStyle = '#2f3f2f';
    ctx.beginPath();
    ctx.ellipse(x, y + 2, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 10, y + 1, 4, 2);
    ctx.fillRect(x + 6, y + 1, 4, 2);
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(x - 2, y - 1, 4, 2);

  } else if (enemy.name === 'Crystal Warden') {
    ctx.fillStyle = '#44c8e0';
    ctx.beginPath();
    ctx.moveTo(x, y - 16);
    ctx.lineTo(x + 12, y);
    ctx.lineTo(x, y + 16);
    ctx.lineTo(x - 12, y);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 3, y - 3, 6, 6);
    ctx.strokeStyle = COLORS.lightGray;
    ctx.strokeRect(x - 8, y - 8, 16, 16);

  } else if (enemy.name === 'Tunnel Brute') {
    ctx.fillStyle = '#6b5b4b';
    ctx.fillRect(x - 12, y - 6, 24, 24);
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 8, y - 10, 16, 8);
    ctx.fillStyle = COLORS.orange;
    ctx.fillRect(x - 6, y - 6, 4, 4);
    ctx.fillRect(x + 2, y - 6, 4, 4);
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 16, y + 4, 4, 12);
    ctx.fillRect(x + 12, y + 4, 4, 12);

  } else if (enemy.name === 'Abyssal Drake') {
    ctx.fillStyle = '#3a2a3f';
    ctx.beginPath();
    ctx.ellipse(x, y + 2, 14, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 6, y - 8, 12, 8);
    ctx.fillStyle = COLORS.yellow;
    ctx.fillRect(x - 4, y - 6, 2, 2);
    ctx.fillRect(x + 2, y - 6, 2, 2);
    ctx.fillStyle = '#3a2a3f';
    ctx.beginPath();
    ctx.moveTo(x - 4, y - 2);
    ctx.lineTo(x - 16, y - 10);
    ctx.lineTo(x - 12, y + 2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 4, y - 2);
    ctx.lineTo(x + 16, y - 10);
    ctx.lineTo(x + 12, y + 2);
    ctx.closePath();
    ctx.fill();

  } else if (enemy.name === 'Void Mycelium') {
    ctx.fillStyle = '#513a66';
    ctx.beginPath();
    ctx.ellipse(x, y - 6, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.lightGray;
    ctx.fillRect(x - 4, y + 2, 8, 12);
    ctx.fillStyle = COLORS.purple;
    ctx.fillRect(x - 8, y - 10, 3, 3);
    ctx.fillRect(x + 5, y - 10, 3, 3);
    ctx.strokeStyle = 'rgba(80, 40, 110, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.stroke();

  } else if (enemy.name === 'Cave Sovereign') {
    ctx.fillStyle = '#2b2230';
    ctx.fillRect(x - 14, y - 8, 28, 28);
    ctx.fillStyle = COLORS.darkGray;
    ctx.fillRect(x - 10, y - 14, 20, 8);
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(x - 6, y - 8, 4, 4);
    ctx.fillRect(x + 2, y - 8, 4, 4);
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x - 4, y + 2, 8, 2);
    ctx.strokeStyle = COLORS.purple;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y + 2, 18, 0, Math.PI * 2);
    ctx.stroke();
    
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
