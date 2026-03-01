import { game, actions } from '../../game-state.js';
import { maps } from '../../maps.js';

const DEFAULT_EXIT_TRIGGER_DISTANCE = 16;

export function getMapData(mapKey = game.map) {
  return maps[mapKey] || null;
}

export function getExitTransitionAtPosition({
  mapKey = game.map,
  x = game.player.x,
  y = game.player.y,
  maxDistance = DEFAULT_EXIT_TRIGGER_DISTANCE
} = {}) {
  const map = getMapData(mapKey);
  if (!map || !Array.isArray(map.exits)) {
    return null;
  }

  for (const exit of map.exits) {
    const dist = Math.sqrt((x - exit.x) ** 2 + (y - exit.y) ** 2);
    if (dist < maxDistance) {
      return {
        fromMap: mapKey,
        exit,
        transition: {
          toMap: exit.toMap,
          toX: exit.toX,
          toY: exit.toY,
          resetEncounterSteps: true,
          clearFlashlightMode: 'leaveCaves'
        }
      };
    }
  }

  return null;
}

export function getNearbyExitDestinationName({
  mapKey = game.map,
  x = game.player.x,
  y = game.player.y,
  maxDistance = 30
} = {}) {
  const transition = getExitTransitionAtPosition({ mapKey, x, y, maxDistance });
  if (!transition) {
    return null;
  }

  return maps[transition.exit.toMap]?.name || null;
}

export function applyMapExitTransitionAtPlayerPosition(maxDistance = DEFAULT_EXIT_TRIGGER_DISTANCE) {
  const transition = getExitTransitionAtPosition({ maxDistance });
  if (!transition) {
    return false;
  }

  actions.mapChanged(transition.transition);
  return true;
}

export function travelToMapDestination({
  toMap,
  toX = game.player.x,
  toY = game.player.y,
  resetEncounterSteps = true,
  clearFlashlightMode = 'nonCaveDestination'
}) {
  actions.mapChanged({
    toMap,
    toX,
    toY,
    resetEncounterSteps,
    clearFlashlightMode
  });
}

export function isPositionBlocked(x, y, mapKey = game.map) {
  const map = getMapData(mapKey);
  if (!map) {
    return true;
  }

  const tileX = Math.floor(x / 16);
  const tileY = Math.floor(y / 16);

  if (tileY < 0 || tileY >= map.height || tileX < 0 || tileX >= map.width) {
    return true;
  }

  const tile = map.tiles[tileY][tileX];
  if (tile === 0 || tile === 1) return false;
  if (tile === 2 && map.grassWalkable) return false;
  return true;
}

export function commitPlayerMovement(x, y) {
  if (isPositionBlocked(x, y)) {
    return false;
  }

  actions.playerPatched({ x, y }, 'playerPositionMoved');
  game.enemyEncounterSteps++;
  applyMapExitTransitionAtPlayerPosition();
  return true;
}