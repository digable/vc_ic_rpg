(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.vcTestSuites = root.vcTestSuites || {};
    root.vcTestSuites.schema = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function isObject(value) {
    return !!value && typeof value === 'object' && !Array.isArray(value);
  }

  function isNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
  }

  function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  function pass(logSuccess, label) {
    logSuccess(label);
    return { passed: 1, failed: 0 };
  }

  function fail(logError, label) {
    logError(label);
    return { passed: 0, failed: 1 };
  }

  function mergeTotals(total, result) {
    total.passed += result.passed;
    total.failed += result.failed;
  }

  function validateMapSchema(ctx, totals) {
    var maps = ctx.maps;
    var logInfo = ctx.logInfo;
    var logSuccess = ctx.logSuccess;
    var logError = ctx.logError;

    if (!isObject(maps) || Object.keys(maps).length === 0) {
      mergeTotals(totals, fail(logError, 'maps.js exports a non-empty maps object'));
      return;
    }

    mergeTotals(totals, pass(logSuccess, 'maps.js exports a non-empty maps object'));

    var validDirections = { up: true, down: true, left: true, right: true };
    var mapKeys = Object.keys(maps);
    logInfo('Validating ' + mapKeys.length + ' map definition(s)');

    for (var i = 0; i < mapKeys.length; i++) {
      var mapKey = mapKeys[i];
      var mapData = maps[mapKey];

      if (!isObject(mapData)) {
        mergeTotals(totals, fail(logError, 'Map "' + mapKey + '" is an object'));
        continue;
      }

      if (!Number.isInteger(mapData.width) || mapData.width <= 0 || !Number.isInteger(mapData.height) || mapData.height <= 0) {
        mergeTotals(totals, fail(logError, 'Map "' + mapKey + '" has positive integer width/height'));
      } else {
        mergeTotals(totals, pass(logSuccess, 'Map "' + mapKey + '" width/height are valid'));
      }

      if (!Array.isArray(mapData.tiles) || mapData.tiles.length !== mapData.height) {
        mergeTotals(totals, fail(logError, 'Map "' + mapKey + '" tiles match height'));
      } else {
        var tilesValid = true;
        for (var rowIndex = 0; rowIndex < mapData.tiles.length; rowIndex++) {
          var row = mapData.tiles[rowIndex];
          if (!Array.isArray(row) || row.length !== mapData.width) {
            tilesValid = false;
            break;
          }
          for (var colIndex = 0; colIndex < row.length; colIndex++) {
            if (!isNumber(row[colIndex])) {
              tilesValid = false;
              break;
            }
          }
          if (!tilesValid) break;
        }

        if (!tilesValid) {
          mergeTotals(totals, fail(logError, 'Map "' + mapKey + '" tiles are numeric ' + mapData.width + 'x' + mapData.height + ' grid'));
        } else {
          mergeTotals(totals, pass(logSuccess, 'Map "' + mapKey + '" tile grid shape is valid'));
        }
      }

      if (!isNonEmptyString(mapData.name)) {
        mergeTotals(totals, fail(logError, 'Map "' + mapKey + '" has a display name'));
      } else {
        mergeTotals(totals, pass(logSuccess, 'Map "' + mapKey + '" has a display name'));
      }

      if (!Array.isArray(mapData.npcs)) {
        mergeTotals(totals, fail(logError, 'Map "' + mapKey + '" has npc array'));
      } else {
        mergeTotals(totals, pass(logSuccess, 'Map "' + mapKey + '" has npc array'));
        for (var npcIndex = 0; npcIndex < mapData.npcs.length; npcIndex++) {
          var npc = mapData.npcs[npcIndex];
          var npcLabel = 'Map "' + mapKey + '" NPC #' + npcIndex;
          var npcOk = isObject(npc) && isNumber(npc.x) && isNumber(npc.y) && isNonEmptyString(npc.name) && Array.isArray(npc.dialogue);
          if (!npcOk) {
            mergeTotals(totals, fail(logError, npcLabel + ' has x/y/name/dialogue[]'));
          } else {
            mergeTotals(totals, pass(logSuccess, npcLabel + ' shape valid'));
          }
        }
      }

      if (!Array.isArray(mapData.exits)) {
        mergeTotals(totals, fail(logError, 'Map "' + mapKey + '" has exits array'));
      } else {
        mergeTotals(totals, pass(logSuccess, 'Map "' + mapKey + '" has exits array'));
        for (var exitIndex = 0; exitIndex < mapData.exits.length; exitIndex++) {
          var exit = mapData.exits[exitIndex];
          var exitLabel = 'Map "' + mapKey + '" exit #' + exitIndex;
          var exitOk = isObject(exit) && isNumber(exit.x) && isNumber(exit.y) && isNumber(exit.toX) && isNumber(exit.toY) && isNonEmptyString(exit.toMap) && !!validDirections[exit.direction];
          if (!exitOk) {
            mergeTotals(totals, fail(logError, exitLabel + ' has x/y/toMap/toX/toY/direction'));
            continue;
          }
          if (!maps[exit.toMap]) {
            mergeTotals(totals, fail(logError, exitLabel + ' destination exists (' + exit.toMap + ')'));
          } else {
            mergeTotals(totals, pass(logSuccess, exitLabel + ' destination exists'));
          }
        }
      }
    }
  }

  function validateQuestSchema(ctx, totals) {
    var questDatabase = ctx.questDatabase;
    var maps = ctx.maps;
    var logInfo = ctx.logInfo;
    var logSuccess = ctx.logSuccess;
    var logError = ctx.logError;

    if (!isObject(questDatabase) || Object.keys(questDatabase).length === 0) {
      mergeTotals(totals, fail(logError, 'quests.js exports a non-empty quest database object'));
      return;
    }

    mergeTotals(totals, pass(logSuccess, 'quests.js exports a non-empty quest database object'));

    var questKeys = Object.keys(questDatabase);
    logInfo('Validating ' + questKeys.length + ' quest definition(s)');

    for (var i = 0; i < questKeys.length; i++) {
      var questKey = questKeys[i];
      var quest = questDatabase[questKey];
      if (!isObject(quest)) {
        mergeTotals(totals, fail(logError, 'Quest "' + questKey + '" is an object'));
        continue;
      }

      var requiredStringFields = ['id', 'name', 'giver', 'location', 'description'];
      var baseValid = true;
      for (var fieldIndex = 0; fieldIndex < requiredStringFields.length; fieldIndex++) {
        var fieldName = requiredStringFields[fieldIndex];
        if (!isNonEmptyString(quest[fieldName])) {
          baseValid = false;
          break;
        }
      }

      if (!baseValid) {
        mergeTotals(totals, fail(logError, 'Quest "' + questKey + '" has id/name/giver/location/description'));
      } else {
        mergeTotals(totals, pass(logSuccess, 'Quest "' + questKey + '" core fields are valid'));
      }

      if (quest.id !== questKey) {
        mergeTotals(totals, fail(logError, 'Quest key/id match for "' + questKey + '"'));
      } else {
        mergeTotals(totals, pass(logSuccess, 'Quest key/id match for "' + questKey + '"'));
      }

      if (!maps[quest.location]) {
        mergeTotals(totals, fail(logError, 'Quest "' + questKey + '" location exists in maps (' + quest.location + ')'));
      } else {
        mergeTotals(totals, pass(logSuccess, 'Quest "' + questKey + '" location exists in maps'));
      }

      if (!Array.isArray(quest.objectives) || quest.objectives.length === 0) {
        mergeTotals(totals, fail(logError, 'Quest "' + questKey + '" has non-empty objectives array'));
      } else {
        mergeTotals(totals, pass(logSuccess, 'Quest "' + questKey + '" objectives array exists'));
        for (var objectiveIndex = 0; objectiveIndex < quest.objectives.length; objectiveIndex++) {
          var objective = quest.objectives[objectiveIndex];
          var objectiveLabel = 'Quest "' + questKey + '" objective #' + objectiveIndex;

          if (!isObject(objective) || !isNonEmptyString(objective.type)) {
            mergeTotals(totals, fail(logError, objectiveLabel + ' has a valid type'));
            continue;
          }

          var objectiveValid = true;
          if (objective.type === 'defeat_enemy') {
            objectiveValid = isNonEmptyString(objective.enemy) && isNumber(objective.needed);
          } else if (objective.type === 'visit_location') {
            objectiveValid = isNonEmptyString(objective.location);
          } else if (objective.type === 'bring_item') {
            objectiveValid = isNonEmptyString(objective.item);
          } else if (objective.type === 'buy_from_vendor') {
            objectiveValid = isNonEmptyString(objective.vendor);
          } else if (objective.type === 'reach_level') {
            objectiveValid = isNumber(objective.level);
          } else if (objective.type === 'collect_gold') {
            objectiveValid = isNumber(objective.needed) || isNumber(objective.amount);
          }

          if (!objectiveValid) {
            mergeTotals(totals, fail(logError, objectiveLabel + ' contains required fields for type ' + objective.type));
          } else {
            mergeTotals(totals, pass(logSuccess, objectiveLabel + ' is valid'));
          }
        }
      }

      if (!isObject(quest.rewards)) {
        mergeTotals(totals, fail(logError, 'Quest "' + questKey + '" has rewards object'));
      } else {
        mergeTotals(totals, pass(logSuccess, 'Quest "' + questKey + '" has rewards object'));
      }

      var dialogue = quest.dialogue;
      var dialogueValid = isObject(dialogue) && Array.isArray(dialogue.offer) && Array.isArray(dialogue.progress) && Array.isArray(dialogue.complete);
      if (!dialogueValid) {
        mergeTotals(totals, fail(logError, 'Quest "' + questKey + '" has dialogue offer/progress/complete arrays'));
      } else {
        mergeTotals(totals, pass(logSuccess, 'Quest "' + questKey + '" dialogue shape valid'));
      }
    }
  }

  function validateEnemySchema(ctx, totals) {
    var enemies = ctx.enemiesList;
    var maps = ctx.maps;
    var logInfo = ctx.logInfo;
    var logSuccess = ctx.logSuccess;
    var logError = ctx.logError;

    if (!Array.isArray(enemies) || enemies.length === 0) {
      mergeTotals(totals, fail(logError, 'enemies.js exports a non-empty enemies array'));
      return;
    }
    mergeTotals(totals, pass(logSuccess, 'enemies.js exports a non-empty enemies array'));

    logInfo('Validating ' + enemies.length + ' enemy definition(s)');
    for (var i = 0; i < enemies.length; i++) {
      var enemy = enemies[i];
      var label = 'Enemy #' + i + ' (' + (enemy && enemy.name ? enemy.name : 'unknown') + ')';
      var coreValid = isObject(enemy) && isNonEmptyString(enemy.name) && isNumber(enemy.hp) && isNumber(enemy.maxHp) && isNumber(enemy.attack) && isNumber(enemy.exp) && isNumber(enemy.gold);

      if (!coreValid) {
        mergeTotals(totals, fail(logError, label + ' has name/hp/maxHp/attack/exp/gold'));
      } else {
        mergeTotals(totals, pass(logSuccess, label + ' core fields are valid'));
      }

      var placementValid = (typeof enemy.outdoor === 'boolean') || isNonEmptyString(enemy.location);
      if (!placementValid) {
        mergeTotals(totals, fail(logError, label + ' defines outdoor boolean or location string'));
      } else {
        mergeTotals(totals, pass(logSuccess, label + ' placement field is valid'));
      }

      if (isNonEmptyString(enemy.location)) {
        if (!maps[enemy.location]) {
          mergeTotals(totals, fail(logError, label + ' location exists in maps (' + enemy.location + ')'));
        } else {
          mergeTotals(totals, pass(logSuccess, label + ' location exists in maps'));
        }
      }

      if (enemy.specialAttack !== null && enemy.specialAttack !== undefined) {
        var special = enemy.specialAttack;
        var specialValid = isObject(special) && isNonEmptyString(special.name) && isNumber(special.damage);
        if (!specialValid) {
          mergeTotals(totals, fail(logError, label + ' specialAttack shape is valid'));
        } else {
          mergeTotals(totals, pass(logSuccess, label + ' specialAttack shape is valid'));
        }
      }
    }
  }

  function validateDataSchema(ctx, totals) {
    var maps = ctx.maps;
    var shopItems = ctx.shopItems;
    var consumableItems = ctx.consumableItems;
    var magicTraining = ctx.magicTraining;
    var yogaTechniques = ctx.yogaTechniques;
    var cambusRoutes = ctx.cambusRoutes;
    var logInfo = ctx.logInfo;
    var logSuccess = ctx.logSuccess;
    var logError = ctx.logError;

    function validateNamedPricedArray(label, arr) {
      if (!Array.isArray(arr) || arr.length === 0) {
        mergeTotals(totals, fail(logError, label + ' is a non-empty array'));
        return;
      }

      mergeTotals(totals, pass(logSuccess, label + ' is a non-empty array'));
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        var itemLabel = label + ' item #' + i;
        if (!isObject(item) || !isNonEmptyString(item.name) || !isNumber(item.price) || !isNonEmptyString(item.description)) {
          mergeTotals(totals, fail(logError, itemLabel + ' has name/price/description'));
        } else {
          mergeTotals(totals, pass(logSuccess, itemLabel + ' shape valid'));
        }
      }
    }

    logInfo('Validating core arrays from data.js');

    validateNamedPricedArray('shopItems', shopItems);
    validateNamedPricedArray('consumableItems', consumableItems);
    validateNamedPricedArray('magicTraining', magicTraining);
    validateNamedPricedArray('yogaTechniques', yogaTechniques);

    if (!Array.isArray(cambusRoutes) || cambusRoutes.length === 0) {
      mergeTotals(totals, fail(logError, 'cambusRoutes is a non-empty array'));
      return;
    }

    mergeTotals(totals, pass(logSuccess, 'cambusRoutes is a non-empty array'));
    for (var routeIndex = 0; routeIndex < cambusRoutes.length; routeIndex++) {
      var route = cambusRoutes[routeIndex];
      var routeLabel = 'cambusRoutes item #' + routeIndex;
      var routeValid = isObject(route) && isNonEmptyString(route.name) && isNonEmptyString(route.map) && isNumber(route.x) && isNumber(route.y);
      if (!routeValid) {
        mergeTotals(totals, fail(logError, routeLabel + ' has name/map/x/y'));
        continue;
      }

      if (!maps[route.map]) {
        mergeTotals(totals, fail(logError, routeLabel + ' map exists in maps (' + route.map + ')'));
      } else {
        mergeTotals(totals, pass(logSuccess, routeLabel + ' map exists in maps'));
      }
    }
  }

  function testCoreDataSchemas(ctx) {
    var logSection = ctx.logSection;
    var logInfo = ctx.logInfo;
    var totals = { passed: 0, failed: 0 };

    logSection('SCHEMA: Core Data Validation');
    logInfo('Running lightweight schema checks for maps, quests, enemies, and data arrays');

    validateMapSchema(ctx, totals);
    validateQuestSchema(ctx, totals);
    validateEnemySchema(ctx, totals);
    validateDataSchema(ctx, totals);

    logInfo('Schema validation: ' + totals.passed + ' passed, ' + totals.failed + ' failed');
    return totals;
  }

  return {
    testCoreDataSchemas: testCoreDataSchemas
  };
}));