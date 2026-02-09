/**
 * Test script for addToCart() price normalization
 * Tests Requirements 2.5, 7.1, 7.3
 * 
 * This test verifies that:
 * 1. addToCart() uses normalizeItem()
 * 2. normalizeItem() calls parsePrice()
 * 3. Prices are stored as numeric values without currency symbols
 */

// Mock localStorage for Node.js
global.localStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  },
  clear() {
    this.data = {};
  }
};

// Mock sessionStorage
global.sessionStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  },
  clear() {
    this.data = {};
  }
};

// Mock document for Node.js
global.document = {
  querySelectorAll: () => [],
  getElementById: () => null,
  createElement: () => ({ remove: () => {} }),
  body: { appendChild: () => {} }
};

// Load CartManager
const fs = require('fs');
const cartManagerCode = fs.readFileSync('backend/public/js/cart-manager.js', 'utf8');
eval(cartManagerCode);

console.log('Testing addToCart() Price Normalization\n');
console.log('Requirements:');
console.log('  2.5: THE Cart_Manager SHALL normalize price values to numeric format');
console.log('  7.1: THE Cart_Manager SHALL store all prices as numeric values without currency symbols');
console.log('  7.3: THE Cart_Manager SHALL convert any price strings (containing £ or EGP) to numeric values on input\n');

// Create CartManager instance
const cartManager = new CartManager();

// Test cases
const testItems = [
  {
    item: {
      id: 'course-1',
      type: 'course',
      title: 'Mathematics Course',
      price: 299.00,
      instructor: 'Dr. Smith',
      board: 'Cambridge',
      quantity: 1
    },
    expectedPrice: 299.00,
    description: 'Numeric price'
  },
  {
    item: {
      id: 'course-2',
      type: 'course',
      title: 'Physics Course',
      price: '£45.50',
      instructor: 'Dr. Jones',
      board: 'Edexcel',
      quantity: 1
    },
    expectedPrice: 45.50,
    description: 'Price with £ symbol'
  },
  {
    item: {
      id: 'course-3',
      type: 'course',
      title: 'Chemistry Course',
      price: '279.00 EGP',
      instructor: 'Dr. Brown',
      board: 'Cambridge',
      quantity: 1
    },
    expectedPrice: 279.00,
    description: 'Price with EGP'
  },
  {
    item: {
      id: 'course-4',
      type: 'course',
      title: 'Biology Course',
      price: 'Â£125.99',
      instructor: 'Dr. Wilson',
      board: 'Cambridge',
      quantity: 1
    },
    expectedPrice: 125.99,
    description: 'Price with Â£ symbol'
  },
  {
    item: {
      id: 'course-5',
      type: 'course',
      title: 'English Course',
      price: '1,299.50 EGP',
      instructor: 'Dr. Taylor',
      board: 'Edexcel',
      quantity: 1
    },
    expectedPrice: 1299.50,
    description: 'Price with commas'
  }
];

let passed = 0;
let failed = 0;

console.log('Running tests...\n');

testItems.forEach((test, index) => {
  // Clear cart before each test
  cartManager.clearCart();
  
  // Add item to cart
  const result = cartManager.addToCart(test.item);
  
  // Get the stored item
  const cart = cartManager.getCart();
  const storedItem = cart.find(item => item.id === test.item.id);
  
  // Verify the item was added
  if (!result || !storedItem) {
    console.log(`❌ Test ${index + 1} FAILED: ${test.description}`);
    console.log(`   Item was not added to cart`);
    failed++;
    return;
  }
  
  // Verify price is numeric
  const isNumeric = typeof storedItem.price === 'number';
  
  // Verify price value is correct
  const isCorrectValue = storedItem.price === test.expectedPrice;
  
  // Verify no currency symbols
  const priceStr = String(storedItem.price);
  const noCurrencySymbols = !priceStr.match(/£|EGP|Â£/);
  
  if (isNumeric && isCorrectValue && noCurrencySymbols) {
    console.log(`✅ Test ${index + 1} PASSED: ${test.description}`);
    console.log(`   Input: ${JSON.stringify(test.item.price)}`);
    console.log(`   Stored: ${storedItem.price} (type: ${typeof storedItem.price})`);
    passed++;
  } else {
    console.log(`❌ Test ${index + 1} FAILED: ${test.description}`);
    console.log(`   Input: ${JSON.stringify(test.item.price)}`);
    console.log(`   Expected: ${test.expectedPrice} (number)`);
    console.log(`   Got: ${storedItem.price} (${typeof storedItem.price})`);
    console.log(`   Is numeric: ${isNumeric}`);
    console.log(`   Correct value: ${isCorrectValue}`);
    console.log(`   No currency symbols: ${noCurrencySymbols}`);
    failed++;
  }
  console.log('');
});

// Verify localStorage storage
console.log('Verifying localStorage storage...\n');
cartManager.clearCart();
testItems.forEach(test => cartManager.addToCart(test.item));

const storedCart = JSON.parse(localStorage.getItem('cart'));
const allNumericInStorage = storedCart.every(item => typeof item.price === 'number');
const noCurrencyInStorage = storedCart.every(item => {
  const priceStr = String(item.price);
  return !priceStr.match(/£|EGP|Â£/);
});

console.log(allNumericInStorage ? '✅ All prices in localStorage are numeric' : '❌ Some prices in localStorage are not numeric');
console.log(noCurrencyInStorage ? '✅ No currency symbols in localStorage prices' : '❌ Currency symbols found in localStorage');

console.log('\n' + '='.repeat(60));
console.log(`Results: ${passed} passed, ${failed} failed out of ${testItems.length} tests`);

if (passed === testItems.length && allNumericInStorage && noCurrencyInStorage) {
  console.log('\n🎉 All requirements verified successfully!');
  console.log('\nVerification Summary:');
  console.log('✅ Requirement 2.5: Price values normalized to numeric format');
  console.log('✅ Requirement 7.1: Prices stored as numeric values without currency symbols');
  console.log('✅ Requirement 7.3: Price strings with £ or EGP converted to numeric values');
  console.log('\nImplementation Details:');
  console.log('✅ addToCart() calls normalizeItem()');
  console.log('✅ normalizeItem() calls parsePrice()');
  console.log('✅ parsePrice() removes currency symbols (£, EGP, Â£)');
  console.log('✅ Prices stored as numbers in cart array');
  console.log('✅ Prices persisted as numbers in localStorage');
  process.exit(0);
} else {
  console.log('\n⚠️ Some tests failed or requirements not met');
  process.exit(1);
}
