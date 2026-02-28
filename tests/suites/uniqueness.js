(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.vcTestSuites = root.vcTestSuites || {};
    root.vcTestSuites.uniqueness = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function testUniqueNpcNames(ctx) {
    var maps = ctx.maps;
    var logSection = ctx.logSection;
    var logInfo = ctx.logInfo;
    var logSuccess = ctx.logSuccess;
    var logError = ctx.logError;

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

  function testUniqueNpcLooks(ctx) {
    var maps = ctx.maps;
    var getNpcAppearanceSignature = ctx.getNpcAppearanceSignature;
    var logSection = ctx.logSection;
    var logInfo = ctx.logInfo;
    var logSuccess = ctx.logSuccess;
    var logError = ctx.logError;

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

  function testUniqueEnemyLooks(ctx) {
    var getEnemyAppearanceSignature = ctx.getEnemyAppearanceSignature;
    var enemiesList = ctx.enemiesList;
    var logSection = ctx.logSection;
    var logInfo = ctx.logInfo;
    var logSuccess = ctx.logSuccess;
    var logError = ctx.logError;

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

    for (var key in signatureOwners) {
      if (!signatureOwners.hasOwnProperty(key)) continue;
      var owners = signatureOwners[key];
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

  return {
    testUniqueNpcNames: testUniqueNpcNames,
    testUniqueNpcLooks: testUniqueNpcLooks,
    testUniqueEnemyLooks: testUniqueEnemyLooks
  };
}));