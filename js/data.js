// Game Data - Items, Spells, Shops, Training

// Shop items
export const shopItems = [
  { name: 'Potion', price: 30, effect: 'heal', amount: 30, description: 'Restores 30 HP' },
  { name: 'Energy Drink', price: 50, effect: 'healMP', amount: 20, description: 'Restores 20 MP' },
  { name: 'Textbook', price: 100, effect: 'attackUp', amount: 3, description: '+3 Attack' },
  { name: 'Lucky Charm', price: 150, effect: 'maxHpUp', amount: 20, description: '+20 Max HP' }
];

// Magic training options
export const magicTraining = [
  { name: 'Fireball Training', price: 80, effect: 'magicUp', amount: 3, spell: 'Fireball', description: '+3 Magic, Learn Fireball' },
  { name: 'Ice Blast Training', price: 120, effect: 'magicUp', amount: 5, spell: 'Ice Blast', description: '+5 Magic, Learn Ice Blast' },
  { name: 'Thunder Training', price: 200, effect: 'magicMpUp', amount: 10, spell: 'Thunder', description: '+10 MP, Learn Thunder' },
  { name: 'Arcane Mastery', price: 300, effect: 'magicCombo', amount: 0, spell: 'Arcane Missile', description: '+5 Mag, +15 MP, Learn Arcane' }
];

// Yoga studio defensive techniques
export const yogaTechniques = [
  { name: 'Warrior Pose', price: 60, effect: 'defenseUp', amount: 2, skill: 'Block', description: '+2 Defense, Learn Block' },
  { name: 'Tree Balance', price: 90, effect: 'defenseUp', amount: 3, skill: 'Counter', description: '+3 Defense, Learn Counter' },
  { name: 'Meditation Practice', price: 120, effect: 'hpMpCombo', amount: 0, skill: 'Regenerate', description: '+15 HP, +10 MP, Regen skill' },
  { name: 'Mindful Breathing', price: 150, effect: 'defenseUp', amount: 2, skill: 'Meditation', description: '+2 Def, MP regen skill' },
  { name: 'Advanced Flow', price: 180, effect: 'defenseCombo', amount: 5, skill: 'Dodge', description: '+5 Defense, Learn Dodge' }
];

// Spell database
export const spellData = {
  'Fire Bolt': { type: 'attack', mpCost: 5, power: 1.2, description: 'Basic fire spell' },
  'Fireball': { type: 'attack', mpCost: 10, power: 1.8, description: 'Powerful fire attack' },
  'Ice Blast': { type: 'attack', mpCost: 12, power: 2.0, description: 'Freezing ice attack' },
  'Thunder': { type: 'attack', mpCost: 15, power: 2.5, description: 'Lightning strike' },
  'Arcane Missile': { type: 'attack', mpCost: 8, power: 1.5, description: 'Magic missile' },
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
  { name: 'Protein Shake', price: 35, effect: 'buffAttack', amount: 5, turns: 3, description: 'Temp +5 Attack (3 turns)', vendor: 'Food Cart Vendor' },
  { name: 'Kombucha', price: 30, effect: 'buffDefense', amount: 5, turns: 3, description: 'Temp +5 Defense (3 turns)', vendor: 'Food Cart Vendor' },
  { name: 'Burrito', price: 40, effect: 'healBoth', hpAmount: 30, mpAmount: 10, description: 'Restore 30 HP & 10 MP', vendor: 'Food Cart Vendor' },
  { name: 'Green Smoothie', price: 25, effect: 'buffMagic', amount: 3, turns: 3, description: 'Temp +3 Magic (3 turns)', vendor: 'Food Cart Vendor' },
  
  // Restaurant Owner (Fine Dining)
  { name: 'Steak Dinner', price: 60, effect: 'healHP', amount: 50, description: 'Restores 50 HP', vendor: 'Restaurant Owner' },
  { name: 'Lobster Bisque', price: 55, effect: 'healMP', amount: 30, description: 'Restores 30 MP', vendor: 'Restaurant Owner' },
  { name: 'Chef Special', price: 80, effect: 'healBoth', hpAmount: 45, mpAmount: 25, description: 'Restore 45 HP & 25 MP', vendor: 'Restaurant Owner' },
  { name: 'Power Meal', price: 70, effect: 'buffAttack', amount: 8, turns: 4, description: 'Temp +8 Attack (4 turns)', vendor: 'Restaurant Owner' },
  { name: 'Focus Platter', price: 65, effect: 'buffMagic', amount: 6, turns: 4, description: 'Temp +6 Magic (4 turns)', vendor: 'Restaurant Owner' },
  
  // Chef (Asian Cuisine)
  { name: 'Ramen Bowl', price: 35, effect: 'healHP', amount: 35, description: 'Restores 35 HP', vendor: 'Chef' },
  { name: 'Boba Tea', price: 30, effect: 'healMP', amount: 20, description: 'Restores 20 MP', vendor: 'Chef' },
  { name: 'Sushi Combo', price: 50, effect: 'healBoth', hpAmount: 35, mpAmount: 15, description: 'Restore 35 HP & 15 MP', vendor: 'Chef' },
  { name: 'Spicy Curry', price: 45, effect: 'buffAttack', amount: 6, turns: 3, description: 'Temp +6 Attack (3 turns)', vendor: 'Chef' },
  { name: 'Green Tea', price: 40, effect: 'buffDefense', amount: 7, turns: 4, description: 'Temp +7 Defense (4 turns)', vendor: 'Chef' },
  
  // Bartender (The Deadwood)
  { name: 'Beer', price: 20, effect: 'healHP', amount: 15, description: 'Restores 15 HP', vendor: 'Bartender' },
  { name: 'Whiskey Shot', price: 35, effect: 'buffAttack', amount: 7, turns: 2, description: 'Temp +7 Attack (2 turns)', vendor: 'Bartender' },
  { name: 'IPA', price: 30, effect: 'healBoth', hpAmount: 20, mpAmount: 10, description: 'Restore 20 HP & 10 MP', vendor: 'Bartender' },
  { name: 'Cocktail', price: 45, effect: 'buffMagic', amount: 5, turns: 3, description: 'Temp +5 Magic (3 turns)', vendor: 'Bartender' }
];

// Cambus routes (fast travel locations)
export const cambusRoutes = [
  { name: 'Downtown', map: 'downtown', x: 120, y: 120 },
  { name: 'Pentacrest', map: 'pentacrest', x: 120, y: 120 },
  { name: 'Main Library', map: 'library', x: 120, y: 120 },
  { name: 'Riverside Park', map: 'riverside', x: 80, y: 120 },
  { name: 'The Deadwood', map: 'deadwood', x: 96, y: 120 },
  { name: 'Northside', map: 'northside', x: 128, y: 96 }
];
