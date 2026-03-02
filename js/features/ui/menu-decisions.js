import { game } from '../../game-state.js';
import { maps } from '../../maps.js';
import { questDatabase } from '../quests/ui.js';
import { getSaveCount, getSaveSlots, MAX_LOCAL_SAVES } from '../../save.js';
import { getExpForNextLevel } from '../../leveling.js';

const MAX_IN_PROGRESS_SHOWN = 1;
const MAX_COMPLETED_SHOWN = 3;

const MAP_AREAS = [
  { map: 'kinnick_stadium', label: 'KIN', x: 82, y: 62, color: 'yellow', textColor: 'black' },
  { map: 'pentacrest', label: 'PEN', x: 82, y: 78, color: 'green', textColor: 'black' },
  { map: 'library', label: 'LIB', x: 124, y: 78, color: 'brown', textColor: 'white' },
  { map: 'city_park', label: 'PRK', x: 40, y: 94, color: 'lightBlue', textColor: 'black' },
  { map: 'city_park_pool', label: 'POL', x: 40, y: 110, color: 'blue', textColor: 'white' },
  { map: 'downtown', label: 'DWT', x: 82, y: 94, color: 'gray', textColor: 'white' },
  { map: 'deadwood', label: 'DED', x: 124, y: 94, color: 'orange', textColor: 'black' },
  { map: 'ped_mall', label: 'PED', x: 166, y: 94, color: 'lightGray', textColor: 'black' },
  { map: 'northside', label: 'NOR', x: 82, y: 110, color: 'red', textColor: 'white' },
  { map: 'oakland_cemetery', label: 'CEM', x: 124, y: 110, color: 'darkGray', textColor: 'white' },
  { map: 'old_capitol', label: 'CAP', x: 166, y: 110, color: 'white', textColor: 'black' },
  { map: 'coralville_lake', label: 'LAK', x: 166, y: 126, color: 'blue', textColor: 'white' },
  { map: 'beer_caves', label: 'CVE', x: 82, y: 126, color: 'purple', textColor: 'white' }
];

const MAP_LINKS = [
  ['city_park', 'downtown'],
  ['city_park', 'city_park_pool'],
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

function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function getMainMissionProgress() {
  const mainMission = game.quests.find(q => q.id === 'corruption_source');
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

  return {
    lines: [
      { done: caveBossDone, text: 'Beat Cave Sovereign' },
      { done: levelGateDone, text: 'Reach Level 10' },
      { done: finalBossDone, text: 'Beat Corrupted Admin' }
    ],
    hint: caveBossDone && levelGateDone ? 'Final boss unlocked' : 'Need top 2 to unlock final boss'
  };
}

export function getQuestTabModel() {
  const inProgress = game.quests.filter(q => q.status === 'active');
  const completed = game.quests.filter(q => q.status === 'completed');

  const inProgressPages = Math.max(1, Math.ceil(inProgress.length / MAX_IN_PROGRESS_SHOWN));
  const completedPages = Math.max(1, Math.ceil(completed.length / MAX_COMPLETED_SHOWN));

  const inProgressPage = clamp(game.questInProgressPage, 0, inProgressPages - 1);
  const completedPage = clamp(game.questCompletedPage, 0, completedPages - 1);

  const inProgressStart = inProgressPage * MAX_IN_PROGRESS_SHOWN;
  const completedStart = completedPage * MAX_COMPLETED_SHOWN;

  const inProgressItems = inProgress
    .slice(inProgressStart, inProgressStart + MAX_IN_PROGRESS_SHOWN)
    .map((quest) => {
      const questData = questDatabase[quest.id];
      if (!questData) {
        return null;
      }

      return {
        name: questData.name,
        description: questData.description
      };
    })
    .filter(Boolean);

  const completedItems = completed
    .slice(completedStart, completedStart + MAX_COMPLETED_SHOWN)
    .map((quest) => {
      const questData = questDatabase[quest.id];
      if (!questData) {
        return null;
      }

      return {
        name: questData.name
      };
    })
    .filter(Boolean);

  return {
    mainMission: getMainMissionProgress(),
    inProgress: {
      totalCount: inProgress.length,
      pageDisplay: inProgress.length === 0 ? '0/0' : `${inProgressPage + 1}/${inProgressPages}`,
      selected: game.questMenuSection === 0,
      items: inProgressItems
    },
    completed: {
      totalCount: completed.length,
      pageDisplay: completed.length === 0 ? '0/0' : `${completedPage + 1}/${completedPages}`,
      selected: game.questMenuSection === 1,
      items: completedItems
    }
  };
}

export function getMapTabModel() {
  const currentMapKey = game.map.indexOf('beer_caves_depths_') === 0 ? 'beer_caves' : game.map;

  const areas = MAP_AREAS.map((area) => ({
    map: area.map,
    label: area.label,
    x: area.x,
    y: area.y,
    color: area.color,
    textColor: area.textColor,
    isCurrent: currentMapKey === area.map
  }));

  const areaByMap = Object.create(null);
  areas.forEach((area) => {
    areaByMap[area.map] = area;
  });

  const links = MAP_LINKS
    .map(([fromMap, toMap]) => {
      const from = areaByMap[fromMap];
      const to = areaByMap[toMap];
      if (!from || !to) {
        return null;
      }

      return {
        fromX: from.x + 10,
        fromY: from.y + 6,
        toX: to.x + 10,
        toY: to.y + 6
      };
    })
    .filter(Boolean);

  const currentLocationName = maps[currentMapKey]?.name || 'Unknown';

  return {
    title: 'IOWA CITY MAP',
    areas,
    links,
    locationText: `Your Location: ${currentLocationName}`
  };
}

export function getStatsTabModel() {
  const expFloor = game.player.level <= 1 ? 0 : getExpForNextLevel(game.player.level - 1);
  const expAccumulatedTotal = Math.max(game.player.exp, expFloor);
  const expNextLevelTotal = game.player.level >= 50
    ? expAccumulatedTotal
    : getExpForNextLevel(game.player.level);

  return {
    title: 'CHARACTER',
    lines: [
      { text: `Name: ${game.player.name}`, x: 30, y: 72 },
      { text: `Level: ${game.player.level}`, x: 30, y: 82 },
      { text: `HP: ${game.player.hp}/${game.player.maxHp}`, x: 30, y: 92 },
      { text: `MP: ${game.player.mp}/${game.player.maxMp}`, x: 30, y: 102 },
      { text: `Attack: ${game.player.attack}`, x: 30, y: 112 },
      { text: `Magic: ${game.player.magic}`, x: 130, y: 112 },
      { text: `Defense: ${game.player.defense}`, x: 30, y: 122 },
      { text: `EXP: ${expAccumulatedTotal}/${expNextLevelTotal}`, x: 30, y: 132 },
      { text: `Gold: $${game.player.gold}`, x: 30, y: 142 }
    ],
    skills: game.skills.slice(0, 2),
    spells: game.spells.slice(0, 2)
  };
}

export function getItemsTabModel(formatButtonLabel = (label) => label) {
  const items = game.consumables.map((item, index) => ({
    name: item.name,
    description: item.description,
    countText: item.count && item.count > 1 ? ` (x${item.count})` : '',
    selected: index === game.itemMenuSelection,
    y: 75 + index * 15
  }));

  return {
    title: 'ITEMS:',
    hasItems: items.length > 0,
    items,
    emptyText: 'No items',
    useHint: formatButtonLabel('Use item')
  };
}

export function getSaveTabModel() {
  const saveCount = getSaveCount();
  const saveExists = saveCount > 0;
  const saveActions = [
    { label: 'Save Game', enabled: true, selected: game.menuSelection === 0 },
    { label: 'Load Game', enabled: saveExists, selected: game.menuSelection === 1 },
    { label: 'Delete Save', enabled: saveExists, selected: game.menuSelection === 2 }
  ];

  const slots = getSaveSlots().map((slot, index) => ({
    index,
    occupied: !!slot.occupied,
    label: slot.label,
    selected: game.saveSlotSelection === index,
    rowTop: 82 + index * 18,
    y: 93 + index * 18
  }));

  const actionName = game.saveMenuAction ? game.saveMenuAction.toUpperCase() : 'SAVE';

  return {
    title: 'SAVE DATA',
    countText: `${saveCount}/${MAX_LOCAL_SAVES} saves`,
    mode: game.saveMenuMode,
    actionName,
    actions: saveActions,
    slots
  };
}

export function getSettingsTabModel() {
  const sliderX = 166;
  const sliderY = 88;
  const sliderW = 36;
  const sliderH = 14;
  const knobSize = 10;
  const knobY = sliderY + 2;
  const knobX = game.musicEnabled ? (sliderX + sliderW - knobSize - 2) : (sliderX + 2);

  return {
    title: 'SETTINGS',
    selectedIndex: game.settingsSelection,
    musicLabel: 'MUSIC',
    musicEnabled: !!game.musicEnabled,
    graphicsLabel: 'GRAPHICS',
    graphicsValue: game.graphicsQuality === 'high' ? 'HIGH' : 'LOW',
    slider: {
      x: sliderX,
      y: sliderY,
      width: sliderW,
      height: sliderH,
      knobX,
      knobY,
      knobSize
    },
    hint: 'UP/DOWN + SPACE'
  };
}