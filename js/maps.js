// Map Data Reference
// ------------------
// Each entry in `maps` uses this structure:
// {
//   width: number,         // tile columns (16 = 256px at 16px tiles)
//   height: number,        // tile rows
//   tiles: number[][],     // 2D tile grid, indexed [y][x]
//   npcs: [
//     {
//       x: number,         // world pixel x (usually multiples of 16)
//       y: number,         // world pixel y (usually multiples of 16)
//       name: string,
//       type?: string,     // e.g. shop, healer, yoga, cambus, food_cart, boss
//       hasQuest?: string, // quest id from quests.js
//       isSign?: boolean,  // marks sign-style NPC rendering
//       dialogue: string[]
//     }
//   ],
//   name: string,          // display name used in HUD/minimap/exit labels
//   grassWalkable?: boolean,
//   exits: [
//     {
//       x: number,         // world pixel x for transition trigger
//       y: number,         // world pixel y for transition trigger
//       toMap: string,     // destination map key in this file
//       toX: number,       // destination player x
//       toY: number,       // destination player y
//       direction: 'up' | 'down' | 'left' | 'right'
//     }
//   ]
// }
//
// Tile value legend:
// 0 = road / path (walkable)
// 1 = sidewalk / floor (walkable)
// 2 = grass / terrain (walkable only when map.grassWalkable === true)
// 3 = building / obstacle / grave marker (solid)
// 4 = bookshelf / interior obstacle (solid)
// 5 = water (solid)
// 6 = cave wall (solid; used in Beer Caves)
export const maps = {
  downtown: {
    width: 16,
    height: 15,
    tiles: [
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
      [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,1,0,0,0,0,0,0,0,0,0,0,0,0,1,2],
      [2,1,0,3,3,3,3,0,0,3,3,3,3,0,1,2],
      [2,1,0,3,3,3,3,0,0,3,3,3,3,0,1,2],
      [2,1,0,0,0,0,0,0,0,0,0,0,0,0,1,2],
      [2,1,1,1,1,0,0,0,0,0,0,1,1,1,1,2],
      [2,1,0,0,0,0,0,0,0,0,0,0,0,0,1,2],
      [2,1,0,3,3,3,3,0,0,3,3,3,3,0,1,2],
      [2,1,0,3,3,3,3,0,0,3,3,3,3,0,1,2],
      [2,1,0,0,0,0,0,0,0,0,0,0,0,0,1,2],
      [2,1,1,1,1,1,1,0,0,1,1,1,1,1,1,2],
      [2,1,0,0,0,0,0,0,0,0,0,0,0,0,1,2],
      [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
    ],
    npcs: [
      { x: 48, y: 64, name: 'Barista', type: 'healer', dialogue: ['Welcome to Iowa City!', 'Coffee is life here.', 'Free refill! HP & MP restored!'] },
      { x: 192, y: 96, name: 'Townie', hasQuest: 'coffee_run', dialogue: ['The Pentacrest is north.', 'Just walk to the top edge!', 'Watch out for homework monsters!'] },
      { x: 128, y: 160, name: 'Shop Owner', type: 'shop', dialogue: ['Welcome to the shop!', 'Buy something!'] },
      { x: 64, y: 160, name: 'Yoga Instructor', type: 'yoga', dialogue: ['Find your center.', 'Learn defensive techniques!'] },
      { x: 208, y: 120, name: 'Bus Stop', type: 'cambus', isSign: true, dialogue: ['Cambus Stop'] },
      { x: 160, y: 96, name: 'Food Cart Vendor', type: 'food_cart', dialogue: ['Hot food here!', 'Get your snacks!'] }
    ],
    name: 'Downtown Iowa City',
    exits: [
      { x: 120, y: 16, toMap: 'pentacrest', toX: 120, toY: 208, direction: 'up' },
      { x: 128, y: 16, toMap: 'coralville_lake', toX: 128, toY: 208, direction: 'up' },
      { x: 16, y: 120, toMap: 'riverside', toX: 224, toY: 120, direction: 'left' },
      { x: 224, y: 96, toMap: 'deadwood', toX: 32, toY: 112, direction: 'right' },
      { x: 128, y: 224, toMap: 'northside', toX: 128, toY: 32, direction: 'down' }
    ]
  },
  pentacrest: {
    width: 16,
    height: 15,
    tiles: [
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
      [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,1,2,2,2,2,2,2,2,2,2,2,2,2,1,2],
      [2,1,2,3,3,3,3,2,2,3,3,3,3,2,1,2],
      [2,1,2,3,3,3,3,2,2,3,3,3,3,2,1,2],
      [2,1,2,2,2,2,2,2,2,2,2,2,2,2,1,2],
      [2,1,1,1,1,1,1,2,2,1,1,1,1,1,1,2],
      [2,1,2,2,2,2,2,2,2,2,2,2,2,2,1,2],
      [2,1,2,3,3,3,3,2,2,3,3,3,3,2,1,2],
      [2,1,2,3,3,3,3,2,2,3,3,3,3,2,1,2],
      [2,1,2,2,2,2,2,2,2,2,2,2,2,2,1,2],
      [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,1,0,0,0,0,0,0,0,0,0,0,0,0,1,2],
      [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
    ],
    npcs: [
      { x: 128, y: 80, name: 'Professor', hasQuest: 'campus_tour', dialogue: ['Welcome to the Pentacrest!', 'This is the heart of campus.', 'Study hard!'] },
      { x: 80, y: 48, name: 'Chef', type: 'food_cart', dialogue: ['I cook great ramen!', 'Try the Chef Special.'] },
      { x: 64, y: 112, name: 'Student', hasQuest: 'study_buddy', dialogue: ['I have so much homework...', 'Good luck out there!'] },
      { x: 224, y: 112, name: 'Bus Stop', type: 'cambus', isSign: true, dialogue: ['Cambus Stop'] },
      { x: 192, y: 80, name: 'Food Cart Vendor', type: 'food_cart', dialogue: ['Fresh snacks!', 'Fuel up!'] }
    ],
    name: 'The Pentacrest',
    grassWalkable: true,
    exits: [
      { x: 120, y: 224, toMap: 'downtown', toX: 120, toY: 32, direction: 'down' },
      { x: 240, y: 120, toMap: 'library', toX: 32, toY: 120, direction: 'right' },
      { x: 128, y: 16, toMap: 'kinnick_stadium', toX: 128, toY: 208, direction: 'up' }
    ]
  },
  library: {
    width: 16,
    height: 15,
    tiles: [
      [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
      [3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3],
      [3,1,4,4,4,4,1,1,1,1,4,4,4,4,1,3],
      [3,1,4,4,4,4,1,1,1,1,4,4,4,4,1,3],
      [3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3],
      [3,1,4,4,4,4,1,1,1,1,4,4,4,4,1,3],
      [3,1,4,4,4,4,1,1,1,1,4,4,4,4,1,3],
      [3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3],
      [3,1,4,4,4,4,1,1,1,1,4,4,4,4,1,3],
      [3,1,4,4,4,4,1,1,1,1,4,4,4,4,1,3],
      [3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3],
      [3,1,4,4,4,4,1,1,1,1,4,4,4,4,1,3],
      [3,1,4,4,4,4,1,1,1,1,4,4,4,4,1,3],
      [3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3],
      [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
    ],
    npcs: [
      { x: 128, y: 64, name: 'Librarian', type: 'magic_trainer', dialogue: ['Shhhh! This is a library.', 'I can teach you magic...', 'For a price.'] },
      { x: 80, y: 120, name: 'Researcher', hasQuest: 'overdue_books', dialogue: ['So many books...', 'Knowledge is power!'] },
      { x: 48, y: 120, name: 'Bus Stop', type: 'cambus', isSign: true, dialogue: ['Cambus Stop'] }
    ],
    name: 'Main Library',
    exits: [
      { x: 16, y: 120, toMap: 'pentacrest', toX: 224, toY: 120, direction: 'left' }
    ]
  },
  riverside: {
    width: 16,
    height: 15,
    tiles: [
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
      [2,2,2,2,2,1,1,1,1,1,1,2,2,2,2,2],
      [2,2,2,2,2,1,1,1,1,1,1,2,2,2,2,2],
      [2,2,2,2,2,1,1,1,1,1,1,5,5,5,5,5],
      [2,2,2,2,2,1,1,1,1,1,1,5,5,5,5,5],
      [2,2,1,1,1,1,1,1,1,1,1,5,5,5,5,5],
      [2,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5],
      [2,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
      [2,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5],
      [2,2,1,1,1,1,1,1,1,1,1,5,5,5,5,5],
      [2,2,2,2,1,1,1,1,1,1,1,5,5,5,5,5],
      [2,2,2,2,2,1,1,1,1,1,1,5,5,5,5,5],
      [2,2,2,2,2,1,1,1,1,1,1,5,5,5,5,5],
      [2,2,2,2,2,1,1,1,1,1,1,2,2,2,2,2],
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
    ],
    npcs: [
      { x: 64, y: 80, name: 'Jogger', hasQuest: 'river_cleanup', dialogue: ['Nice day for a run!', 'The Iowa River is beautiful.'] },
      { x: 128, y: 120, name: 'Artist', hasQuest: 'inspiration_quest', dialogue: ['I come here for inspiration.', 'The riverside is peaceful.'] },
      { x: 80, y: 144, name: 'Yoga Instructor', type: 'yoga', dialogue: ['Breathe in...', 'Learn peace and defense.'] },
      { x: 32, y: 112, name: 'Bus Stop', type: 'cambus', isSign: true, dialogue: ['Cambus Stop'] },
      { x: 96, y: 80, name: 'Food Cart Vendor', type: 'food_cart', dialogue: ['Park snacks!', 'Healthy eats!'] }
    ],
    name: 'City Park',
    grassWalkable: true,
    exits: [
      { x: 240, y: 120, toMap: 'downtown', toX: 32, toY: 120, direction: 'right' }
    ]
  },
  deadwood: {
    width: 16,
    height: 15,
    tiles: [
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
      [2,2,3,3,3,3,3,3,3,3,3,3,3,3,2,2],
      [2,2,3,1,1,1,1,1,1,1,1,1,1,3,2,2],
      [2,2,3,1,1,1,1,1,1,1,1,1,1,3,2,2],
      [2,2,3,1,1,4,4,4,1,1,1,1,1,3,2,2],
      [2,2,3,1,1,4,4,4,1,1,1,1,1,3,2,2],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,3,2,2],
      [2,2,3,1,1,1,1,1,1,1,1,1,1,3,2,2],
      [2,2,3,1,1,1,1,1,1,1,1,1,1,3,2,2],
      [2,2,3,1,1,1,1,1,1,1,1,1,1,3,2,2],
      [2,2,3,3,3,3,3,3,3,3,3,3,3,3,2,2],
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
    ],
    npcs: [
      { x: 96, y: 64, name: 'Bartender', type: 'food_cart', dialogue: ['Welcome to The Deadwood!', 'What can I get you?'] },
      { x: 64, y: 112, name: 'Regular', hasQuest: 'bar_tab', dialogue: ['This place has been here forever.', 'Best bar in Iowa City!'] },
      { x: 144, y: 96, name: 'Pool Player', dialogue: ['Wanna play a game?', 'I come here every weekend.'] },
      { x: 32, y: 112, name: 'Bus Stop', type: 'cambus', isSign: true, dialogue: ['Cambus Stop'] }
    ],
    name: 'The Deadwood',
    grassWalkable: false,
    exits: [
      { x: 16, y: 112, toMap: 'downtown', toX: 224, toY: 64, direction: 'left' },
      { x: 112, y: 224, toMap: 'oakland_cemetery', toX: 112, toY: 32, direction: 'down' },
      { x: 128, y: 224, toMap: 'oakland_cemetery', toX: 128, toY: 32, direction: 'down' }
    ]
  },
  oakland_cemetery: {
    width: 16,
    height: 15,
    tiles: [
      [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2],
      [2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2],
      [2,2,1,1,3,3,3,1,1,1,3,3,3,3,2,2],
      [2,2,1,2,2,2,3,1,1,1,3,2,2,2,2,2],
      [2,2,1,1,1,2,3,1,1,1,3,1,1,1,2,2],
      [2,2,3,3,1,2,3,2,1,2,3,1,3,1,2,2],
      [2,2,1,1,1,1,3,2,1,2,1,1,3,1,1,2],
      [2,2,1,3,3,1,3,2,1,2,1,3,3,3,1,2],
      [2,2,1,1,3,1,1,1,1,1,1,3,1,1,1,2],
      [2,2,3,1,3,3,1,1,1,3,1,3,1,3,2,2],
      [2,2,1,1,1,3,1,3,1,3,1,1,1,3,2,2],
      [2,2,1,3,1,3,1,3,1,3,3,3,1,3,2,2],
      [2,2,1,3,1,1,1,3,1,1,1,3,1,1,1,2],
      [2,2,1,3,3,3,1,1,1,3,1,3,3,3,1,2],
      [2,2,2,2,2,2,2,2,0,1,1,1,1,1,1,2]
    ],
    npcs: [
      {
        x: 96,
        y: 144,
        name: 'Groundskeeper',
        hasQuest: 'cemetery_cleansing',
        dialogue: ['These grounds never sleep...', 'Please help calm the restless spirits.']
      },
      {
        x: 32,
        y: 32,
        name: 'Black Angel',
        type: 'black_angel',
        dialogue: ['A dark bronze statue watches in silence.']
      }
    ],
    name: 'Oakland Cemetery',
    grassWalkable: false,
    exits: [
      { x: 128, y: 16, toMap: 'deadwood', toX: 128, toY: 208, direction: 'up' },
      { x: 128, y: 224, toMap: 'northside', toX: 136, toY: 32, direction: 'down' }
    ]
  },
  northside: {
    width: 16,
    height: 15,
    tiles: [
      [2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2],
      [2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2],
      [2,2,0,0,0,0,0,0,0,0,0,0,0,0,2,2],
      [2,2,0,3,3,3,0,3,3,3,0,3,3,0,2,2],
      [2,2,0,3,3,3,0,3,3,3,0,3,3,0,2,2],
      [2,2,0,3,3,3,0,3,3,3,0,3,3,0,2,2],
      [2,2,0,0,0,0,0,0,0,0,0,0,0,0,2,2],
      [2,2,0,3,3,3,0,3,3,3,0,3,3,0,2,2],
      [2,2,0,3,3,3,0,3,3,3,0,3,3,0,2,2],
      [2,2,0,3,3,3,0,3,3,3,0,3,3,0,2,2],
      [2,2,0,0,0,0,0,0,0,0,0,0,0,0,2,2],
      [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2],
      [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2],
      [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2],
      [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2]
    ],
    npcs: [
      { x: 64, y: 48, name: 'Restaurant Owner', type: 'food_cart', dialogue: ['Best food in town!', 'Fresh ingredients daily!'] },
      { x: 128, y: 48, name: 'Chef', type: 'food_cart', dialogue: ['The kitchen is busy tonight!', 'Everything is made to order.'] },
      { x: 192, y: 48, name: 'Food Cart Vendor', type: 'food_cart', dialogue: ['Street tacos!', 'Authentic flavors!'] },
      { x: 96, y: 112, name: 'Diner', dialogue: ['The ramen here is amazing!', 'You should try it.'] },
      { x: 160, y: 112, name: 'Food Critic', hasQuest: 'food_critic_challenge', dialogue: ['I review all the restaurants.', 'Northside has the best variety.'] },
      { x: 192, y: 112, name: 'Bus Stop', type: 'cambus', isSign: true, dialogue: ['Cambus Stop'] }
    ],
    name: 'Northside',
    grassWalkable: false,
    exits: [
      { x: 136, y: 16, toMap: 'oakland_cemetery', toX: 128, toY: 208, direction: 'up' },
      { x: 120, y: 16, toMap: 'downtown', toX: 128, toY: 208, direction: 'up' },
      { x: 128, y: 224, toMap: 'beer_caves', toX: 128, toY: 16, direction: 'down' }
    ]
  },
  beer_caves: {
    width: 16,
    height: 15,
    tiles: [
      [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2],
      [2,0,0,6,0,0,6,0,0,0,0,6,0,0,0,2],
      [2,6,0,6,0,6,6,0,6,0,6,6,0,6,0,2],
      [2,6,0,0,0,0,6,0,0,0,0,6,0,0,0,2],
      [2,6,6,6,6,0,6,6,6,6,0,6,6,6,0,2],
      [2,0,0,0,6,0,0,0,0,6,0,0,0,6,0,2],
      [2,0,6,0,6,6,0,6,0,6,6,6,0,6,0,2],
      [2,0,6,0,0,0,0,6,0,0,0,6,0,0,0,2],
      [2,0,6,6,6,6,0,6,6,6,0,6,6,6,0,2],
      [2,0,0,0,0,6,0,0,0,6,0,0,0,6,0,2],
      [2,6,6,6,0,6,6,6,0,6,6,6,0,6,0,2],
      [2,0,0,6,0,0,0,6,0,0,0,6,0,0,0,2],
      [2,0,6,6,6,6,0,6,0,6,0,6,6,6,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2]
    ],
    npcs: [
      { x: 96, y: 96, name: 'Caver', hasQuest: 'cave_exploration', dialogue: ['Welcome to the Beer Caves!', 'These caverns are ancient.', 'Watch out for the creatures down here!'] },
      { x: 160, y: 64, name: 'Explorer', hasQuest: 'crystal_hunt', dialogue: ['I explore these caves often.', 'Lots of mysteries to discover.'] },
      { x: 128, y: 160, name: 'Veteran Caver', hasQuest: 'dragon_slayer', dialogue: ['The Drake is a real threat...', 'We need a hero brave enough to face it.'] }
    ],
    name: 'Beer Caves',
    grassWalkable: false,
    exits: [
      { x: 128, y: 16, toMap: 'northside', toX: 128, toY: 224, direction: 'up' },
      { x: 128, y: 224, toMap: 'beer_caves_depths_1', toX: 128, toY: 16, direction: 'down' }
    ]
  },
  beer_caves_depths_1: {
    width: 16,
    height: 15,
    tiles: [
      [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2],
      [2,0,6,0,0,6,0,0,0,0,6,0,0,6,0,2],
      [2,0,6,6,0,6,0,6,6,0,6,0,6,6,0,2],
      [2,0,0,6,0,0,0,6,0,0,0,6,0,0,0,2],
      [2,6,0,6,6,6,0,6,0,6,0,6,6,6,0,2],
      [2,0,0,0,6,0,0,0,0,6,0,0,0,6,0,2],
      [2,0,6,0,6,6,0,6,0,6,6,6,0,6,0,2],
      [2,0,6,0,0,0,0,6,0,0,0,6,0,0,0,2],
      [2,0,6,6,6,6,0,6,6,6,0,6,6,6,0,2],
      [2,0,0,0,0,6,0,0,0,6,0,0,0,6,0,2],
      [2,6,6,6,0,6,6,6,0,6,6,6,0,6,0,2],
      [2,0,0,6,0,0,0,6,0,0,0,6,0,0,0,2],
      [2,0,6,6,6,6,0,6,0,6,0,6,6,6,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2]
    ],
    npcs: [],
    name: 'Beer Caves - Depths I',
    grassWalkable: false,
    exits: [
      { x: 128, y: 16, toMap: 'beer_caves', toX: 128, toY: 208, direction: 'up' },
      { x: 128, y: 224, toMap: 'beer_caves_depths_2', toX: 128, toY: 16, direction: 'down' }
    ]
  },
  beer_caves_depths_2: {
    width: 16,
    height: 15,
    tiles: [
      [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2],
      [2,0,0,0,6,0,0,0,0,0,0,6,0,0,0,2],
      [2,6,6,0,6,0,6,6,6,0,6,6,0,6,0,2],
      [2,0,0,0,0,0,6,0,0,0,0,6,0,0,0,2],
      [2,0,6,6,6,0,6,0,6,6,0,6,6,6,0,2],
      [2,0,0,0,6,0,0,0,0,6,0,0,0,6,0,2],
      [2,0,6,0,6,6,0,6,0,6,6,6,0,6,0,2],
      [2,0,6,0,0,0,0,6,0,0,0,6,0,0,0,2],
      [2,0,6,6,6,6,0,6,6,6,0,6,6,6,0,2],
      [2,0,0,0,0,6,0,0,0,6,0,0,0,6,0,2],
      [2,6,6,6,0,6,6,6,0,6,6,6,0,6,0,2],
      [2,0,0,6,0,0,0,6,0,0,0,6,0,0,0,2],
      [2,0,6,6,6,6,0,6,0,6,0,6,6,6,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2]
    ],
    npcs: [
      { x: 96, y: 96, name: 'Deep Delver', hasQuest: 'depths_recon', dialogue: ['Keep your steps quiet down here.', 'The wardens guard every bend.', 'If you clear them out, I will reward you.'] }
    ],
    name: 'Beer Caves - Depths II',
    grassWalkable: false,
    exits: [
      { x: 128, y: 16, toMap: 'beer_caves_depths_1', toX: 128, toY: 208, direction: 'up' },
      { x: 128, y: 224, toMap: 'beer_caves_depths_3', toX: 128, toY: 16, direction: 'down' }
    ]
  },
  beer_caves_depths_3: {
    width: 16,
    height: 15,
    tiles: [
      [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2],
      [2,0,0,6,6,6,0,0,0,0,6,6,6,0,0,2],
      [2,0,6,6,0,6,0,6,6,0,6,0,6,6,0,2],
      [2,0,0,0,0,6,0,0,0,0,6,0,0,0,0,2],
      [2,6,6,0,6,6,0,6,6,0,6,6,0,6,6,2],
      [2,0,0,0,6,0,0,0,0,6,0,0,0,6,0,2],
      [2,0,6,0,6,6,0,6,0,6,6,6,0,6,0,2],
      [2,0,6,0,0,0,0,6,0,0,0,6,0,0,0,2],
      [2,0,6,6,6,6,0,6,6,6,0,6,6,6,0,2],
      [2,0,0,0,0,6,0,0,0,6,0,0,0,6,0,2],
      [2,6,6,6,0,6,6,6,0,6,6,6,0,6,0,2],
      [2,0,0,6,0,0,0,6,0,0,0,6,0,0,0,2],
      [2,0,6,6,6,6,0,6,0,6,0,6,6,6,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2]
    ],
    npcs: [
      { x: 160, y: 128, name: 'Sealed Hermit', hasQuest: 'sovereign_silence', dialogue: ['You should not linger in this chamber.', 'The Sovereign hears every breath.', 'If you silence it, I will see you rewarded.'] },
      { x: 128, y: 208, name: 'Cave Sovereign', type: 'boss', dialogue: ['The chamber rumbles with ancient power.'] }
    ],
    name: 'Beer Caves - Depths III',
    grassWalkable: false,
    exits: [
      { x: 128, y: 16, toMap: 'beer_caves_depths_2', toX: 128, toY: 208, direction: 'up' }
    ]
  },
  kinnick_stadium: {
    width: 16,
    height: 15,
    tiles: [
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
      [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,1,2,2,2,2,2,2,2,2,2,2,2,2,1,2],
      [2,1,2,1,1,1,1,1,1,1,1,1,1,2,1,2],
      [2,1,2,1,1,1,1,1,1,1,1,1,1,2,1,2],
      [2,1,2,1,1,1,1,1,1,1,1,1,1,2,1,2],
      [2,1,2,1,1,1,1,1,1,1,1,1,1,2,1,2],
      [2,1,2,1,1,1,1,1,1,1,1,1,1,2,0,0],
      [2,1,2,1,1,1,1,1,1,1,1,1,1,2,1,2],
      [2,1,2,1,1,1,1,1,1,1,1,1,1,2,1,2],
      [2,1,2,1,1,1,1,1,1,1,1,1,1,2,1,2],
      [2,1,2,2,2,2,2,2,2,2,2,2,2,2,1,2],
      [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2]
    ],
    npcs: [
      { x: 128, y: 96, name: 'Coach', hasQuest: 'hawkeye_spirit', dialogue: ['Go Hawks!', 'This stadium holds 70,000 fans!', 'The atmosphere on game day is electric!'] },
      { x: 64, y: 80, name: 'Superfan', hasQuest: 'stadium_tour', dialogue: ['I never miss a game!', 'The wave is a tradition here.', 'Have you seen the Tigerhawk at midfield?'] },
      { x: 192, y: 96, name: 'Athletic Trainer', type: 'healer', dialogue: ['Need a health check?', 'Athletes train hard here!', 'HP & MP restored!'] },
      { x: 96, y: 160, name: 'Food Cart Vendor', type: 'food_cart', dialogue: ['Game day specials!', 'Hot dogs and nachos!'] },
      { x: 48, y: 160, name: 'Bus Stop', type: 'cambus', isSign: true, dialogue: ['Cambus Stop'] }
    ],
    name: 'Kinnick Stadium',
    grassWalkable: true,
    exits: [
      { x: 240, y: 112, toMap: 'ped_mall', toX: 32, toY: 112, direction: 'right' },
      { x: 128, y: 224, toMap: 'pentacrest', toX: 128, toY: 32, direction: 'down' }
    ]
  },
  ped_mall: {
    width: 16,
    height: 15,
    tiles: [
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
      [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,1,0,0,0,0,0,0,0,0,0,0,0,0,1,2],
      [2,1,0,3,3,0,3,3,0,3,3,0,3,3,1,2],
      [2,1,0,3,3,0,3,3,0,3,3,0,3,3,1,2],
      [2,1,0,0,0,0,0,0,0,0,0,0,0,0,1,2],
      [2,1,1,1,1,0,0,0,0,0,0,1,1,1,1,2],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2],
      [2,1,0,0,0,0,0,0,0,0,0,0,0,0,1,2],
      [2,1,0,3,3,0,3,3,0,3,3,0,3,3,1,2],
      [2,1,0,3,3,0,3,3,0,3,3,0,3,3,1,2],
      [2,1,0,0,0,0,0,0,0,0,0,0,0,0,1,2],
      [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
    ],
    npcs: [
      { x: 80, y: 64, name: 'Street Musician', hasQuest: 'lost_guitar', dialogue: ['Music fills the air here!', 'The Ped Mall is the heart of downtown.', 'So many shops and restaurants!'] },
      { x: 160, y: 96, name: 'Shop Owner', type: 'shop', dialogue: ['Welcome to my shop!', 'Unique items from Iowa City!'] },
      { x: 128, y: 64, name: 'Food Cart Vendor', type: 'food_cart', dialogue: ['Fresh pretzels!', 'Best food on the mall!'] },
      { x: 192, y: 128, name: 'Tourist', dialogue: ['This pedestrian mall is amazing!', 'So many interesting people!'] },
      { x: 64, y: 128, name: 'Artist', dialogue: ['I sell my art here on weekends.', 'Iowa City loves creativity!'] },
      { x: 208, y: 96, name: 'Bus Stop', type: 'cambus', isSign: true, dialogue: ['Cambus Stop'] }
    ],
    name: 'Pedestrian Mall',
    grassWalkable: false,
    exits: [
      { x: 16, y: 112, toMap: 'kinnick_stadium', toX: 224, toY: 112, direction: 'left' },
      { x: 240, y: 112, toMap: 'old_capitol', toX: 32, toY: 112, direction: 'right' }
    ]
  },
  old_capitol: {
    width: 16,
    height: 15,
    tiles: [
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
      [2,2,2,3,3,3,3,3,3,3,3,3,3,2,2,2],
      [2,2,2,3,1,1,1,1,1,1,1,1,3,2,2,2],
      [2,2,2,3,1,1,1,1,1,1,1,1,3,2,2,2],
      [2,2,2,3,1,1,4,4,4,4,1,1,3,2,2,2],
      [2,2,2,3,1,1,4,4,4,4,1,1,3,2,2,2],
      [0,0,0,3,1,1,1,1,1,1,1,1,3,2,2,2],
      [2,2,2,3,1,1,1,1,1,1,1,1,3,2,2,2],
      [2,2,2,3,1,1,1,1,1,1,1,1,3,2,2,2],
      [2,2,2,3,3,3,3,3,3,3,3,3,3,2,2,2],
      [2,2,2,1,1,1,1,1,1,1,1,1,1,2,2,2],
      [2,2,2,1,1,1,1,1,1,1,1,1,1,2,2,2],
      [2,2,2,1,1,1,1,1,1,1,1,1,1,2,2,2],
      [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2]
    ],
    npcs: [
      { x: 128, y: 64, name: 'Historian', hasQuest: 'capitol_mystery', dialogue: ['Welcome to the Old Capitol!', 'This building served as Iowa\'s first capitol.', 'A golden dome crowns this historic site.'] },
      { x: 96, y: 96, name: 'Tour Guide', dialogue: ['Did you know the dome is covered in gold leaf?', 'The Old Capitol was built in 1842!'] },
      { x: 160, y: 96, name: 'Museum Curator', type: 'magic_trainer', dialogue: ['Ancient knowledge resides here.', 'I can teach you historical magic...'] },
      { x: 48, y: 160, name: 'Bus Stop', type: 'cambus', isSign: true, dialogue: ['Cambus Stop'] }
    ],
    name: 'Old Capitol Museum',
    grassWalkable: false,
    exits: [
      { x: 16, y: 112, toMap: 'ped_mall', toX: 224, toY: 112, direction: 'left' },
      { x: 128, y: 224, toMap: 'coralville_lake', toX: 128, toY: 32, direction: 'down' }
    ]
  },
  coralville_lake: {
    width: 16,
    height: 15,
    tiles: [
      [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2],
      [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2],
      [2,2,2,2,1,1,1,1,1,1,1,1,2,2,2,2],
      [2,2,1,1,1,1,1,1,1,1,1,1,1,1,2,2],
      [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,1,1,1,5,5,5,5,5,5,5,1,1,1,1,2],
      [2,1,1,5,5,5,5,5,5,5,5,5,1,1,1,2],
      [2,1,1,5,5,5,5,5,5,5,5,5,1,1,1,2],
      [2,1,1,5,5,5,5,5,5,5,5,5,1,1,1,2],
      [2,1,1,1,5,5,5,5,5,5,5,1,1,1,1,2],
      [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
      [2,2,1,1,1,1,1,1,1,1,1,1,1,1,2,2],
      [2,2,2,2,1,1,1,1,1,1,1,1,2,2,2,2],
      [2,2,2,2,2,2,1,1,1,1,2,2,2,2,2,2],
      [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2]
    ],
    npcs: [
      { x: 64, y: 64, name: 'Fisherman', hasQuest: 'lake_monster', dialogue: ['Great fishing here!', 'Coralville Lake is a local treasure.', 'Something big lurks in these waters...'] },
      { x: 160, y: 80, name: 'Camper', hasQuest: 'camping_supplies', dialogue: ['Perfect spot for camping!', 'The trails around here are beautiful.'] },
      { x: 128, y: 120, name: 'Park Ranger', type: 'healer', dialogue: ['Welcome to the lake!', 'Stay safe out there!', 'HP & MP restored!'] },
      { x: 96, y: 64, name: 'Food Cart Vendor', type: 'food_cart', dialogue: ['Beach snacks!', 'Perfect for a day by the lake!'] },
      { x: 48, y: 80, name: 'Bus Stop', type: 'cambus', isSign: true, dialogue: ['Cambus Stop'] }
    ],
    name: 'Coralville Lake',
    grassWalkable: true,
    exits: [
      { x: 128, y: 16, toMap: 'old_capitol', toX: 128, toY: 208, direction: 'up' },
      { x: 128, y: 224, toMap: 'downtown', toX: 128, toY: 32, direction: 'down' }
    ]
  }
};

