// Game State Management

export const game = {
  state: 'title', // title, explore, battle, dialogue, menu, shop, magic_trainer, yoga, cambus, food_cart
  player: {
    x: 120,
    y: 120,
    hp: 50,
    maxHp: 50,
    mp: 20,
    maxMp: 20,
    level: 1,
    exp: 0,
    gold: 100,
    name: 'Student',
    class: 'Student',
    facing: 'down',
    attack: 8,
    magic: 5,
    defense: 3
  },
  map: 'downtown',
  inventory: ['Campus ID', 'Bus Pass', 'Coffee'],
  consumables: [{ name: 'Flashlight', price: 0, effect: 'flashlight', description: 'Lights up dark caves. Never used up.' }], // Consumable items inventory
  skills: [],
  spells: [],
  enemyEncounterSteps: 0,
  dialogue: null,
  battleState: null,
  menuOpen: false,
  menuSelection: 0,
  menuTab: 0, // 0=stats, 1=map, 2=items
  shopOpen: false,
  shopSelection: 0,
  shopPage: 0, // For pagination
  magicTrainerOpen: false,
  magicTrainerSelection: 0,
  magicTrainerPage: 0, // For pagination
  yogaOpen: false,
  yogaSelection: 0,
  yogaPage: 0, // For pagination
  cambusOpen: false,
  cambusSelection: 0,
  cambusPage: 0, // For pagination
  foodCartOpen: false,
  foodCartSelection: 0,
  foodCartPage: 0, // For pagination
  currentVendor: 'Food Cart Vendor',
  itemMenuOpen: false,
  itemMenuSelection: 0,
  activeBuff: null, // { type: 'attack'/'defense'/'magic', amount: 5, turnsLeft: 3 }
  flashlightOn: false,
  caveSovereignDefeated: false,
  caveSovereignIntroSeen: false,
  quests: [], // Active and completed quests
  textBox: null,
  levelUpDialog: null, // Stores level up info when level up occurs
  animFrame: 0
};

export function resetGameState() {
  game.state = 'title';
  game.player = {
    x: 120,
    y: 120,
    hp: 50,
    maxHp: 50,
    mp: 20,
    maxMp: 20,
    level: 1,
    exp: 0,
    gold: 100,
    name: 'Student',
    class: 'Student',
    facing: 'down',
    attack: 8,
    magic: 5,
    defense: 3
  };
  game.map = 'downtown';
  game.inventory = ['Campus ID', 'Bus Pass', 'Coffee'];
  game.consumables = [{ name: 'Flashlight', price: 0, effect: 'flashlight', description: 'Lights up dark caves. Never used up.' }];
  game.skills = [];
  game.spells = [];
  game.enemyEncounterSteps = 0;
  game.dialogue = null;
  game.battleState = null;
  game.menuOpen = false;
  game.menuSelection = 0;
  game.menuTab = 0;
  game.shopOpen = false;
  game.shopSelection = 0;
  game.shopPage = 0;
  game.magicTrainerOpen = false;
  game.magicTrainerSelection = 0;
  game.magicTrainerPage = 0;
  game.yogaOpen = false;
  game.yogaSelection = 0;
  game.yogaPage = 0;
  game.cambusOpen = false;
  game.cambusSelection = 0;
  game.cambusPage = 0;
  game.foodCartOpen = false;
  game.foodCartSelection = 0;
  game.foodCartPage = 0;
  game.currentVendor = 'Food Cart Vendor';
  game.itemMenuOpen = false;
  game.itemMenuSelection = 0;
  game.activeBuff = null;
  game.flashlightOn = false;
  game.caveSovereignDefeated = false;
  game.caveSovereignIntroSeen = false;
  game.quests = [];
  game.textBox = null;
  game.levelUpDialog = null;
  game.animFrame = 0;
  
  // Show title screen by removing hidden class
  const titleScreen = document.getElementById('title-screen');
  if (titleScreen) {
    titleScreen.classList.remove('hidden');
  }
  
  // Scroll viewport back to top
  window.scrollTo(0, 0);
}
