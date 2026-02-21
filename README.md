# 🎮 Iowa City Quest

A retro NES-style RPG adventure set in Iowa City! Explore campus, complete quests, battle academic monsters, and experience college life in pixel art form.

![Game Type](https://img.shields.io/badge/Type-RPG-blue)
![Platform](https://img.shields.io/badge/Platform-Web-green)
![Mobile](https://img.shields.io/badge/Mobile-Supported-brightgreen)

## 📖 Story

A dark corruption has taken root in Iowa City, emanating from the historic Old Capitol building. As a student hero, you must explore all corners of Iowa City and clear the Beer Caves—then grow strong enough to face the Corrupted Administrator and save the city.

Along the way, you'll meet colorful locals, complete quests, battle academic monsters and Iowa City creatures, and uncover the mystery behind the corruption. Will you prove yourself as the hero Iowa City needs?

## 🕹️ Play Now

**[Play on GitHub Pages](https://digable.github.io/vc_ic_rpg/)**

## ✨ Features

### 🗺️ Explore 11 Iowa City Locations
- **Downtown** - Coffee shops, stores, and street vendors
- **Pentacrest** - The heart of campus
- **Main Library** - Study spaces and magic training
- **Iowa River Park** - Peaceful riverside area with yoga
- **The Deadwood** - Local bar with food and drinks
- **Northside** - Restaurant district with diverse cuisine
- **Beer Caves** - Maze-like underground caverns
- **Kinnick Stadium** - Iconic 70,000-seat football stadium
- **Pedestrian Mall** - Downtown shopping and entertainment district
- **Old Capitol Museum** - Historic building with golden dome
- **Coralville Lake** - Recreational area with fishing and camping

### ⚔️ Turn-Based Combat
- Fight academic and Iowa City-themed enemies
- Battle rival fans, haunted portraits, and the legendary Lake Monster
- Learn magic spells (Fire Bolt, Thunder, Ice Blast)
- Use items and strategy to win battles
- Level up with NES Final Fantasy-style progression (50 levels)
- Class-based stat growth (6 Iowa City-themed classes)
- Epic boss battles including the Corrupted Administrator

### 📋 18 Side Quests
Complete Iowa City-themed quests:
- The Coffee Run
- Campus Tour Guide
- The Overdue Books
- River Cleanup Crew
- Settling the Tab
- Food Critic Challenge
- Study Buddy Needed
- Seeking Inspiration
- Cave Exploration
- Crystal Elemental Hunt
- The Dragon Threat
- **Hawkeye Spirit** - Prove your Hawkeye pride at Kinnick Stadium
- **Stadium Tour** - Visit all major Iowa City landmarks
- **Lost Guitar** - Help the street musician on the Ped Mall
- **The Capitol Mystery** - Investigate haunted Old Capitol
- **The Lake Monster** - Defeat the legendary creature
- **Camping Supplies** - Help a camper at Coralville Lake
- **Source of Corruption** - Main story quest to clear the Beer Caves and save Iowa City

### 🍕 Unique Food Vendors
28+ food items across 4 vendors with distinct mechanics:
- **Food Carts** - Quick, affordable street food
- **Restaurants** - Fine dining with powerful healing & buffs
- **Asian Cuisine** - Ramen, boba tea, sushi with balanced effects
- **The Deadwood Bar** - Drinks with strength & intellect buffs

### 🎯 RPG Systems
- **Character Progression** - 50-level NES FF-style system with experience thresholds
- **6 Character Classes** - Student, Hawkeye, Scholar, Engineer, Greek, Artist (each with unique stat growth)
- **6 Core Stats** - Strength, Intellect, Agility, Vitality, Spirit, Luck
- **Magic Spells** - Learn spells that scale with Intellect
- **Defensive Skills** - Yoga techniques for defensive tactics
- **Shop System** - 8 stat-boosting items with pagination
- **Magic Training** - 5 trainers teach spells and provide stat increases
- **Cambus Fast Travel** - Navigate between 11 Iowa City locations
- **Beer Caves Maze** - Flashlight reveals the path
- **Main Story Quest** - Epic storyline to save Iowa City from corruption
- **Boss Battles** - Challenging encounters with unique enemies

### 📱 Mobile Support
- Touch controls for mobile devices
- Responsive design
- Fixed on-screen buttons (D-pad + Action/Menu)

## 🎮 Controls

### Desktop
- **Arrow Keys** - Move character / Navigate menus
- **Space** - Interact / Advance dialogue / Select items
- **ESC** - Open menu / Close menu / Exit shops
- **Left/Right Arrows** - Page through vendor menus when available

### Mobile
- **D-Pad** - Move character
- **A Button** - Interact / Select
- **M Button** - Menu / Cancel

## 📁 Project Structure

```
vc_ic_rpg/
├── index.html              # Main HTML - Canvas & mobile controls
├── game.css                # Pixel-perfect NES-style graphics
├── LICENSE                 # MIT License
├── README.md               # This file
├── .gitignore              # Git ignore rules
├── test.js                 # Browser console test helpers
└── js/                     # Modular JavaScript
    ├── main.js             # Game loop & rendering pipeline
    ├── game-state.js       # Global game state & initialization
    ├── constants.js        # Game configuration & colors
    ├── data.js             # Items, spells, shops, routes
    ├── quests.js           # Quest database
    ├── quests-logic.js     # Quest system & NPC interactions
    ├── maps.js             # Map layouts & NPC positions
    ├── enemies.js          # Enemy definitions & encounters
    ├── battle.js           # Combat system & spell execution
    ├── rendering/          # Modular rendering system
    │   ├── index.js         # Rendering exports & setup
    │   ├── utils.js         # Shared rendering helpers
    │   ├── world.js         # Map/player/NPC rendering
    │   ├── ui.js            # HUD/dialogue/menu rendering
    │   ├── battle.js        # Battle rendering
    │   ├── vendors.js       # Vendor screens rendering
    │   └── gamestate.js     # Game state screens
    ├── input.js            # Keyboard/touch input handling
    ├── interactions.js     # NPC & vendor interactions
    ├── dialogue.js         # Dialogue system with message flow
    ├── world.js            # World mechanics (collisions, fast travel)
    └── leveling.js         # NES FF-style leveling (50 levels, class growth)
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
- **50-Level System** - NES FF-style progression with fixed EXP thresholds
- **Class-Based Growth** - Each class has unique stat growth patterns
- **5 Character Classes** - Hawkeye, Scholar, Engineer, Greek, Artist
- **Multi-Level-Up** - Handle multiple levels gained in single battle
- **Strong Levels** - Special levels grant bonus HP and stat growth
- **Stat Increases** - Buy items and complete training to boost stats
- **Learn Spells** - Visit Magic Trainer to unlock 5+ spells
- **Unlock Skills** - Yoga studio offers 8 defensive techniques

### Quest System
- Multiple quest types
- Track objectives
- Quest markers (! and ?)
- Rewards upon completion

### World Design
- 11+ interconnected locations including Beer Caves Depths I-III
- Unique NPCs and quest hubs across surface zones and cave depths
- Random encounters (caves fall silent after the Cave Sovereign is defeated)
- Location-specific enemies and bosses (Cave Sovereign, Lake Monster, Corrupted Administrator)

## � Character Classes & Leveling

### 6 Iowa City-Themed Classes

| Class | Focus | Primary Growth | HP Pattern | Description |
|-------|-------|-----------------|------------|-------------|
| **Student** | Baseline | Balanced | Average (base 5) | Perfect starting choice, balanced growth |
| **Hawkeye** | Athlete | Strength | Strong (base 7) | Powerful physical attacks |
| **Scholar** | Academic | Intellect | Moderate (base 5) | Master of magic and intellect |
| **Engineer** | Technical | Agility | Moderate (base 5) | Quick and resourceful |
| **Greek** | Social | Vitality | Very Strong (base 8) | Highest HP, excellent endurance |
| **Artist** | Creative | Balanced | Lower (base 3) | Spirit-focused, creative growth |

### 50-Level Progression System
- **Fixed EXP Thresholds** - Reach level 50 with consistent difficulty scaling
- **Class-Specific Growth** - Each class has guaranteed and probabilistic stat gains
- **Strong Levels** - Special levels throughout progression grant bonus HP
- **Multi-Level Handling** - Gain multiple levels in a single battle correctly
- **Experience Tracking** - Persistent EXP carried between battles

## 📊 Stats System

All equipment, training, and items affect 6 core statistics:

- **Strength** - Physical attack power
- **Intellect** - Magic power and spell effectiveness
- **Agility** - Speed and evasion
- **Vitality** - Health and defensive capability
- **Spirit** - Support and magical defense
- **Luck** - Critical hits and item effects

---

## 🎮 Game Tips

1. **Visit the Barista** - Free HP/MP restore in Downtown
2. **Choose Your Class** - Each class has different stat growth patterns
3. **Complete Quests** - Great EXP and gold rewards
4. **Buy Food** - Stat buffs help in tough battles (check vendor pagination)
5. **Use Cambus** - Fast travel between surface locations (cave depths are on foot)
6. **Bring the Flashlight** - It reveals the Beer Caves and their depths
7. **Learn Magic** - Visit the Library to train in spells (Intellect-based)
8. **Try Yoga** - Riverside park offers defensive skills for any class
9. **Stock Items** - Buy consumables before big fights
10. **Explore All Vendors** - Each has unique items and effects
11. **Watch for Strong Levels** - They provide bonus HP growth
12. **Visit New Locations** - Kinnick Stadium, Ped Mall, Old Capitol, and Coralville Lake
13. **Main Quest** - Clear the Beer Caves, reach level 10, and face the final boss
14. **Talk to Everyone** - NPCs offer valuable quests and rewards
15. **Boss Preparation** - Stock up on healing items before facing the Cave Sovereign, Lake Monster, or Corrupted Administrator

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
- Report bugs (especially with vendor interactions or leveling)
- Suggest new items, quests, or locations
- Submit pull requests for improvements
- Balance suggestions for classes or difficulty

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## � Troubleshooting

**Modules not loading?**
- Ensure you're using a local HTTP server (not file://)
- Clear browser cache with Ctrl+F5

**Items not showing in vendor menu?**
- Verify vendor name matches in `data.js`
- Check food cart NPC has `type: 'food_cart'`
- Use Left/Right arrows to navigate if vendor has multiple pages

**Can't buy item but have gold?**
- Confirm item is on current page (use L/R arrows)
- Check if selection is on "Exit" instead of item

**Quest not updating?**
- Confirm vendor name spelling matches quest objectives
- Check quest objectives match vendor types

**Leveling too fast/slow?**
- Edit `expThresholds` in `leveling.js` to adjust difficulty
- Try different character classes for unique progression curves

**Mobile controls not working?**
- Ensure device has touch events enabled
- Try landscape orientation for better UX

## �🙏 Acknowledgments

- Inspired by classic NES RPGs
- Built for Iowa City folks
- Retro pixel art aesthetic
- Modern web technologies

## 📧 Contact

Questions or feedback? Open an issue on GitHub!

---

Made with ❤️ for Iowa City
