(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.vcTestSuites = root.vcTestSuites || {};
    root.vcTestSuites.vendors = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function getNpcVendorKey(npc) {
    return (npc.vendorName || npc.name || '').toString();
  }

  function testFoodCartVendors(ctx) {
    var maps = ctx.maps;
    var consumableItems = ctx.consumableItems;
    var logSection = ctx.logSection;
    var logInfo = ctx.logInfo;
    var logSuccess = ctx.logSuccess;
    var logError = ctx.logError;
    var log = ctx.log;

    logSection('TEST 1: Food Cart Vendors');

    var foodCartNPCs = [];

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

    for (var j = 0; j < foodCartNPCs.length; j++) {
      var vendorNpc = foodCartNPCs[j];
      var items = [];

      for (var k = 0; k < consumableItems.length; k++) {
        var item = consumableItems[k];
        if (item.vendor && item.vendor.trim().toLowerCase() === vendorNpc.vendorKey.trim().toLowerCase()) {
          items.push(item);
        }
      }

      if (items.length > 0) {
        logSuccess(vendorNpc.name + ' [' + vendorNpc.vendorKey + '] (' + vendorNpc.map + '): ' + items.length + ' item(s)');
        for (var m = 0; m < items.length; m++) {
          logInfo('  - ' + items[m].name + ' ($' + items[m].price + ')');
        }
        passCount++;
      } else {
        logError(vendorNpc.name + ' (' + vendorNpc.map + '): NO ITEMS FOUND');
        failCount++;
      }
    }

    log('', 'reset');
    logInfo('Food Cart Tests: ' + passCount + ' passed, ' + failCount + ' failed');
    return { passed: passCount, failed: failCount };
  }

  function testShopVendors(ctx) {
    var maps = ctx.maps;
    var shopItems = ctx.shopItems;
    var logSection = ctx.logSection;
    var logInfo = ctx.logInfo;
    var logSuccess = ctx.logSuccess;
    var logError = ctx.logError;

    logSection('TEST 2: Shop Vendors (Fixed Shops)');

    var shopVendors = [];

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

    if (shopItems.length > 0) {
      logSuccess('Global shop items: ' + shopItems.length + ' item(s)');
      for (var j = 0; j < shopItems.length; j++) {
        logInfo('  - ' + shopItems[j].name + ' ($' + shopItems[j].price + ')');
      }
      logInfo('All ' + shopVendors.length + ' shop location(s) can access these items');
      return { passed: shopVendors.length, failed: 0 };
    }

    logError('No global shop items found!');
    return { passed: 0, failed: shopVendors.length };
  }

  function testMagicTrainers(ctx) {
    var maps = ctx.maps;
    var magicTraining = ctx.magicTraining;
    var logSection = ctx.logSection;
    var logInfo = ctx.logInfo;
    var logSuccess = ctx.logSuccess;
    var logError = ctx.logError;

    logSection('TEST 3: Magic Trainers');

    var magicTrainers = [];

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
      for (var j = 0; j < magicTraining.length; j++) {
        var training = magicTraining[j];
        logInfo('  - ' + training.name + ' ($' + training.price + '): Learn ' + training.spell);
      }
      logInfo('All ' + magicTrainers.length + ' magic trainer(s) can teach these spells');

      for (var k = 0; k < magicTrainers.length; k++) {
        var trainer = magicTrainers[k];
        logInfo('  - ' + trainer.name + ' (' + trainer.map + ')');
      }

      return { passed: magicTrainers.length, failed: 0 };
    }

    logError('No magic training found!');
    return { passed: 0, failed: magicTrainers.length };
  }

  function testYogaInstructors(ctx) {
    var maps = ctx.maps;
    var yogaTechniques = ctx.yogaTechniques;
    var logSection = ctx.logSection;
    var logInfo = ctx.logInfo;
    var logSuccess = ctx.logSuccess;
    var logError = ctx.logError;

    logSection('TEST 4: Yoga Instructors');

    var yogaInstructors = [];

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
      for (var j = 0; j < yogaTechniques.length; j++) {
        var technique = yogaTechniques[j];
        logInfo('  - ' + technique.name + ' ($' + technique.price + '): Learn ' + technique.skill);
      }
      logInfo('All ' + yogaInstructors.length + ' yoga instructor(s) can teach these techniques');

      for (var k = 0; k < yogaInstructors.length; k++) {
        var instructor = yogaInstructors[k];
        logInfo('  - ' + instructor.name + ' (' + instructor.map + ')');
      }

      return { passed: yogaInstructors.length, failed: 0 };
    }

    logError('No yoga techniques found!');
    return { passed: 0, failed: yogaInstructors.length };
  }

  function testVendorNameConsistency(ctx) {
    var maps = ctx.maps;
    var consumableItems = ctx.consumableItems;
    var logSection = ctx.logSection;
    var logInfo = ctx.logInfo;
    var logSuccess = ctx.logSuccess;
    var logError = ctx.logError;
    var logWarning = ctx.logWarning;
    var log = ctx.log;

    logSection('TEST 5: Vendor Name Consistency Check');

    var vendorNamesInMaps = [];
    var passCount = 0;
    var failCount = 0;

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

    for (var j = 0; j < vendorNamesInMaps.length; j++) {
      var vendorName = vendorNamesInMaps[j];
      var items = [];

      for (var k = 0; k < consumableItems.length; k++) {
        var item = consumableItems[k];
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

    var vendorNamesInData = [];
    for (var m = 0; m < consumableItems.length; m++) {
      var dataItem = consumableItems[m];
      if (dataItem.vendor && vendorNamesInData.indexOf(dataItem.vendor) === -1) {
        vendorNamesInData.push(dataItem.vendor);
      }
    }

    for (var n = 0; n < vendorNamesInData.length; n++) {
      var dataVendorName = vendorNamesInData[n];
      var found = false;

      for (var p = 0; p < vendorNamesInMaps.length; p++) {
        if (vendorNamesInMaps[p].trim().toLowerCase() === dataVendorName.trim().toLowerCase()) {
          found = true;
          break;
        }
      }

      if (!found) {
        logWarning('"' + dataVendorName + '": Defined in data.js but has no NPC in any map');
      }
    }

    log('', 'reset');
    logInfo('Vendor Name Consistency: ' + passCount + ' matched, ' + failCount + ' unmatched');
    return { passed: passCount, failed: failCount };
  }

  return {
    testFoodCartVendors: testFoodCartVendors,
    testShopVendors: testShopVendors,
    testMagicTrainers: testMagicTrainers,
    testYogaInstructors: testYogaInstructors,
    testVendorNameConsistency: testVendorNameConsistency
  };
}));