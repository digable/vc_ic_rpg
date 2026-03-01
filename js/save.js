import { game, actions } from './game-state.js';
import { travelToMapDestination } from './features/world/map-transition-service.js';
import { getExpForNextLevel } from './leveling.js';

const SAVE_KEY = 'vc_ic_rpg_saves_v2';
const LEGACY_SAVE_KEY = 'vc_ic_rpg_save_v1';
export const MAX_LOCAL_SAVES = 3;

function hideTitleScreen() {
  const titleScreen = document.getElementById('title-screen');
  if (titleScreen) {
    titleScreen.classList.add('hidden');
  }
}

function resetTransientState() {
  actions.battleEnded('explore');
  actions.dialogueCleared();
  actions.menuToggled(false);
  actions.gameStatePatched({
    menuSelection: 0,
    menuTab: 0,
    shopOpen: false,
    shopSelection: 0,
    shopPage: 0,
    magicTrainerOpen: false,
    magicTrainerSelection: 0,
    magicTrainerPage: 0,
    yogaOpen: false,
    yogaSelection: 0,
    yogaPage: 0,
    cambusOpen: false,
    cambusSelection: 0,
    cambusPage: 0,
    foodCartOpen: false,
    foodCartSelection: 0,
    foodCartPage: 0,
    itemMenuOpen: false,
    itemMenuSelection: 0,
    textBox: null,
    levelUpDialog: null,
    pendingLevelUp: null
  }, 'transientStateReset');
}

function isValidSaveEntry(entry) {
  const data = entry?.data || entry;
  return !!(data && data.player && data.map);
}

function makeEmptySlots() {
  return Array.from({ length: MAX_LOCAL_SAVES }, () => null);
}

function normalizeSlots(input) {
  const slots = makeEmptySlots();
  if (!Array.isArray(input)) return slots;

  for (let index = 0; index < MAX_LOCAL_SAVES; index++) {
    const entry = input[index];
    if (entry && isValidSaveEntry(entry)) {
      slots[index] = entry;
    }
  }

  return slots;
}

function readRawSaves() {
  try {
    const currentRaw = window.localStorage.getItem(SAVE_KEY);
    if (currentRaw) {
      const parsed = JSON.parse(currentRaw);
      if (Array.isArray(parsed)) {
        return normalizeSlots(parsed);
      }
    }

    const legacyRaw = window.localStorage.getItem(LEGACY_SAVE_KEY);
    if (!legacyRaw) return makeEmptySlots();
    const legacyParsed = JSON.parse(legacyRaw);
    if (!isValidSaveEntry(legacyParsed)) return makeEmptySlots();

    const migrated = makeEmptySlots();
    migrated[0] = legacyParsed;
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(migrated));
    window.localStorage.removeItem(LEGACY_SAVE_KEY);
    return migrated;
  } catch {
    return makeEmptySlots();
  }
}

function writeRawSaves(saves) {
  const normalized = normalizeSlots(saves);

  const hasAny = normalized.some(slot => !!slot);
  if (!hasAny) {
    window.localStorage.removeItem(SAVE_KEY);
    return;
  }

  window.localStorage.setItem(SAVE_KEY, JSON.stringify(normalized));
}

function buildSaveData() {
  return {
    player: game.player,
    map: game.map,
    inventory: game.inventory,
    consumables: game.consumables,
    skills: game.skills,
    spells: game.spells,
    enemyEncounterSteps: game.enemyEncounterSteps,
    activeBuff: game.activeBuff,
    angelWardDodgeCharges: game.angelWardDodgeCharges,
    flashlightOn: game.flashlightOn,
    caveSovereignDefeated: game.caveSovereignDefeated,
    caveSovereignIntroSeen: game.caveSovereignIntroSeen,
    quests: game.quests,
    currentVendor: game.currentVendor,
    animFrame: game.animFrame,
    settings: {
      musicEnabled: !!game.musicEnabled
    }
  };
}

function getDefaultSettings() {
  return {
    musicEnabled: false
  };
}

function normalizeLoadedSettings(data) {
  const defaults = getDefaultSettings();
  const rawSettings = data && typeof data.settings === 'object' && data.settings !== null
    ? data.settings
    : {};

  return {
    ...defaults,
    ...rawSettings,
    musicEnabled: typeof rawSettings.musicEnabled === 'boolean'
      ? rawSettings.musicEnabled
      : (typeof data?.musicEnabled === 'boolean' ? data.musicEnabled : defaults.musicEnabled)
  };
}

function normalizeLoadedPlayerExp(playerData) {
  if (!playerData || typeof playerData.level !== 'number' || typeof playerData.exp !== 'number') {
    return playerData;
  }

  const level = Math.max(1, Math.floor(playerData.level));
  const expFloor = level <= 1 ? 0 : getExpForNextLevel(level - 1);
  return {
    ...playerData,
    exp: Math.max(playerData.exp, expFloor)
  };
}

export function hasSaveData() {
  return getSaveCount() > 0;
}

export function getSaveCount() {
  return readRawSaves().filter(slot => !!slot).length;
}

export function getSaveSlots() {
  const slots = readRawSaves();
  return slots.map((slot, index) => {
    if (!slot) {
      return {
        index,
        occupied: false,
        label: 'Empty'
      };
    }

    const data = slot.data || slot;
    const playerClass = data?.player?.class || data?.player?.name || 'Player';
    const playerLevel = data?.player?.level || 1;
    return {
      index,
      occupied: true,
      label: `${playerClass} Lv.${playerLevel}`
    };
  });
}

export function saveGameToLocal(slotIndex = null) {
  try {
    const saves = readRawSaves();

    let resolvedSlot = slotIndex;
    if (typeof resolvedSlot !== 'number') {
      resolvedSlot = saves.findIndex(slot => !slot);
      if (resolvedSlot === -1) {
        return { success: false, reason: 'max_saves', count: getSaveCount() };
      }
    }

    if (resolvedSlot < 0 || resolvedSlot >= MAX_LOCAL_SAVES) {
      return { success: false, reason: 'invalid_slot', count: getSaveCount() };
    }

    const payload = {
      version: 1,
      savedAt: Date.now(),
      data: buildSaveData()
    };

    saves[resolvedSlot] = payload;
    writeRawSaves(saves);
    return { success: true, count: getSaveCount(), slot: resolvedSlot };
  } catch (error) {
    console.warn('Failed to save game locally:', error);
    return { success: false, reason: 'error' };
  }
}

export function loadGameFromLocal(index = null) {
  try {
    const saves = readRawSaves();
    if (saves.every(slot => !slot)) return { success: false, reason: 'no_saves' };

    let resolvedIndex = index;
    if (typeof resolvedIndex !== 'number') {
      resolvedIndex = saves.findIndex(slot => !!slot);
    }

    const selected = saves[resolvedIndex];
    if (!selected) return { success: false, reason: 'invalid_slot' };

    const data = selected?.data || selected;
    if (!data || !data.player || !data.map) {
      return { success: false, reason: 'invalid_data' };
    }

    actions.gameStatePatched({ player: { ...game.player, ...normalizeLoadedPlayerExp(data.player) } }, 'playerHydratedFromSave');
    travelToMapDestination({
      toMap: data.map,
      toX: game.player.x,
      toY: game.player.y,
      resetEncounterSteps: false,
      clearFlashlightMode: 'none'
    });
    actions.gameStatePatched({
      inventory: Array.isArray(data.inventory) ? [...data.inventory] : [...game.inventory],
      consumables: Array.isArray(data.consumables) ? [...data.consumables] : [...game.consumables],
      skills: Array.isArray(data.skills) ? [...data.skills] : [...game.skills],
      spells: Array.isArray(data.spells) ? [...data.spells] : [...game.spells],
      enemyEncounterSteps: typeof data.enemyEncounterSteps === 'number' ? data.enemyEncounterSteps : 0,
      activeBuff: data.activeBuff || null,
      angelWardDodgeCharges: typeof data.angelWardDodgeCharges === 'number' ? data.angelWardDodgeCharges : 0,
      flashlightOn: !!data.flashlightOn,
      caveSovereignDefeated: !!data.caveSovereignDefeated,
      caveSovereignIntroSeen: !!data.caveSovereignIntroSeen,
      quests: Array.isArray(data.quests) ? [...data.quests] : [],
      currentVendor: data.currentVendor || 'Food Cart Vendor',
      animFrame: typeof data.animFrame === 'number' ? data.animFrame : 0
    }, 'saveDataHydrated');
    const settings = normalizeLoadedSettings(data);
    actions.musicToggled(settings.musicEnabled);

    if (!data.settings || typeof data.settings !== 'object' || typeof data.settings.musicEnabled !== 'boolean') {
      const updatedEntry = {
        ...(selected || {}),
        version: Math.max(2, selected?.version || 1),
        data: {
          ...data,
          settings
        }
      };
      saves[resolvedIndex] = updatedEntry;
      writeRawSaves(saves);
    }

    resetTransientState();
    hideTitleScreen();
    return { success: true, savedAt: selected.savedAt || null, slot: resolvedIndex };
  } catch (error) {
    console.warn('Failed to load game locally:', error);
    return { success: false, reason: 'error' };
  }
}

export function clearLocalSave(index = 0) {
  try {
    const saves = readRawSaves();
    if (saves.every(slot => !slot)) {
      return { success: false, reason: 'no_saves', count: 0 };
    }

    if (index < 0 || index >= saves.length) {
      return { success: false, reason: 'invalid_slot', count: saves.length };
    }

    saves[index] = null;
    writeRawSaves(saves);
    return { success: true, count: getSaveCount(), slot: index };
  } catch (error) {
    console.warn('Failed to clear local save:', error);
    return { success: false, reason: 'error', count: getSaveCount() };
  }
}