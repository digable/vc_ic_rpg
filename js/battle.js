// Battle System Module
import { game, removeConsumable, addConsumable } from './game-state.js';
import { enemies } from './enemies.js';
import { CAVE_MAPS } from './constants.js';
import { spellData, consumableItems, caveLootTables, caveBossLootTables } from './data.js';
import { maps } from './maps.js';
import { startDialogue } from './dialogue.js';
import { updateQuestProgress, completeCaveDefeatQuests } from './quests-logic.js';
import { addExperience } from './leveling.js';

export function startBattle(enemyName) {
  game.state = 'battle';
  
  // Determine which enemies can appear based on location
  const map = maps[game.map];
  
  let enemy;
  
  // Beer Caves has unique enemies
  if (enemyName) {
    const matched = enemies.find(e => e.name === enemyName);
    if (matched) {
      enemy = JSON.parse(JSON.stringify(matched));
    }
  }

  if (!enemy) {
    const mapSpecificEnemies = enemies.filter(e => e.location === game.map && !e.isBoss);

    if (mapSpecificEnemies.length > 0) {
      const enemyIndex = Math.min(Math.floor(game.player.level / 2), mapSpecificEnemies.length - 1);
      enemy = JSON.parse(JSON.stringify(mapSpecificEnemies[enemyIndex]));
    } else if (CAVE_MAPS.includes(game.map)) {
      const beerCavesEnemies = enemies.filter(e => e.location === 'beer_caves');
      const enemyIndex = Math.min(Math.floor(game.player.level / 2), beerCavesEnemies.length - 1);
      enemy = JSON.parse(JSON.stringify(beerCavesEnemies[enemyIndex]));
    } else {
      const isOutdoor = map.grassWalkable; // Pentacrest and Riverside are outdoor
      
      let availableEnemies = enemies.filter(e => {
        if (e.location) return false; // Skip location-specific enemies for non-matching maps
        if (e.outdoor && !isOutdoor) return false; // Parking meters only outside
        if (!e.outdoor && e.outdoor !== undefined) return true; // Indoor enemies
        return true; // Homework can be anywhere (outdoor undefined)
      });
      
      // Special: 20% chance for Raccoon in Riverside Park
      if (game.map === 'riverside' && Math.random() < 0.2) {
        enemy = JSON.parse(JSON.stringify(enemies.find(e => e.name === 'Raccoon')));
      } else {
        const enemyIndex = Math.min(Math.floor(game.player.level / 2), availableEnemies.length - 1);
        enemy = JSON.parse(JSON.stringify(availableEnemies[enemyIndex]));
      }
    }
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
    boostTurnsLeft: 0,
    sovereignMidDialogShown: false
  };
}

function maybeTriggerSovereignMidDialog() {
  const enemy = game.battleState.enemy;
  if (enemy.name !== 'Cave Sovereign') return false;
  if (game.battleState.sovereignMidDialogShown) return false;
  if (enemy.hp <= enemy.maxHp / 2 && enemy.hp > 0) {
    game.battleState.sovereignMidDialogShown = true;
    game.battleState.message = 'Sovereign: I will not be undone by a mortal. You: Then fall to one.';
    return true;
  }
  return false;
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
        if (maybeTriggerSovereignMidDialog()) {
          setTimeout(() => enemyTurn(), 1200);
        } else {
          enemyTurn();
        }
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
        if (maybeTriggerSovereignMidDialog()) {
          setTimeout(() => enemyTurn(), 1200);
        } else {
          enemyTurn();
        }
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
  
  // Remove item from inventory unless it's a permanent item
  if (item.effect !== 'flashlight' && item.effect !== 'angel_dodge') {
    removeConsumable(game.battleState.selectedItem);
  }
  
  setTimeout(() => {
    game.battleState.animating = false;
    enemyTurn();
  }, 1000);
}

export function useItemFromMenu() {
  if (game.itemMenuSelection >= game.consumables.length) return;
  
  const item = game.consumables[game.itemMenuSelection];
  applyItemEffect(item);
  
  // Remove item from inventory unless it's a permanent item
  if (item.effect !== 'flashlight' && item.effect !== 'angel_dodge') {
    removeConsumable(game.itemMenuSelection);
  }
  
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
  } else if (item.effect === 'buffStrength') {
    game.activeBuff = { type: 'strength', amount: item.amount, turnsLeft: item.turns };
    if (game.battleState) {
      game.battleState.message = `Used ${item.name}! Strength +${item.amount} for ${item.turns} turns!`;
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
  } else if (item.effect === 'buffIntellect') {
    game.activeBuff = { type: 'intellect', amount: item.amount, turnsLeft: item.turns };
    if (game.battleState) {
      game.battleState.message = `Used ${item.name}! Intellect +${item.amount} for ${item.turns} turns!`;
    }
  } else if (item.effect === 'buffAgility') {
    game.activeBuff = { type: 'agility', amount: item.amount, turnsLeft: item.turns };
    if (game.battleState) {
      game.battleState.message = `Used ${item.name}! Agility +${item.amount} for ${item.turns} turns!`;
    }
  } else if (item.effect === 'buffVitality') {
    game.activeBuff = { type: 'vitality', amount: item.amount, turnsLeft: item.turns };
    if (game.battleState) {
      game.battleState.message = `Used ${item.name}! Vitality +${item.amount} for ${item.turns} turns!`;
    }
  } else if (item.effect === 'flashlight') {
    if (CAVE_MAPS.includes(game.map)) {
      game.flashlightOn = true;
      if (game.battleState) {
        game.battleState.message = `Used ${item.name}! The caves light up!`;
      }
    } else if (game.battleState) {
      game.battleState.message = `${item.name} doesn't help here.`;
    }
  } else if (item.effect === 'angel_dodge') {
    if (game.battleState) {
      game.angelWardDodgeCharges = 3;
      game.battleState.message = `Used ${item.name}! 50% dodge chance for the next 3 enemy attacks!`;
    } else {
      startDialogue([
        `${item.name} only activates during battle.`,
        'Use it when enemies are about to strike.'
      ]);
      game.state = 'dialogue';
    }
  } else if (item.effect === 'heroBonus') {
    // Permanent stat boost
    game.player.attack += 10;
    game.player.defense += 10;
    game.player.magic += 10;
    game.player.strength = (game.player.strength || 0) + 10;
    game.player.intellect = (game.player.intellect || 0) + 10;
    game.player.agility = (game.player.agility || 0) + 10;
    game.player.vitality = (game.player.vitality || 0) + 10;
    game.player.spirit = (game.player.spirit || 0) + 10;
    game.player.luck = (game.player.luck || 0) + 10;
    game.player.maxHp += 50;
    game.player.hp += 50;
    game.player.maxMp += 30;
    game.player.mp += 30;
    if (game.battleState) {
      game.battleState.message = `Used ${item.name}! All stats permanently increased!`;
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

  if (game.angelWardDodgeCharges > 0) {
    game.angelWardDodgeCharges--;
    if (Math.random() < 0.5) {
      game.battleState.message = `Angel Ward flares! You dodge the attack! (${game.angelWardDodgeCharges} ward left)`;
      game.battleState.animating = true;

      setTimeout(() => {
        game.battleState.animating = false;
        game.battleState.message = 'What will you do?';
      }, 1000);
      return;
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
  game.player.gold += gold;
  
  // Update quest progress for enemy defeats
  updateQuestProgress('defeat_enemy', game.battleState.enemy.name);
  updateQuestProgress('collect_gold', game.player.gold);

  if (game.battleState.enemy.name === 'Cave Sovereign' && !game.caveSovereignDefeated) {
    game.caveSovereignDefeated = true;
    completeCaveDefeatQuests();
    game.battleState.message += ' The caves fall silent.';
  }
  
  const isSovereign = game.battleState.enemy.name === 'Cave Sovereign';
  if (isSovereign) {
    game.battleState.message = 'Sovereign: The cave... grows still. You: Rest now. Victory is ours.';
  } else {
    game.battleState.message = `Victory! Gained ${exp} EXP and $${gold}!`;
  }
  
  // Add experience and handle level ups
  const levelUpMessages = addExperience(exp);
  if (levelUpMessages.length > 0) {
    game.battleState.message += ` *** ${levelUpMessages.join(' | ')} ***`;
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

  if (isSovereign) {
    game.battleState.message += ` Victory! Gained ${exp} EXP and $${gold}!`;
  }

  let lootGiven = false;
  const bossLootTable = caveBossLootTables[game.map];
  if (game.battleState.enemy.isBoss && bossLootTable && Math.random() < bossLootTable.chance) {
    const lootName = bossLootTable.items[Math.floor(Math.random() * bossLootTable.items.length)];
    const lootItem = consumableItems.find(item => item.name === lootName);
    if (lootItem) {
      addConsumable(lootItem);
      game.battleState.message += ` Loot: ${lootItem.name}!`;
      lootGiven = true;
    }
  }

  if (!lootGiven) {
    const lootTable = caveLootTables[game.map];
    if (lootTable && Math.random() < lootTable.chance) {
      const lootName = lootTable.items[Math.floor(Math.random() * lootTable.items.length)];
      const lootItem = consumableItems.find(item => item.name === lootName);
      if (lootItem) {
        addConsumable(lootItem);
        game.battleState.message += ` Loot: ${lootItem.name}!`;
      }
    }
  }
  
  setTimeout(() => {
    game.state = 'explore';
    game.battleState = null;
  }, 2500);
}

export function gameOver() {
  game.state = 'gameOver';
  game.battleState = null;
}

