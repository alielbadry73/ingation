/**
 * Unit tests for Cart Error Handling (Tasks 14.1, 14.2, 14.4)
 * Tests CartErrorHandler, CartRecovery, and InMemoryCart classes
 */

// Mock DOM and localStorage for testing
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

global.window = {
  cartManager: null
};

global.document = {
  querySelectorAll: () => [],
  getElementById: () => null,
  createElement: () => ({
    className: '',
    style: {},
    textContent: '',
    remove: () => {}
  }),
  body: {
    appendChild: () => {}
  }
};

// Load the cart-manager.js file
const fs = require('fs');
const path = require('path');
const cartManagerCode = fs.readFileSync(
  path.join(__dirname, '../cart-manager.js'),
  'utf8'
);
eval(cartManagerCode);

describe('Task 14.1: CartErrorHandler', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    console.error = jest.fn();
    console.warn = jest.fn();
  });

  test('should handle storage quota exceeded error', () => {
    const error = new Error('Storage quota exceeded');
    error.name = 'QuotaExceededError';
    
    const result = CartErrorHandler.handleStorageError(error, 'save');
    
    expect(result.success).toBe(false);
    expect(result.fallback).toBe('memory');
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Storage error during save'),
      error
    );
  });

  test('should handle security error (private browsing)', () => {
    const error = new Error('Security error');
    error.name = 'SecurityError';
    
    const result = CartErrorHandler.handleStorageError(error, 'load');
    
    expect(result.success).toBe(false);
    expect(result.fallback).toBe('memory');
  });

  test('should handle validation errors', () => {
    const invalidItem = { title: 'Test', price: 100 }; // missing id and type
    
    const result = CartErrorHandler.handleValidationError(invalidItem, 'missing id');
    
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('missing id');
    expect(console.warn).toHaveBeenCalled();
  });

  test('should handle operation errors', () => {
    const result = CartErrorHandler.handleOperationError('add_duplicate', 'Item exists');
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('Item exists');
    expect(console.error).toHaveBeenCalled();
  });

  test('should handle invalid quantity error', () => {
    const result = CartErrorHandler.handleOperationError('invalid_quantity', 'Negative quantity');
    
    expect(result.success).toBe(false);
    expect(console.error).toHaveBeenCalled();
  });
});

describe('Task 14.2: CartRecovery', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  test('should recover from localStorage.cart', () => {
    const cartData = [
      { id: 'math', type: 'course', title: 'Math', price: 100, quantity: 1 }
    ];
    localStorage.setItem('cart', JSON.stringify(cartData));
    
    const recovered = CartRecovery.attemptRecovery();
    
    expect(recovered).toHaveLength(1);
    expect(recovered[0].id).toBe('math');
  });

  test('should recover from localStorage.enrollCourse when main cart is empty', () => {
    const courseData = { id: 'physics', title: 'Physics', price: 150 };
    localStorage.setItem('enrollCourse', JSON.stringify(courseData));
    
    const recovered = CartRecovery.attemptRecovery();
    
    expect(recovered).toHaveLength(1);
    expect(recovered[0].id).toBe('physics');
  });

  test('should recover from sessionStorage.currentCourse', () => {
    const courseData = { id: 'chemistry', title: 'Chemistry', price: 120 };
    sessionStorage.setItem('currentCourse', JSON.stringify(courseData));
    
    const recovered = CartRecovery.attemptRecovery();
    
    expect(recovered).toHaveLength(1);
    expect(recovered[0].id).toBe('chemistry');
  });

  test('should recover from localStorage.bookCart', () => {
    const bookData = [
      { id: 'book1', type: 'book', title: 'Physics Book', price: 50, quantity: 1 }
    ];
    localStorage.setItem('bookCart', JSON.stringify(bookData));
    
    const recovered = CartRecovery.attemptRecovery();
    
    expect(recovered).toHaveLength(1);
    expect(recovered[0].id).toBe('book1');
  });

  test('should recover from sessionStorage.cart', () => {
    const cartData = [
      { id: 'course1', type: 'course', title: 'Course 1', price: 200, quantity: 1 }
    ];
    sessionStorage.setItem('cart', JSON.stringify(cartData));
    
    const recovered = CartRecovery.attemptRecovery();
    
    expect(recovered).toHaveLength(1);
    expect(recovered[0].id).toBe('course1');
  });

  test('should return empty array when no data found', () => {
    const recovered = CartRecovery.attemptRecovery();
    
    expect(recovered).toEqual([]);
  });

  test('should handle corrupted JSON gracefully', () => {
    localStorage.setItem('cart', '{invalid json}');
    
    const recovered = CartRecovery.attemptRecovery();
    
    expect(recovered).toEqual([]);
  });

  test('should prioritize localStorage.cart over other sources', () => {
    const mainCart = [{ id: 'main', type: 'course', title: 'Main', price: 100, quantity: 1 }];
    const legacyCourse = { id: 'legacy', title: 'Legacy', price: 50 };
    
    localStorage.setItem('cart', JSON.stringify(mainCart));
    localStorage.setItem('enrollCourse', JSON.stringify(legacyCourse));
    
    const recovered = CartRecovery.attemptRecovery();
    
    expect(recovered).toHaveLength(1);
    expect(recovered[0].id).toBe('main'); // Should use main cart, not legacy
  });
});

describe('Task 14.4: InMemoryCart', () => {
  let inMemoryCart;

  beforeEach(() => {
    console.warn = jest.fn();
    console.log = jest.fn();
    inMemoryCart = new InMemoryCart();
  });

  test('should initialize with empty cart', () => {
    expect(inMemoryCart.cart).toEqual([]);
    expect(inMemoryCart.persistent).toBe(false);
  });

  test('should warn user about non-persistence', () => {
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('memory-only mode')
    );
  });

  test('should add items to cart', () => {
    const item = {
      id: 'math',
      type: 'course',
      title: 'Mathematics',
      price: 100,
      quantity: 1
    };
    
    const result = inMemoryCart.addToCart(item);
    
    expect(result).toBe(true);
    expect(inMemoryCart.getCart()).toHaveLength(1);
    expect(inMemoryCart.getCart()[0].id).toBe('math');
  });

  test('should prevent duplicate items', () => {
    const item = {
      id: 'math',
      type: 'course',
      title: 'Mathematics',
      price: 100,
      quantity: 1
    };
    
    inMemoryCart.addToCart(item);
    const result = inMemoryCart.addToCart(item);
    
    expect(result).toBe(false);
    expect(inMemoryCart.getCart()).toHaveLength(1);
  });

  test('should remove items from cart', () => {
    const item = {
      id: 'math',
      type: 'course',
      title: 'Mathematics',
      price: 100,
      quantity: 1
    };
    
    inMemoryCart.addToCart(item);
    const result = inMemoryCart.removeFromCart('math');
    
    expect(result).toBe(true);
    expect(inMemoryCart.getCart()).toHaveLength(0);
  });

  test('should update item quantity', () => {
    const item = {
      id: 'math',
      type: 'course',
      title: 'Mathematics',
      price: 100,
      quantity: 1
    };
    
    inMemoryCart.addToCart(item);
    inMemoryCart.updateQuantity('math', 3);
    
    expect(inMemoryCart.getCart()[0].quantity).toBe(3);
  });

  test('should remove item when quantity is 0', () => {
    const item = {
      id: 'math',
      type: 'course',
      title: 'Mathematics',
      price: 100,
      quantity: 1
    };
    
    inMemoryCart.addToCart(item);
    inMemoryCart.updateQuantity('math', 0);
    
    expect(inMemoryCart.getCart()).toHaveLength(0);
  });

  test('should calculate cart count correctly', () => {
    inMemoryCart.addToCart({ id: '1', type: 'course', title: 'A', price: 100, quantity: 2 });
    inMemoryCart.addToCart({ id: '2', type: 'course', title: 'B', price: 100, quantity: 3 });
    
    expect(inMemoryCart.getCartCount()).toBe(5);
  });

  test('should calculate cart total correctly', () => {
    inMemoryCart.addToCart({ id: '1', type: 'course', title: 'A', price: 100, quantity: 2 });
    inMemoryCart.addToCart({ id: '2', type: 'course', title: 'B', price: 50, quantity: 3 });
    
    expect(inMemoryCart.getCartTotal()).toBe(350); // (100*2) + (50*3)
  });

  test('should clear cart', () => {
    inMemoryCart.addToCart({ id: '1', type: 'course', title: 'A', price: 100, quantity: 1 });
    inMemoryCart.clearCart();
    
    expect(inMemoryCart.getCart()).toEqual([]);
  });

  test('should normalize items correctly', () => {
    const item = {
      id: 'math',
      title: 'Mathematics',
      price: '100.00 EGP',
      instructor: 'Dr. Smith'
    };
    
    inMemoryCart.addToCart(item);
    const normalized = inMemoryCart.getCart()[0];
    
    expect(normalized.type).toBe('course');
    expect(normalized.price).toBe(100);
    expect(normalized.quantity).toBe(1);
    expect(normalized.addedAt).toBeDefined();
  });

  test('should parse prices correctly', () => {
    expect(inMemoryCart.parsePrice(100)).toBe(100);
    expect(inMemoryCart.parsePrice('100')).toBe(100);
    expect(inMemoryCart.parsePrice('£100')).toBe(100);
    expect(inMemoryCart.parsePrice('100 EGP')).toBe(100);
    expect(inMemoryCart.parsePrice('100.50 EGP')).toBe(100.50);
  });

  test('should format prices correctly', () => {
    expect(inMemoryCart.formatPrice(100)).toBe('100.00 EGP');
    expect(inMemoryCart.formatPrice(100.5)).toBe('100.50 EGP');
  });

  test('should validate cart items', () => {
    inMemoryCart.cart = [
      { id: '1', type: 'course', title: 'Valid', price: 100 },
      { type: 'course', title: 'Invalid - no id', price: 100 },
      { id: '2', title: 'Invalid - no type', price: 100 },
      { id: '3', type: 'course', price: 100 } // Invalid - no title
    ];
    
    inMemoryCart.validateCart();
    
    expect(inMemoryCart.cart).toHaveLength(1);
    expect(inMemoryCart.cart[0].id).toBe('1');
  });
});

describe('Integration: CartManager with Error Handling', () => {
  let cartManager;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    console.error = jest.fn();
    console.warn = jest.fn();
    console.log = jest.fn();
    cartManager = new CartManager();
  });

  test('should use CartErrorHandler for duplicate items', () => {
    const item = {
      id: 'math',
      type: 'course',
      title: 'Mathematics',
      price: 100,
      quantity: 1
    };
    
    cartManager.addToCart(item);
    const result = cartManager.addToCart(item);
    
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Operation add_duplicate failed'),
      expect.anything()
    );
  });

  test('should use CartErrorHandler for invalid quantity', () => {
    const item = {
      id: 'math',
      type: 'course',
      title: 'Mathematics',
      price: 100,
      quantity: 1
    };
    
    cartManager.addToCart(item);
    cartManager.updateQuantity('math', -5);
    
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Operation invalid_quantity failed'),
      expect.anything()
    );
  });

  test('should use CartRecovery in recover method', () => {
    const legacyData = { id: 'physics', title: 'Physics', price: 150 };
    localStorage.setItem('enrollCourse', JSON.stringify(legacyData));
    
    cartManager.cart = []; // Clear cart
    const result = cartManager.recover();
    
    expect(result).toBe(true);
    expect(cartManager.getCart()).toHaveLength(1);
  });

  test('should handle validation errors gracefully', () => {
    cartManager.cart = [
      { id: '1', type: 'course', title: 'Valid', price: 100 },
      { type: 'course', title: 'Invalid', price: 100 } // Missing id
    ];
    
    cartManager.validateCart();
    
    expect(cartManager.cart).toHaveLength(1);
    expect(console.warn).toHaveBeenCalled();
  });
});

console.log('✅ All error handling tests defined');
