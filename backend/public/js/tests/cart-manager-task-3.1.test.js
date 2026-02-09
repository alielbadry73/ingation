/**
 * Unit Tests for Task 3.1: addToCart() method with field validation
 * 
 * Requirements:
 * - 2.1: Course items must have: id, type, title, price, instructor, board, image, quantity, addedAt
 * - 2.2: Book items must have: id, type, title, author, subject, price, quantity, addedAt
 * - 2.3: Items missing required fields (id, type, title, price) should be rejected
 */

describe('CartManager - Task 3.1: Field Validation', () => {
  let cartManager;

  beforeEach(() => {
    // Clear storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Create fresh CartManager instance
    cartManager = new CartManager();
  });

  describe('normalizeItem() - Course Items', () => {
    test('should create course item with all required fields', () => {
      const courseInput = {
        id: 'math-101',
        title: 'IGCSE Mathematics',
        price: 299.00,
        instructor: 'Dr. Smith',
        board: 'Cambridge',
        image: 'images/math.png'
      };

      const normalized = cartManager.normalizeItem(courseInput);

      // Verify all required fields are present
      expect(normalized).toHaveProperty('id', 'math-101');
      expect(normalized).toHaveProperty('type', 'course');
      expect(normalized).toHaveProperty('title', 'IGCSE Mathematics');
      expect(normalized).toHaveProperty('price', 299.00);
      expect(normalized).toHaveProperty('instructor', 'Dr. Smith');
      expect(normalized).toHaveProperty('board', 'Cambridge');
      expect(normalized).toHaveProperty('image', 'images/math.png');
      expect(normalized).toHaveProperty('quantity', 1);
      expect(normalized).toHaveProperty('addedAt');
      
      // Verify addedAt is ISO timestamp
      expect(normalized.addedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
    });

    test('should infer type as "course" when instructor is present', () => {
      const courseInput = {
        id: 'physics-101',
        title: 'IGCSE Physics',
        price: 279.00,
        instructor: 'Dr. Lee'
      };

      const normalized = cartManager.normalizeItem(courseInput);
      expect(normalized.type).toBe('course');
    });

    test('should add default quantity of 1 if not provided', () => {
      const courseInput = {
        id: 'chemistry-101',
        title: 'IGCSE Chemistry',
        price: 250.00,
        instructor: 'Dr. Brown'
      };

      const normalized = cartManager.normalizeItem(courseInput);
      expect(normalized.quantity).toBe(1);
    });

    test('should preserve provided quantity', () => {
      const courseInput = {
        id: 'biology-101',
        title: 'IGCSE Biology',
        price: 280.00,
        instructor: 'Dr. Green',
        quantity: 3
      };

      const normalized = cartManager.normalizeItem(courseInput);
      expect(normalized.quantity).toBe(3);
    });
  });

  describe('normalizeItem() - Book Items', () => {
    test('should create book item with all required fields', () => {
      const bookInput = {
        id: 'book-physics',
        title: 'Physics Textbook',
        price: 45.00,
        author: 'Prof. Johnson',
        subject: 'Physics'
      };

      const normalized = cartManager.normalizeItem(bookInput);

      // Verify all required fields are present
      expect(normalized).toHaveProperty('id', 'book-physics');
      expect(normalized).toHaveProperty('type', 'book');
      expect(normalized).toHaveProperty('title', 'Physics Textbook');
      expect(normalized).toHaveProperty('price', 45.00);
      expect(normalized).toHaveProperty('author', 'Prof. Johnson');
      expect(normalized).toHaveProperty('subject', 'Physics');
      expect(normalized).toHaveProperty('quantity', 1);
      expect(normalized).toHaveProperty('addedAt');
    });

    test('should infer type as "book" when author is present', () => {
      const bookInput = {
        id: 'book-math',
        title: 'Mathematics Textbook',
        price: 50.00,
        author: 'Prof. Smith'
      };

      const normalized = cartManager.normalizeItem(bookInput);
      expect(normalized.type).toBe('book');
    });
  });

  describe('normalizeItem() - Price Normalization', () => {
    test('should normalize numeric price', () => {
      const item = { id: 'test', title: 'Test', price: 100 };
      const normalized = cartManager.normalizeItem(item);
      expect(normalized.price).toBe(100);
      expect(typeof normalized.price).toBe('number');
    });

    test('should normalize string price', () => {
      const item = { id: 'test', title: 'Test', price: '100' };
      const normalized = cartManager.normalizeItem(item);
      expect(normalized.price).toBe(100);
    });

    test('should normalize price with £ symbol', () => {
      const item = { id: 'test', title: 'Test', price: '£100' };
      const normalized = cartManager.normalizeItem(item);
      expect(normalized.price).toBe(100);
    });

    test('should normalize price with EGP', () => {
      const item = { id: 'test', title: 'Test', price: '100 EGP' };
      const normalized = cartManager.normalizeItem(item);
      expect(normalized.price).toBe(100);
    });

    test('should normalize price with decimals', () => {
      const item = { id: 'test', title: 'Test', price: '£100.50' };
      const normalized = cartManager.normalizeItem(item);
      expect(normalized.price).toBe(100.50);
    });

    test('should normalize price with commas', () => {
      const item = { id: 'test', title: 'Test', price: '1,000.00 EGP' };
      const normalized = cartManager.normalizeItem(item);
      expect(normalized.price).toBe(1000.00);
    });
  });

  describe('addToCart() - Uses normalizeItem()', () => {
    test('should normalize item before adding to cart', () => {
      const rawCourse = {
        id: 'chemistry',
        title: 'IGCSE Chemistry',
        price: '250.00 EGP',
        instructor: 'Dr. Lee'
      };

      cartManager.addToCart(rawCourse);
      const cart = cartManager.getCart();

      expect(cart).toHaveLength(1);
      const addedItem = cart[0];

      // Verify normalization occurred
      expect(typeof addedItem.price).toBe('number');
      expect(addedItem.price).toBe(250);
      expect(addedItem.quantity).toBe(1);
      expect(addedItem.type).toBe('course');
      expect(addedItem.addedAt).toBeDefined();
    });

    test('should add all required fields even if not provided', () => {
      const minimalCourse = {
        id: 'minimal',
        title: 'Minimal Course',
        price: 100,
        instructor: 'Test'
      };

      cartManager.addToCart(minimalCourse);
      const cart = cartManager.getCart();
      const addedItem = cart[0];

      // Verify all required fields exist
      expect(addedItem.id).toBe('minimal');
      expect(addedItem.type).toBe('course');
      expect(addedItem.title).toBe('Minimal Course');
      expect(addedItem.price).toBe(100);
      expect(addedItem.quantity).toBe(1);
      expect(addedItem.addedAt).toBeDefined();
    });
  });

  describe('validateCart() - Reject Invalid Items', () => {
    test('should remove items missing id', () => {
      cartManager.cart = [
        { id: 'valid', type: 'course', title: 'Valid', price: 100 },
        { type: 'course', title: 'No ID', price: 100 }
      ];

      cartManager.validateCart();
      expect(cartManager.cart).toHaveLength(1);
      expect(cartManager.cart[0].id).toBe('valid');
    });

    test('should remove items missing type', () => {
      cartManager.cart = [
        { id: 'valid', type: 'course', title: 'Valid', price: 100 },
        { id: 'no-type', title: 'No Type', price: 100 }
      ];

      cartManager.validateCart();
      expect(cartManager.cart).toHaveLength(1);
      expect(cartManager.cart[0].id).toBe('valid');
    });

    test('should remove items missing title', () => {
      cartManager.cart = [
        { id: 'valid', type: 'course', title: 'Valid', price: 100 },
        { id: 'no-title', type: 'course', price: 100 }
      ];

      cartManager.validateCart();
      expect(cartManager.cart).toHaveLength(1);
      expect(cartManager.cart[0].id).toBe('valid');
    });

    test('should remove items missing price', () => {
      cartManager.cart = [
        { id: 'valid', type: 'course', title: 'Valid', price: 100 },
        { id: 'no-price', type: 'course', title: 'No Price' }
      ];

      cartManager.validateCart();
      expect(cartManager.cart).toHaveLength(1);
      expect(cartManager.cart[0].id).toBe('valid');
    });

    test('should remove items with non-numeric price', () => {
      cartManager.cart = [
        { id: 'valid', type: 'course', title: 'Valid', price: 100 },
        { id: 'string-price', type: 'course', title: 'String Price', price: 'not a number' }
      ];

      cartManager.validateCart();
      expect(cartManager.cart).toHaveLength(1);
      expect(cartManager.cart[0].id).toBe('valid');
    });

    test('should remove all invalid items and keep all valid items', () => {
      cartManager.cart = [
        { id: 'valid1', type: 'course', title: 'Valid 1', price: 100 },
        { type: 'course', title: 'No ID', price: 100 },
        { id: 'valid2', type: 'book', title: 'Valid 2', price: 50 },
        { id: 'no-type', title: 'No Type', price: 100 },
        { id: 'valid3', type: 'course', title: 'Valid 3', price: 200 }
      ];

      cartManager.validateCart();
      expect(cartManager.cart).toHaveLength(3);
      expect(cartManager.cart.map(item => item.id)).toEqual(['valid1', 'valid2', 'valid3']);
    });

    test('should persist changes after validation', () => {
      cartManager.cart = [
        { id: 'valid', type: 'course', title: 'Valid', price: 100 },
        { type: 'course', title: 'No ID', price: 100 }
      ];

      cartManager.validateCart();

      // Check localStorage was updated
      const stored = JSON.parse(localStorage.getItem('cart'));
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe('valid');
    });
  });

  describe('Integration - Full Flow', () => {
    test('should handle complete course addition with validation', () => {
      const course = {
        id: 'math-101',
        title: 'IGCSE Mathematics',
        price: '299.00 EGP',
        instructor: 'Dr. Smith',
        board: 'Cambridge',
        image: 'images/math.png'
      };

      const result = cartManager.addToCart(course);

      expect(result).toBe(true);
      expect(cartManager.getCart()).toHaveLength(1);

      const addedItem = cartManager.getCart()[0];
      expect(addedItem.id).toBe('math-101');
      expect(addedItem.type).toBe('course');
      expect(addedItem.title).toBe('IGCSE Mathematics');
      expect(addedItem.price).toBe(299);
      expect(addedItem.instructor).toBe('Dr. Smith');
      expect(addedItem.board).toBe('Cambridge');
      expect(addedItem.image).toBe('images/math.png');
      expect(addedItem.quantity).toBe(1);
      expect(addedItem.addedAt).toBeDefined();
    });

    test('should handle complete book addition with validation', () => {
      const book = {
        id: 'book-physics',
        title: 'Physics Textbook',
        price: '45.00 EGP',
        author: 'Prof. Johnson',
        subject: 'Physics'
      };

      const result = cartManager.addToCart(book);

      expect(result).toBe(true);
      expect(cartManager.getCart()).toHaveLength(1);

      const addedItem = cartManager.getCart()[0];
      expect(addedItem.id).toBe('book-physics');
      expect(addedItem.type).toBe('book');
      expect(addedItem.title).toBe('Physics Textbook');
      expect(addedItem.price).toBe(45);
      expect(addedItem.author).toBe('Prof. Johnson');
      expect(addedItem.subject).toBe('Physics');
      expect(addedItem.quantity).toBe(1);
      expect(addedItem.addedAt).toBeDefined();
    });
  });
});
