(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.vcTestSuites = root.vcTestSuites || {};
    root.vcTestSuites.items = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function testItemConsolidation(ctx) {
    var logSection = ctx.logSection;
    var logInfo = ctx.logInfo;
    var logSuccess = ctx.logSuccess;
    var logError = ctx.logError;
    var log = ctx.log;

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

    addConsumable({ name: 'Hi-Potion', effect: 'healHP', amount: 50, description: 'Restores 50 HP' });
    if (gameState.consumables[1].count === 4) {
      logSuccess('Add existing item: Hi-Potion count increased to 4');
      passed++;
    } else {
      logError('Add existing item: Expected count 4, got ' + gameState.consumables[1].count);
      failed++;
    }

    addConsumable({ name: 'Ether', effect: 'healMP', amount: 30, description: 'Restores 30 MP' });
    var hasEther = false;
    for (var j = 0; j < gameState.consumables.length; j++) {
      if (gameState.consumables[j].name === 'Ether' && gameState.consumables[j].count === 1) {
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

    removeConsumable(1);
    removeConsumable(1);
    removeConsumable(1);
    removeConsumable(1);
    var hiPotionExists = false;
    for (var k = 0; k < gameState.consumables.length; k++) {
      if (gameState.consumables[k].name === 'Hi-Potion') {
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

  return {
    testItemConsolidation: testItemConsolidation
  };
}));