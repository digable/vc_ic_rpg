// World & Map Module
import { game } from './game-state.js';
import { maps } from './maps.js';

export function openFoodCart(vendor) {
  game.currentVendor = vendor;
  game.state = 'food_cart';
  game.foodCartOpen = true;
  game.foodCartSelection = 0;
}

export function checkMapTransition() {
  const fromMap = game.map;
  const currentMap = maps[game.map];
  for (let exit of currentMap.exits) {
    const dist = Math.sqrt((game.player.x - exit.x) ** 2 + (game.player.y - exit.y) ** 2);
    if (dist < 16) {
      game.map = exit.toMap;
      game.player.x = exit.toX;
      game.player.y = exit.toY;
      game.enemyEncounterSteps = 0;
      if (fromMap === 'beer_caves' && game.map !== 'beer_caves') {
        game.flashlightOn = false;
      }
      return;
    }
  }
}

export function checkCollision(x, y) {
  const map = maps[game.map];
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
