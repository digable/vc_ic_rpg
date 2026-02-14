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
  }
];
