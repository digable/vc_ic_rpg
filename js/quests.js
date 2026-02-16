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
  },
  
  // Beer Caves Quests
  cave_exploration: {
    id: 'cave_exploration',
    name: 'Cave Exploration',
    giver: 'Caver',
    location: 'beer_caves',
    description: 'Defeat 4 different types of cave creatures to map out the beer caves.',
    objectives: [
      { type: 'defeat_enemy', enemy: 'Bat Swarm', count: 0, needed: 1 },
      { type: 'defeat_enemy', enemy: 'Cave Spider', count: 0, needed: 1 },
      { type: 'defeat_enemy', enemy: 'Glowing Mushroom', count: 0, needed: 1 },
      { type: 'defeat_enemy', enemy: 'Stone Golem', count: 0, needed: 1 }
    ],
    rewards: { gold: 130, exp: 65, maxHp: 20 },
    dialogue: {
      offer: ['Welcome, explorer!', 'I need to map the caves.', 'Defeat one of each creature type: Bat, Spider, Mushroom, and Golem!'],
      progress: ['How goes your exploration?', 'Keep finding those creatures!'],
      complete: ['Excellent work, brave explorer!', 'These findings will help us understand the caves!', 'Here is your reward!']
    }
  },
  
  crystal_hunt: {
    id: 'crystal_hunt',
    name: 'Crystal Elemental Hunt',
    giver: 'Explorer',
    location: 'beer_caves',
    description: 'Defeat 3 Crystal Elementals to collect rare cave crystals.',
    objectives: [{ type: 'defeat_enemy', enemy: 'Crystal Elemental', count: 0, needed: 3 }],
    rewards: { gold: 100, exp: 55, item: 'Mana Potion' },
    dialogue: {
      offer: ['The Crystal Elementals are fascinating!', 'Can you defeat 3 of them?', 'I need to study their crystalline structure.'],
      progress: ['Any luck with the Elementals?'],
      complete: ['Perfect specimens!', 'This will advance my research greatly!', 'Thank you!']
    }
  },
  
  dragon_slayer: {
    id: 'dragon_slayer',
    name: 'The Dragon Threat',
    giver: 'Caver',
    location: 'beer_caves',
    description: 'Defeat the Cave Drake that has been terrorizing the deeper caves.',
    objectives: [{ type: 'defeat_enemy', enemy: 'Cave Drake', count: 0, needed: 2 }],
    rewards: { gold: 180, exp: 90, skill: 'Legendary Warrior' },
    dialogue: {
      offer: ['A terrible beast lurks deeper...', 'The Cave Drake is a real threat!', 'Defeat 2 of them if you can!'],
      progress: ['Beware the Drake!', 'Good luck out there!'],
      complete: ['You actually did it!', 'You are truly a legendary warrior!', 'Take this honor!']
    }
  },
  
  // New Story-Driven Quests
  hawkeye_spirit: {
    id: 'hawkeye_spirit',
    name: 'Hawkeye Spirit',
    giver: 'Coach',
    location: 'kinnick_stadium',
    description: 'Prove your Hawkeye pride by defeating 3 Rival Fans in the stadium.',
    objectives: [{ type: 'defeat_enemy', enemy: 'Rival Fan', count: 0, needed: 3 }],
    rewards: { gold: 90, exp: 50, item: 'Hawkeye Jersey' },
    dialogue: {
      offer: ['Welcome to Kinnick!', 'Some rival fans are causing trouble.', 'Show them the true Hawkeye spirit!'],
      progress: ['How\'s the fan situation?', 'Keep fighting!'],
      complete: ['GO HAWKS!', 'You\'ve proven your loyalty!', 'Take this jersey with pride!']
    }
  },
  
  stadium_tour: {
    id: 'stadium_tour',
    name: 'Stadium Tour',
    giver: 'Superfan',
    location: 'kinnick_stadium',
    description: 'Visit all the major Iowa City landmarks to prove you\'re a true local.',
    objectives: [
      { type: 'visit_location', location: 'ped_mall', visited: false },
      { type: 'visit_location', location: 'old_capitol', visited: false },
      { type: 'visit_location', location: 'coralville_lake', visited: false }
    ],
    rewards: { gold: 110, exp: 60, maxHp: 20 },
    dialogue: {
      offer: ['Want to see the real Iowa City?', 'Visit the Ped Mall, Old Capitol, and Coralville Lake!', 'Come back when you\'ve seen them all!'],
      progress: ['Keep exploring!', 'There\'s so much to see!'],
      complete: ['You\'re a true Iowa City local now!', 'Here\'s your reward!']
    }
  },
  
  lost_guitar: {
    id: 'lost_guitar',
    name: 'Lost Guitar',
    giver: 'Street Musician',
    location: 'ped_mall',
    description: 'Find the musician\'s lost guitar by defeating Street Performers.',
    objectives: [{ type: 'defeat_enemy', enemy: 'Street Performer', count: 0, needed: 2 }],
    rewards: { gold: 70, exp: 40, item: 'Music Note' },
    dialogue: {
      offer: ['Someone stole my guitar!', 'Other street performers might have it.', 'Please help me find it!'],
      progress: ['Any luck finding my guitar?'],
      complete: ['You found it!', 'I can play music again!', 'Thank you so much!']
    }
  },
  
  capitol_mystery: {
    id: 'capitol_mystery',
    name: 'The Capitol Mystery',
    giver: 'Historian',
    location: 'old_capitol',
    description: 'Investigate the haunted Old Capitol by defeating ghosts.',
    objectives: [
      { type: 'defeat_enemy', enemy: 'Haunted Portrait', count: 0, needed: 2 },
      { type: 'defeat_enemy', enemy: 'Historic Ghost', count: 0, needed: 2 }
    ],
    rewards: { gold: 140, exp: 80, spell: 'Restore' },
    dialogue: {
      offer: ['Strange things happen at night here...', 'Haunted portraits and ghosts appear!', 'Can you investigate?'],
      progress: ['Be careful with the ghosts!', 'They\'re quite powerful!'],
      complete: ['The mystery is solved!', 'Thank you for cleansing this place!', 'Take this ancient spell!']
    }
  },
  
  lake_monster: {
    id: 'lake_monster',
    name: 'The Lake Monster',
    giver: 'Fisherman',
    location: 'coralville_lake',
    description: 'Defeat the legendary Lake Monster lurking in Coralville Lake.',
    objectives: [{ type: 'defeat_enemy', enemy: 'Lake Monster', count: 0, needed: 1 }],
    rewards: { gold: 200, exp: 100, item: 'Lake Trophy' },
    dialogue: {
      offer: ['There\'s a monster in this lake!', 'It\'s huge and terrifying!', 'Only a hero can defeat it!'],
      progress: ['Be very careful...', 'The monster is powerful!'],
      complete: ['You did it!', 'The lake is safe now!', 'You\'re a true hero!']
    }
  },
  
  camping_supplies: {
    id: 'camping_supplies',
    name: 'Camping Supplies',
    giver: 'Camper',
    location: 'coralville_lake',
    description: 'Collect gold to help the camper buy supplies.',
    objectives: [{ type: 'collect_gold', amount: 0, needed: 150 }],
    rewards: { gold: 40, exp: 45, item: 'Camping Tent' },
    dialogue: {
      offer: ['I need to buy camping gear...', 'Can you help me with 150 gold?', 'I\'ll pay you back!'],
      progress: ['Thanks for helping!', 'I really appreciate it!'],
      complete: ['Perfect!', 'Now I can go camping!', 'Take this as thanks!']
    }
  },
  
  // Main Story Quest
  corruption_source: {
    id: 'corruption_source',
    name: 'Source of Corruption',
    giver: 'Professor',
    location: 'pentacrest',
    description: 'Reach level 10 and defeat the Corrupted Administrator to save Iowa City.',
    objectives: [
      { type: 'reach_level', level: 10 },
      { type: 'defeat_enemy', enemy: 'Corrupted Administrator', count: 0, needed: 1 }
    ],
    rewards: { gold: 500, exp: 200, item: 'Hero\'s Medal' },
    isMainQuest: true,
    dialogue: {
      offer: ['Something dark threatens Iowa City...', 'A corrupted force has taken root in the Old Capitol.', 'Only a true hero at level 10 can stop it!'],
      progress: ['Grow stronger...', 'Iowa City needs you!', 'The corruption spreads...'],
      complete: ['YOU DID IT!', 'Iowa City is saved!', 'You are the hero we needed!', 'Thank you, brave warrior!']
    }
  }
};
