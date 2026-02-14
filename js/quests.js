export // Side Quests - Iowa City Specific
const questDatabase = {
  // Downtown Quests
  coffee_run: {
    id: 'coffee_run',
    name: 'The Coffee Run',
    giver: 'Townie',
    location: 'downtown',
    description: 'The Townie needs his morning coffee fix. Bring him an Energy Bar from any food cart.',
    objectives: [{ type: 'bring_item', item: 'Energy Bar', amount: 1 }],
    rewards: { gold: 50, exp: 20, item: 'Burrito' },
    dialogue: {
      offer: ['I desperately need caffeine!', 'Can you grab me an Energy Bar?', "I'll make it worth your while!"],
      progress: ['Any luck finding that Energy Bar?'],
      complete: ['YES! You are a lifesaver!', 'Here, take this as thanks!']
    }
  },
  
  // Pentacrest Quests
  campus_tour: {
    id: 'campus_tour',
    name: 'Campus Tour Guide',
    giver: 'Professor',
    location: 'pentacrest',
    description: 'The Professor needs you to visit all major campus locations for a research survey.',
    objectives: [
      { type: 'visit_location', location: 'library', visited: false },
      { type: 'visit_location', location: 'riverside', visited: false },
      { type: 'visit_location', location: 'deadwood', visited: false }
    ],
    rewards: { gold: 100, exp: 50, spell: 'Shield' },
    dialogue: {
      offer: ["I'm conducting campus research.", 'Visit the Library, Riverside, and Deadwood.', 'Report back when done!'],
      progress: ['Keep exploring campus!', 'Visit all three locations.'],
      complete: ['Excellent fieldwork!', 'This will help my research greatly.', 'Take this reward!']
    }
  },
  
  // Library Quest
  overdue_books: {
    id: 'overdue_books',
    name: 'The Overdue Books',
    giver: 'Researcher',
    location: 'library',
    description: 'Defeat 5 Late Assignment enemies to clear the overdue book backlog.',
    objectives: [{ type: 'defeat_enemy', enemy: 'Late Assignment', count: 0, needed: 5 }],
    rewards: { gold: 75, exp: 40, maxMp: 10 },
    dialogue: {
      offer: ['These Late Assignments are everywhere!', 'Help me clear them out.', 'Defeat 5 of them!'],
      progress: ['Still working on those assignments?'],
      complete: ['Finally! The library is clear!', 'Thank you so much!']
    }
  },
  
  // Riverside Quest  
  river_cleanup: {
    id: 'river_cleanup',
    name: 'River Cleanup Crew',
    giver: 'Jogger',
    location: 'riverside',
    description: 'Clear out 3 Raccoons that have been making a mess in the park.',
    objectives: [{ type: 'defeat_enemy', enemy: 'Raccoon', count: 0, needed: 3 }],
    rewards: { gold: 60, exp: 30, item: 'Green Smoothie' },
    dialogue: {
      offer: ['These raccoons are destroying the park!', 'Can you help get rid of them?', 'We need to defeat 3 of them.'],
      progress: ['Thanks for helping with the raccoons!'],
      complete: ['The park is so much cleaner now!', 'Here is your reward!']
    }
  },
  
  // Deadwood Quest
  bar_tab: {
    id: 'bar_tab',
    name: 'Settling the Tab',
    giver: 'Regular',
    location: 'deadwood',
    description: 'The Regular owes money. Collect 200 gold from battles and help him pay his tab.',
    objectives: [{ type: 'collect_gold', amount: 0, needed: 200 }],
    rewards: { gold: 50, exp: 35, item: 'Whiskey Shot' },
    dialogue: {
      offer: ["I'm a bit short on cash...", 'If you can spare 200 gold,', "I'll give you something special!"],
      progress: ['Working on getting that gold?'],
      complete: ['You are a true friend!', 'Drinks on me... well, soon!']
    }
  },
  
  // Northside Quest
  food_critic_challenge: {
    id: 'food_critic_challenge',
    name: 'The Food Critic Challenge',
    giver: 'Food Critic',
    location: 'northside',
    description: 'Buy food from all three Northside vendors to complete the tasting challenge.',
    objectives: [
      { type: 'buy_from_vendor', vendor: 'Restaurant Owner', bought: false },
      { type: 'buy_from_vendor', vendor: 'Chef', bought: false },
      { type: 'buy_from_vendor', vendor: 'Food Cart Vendor', bought: false }
    ],
    rewards: { gold: 120, exp: 60, maxHp: 15 },
    dialogue: {
      offer: ['Want to join my food tour?', 'Buy something from each vendor here.', "I'll reward your refined palate!"],
      progress: ['Keep sampling the local cuisine!'],
      complete: ['Exquisite taste!', 'You truly appreciate good food!']
    }
  },
  
  // Student Quest
  study_buddy: {
    id: 'study_buddy',
    name: 'Study Buddy Needed',
    giver: 'Student',
    location: 'pentacrest',
    description: 'Defeat 2 Midterm Exams and 1 Final Boss to help the student pass their classes.',
    objectives: [
      { type: 'defeat_enemy', enemy: 'Midterm Exam', count: 0, needed: 2 },
      { type: 'defeat_enemy', enemy: 'Final Boss: Thesis', count: 0, needed: 1 }
    ],
    rewards: { gold: 150, exp: 100, skill: 'Scholar' },
    dialogue: {
      offer: ["I'm drowning in exams!", 'Help me defeat these academic monsters!', '2 Midterms and 1 Thesis!'],
      progress: ['Still fighting those exams?', 'Good luck!'],
      complete: ['WE PASSED!', 'You are an amazing study buddy!', 'Take this reward!']
    }
  },
  
  // Artist Quest
  inspiration_quest: {
    id: 'inspiration_quest',
    name: 'Seeking Inspiration',
    giver: 'Artist',
    location: 'riverside',
    description: 'Reach level 5 to inspire the artist with your heroic journey.',
    objectives: [{ type: 'reach_level', level: 5 }],
    rewards: { gold: 100, exp: 0, item: 'Chef Special' },
    dialogue: {
      offer: ['I need artistic inspiration!', 'Become a true hero - reach level 5!', "Your journey will inspire my art!"],
      progress: ['Keep growing stronger!', 'Your journey inspires me already.'],
      complete: ['You have become legendary!', 'This is exactly what I needed!', 'Thank you!']
    }
  }
};
