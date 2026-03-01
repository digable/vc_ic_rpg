// Battle System Module
import { game, removeConsumable, addConsumable, actions } from '../../game-state.js';
import { enemies } from '../../enemies.js';
import { CAVE_MAPS } from '../../constants.js';
import { spellData, consumableItems, caveLootTables, caveBossLootTables } from '../../data.js';
import { maps } from '../../maps.js';
import { startDialogue } from '../../dialogue.js';
import { updateQuestProgress, completeCaveDefeatQuests } from '../quests/logic.js';
import { addExperience } from '../../leveling.js';

export function startBattle(enemyName) {
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
      if (game.map === 'city_park' && Math.random() < 0.2) {
        enemy = JSON.parse(JSON.stringify(enemies.find(e => e.name === 'Raccoon')));
      } else {
        const enemyIndex = Math.min(Math.floor(game.player.level / 2), availableEnemies.length - 1);
        enemy = JSON.parse(JSON.stringify(availableEnemies[enemyIndex]));
      }
    }
  }
  
  actions.battleStarted(enemy);
}

function maybeTriggerSovereignMidDialog() {
  const enemy = game.battleState.enemy;
  if (enemy.name !== 'Cave Sovereign') return false;
  if (game.battleState.sovereignMidDialogShown) return false;
  if (enemy.hp <= enemy.maxHp / 2 && enemy.hp > 0) {
    actions.battleStatePatched({
      sovereignMidDialogShown: true,
      message: 'Sovereign: I will not be undone by a mortal. You: Then fall to one.'
    }, 'sovereignMidDialogShown');
    return true;
  }
  return false;
}

function getRunSuccessChance(enemy) {
  const runChanceByEnemy = {
    'Restless Zombie': 0.95,
    'Skeletal Groundskeeper': 0.75,
    'Cemetery Witch': 0.6,
    'Wailing Ghost': 0.5,
    'Lantern Wisp': 0.45,
    'Raven Swarm': 0.35,
    'Lake Monster': 0.8,
    'Cave Drake': 0.3,
    'Cave Sovereign': 0.05,
    'Corrupted Administrator': 0.03
  };

  return runChanceByEnemy[enemy.name] ?? 0.5;
}

function setBattleMessage(message, label = 'battleMessageSet') {
  actions.battleStatePatched({ message }, label);
}

function appendBattleMessage(messageFragment, label = 'battleMessageAppended') {
  actions.battleStatePatched({ message: `${game.battleState.message}${messageFragment}` }, label);
}

function setBattleEnemyHp(nextHp, label = 'battleEnemyHpSet') {
  actions.battleStatePatched({
    enemy: {
      ...game.battleState.enemy,
      hp: nextHp
    }
  }, label);
}

export function executeBattleAction() {
  if (game.battleState.animating) return;
  
  const battleActions = ['Attack', 'Magic', 'Item', 'Run'];
  const action = battleActions[game.battleState.selectedAction];
  
  if (action === 'Attack') {
    let attackPower = game.player.attack;
    if (game.activeBuff && game.activeBuff.type === 'attack') {
      attackPower += game.activeBuff.amount;
    }
    const damage = attackPower + Math.floor(Math.random() * 5);
    const nextEnemyHp = Math.max(0, game.battleState.enemy.hp - damage);
    setBattleEnemyHp(nextEnemyHp, 'battleEnemyHpReducedByAttack');
    actions.battleStatePatched({
      message: `You dealt ${damage} damage!`,
      animating: true
    }, 'battleAttackResolved');
    
    setTimeout(() => {
      if (game.battleState.enemy.hp <= 0) {
        setBattleMessage(`${game.battleState.enemy.name} was defeated!`, 'battleEnemyDefeatedMessage');
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
    actions.battleStatePatched({
      inSpellMenu: true,
      selectedSpell: 0,
      message: 'Choose a spell:'
    }, 'battleSpellMenuOpened');
  } else if (action === 'Item') {
    // Open item menu
    if (game.consumables.length === 0) {
      setBattleMessage('No items to use!', 'battleNoItemsMessage');
    } else {
      actions.battleStatePatched({
        inItemMenu: true,
        selectedItem: 0,
        message: 'Choose an item:'
      }, 'battleItemMenuOpened');
    }
  } else if (action === 'Run') {
    const runSuccessChance = getRunSuccessChance(game.battleState.enemy);
    if (Math.random() < runSuccessChance) {
      setBattleMessage('You ran away!', 'battleRunSuccessMessage');
      setTimeout(() => {
        actions.battleEnded('explore');
      }, 1000);
    } else {
      setBattleMessage('Could not escape!', 'battleRunFailMessage');
      setTimeout(() => enemyTurn(), 1000);
    }
  }
}

export function executeSpell() {
  if (game.battleState.selectedSpell === game.spells.length) {
    // Back option
    actions.battleStatePatched({
      inSpellMenu: false,
      selectedSpell: 0,
      message: 'What will you do?'
    }, 'battleSpellMenuBack');
    return;
  }
  
  const spellName = game.spells[game.battleState.selectedSpell];
  const spell = spellData[spellName];
  
  if (game.player.mp < spell.mpCost) {
    setBattleMessage('Not enough MP!', 'battleSpellInsufficientMp');
    actions.battleStatePatched({ animating: false }, 'battleSpellInsufficientMpAnimationStop');
    return;
  }
  
  actions.playerPatched({ mp: game.player.mp - spell.mpCost }, 'battleSpellMpSpent');
  actions.battleStatePatched({ inSpellMenu: false, animating: true }, 'battleSpellCasting');
  
  if (spell.type === 'attack') {
    let magicPower = game.player.magic;
    if (game.activeBuff && game.activeBuff.type === 'magic') {
      magicPower += game.activeBuff.amount;
    }
    const damage = Math.floor(magicPower * spell.power) + Math.floor(Math.random() * 5);
    const nextEnemyHp = Math.max(0, game.battleState.enemy.hp - damage);
    setBattleEnemyHp(nextEnemyHp, 'battleEnemyHpReducedBySpell');
    setBattleMessage(`${spellName} dealt ${damage} damage!`, 'battleSpellDamageMessage');
    
    setTimeout(() => {
      if (game.battleState.enemy.hp <= 0) {
        setBattleMessage(`${game.battleState.enemy.name} was defeated!`, 'battleSpellEnemyDefeatedMessage');
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
    actions.battleStatePatched({
      defenseBoost: spell.boost,
      boostTurnsLeft: spell.duration,
      message: `Defense increased by ${spell.boost}!`
    }, 'battleDefenseSpellApplied');
    setTimeout(() => enemyTurn(), 1000);
  } else if (spell.type === 'heal') {
    actions.playerPatched({ hp: Math.min(game.player.maxHp, game.player.hp + spell.amount) }, 'battleHealSpellApplied');
    setBattleMessage(`Restored ${spell.amount} HP!`, 'battleHealSpellMessage');
    setTimeout(() => {
      actions.battleStatePatched({ animating: false }, 'battleHealSpellAnimationFinished');
      enemyTurn();
    }, 1000);
  }
}

export function useItemInBattle() {
  if (game.battleState.selectedItem === game.consumables.length) {
    // Back option
    actions.battleStatePatched({
      inItemMenu: false,
      selectedItem: 0,
      message: 'What will you do?'
    }, 'battleItemMenuBack');
    return;
  }
  
  const item = game.consumables[game.battleState.selectedItem];
  actions.battleStatePatched({ inItemMenu: false, animating: true }, 'battleItemUsing');
  
  applyItemEffect(item);
  
  // Remove item from inventory unless it's a permanent item
  if (item.effect !== 'flashlight' && item.effect !== 'angel_dodge') {
    removeConsumable(game.battleState.selectedItem);
  }
  
  setTimeout(() => {
    actions.battleStatePatched({ animating: false }, 'battleItemAnimationFinished');
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
    actions.gameStatePatched({ itemMenuSelection: game.consumables.length - 1 }, 'itemMenuSelectionClampedAfterUse');
  }
}

export function applyItemEffect(item) {
  if (item.effect === 'healHP') {
    actions.playerPatched({ hp: Math.min(game.player.maxHp, game.player.hp + item.amount) }, 'itemHealHpApplied');
    if (game.battleState) {
      setBattleMessage(`Used ${item.name}! Restored ${item.amount} HP!`, 'itemHealHpMessage');
    }
  } else if (item.effect === 'healMP') {
    actions.playerPatched({ mp: Math.min(game.player.maxMp, game.player.mp + item.amount) }, 'itemHealMpApplied');
    if (game.battleState) {
      setBattleMessage(`Used ${item.name}! Restored ${item.amount} MP!`, 'itemHealMpMessage');
    }
  } else if (item.effect === 'healBoth') {
    actions.playerPatched({
      hp: Math.min(game.player.maxHp, game.player.hp + item.hpAmount),
      mp: Math.min(game.player.maxMp, game.player.mp + item.mpAmount)
    }, 'itemHealBothApplied');
    if (game.battleState) {
      setBattleMessage(`Used ${item.name}! Restored ${item.hpAmount} HP & ${item.mpAmount} MP!`, 'itemHealBothMessage');
    }
  } else if (item.effect === 'buffAttack') {
    actions.gameStatePatched({ activeBuff: { type: 'attack', amount: item.amount, turnsLeft: item.turns } }, 'activeBuffAttackApplied');
    if (game.battleState) {
      setBattleMessage(`Used ${item.name}! Attack +${item.amount} for ${item.turns} turns!`, 'itemBuffAttackMessage');
    }
  } else if (item.effect === 'buffStrength') {
    actions.gameStatePatched({ activeBuff: { type: 'strength', amount: item.amount, turnsLeft: item.turns } }, 'activeBuffStrengthApplied');
    if (game.battleState) {
      setBattleMessage(`Used ${item.name}! Strength +${item.amount} for ${item.turns} turns!`, 'itemBuffStrengthMessage');
    }
  } else if (item.effect === 'buffDefense') {
    actions.gameStatePatched({ activeBuff: { type: 'defense', amount: item.amount, turnsLeft: item.turns } }, 'activeBuffDefenseApplied');
    if (game.battleState) {
      setBattleMessage(`Used ${item.name}! Defense +${item.amount} for ${item.turns} turns!`, 'itemBuffDefenseMessage');
    }
  } else if (item.effect === 'buffMagic') {
    actions.gameStatePatched({ activeBuff: { type: 'magic', amount: item.amount, turnsLeft: item.turns } }, 'activeBuffMagicApplied');
    if (game.battleState) {
      setBattleMessage(`Used ${item.name}! Magic +${item.amount} for ${item.turns} turns!`, 'itemBuffMagicMessage');
    }
  } else if (item.effect === 'buffIntellect') {
    actions.gameStatePatched({ activeBuff: { type: 'intellect', amount: item.amount, turnsLeft: item.turns } }, 'activeBuffIntellectApplied');
    if (game.battleState) {
      setBattleMessage(`Used ${item.name}! Intellect +${item.amount} for ${item.turns} turns!`, 'itemBuffIntellectMessage');
    }
  } else if (item.effect === 'buffAgility') {
    actions.gameStatePatched({ activeBuff: { type: 'agility', amount: item.amount, turnsLeft: item.turns } }, 'activeBuffAgilityApplied');
    if (game.battleState) {
      setBattleMessage(`Used ${item.name}! Agility +${item.amount} for ${item.turns} turns!`, 'itemBuffAgilityMessage');
    }
  } else if (item.effect === 'buffVitality') {
    actions.gameStatePatched({ activeBuff: { type: 'vitality', amount: item.amount, turnsLeft: item.turns } }, 'activeBuffVitalityApplied');
    if (game.battleState) {
      setBattleMessage(`Used ${item.name}! Vitality +${item.amount} for ${item.turns} turns!`, 'itemBuffVitalityMessage');
    }
  } else if (item.effect === 'flashlight') {
    if (CAVE_MAPS.includes(game.map)) {
      actions.gameStatePatched({ flashlightOn: true }, 'flashlightEnabledFromItem');
      if (game.battleState) {
        setBattleMessage(`Used ${item.name}! The caves light up!`, 'itemFlashlightMessage');
      }
    } else if (game.battleState) {
      setBattleMessage(`Failed to use ${item.name}! Even the bravest bulb can't outshine broad daylight.`, 'itemFlashlightFailedMessage');
    } else {
      startDialogue([
        `Failed to use ${item.name}!`,
        'Even the bravest bulb cannot outshine daylight.'
      ]);
    }
  } else if (item.effect === 'angel_dodge') {
    if (game.battleState) {
      actions.gameStatePatched({ angelWardDodgeCharges: 3 }, 'angelWardChargesApplied');
      setBattleMessage(`Used ${item.name}! 50% dodge chance for the next 3 enemy attacks!`, 'itemAngelWardMessage');
    } else {
      startDialogue([
        `Failed to use ${item.name}!`,
        'The Black Angel whispers: I\'m sorry but you\'re not ready for this power.'
      ]);
    }
  } else if (item.effect === 'heroBonus') {
    // Permanent stat boost
    actions.playerPatched({
      attack: game.player.attack + 10,
      defense: game.player.defense + 10,
      magic: game.player.magic + 10,
      strength: (game.player.strength || 0) + 10,
      intellect: (game.player.intellect || 0) + 10,
      agility: (game.player.agility || 0) + 10,
      vitality: (game.player.vitality || 0) + 10,
      spirit: (game.player.spirit || 0) + 10,
      luck: (game.player.luck || 0) + 10,
      maxHp: game.player.maxHp + 50,
      hp: game.player.hp + 50,
      maxMp: game.player.maxMp + 30,
      mp: game.player.mp + 30
    }, 'itemHeroBonusApplied');
    if (game.battleState) {
      setBattleMessage(`Used ${item.name}! All stats permanently increased!`, 'itemHeroBonusMessage');
    }
  } else {
    if (game.battleState) {
      setBattleMessage(`Failed to use ${item.name}! It stares back at you... ominously.`, 'itemUnknownEffectMessage');
    } else {
      startDialogue([
        `Failed to use ${item.name}!`,
        'It stares back at you... ominously.'
      ]);
    }
  }
}

export function enemyTurn() {
  // Reduce defense boost duration
  if (game.battleState.boostTurnsLeft > 0) {
    const nextBoostTurnsLeft = game.battleState.boostTurnsLeft - 1;
    actions.battleStatePatched({
      boostTurnsLeft: nextBoostTurnsLeft,
      defenseBoost: nextBoostTurnsLeft === 0 ? 0 : game.battleState.defenseBoost
    }, 'battleDefenseBoostTick');
  }
  
  // Reduce active buff duration
  if (game.activeBuff && game.activeBuff.turnsLeft > 0) {
    game.activeBuff.turnsLeft--;
    if (game.activeBuff.turnsLeft === 0) {
      actions.gameStatePatched({ activeBuff: null }, 'activeBuffExpired');
    }
  }

  if (game.angelWardDodgeCharges > 0) {
    actions.gameStatePatched({ angelWardDodgeCharges: game.angelWardDodgeCharges - 1 }, 'angelWardChargesTick');
    if (Math.random() < 0.5) {
      actions.battleStatePatched({
        message: `Angel Ward flares! You dodge the attack! (${game.angelWardDodgeCharges} ward left)`,
        animating: true
      }, 'angelWardDodgeMessage');

      setTimeout(() => {
        actions.battleStatePatched({ animating: false, message: 'What will you do?' }, 'angelWardDodgeReset');
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
      actions.playerPatched({ mp: Math.max(0, game.player.mp - enemy.specialAttack.drainAmount) }, 'enemyDrainMpApplied');
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
  
  actions.playerPatched({ hp: game.player.hp - damage }, 'enemyDamageApplied');
  actions.battleStatePatched({
    message: `${enemy.name} used ${attackName}! ${damage} damage!`,
    animating: true
  }, 'enemyAttackMessage');
  
  setTimeout(() => {
    actions.battleStatePatched({ animating: false }, 'enemyAttackAnimationFinished');
    if (game.player.hp <= 0) {
      gameOver();
    } else {
      setBattleMessage('What will you do?', 'enemyTurnPrompt');
    }
  }, 1000);
}

export function victoryBattle() {
  const exp = game.battleState.enemy.exp;
  const gold = game.battleState.enemy.gold;
  actions.playerPatched({ gold: game.player.gold + gold }, 'battleGoldAwarded');
  
  // Update quest progress for enemy defeats
  updateQuestProgress('defeat_enemy', game.battleState.enemy.name);
  updateQuestProgress('collect_gold', game.player.gold);

  if (game.battleState.enemy.name === 'Cave Sovereign' && !game.caveSovereignDefeated) {
    actions.gameStatePatched({ caveSovereignDefeated: true }, 'caveSovereignDefeatedInBattle');
    completeCaveDefeatQuests();
    appendBattleMessage(' The caves fall silent.', 'battleSovereignSilenceMessage');
  }
  
  const isSovereign = game.battleState.enemy.name === 'Cave Sovereign';
  if (isSovereign) {
    setBattleMessage('Sovereign: The cave... grows still. You: Rest now. Victory is ours.', 'battleSovereignVictoryMessage');
  } else {
    setBattleMessage(`Victory! Gained ${exp} EXP and $${gold}!`, 'battleVictoryMessage');
  }
  
  // Add experience and handle level ups
  const levelUpMessages = addExperience(exp);
  if (levelUpMessages.length > 0) {
    appendBattleMessage(` *** ${levelUpMessages.join(' | ')} ***`, 'battleLevelUpSummaryAppended');
  }
  
  // Apply post-battle regeneration skills
  let regenMessage = '';
  
  if (game.skills.includes('Regenerate')) {
    const hpRegen = Math.floor(game.player.maxHp * 0.1);
    actions.playerPatched({ hp: Math.min(game.player.maxHp, game.player.hp + hpRegen) }, 'battleRegenerateApplied');
    regenMessage += ` Regenerate: +${hpRegen} HP!`;
  }
  
  if (game.skills.includes('Meditation')) {
    const mpRegen = Math.floor(game.player.maxMp * 0.15);
    actions.playerPatched({ mp: Math.min(game.player.maxMp, game.player.mp + mpRegen) }, 'battleMeditationApplied');
    regenMessage += ` Meditation: +${mpRegen} MP!`;
  }
  
  if (regenMessage) {
    appendBattleMessage(regenMessage, 'battleRegenSummaryAppended');
  }

  if (isSovereign) {
    appendBattleMessage(` Victory! Gained ${exp} EXP and $${gold}!`, 'battleSovereignRewardAppended');
  }

  let lootGiven = false;
  const bossLootTable = caveBossLootTables[game.map];
  if (game.battleState.enemy.isBoss && bossLootTable && Math.random() < bossLootTable.chance) {
    const lootName = bossLootTable.items[Math.floor(Math.random() * bossLootTable.items.length)];
    const lootItem = consumableItems.find(item => item.name === lootName);
    if (lootItem) {
      addConsumable(lootItem);
      appendBattleMessage(` Loot: ${lootItem.name}!`, 'battleBossLootAppended');
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
        appendBattleMessage(` Loot: ${lootItem.name}!`, 'battleLootAppended');
      }
    }
  }
  
  setTimeout(() => {
    actions.battleEnded('explore');
  }, 2500);
}

export function gameOver() {
  actions.battleEnded('gameOver');
}

