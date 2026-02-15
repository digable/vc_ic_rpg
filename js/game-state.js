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
  consumables: [], // Consumable items inventory
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
  foodCartOpen: false,
  foodCartSelection: 0,
  foodCartPage: 0, // For pagination
  currentVendor: 'Food Cart Vendor',
  itemMenuOpen: false,
  itemMenuSelection: 0,
  activeBuff: null, // { type: 'attack'/'defense'/'magic', amount: 5, turnsLeft: 3 }
  quests: [], // Active and completed quests
  textBox: null,
  animFrame: 0
};
