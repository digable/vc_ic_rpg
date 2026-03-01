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

    var decisionsPath = path.join(__dirname, '..', '..', 'js', 'features', 'ui', 'menu-decisions.js');
    var decisionsSource = '';
    try {
      decisionsSource = fs.readFileSync(decisionsPath, 'utf8');
    } catch (e) {
      logError('Could not read js/features/ui/menu-decisions.js');
      return { passed: 0, failed: 1 };
    }

    var areasBlockMatch = decisionsSource.match(/const\s+MAP_AREAS\s*=\s*\[([\s\S]*?)\];/);
    if (!areasBlockMatch) {
      logError('Could not locate MAP_AREAS block in menu-decisions.js');
      return { passed: 0, failed: 1 };
    }

    var mapTabCode = areasBlockMatch[1];
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

  function collectJsFiles(fs, path, directory, out) {
    var entries = fs.readdirSync(directory, { withFileTypes: true });
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      var entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        collectJsFiles(fs, path, entryPath, out);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.js')) {
        out.push(entryPath);
      }
    }
  }

  function testStateMutationPolicy(ctx) {
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

    logSection('STATE: Mutation Policy');

    var jsRoot = path.join(__dirname, '..', '..', 'js');
    var actionFile = path.join(jsRoot, 'game-state.js');
    var files = [];

    try {
      collectJsFiles(fs, path, jsRoot, files);
    } catch (e) {
      logError('Could not enumerate JS files for state policy check');
      return { passed: 0, failed: 1 };
    }

    var topLevelViolations = [];
    var nestedViolations = [];
    var allowedNestedRoots = {
      player: true,
      battleState: true
    };
    var allowedNestedExact = {};

    for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {
      var filePath = files[fileIndex];
      var source = '';

      try {
        source = fs.readFileSync(filePath, 'utf8');
      } catch (e) {
        topLevelViolations.push({
          file: filePath,
          line: 0,
          text: 'Could not read file'
        });
        continue;
      }

      var lines = source.split(/\r?\n/);

      for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        var line = lines[lineIndex];

        var topLevelMatch = line.match(/\bgame\.([A-Za-z0-9_]+)\s*=\s*(?!=)/);
        if (topLevelMatch && filePath !== actionFile) {
          topLevelViolations.push({
            file: filePath,
            line: lineIndex + 1,
            text: line.trim()
          });
        }

        var nestedRegex = /\bgame\.([A-Za-z0-9_]+)\.([A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)*)\s*=\s*(?!=)/g;
        var nestedMatch;
        while ((nestedMatch = nestedRegex.exec(line)) !== null) {
          var root = nestedMatch[1];
          var expr = 'game.' + root + '.' + nestedMatch[2];
          var allowed = !!allowedNestedRoots[root] || !!allowedNestedExact[expr];
          if (!allowed) {
            nestedViolations.push({
              file: filePath,
              line: lineIndex + 1,
              text: line.trim(),
              expr: expr
            });
          }
        }
      }
    }

    var passed = 0;
    var failed = 0;

    if (topLevelViolations.length === 0) {
      logSuccess('Top-level game.* assignments are confined to js/game-state.js');
      passed++;
    } else {
      var topPreview = Math.min(8, topLevelViolations.length);
      for (var t = 0; t < topPreview; t++) {
        var topViolation = topLevelViolations[t];
        var topRelPath = path.relative(path.join(__dirname, '..', '..'), topViolation.file).replace(/\\/g, '/');
        logError('Top-level write outside action module: ' + topRelPath + ':' + topViolation.line + ' -> ' + topViolation.text);
      }
      if (topLevelViolations.length > topPreview) {
        logError('... plus ' + (topLevelViolations.length - topPreview) + ' more top-level violation(s)');
      }
      failed += topLevelViolations.length;
    }

    if (nestedViolations.length === 0) {
      logSuccess('Nested direct assignments are limited to allowed exceptions (player, battleState)');
      passed++;
    } else {
      var nestedPreview = Math.min(8, nestedViolations.length);
      for (var n = 0; n < nestedPreview; n++) {
        var nestedViolation = nestedViolations[n];
        var nestedRelPath = path.relative(path.join(__dirname, '..', '..'), nestedViolation.file).replace(/\\/g, '/');
        logError('Disallowed nested write: ' + nestedRelPath + ':' + nestedViolation.line + ' (' + nestedViolation.expr + ')');
      }
      if (nestedViolations.length > nestedPreview) {
        logError('... plus ' + (nestedViolations.length - nestedPreview) + ' more nested violation(s)');
      }
      failed += nestedViolations.length;
    }

    logInfo('State mutation policy: ' + passed + ' passed, ' + failed + ' failed');
    return { passed: passed, failed: failed };
  }

  return {
    testMiniMapTopLevelLocations: testMiniMapTopLevelLocations,
    testReadmeConsistency: testReadmeConsistency,
    testStateMutationPolicy: testStateMutationPolicy
  };
}));