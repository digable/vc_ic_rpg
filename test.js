// Test Suite for Cambus Fast Travel Validation

import { maps } from './js/maps.js';
import { cambusRoutes } from './js/data.js';
import { checkCollision } from './js/world.js';

/**
 * Test: Verify all Cambus routes map to valid locations
 * Checks that each route has a corresponding map definition
 */
function testCambusRoutesExist() {
  console.log('\n=== Testing Cambus Routes Exist ===');
  let passed = 0;
  let failed = 0;

  cambusRoutes.forEach((route, index) => {
    if (maps[route.map]) {
      console.log(`✓ Route ${index + 1}: "${route.name}" → map "${route.map}" exists`);
      passed++;
    } else {
      console.error(`✗ Route ${index + 1}: "${route.name}" → map "${route.map}" NOT FOUND`);
      failed++;
    }
  });

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

/**
 * Test: Verify spawn coordinates are valid
 * Checks that player spawn coordinates are within map bounds and not colliding
 */
function testSpawnCoordinatesValid() {
  console.log('\n=== Testing Spawn Coordinates Validity ===');
  let passed = 0;
  let failed = 0;

  cambusRoutes.forEach((route, index) => {
    const map = maps[route.map];
    const mapWidth = map.width * 16;  // Convert tiles to pixels
    const mapHeight = map.height * 16;

    // Check bounds
    if (route.x < 0 || route.x >= mapWidth || route.y < 0 || route.y >= mapHeight) {
      console.error(
        `✗ Route ${index + 1}: "${route.name}" spawn (${route.x}, ${route.y}) ` +
        `is OUT OF BOUNDS (map size: ${mapWidth}x${mapHeight})`
      );
      failed++;
      return;
    }

    // Check collision
    const hasCollision = checkCollisionAtMapLocation(route.map, route.x, route.y);
    if (hasCollision) {
      console.error(
        `✗ Route ${index + 1}: "${route.name}" spawn (${route.x}, ${route.y}) ` +
        `has COLLISION (player would be stuck)`
      );
      failed++;
    } else {
      console.log(
        `✓ Route ${index + 1}: "${route.name}" spawn (${route.x}, ${route.y}) is valid`
      );
      passed++;
    }
  });

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

/**
 * Test: Verify player can move in all cardinal directions from spawn
 * Checks that at least one adjacent tile is walkable in each direction
 */
function testMovementFromSpawn() {
  console.log('\n=== Testing Player Movement From Spawn ===');
  let passed = 0;
  let failed = 0;

  cambusRoutes.forEach((route, index) => {
    const directions = {
      up: { dx: 0, dy: -16, name: 'up' },
      down: { dx: 0, dy: 16, name: 'down' },
      left: { dx: -16, dy: 0, name: 'left' },
      right: { dx: 16, dy: 0, name: 'right' }
    };

    let canMove = false;
    let moveDirections = [];

    Object.values(directions).forEach(dir => {
      const newX = route.x + dir.dx;
      const newY = route.y + dir.dy;
      if (!checkCollisionAtMapLocation(route.map, newX, newY)) {
        canMove = true;
        moveDirections.push(dir.name);
      }
    });

    if (canMove) {
      console.log(
        `✓ Route ${index + 1}: "${route.name}" can move in: ${moveDirections.join(', ')}`
      );
      passed++;
    } else {
      console.error(
        `✗ Route ${index + 1}: "${route.name}" CANNOT MOVE in any direction (stuck!)`
      );
      failed++;
    }
  });

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

/**
 * Test: Verify map tile types are correct
 * Checks that the tiles array matches expected dimensions
 */
function testMapTileIntegrity() {
  console.log('\n=== Testing Map Tile Integrity ===');
  let passed = 0;
  let failed = 0;

  cambusRoutes.forEach((route, index) => {
    const map = maps[route.map];
    const tilesHeight = map.tiles.length;
    const tilesWidth = map.tiles[0]?.length || 0;

    if (tilesHeight === map.height && tilesWidth === map.width) {
      console.log(
        `✓ Route ${index + 1}: "${route.name}" map dimensions match (${tilesWidth}x${tilesHeight})`
      );
      passed++;
    } else {
      console.error(
        `✗ Route ${index + 1}: "${route.name}" map dimensions mismatch ` +
        `(declared: ${map.width}x${map.height}, actual: ${tilesWidth}x${tilesHeight})`
      );
      failed++;
    }
  });

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

/**
 * Helper: Check collision at specific location on a specific map
 * Simulates the checkCollision function from world.js
 */
function checkCollisionAtMapLocation(mapName, x, y) {
  const map = maps[mapName];
  const tileX = Math.floor(x / 16);
  const tileY = Math.floor(y / 16);

  // Out of bounds check
  if (tileY < 0 || tileY >= map.height || tileX < 0 || tileX >= map.width) {
    return true;
  }

  const tile = map.tiles[tileY][tileX];

  // Tile types: 0=path, 1=grass, 2=forest/boundary, 3=building, 4=books/special, 5=water, 6=cave
  if (tile === 0 || tile === 1) return false;
  if (tile === 2 && map.grassWalkable) return false;

  return true;
}

/**
 * Test: Summary report with all tests
 * Runs all tests and provides overall status
 */
function runAllTests() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║          CAMBUS FAST TRAVEL VALIDATION TEST SUITE              ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');

  const results = {
    routesExist: testCambusRoutesExist(),
    spawnValid: testSpawnCoordinatesValid(),
    movementOk: testMovementFromSpawn(),
    tilesIntegrity: testMapTileIntegrity()
  };

  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║                      OVERALL RESULTS                           ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log(`Routes Exist:        ${results.routesExist ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`Spawn Valid:         ${results.spawnValid ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`Movement OK:         ${results.movementOk ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`Tiles Integrity:     ${results.tilesIntegrity ? '✓ PASS' : '✗ FAIL'}`);

  const allPassed = Object.values(results).every(r => r);
  console.log(`\nOVERALL: ${allPassed ? '✓✓✓ ALL TESTS PASSED ✓✓✓' : '✗✗✗ SOME TESTS FAILED ✗✗✗'}`);

  return allPassed;
}

// Run tests if this file is executed directly
if (typeof process !== 'undefined' && process.argv[1]?.includes('test.js')) {
  runAllTests();
} else if (typeof window !== 'undefined') {
  // Browser environment - make tests available on window
  window.runTests = runAllTests;
  window.testCambusRoutesExist = testCambusRoutesExist;
  window.testSpawnCoordinatesValid = testSpawnCoordinatesValid;
  window.testMovementFromSpawn = testMovementFromSpawn;
  window.testMapTileIntegrity = testMapTileIntegrity;
}

export { runAllTests, testCambusRoutesExist, testSpawnCoordinatesValid, testMovementFromSpawn, testMapTileIntegrity };
