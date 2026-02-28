# Testing

## Run tests (Windows PowerShell)

If your PowerShell execution policy blocks `npm` (`npm.ps1 cannot be loaded`), use:

```powershell
npm.cmd test
```

This runs the same `test` script from `package.json`.

## Optional: enable `npm test` for current shell only

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm test
```

## Browser-only test notes

Two Cambus checks are browser-only and are skipped in Node/PowerShell runs:
- `cambusRoutesExist`
- `cambusSpawnCoordinates`

## Walking transition reliability check

The Node test suite also includes a full round-trip walking transition reliability test:
- `walkingTransitionsRoundTrip`

This validates every bidirectional walking route as `A -> B -> A -> B` using walk-accessible movement steps and transition trigger distance rules.

## README consistency check

The Node test suite includes a README guard:
- `readmeConsistency`

This checks key expected README references (for core files/modules) and fails if stale `test.js` structure entries reappear.
