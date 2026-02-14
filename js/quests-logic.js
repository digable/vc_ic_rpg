// Quest Management & NPC Module
import { game } from './game-state.js';
import { questDatabase } from './quests.js';
import { consumableItems } from './data.js';
import { maps } from './maps.js';
import { startDialogue } from './dialogue.js';

export function checkNPCInteraction() {
  const map = maps[game.map];
  for (let npc of map.npcs) {
    const dist = Math.sqrt((game.player.x - npc.x) ** 2 + (game.player.y - npc.y) ** 2);
    if (dist < 24) {
      const specialTypes = ['shop', 'healer', 'magic_trainer', 'yoga', 'cambus', 'food_cart'];
      
      // Check if NPC has a quest
      if (npc.hasQuest) {
        const quest = questDatabase[npc.hasQuest];
        const activeQuest = game.quests.find(q => q.id === quest.id);
        
        if (!activeQuest) {
          // Offer new quest
          startDialogue(quest.dialogue.offer);
          game.state = 'dialogue';
          offerQuest(quest.id);
          return npc;
        } else if (activeQuest.status === 'active') {
          // Check if quest can be completed
          if (canCompleteQuest(activeQuest)) {
            startDialogue(quest.dialogue.complete);
            game.state = 'dialogue';
            completeQuest(quest.id);
            return npc;
          } else {
            startDialogue(quest.dialogue.progress);
            game.state = 'dialogue';
            return npc;
          }
        } else if (activeQuest.status === 'completed') {
          // Quest already done
          startDialogue(npc.dialogue);
          game.state = 'dialogue';
          return npc;
        }
      } else if (!npc.type || !specialTypes.includes(npc.type)) {
        startDialogue(npc.dialogue);
        game.state = 'dialogue';
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
  
  // Remove quest item if needed
  quest.objectives.forEach(obj => {
    if (obj.type === 'bring_item') {
      const itemIndex = game.consumables.findIndex(item => item.name === obj.item);
      if (itemIndex !== -1) {
        game.consumables.splice(itemIndex, 1);
      }
    } else if (obj.type === 'collect_gold') {
      game.player.gold -= obj.needed;
    }
  });
  
  // Build reward message
  const rewardMessages = [];
  
  // Give rewards
  if (quest.rewards.gold) {
    game.player.gold += quest.rewards.gold;
    rewardMessages.push(`Received ${quest.rewards.gold} gold!`);
  }
  if (quest.rewards.exp) {
    game.player.exp += quest.rewards.exp;
    rewardMessages.push(`Gained ${quest.rewards.exp} EXP!`);
  }
  if (quest.rewards.item) {
    const item = consumableItems.find(i => i.name === quest.rewards.item);
    if (item) {
      game.consumables.push(item);
      rewardMessages.push(`Received ${quest.rewards.item}!`);
    }
  }
  if (quest.rewards.maxHp) {
    game.player.maxHp += quest.rewards.maxHp;
    game.player.hp += quest.rewards.maxHp;
    rewardMessages.push(`Max HP increased by ${quest.rewards.maxHp}!`);
  }
  if (quest.rewards.maxMp) {
    game.player.maxMp += quest.rewards.maxMp;
    game.player.mp += quest.rewards.maxMp;
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
        } else if (type === 'buy_from_vendor' && obj.vendor === value) {
          obj.bought = true;
        }
      }
    });
  });
}

export function getNearbyNPC() {
  const map = maps[game.map];
  for (let npc of map.npcs) {
    const dist = Math.sqrt((game.player.x - npc.x) ** 2 + (game.player.y - npc.y) ** 2);
    if (dist < 24) {
      return npc;
    }
  }
  return null;
}
