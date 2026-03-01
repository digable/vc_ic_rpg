// NES Final Fantasy-style Leveling System
import { game, actions } from './game-state.js';

// Experience thresholds for each level (up to 50)
export const expThresholds = [
  0, 100, 200, 350, 500, 700, 950, 1250, 1600, 2000,        // Levels 1-10
  2450, 2950, 3500, 4100, 4750, 5450, 6200, 7000, 7850, 8750, // Levels 11-20
  9700, 10700, 11750, 12850, 14000, 15200, 16450, 17750, 19100, 20500, // Levels 21-30
  22000, 23550, 25150, 26800, 28500, 30250, 32050, 33900, 35800, 37750, // Levels 31-40
  39750, 41800, 43900, 46050, 48250, 50500, 52800, 55150, 57550, 60000  // Levels 41-50
];

// Stat growth tables by class (chance to gain stat on level up)
export const statGrowthTables = {
  'Student': { // Baseline - Balanced growth all stats
    strength: { base: 1, chance: 0.25 },
    vitality: { base: 1, chance: 0.25 },
    intellect: { base: 1, chance: 0.25 },
    agility: { base: 1, chance: 0.25 },
    luck: { base: 1, chance: 0.25 },
    defense: { base: 1, chance: 0.25 }
  },
  'Hawkeye': { // Athlete - High STR/VIT growth
    strength: { base: 2, chance: 1.0 }, // Guaranteed
    vitality: { base: 2, chance: 0.25 },
    intellect: { base: 0, chance: 0.25 },
    agility: { base: 1, chance: 0.25 },
    luck: { base: 0, chance: 0.25 },
    defense: { base: 1, chance: 0.25 }
  },
  'Scholar': { // Academic - High INT/VIT growth
    strength: { base: 1, chance: 0.25 },
    vitality: { base: 2, chance: 0.25 },
    intellect: { base: 2, chance: 1.0 }, // Guaranteed
    agility: { base: 1, chance: 0.25 },
    luck: { base: 0, chance: 0.25 },
    defense: { base: 0, chance: 0.25 }
  },
  'Engineer': { // Tech-focused - High AGI growth
    strength: { base: 1, chance: 0.25 },
    vitality: { base: 1, chance: 0.25 },
    intellect: { base: 1, chance: 0.25 },
    agility: { base: 2, chance: 1.0 }, // Guaranteed
    luck: { base: 1, chance: 0.25 },
    defense: { base: 0, chance: 0.25 }
  },
  'Greek': { // Greek life - Balanced & social
    strength: { base: 1, chance: 0.25 },
    vitality: { base: 2, chance: 1.0 }, // Guaranteed
    intellect: { base: 1, chance: 0.25 },
    agility: { base: 1, chance: 0.25 },
    luck: { base: 1, chance: 0.25 },
    defense: { base: 1, chance: 0.25 }
  },
  'Artist': { // Creative - High INT/AGI growth
    strength: { base: 0, chance: 0.25 },
    vitality: { base: 1, chance: 0.25 },
    intellect: { base: 2, chance: 0.25 },
    agility: { base: 2, chance: 1.0 }, // Guaranteed
    luck: { base: 1, chance: 0.25 },
    defense: { base: 0, chance: 0.25 }
  }
};

// HP growth patterns (level: base HP gain)
export const hpGrowthPatterns = {
  'Student': { // Baseline - average HP growth
    base: 5,
    strongLevels: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
  },
  'Hawkeye': { // Athlete - strong HP growth
    base: 7,
    strongLevels: [5, 10, 15, 20, 30, 40, 50]
  },
  'Scholar': { // Academic - moderate HP growth
    base: 5,
    strongLevels: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
  },
  'Engineer': { // Tech - moderate HP growth
    base: 5,
    strongLevels: [4, 8, 12, 16, 24, 32, 40, 48]
  },
  'Greek': { // Social - very strong HP growth
    base: 8,
    strongLevels: [3, 6, 9, 12, 18, 24, 30, 36, 42, 48]
  },
  'Artist': { // Creative - lower HP growth
    base: 3,
    strongLevels: [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48]
  }
};

/**
 * Calculate experience needed to reach next level
 */
export function getExpForNextLevel(currentLevel) {
  if (currentLevel >= 50) return Infinity;
  return expThresholds[currentLevel];
}

/**
 * Get the player's class (determined by equipment/training)
 */
export function getPlayerClass() {
  // For now, return 'Student' as default
  // In future, could be determined by equipped gear or player choice
  return 'Student';
}

/**
 * Roll stat increase based on growth table
 */
function shouldStatIncrease(chance) {
  return Math.random() < chance;
}

/**
 * Handle player level up - called when exp threshold reached
 */
export function handleLevelUp() {
  if (game.player.level >= 50) return; // Max level reached
  
  const playerClass = getPlayerClass();
  const growthTable = statGrowthTables[playerClass] || statGrowthTables['Student'];
  const hpPattern = hpGrowthPatterns[playerClass] || hpGrowthPatterns['Student'];
  
  const nextLevel = game.player.level + 1;
  
  // Calculate stat gains
  const statGains = {
    attack: 0,
    magic: 0,
    defense: 0,
    strength: 0,
    vitality: 0,
    intellect: 0,
    agility: 0,
    luck: 0
  };
  
  // Strength
  if (growthTable.strength.chance === 1.0) {
    statGains.attack += growthTable.strength.base;
  } else if (shouldStatIncrease(growthTable.strength.chance)) {
    statGains.attack += growthTable.strength.base;
  }
  
  // Vitality (affects max HP and defense)
  if (growthTable.vitality.chance === 1.0) {
    statGains.vitality += growthTable.vitality.base;
  } else if (shouldStatIncrease(growthTable.vitality.chance)) {
    statGains.vitality += growthTable.vitality.base;
  }
  
  // Intellect (affects magic)
  if (growthTable.intellect.chance === 1.0) {
    statGains.magic += growthTable.intellect.base;
  } else if (shouldStatIncrease(growthTable.intellect.chance)) {
    statGains.magic += growthTable.intellect.base;
  }
  
  // Agility (slight attack/defense boost)
  if (growthTable.agility.chance === 1.0) {
    statGains.attack += growthTable.agility.base * 0.5;
  } else if (shouldStatIncrease(growthTable.agility.chance)) {
    statGains.attack += growthTable.agility.base * 0.5;
  }
  
  // Defense
  if (growthTable.defense.chance === 1.0) {
    statGains.defense += growthTable.defense.base;
  } else if (shouldStatIncrease(growthTable.defense.chance)) {
    statGains.defense += growthTable.defense.base;
  }
  
  // Apply stat gains
  const attackGain = Math.round(statGains.attack);
  const magicGain = Math.round(statGains.magic);
  const defenseGain = Math.round(statGains.defense);
  
  // HP Growth: base amount + vitality bonus + potential strong level bonus
  let hpGain = hpPattern.base + (statGains.vitality * 2);
  if (hpPattern.strongLevels.includes(nextLevel)) {
    hpGain += 10;
  }
  const roundedHpGain = Math.round(hpGain);
  const nextMaxHp = game.player.maxHp + roundedHpGain;
  
  // MP growth (intellect-based)
  const mpGain = 2 + (statGains.magic * 0.5);
  const roundedMpGain = Math.round(mpGain);
  const nextMaxMp = game.player.maxMp + roundedMpGain;

  actions.playerPatched({
    level: nextLevel,
    attack: game.player.attack + attackGain,
    magic: game.player.magic + magicGain,
    defense: game.player.defense + defenseGain,
    maxHp: nextMaxHp,
    hp: nextMaxHp,
    maxMp: nextMaxMp,
    mp: nextMaxMp
  }, 'levelingLevelUpApplied');
  
  // Show level up message
  const messages = [
    `Level ${nextLevel}!`,
    `HP +${Math.round(hpGain)} (${game.player.maxHp})`,
    `MP +${Math.round(mpGain)}`,
    `ATK +${attackGain} | DEF +${defenseGain}`
  ];
  
  return messages;
}

/**
 * Add experience to player and handle level ups
 */
export function addExperience(amount) {
  actions.playerPatched({ exp: game.player.exp + amount }, 'experienceAdded');
  
  const levelUpMessages = [];
  
  // Check for level ups
  while (game.player.level < 50 && game.player.exp >= getExpForNextLevel(game.player.level)) {
    const messages = handleLevelUp();
    if (messages) levelUpMessages.push(...messages);
  }
  
  return levelUpMessages;
}
