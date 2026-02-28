// Test suite orchestrator
// Keeps full test coverage while delegating implementation to suite modules.

let maps;
let shopItems;
let consumableItems;
let magicTraining;
let yogaTechniques;
let cambusRoutes;
let getNpcAppearanceSignature;
let getEnemyAppearanceSignature;
let enemiesList;

let vendorSuite;
let uniquenessSuite;
let cambusSuite;
let walkingSuite;
let itemsSuite;
let consistencySuite;
let testLogging;
let testContext;

function loadSuites() {
  if (typeof require !== 'undefined') {
    testLogging = require('./lib/logging.js');
    testContext = require('./lib/context.js');
    vendorSuite = require('./suites/vendors.js');
    uniquenessSuite = require('./suites/uniqueness.js');
    cambusSuite = require('./suites/cambus.js');
    walkingSuite = require('./suites/walking.js');
    itemsSuite = require('./suites/items.js');
    consistencySuite = require('./suites/consistency.js');
    return !!(testLogging && testContext && vendorSuite && uniquenessSuite && cambusSuite && walkingSuite && itemsSuite && consistencySuite);
  }

  if (typeof window !== 'undefined' && window.vcTestSuites && window.vcTestLib) {
    testLogging = window.vcTestLib.logging;
    testContext = window.vcTestLib.context;
    vendorSuite = window.vcTestSuites.vendors;
    uniquenessSuite = window.vcTestSuites.uniqueness;
    cambusSuite = window.vcTestSuites.cambus;
    walkingSuite = window.vcTestSuites.walking;
    itemsSuite = window.vcTestSuites.items;
    consistencySuite = window.vcTestSuites.consistency;
    return !!(testLogging && testContext && vendorSuite && uniquenessSuite && cambusSuite && walkingSuite && itemsSuite && consistencySuite);
  }

  return false;
}

function loadGameData() {
  if (typeof require !== 'undefined') {
    try {
      const mapsModule = require('../js/maps.js');
      const dataModule = require('../js/data.js');
      const appearanceModule = require('../js/npc-appearance.js');
      const enemyAppearanceModule = require('../js/enemy-appearance.js');
      const enemiesModule = require('../js/enemies.js');
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

function runTests() {
  if (!loadSuites()) {
    console.error('ERROR: Could not load test suite modules.');
    if (typeof process !== 'undefined') {
      process.exit(1);
    }
    return;
  }

  if (!loadGameData()) {
    console.error('ERROR: Could not load game data. Make sure maps.js and data.js are available.');
    if (typeof process !== 'undefined') {
      process.exit(1);
    }
    return;
  }

  var logger = testLogging.createLogger();
  var ctx = testContext.createTestContext({
    maps: maps,
    shopItems: shopItems,
    consumableItems: consumableItems,
    magicTraining: magicTraining,
    yogaTechniques: yogaTechniques,
    cambusRoutes: cambusRoutes,
    getNpcAppearanceSignature: getNpcAppearanceSignature,
    getEnemyAppearanceSignature: getEnemyAppearanceSignature,
    enemiesList: enemiesList
  }, logger);

  var log = logger.log;
  var logSection = logger.logSection;
  var logSuccess = logger.logSuccess;
  var logError = logger.logError;
  var logWarning = logger.logWarning;
  var logInfo = logger.logInfo;

  log('\n', 'reset');
  logSection('COMPLETE TEST SUITE');
  logInfo('All game validation tests');

  var results = {
    foodCartVendors: vendorSuite.testFoodCartVendors(ctx),
    shopVendors: vendorSuite.testShopVendors(ctx),
    magicTrainers: vendorSuite.testMagicTrainers(ctx),
    yogaInstructors: vendorSuite.testYogaInstructors(ctx),
    vendorConsistency: vendorSuite.testVendorNameConsistency(ctx),
    uniqueNpcNames: uniquenessSuite.testUniqueNpcNames(ctx),
    uniqueNpcLooks: uniquenessSuite.testUniqueNpcLooks(ctx),
    uniqueEnemyLooks: uniquenessSuite.testUniqueEnemyLooks(ctx),
    cambusRoutesExist: cambusSuite.testCambusRoutesExist(ctx),
    cambusSpawnCoordinates: cambusSuite.testCambusSpawnCoordinates(ctx),
    cityParkPoolCambus: cambusSuite.testCityParkPoolCambusIntegration(ctx),
    walkingExitsAccessible: walkingSuite.testWalkingExitsAccessible(ctx),
    walkingTransitionsRoundTrip: walkingSuite.testWalkingTransitionsRoundTrip(ctx),
    npcReachabilityAllMaps: walkingSuite.testNpcReachabilityAllMaps(ctx),
    itemConsolidation: itemsSuite.testItemConsolidation(ctx),
    miniMapTopLevelLocations: consistencySuite.testMiniMapTopLevelLocations(ctx),
    readmeConsistency: consistencySuite.testReadmeConsistency(ctx)
  };

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
      var testResult = results[testName];
      if (testResult.skipped) {
        log(testName + ': SKIPPED (browser-only test)', 'yellow');
      } else {
        var status = testResult.failed === 0 ? 'PASS' : 'FAIL';
        var statusColor = testResult.failed === 0 ? 'green' : 'red';
        log(testName + ': ' + status + ' (' + testResult.passed + '/' + (testResult.passed + testResult.failed) + ')', statusColor);
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
  }

  logError('\n' + totalFailed + ' test(s) failed!');
  if (typeof process !== 'undefined') {
    process.exit(1);
  }
  return false;
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = { runTests: runTests };

  if (require.main === module) {
    runTests();
  }
}

if (typeof window !== 'undefined') {
  window.runTests = runTests;
}
