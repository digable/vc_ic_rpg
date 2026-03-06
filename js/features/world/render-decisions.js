import { game } from '../../game-state.js';
import { maps } from '../../maps.js';
import { questDatabase, canCompleteQuest } from '../quests/ui.js';
import { getLegendVisitorNpcForCurrentMap } from '../quests/input.js';

export function getVisibleNpcsForCurrentMap() {
  const map = maps[game.map];
  if (!map || !Array.isArray(map.npcs)) {
    return [];
  }

  const visibleNpcs = map.npcs.filter(npc => !(npc.type === 'boss' && game.caveSovereignDefeated));
  const legendVisitor = getLegendVisitorNpcForCurrentMap();
  if (legendVisitor) {
    visibleNpcs.push(legendVisitor);
  }

  return visibleNpcs;
}

export function getQuestMarkerForNpc(npc) {
  if (!npc || !npc.hasQuest) {
    return null;
  }

  const quest = questDatabase[npc.hasQuest];
  if (!quest) {
    return null;
  }

  const activeQuest = game.quests.find(q => q.id === quest.id);

  if (!activeQuest) {
    return {
      symbol: '!',
      color: 'yellow'
    };
  }

  if (activeQuest.status === 'active' && canCompleteQuest(activeQuest)) {
    return {
      symbol: '?',
      color: 'lightGreen'
    };
  }

  return null;
}
