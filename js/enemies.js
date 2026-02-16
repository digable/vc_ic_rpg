// Enemy Definitions
export const enemies = [
  { 
    name: 'Parking Meter', 
    hp: 15, 
    maxHp: 15, 
    attack: 3, 
    exp: 10, 
    gold: 25, 
    outdoor: true,
    specialAttack: null
  },
  { 
    name: 'Late Assignment', 
    hp: 20, 
    maxHp: 20, 
    attack: 5, 
    exp: 15, 
    gold: 35, 
    outdoor: false,
    specialAttack: null
  },
  { 
    name: 'Midterm Exam', 
    hp: 30, 
    maxHp: 30, 
    attack: 8, 
    exp: 25, 
    gold: 50, 
    outdoor: false,
    specialAttack: { name: 'Stress Wave', damage: 12, mpCost: 0 }
  },
  { 
    name: 'Group Project', 
    hp: 45, 
    maxHp: 45, 
    attack: 12, 
    exp: 40, 
    gold: 75, 
    outdoor: false,
    specialAttack: { name: 'Deadline Pressure', damage: 18, mpCost: 0 }
  },
  { 
    name: 'Raccoon', 
    hp: 25, 
    maxHp: 25, 
    attack: 7, 
    exp: 20, 
    gold: 30, 
    outdoor: true,
    specialAttack: { name: 'Trash Attack', damage: 10, mpCost: 0 }
  },
  { 
    name: 'Coffee Withdrawal', 
    hp: 35, 
    maxHp: 35, 
    attack: 10, 
    exp: 30, 
    gold: 60, 
    outdoor: false,
    specialAttack: { name: 'Fatigue', damage: 15, mpCost: 0, effect: 'drainMP', drainAmount: 5 }
  },
  { 
    name: 'Final Boss: Thesis', 
    hp: 100, 
    maxHp: 100, 
    attack: 20, 
    exp: 100, 
    gold: 200, 
    outdoor: false,
    specialAttack: { name: 'Citation Storm', damage: 30, mpCost: 0 }
  },
  // Beer Caves Monsters
  { 
    name: 'Bat Swarm', 
    hp: 22, 
    maxHp: 22, 
    attack: 6, 
    exp: 18, 
    gold: 40, 
    location: 'beer_caves',
    specialAttack: { name: 'Sonic Screech', damage: 9, mpCost: 0 }
  },
  { 
    name: 'Cave Spider', 
    hp: 28, 
    maxHp: 28, 
    attack: 8, 
    exp: 22, 
    gold: 45, 
    location: 'beer_caves',
    specialAttack: { name: 'Web Trap', damage: 12, mpCost: 0 }
  },
  { 
    name: 'Stone Golem', 
    hp: 50, 
    maxHp: 50, 
    attack: 14, 
    exp: 45, 
    gold: 90, 
    location: 'beer_caves',
    specialAttack: { name: 'Rock Slam', damage: 20, mpCost: 0 }
  },
  { 
    name: 'Glowing Mushroom', 
    hp: 18, 
    maxHp: 18, 
    attack: 4, 
    exp: 16, 
    gold: 35, 
    location: 'beer_caves',
    specialAttack: { name: 'Spore Cloud', damage: 8, mpCost: 0, effect: 'poison' }
  },
  { 
    name: 'Crystal Elemental', 
    hp: 40, 
    maxHp: 40, 
    attack: 11, 
    exp: 38, 
    gold: 85, 
    location: 'beer_caves',
    specialAttack: { name: 'Shatter', damage: 18, mpCost: 0 }
  },
  { 
    name: 'Cave Drake', 
    hp: 65, 
    maxHp: 65, 
    attack: 16, 
    exp: 55, 
    gold: 120, 
    location: 'beer_caves',
    specialAttack: { name: 'Dragon Breath', damage: 25, mpCost: 0 }
  }
];
