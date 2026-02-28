// Test entrypoint wrapper
// Keeps `node tests.js` stable while implementation lives in `tests/runner.js`.

if (typeof require !== 'undefined') {
  const runner = require('./tests/runner.js');
  const runTests = runner.runTests;

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { runTests };

    if (require.main === module) {
      runTests();
    }
  }
}
