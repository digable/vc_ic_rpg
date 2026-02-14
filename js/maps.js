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
      { x: 16, y: 120, toMap: 'riverside', toX: 224, toY: 120, direction: 'left' },
      { x: 240, y: 64, toMap: 'deadwood', toX: 32, toY: 112, direction: 'right' },
      { x: 128, y: 224, toMap: 'northside', toX: 128, toY: 48, direction: 'down' }
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
      { x: 64, y: 112, name: 'Student', hasQuest: 'study_buddy', dialogue: ['I have so much homework...', 'Good luck out there!'] },
      { x: 224, y: 112, name: 'Bus Stop', type: 'cambus', isSign: true, dialogue: ['Cambus Stop'] },
      { x: 192, y: 144, name: 'Food Cart Vendor', type: 'food_cart', dialogue: ['Fresh snacks!', 'Fuel up!'] }
    ],
    name: 'The Pentacrest',
    grassWalkable: true,
    exits: [
      { x: 120, y: 224, toMap: 'downtown', toX: 120, toY: 32, direction: 'down' },
      { x: 240, y: 120, toMap: 'library', toX: 32, toY: 120, direction: 'right' }
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
      { x: 48, y: 120, name: 'Yoga Instructor', type: 'yoga', dialogue: ['Breathe in...', 'Learn peace and defense.'] },
      { x: 32, y: 112, name: 'Bus Stop', type: 'cambus', isSign: true, dialogue: ['Cambus Stop'] },
      { x: 96, y: 80, name: 'Food Cart Vendor', type: 'food_cart', dialogue: ['Park snacks!', 'Healthy eats!'] }
    ],
    name: 'Iowa River Park',
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
      { x: 176, y: 64, name: 'Food Cart Vendor', type: 'food_cart', dialogue: ['Bar snacks!', 'Get your munchies!'] },
      { x: 32, y: 112, name: 'Bus Stop', type: 'cambus', isSign: true, dialogue: ['Cambus Stop'] }
    ],
    name: 'The Deadwood',
    grassWalkable: false,
    exits: [
      { x: 16, y: 112, toMap: 'downtown', toX: 224, toY: 64, direction: 'left' }
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
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
    ],
    npcs: [
      { x: 64, y: 48, name: 'Restaurant Owner', type: 'food_cart', dialogue: ['Best food in town!', 'Fresh ingredients daily!'] },
      { x: 128, y: 48, name: 'Chef', dialogue: ['The kitchen is busy tonight!', 'Everything is made to order.'] },
      { x: 192, y: 64, name: 'Food Cart Vendor', type: 'food_cart', dialogue: ['Street tacos!', 'Authentic flavors!'] },
      { x: 96, y: 112, name: 'Diner', dialogue: ['The ramen here is amazing!', 'You should try it.'] },
      { x: 160, y: 128, name: 'Food Critic', hasQuest: 'food_critic_challenge', dialogue: ['I review all the restaurants.', 'Northside has the best variety.'] },
      { x: 224, y: 96, name: 'Bus Stop', type: 'cambus', isSign: true, dialogue: ['Cambus Stop'] }
    ],
    name: 'Northside',
    grassWalkable: false,
    exits: [
      { x: 128, y: 16, toMap: 'downtown', toX: 128, toY: 208, direction: 'up' }
    ]
  }
};

