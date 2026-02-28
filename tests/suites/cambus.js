(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.vcTestSuites = root.vcTestSuites || {};
    root.vcTestSuites.cambus = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function testCambusRoutesExist(ctx) {
    var logSection = ctx.logSection;
    var logInfo = ctx.logInfo;
    var logSuccess = ctx.logSuccess;
    var logError = ctx.logError;

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

  function testCambusSpawnCoordinates(ctx) {
    var logSection = ctx.logSection;
    var logInfo = ctx.logInfo;
    var logSuccess = ctx.logSuccess;
    var logError = ctx.logError;

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

  function testCityParkPoolCambusIntegration(ctx) {
    var maps = ctx.maps;
    var cambusRoutes = ctx.cambusRoutes;
    var logSection = ctx.logSection;
    var logInfo = ctx.logInfo;
    var logSuccess = ctx.logSuccess;
    var logError = ctx.logError;

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

  return {
    testCambusRoutesExist: testCambusRoutesExist,
    testCambusSpawnCoordinates: testCambusSpawnCoordinates,
    testCityParkPoolCambusIntegration: testCityParkPoolCambusIntegration
  };
}));