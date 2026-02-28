(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.vcTestLib = root.vcTestLib || {};
    root.vcTestLib.logging = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
  };

  function createLogger() {
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

    return {
      log: log,
      logSection: logSection,
      logSuccess: logSuccess,
      logError: logError,
      logWarning: logWarning,
      logInfo: logInfo
    };
  }

  return {
    createLogger: createLogger
  };
}));