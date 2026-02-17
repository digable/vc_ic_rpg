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
  },
  // Beer Caves Depths I Enemies
  {
    name: 'Fungal Stalker',
    hp: 32,
    maxHp: 32,
    attack: 9,
    exp: 26,
    gold: 55,
    location: 'beer_caves_depths_1',
    color: '#6a4b7a',
    specialAttack: { name: 'Spore Burst', damage: 14, mpCost: 0 }
  },
  {
    name: 'Cave Leech',
    hp: 28,
    maxHp: 28,
    attack: 8,
    exp: 24,
    gold: 50,
    location: 'beer_caves_depths_1',
    color: '#2f3f2f',
    specialAttack: { name: 'Siphon Bite', damage: 12, mpCost: 0, effect: 'drainMP', drainAmount: 4 }
  },
  // Beer Caves Depths II Enemies
  {
    name: 'Crystal Warden',
    hp: 55,
    maxHp: 55,
    attack: 15,
    exp: 52,
    gold: 115,
    location: 'beer_caves_depths_2',
    color: '#44c8e0',
    specialAttack: { name: 'Shard Lance', damage: 22, mpCost: 0 }
  },
  {
    name: 'Tunnel Brute',
    hp: 70,
    maxHp: 70,
    attack: 18,
    exp: 60,
    gold: 130,
    location: 'beer_caves_depths_2',
    color: '#6b5b4b',
    specialAttack: { name: 'Ground Smash', damage: 26, mpCost: 0 }
  },
  // Beer Caves Depths III Enemies
  {
    name: 'Abyssal Drake',
    hp: 85,
    maxHp: 85,
    attack: 22,
    exp: 80,
    gold: 170,
    location: 'beer_caves_depths_3',
    color: '#3a2a3f',
    specialAttack: { name: 'Void Flame', damage: 32, mpCost: 0 }
  },
  {
    name: 'Void Mycelium',
    hp: 62,
    maxHp: 62,
    attack: 20,
    exp: 72,
    gold: 155,
    location: 'beer_caves_depths_3',
    color: '#513a66',
    specialAttack: { name: 'Spore Nova', damage: 28, mpCost: 0 }
  },
  {
    name: 'Cave Sovereign',
    hp: 120,
    maxHp: 120,
    attack: 28,
    exp: 120,
    gold: 260,
    location: 'beer_caves_depths_3',
    isBoss: true,
    color: '#2b2230',
    specialAttack: { name: 'Royal Cataclysm', damage: 38, mpCost: 0 }
  },
  // Stadium Enemies
  { 
    name: 'Rival Fan', 
    hp: 28, 
    maxHp: 28, 
    attack: 9, 
    exp: 22, 
    gold: 45, 
    location: 'kinnick_stadium',
    specialAttack: { name: 'Trash Talk', damage: 13, mpCost: 0, effect: 'intimidate' }
  },
  { 
    name: 'Lost Football', 
    hp: 20, 
    maxHp: 20, 
    attack: 6, 
    exp: 18, 
    gold: 40, 
    location: 'kinnick_stadium',
    specialAttack: null
  },
  { 
    name: 'Angry Mascot', 
    hp: 45, 
    maxHp: 45, 
    attack: 13, 
    exp: 38, 
    gold: 80, 
    location: 'kinnick_stadium',
    specialAttack: { name: 'Herky Charge', damage: 20, mpCost: 0 }
  },
  // Pedestrian Mall Enemies
  { 
    name: 'Street Performer', 
    hp: 22, 
    maxHp: 22, 
    attack: 7, 
    exp: 19, 
    gold: 42, 
    outdoor: true,
    specialAttack: { name: 'Distracting Act', damage: 10, mpCost: 0 }
  },
  { 
    name: 'Shopping Cart', 
    hp: 18, 
    maxHp: 18, 
    attack: 5, 
    exp: 16, 
    gold: 35, 
    outdoor: true,
    specialAttack: null
  },
  // Old Capitol Enemies
  { 
    name: 'Haunted Portrait', 
    hp: 32, 
    maxHp: 32, 
    attack: 10, 
    exp: 27, 
    gold: 55, 
    location: 'old_capitol',
    specialAttack: { name: 'Ghostly Stare', damage: 15, mpCost: 0 }
  },
  { 
    name: 'Historic Ghost', 
    hp: 40, 
    maxHp: 40, 
    attack: 12, 
    exp: 35, 
    gold: 70, 
    location: 'old_capitol',
    specialAttack: { name: 'Phantom Touch', damage: 18, mpCost: 0, effect: 'chill' }
  },
  // Lake Enemies
  { 
    name: 'Lake Monster', 
    hp: 70, 
    maxHp: 70, 
    attack: 17, 
    exp: 60, 
    gold: 130, 
    location: 'coralville_lake',
    specialAttack: { name: 'Tidal Wave', damage: 27, mpCost: 0 }
  },
  { 
    name: 'Angry Goose', 
    hp: 24, 
    maxHp: 24, 
    attack: 8, 
    exp: 20, 
    gold: 38, 
    location: 'coralville_lake',
    specialAttack: { name: 'Aggressive Honk', damage: 11, mpCost: 0 }
  },
  { 
    name: 'Giant Catfish', 
    hp: 35, 
    maxHp: 35, 
    attack: 11, 
    exp: 30, 
    gold: 65, 
    location: 'coralville_lake',
    specialAttack: { name: 'Tail Slap', damage: 16, mpCost: 0 }
  },
  // Final Boss
  { 
    name: 'Corrupted Administrator', 
    hp: 150, 
    maxHp: 150, 
    attack: 25, 
    exp: 200, 
    gold: 500, 
    location: 'old_capitol',
    isBoss: true,
    specialAttack: { name: 'Bureaucratic Red Tape', damage: 40, mpCost: 0 }
  }
];
