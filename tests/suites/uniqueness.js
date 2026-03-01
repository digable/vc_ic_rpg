(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.vcTestSuites = root.vcTestSuites || {};
    root.vcTestSuites.uniqueness = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function safeReadBattleSpriteSource() {
    if (typeof require === 'undefined') return null;
    try {
      var fs = require('fs');
      var path = require('path');
      var battlePath = path.join(__dirname, '../../js/rendering/battle.js');
      return fs.readFileSync(battlePath, 'utf8');
    } catch (err) {
      return null;
    }
  }

  function extractEnemySpriteBranches(source) {
    if (!source || typeof source !== 'string') return {};
    var branches = {};
    var pattern = /(?:if|else\s+if)\s*\(enemy\.name\s*===\s*'([^']+)'\)\s*\{([\s\S]*?)(?=}\s*else\s+if\s*\(enemy\.name\s*===\s*'|}\s*else\s*\{)/g;
    var match;
    while ((match = pattern.exec(source)) !== null) {
      branches[match[1]] = match[2] || '';
    }
    return branches;
  }

  function normalizeBranchSignature(branchSource) {
    if (!branchSource) return '';
    return branchSource
      .replace(/\/\/.*$/gm, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function expectedThemeTokens(enemyName) {
    var name = (enemyName || '').toLowerCase();

    if (/meter/.test(name)) return ['meter', 'expired', 'coin'];
    if (/assignment/.test(name)) return ['late', 'paper', 'stamp'];
    if (/exam|midterm/.test(name)) return ['exam', 'bubble', 'test'];
    if (/project/.test(name)) return ['person', 'speech', 'argu'];
    if (/raccoon/.test(name)) return ['mask', 'tail', 'garbage'];
    if (/coffee/.test(name)) return ['coffee', 'cup', 'empty'];
    if (/thesis/.test(name)) return ['book', 'thesis', 'chain'];
    if (/bat/.test(name)) return ['bat', 'wing', 'screech'];
    if (/spider/.test(name)) return ['spider', 'legs', 'fang'];
    if (/golem/.test(name)) return ['stone', 'rock', 'crack'];
    if (/mushroom/.test(name)) return ['mushroom', 'spore', 'glow'];
    if (/elemental|crystal/.test(name)) return ['crystal', 'shard', 'glow'];
    if (/drake/.test(name)) return ['drake', 'dragon', 'wing'];
    if (/fungal|mycelium/.test(name)) return ['fung', 'spore', 'mycel'];
    if (/leech/.test(name)) return ['leech', 'siphon', 'bite'];
    if (/tunnel|brute/.test(name)) return ['brute', 'smash', 'tunnel'];
    if (/sovereign/.test(name)) return ['boss', 'crown', 'royal'];
    if (/fan/.test(name)) return ['fan', 'jersey', 'foam'];
    if (/football/.test(name)) return ['football', 'laces'];
    if (/mascot/.test(name)) return ['mascot', 'head', 'charge'];
    if (/street|performer/.test(name)) return ['perform', 'juggling', 'entertain'];
    if (/shopping|cart/.test(name)) return ['cart', 'wheel', 'handle'];
    if (/lake|monster/.test(name)) return ['lake', 'creature', 'spike'];
    if (/goose/.test(name)) return ['goose', 'beak', 'honk'];
    if (/catfish|fish/.test(name)) return ['fish', 'tail', 'whisker'];
    if (/cannonball/.test(name)) return ['cannonball', 'splash', 'swim'];
    if (/lane/.test(name)) return ['lane', 'divider', 'rope'];
    if (/whistle/.test(name)) return ['whistle', 'lifeguard', 'running'];
    if (/zombie/.test(name)) return ['zombie', 'tatter', 'grave'];
    if (/witch/.test(name)) return ['witch', 'hat', 'hex'];
    if (/wailing|ghost/.test(name)) return ['ghost', 'spectral', 'haunt'];
    if (/skeletal|skeleton/.test(name)) return ['skeleton', 'skull', 'shovel'];
    if (/raven/.test(name)) return ['raven', 'wing', 'peck'];
    if (/lantern|wisp/.test(name)) return ['lantern', 'flame', 'flicker'];
    if (/portrait/.test(name)) return ['portrait', 'frame', 'haunted'];
    if (/administrator|corrupted/.test(name)) return ['corrupt', 'bureau', 'red tape'];
    return [];
  }

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

  function testEnemySpriteDistinctnessAndTheme(ctx) {
    var enemiesList = ctx.enemiesList;
    var logSection = ctx.logSection;
    var logInfo = ctx.logInfo;
    var logSuccess = ctx.logSuccess;
    var logError = ctx.logError;

    logSection('ENEMY SPRITES: Distinct + Name-Themed');

    if (!enemiesList || !Array.isArray(enemiesList) || enemiesList.length === 0) {
      return { passed: 0, failed: 1 };
    }

    var source = safeReadBattleSpriteSource();
    if (!source) {
      return { passed: 0, failed: 0, skipped: true, reason: 'Battle sprite source unavailable in this runtime' };
    }

    var branches = extractEnemySpriteBranches(source);
    var signatures = {};
    var passed = 0;
    var failed = 0;

    logInfo('Checking sprite branch coverage and semantic alignment for ' + enemiesList.length + ' enemies');

    for (var i = 0; i < enemiesList.length; i++) {
      var enemyName = enemiesList[i] && enemiesList[i].name;
      var branchSource = branches[enemyName];
      if (!branchSource) {
        logError(enemyName + ' is missing an explicit sprite branch in rendering/battle.js');
        failed++;
        continue;
      }

      var signature = normalizeBranchSignature(branchSource);
      if (!signature) {
        logError(enemyName + ' has an empty sprite branch body');
        failed++;
        continue;
      }

      if (!signatures[signature]) {
        signatures[signature] = [];
      }
      signatures[signature].push(enemyName);

      var themeTokens = expectedThemeTokens(enemyName);
      if (themeTokens.length > 0) {
        var lowered = branchSource.toLowerCase();
        var tokenMatch = false;
        for (var tokenIndex = 0; tokenIndex < themeTokens.length; tokenIndex++) {
          if (lowered.indexOf(themeTokens[tokenIndex]) >= 0) {
            tokenMatch = true;
            break;
          }
        }
        if (!tokenMatch) {
          logError(enemyName + ' sprite branch does not appear to reference expected theme tokens');
          failed++;
          continue;
        }
      }

      logSuccess(enemyName + ' has explicit, name-themed sprite branch');
      passed++;
    }

    for (var key in signatures) {
      if (!signatures.hasOwnProperty(key)) continue;
      var owners = signatures[key];
      if (owners.length > 1) {
        logError('Duplicate sprite branch body detected: ' + owners.join(', '));
        failed += owners.length;
        passed -= owners.length;
      }
    }

    if (passed < 0) passed = 0;
    logInfo('Enemy Sprite Validation: ' + passed + ' passed, ' + failed + ' failed');
    return { passed: passed, failed: failed };
  }

  return {
    testUniqueNpcNames: testUniqueNpcNames,
    testUniqueNpcLooks: testUniqueNpcLooks,
    testUniqueEnemyLooks: testUniqueEnemyLooks,
    testEnemySpriteDistinctnessAndTheme: testEnemySpriteDistinctnessAndTheme
  };
}));