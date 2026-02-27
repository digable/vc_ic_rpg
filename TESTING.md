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
