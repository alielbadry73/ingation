/**
 * Task 3.1 Verification Test
 * Verify that addToCart() and normalizeItem() properly handle field validation
 * 
 * Requirements:
 * - 2.1: Course items must have: id, type, title, price, instructor, board, image, quantity, addedAt
 * - 2.2: Book items must have: id, type, title, author, subject, price, quantity, addedAt
 * - 2.3: Items missing required fields (id, type, title, price) should be rejected
 */

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

global.localStorage = localStorageMock;
global.sessionStorage = localStorageMock;

// Mock DOM
global.document = {
  querySelectorAll: () => [],
  getElementById: () => null,
  querySelector: () => null,
  createElement: () => ({
    className: '',
    style: { cssText: '' },
    textContent: '',
    remove: () => {}
  }),
  body: {
    appendChild: () => {}
  }
};

global.window = global;

// Load CartManager
const fs = require('fs');
const cartManagerCode = fs.readFileSync('backend/public/js/cart-manager.js', 'utf8');

// Execute the code and extract CartManager
const CartManager = (() => {
  eval(cartManagerCode);
  return window.cartManager.constructor;
})();

console.log('\n=== Task 3.1 Verification Tests ===\n');

// Test 1: Verify normalizeItem() creates course items with all required fields
console.log('Test 1: Course item normalization');
localStorage.clear();
const cartManager1 = new CartManager();

const courseInput = {
  id: 'math-101',
  title: 'IGCSE Mathematics',
  price: 299.00,
  instructor: 'Dr. Smith',
  board: 'Cambridge',
  image: 'images/math.png'
};

const normalizedCourse = cartManager1.normalizeItem(courseInput);

console.log('Input:', courseInput);
console.log('Normalized:', normalizedCourse);

const courseRequiredFields = ['id', 'type', 'title', 'price', 'instructor', 'board', 'image', 'quantity', 'addedAt'];
const courseMissingFields = courseRequiredFields.filter(field => !(field in normalizedCourse));

if (courseMissingFields.length === 0) {
  console.log('✅ PASS: Course has all required fields');
} else {
  console.log('❌ FAIL: Course missing fields:', courseMissingFields);
}

// Verify type is set correctly
if (normalizedCourse.type === 'course') {
  console.log('✅ PASS: Course type is "course"');
} else {
  console.log('❌ FAIL: Course type is', normalizedCourse.type, 'expected "course"');
}

// Test 2: Verify normalizeItem() creates book items with all required fields
console.log('\nTest 2: Book item normalization');
localStorage.clear();
const cartManager2 = new CartManager();

const bookInput = {
  id: 'book-physics',
  title: 'Physics Textbook',
  price: 45.00,
  author: 'Prof. Johnson',
  subject: 'Physics'
};

const normalizedBook = cartManager2.normalizeItem(bookInput);

console.log('Input:', bookInput);
console.log('Normalized:', normalizedBook);

const bookRequiredFields = ['id', 'type', 'title', 'author', 'subject', 'price', 'quantity', 'addedAt'];
const bookMissingFields = bookRequiredFields.filter(field => !(field in normalizedBook));

if (bookMissingFields.length === 0) {
  console.log('✅ PASS: Book has all required fields');
} else {
  console.log('❌ FAIL: Book missing fields:', bookMissingFields);
}

// Verify type is set correctly for books
if (normalizedBook.type === 'book') {
  console.log('✅ PASS: Book type is "book"');
} else {
  console.log('❌ FAIL: Book type is', normalizedBook.type, 'expected "book"');
}

// Test 3: Verify addToCart() uses normalizeItem()
console.log('\nTest 3: addToCart() uses normalizeItem()');
localStorage.clear();
const cartManager3 = new CartManager();

const rawCourse = {
  id: 'chemistry',
  title: 'IGCSE Chemistry',
  price: '250.00 EGP',  // String price
  instructor: 'Dr. Lee'
  // Missing board, image - should be added by normalizeItem
};

cartManager3.addToCart(rawCourse);
const cart = cartManager3.getCart();

if (cart.length === 1) {
  console.log('✅ PASS: Item added to cart');
  const addedItem = cart[0];
  
  // Check if price was normalized
  if (typeof addedItem.price === 'number') {
    console.log('✅ PASS: Price normalized to number:', addedItem.price);
  } else {
    console.log('❌ FAIL: Price not normalized, type:', typeof addedItem.price);
  }
  
  // Check if quantity was added
  if (addedItem.quantity === 1) {
    console.log('✅ PASS: Default quantity added');
  } else {
    console.log('❌ FAIL: Quantity is', addedItem.quantity);
  }
  
  // Check if addedAt was added
  if (addedItem.addedAt) {
    console.log('✅ PASS: addedAt timestamp added');
  } else {
    console.log('❌ FAIL: addedAt missing');
  }
  
  // Check if type was inferred
  if (addedItem.type === 'course') {
    console.log('✅ PASS: Type inferred as "course"');
  } else {
    console.log('❌ FAIL: Type is', addedItem.type);
  }
} else {
  console.log('❌ FAIL: Item not added to cart');
}

// Test 4: Verify items missing required fields are rejected by validateCart()
console.log('\nTest 4: Items missing required fields are rejected');
localStorage.clear();
const cartManager4 = new CartManager();

// Manually add invalid items to cart
cartManager4.cart = [
  { id: 'valid', type: 'course', title: 'Valid Course', price: 100 },
  { type: 'course', title: 'No ID', price: 100 },  // Missing id
  { id: 'no-type', title: 'No Type', price: 100 },  // Missing type
  { id: 'no-title', type: 'course', price: 100 },  // Missing title
  { id: 'no-price', type: 'course', title: 'No Price' }  // Missing price
];

console.log('Before validation:', cartManager4.cart.length, 'items');
cartManager4.validateCart();
console.log('After validation:', cartManager4.cart.length, 'items');

if (cartManager4.cart.length === 1) {
  console.log('✅ PASS: Invalid items removed, only valid item remains');
  if (cartManager4.cart[0].id === 'valid') {
    console.log('✅ PASS: Correct item retained');
  } else {
    console.log('❌ FAIL: Wrong item retained');
  }
} else {
  console.log('❌ FAIL: Expected 1 item, got', cartManager4.cart.length);
}

// Test 5: Verify addedAt is an ISO timestamp
console.log('\nTest 5: addedAt is ISO timestamp');
localStorage.clear();
const cartManager5 = new CartManager();

cartManager5.addToCart({
  id: 'test',
  title: 'Test Course',
  price: 100,
  instructor: 'Test'
});

const item = cartManager5.getCart()[0];
const isValidISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(item.addedAt);

if (isValidISO) {
  console.log('✅ PASS: addedAt is valid ISO timestamp:', item.addedAt);
} else {
  console.log('❌ FAIL: addedAt is not valid ISO timestamp:', item.addedAt);
}

// Test 6: Verify price normalization with various formats
console.log('\nTest 6: Price normalization with various formats');
localStorage.clear();
const cartManager6 = new CartManager();

const priceTests = [
  { input: 100, expected: 100 },
  { input: '100', expected: 100 },
  { input: '£100', expected: 100 },
  { input: '100 EGP', expected: 100 },
  { input: '£100.50', expected: 100.50 },
  { input: '1,000.00 EGP', expected: 1000.00 }
];

let allPassed = true;
priceTests.forEach(test => {
  const result = cartManager6.parsePrice(test.input);
  if (result === test.expected) {
    console.log(`✅ PASS: "${test.input}" → ${result}`);
  } else {
    console.log(`❌ FAIL: "${test.input}" → ${result}, expected ${test.expected}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('✅ PASS: All price formats normalized correctly');
}

console.log('\n=== Test Summary ===');
console.log('Task 3.1 verification complete.');
console.log('Review the results above to ensure all requirements are met.');
