// Game Data - Items, Spells, Shops, Training

// Shop items
export const shopItems = [
  { name: 'Herbal Remedy', price: 30, effect: 'heal', amount: 30, description: 'Restores 30 HP' },
  { name: 'Hawkeye Energy Drink', price: 50, effect: 'healMP', amount: 20, description: 'Restores 20 MP' },
  { name: 'Training Manual', price: 100, effect: 'strengthUp', amount: 3, description: '+3 Strength' },
  { name: 'Study Guide', price: 100, effect: 'intellectUp', amount: 3, description: '+3 Intellect' },
  { name: 'Running Shoes', price: 100, effect: 'agilityUp', amount: 3, description: '+3 Agility' },
  { name: 'Wellness Bracelet', price: 120, effect: 'vitalityUp', amount: 4, description: '+4 Vitality & +20 Max HP' },
  { name: 'Hawkeye Pendant', price: 150, effect: 'luckUp', amount: 3, description: '+3 Luck' },
  { name: 'Protective Jacket', price: 140, effect: 'defenseUp', amount: 4, description: '+4 Defense' }
];

// Magic training options
export const magicTraining = [
  { name: 'Fireball Training', price: 80, effect: 'magicUp', amount: 3, spell: 'Fireball', description: '+3 Intellect, Learn Fireball' },
  { name: 'Ice Blast Training', price: 120, effect: 'magicUp', amount: 5, spell: 'Ice Blast', description: '+5 Intellect, Learn Ice Blast' },
  { name: 'Thunder Training', price: 200, effect: 'magicMpUp', amount: 10, spell: 'Thunder', description: '+10 MP, Learn Thunder' },
  { name: 'Arcane Mastery', price: 300, effect: 'magicCombo', amount: 0, spell: 'Arcane Missile', description: '+5 Intellect, +15 MP, Learn Arcane' },
  { name: 'Spirit Bond', price: 150, effect: 'spiritUp', amount: 4, spell: 'Heal', description: '+4 Spirit, Learn Heal spell' },
  { name: 'Barrier Training', price: 180, effect: 'magicUp', amount: 4, spell: 'Barrier', description: '+4 Intellect, Learn Barrier' },
  { name: 'Divine Light', price: 250, effect: 'spiritUp', amount: 5, spell: 'Restore', description: '+5 Spirit, Learn Restore' },
  { name: 'Meteor Strike', price: 400, effect: 'magicCombo', amount: 0, spell: 'Meteor', description: '+7 Intellect, +20 MP, Learn Meteor' }
];

// Yoga studio defensive techniques
export const yogaTechniques = [
  { name: 'Warrior Pose', price: 60, effect: 'strengthUp', amount: 2, skill: 'Block', description: '+2 Strength, Learn Block' },
  { name: 'Tree Balance', price: 90, effect: 'defenseUp', amount: 3, skill: 'Counter', description: '+3 Defense, Learn Counter' },
  { name: 'Meditation Practice', price: 120, effect: 'hpMpCombo', amount: 0, skill: 'Regenerate', description: '+15 HP, +10 MP, Learn Regen' },
  { name: 'Mindful Breathing', price: 150, effect: 'vitalityUp', amount: 2, skill: 'Meditation', description: '+2 Vitality, MP regen skill' },
  { name: 'Advanced Flow', price: 180, effect: 'agilityUp', amount: 5, skill: 'Dodge', description: '+5 Agility, Learn Dodge' },
  { name: 'Inner Strength', price: 140, effect: 'spiritUp', amount: 3, skill: 'Fortify', description: '+3 Spirit, Learn Fortify' },
  { name: 'Balance Training', price: 100, effect: 'agilityUp', amount: 2, skill: 'Evasion', description: '+2 Agility, Learn Evasion' },
  { name: 'Power Conditioning', price: 110, effect: 'strengthUp', amount: 3, skill: 'Power Strike', description: '+3 Strength, Learn Power Strike' }
];

// Spell database
export const spellData = {
  'Fire Bolt': { type: 'attack', mpCost: 5, power: 1.2, description: 'Basic fire spell' },
  'Fireball': { type: 'attack', mpCost: 10, power: 1.8, description: 'Powerful fire attack' },
  'Ice Blast': { type: 'attack', mpCost: 12, power: 2.0, description: 'Freezing ice attack' },
  'Thunder': { type: 'attack', mpCost: 15, power: 2.5, description: 'Lightning strike' },
  'Arcane Missile': { type: 'attack', mpCost: 8, power: 1.5, description: 'Magic missile' },
  'Meteor': { type: 'attack', mpCost: 25, power: 3.5, description: 'Devastating meteor strike' },
  'Shield': { type: 'defense', mpCost: 8, boost: 5, duration: 2, description: 'Temporary +5 defense' },
  'Barrier': { type: 'defense', mpCost: 12, boost: 8, duration: 2, description: 'Strong +8 defense' },
  'Heal': { type: 'heal', mpCost: 10, amount: 25, description: 'Restore 25 HP' },
  'Restore': { type: 'heal', mpCost: 15, amount: 40, description: 'Restore 40 HP' }
};

// Consumable items (food from various vendors)
export const consumableItems = [
  // Food Cart Vendor (Street Food)
  { name: 'Pizza Slice', price: 15, effect: 'healHP', amount: 20, description: 'Restores 20 HP', vendor: 'Food Cart Vendor' },
  { name: 'Energy Bar', price: 20, effect: 'healMP', amount: 15, description: 'Restores 15 MP', vendor: 'Food Cart Vendor' },
  { name: 'Protein Shake', price: 35, effect: 'buffStrength', amount: 5, turns: 3, description: 'Temp +5 Strength (3 turns)', vendor: 'Food Cart Vendor' },
  { name: 'Kombucha', price: 30, effect: 'buffVitality', amount: 5, turns: 3, description: 'Temp +5 Vitality (3 turns)', vendor: 'Food Cart Vendor' },
  { name: 'Burrito', price: 40, effect: 'healBoth', hpAmount: 30, mpAmount: 10, description: 'Restore 30 HP & 10 MP', vendor: 'Food Cart Vendor' },
  { name: 'Green Smoothie', price: 25, effect: 'buffIntellect', amount: 3, turns: 3, description: 'Temp +3 Intellect (3 turns)', vendor: 'Food Cart Vendor' },
  { name: 'Corn Dog', price: 18, effect: 'healHP', amount: 25, description: 'Restores 25 HP', vendor: 'Food Cart Vendor' },
  { name: 'Tater Tots', price: 22, effect: 'buffAgility', amount: 2, turns: 4, description: 'Temp +2 Agility (4 turns)', vendor: 'Food Cart Vendor' },
  
  // Restaurant Owner (Fine Dining)
  { name: 'Steak Dinner', price: 60, effect: 'healHP', amount: 50, description: 'Restores 50 HP', vendor: 'Restaurant Owner' },
  { name: 'Lobster Bisque', price: 55, effect: 'healMP', amount: 30, description: 'Restores 30 MP', vendor: 'Restaurant Owner' },
  { name: 'Chef Special', price: 80, effect: 'healBoth', hpAmount: 45, mpAmount: 25, description: 'Restore 45 HP & 25 MP', vendor: 'Restaurant Owner' },
  { name: 'Power Meal', price: 70, effect: 'buffStrength', amount: 8, turns: 4, description: 'Temp +8 Strength (4 turns)', vendor: 'Restaurant Owner' },
  { name: 'Focus Platter', price: 65, effect: 'buffIntellect', amount: 6, turns: 4, description: 'Temp +6 Intellect (4 turns)', vendor: 'Restaurant Owner' },
  { name: 'Salmon Filet', price: 75, effect: 'buffVitality', amount: 10, turns: 4, description: 'Temp +10 Vitality (4 turns)', vendor: 'Restaurant Owner' },
  { name: 'Truffle Pasta', price: 85, effect: 'buffIntellect', amount: 8, turns: 5, description: 'Temp +8 Intellect (5 turns)', vendor: 'Restaurant Owner' },
  
  // Chef (Asian Cuisine)
  { name: 'Ramen Bowl', price: 35, effect: 'healHP', amount: 35, description: 'Restores 35 HP', vendor: 'Chef' },
  { name: 'Boba Tea', price: 30, effect: 'healMP', amount: 20, description: 'Restores 20 MP', vendor: 'Chef' },
  { name: 'Sushi Combo', price: 50, effect: 'healBoth', hpAmount: 35, mpAmount: 15, description: 'Restore 35 HP & 15 MP', vendor: 'Chef' },
  { name: 'Spicy Curry', price: 45, effect: 'buffStrength', amount: 6, turns: 3, description: 'Temp +6 Strength (3 turns)', vendor: 'Chef' },
  { name: 'Green Tea', price: 40, effect: 'buffVitality', amount: 7, turns: 4, description: 'Temp +7 Vitality (4 turns)', vendor: 'Chef' },
  { name: 'Pad Thai', price: 42, effect: 'buffAgility', amount: 5, turns: 3, description: 'Temp +5 Agility (3 turns)', vendor: 'Chef' },
  { name: 'Miso Soup', price: 28, effect: 'healMP', amount: 25, description: 'Restores 25 MP', vendor: 'Chef' },
  { name: 'Gyoza Plate', price: 38, effect: 'buffVitality', amount: 4, turns: 3, description: 'Temp +4 Vitality (3 turns)', vendor: 'Chef' },
  
  // Bartender (The Deadwood)
  { name: 'Beer', price: 20, effect: 'healHP', amount: 15, description: 'Restores 15 HP', vendor: 'Bartender' },
  { name: 'Whiskey Shot', price: 35, effect: 'buffStrength', amount: 7, turns: 2, description: 'Temp +7 Strength (2 turns)', vendor: 'Bartender' },
  { name: 'IPA', price: 30, effect: 'healBoth', hpAmount: 20, mpAmount: 10, description: 'Restore 20 HP & 10 MP', vendor: 'Bartender' },
  { name: 'Cocktail', price: 45, effect: 'buffIntellect', amount: 5, turns: 3, description: 'Temp +5 Intellect (3 turns)', vendor: 'Bartender' },
  { name: 'Wine Selection', price: 50, effect: 'buffIntellect', amount: 7, turns: 4, description: 'Temp +7 Intellect (4 turns)', vendor: 'Bartender' },
  { name: 'Craft Beer', price: 25, effect: 'buffVitality', amount: 3, turns: 3, description: 'Temp +3 Vitality (3 turns)', vendor: 'Bartender' },

  // Cave Loot (Depths I)
  { name: 'Cave Jerky', price: 0, effect: 'healHP', amount: 35, description: 'Restores 35 HP' },
  { name: 'Miner\'s Tea', price: 0, effect: 'healMP', amount: 25, description: 'Restores 25 MP' },
  { name: 'Glowcap Bite', price: 0, effect: 'buffVitality', amount: 3, turns: 3, description: 'Temp +3 Vitality (3 turns)' },

  // Cave Loot (Depths II)
  { name: 'Crystal Infusion', price: 0, effect: 'healBoth', hpAmount: 40, mpAmount: 20, description: 'Restore 40 HP & 20 MP' },
  { name: 'Golem Biscuit', price: 0, effect: 'buffDefense', amount: 4, turns: 3, description: 'Temp +4 Defense (3 turns)' },
  { name: 'Spider Silk Wrap', price: 0, effect: 'buffAgility', amount: 4, turns: 3, description: 'Temp +4 Agility (3 turns)' },

  // Cave Loot (Depths III)
  { name: 'Drakefire Tonic', price: 0, effect: 'healBoth', hpAmount: 60, mpAmount: 30, description: 'Restore 60 HP & 30 MP' },
  { name: 'Abyssal Draught', price: 0, effect: 'buffStrength', amount: 6, turns: 4, description: 'Temp +6 Strength (4 turns)' },
  { name: 'Starlit Elixir', price: 0, effect: 'buffIntellect', amount: 6, turns: 4, description: 'Temp +6 Intellect (4 turns)' },

  // Cave Loot (Depths III Boss)
  { name: 'Sovereign Scale', price: 0, effect: 'buffDefense', amount: 8, turns: 5, description: 'Temp +8 Defense (5 turns)' },
  { name: 'Voidcore Elixir', price: 0, effect: 'buffIntellect', amount: 8, turns: 5, description: 'Temp +8 Intellect (5 turns)' },
  { name: 'Drakeheart Tonic', price: 0, effect: 'healBoth', hpAmount: 90, mpAmount: 45, description: 'Restore 90 HP & 45 MP' },

  // Quest Rewards
  { name: 'Flashlight', price: 0, effect: 'flashlight', description: 'Lights up dark caves. Never used up.' },
  { name: 'Angel Ward', price: 0, effect: 'angel_dodge', description: 'Blessing of the Black Angel. Guarantees a dodge on the next enemy turn. Never used up.' },
  { name: 'Hawkeye Jersey', price: 0, effect: 'buffStrength', amount: 10, turns: 5, description: 'Temp +10 Strength (5 turns)' },
  { name: 'Music Note', price: 0, effect: 'healBoth', hpAmount: 40, mpAmount: 20, description: 'Restore 40 HP & 20 MP' },
  { name: 'Lake Trophy', price: 0, effect: 'buffVitality', amount: 15, turns: 6, description: 'Temp +15 Vitality (6 turns)' },
  { name: 'Camping Tent', price: 0, effect: 'healHP', amount: 60, description: 'Restores 60 HP' },
  { name: 'Hero\'s Medal', price: 0, effect: 'heroBonus', description: 'Permanent +10 to all stats!' }
];

// Cave loot tables per depth (deeper = better)
export const caveLootTables = {
  beer_caves_depths_1: {
    chance: 0.35,
    items: ['Cave Jerky', 'Miner\'s Tea', 'Glowcap Bite']
  },
  beer_caves_depths_2: {
    chance: 0.45,
    items: ['Crystal Infusion', 'Golem Biscuit', 'Spider Silk Wrap']
  },
  beer_caves_depths_3: {
    chance: 0.6,
    items: ['Drakefire Tonic', 'Abyssal Draught', 'Starlit Elixir']
  }
};

export const caveBossLootTables = {
  beer_caves_depths_3: {
    chance: 0.5,
    items: ['Sovereign Scale', 'Voidcore Elixir', 'Drakeheart Tonic']
  }
};

// Cambus routes (fast travel locations)
export const cambusRoutes = [
  { name: 'Downtown', map: 'downtown', x: 120, y: 120 },
  { name: 'Pentacrest', map: 'pentacrest', x: 120, y: 120 },
  { name: 'Main Library', map: 'library', x: 120, y: 120 },
  { name: 'Riverside Park', map: 'riverside', x: 80, y: 120 },
  { name: 'The Deadwood', map: 'deadwood', x: 96, y: 120 },
  { name: 'Northside', map: 'northside', x: 128, y: 96 },
  { name: 'Beer Caves', map: 'beer_caves', x: 128, y: 96 },
  { name: 'Kinnick Stadium', map: 'kinnick_stadium', x: 128, y: 96 },
  { name: 'Oakland Cemetery', map: 'oakland_cemetery', x: 224, y: 208 },
  { name: 'Pedestrian Mall', map: 'ped_mall', x: 128, y: 96 },
  { name: 'Old Capitol', map: 'old_capitol', x: 128, y: 120 },
  { name: 'Coralville Lake', map: 'coralville_lake', x: 128, y: 160 }
];
