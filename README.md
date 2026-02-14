# 🎮 Iowa City Quest

A retro NES-style RPG adventure set in Iowa City! Explore campus, complete quests, battle academic monsters, and experience college life in pixel art form.

![Game Type](https://img.shields.io/badge/Type-RPG-blue)
![Platform](https://img.shields.io/badge/Platform-Web-green)
![Mobile](https://img.shields.io/badge/Mobile-Supported-brightgreen)

## 🕹️ Play Now

**[Play on GitHub Pages](https://digable.github.io/iowa-city-quest/)**

## ✨ Features

### 🗺️ Explore 6 Iowa City Locations
- **Downtown** - Coffee shops, stores, and street vendors
- **Pentacrest** - The heart of campus
- **Main Library** - Study spaces and magic training
- **Iowa River Park** - Peaceful riverside area with yoga
- **The Deadwood** - Local bar with food and drinks
- **Northside** - Restaurant district with diverse cuisine

### ⚔️ Turn-Based Combat
- Fight academic enemies (Late Assignments, Midterms, Group Projects)
- Learn magic spells (Fire Bolt, Thunder, Ice Blast)
- Use items and strategy to win battles
- Level up and gain new abilities

### 📋 8 Side Quests
Complete Iowa City-themed quests:
- The Coffee Run
- Campus Tour Guide
- The Overdue Books
- River Cleanup Crew
- Settling the Tab
- Food Critic Challenge
- Study Buddy Needed
- Seeking Inspiration

### 🍕 Unique Food Vendors
Each vendor has their own menu:
- **Food Carts** - Street food and quick bites
- **Restaurants** - Fine dining with powerful buffs
- **Asian Cuisine** - Ramen, boba tea, sushi
- **The Deadwood Bar** - Drinks and bar food

### 🎯 RPG Systems
- Character progression (levels, stats, equipment)
- Magic spells and defensive skills
- Consumable items with temporary buffs
- Quest tracking with rewards
- Fast travel via Cambus system

### 📱 Mobile Support
- Touch controls for mobile devices
- Responsive design
- Fixed on-screen buttons (D-pad + Action/Menu)

## 🎮 Controls

### Desktop
- **Arrow Keys** - Move character
- **Space** - Interact / Advance dialogue / Select
- **ESC** - Open menu / Cancel

### Mobile
- **D-Pad** - Move character
- **A Button** - Interact / Select
- **M Button** - Menu / Cancel

## 🚀 Quick Start

### Play Locally

1. Navigate to the project folder:
```bash
cd "c:\Users\digable\source\repos\digable\vc_ic_rpg"
```

2. Start a local server (choose one):

**Python 3** (built-in on Windows)
```bash
python -m http.server 8000
```

**Node.js** (if installed)
```bash
npx http-server -p 8000
```

**VS Code Live Server** (if extension installed)
- Right-click `index.html` → "Open with Live Server"

3. Open in browser:
```
http://localhost:8000/index.html
```

**Note:** ES6 modules require a web server (can't open index.html directly with file://).

## 📁 Project Structure

```
vc_ic_rpg/
├── index.html              # Main HTML - Canvas & mobile controls
├── game.css                # Pixel-perfect NES-style graphics
├── DEPLOYMENT.md           # Modularization documentation
├── LICENSE                 # MIT License
├── README.md               # This file
├── .gitignore              # Git ignore rules
└── js/                     # Modular JavaScript (~4000 lines total)
    ├── main.js             # Game loop & rendering pipeline (92 lines)
    ├── game-state.js       # Global game state & initialization (48 lines)
    ├── constants.js        # Game configuration & colors
    ├── data.js             # Items, spells, shops, routes (~150 lines)
    ├── quests.js           # Quest database with 8 side quests (~160 lines)
    ├── quests-logic.js     # Quest system & NPC interactions (170 lines)
    ├── maps.js             # Map layouts & NPC positions (350 lines)
    ├── enemies.js          # Enemy definitions & encounters
    ├── battle.js           # Combat system & spell execution (200+ lines)
    ├── rendering.js        # All canvas drawing functions (1505 lines)
    ├── input.js            # Keyboard/touch input handling (426 lines)
    ├── interactions.js     # NPC & vendor interactions (226 lines)
    ├── dialogue.js         # Dialogue system with message flow
    └── world.js            # World mechanics (collisions, fast travel)
```
```

## 🛠️ Technical Details

- **Pure JavaScript** - No frameworks required
- **ES6 Modules** - Clean, organized code
- **Canvas Rendering** - Pixel-perfect graphics
- **Responsive Design** - Works on desktop and mobile
- **Touch Support** - Native mobile controls

## 🎨 Features Breakdown

### Combat System
- Turn-based battles
- Attack, Magic, Item, Run options
- Enemy special attacks
- Status effects and buffs
- Victory rewards (EXP, Gold)

### Progression
- Level up system
- Stat increases
- Learn new spells
- Unlock skills
- Buy equipment and items

### Quest System
- Multiple quest types
- Track objectives
- Quest markers (! and ?)
- Rewards upon completion

### World Design
- 6 interconnected locations
- 12 unique NPCs with pixel art sprites
- Random enemy encounters
- Location-specific enemies (Raccoons in park)

## 🎯 Game Tips

1. **Visit the Barista** - Free HP/MP restore in Downtown
2. **Complete Quests** - Great rewards and EXP
3. **Buy Food** - Buffs help in tough battles
4. **Use Cambus** - Fast travel between locations
5. **Learn Magic** - Visit the Library for spell training
6. **Try Yoga** - Riverside park offers defensive skills
7. **Stock Items** - Buy consumables before big fights

## 📝 Development

### Code Organization
The codebase is modularized for easy maintenance:
- **Data modules** - Separated game content
- **Game logic** - Main game engine
- **Rendering** - All drawing functions
- **Input** - Keyboard and touch handling

### Adding Content

**Add a new quest:**
Edit `js/quests.js`

**Add a new enemy:**
Edit `js/enemies.js`

**Add a new item:**
Edit `js/data.js`

**Modify a map:**
Edit `js/maps.js`

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## � Troubleshooting

**Modules not loading?**
- Ensure you're using a local HTTP server (not file://)
- Clear browser cache with Ctrl+F5

**Items not showing in vendor menu?**
- Verify vendor name matches in `data.js`
- Check food cart NPC has `type: 'food_cart'`

**Quest not updating?**
- Confirm vendor name spelling matches quest objectives
- Check quest objectives match vendor types

**Mobile controls not working?**
- Ensure device has touch events enabled
- Try landscape orientation for better UX

## 🔄 Recent Updates

- ✅ Fixed dialogue system (Escape to close, Space to advance)
- ✅ Added Chef vendor to Pentacrest
- ✅ Fixed unreachable vendors on Northside
- ✅ Made vendor matching case-insensitive for robust item sales
- ✅ Fixed menu toggle (Escape key now works reliably)

## �🙏 Acknowledgments

- Inspired by classic NES RPGs
- Built for Iowa City folks
- Retro pixel art aesthetic
- Modern web technologies

## 📧 Contact

Questions or feedback? Open an issue on GitHub!

---

Made with ❤️ for Iowa City
