// Battle System Module
import { game } from './game-state.js';
import { enemies } from './enemies.js';
import { spellData, consumableItems } from './data.js';
import { maps } from './maps.js';
import { startDialogue } from './dialogue.js';
import { updateQuestProgress } from './quests-logic.js';

export function startBattle() {
  game.state = 'battle';
  
  // Determine which enemies can appear based on location
  const map = maps[game.map];
  const isOutdoor = map.grassWalkable; // Pentacrest and Riverside are outdoor
  
  let availableEnemies = enemies.filter(e => {
    if (e.outdoor && !isOutdoor) return false; // Parking meters only outside
    if (!e.outdoor && e.outdoor !== undefined) return true; // Indoor enemies
    return true; // Homework can be anywhere (outdoor undefined)
  });
  
  // Special: 20% chance for Raccoon in Riverside Park
  let enemy;
  if (game.map === 'riverside' && Math.random() < 0.2) {
    enemy = JSON.parse(JSON.stringify(enemies.find(e => e.name === 'Raccoon')));
  } else {
    const enemyIndex = Math.min(Math.floor(game.player.level / 2), availableEnemies.length - 1);
    enemy = JSON.parse(JSON.stringify(availableEnemies[enemyIndex]));
  }
  
  game.battleState = {
    enemy: enemy,
    selectedAction: 0,
    selectedSpell: 0,
    selectedItem: 0,
    inSpellMenu: false,
    inItemMenu: false,
    message: `A wild ${enemy.name} appeared!`,
    playerTurn: true,
    animating: false,
    defenseBoost: 0,
    boostTurnsLeft: 0
  };
}

export function executeBattleAction() {
  if (game.battleState.animating) return;
  
  const actions = ['Attack', 'Magic', 'Item', 'Run'];
  const action = actions[game.battleState.selectedAction];
  
  if (action === 'Attack') {
    let attackPower = game.player.attack;
    if (game.activeBuff && game.activeBuff.type === 'attack') {
      attackPower += game.activeBuff.amount;
    }
    const damage = attackPower + Math.floor(Math.random() * 5);
    game.battleState.enemy.hp -= damage;
    game.battleState.enemy.hp = Math.max(0, game.battleState.enemy.hp);
    game.battleState.message = `You dealt ${damage} damage!`;
    game.battleState.animating = true;
    
    setTimeout(() => {
      if (game.battleState.enemy.hp <= 0) {
        game.battleState.message = `${game.battleState.enemy.name} was defeated!`;
        setTimeout(() => {
          victoryBattle();
        }, 800);
      } else {
        enemyTurn();
      }
    }, 1000);
  } else if (action === 'Magic') {
    // Open spell menu
    game.battleState.inSpellMenu = true;
    game.battleState.selectedSpell = 0;
    game.battleState.message = 'Choose a spell:';
  } else if (action === 'Item') {
    // Open item menu
    if (game.consumables.length === 0) {
      game.battleState.message = 'No items to use!';
    } else {
      game.battleState.inItemMenu = true;
      game.battleState.selectedItem = 0;
      game.battleState.message = 'Choose an item:';
    }
  } else if (action === 'Run') {
    if (Math.random() < 0.5) {
      game.battleState.message = 'You ran away!';
      setTimeout(() => {
        game.state = 'explore';
        game.battleState = null;
      }, 1000);
    } else {
      game.battleState.message = 'Could not escape!';
      setTimeout(() => enemyTurn(), 1000);
    }
  }
}

export function executeSpell() {
  if (game.battleState.selectedSpell === game.spells.length) {
    // Back option
    game.battleState.inSpellMenu = false;
    game.battleState.selectedSpell = 0;
    game.battleState.message = 'What will you do?';
    return;
  }
  
  const spellName = game.spells[game.battleState.selectedSpell];
  const spell = spellData[spellName];
  
  if (game.player.mp < spell.mpCost) {
    game.battleState.message = 'Not enough MP!';
    game.battleState.animating = false;
    return;
  }
  
  game.player.mp -= spell.mpCost;
  game.battleState.inSpellMenu = false;
  game.battleState.animating = true;
  
  if (spell.type === 'attack') {
    let magicPower = game.player.magic;
    if (game.activeBuff && game.activeBuff.type === 'magic') {
      magicPower += game.activeBuff.amount;
    }
    const damage = Math.floor(magicPower * spell.power) + Math.floor(Math.random() * 5);
    game.battleState.enemy.hp -= damage;
    game.battleState.enemy.hp = Math.max(0, game.battleState.enemy.hp);
    game.battleState.message = `${spellName} dealt ${damage} damage!`;
    
    setTimeout(() => {
      if (game.battleState.enemy.hp <= 0) {
        game.battleState.message = `${game.battleState.enemy.name} was defeated!`;
        setTimeout(() => {
          victoryBattle();
        }, 800);
      } else {
        enemyTurn();
      }
    }, 1000);
  } else if (spell.type === 'defense') {
    game.battleState.defenseBoost = spell.boost;
    game.battleState.boostTurnsLeft = spell.duration;
    game.battleState.message = `Defense increased by ${spell.boost}!`;
    setTimeout(() => enemyTurn(), 1000);
  } else if (spell.type === 'heal') {
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + spell.amount);
    game.battleState.message = `Restored ${spell.amount} HP!`;
    setTimeout(() => {
      game.battleState.animating = false;
      enemyTurn();
    }, 1000);
  }
}

export function useItemInBattle() {
  if (game.battleState.selectedItem === game.consumables.length) {
    // Back option
    game.battleState.inItemMenu = false;
    game.battleState.selectedItem = 0;
    game.battleState.message = 'What will you do?';
    return;
  }
  
  const item = game.consumables[game.battleState.selectedItem];
  game.battleState.inItemMenu = false;
  game.battleState.animating = true;
  
  applyItemEffect(item);
  
  // Remove item from inventory
  game.consumables.splice(game.battleState.selectedItem, 1);
  
  setTimeout(() => {
    game.battleState.animating = false;
    enemyTurn();
  }, 1000);
}

export function useItemFromMenu() {
  if (game.itemMenuSelection >= game.consumables.length) return;
  
  const item = game.consumables[game.itemMenuSelection];
  applyItemEffect(item);
  
  // Remove item from inventory
  game.consumables.splice(game.itemMenuSelection, 1);
  
  // Adjust selection if needed
  if (game.itemMenuSelection >= game.consumables.length && game.consumables.length > 0) {
    game.itemMenuSelection = game.consumables.length - 1;
  }
}

export function applyItemEffect(item) {
  if (item.effect === 'healHP') {
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + item.amount);
    if (game.battleState) {
      game.battleState.message = `Used ${item.name}! Restored ${item.amount} HP!`;
    }
  } else if (item.effect === 'healMP') {
    game.player.mp = Math.min(game.player.maxMp, game.player.mp + item.amount);
    if (game.battleState) {
      game.battleState.message = `Used ${item.name}! Restored ${item.amount} MP!`;
    }
  } else if (item.effect === 'healBoth') {
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + item.hpAmount);
    game.player.mp = Math.min(game.player.maxMp, game.player.mp + item.mpAmount);
    if (game.battleState) {
      game.battleState.message = `Used ${item.name}! Restored ${item.hpAmount} HP & ${item.mpAmount} MP!`;
    }
  } else if (item.effect === 'buffAttack') {
    game.activeBuff = { type: 'attack', amount: item.amount, turnsLeft: item.turns };
    if (game.battleState) {
      game.battleState.message = `Used ${item.name}! Attack +${item.amount} for ${item.turns} turns!`;
    }
  } else if (item.effect === 'buffDefense') {
    game.activeBuff = { type: 'defense', amount: item.amount, turnsLeft: item.turns };
    if (game.battleState) {
      game.battleState.message = `Used ${item.name}! Defense +${item.amount} for ${item.turns} turns!`;
    }
  } else if (item.effect === 'buffMagic') {
    game.activeBuff = { type: 'magic', amount: item.amount, turnsLeft: item.turns };
    if (game.battleState) {
      game.battleState.message = `Used ${item.name}! Magic +${item.amount} for ${item.turns} turns!`;
    }
  }
}

export function enemyTurn() {
  // Reduce defense boost duration
  if (game.battleState.boostTurnsLeft > 0) {
    game.battleState.boostTurnsLeft--;
    if (game.battleState.boostTurnsLeft === 0) {
      game.battleState.defenseBoost = 0;
    }
  }
  
  // Reduce active buff duration
  if (game.activeBuff && game.activeBuff.turnsLeft > 0) {
    game.activeBuff.turnsLeft--;
    if (game.activeBuff.turnsLeft === 0) {
      game.activeBuff = null;
    }
  }
  
  const enemy = game.battleState.enemy;
  let damage = 0;
  let attackName = 'attacked';
  let specialEffect = null;
  
  // 30% chance to use special attack if available
  if (enemy.specialAttack && Math.random() < 0.3) {
    damage = enemy.specialAttack.damage;
    attackName = enemy.specialAttack.name;
    specialEffect = enemy.specialAttack.effect;
    
    if (specialEffect === 'drainMP') {
      game.player.mp = Math.max(0, game.player.mp - enemy.specialAttack.drainAmount);
    }
  } else {
    damage = enemy.attack + Math.floor(Math.random() * 3);
  }
  
  // Apply defense (including buff)
  let totalDefense = game.player.defense + game.battleState.defenseBoost;
  if (game.activeBuff && game.activeBuff.type === 'defense') {
    totalDefense += game.activeBuff.amount;
  }
  damage = Math.max(1, damage - Math.floor(totalDefense / 2));
  
  game.player.hp -= damage;
  game.battleState.message = `${enemy.name} used ${attackName}! ${damage} damage!`;
  game.battleState.animating = true;
  
  setTimeout(() => {
    game.battleState.animating = false;
    if (game.player.hp <= 0) {
      gameOver();
    } else {
      game.battleState.message = 'What will you do?';
    }
  }, 1000);
}

export function victoryBattle() {
  const exp = game.battleState.enemy.exp;
  const gold = game.battleState.enemy.gold;
  game.player.exp += exp;
  game.player.gold += gold;
  
  // Update quest progress for enemy defeats
  updateQuestProgress('defeat_enemy', game.battleState.enemy.name);
  updateQuestProgress('collect_gold', game.player.gold);
  
  game.battleState.message = `Victory! Gained ${exp} EXP and $${gold}!`;
  
  // Level up check
  if (game.player.exp >= game.player.level * 30) {
    game.player.level++;
    game.player.maxHp += 10;
    game.player.maxMp += 5;
    game.player.attack += 2;
    game.player.magic += 2;
    game.player.defense += 1;
    game.battleState.message += ` LEVEL UP to ${game.player.level}! ATK+2 MAG+2 DEF+1`;
  }
  
  // Apply post-battle regeneration skills
  let regenMessage = '';
  
  if (game.skills.includes('Regenerate')) {
    const hpRegen = Math.floor(game.player.maxHp * 0.1);
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + hpRegen);
    regenMessage += ` Regenerate: +${hpRegen} HP!`;
  }
  
  if (game.skills.includes('Meditation')) {
    const mpRegen = Math.floor(game.player.maxMp * 0.15);
    game.player.mp = Math.min(game.player.maxMp, game.player.mp + mpRegen);
    regenMessage += ` Meditation: +${mpRegen} MP!`;
  }
  
  if (regenMessage) {
    game.battleState.message += regenMessage;
  }
  
  setTimeout(() => {
    game.state = 'explore';
    game.battleState = null;
  }, 2500);
}

export function gameOver() {
  game.battleState.message = 'You were defeated... Game Over';
  setTimeout(() => {
    game.player.hp = game.player.maxHp;
    game.player.gold = Math.floor(game.player.gold / 2);
    game.state = 'explore';
    game.battleState = null;
  }, 3000);
}

