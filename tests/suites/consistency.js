(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.vcTestSuites = root.vcTestSuites || {};
    root.vcTestSuites.consistency = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function testMiniMapTopLevelLocations(ctx) {
    var maps = ctx.maps;
    var logSection = ctx.logSection;
    var logInfo = ctx.logInfo;
    var logSuccess = ctx.logSuccess;
    var logError = ctx.logError;

    if (typeof require === 'undefined') {
      return { passed: 0, failed: 0, skipped: true, reason: 'Node-only test (file read unavailable)' };
    }

    var fs;
    var path;
    try {
      fs = require('fs');
      path = require('path');
    } catch (e) {
      return { passed: 0, failed: 0, skipped: true, reason: 'Node fs/path unavailable' };
    }

    logSection('MINIMAP: Top-Level Location Coverage');

    var uiPath = path.join(__dirname, '..', '..', 'js', 'rendering', 'ui.js');
    var uiSource = '';
    try {
      uiSource = fs.readFileSync(uiPath, 'utf8');
    } catch (e) {
      logError('Could not read js/rendering/ui.js');
      return { passed: 0, failed: 1 };
    }

    var mapTabStart = uiSource.lastIndexOf('} else if (game.menuTab === 1) {');
    var mapTabEnd = uiSource.indexOf('} else if (game.menuTab === 2) {', mapTabStart);
    if (mapTabStart === -1 || mapTabEnd === -1) {
      logError('Could not locate menu map tab block in ui.js');
      return { passed: 0, failed: 1 };
    }

    var mapTabCode = uiSource.slice(mapTabStart, mapTabEnd);
    var minimapMaps = [];
    var minimapMapLookup = {};
    var mapRegex = /map:\s*'([^']+)'/g;
    var match;
    while ((match = mapRegex.exec(mapTabCode)) !== null) {
      var mapKey = match[1];
      if (!minimapMapLookup[mapKey]) {
        minimapMapLookup[mapKey] = true;
        minimapMaps.push(mapKey);
      }
    }

    var expectedTopLevel = [];
    for (var mapKey in maps) {
      if (!maps.hasOwnProperty(mapKey)) continue;
      if (mapKey.indexOf('beer_caves_depths_') === 0) continue;
      expectedTopLevel.push(mapKey);
    }

    var passed = 0;
    var failed = 0;

    for (var i = 0; i < expectedTopLevel.length; i++) {
      var expectedKey = expectedTopLevel[i];
      if (minimapMapLookup[expectedKey]) {
        logSuccess('Top-level map included: ' + expectedKey);
        passed++;
      } else {
        logError('Missing top-level map in minimap: ' + expectedKey);
        failed++;
      }
    }

    logInfo('Minimap entries detected: ' + minimapMaps.join(', '));
    logInfo('Minimap coverage: ' + passed + ' passed, ' + failed + ' failed');
    return { passed: passed, failed: failed };
  }

  function testReadmeConsistency(ctx) {
    var logSection = ctx.logSection;
    var logInfo = ctx.logInfo;
    var logSuccess = ctx.logSuccess;
    var logError = ctx.logError;

    if (typeof require === 'undefined') {
      return { passed: 0, failed: 0, skipped: true, reason: 'Node-only test (file read unavailable)' };
    }

    var fs;
    var path;
    try {
      fs = require('fs');
      path = require('path');
    } catch (e) {
      return { passed: 0, failed: 0, skipped: true, reason: 'Node fs/path unavailable' };
    }

    logSection('README: Consistency Check');

    var readmePath = path.join(__dirname, '..', '..', 'README.md');
    var readme = '';
    try {
      readme = fs.readFileSync(readmePath, 'utf8');
    } catch (e) {
      logError('Could not read README.md');
      return { passed: 0, failed: 1 };
    }

    var passed = 0;
    var failed = 0;

    var requiredMentions = [
      'tests.js',
      'TESTING.md',
      'music.js',
      'npc-appearance.js',
      'enemy-appearance.js'
    ];

    for (var i = 0; i < requiredMentions.length; i++) {
      var token = requiredMentions[i];
      if (readme.indexOf(token) !== -1) {
        logSuccess('README mentions ' + token);
        passed++;
      } else {
        logError('README missing expected reference: ' + token);
        failed++;
      }
    }

    var stalePattern = /(^|\n)\s*[├└│\-\s]*test\.js\b/m;
    if (stalePattern.test(readme)) {
      logError('README still references stale test.js entry');
      failed++;
    } else {
      logSuccess('README has no stale test.js project entry');
      passed++;
    }

    logInfo('README consistency: ' + passed + ' passed, ' + failed + ' failed');
    return { passed: passed, failed: failed };
  }

  return {
    testMiniMapTopLevelLocations: testMiniMapTopLevelLocations,
    testReadmeConsistency: testReadmeConsistency
  };
}));