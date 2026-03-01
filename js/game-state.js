// Game State Management
import { CAVE_MAPS } from './constants.js';

const ACTION_DEBUG_STORAGE_KEY = 'vc_ic_rpg_action_debug';

function readPersistedActionDebugFlag() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(ACTION_DEBUG_STORAGE_KEY) === '1';
    }
  } catch {
    // Ignore storage read errors
  }
  return false;
}

const actionDebug = {
  enabled: readPersistedActionDebugFlag()
};

function logAction(actionName, payload) {
  if (!actionDebug.enabled) return;
  console.log('[state-action]', actionName, payload ?? {});
}

export function setActionDebugEnabled(enabled, persist = false) {
  actionDebug.enabled = !!enabled;
  if (persist) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(ACTION_DEBUG_STORAGE_KEY, actionDebug.enabled ? '1' : '0');
      }
    } catch {
      // Ignore storage write errors
    }
  }
}

export function isActionDebugEnabled() {
  return actionDebug.enabled;
}

export const game = {
  state: 'title', // title, explore, battle, dialogue, menu, shop, magic_trainer, yoga, cambus, food_cart
  player: {
    x: 120,
    y: 120,
    hp: 50,
    maxHp: 50,
    mp: 20,
    maxMp: 20,
    level: 1,
    exp: 0,
    gold: 100,
    name: 'Student',
    class: 'Student',
    facing: 'down',
    attack: 8,
    magic: 5,
    defense: 3
  },
  map: 'downtown',
  inventory: ['Campus ID', 'Bus Pass', 'Coffee'],
  consumables: [{ name: 'Flashlight', price: 0, effect: 'flashlight', description: 'Lights up dark caves. Never used up.' }], // Consumable items inventory
  skills: [],
  spells: [],
  enemyEncounterSteps: 0,
  dialogue: null,
  battleState: null,
  menuOpen: false,
  menuSelection: 0,
  menuTab: 0, // 0=stats, 1=map, 2=items, 3=quests, 4=save
  questMenuSection: 0, // 0=in progress, 1=completed
  questInProgressPage: 0,
  questCompletedPage: 0,
  saveMenuMode: 'actions', // actions, slots
  saveMenuAction: null, // save, load, delete
  saveSlotSelection: 0,
  shopOpen: false,
  shopSelection: 0,
  shopPage: 0, // For pagination
  magicTrainerOpen: false,
  magicTrainerSelection: 0,
  magicTrainerPage: 0, // For pagination
  yogaOpen: false,
  yogaSelection: 0,
  yogaPage: 0, // For pagination
  cambusOpen: false,
  cambusSelection: 0,
  cambusPage: 0, // For pagination
  foodCartOpen: false,
  foodCartSelection: 0,
  foodCartPage: 0, // For pagination
  currentVendor: 'Food Cart Vendor',
  itemMenuOpen: false,
  itemMenuSelection: 0,
  activeBuff: null, // { type: 'attack'/'defense'/'magic', amount: 5, turnsLeft: 3 }
  angelWardDodgeCharges: 0,
  flashlightOn: false,
  caveSovereignDefeated: false,
  caveSovereignIntroSeen: false,
  quests: [], // Active and completed quests
  textBox: null,
  systemMessage: null,
  levelUpDialog: null, // Stores level up info when level up occurs
  musicEnabled: false,
  animFrame: 0
};

// Helper functions for consolidated inventory management
export function addConsumable(item) {
  // Check if item already exists in inventory
  const existingItem = game.consumables.find(c => c.name === item.name);
  
  if (existingItem) {
    // Item exists, increment count
    if (!existingItem.count) {
      existingItem.count = 1; // Initialize count if it doesn't exist
    }
    existingItem.count++;
  } else {
    // New item, add with count of 1
    game.consumables.push({ ...item, count: 1 });
  }
}

export function removeConsumable(index) {
  if (index < 0 || index >= game.consumables.length) return;
  
  const item = game.consumables[index];
  
  // Decrement count
  if (item.count && item.count > 1) {
    item.count--;
  } else {
    // Remove item entirely if count reaches 0 or no count
    game.consumables.splice(index, 1);
  }
}

export const actions = {
  stateChanged(nextState) {
    logAction('stateChanged', { nextState });
    game.state = nextState;
    return game.state;
  },

  gameStatePatched(patch = {}, label = 'gameStatePatched') {
    const keys = Object.keys(patch);
    logAction(label, { keys });
    Object.assign(game, patch);
    return game;
  },

  playerPatched(patch = {}, label = 'playerPatched') {
    const keys = Object.keys(patch);
    logAction(label, { keys });
    Object.assign(game.player, patch);
    return game.player;
  },

  battleStatePatched(patch = {}, label = 'battleStatePatched') {
    if (!game.battleState) {
      logAction(label, { keys: [], skipped: 'noBattleState' });
      return null;
    }
    const keys = Object.keys(patch);
    logAction(label, { keys });
    Object.assign(game.battleState, patch);
    return game.battleState;
  },

  currentVendorSet(vendor) {
    logAction('currentVendorSet', { vendor });
    game.currentVendor = vendor;
    return game.currentVendor;
  },

  systemMessageShown(text, expiresAt = Date.now() + 1800) {
    logAction('systemMessageShown', { text, expiresAt });
    game.systemMessage = {
      text,
      expiresAt
    };
    return game.systemMessage;
  },

  levelUpDialogSet(levelUpDialog) {
    logAction('levelUpDialogSet', { hasDialog: !!levelUpDialog });
    game.levelUpDialog = levelUpDialog;
    return game.levelUpDialog;
  },

  battleStarted(enemy) {
    logAction('battleStarted', { enemyName: enemy?.name });
    game.state = 'battle';
    game.battleState = {
      enemy,
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
  },

  battleEnded(nextState = 'explore') {
    logAction('battleEnded', { nextState });
    game.state = nextState;
    game.battleState = null;
  },

  mapChanged({
    toMap,
    toX = game.player.x,
    toY = game.player.y,
    resetEncounterSteps = true,
    clearFlashlightMode = 'none'
  }) {
    logAction('mapChanged', { toMap, toX, toY, resetEncounterSteps, clearFlashlightMode });
    const fromMap = game.map;

    game.map = toMap;
    game.player.x = toX;
    game.player.y = toY;

    if (resetEncounterSteps) {
      game.enemyEncounterSteps = 0;
    }

    if (
      clearFlashlightMode === 'leaveCaves' &&
      CAVE_MAPS.includes(fromMap) &&
      !CAVE_MAPS.includes(toMap)
    ) {
      game.flashlightOn = false;
    }

    if (clearFlashlightMode === 'nonCaveDestination' && !CAVE_MAPS.includes(toMap)) {
      game.flashlightOn = false;
    }
  },

  musicToggled(value) {
    logAction('musicToggled', { value });
    if (typeof value === 'boolean') {
      game.musicEnabled = value;
    } else {
      game.musicEnabled = !game.musicEnabled;
    }
    return game.musicEnabled;
  },

  menuToggled(value) {
    logAction('menuToggled', { value });
    if (typeof value === 'boolean') {
      game.menuOpen = value;
    } else {
      game.menuOpen = !game.menuOpen;
    }
    return game.menuOpen;
  },

  dialogueStarted(dialogue, options = {}) {
    logAction('dialogueStarted', { messageCount: Array.isArray(dialogue) ? dialogue.length : 1, type: options.type });
    const messages = Array.isArray(dialogue) ? dialogue : [dialogue];
    game.state = 'dialogue';
    game.dialogue = {
      messages,
      currentIndex: 0,
      ...options
    };
  },

  dialogueCleared() {
    logAction('dialogueCleared');
    game.dialogue = null;
  },

  systemMessageCleared() {
    logAction('systemMessageCleared');
    game.systemMessage = null;
  },

  vendorScreenOpened(state, openFlag, extraState = {}) {
    logAction('vendorScreenOpened', { state, openFlag });
    game.state = state;
    game[openFlag] = true;
    Object.assign(game, extraState);
  },

  vendorScreenClosed(openFlag, resetState = {}, nextState = 'explore') {
    logAction('vendorScreenClosed', { openFlag, nextState });
    game.state = nextState;
    game[openFlag] = false;
    Object.assign(game, resetState);
  }
};

export function resetGameState() {
  game.state = 'title';
  game.player = {
    x: 120,
    y: 120,
    hp: 50,
    maxHp: 50,
    mp: 20,
    maxMp: 20,
    level: 1,
    exp: 0,
    gold: 100,
    name: 'Student',
    class: 'Student',
    facing: 'down',
    attack: 8,
    magic: 5,
    defense: 3
  };
  game.map = 'downtown';
  game.inventory = ['Campus ID', 'Bus Pass', 'Coffee'];
  game.consumables = [{ name: 'Flashlight', price: 0, effect: 'flashlight', description: 'Lights up dark caves. Never used up.' }];
  game.skills = [];
  game.spells = [];
  game.enemyEncounterSteps = 0;
  game.dialogue = null;
  game.battleState = null;
  game.menuOpen = false;
  game.menuSelection = 0;
  game.menuTab = 0;
  game.questMenuSection = 0;
  game.questInProgressPage = 0;
  game.questCompletedPage = 0;
  game.saveMenuMode = 'actions';
  game.saveMenuAction = null;
  game.saveSlotSelection = 0;
  game.shopOpen = false;
  game.shopSelection = 0;
  game.shopPage = 0;
  game.magicTrainerOpen = false;
  game.magicTrainerSelection = 0;
  game.magicTrainerPage = 0;
  game.yogaOpen = false;
  game.yogaSelection = 0;
  game.yogaPage = 0;
  game.cambusOpen = false;
  game.cambusSelection = 0;
  game.cambusPage = 0;
  game.foodCartOpen = false;
  game.foodCartSelection = 0;
  game.foodCartPage = 0;
  game.currentVendor = 'Food Cart Vendor';
  game.itemMenuOpen = false;
  game.itemMenuSelection = 0;
  game.activeBuff = null;
  game.angelWardDodgeCharges = 0;
  game.flashlightOn = false;
  game.caveSovereignDefeated = false;
  game.caveSovereignIntroSeen = false;
  game.quests = [];
  game.textBox = null;
  game.systemMessage = null;
  game.levelUpDialog = null;
  game.musicEnabled = false;
  game.animFrame = 0;
  
  // Show title screen by removing hidden class
  const titleScreen = document.getElementById('title-screen');
  if (titleScreen) {
    titleScreen.classList.remove('hidden');
  }
  
  // Scroll viewport back to top
  window.scrollTo(0, 0);
}
