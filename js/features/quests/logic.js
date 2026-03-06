// Quest Management & NPC Module
import { game, addConsumable, actions } from '../../game-state.js';
import { questDatabase } from './quests.js';
import { consumableItems } from '../../data.js';
import { maps } from '../../maps.js';
import { startDialogue } from '../../dialogue.js';
import { addExperience } from '../../leveling.js';
import { CAVE_MAPS } from '../../constants.js';

const LEGEND_VISITOR_NAME = 'Digable';
const SWAGGER_RELIC_NAME = 'Swagger Sigil';

const LEGEND_ADVICE_DIALOGUE = [
  [
    'A local legend says the Black Angel listens when the city gets quiet.',
    'If you stand still long enough in Oakland Cemetery, you can feel it.',
    'Iowa City always rewards patient explorers.'
  ],
  [
    'Downtown at dusk has stories in every alley and food cart line.',
    'Talk to everyone. People here hide good advice in plain sight.',
    'The best routes are learned one block at a time.'
  ],
  [
    'The river carries old campus myths from one side of town to the other.',
    'When things feel overwhelming, the Pentacrest usually has your next clue.',
    'Trust your curiosity.'
  ],
  [
    'Kinnick roars, the Ped Mall hums, and the caves whisper.',
    'Every corner of Iowa City has a different kind of courage test.',
    'Keep moving and keep listening.'
  ]
];

function hasConsumable(itemName) {
  return game.consumables.some(item => item.name === itemName);
}

function clearLegendVisitor(nextSpawnDelayMs = 18000) {
  actions.gameStatePatched({
    legendVisitor: {
      active: false,
      map: null,
      x: 0,
      y: 0
    },
    legendVisitorNextSpawnAt: Date.now() + nextSpawnDelayMs
  }, 'legendVisitorCleared');
}

export function hasCompletedAllKnownQuests() {
  const questIds = Object.keys(questDatabase);
  if (questIds.length === 0) return false;

  return questIds.every(questId =>
    game.quests.some(activeQuest => activeQuest.id === questId && activeQuest.status === 'completed')
  );
}

export function maybeSpawnLegendVisitor() {
  if (game.state !== 'explore') return;
  if (game.legendVisitor?.active) return;

  if (!game.legendFirstAreaEncountered) {
    const firstSpawnX = Math.max(16, Math.min(240, game.player.x + 16));
    const firstSpawnY = Math.max(32, Math.min(224, game.player.y + 16));

    actions.gameStatePatched({
      legendVisitor: {
        active: true,
        map: game.map,
        x: firstSpawnX,
        y: firstSpawnY
      },
      legendFirstAreaEncountered: true,
      legendVisitorNextSpawnAt: Date.now() + 25000
    }, 'legendVisitorFirstAreaSpawned');
    return;
  }

  const now = Date.now();
  if (now < (game.legendVisitorNextSpawnAt || 0)) return;

  const readyForFinalReward = hasCompletedAllKnownQuests() && !game.legendRewardGiven;
  const spawnChance = readyForFinalReward ? 0.22 : 0.08;

  if (Math.random() >= spawnChance) {
    actions.gameStatePatched({
      legendVisitorNextSpawnAt: now + 5000
    }, 'legendVisitorSpawnMissed');
    return;
  }

  const xOffset = Math.random() < 0.5 ? -16 : 16;
  const yOffset = Math.random() < 0.5 ? -16 : 16;
  const spawnX = Math.max(16, Math.min(240, game.player.x + xOffset));
  const spawnY = Math.max(32, Math.min(224, game.player.y + yOffset));

  actions.gameStatePatched({
    legendVisitor: {
      active: true,
      map: game.map,
      x: spawnX,
      y: spawnY
    },
    legendVisitorNextSpawnAt: now + 25000
  }, 'legendVisitorSpawned');
}

export function getLegendVisitorNpcForCurrentMap() {
  const visitor = game.legendVisitor;
  if (!visitor || !visitor.active || visitor.map !== game.map) {
    return null;
  }

  return {
    x: visitor.x,
    y: visitor.y,
    name: LEGEND_VISITOR_NAME,
    type: 'legend_visitor',
    dialogue: ['A familiar local face appears out of nowhere.']
  };
}

function handleLegendVisitorInteraction() {
  const completedAllQuests = hasCompletedAllKnownQuests();
  const nextSightings = (game.legendVisitorSightings || 0) + 1;

  if (completedAllQuests && !game.legendRewardGiven) {
    const swaggerRelic = consumableItems.find(item => item.name === SWAGGER_RELIC_NAME);
    if (swaggerRelic && !hasConsumable(SWAGGER_RELIC_NAME)) {
      addConsumable(swaggerRelic);
    }

    actions.gameStatePatched({
      legendRewardGiven: true,
      swaggerEquipped: true,
      legendVisitorSightings: nextSightings
    }, 'legendVisitorFinalRewardGranted');

    startDialogue([
      'You found me after finishing everything Iowa City could throw at you.',
      'Take this Swagger Sigil.',
      'Keep it equipped and you can run from any enemy, no matter how dangerous.',
      'You earned this.'
    ], {
      afterDialogue: () => {
        clearLegendVisitor(45000);
      }
    });
    return;
  }

  const adviceSet = LEGEND_ADVICE_DIALOGUE[nextSightings % LEGEND_ADVICE_DIALOGUE.length];
  actions.gameStatePatched({
    legendVisitorSightings: nextSightings
  }, 'legendVisitorAdviceSeen');
  startDialogue(adviceSet, {
    afterDialogue: () => {
      clearLegendVisitor(18000);
    }
  });
}

export function checkNPCInteraction() {
  const legendVisitor = getLegendVisitorNpcForCurrentMap();
  if (legendVisitor) {
    const legendDist = Math.sqrt((game.player.x - legendVisitor.x) ** 2 + (game.player.y - legendVisitor.y) ** 2);
    if (legendDist < 24) {
      updateQuestProgress('talk_to_npc', legendVisitor.name);
      handleLegendVisitorInteraction();
      return legendVisitor;
    }
  }

  const map = maps[game.map];
  for (let npc of map.npcs) {
    const dist = Math.sqrt((game.player.x - npc.x) ** 2 + (game.player.y - npc.y) ** 2);
    if (dist < 24) {
      updateQuestProgress('talk_to_npc', npc.name);
      if (npc.type === 'boss') {
        if (game.caveSovereignDefeated) {
          return null;
        }
        return npc;
      }
      const specialTypes = ['shop', 'healer', 'magic_trainer', 'yoga', 'cambus', 'food_cart', 'black_angel'];
      
      // Check if NPC has a quest
      if (npc.hasQuest) {
        const quest = questDatabase[npc.hasQuest];
        const activeQuest = game.quests.find(q => q.id === quest.id);
        
        if (!activeQuest) {
          // Offer new quest
          startDialogue(quest.dialogue.offer);
          offerQuest(quest.id);
          return npc;
        } else if (activeQuest.status === 'active') {
          // Check if quest can be completed
          if (canCompleteQuest(activeQuest)) {
            startDialogue(quest.dialogue.complete);
            completeQuest(quest.id);
            return npc;
          } else {
            startDialogue(quest.dialogue.progress);
            return npc;
          }
        } else if (activeQuest.status === 'completed') {
          // Quest already done
          startDialogue(npc.dialogue);
          return npc;
        }
      } else if (!npc.type || !specialTypes.includes(npc.type)) {
        startDialogue(npc.dialogue);
      }
      return npc;
    }
  }
  return null;
}

export function offerQuest(questId) {
  const quest = questDatabase[questId];
  game.quests.push({
    id: questId,
    status: 'active',
    objectives: JSON.parse(JSON.stringify(quest.objectives))
  });
}

export function canCompleteQuest(activeQuest) {
  return activeQuest.objectives.every(obj => {
    if (obj.type === 'bring_item') {
      return game.consumables.some(item => item.name === obj.item);
    } else if (obj.type === 'talk_to_npc') {
      return obj.talked;
    } else if (obj.type === 'visit_location') {
      return obj.visited;
    } else if (obj.type === 'defeat_enemy') {
      return obj.count >= obj.needed;
    } else if (obj.type === 'collect_gold') {
      return obj.amount >= obj.needed;
    } else if (obj.type === 'reach_level') {
      return game.player.level >= obj.level;
    } else if (obj.type === 'buy_from_vendor') {
      return obj.bought;
    }
    return false;
  });
}

export function completeQuest(questId) {
  const questIndex = game.quests.findIndex(q => q.id === questId);
  if (questIndex === -1) return;
  
  game.quests[questIndex].status = 'completed';
  const quest = questDatabase[questId];
  const playerPatch = {};
  
  // Remove quest item if needed
  quest.objectives.forEach(obj => {
    if (obj.type === 'bring_item') {
      const itemIndex = game.consumables.findIndex(item => item.name === obj.item);
      if (itemIndex !== -1) {
        game.consumables.splice(itemIndex, 1);
      }
    } else if (obj.type === 'collect_gold') {
      playerPatch.gold = (playerPatch.gold ?? game.player.gold) - obj.needed;
    }
  });
  
  // Build reward message
  const rewardMessages = [];
  
  // Give rewards
  if (quest.rewards.gold) {
    playerPatch.gold = (playerPatch.gold ?? game.player.gold) + quest.rewards.gold;
    rewardMessages.push(`Received ${quest.rewards.gold} gold!`);
  }
  if (quest.rewards.exp) {
    rewardMessages.push(`Gained ${quest.rewards.exp} EXP!`);
  }
  if (quest.rewards.item) {
    const item = consumableItems.find(i => i.name === quest.rewards.item);
    if (item) {
      addConsumable(item);
      rewardMessages.push(`Received ${quest.rewards.item}!`);
    }
  }
  if (quest.rewards.maxHp) {
    playerPatch.maxHp = (playerPatch.maxHp ?? game.player.maxHp) + quest.rewards.maxHp;
    playerPatch.hp = (playerPatch.hp ?? game.player.hp) + quest.rewards.maxHp;
    rewardMessages.push(`Max HP increased by ${quest.rewards.maxHp}!`);
  }
  if (quest.rewards.maxMp) {
    playerPatch.maxMp = (playerPatch.maxMp ?? game.player.maxMp) + quest.rewards.maxMp;
    playerPatch.mp = (playerPatch.mp ?? game.player.mp) + quest.rewards.maxMp;
    rewardMessages.push(`Max MP increased by ${quest.rewards.maxMp}!`);
  }
  if (quest.rewards.spell && !game.spells.includes(quest.rewards.spell)) {
    game.spells.push(quest.rewards.spell);
    rewardMessages.push(`Learned ${quest.rewards.spell}!`);
  }
  if (quest.rewards.skill && !game.skills.includes(quest.rewards.skill)) {
    game.skills.push(quest.rewards.skill);
    rewardMessages.push(`Learned ${quest.rewards.skill}!`);
  }

  if (Object.keys(playerPatch).length > 0) {
    actions.playerPatched(playerPatch, 'questRewardsApplied');
  }

  if (quest.rewards.exp) {
    addExperience(quest.rewards.exp);
  }
  
  // Add reward messages to dialogue
  if (rewardMessages.length > 0 && game.dialogue) {
    game.dialogue.messages.push(...rewardMessages);
  }
}

export function updateQuestProgress(type, value) {
  game.quests.forEach(quest => {
    if (quest.status !== 'active') return;
    
    quest.objectives.forEach(obj => {
      if (obj.type === type) {
        if (type === 'defeat_enemy' && obj.enemy === value) {
          obj.count++;
        } else if (type === 'visit_location' && obj.location === value) {
          obj.visited = true;
        } else if (type === 'collect_gold') {
          obj.amount = game.player.gold;
        } else if (type === 'buy_from_vendor') {
          // Compare vendor names case-insensitively and trimmed
          if (obj.vendor && value && obj.vendor.toString().trim().toLowerCase() === String(value).trim().toLowerCase()) {
            obj.bought = true;
          }
        } else if (type === 'talk_to_npc') {
          if (obj.npc && value && obj.npc.toString().trim().toLowerCase() === String(value).trim().toLowerCase()) {
            obj.talked = true;
          }
        }
      }
    });
  });
}

export function getNearbyNPC() {
  const legendVisitor = getLegendVisitorNpcForCurrentMap();
  if (legendVisitor) {
    const legendDist = Math.sqrt((game.player.x - legendVisitor.x) ** 2 + (game.player.y - legendVisitor.y) ** 2);
    if (legendDist < 24) {
      return legendVisitor;
    }
  }

  const map = maps[game.map];
  for (let npc of map.npcs) {
    const dist = Math.sqrt((game.player.x - npc.x) ** 2 + (game.player.y - npc.y) ** 2);
    if (dist < 24) {
      return npc;
    }
  }
  return null;
}

export function completeCaveDefeatQuests() {
  const caveQuestIds = Object.values(questDatabase)
    .filter(quest => CAVE_MAPS.includes(quest.location))
    .filter(quest => quest.objectives.every(obj => obj.type === 'defeat_enemy'))
    .map(quest => quest.id);

  caveQuestIds.forEach(questId => {
    const quest = questDatabase[questId];
    const existing = game.quests.find(q => q.id === questId);

    if (existing) {
      if (existing.status === 'completed') {
        return;
      }

      existing.objectives = quest.objectives.map(obj => ({
        ...obj,
        count: obj.needed
      }));

      if (existing.status === 'active') {
        completeQuest(questId);
      } else {
        existing.status = 'completed';
      }
      return;
    }

    game.quests.push({
      id: questId,
      status: 'active',
      objectives: quest.objectives.map(obj => ({
        ...obj,
        count: obj.needed
      }))
    });
    completeQuest(questId);
  });
}
