// Test script for item consolidation functionality

// Mock game object with consolidated inventory
const gameState = {
  consumables: [
    { name: 'Potion', effect: 'healHP', amount: 20, description: 'Restores 20 HP', count: 1 },
    { name: 'Hi-Potion', effect: 'healHP', amount: 50, description: 'Restores 50 HP', count: 3 },
    { name: 'Flashlight', effect: 'flashlight', description: 'Lights up caves' }
  ]
};

// Test addConsumable function
function addConsumable(item) {
  const existingItem = gameState.consumables.find(c => c.name === item.name);
  
  if (existingItem) {
    if (!existingItem.count) {
      existingItem.count = 1;
    }
    existingItem.count++;
  } else {
    gameState.consumables.push({ ...item, count: 1 });
  }
}

// Test removeConsumable function
function removeConsumable(index) {
  if (index < 0 || index >= gameState.consumables.length) return;
  
  const item = gameState.consumables[index];
  
  if (item.count && item.count > 1) {
    item.count--;
  } else {
    gameState.consumables.splice(index, 1);
  }
}

console.log('=== Initial State ===');
console.log('Consumables:', JSON.stringify(gameState.consumables, null, 2));

console.log('\n=== Test 1: Add existing item (Hi-Potion) ===');
addConsumable({ name: 'Hi-Potion', effect: 'healHP', amount: 50, description: 'Restores 50 HP' });
console.log('Consumables:', JSON.stringify(gameState.consumables, null, 2));
console.log('Hi-Potion count should be 4: ', gameState.consumables[1].count === 4 ? '✓ PASS' : '✗ FAIL');

console.log('\n=== Test 2: Add new item (Ether) ===');
addConsumable({ name: 'Ether', effect: 'healMP', amount: 30, description: 'Restores 30 MP' });
console.log('Consumables:', JSON.stringify(gameState.consumables, null, 2));
console.log('Ether should exist with count 1: ', gameState.consumables.some(c => c.name === 'Ether' && c.count === 1) ? '✓ PASS' : '✗ FAIL');

console.log('\n=== Test 3: Remove item (Index 1, Hi-Potion with count 4) ===');
removeConsumable(1);
console.log('Consumables:', JSON.stringify(gameState.consumables, null, 2));
console.log('Hi-Potion count should be 3: ', gameState.consumables[1].count === 3 ? '✓ PASS' : '✗ FAIL');

console.log('\n=== Test 4: Remove item multiple times until gone ===');
removeConsumable(1); // count becomes 2
removeConsumable(1); // count becomes 1
removeConsumable(1); // item removed
console.log('Consumables:', JSON.stringify(gameState.consumables, null, 2));
console.log('Hi-Potion should be removed: ', !gameState.consumables.some(c => c.name === 'Hi-Potion') ? '✓ PASS' : '✗ FAIL');

console.log('\n=== Test 5: Item without count property (Flashlight) ===');
console.log('Flashlight has no count property: ', !gameState.consumables.find(c => c.name === 'Flashlight').count ? '✓ PASS' : '✗ FAIL');
removeConsumable(gameState.consumables.findIndex(c => c.name === 'Flashlight'));
console.log('After removal, Flashlight should be removed: ', !gameState.consumables.some(c => c.name === 'Flashlight') ? '✓ PASS' : '✗ FAIL');

console.log('\n=== All Tests Complete ===');
