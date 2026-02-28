(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.vcTestLib = root.vcTestLib || {};
    root.vcTestLib.context = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function createTestContext(data, logger) {
    return {
      maps: data.maps,
      shopItems: data.shopItems,
      consumableItems: data.consumableItems,
      magicTraining: data.magicTraining,
      yogaTechniques: data.yogaTechniques,
      cambusRoutes: data.cambusRoutes,
      getNpcAppearanceSignature: data.getNpcAppearanceSignature,
      getEnemyAppearanceSignature: data.getEnemyAppearanceSignature,
      enemiesList: data.enemiesList,
      log: logger.log,
      logSection: logger.logSection,
      logSuccess: logger.logSuccess,
      logError: logger.logError,
      logWarning: logger.logWarning,
      logInfo: logger.logInfo
    };
  }

  return {
    createTestContext: createTestContext
  };
}));