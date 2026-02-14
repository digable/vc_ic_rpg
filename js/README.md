# 🎮 Iowa City Quest

A retro NES-style RPG adventure set in Iowa City! Explore campus, complete quests, battle academic monsters, and experience college life in pixel art form.

![Game Type](https://img.shields.io/badge/Type-RPG-blue)
![Platform](https://img.shields.io/badge/Platform-Web-green)
![Mobile](https://img.shields.io/badge/Mobile-Supported-brightgreen)

## 🕹️ Play Now

**[Play on GitHub Pages](https://yourusername.github.io/iowa-city-quest/)**

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

1. Clone the repository:
```bash
git clone https://github.com/yourusername/iowa-city-quest.git
cd iowa-city-quest
```

2. Start a local server:
```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

3. Open in browser:
```
http://localhost:8000
```

**Note:** ES6 modules require a web server (can't open index.html directly).

## 📁 Project Structure

```
iowa-city-quest/
├── index.html              # Main HTML file
├── game.css                # All styles
├── js/                     # Modular JavaScript
│   ├── constants.js        # Game configuration
│   ├── data.js             # Items, spells, shops
│   ├── quests.js           # Quest database
│   ├── enemies.js          # Enemy definitions
│   ├── maps.js             # Map layouts
│   ├── game-state.js       # Game state
│   └── main-working.js     # Game logic
└── README.md
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

## 🙏 Acknowledgments

- Inspired by classic NES RPGs
- Built for Iowa City college students
- Retro pixel art aesthetic
- Modern web technologies

## 📧 Contact

Questions or feedback? Open an issue on GitHub!

---

Made with ❤️ for Iowa City
