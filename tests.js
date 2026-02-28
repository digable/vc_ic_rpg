// Test suite for validating vendors and trainers have items/training available
// Pure JavaScript - works in Node.js and browser without ES6 imports

// Load game data
let maps, shopItems, consumableItems, magicTraining, yogaTechniques, cambusRoutes, getNpcAppearanceSignature, getEnemyAppearanceSignature, enemiesList;

function loadGameData() {
  // Try to load from Node.js require first
  if (typeof require !== 'undefined') {
    try {
      const mapsModule = require('./js/maps.js');
      const dataModule = require('./js/data.js');
      const appearanceModule = require('./js/npc-appearance.js');
      const enemyAppearanceModule = require('./js/enemy-appearance.js');
      const enemiesModule = require('./js/enemies.js');
      maps = mapsModule.maps;
      shopItems = dataModule.shopItems;
      consumableItems = dataModule.consumableItems;
      magicTraining = dataModule.magicTraining;
      yogaTechniques = dataModule.yogaTechniques;
      cambusRoutes = dataModule.cambusRoutes;
      getNpcAppearanceSignature = appearanceModule.getNpcAppearanceSignature;
      getEnemyAppearanceSignature = enemyAppearanceModule.getEnemyAppearanceSignature;
      enemiesList = enemiesModule.enemies;
      return true;
    } catch (e) {
      console.log('Could not load with require, trying from window globals...');
    }
  }

  // Try to load from window globals (browser)
  if (typeof window !== 'undefined') {
    maps = window.mapsData;
    shopItems = window.shopItems;
    consumableItems = window.consumableItems;
    magicTraining = window.magicTraining;
    yogaTechniques = window.yogaTechniques;
    cambusRoutes = window.cambusRoutes;
    getNpcAppearanceSignature = window.getNpcAppearanceSignature || (window.gameModules && window.gameModules.getNpcAppearanceSignature);
    getEnemyAppearanceSignature = window.getEnemyAppearanceSignature || (window.gameModules && window.gameModules.getEnemyAppearanceSignature);
    enemiesList = window.enemies || (window.gameModules && window.gameModules.enemies);
    
    if (maps && shopItems && consumableItems && magicTraining && yogaTechniques && cambusRoutes) {
      return true;
    }
  }

  return false;
}

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color) {
  color = color || 'reset';
  console.log(colors[color] + message + colors.reset);
}

function logSection(title) {
  log('\n' + '='.repeat(70), 'cyan');
  log(title, 'cyan');
  log('='.repeat(70), 'cyan');
}

function logSuccess(message) {
  log('✓ ' + message, 'green');
}

function logError(message) {
  log('✗ ' + message, 'red');
}

function logWarning(message) {
  log('⚠ ' + message, 'yellow');
}

function logInfo(message) {
  log('ℹ ' + message, 'blue');
}

function getNpcVendorKey(npc) {
  return (npc.vendorName || npc.name || '').toString();
}

// Test 1: Validate all food_cart vendors have items
function testFoodCartVendors() {
  logSection('TEST 1: Food Cart Vendors');

  var foodCartNPCs = [];

  // Collect all food_cart type NPCs
  for (var mapName in maps) {
    if (maps.hasOwnProperty(mapName)) {
      var mapData = maps[mapName];
      if (mapData.npcs) {
        for (var i = 0; i < mapData.npcs.length; i++) {
          var npc = mapData.npcs[i];
          if (npc.type === 'food_cart') {
            foodCartNPCs.push({
              name: npc.name,
              vendorKey: getNpcVendorKey(npc),
              map: mapName
            });
          }
        }
      }
    }
  }

  var passCount = 0;
  var failCount = 0;

  logInfo('Found ' + foodCartNPCs.length + ' food cart vendor(s)');
  
  for (var i = 0; i < foodCartNPCs.length; i++) {
    var npc = foodCartNPCs[i];
    var items = [];
    
    for (var j = 0; j < consumableItems.length; j++) {
      var item = consumableItems[j];
      if (item.vendor && item.vendor.trim().toLowerCase() === npc.vendorKey.trim().toLowerCase()) {
        items.push(item);
      }
    }

    if (items.length > 0) {
      logSuccess(npc.name + ' [' + npc.vendorKey + '] (' + npc.map + '): ' + items.length + ' item(s)');
      for (var j = 0; j < items.length; j++) {
        logInfo('  - ' + items[j].name + ' ($' + items[j].price + ')');
      }
      passCount++;
    } else {
      logError(npc.name + ' (' + npc.map + '): NO ITEMS FOUND');
      failCount++;
    }
  }

  log('', 'reset');
  logInfo('Food Cart Tests: ' + passCount + ' passed, ' + failCount + ' failed');
  return { passed: passCount, failed: failCount };
}

// Test 2: Validate all shop vendors have items
function testShopVendors() {
  logSection('TEST 2: Shop Vendors (Fixed Shops)');

  var shopVendors = [];

  // Collect all shop type NPCs
  for (var mapName in maps) {
    if (maps.hasOwnProperty(mapName)) {
      var mapData = maps[mapName];
      if (mapData.npcs) {
        for (var i = 0; i < mapData.npcs.length; i++) {
          var npc = mapData.npcs[i];
          if (npc.type === 'shop') {
            shopVendors.push({ name: npc.name, map: mapName });
          }
        }
      }
    }
  }

  logInfo('Found ' + shopVendors.length + ' shop vendor(s)');
  
  // Check if shopItems has items (shops don't use vendor field, they use global shopItems)
  if (shopItems.length > 0) {
    logSuccess('Global shop items: ' + shopItems.length + ' item(s)');
    for (var i = 0; i < shopItems.length; i++) {
      logInfo('  - ' + shopItems[i].name + ' ($' + shopItems[i].price + ')');
    }
    logInfo('All ' + shopVendors.length + ' shop location(s) can access these items');
    return { passed: shopVendors.length, failed: 0 };
  } else {
    logError('No global shop items found!');
    return { passed: 0, failed: shopVendors.length };
  }
}

// Test 3: Validate all magic trainers have training available
function testMagicTrainers() {
  logSection('TEST 3: Magic Trainers');

  var magicTrainers = [];

  // Collect all magic_trainer type NPCs
  for (var mapName in maps) {
    if (maps.hasOwnProperty(mapName)) {
      var mapData = maps[mapName];
      if (mapData.npcs) {
        for (var i = 0; i < mapData.npcs.length; i++) {
          var npc = mapData.npcs[i];
          if (npc.type === 'magic_trainer') {
            magicTrainers.push({ name: npc.name, map: mapName });
          }
        }
      }
    }
  }

  logInfo('Found ' + magicTrainers.length + ' magic trainer(s)');
  
  if (magicTraining.length > 0) {
    logSuccess('Magic training available: ' + magicTraining.length + ' spell(s)');
    for (var i = 0; i < magicTraining.length; i++) {
      var training = magicTraining[i];
      logInfo('  - ' + training.name + ' ($' + training.price + '): Learn ' + training.spell);
    }
    logInfo('All ' + magicTrainers.length + ' magic trainer(s) can teach these spells');
    
    // List all trainers
    for (var i = 0; i < magicTrainers.length; i++) {
      var trainer = magicTrainers[i];
      logInfo('  - ' + trainer.name + ' (' + trainer.map + ')');
    }
    
    return { passed: magicTrainers.length, failed: 0 };
  } else {
    logError('No magic training found!');
    return { passed: 0, failed: magicTrainers.length };
  }
}

// Test 4: Validate all yoga instructors have techniques available
function testYogaInstructors() {
  logSection('TEST 4: Yoga Instructors');

  var yogaInstructors = [];

  // Collect all yoga type NPCs
  for (var mapName in maps) {
    if (maps.hasOwnProperty(mapName)) {
      var mapData = maps[mapName];
      if (mapData.npcs) {
        for (var i = 0; i < mapData.npcs.length; i++) {
          var npc = mapData.npcs[i];
          if (npc.type === 'yoga') {
            yogaInstructors.push({ name: npc.name, map: mapName });
          }
        }
      }
    }
  }

  logInfo('Found ' + yogaInstructors.length + ' yoga instructor(s)');
  
  if (yogaTechniques.length > 0) {
    logSuccess('Yoga techniques available: ' + yogaTechniques.length + ' technique(s)');
    for (var i = 0; i < yogaTechniques.length; i++) {
      var technique = yogaTechniques[i];
      logInfo('  - ' + technique.name + ' ($' + technique.price + '): Learn ' + technique.skill);
    }
    logInfo('All ' + yogaInstructors.length + ' yoga instructor(s) can teach these techniques');
    
    // List all instructors
    for (var i = 0; i < yogaInstructors.length; i++) {
      var instructor = yogaInstructors[i];
      logInfo('  - ' + instructor.name + ' (' + instructor.map + ')');
    }
    
    return { passed: yogaInstructors.length, failed: 0 };
  } else {
    logError('No yoga techniques found!');
    return { passed: 0, failed: yogaInstructors.length };
  }
}

// Test 5: Validate vendor name consistency (vendors must match exactly)
function testVendorNameConsistency() {
  logSection('TEST 5: Vendor Name Consistency Check');

  var vendorNamesInMaps = [];
  var passCount = 0;
  var failCount = 0;

  // Collect all food_cart vendor names from maps
  for (var mapName in maps) {
    if (maps.hasOwnProperty(mapName)) {
      var mapData = maps[mapName];
      if (mapData.npcs) {
        for (var i = 0; i < mapData.npcs.length; i++) {
          var npc = mapData.npcs[i];
          if (npc.type === 'food_cart') {
            var vendorKey = getNpcVendorKey(npc);
            if (vendorNamesInMaps.indexOf(vendorKey) === -1) {
              vendorNamesInMaps.push(vendorKey);
            }
          }
        }
      }
    }
  }

  // Check each vendor in maps has items
  for (var i = 0; i < vendorNamesInMaps.length; i++) {
    var vendorName = vendorNamesInMaps[i];
    var items = [];
    
    for (var j = 0; j < consumableItems.length; j++) {
      var item = consumableItems[j];
      if (item.vendor && item.vendor.trim().toLowerCase() === vendorName.trim().toLowerCase()) {
        items.push(item);
      }
    }

    if (items.length > 0) {
      logSuccess('"' + vendorName + '": Found in data.js');
      passCount++;
    } else {
      logError('"' + vendorName + '": MISSING from consumableItems');
      failCount++;
    }
  }

  // Check for orphaned vendors in data (vendors in data.js but not in maps)
  var vendorNamesInData = [];
  for (var i = 0; i < consumableItems.length; i++) {
    var item = consumableItems[i];
    if (item.vendor && vendorNamesInData.indexOf(item.vendor) === -1) {
      vendorNamesInData.push(item.vendor);
    }
  }

  for (var i = 0; i < vendorNamesInData.length; i++) {
    var vendorName = vendorNamesInData[i];
    var found = false;
    
    for (var j = 0; j < vendorNamesInMaps.length; j++) {
      if (vendorNamesInMaps[j].trim().toLowerCase() === vendorName.trim().toLowerCase()) {
        found = true;
        break;
      }
    }

    if (!found) {
      logWarning('"' + vendorName + '": Defined in data.js but has no NPC in any map');
    }
  }

  log('', 'reset');
  logInfo('Vendor Name Consistency: ' + passCount + ' matched, ' + failCount + ' unmatched');
  return { passed: passCount, failed: failCount };
}

function testUniqueNpcNames() {
  logSection('NPC UNIQUENESS: Name Check');

  var nameLocations = {};
  var passed = 0;
  var failed = 0;

  for (var mapName in maps) {
    if (!maps.hasOwnProperty(mapName)) continue;
    var mapData = maps[mapName];
    if (!mapData.npcs) continue;

    for (var i = 0; i < mapData.npcs.length; i++) {
      var npc = mapData.npcs[i];
      if (!npc.name) continue;
      if (!nameLocations[npc.name]) {
        nameLocations[npc.name] = [];
      }
      nameLocations[npc.name].push(mapName);
    }
  }

  for (var npcName in nameLocations) {
    if (!nameLocations.hasOwnProperty(npcName)) continue;
    var locations = nameLocations[npcName];
    if (locations.length === 1) {
      logSuccess(npcName + ' is unique (' + locations[0] + ')');
      passed++;
    } else {
      logError(npcName + ' is duplicated in maps: ' + locations.join(', '));
      failed++;
    }
  }

  logInfo('NPC Uniqueness: ' + passed + ' unique, ' + failed + ' duplicated');
  return { passed: passed, failed: failed };
}

function testUniqueNpcLooks() {
  logSection('NPC LOOKS: Uniqueness Check');

  if (!getNpcAppearanceSignature) {
    return { passed: 0, failed: 0, skipped: true, reason: 'Appearance signature function unavailable' };
  }

  var signatureOwners = {};
  var passed = 0;
  var failed = 0;

  for (var mapName in maps) {
    if (!maps.hasOwnProperty(mapName)) continue;
    var mapData = maps[mapName];
    if (!mapData.npcs) continue;

    for (var i = 0; i < mapData.npcs.length; i++) {
      var npc = mapData.npcs[i];
      var signature = getNpcAppearanceSignature(npc);
      if (!signatureOwners[signature]) {
        signatureOwners[signature] = [];
      }
      signatureOwners[signature].push(npc.name + ' (' + mapName + ')');
    }
  }

  for (var signature in signatureOwners) {
    if (!signatureOwners.hasOwnProperty(signature)) continue;
    var owners = signatureOwners[signature];
    if (owners.length === 1) {
      logSuccess('Unique look: ' + owners[0]);
      passed++;
    } else {
      logError('Shared look detected: ' + owners.join(', '));
      failed++;
    }
  }

  logInfo('NPC Look Uniqueness: ' + passed + ' unique, ' + failed + ' duplicated');
  return { passed: passed, failed: failed };
}

function testUniqueEnemyLooks() {
  logSection('ENEMY LOOKS: Uniqueness Check');

  if (!getEnemyAppearanceSignature || !enemiesList) {
    return { passed: 0, failed: 0, skipped: true, reason: 'Enemy appearance signature function unavailable' };
  }

  var signatureOwners = {};
  var passed = 0;
  var failed = 0;

  for (var i = 0; i < enemiesList.length; i++) {
    var enemy = enemiesList[i];
    var signature = getEnemyAppearanceSignature(enemy);
    if (!signatureOwners[signature]) {
      signatureOwners[signature] = [];
    }
    signatureOwners[signature].push(enemy.name);
  }

  for (var signature in signatureOwners) {
    if (!signatureOwners.hasOwnProperty(signature)) continue;
    var owners = signatureOwners[signature];
    if (owners.length === 1) {
      logSuccess('Unique enemy look: ' + owners[0]);
      passed++;
    } else {
      logError('Shared enemy look detected: ' + owners.join(', '));
      failed++;
    }
  }

  logInfo('Enemy Look Uniqueness: ' + passed + ' unique, ' + failed + ' duplicated');
  return { passed: passed, failed: failed };
}

// Main test runner - works in Node.js and browser
function runTests() {
  // Load game data
  if (!loadGameData()) {
    console.error('ERROR: Could not load game data. Make sure maps.js and data.js are available.');
    if (typeof process !== 'undefined') {
      process.exit(1);
    }
    return;
  }

  log('\n', 'reset');
  logSection('VENDOR & TRAINER TEST SUITE');
  
  var mapCount = 0;
  for (var key in maps) {
    if (maps.hasOwnProperty(key)) {
      mapCount++;
    }
  }
  logInfo('Testing ' + mapCount + ' maps for vendor/trainer coverage');

  var results = {
    foodCartVendors: testFoodCartVendors(),
    shopVendors: testShopVendors(),
    magicTrainers: testMagicTrainers(),
    yogaInstructors: testYogaInstructors(),
    vendorConsistency: testVendorNameConsistency()
  };

  // Summary
  logSection('TEST SUMMARY');
  
  var totalPassed = 0;
  var totalFailed = 0;
  
  for (var key in results) {
    if (results.hasOwnProperty(key)) {
      totalPassed += results[key].passed;
      totalFailed += results[key].failed;
    }
  }

  for (var testName in results) {
    if (results.hasOwnProperty(testName)) {
      var result = results[testName];
      var status = result.failed === 0 ? 'PASS' : 'FAIL';
      var statusColor = result.failed === 0 ? 'green' : 'red';
      log(testName + ': ' + status + ' (' + result.passed + '/' + (result.passed + result.failed) + ')', statusColor);
    }
  }

  log('', 'reset');
  
  if (totalFailed === 0) {
    logSuccess('\nAll tests passed! (' + totalPassed + '/' + totalPassed + ')');
    if (typeof process !== 'undefined') {
      process.exit(0);
    }
    return true;
  } else {
    logError('\n' + totalFailed + ' test(s) failed!');
    if (typeof process !== 'undefined') {
      process.exit(1);
    }
    return false;
  }
}

// ============================================================================
// CAMBUS FAST TRAVEL VALIDATION TESTS (Browser-based)
// ============================================================================

function testCambusRoutesExist() {
  if (typeof window === 'undefined') {
    return { passed: 0, failed: 0, skipped: true, reason: 'Browser-only test (window unavailable in Node)' };
  }

  var gameModules = window.gameModules || {};
  var mapsData = gameModules.maps;
  var cambusRoutes = gameModules.cambusRoutes;
  
  if (!mapsData || !cambusRoutes) {
    return { passed: 0, failed: 0, skipped: true, reason: 'Game modules not loaded in browser' };
  }

  logSection('CAMBUS: Routes Exist');
  var passed = 0;
  var failed = 0;

  for (var i = 0; i < cambusRoutes.length; i++) {
    var route = cambusRoutes[i];
    if (mapsData[route.map]) {
      logSuccess('Route ' + (i + 1) + ': "' + route.name + '" -> map "' + route.map + '" exists');
      passed++;
    } else {
      logError('Route ' + (i + 1) + ': "' + route.name + '" -> map "' + route.map + '" NOT FOUND');
      failed++;
    }
  }

  logInfo('Cambus Routes: ' + passed + ' passed, ' + failed + ' failed');
  return { passed: passed, failed: failed };
}

function testCambusSpawnCoordinates() {
  if (typeof window === 'undefined') {
    return { passed: 0, failed: 0, skipped: true, reason: 'Browser-only test (window unavailable in Node)' };
  }

  var gameModules = window.gameModules || {};
  var mapsData = gameModules.maps;
  var cambusRoutes = gameModules.cambusRoutes;
  
  if (!mapsData || !cambusRoutes) {
    return { passed: 0, failed: 0, skipped: true };
  }

  logSection('CAMBUS: Spawn Coordinates');
  var passed = 0;
  var failed = 0;

  for (var i = 0; i < cambusRoutes.length; i++) {
    var route = cambusRoutes[i];
    var map = mapsData[route.map];
    var mapWidth = map.width * 16;
    var mapHeight = map.height * 16;

    if (route.x < 0 || route.x >= mapWidth || route.y < 0 || route.y >= mapHeight) {
      logError('Route ' + (i + 1) + ': "' + route.name + '" spawn (' + route.x + ', ' + route.y + ') OUT OF BOUNDS');
      failed++;
    } else {
      logSuccess('Route ' + (i + 1) + ': "' + route.name + '" spawn (' + route.x + ', ' + route.y + ') valid');
      passed++;
    }
  }

  logInfo('Cambus Spawn: ' + passed + ' passed, ' + failed + ' failed');
  return { passed: passed, failed: failed };
}

// ============================================================================
// ITEM CONSOLIDATION TESTS (Standalone mock tests)
// ============================================================================

function testItemConsolidation() {
  logSection('ITEM CONSOLIDATION: Mock Tests');

  var gameState = {
    consumables: [
      { name: 'Potion', effect: 'healHP', amount: 20, description: 'Restores 20 HP', count: 1 },
      { name: 'Hi-Potion', effect: 'healHP', amount: 50, description: 'Restores 50 HP', count: 3 }
    ]
  };

  function addConsumable(item) {
    var existingItem = null;
    for (var i = 0; i < gameState.consumables.length; i++) {
      if (gameState.consumables[i].name === item.name) {
        existingItem = gameState.consumables[i];
        break;
      }
    }
    
    if (existingItem) {
      if (!existingItem.count) {
        existingItem.count = 1;
      }
      existingItem.count++;
    } else {
      var newItem = {};
      for (var key in item) {
        if (item.hasOwnProperty(key)) {
          newItem[key] = item[key];
        }
      }
      newItem.count = 1;
      gameState.consumables.push(newItem);
    }
  }

  function removeConsumable(index) {
    if (index < 0 || index >= gameState.consumables.length) return;
    
    var item = gameState.consumables[index];
    
    if (item.count && item.count > 1) {
      item.count--;
    } else {
      gameState.consumables.splice(index, 1);
    }
  }

  var passed = 0;
  var failed = 0;

  // Test 1: Add existing item
  addConsumable({ name: 'Hi-Potion', effect: 'healHP', amount: 50, description: 'Restores 50 HP' });
  if (gameState.consumables[1].count === 4) {
    logSuccess('Add existing item: Hi-Potion count increased to 4');
    passed++;
  } else {
    logError('Add existing item: Expected count 4, got ' + gameState.consumables[1].count);
    failed++;
  }

  // Test 2: Add new item
  addConsumable({ name: 'Ether', effect: 'healMP', amount: 30, description: 'Restores 30 MP' });
  var hasEther = false;
  for (var i = 0; i < gameState.consumables.length; i++) {
    if (gameState.consumables[i].name === 'Ether' && gameState.consumables[i].count === 1) {
      hasEther = true;
      break;
    }
  }
  if (hasEther) {
    logSuccess('Add new item: Ether added with count 1');
    passed++;
  } else {
    logError('Add new item: Ether not found or wrong count');
    failed++;
  }

  // Test 3: Remove item multiple times until depletion
  removeConsumable(1);
  removeConsumable(1);
  removeConsumable(1);
  removeConsumable(1);
  var hiPotionExists = false;
  for (var i = 0; i < gameState.consumables.length; i++) {
    if (gameState.consumables[i].name === 'Hi-Potion') {
      hiPotionExists = true;
      break;
    }
  }
  if (!hiPotionExists) {
    logSuccess('Remove item: Hi-Potion removed after depletion');
    passed++;
  } else {
    logError('Remove item: Hi-Potion should be removed');
    failed++;
  }

  log('', 'reset');
  logInfo('Item Consolidation: ' + passed + ' passed, ' + failed + ' failed');
  return { passed: passed, failed: failed };
}

// ============================================================================
// CAMBUS INTEGRATION TESTS (Node-compatible)
// ============================================================================

function testCityParkPoolCambusIntegration() {
  logSection('CAMBUS: City Park Pool Integration');

  var passed = 0;
  var failed = 0;

  var poolMap = maps.city_park_pool;
  if (!poolMap) {
    logError('Map "city_park_pool" not found');
    return { passed: 0, failed: 1 };
  }

  var busStopFound = false;
  for (var i = 0; i < poolMap.npcs.length; i++) {
    var npc = poolMap.npcs[i];
    if (npc.type === 'cambus') {
      busStopFound = true;
      break;
    }
  }

  if (busStopFound) {
    logSuccess('City Park Pool has a Cambus stop NPC');
    passed++;
  } else {
    logError('City Park Pool is missing a Cambus stop NPC');
    failed++;
  }

  var route = null;
  for (var j = 0; j < cambusRoutes.length; j++) {
    if (cambusRoutes[j].map === 'city_park_pool') {
      route = cambusRoutes[j];
      break;
    }
  }

  if (route) {
    logSuccess('Cambus route exists for city_park_pool (' + route.name + ')');
    passed++;
  } else {
    logError('Cambus route missing for city_park_pool');
    failed++;
  }

  if (route) {
    var mapWidth = poolMap.width * 16;
    var mapHeight = poolMap.height * 16;
    var inBounds = route.x >= 0 && route.x < mapWidth && route.y >= 0 && route.y < mapHeight;
    if (inBounds) {
      logSuccess('City Park Pool Cambus spawn is in bounds (' + route.x + ', ' + route.y + ')');
      passed++;
    } else {
      logError('City Park Pool Cambus spawn is out of bounds (' + route.x + ', ' + route.y + ')');
      failed++;
    }
  }

  logInfo('City Park Pool Cambus: ' + passed + ' passed, ' + failed + ' failed');
  return { passed: passed, failed: failed };
}

// ============================================================================
// WALKING EXIT ACCESSIBILITY TESTS (Node-compatible)
// ============================================================================

function isWalkableTile(mapData, tileX, tileY) {
  if (tileX < 0 || tileX >= mapData.width || tileY < 0 || tileY >= mapData.height) {
    return false;
  }

  var tile = mapData.tiles[tileY][tileX];
  if (tile === 0 || tile === 1) return true;
  if (tile === 2 && mapData.grassWalkable) return true;
  return false;
}

function isPointWalkAccessible(mapData, x, y) {
  var tileX = Math.floor(x / 16);
  var tileY = Math.floor(y / 16);

  if (isWalkableTile(mapData, tileX, tileY)) {
    return true;
  }

  var neighbors = [
    [tileX + 1, tileY],
    [tileX - 1, tileY],
    [tileX, tileY + 1],
    [tileX, tileY - 1]
  ];

  for (var i = 0; i < neighbors.length; i++) {
    if (isWalkableTile(mapData, neighbors[i][0], neighbors[i][1])) {
      return true;
    }
  }

  return false;
}

function testWalkingExitsAccessible() {
  logSection('WALKING EXITS: Accessibility & Validity');

  var passed = 0;
  var failed = 0;

  for (var mapName in maps) {
    if (!maps.hasOwnProperty(mapName)) continue;
    var mapData = maps[mapName];
    var exits = mapData.exits || [];

    for (var i = 0; i < exits.length; i++) {
      var exit = exits[i];
      var label = mapName + ' -> ' + exit.toMap + ' @(' + exit.x + ',' + exit.y + ')';

      var targetMap = maps[exit.toMap];
      if (!targetMap) {
        logError(label + ': destination map does not exist');
        failed++;
        continue;
      }

      var sourceInBounds = exit.x >= 0 && exit.x < mapData.width * 16 && exit.y >= 0 && exit.y < mapData.height * 16;
      if (!sourceInBounds) {
        logError(label + ': source exit coordinates out of bounds');
        failed++;
        continue;
      }

      var targetInBounds = exit.toX >= 0 && exit.toX < targetMap.width * 16 && exit.toY >= 0 && exit.toY < targetMap.height * 16;
      if (!targetInBounds) {
        logError(label + ': destination spawn coordinates out of bounds');
        failed++;
        continue;
      }

      var sourceAccessible = isPointWalkAccessible(mapData, exit.x, exit.y);
      var targetAccessible = isPointWalkAccessible(targetMap, exit.toX, exit.toY);

      if (!sourceAccessible) {
        logError(label + ': source exit trigger is not walk-accessible');
        failed++;
        continue;
      }

      if (!targetAccessible) {
        logError(label + ': destination spawn is not walk-accessible');
        failed++;
        continue;
      }

      logSuccess(label + ': valid and accessible');
      passed++;
    }
  }

  logInfo('Walking exits: ' + passed + ' passed, ' + failed + ' failed');
  return { passed: passed, failed: failed };
}

function canTriggerExitFromPosition(x, y, exit) {
  var dx = x - exit.x;
  var dy = y - exit.y;
  var dist = Math.sqrt(dx * dx + dy * dy);
  return dist < 16;
}

function getReachablePositions(mapData, startX, startY, maxNodes) {
  var reachable = {};
  var queue = [];

  function key(x, y) {
    return x + ',' + y;
  }

  function inBounds(x, y) {
    return x >= 0 && x < mapData.width * 16 && y >= 0 && y < mapData.height * 16;
  }

  if (!inBounds(startX, startY) || !isPointWalkAccessible(mapData, startX, startY)) {
    return reachable;
  }

  var startKey = key(startX, startY);
  reachable[startKey] = true;
  queue.push({ x: startX, y: startY });

  var visitedCount = 0;
  var limit = typeof maxNodes === 'number' ? maxNodes : 600;

  while (queue.length > 0 && visitedCount < limit) {
    var current = queue.shift();
    visitedCount++;

    var neighbors = [
      { x: current.x + 16, y: current.y },
      { x: current.x - 16, y: current.y },
      { x: current.x, y: current.y + 16 },
      { x: current.x, y: current.y - 16 }
    ];

    for (var i = 0; i < neighbors.length; i++) {
      var n = neighbors[i];
      var nKey = key(n.x, n.y);

      if (!inBounds(n.x, n.y)) continue;
      if (reachable[nKey]) continue;
      if (!isPointWalkAccessible(mapData, n.x, n.y)) continue;

      reachable[nKey] = true;
      queue.push(n);
    }
  }

  return reachable;
}

function canReachExitFromSpawn(mapData, spawnX, spawnY, targetExit) {
  var reachable = getReachablePositions(mapData, spawnX, spawnY, 700);
  for (var posKey in reachable) {
    if (!reachable.hasOwnProperty(posKey)) continue;
    var parts = posKey.split(',');
    var x = parseInt(parts[0], 10);
    var y = parseInt(parts[1], 10);
    if (canTriggerExitFromPosition(x, y, targetExit)) {
      return true;
    }
  }
  return false;
}

function testWalkingTransitionsRoundTrip() {
  logSection('WALKING TRANSITIONS: Round-Trip Reliability');

  var passed = 0;
  var failed = 0;

  for (var fromMapName in maps) {
    if (!maps.hasOwnProperty(fromMapName)) continue;

    var fromMap = maps[fromMapName];
    var fromExits = fromMap.exits || [];

    for (var i = 0; i < fromExits.length; i++) {
      var forwardExit = fromExits[i];
      var toMapName = forwardExit.toMap;
      var toMap = maps[toMapName];
      if (!toMap) continue;

      var reverseCandidates = [];
      var toExits = toMap.exits || [];
      for (var j = 0; j < toExits.length; j++) {
        if (toExits[j].toMap === fromMapName) {
          reverseCandidates.push(toExits[j]);
        }
      }

      if (reverseCandidates.length === 0) {
        logInfo(fromMapName + ' -> ' + toMapName + ': no reverse walking exit (skipped)');
        continue;
      }

      var reverseExit = reverseCandidates[0];
      var label = fromMapName + ' -> ' + toMapName + ' -> ' + fromMapName + ' -> ' + toMapName;

      // Step 1: after A->B transition, can player reach B->A trigger?
      var canReturn = canReachExitFromSpawn(toMap, forwardExit.toX, forwardExit.toY, reverseExit);
      if (!canReturn) {
        logError(label + ': cannot reliably reach reverse exit from destination spawn');
        failed++;
        continue;
      }

      // Step 2: after B->A transition, can player again reach original A->B trigger?
      var canReenter = canReachExitFromSpawn(fromMap, reverseExit.toX, reverseExit.toY, forwardExit);
      if (!canReenter) {
        logError(label + ': cannot re-enter destination after returning');
        failed++;
        continue;
      }

      logSuccess(label + ': reliable');
      passed++;
    }
  }

  logInfo('Walking round-trip reliability: ' + passed + ' passed, ' + failed + ' failed');
  return { passed: passed, failed: failed };
}

// ============================================================================
// MINIMAP COVERAGE TESTS
// ============================================================================

function testMiniMapTopLevelLocations() {
  if (typeof require === 'undefined') {
    return { passed: 0, failed: 0, skipped: true, reason: 'Node-only test (file read unavailable)' };
  }

  var fs;
  var path;
  try {
    fs = require('fs');
    path = require('path');
  } catch (e) {
    return { passed: 0, failed: 0, skipped: true, reason: 'Node fs/path unavailable' };
  }

  logSection('MINIMAP: Top-Level Location Coverage');

  var uiPath = path.join(__dirname, 'js', 'rendering', 'ui.js');
  var uiSource = '';
  try {
    uiSource = fs.readFileSync(uiPath, 'utf8');
  } catch (e) {
    logError('Could not read js/rendering/ui.js');
    return { passed: 0, failed: 1 };
  }

  var mapTabStart = uiSource.lastIndexOf('} else if (game.menuTab === 1) {');
  var mapTabEnd = uiSource.indexOf('} else if (game.menuTab === 2) {', mapTabStart);
  if (mapTabStart === -1 || mapTabEnd === -1) {
    logError('Could not locate menu map tab block in ui.js');
    return { passed: 0, failed: 1 };
  }

  var mapTabCode = uiSource.slice(mapTabStart, mapTabEnd);
  var minimapMaps = [];
  var minimapMapLookup = {};
  var mapRegex = /map:\s*'([^']+)'/g;
  var match;
  while ((match = mapRegex.exec(mapTabCode)) !== null) {
    var mapKey = match[1];
    if (!minimapMapLookup[mapKey]) {
      minimapMapLookup[mapKey] = true;
      minimapMaps.push(mapKey);
    }
  }

  var expectedTopLevel = [];
  for (var mapKey in maps) {
    if (!maps.hasOwnProperty(mapKey)) continue;
    if (mapKey.indexOf('beer_caves_depths_') === 0) continue;
    expectedTopLevel.push(mapKey);
  }

  var passed = 0;
  var failed = 0;

  for (var i = 0; i < expectedTopLevel.length; i++) {
    var expectedKey = expectedTopLevel[i];
    if (minimapMapLookup[expectedKey]) {
      logSuccess('Top-level map included: ' + expectedKey);
      passed++;
    } else {
      logError('Missing top-level map in minimap: ' + expectedKey);
      failed++;
    }
  }

  logInfo('Minimap entries detected: ' + minimapMaps.join(', '));
  logInfo('Minimap coverage: ' + passed + ' passed, ' + failed + ' failed');
  return { passed: passed, failed: failed };
}

// ============================================================================
// UNIFIED TEST RUNNER
// ============================================================================

function runTests() {
  // Load game data
  if (!loadGameData()) {
    console.error('ERROR: Could not load game data. Make sure maps.js and data.js are available.');
    if (typeof process !== 'undefined') {
      process.exit(1);
    }
    return;
  }

  log('\n', 'reset');
  logSection('COMPLETE TEST SUITE');
  logInfo('All game validation tests');

  var results = {
    foodCartVendors: testFoodCartVendors(),
    shopVendors: testShopVendors(),
    magicTrainers: testMagicTrainers(),
    yogaInstructors: testYogaInstructors(),
    vendorConsistency: testVendorNameConsistency(),
    uniqueNpcNames: testUniqueNpcNames(),
    uniqueNpcLooks: testUniqueNpcLooks(),
    uniqueEnemyLooks: testUniqueEnemyLooks(),
    cambusRoutesExist: testCambusRoutesExist(),
    cambusSpawnCoordinates: testCambusSpawnCoordinates(),
    cityParkPoolCambus: testCityParkPoolCambusIntegration(),
    walkingExitsAccessible: testWalkingExitsAccessible(),
    walkingTransitionsRoundTrip: testWalkingTransitionsRoundTrip(),
    itemConsolidation: testItemConsolidation(),
    miniMapTopLevelLocations: testMiniMapTopLevelLocations()
  };

  // Summary
  logSection('OVERALL TEST SUMMARY');
  
  var totalPassed = 0;
  var totalFailed = 0;
  var skippedCount = 0;
  
  for (var key in results) {
    if (results.hasOwnProperty(key)) {
      var result = results[key];
      if (!result.skipped) {
        totalPassed += result.passed;
        totalFailed += result.failed;
      } else {
        skippedCount++;
      }
    }
  }

  for (var testName in results) {
    if (results.hasOwnProperty(testName)) {
      var result = results[testName];
      if (result.skipped) {
        log(testName + ': SKIPPED (browser-only test)', 'yellow');
      } else {
        var status = result.failed === 0 ? 'PASS' : 'FAIL';
        var statusColor = result.failed === 0 ? 'green' : 'red';
        log(testName + ': ' + status + ' (' + result.passed + '/' + (result.passed + result.failed) + ')', statusColor);
      }
    }
  }

  log('', 'reset');
  
  if (skippedCount > 0) {
    logWarning('Note: ' + skippedCount + ' browser-only test(s) skipped (run in browser after game loads)');
  }

  if (totalFailed === 0) {
    logSuccess('\nAll executed tests passed! (' + totalPassed + '/' + totalPassed + ')');
    if (typeof process !== 'undefined') {
      process.exit(0);
    }
    return true;
  } else {
    logError('\n' + totalFailed + ' test(s) failed!');
    if (typeof process !== 'undefined') {
      process.exit(1);
    }
    return false;
  }
}

// For Node.js: run tests if this file is executed directly
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = { runTests: runTests };
  
  // Check if being run directly
  if (require.main === module) {
    runTests();
  }
}

// For Browser: make runTests available in window
if (typeof window !== 'undefined') {
  window.runTests = runTests;
}
