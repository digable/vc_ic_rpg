# Iowa City Quest - Modular Structure

## File Organization

### Core Files
- `index.html` - Main HTML file
- `game.css` - All styling
- `game.js` - Complete game logic (original monolithic file)

### Modular JavaScript (js/ directory)
Breaking down game.js into logical modules for better maintainability:

1. **constants.js** - Game constants, colors, configuration
2. **data.js** - Items, spells, shops, training data
3. **quests.js** - Quest database with all side quests
4. **enemies.js** - Enemy definitions and stats
5. **maps.js** - Map layouts and NPC data (to be created)
6. **game-state.js** - Game state management (to be created)
7. **input.js** - Keyboard and touch input handlers (to be created)
8. **rendering.js** - All drawing/rendering functions (to be created)
9. **battle.js** - Battle system logic (to be created)
10. **main.js** - Game loop and initialization (to be created)

## Current Status

✅ **Completed:**
- constants.js - Game configuration and colors
- data.js - Items, spells, shops
- quests.js - Quest database
- enemies.js - Enemy data

⏳ **To Complete:**
- Extract map data (316-518 lines)
- Extract rendering functions (~1500 lines)
- Extract battle system (~500 lines)
- Extract input handling (~100 lines)
- Create main initialization and game loop

## Usage

### Option 1: Use Original (Working Now)
```html
<script src="game.js"></script>
```

### Option 2: Use Modular (Work in Progress)
```html
<script type="module" src="js/main.js"></script>
```

## Benefits of Modular Structure

- **Easier Maintenance** - Find and edit specific features quickly
- **Better Organization** - Logical separation of concerns
- **Reusability** - Share data/constants across modules
- **Debugging** - Isolate issues to specific modules
- **Collaboration** - Multiple developers can work on different modules

## Next Steps

1. Complete extraction of remaining modules
2. Create main.js that imports and initializes all modules
3. Update index.html to use modular version
4. Test to ensure functionality matches original
