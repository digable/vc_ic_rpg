(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.vcTestSuites = root.vcTestSuites || {};
    root.vcTestSuites.walking = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
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

  function testWalkingExitsAccessible(ctx) {
    var maps = ctx.maps;
    var logSection = ctx.logSection;
    var logInfo = ctx.logInfo;
    var logSuccess = ctx.logSuccess;
    var logError = ctx.logError;

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

  function testWalkingTransitionsRoundTrip(ctx) {
    var maps = ctx.maps;
    var logSection = ctx.logSection;
    var logInfo = ctx.logInfo;
    var logSuccess = ctx.logSuccess;
    var logError = ctx.logError;

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

        var canReturn = canReachExitFromSpawn(toMap, forwardExit.toX, forwardExit.toY, reverseExit);
        if (!canReturn) {
          logError(label + ': cannot reliably reach reverse exit from destination spawn');
          failed++;
          continue;
        }

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

  function testNpcReachabilityAllMaps(ctx) {
    var maps = ctx.maps;
    var logSection = ctx.logSection;
    var logInfo = ctx.logInfo;
    var logSuccess = ctx.logSuccess;
    var logError = ctx.logError;
    var logWarning = ctx.logWarning;

    logSection('NPC REACHABILITY: All Maps');

    function key(x, y) {
      return x + ',' + y;
    }

    function inBounds(mapData, x, y) {
      return x >= 0 && x < mapData.width * 16 && y >= 0 && y < mapData.height * 16;
    }

    var passed = 0;
    var failed = 0;
    var skippedMaps = 0;

    for (var mapName in maps) {
      if (!maps.hasOwnProperty(mapName)) continue;

      var mapData = maps[mapName];
      var npcs = mapData.npcs || [];
      if (npcs.length === 0) continue;

      var ingressPoints = [];
      for (var sourceMapName in maps) {
        if (!maps.hasOwnProperty(sourceMapName)) continue;
        var exits = maps[sourceMapName].exits || [];
        for (var exitIndex = 0; exitIndex < exits.length; exitIndex++) {
          var exit = exits[exitIndex];
          if (exit.toMap === mapName) {
            ingressPoints.push({ x: exit.toX, y: exit.toY, from: sourceMapName });
          }
        }
      }

      if (ingressPoints.length === 0) {
        logWarning(mapName + ': no ingress points found (skipping NPC reachability check for this map)');
        skippedMaps++;
        continue;
      }

      var reachable = {};
      var queue = [];

      for (var ingressIndex = 0; ingressIndex < ingressPoints.length; ingressIndex++) {
        var start = ingressPoints[ingressIndex];
        if (!inBounds(mapData, start.x, start.y)) continue;
        if (!isPointWalkAccessible(mapData, start.x, start.y)) continue;

        var startKey = key(start.x, start.y);
        if (!reachable[startKey]) {
          reachable[startKey] = true;
          queue.push({ x: start.x, y: start.y });
        }
      }

      while (queue.length > 0) {
        var current = queue.shift();
        var neighbors = [
          { x: current.x + 16, y: current.y },
          { x: current.x - 16, y: current.y },
          { x: current.x, y: current.y + 16 },
          { x: current.x, y: current.y - 16 }
        ];

        for (var neighborIndex = 0; neighborIndex < neighbors.length; neighborIndex++) {
          var n = neighbors[neighborIndex];
          if (!inBounds(mapData, n.x, n.y)) continue;
          if (!isPointWalkAccessible(mapData, n.x, n.y)) continue;

          var nKey = key(n.x, n.y);
          if (reachable[nKey]) continue;
          reachable[nKey] = true;
          queue.push(n);
        }
      }

      for (var npcIndex = 0; npcIndex < npcs.length; npcIndex++) {
        var npc = npcs[npcIndex];
        var interactable = false;

        for (var posKey in reachable) {
          if (!reachable.hasOwnProperty(posKey)) continue;
          var parts = posKey.split(',');
          var x = parseInt(parts[0], 10);
          var y = parseInt(parts[1], 10);
          var dist = Math.sqrt((x - npc.x) * (x - npc.x) + (y - npc.y) * (y - npc.y));
          if (dist < 24) {
            interactable = true;
            break;
          }
        }

        if (interactable) {
          logSuccess(mapName + ' :: ' + npc.name + ': interactable from ingress-reachable walkable positions');
          passed++;
        } else {
          logError(mapName + ' :: ' + npc.name + ': NOT interactable from ingress-reachable walkable positions');
          failed++;
        }
      }
    }

    if (skippedMaps > 0) {
      logInfo('NPC reachability maps skipped (no ingress): ' + skippedMaps);
    }
    logInfo('NPC reachability (all maps): ' + passed + ' passed, ' + failed + ' failed');
    return { passed: passed, failed: failed };
  }

  return {
    testWalkingExitsAccessible: testWalkingExitsAccessible,
    testWalkingTransitionsRoundTrip: testWalkingTransitionsRoundTrip,
    testNpcReachabilityAllMaps: testNpcReachabilityAllMaps
  };
}));