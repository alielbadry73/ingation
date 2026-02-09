# Design Document

## Overview

This design addresses critical cart state management issues in the IGCSE tutoring platform by implementing a centralized CartManager class that serves as the single source of truth for all cart operations. The current system suffers from data fragmentation across multiple storage locations (localStorage.cart, sessionStorage.cart, localStorage.enrollCourse, sessionStorage.currentCourse, localStorage.bookCart) and duplicated cart functions across numerous HTML files. This leads to cart data loss during navigation, inconsistent cart counts, and checkout failures.

The solution introduces a unified cart management system with:
- Single storage location (localStorage.cart)
- Standardized cart item data structure
- Centralized cart operations (add, remove, update, persist)
- Automatic legacy data migration
- Comprehensive error handling and recovery
- Consistent cart UI updates across all pages

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                         Pages Layer                          │
│  (frontend_index2.html, checkout.html, served_*.html, etc.) │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     CartManager API                          │
│  - addToCart()      - getCart()        - updateQuantity()   │
│  - removeFromCart() - clearCart()      - getCartTotal()     │
│  - getCartCount()   - validateCart()   - migrateData()      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Storage Layer                             │
│              localStorage['cart'] (JSON)                     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Add to Cart Flow:**
   ```
   User clicks "Add to Cart" → Page calls cartManager.addToCart(item)
   → CartManager validates item → CartManager checks for duplicates
   → CartManager adds to cart array → CartManager saves to localStorage
   → CartManager updates UI (count badge, modal) → User sees confirmation
   ```

2. **Page Load Flow:**
   ```
   Page loads → CartManager initializes → Loads cart from localStorage
   → Validates cart data → Migrates legacy data if needed
   → Updates cart count badge → Updates cart modal
   ```

3. **Checkout Flow:**
   ```
   User navigates to checkout → Checkout page loads CartManager
   → CartManager loads cart from localStorage → Validates cart items
   → Checkout page renders order summary → User completes payment
   ```


## Components and Interfaces

### CartManager Class

The CartManager is a singleton class that manages all cart operations.

```javascript
class CartManager {
  constructor() {
    this.storageKey = 'cart';
    this.cart = [];
    this.init();
  }

  // Initialization
  init() {
    this.loadCart();
    this.migrateLegacyData();
    this.validateCart();
    this.updateUI();
    this.setupEventListeners();
  }

  // Core Operations
  addToCart(item: CartItem): boolean
  removeFromCart(itemId: string | number): void
  updateQuantity(itemId: string | number, quantity: number): void
  clearCart(): void
  
  // Data Access
  getCart(): CartItem[]
  getCartCount(): number
  getCartTotal(): number
  
  // Persistence
  loadCart(): void
  saveCart(): void
  
  // Validation & Migration
  validateCart(): void
  migrateL egacyData(): void
  
  // UI Updates
  updateCartCount(): void
  updateCartModal(): void
  showToast(message: string, type: string): void
}
```

**Important Implementation Note:**
The `updateCartCount()` method MUST NOT hide the cart badge when the count is 0. The badge should always remain visible with the count displayed, even when it's "0". This ensures users always know where the cart is located and can see that it's empty rather than wondering if the cart feature exists.

Additionally, all cart UI updates MUST happen dynamically without requiring a page refresh. When a user adds, removes, or updates cart items, the UI should update immediately using JavaScript DOM manipulation.

```javascript
// CORRECT implementation
updateCartCount() {
  const count = this.getCartCount();
  const badges = document.querySelectorAll('.cart-count, .cart-badge');
  badges.forEach(badge => {
    badge.textContent = count;
    // Do NOT set display: 'none' when count is 0
    // Badge should always be visible
    // Update happens immediately without page refresh
  });
}

// INCORRECT implementation (DO NOT USE)
updateCartCount() {
  const count = this.getCartCount();
  const badges = document.querySelectorAll('.cart-count, .cart-badge');
  badges.forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';  // ❌ WRONG
  });
}
```

### CartItem Interface

Standardized data structure for all cart items:

```javascript
interface CartItem {
  id: string | number;           // Unique identifier
  type: 'course' | 'book';       // Item type
  title: string;                 // Display name
  price: number;                 // Numeric price (no currency symbols)
  quantity: number;              // Item quantity
  addedAt: string;               // ISO timestamp
  
  // Course-specific fields
  instructor?: string;           // Course instructor name
  board?: string;                // Exam board (Cambridge, Edexcel)
  image?: string;                // Course image URL
  
  // Book-specific fields
  author?: string;               // Book author
  subject?: string;              // Book subject
}
```

### Storage Schema

```javascript
// localStorage['cart'] structure
{
  "cart": [
    {
      "id": "mathematics",
      "type": "course",
      "title": "IGCSE Mathematics (Extended)",
      "price": 299.00,
      "quantity": 1,
      "instructor": "Dr. Sarah Mitchell",
      "board": "Cambridge Board",
      "image": "images/teacher1.PNG",
      "addedAt": "2025-01-15T10:30:00.000Z"
    },
    {
      "id": "physics-textbook",
      "type": "book",
      "title": "IGCSE Physics Textbook",
      "price": 45.00,
      "quantity": 2,
      "author": "Prof. Michael Chen",
      "subject": "Physics",
      "addedAt": "2025-01-15T10:35:00.000Z"
    }
  ]
}
```

### Public API

The CartManager exposes these methods for use by pages:

```javascript
// Global instance
window.cartManager = new CartManager();

// Add item to cart
cartManager.addToCart({
  id: 'mathematics',
  type: 'course',
  title: 'IGCSE Mathematics',
  price: 299.00,
  instructor: 'Dr. Sarah Mitchell',
  board: 'Cambridge Board',
  image: 'images/teacher1.PNG',
  quantity: 1
});

// Remove item from cart
cartManager.removeFromCart('mathematics');

// Update item quantity
cartManager.updateQuantity('mathematics', 2);

// Get cart data
const cart = cartManager.getCart();
const count = cartManager.getCartCount();
const total = cartManager.getCartTotal();

// Clear cart
cartManager.clearCart();
```


## Data Models

### Cart State Model

```javascript
class CartState {
  items: CartItem[];           // Array of cart items
  lastModified: string;        // ISO timestamp of last modification
  version: number;             // Schema version for future migrations
  
  constructor() {
    this.items = [];
    this.lastModified = new Date().toISOString();
    this.version = 1;
  }
  
  // Calculate total price
  getTotal(): number {
    return this.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
  }
  
  // Calculate total item count
  getCount(): number {
    return this.items.reduce((sum, item) => 
      sum + item.quantity, 0
    );
  }
  
  // Find item by ID
  findItem(id: string | number): CartItem | undefined {
    return this.items.find(item => 
      item.id == id  // Loose equality for string/number compatibility
    );
  }
  
  // Check if item exists
  hasItem(id: string | number): boolean {
    return this.findItem(id) !== undefined;
  }
}
```

### Price Normalization

```javascript
class PriceFormatter {
  // Convert price string to number
  static parsePrice(priceStr: string | number): number {
    if (typeof priceStr === 'number') {
      return priceStr;
    }
    
    // Remove currency symbols and whitespace
    const cleaned = priceStr
      .replace(/£|EGP|Â£/g, '')
      .replace(/,/g, '')
      .trim();
    
    return parseFloat(cleaned) || 0;
  }
  
  // Format number as price string
  static formatPrice(price: number): string {
    return `${price.toFixed(2)} EGP`;
  }
}
```

### Legacy Data Migration

```javascript
class LegacyDataMigrator {
  static migrate(): CartItem[] {
    const migratedItems = [];
    
    // Check localStorage.enrollCourse
    const enrollCourse = this.getJSON('enrollCourse');
    if (enrollCourse) {
      migratedItems.push(this.normalizeItem(enrollCourse));
      localStorage.removeItem('enrollCourse');
    }
    
    // Check sessionStorage.currentCourse
    const currentCourse = this.getJSON('currentCourse', true);
    if (currentCourse) {
      migratedItems.push(this.normalizeItem(currentCourse));
      sessionStorage.removeItem('currentCourse');
    }
    
    // Check localStorage.bookCart
    const bookCart = this.getJSON('bookCart');
    if (bookCart && Array.isArray(bookCart)) {
      bookCart.forEach(book => {
        migratedItems.push(this.normalizeItem(book));
      });
      localStorage.removeItem('bookCart');
    }
    
    // Check sessionStorage.cart
    const sessionCart = this.getJSON('cart', true);
    if (sessionCart && Array.isArray(sessionCart)) {
      sessionCart.forEach(item => {
        migratedItems.push(this.normalizeItem(item));
      });
      sessionStorage.removeItem('cart');
    }
    
    return migratedItems;
  }
  
  static getJSON(key: string, useSession: boolean = false): any {
    try {
      const storage = useSession ? sessionStorage : localStorage;
      const data = storage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Failed to parse ${key}:`, error);
      return null;
    }
  }
  
  static normalizeItem(item: any): CartItem {
    return {
      id: item.id || item.courseId || item.title,
      type: item.type || (item.author ? 'book' : 'course'),
      title: item.title || 'Unknown Item',
      price: PriceFormatter.parsePrice(item.price || 0),
      quantity: item.quantity || 1,
      instructor: item.instructor,
      board: item.board,
      image: item.image,
      author: item.author,
      subject: item.subject,
      addedAt: item.addedAt || new Date().toISOString()
    };
  }
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified the following redundancies:
- Requirements 1.4, 3.1, and 4.1 all test immediate persistence - combined into Property 1
- Requirements 2.5, 7.1, 7.3 all test price normalization - combined into Property 2
- Requirements 4.5, 7.2, 7.5 all test price formatting - combined into Property 3
- Requirements 6.2, 6.4, 14.4 all test loose equality for ID comparison - combined into Property 4
- Requirements 8.5 and 11.3 both test legacy key cleanup - combined into Property 5
- Requirements 4.2 and 13.2 both test item detail display - combined into Property 6
- Requirements 4.4, 7.4, 12.5 all test total calculation - combined into Property 7

### Core Data Persistence Properties

**Property 1: Immediate Persistence**
*For any* cart modification operation (add, remove, update quantity), the cart data should be immediately persisted to localStorage and retrievable on the next load.
**Validates: Requirements 1.2, 1.4, 3.1, 3.4, 4.1**

**Property 2: Price Normalization**
*For any* price value (string with currency symbols or numeric), when added to the cart, it should be stored as a numeric value without currency symbols.
**Validates: Requirements 2.5, 7.1, 7.3**

**Property 3: Price Formatting**
*For any* numeric price value in the cart, when displayed to the user, it should be formatted as "XXX.XX EGP" consistently.
**Validates: Requirements 4.5, 7.2, 7.5**

### Data Validation Properties

**Property 4: Cart Data Validation**
*For any* cart data loaded from storage, items missing required fields (id, type, title, price) should be removed during validation.
**Validates: Requirements 1.5, 2.3, 2.4**

**Property 5: Course Field Completeness**
*For any* course added to the cart, the stored item should contain all required fields: id, type, title, price, instructor, board, image, quantity, addedAt.
**Validates: Requirements 2.1**

**Property 6: Book Field Completeness**
*For any* book added to the cart, the stored item should contain all required fields: id, type, title, author, subject, price, quantity, addedAt.
**Validates: Requirements 2.2**

### ID Handling Properties

**Property 7: ID Type Flexibility**
*For any* course ID (string or numeric), the Cart_Manager should accept it and store it in its original format without type conversion.
**Validates: Requirements 6.1, 6.3**

**Property 8: Loose Equality for ID Comparison**
*For any* two items with IDs that are equal when compared with loose equality (==), they should be treated as duplicates regardless of whether one is a string and the other is a number.
**Validates: Requirements 6.2, 6.4, 14.1, 14.3, 14.4**

### Cart Count Properties

**Property 9: Cart Count Calculation**
*For any* cart state, the cart count should equal the sum of quantities of all items in the cart.
**Validates: Requirements 5.2**

**Property 10: Cart Count UI Update**
*For any* cart modification operation (add, remove, update quantity, clear), all Cart_Count_Badge elements on the page should be updated to reflect the new count and remain visible (never hidden with display:none).
**Validates: Requirements 5.1, 5.4, 5.6**

### Total Calculation Properties

**Property 11: Cart Total Calculation**
*For any* cart state containing items of any type (courses and/or books), the total should equal the sum of (price × quantity) for all items.
**Validates: Requirements 4.4, 7.4, 12.5**

**Property 12: Mixed Cart Support**
*For any* cart containing both books and courses, the cart should store both types correctly and include both in total calculations.
**Validates: Requirements 12.1, 12.2, 12.3**

### Legacy Data Migration Properties

**Property 13: Legacy Data Migration**
*For any* legacy storage keys (enrollCourse, currentCourse, bookCart, sessionStorage.cart) containing data when the main cart is empty, the data should be migrated to the main cart and the legacy keys should be removed.
**Validates: Requirements 8.1, 8.2, 8.3**

**Property 14: Comprehensive Cleanup**
*For any* clear cart operation, all storage keys (cart, enrollCourse, currentCourse, bookCart, sessionStorage.cart) should be removed from storage.
**Validates: Requirements 8.5, 11.1, 11.2, 11.3**

### Cart Operations Properties

**Property 15: Duplicate Prevention**
*For any* item already in the cart, attempting to add the same item again (matched by ID) should be rejected and the cart should remain unchanged.
**Validates: Requirements 14.1, 14.3**

**Property 16: Remove Operation**
*For any* item in the cart, removing it by ID should result in the item no longer being in the cart and the cart being persisted without that item.
**Validates: Requirements 13.3**

**Property 17: Quantity Update**
*For any* item in the cart, updating its quantity should change the stored quantity value and recalculate the cart total correctly.
**Validates: Requirements 13.4**

**Property 18: Clear Cart Operation**
*For any* cart state, clearing the cart should result in an empty cart array, cart count of 0, and all UI elements showing empty state.
**Validates: Requirements 11.1, 11.4, 11.5**

### Enroll vs Add to Cart Properties

**Property 19: Enroll Now Isolation**
*For any* course, when "Enroll Now" is triggered, the cart should contain only that course (clearing any previous items).
**Validates: Requirements 15.3**

**Property 20: Add to Cart Preservation**
*For any* existing cart state, when "Add to Cart" is triggered for a new item, the existing items should remain in the cart along with the new item.
**Validates: Requirements 15.4**

### Recovery Properties

**Property 21: Cart Recovery**
*For any* cart data stored in any legacy location (enrollCourse, currentCourse, bookCart, sessionStorage.cart), the recovery function should be able to restore it to the main cart.
**Validates: Requirements 9.3**

**Property 22: Variant Support**
*For any* course with different variants (if applicable), each variant should be treated as a separate item and multiple variants of the same base course should be allowed in the cart.
**Validates: Requirements 14.5**


## Error Handling

### Error Categories

1. **Storage Errors**
   - localStorage quota exceeded
   - localStorage access denied (private browsing)
   - Corrupted JSON data in storage

2. **Data Validation Errors**
   - Missing required fields
   - Invalid data types
   - Malformed price values

3. **Operation Errors**
   - Adding duplicate items
   - Removing non-existent items
   - Invalid quantity values (negative, zero, non-numeric)

### Error Handling Strategy

```javascript
class CartErrorHandler {
  static handleStorageError(error, operation) {
    console.error(`Storage error during ${operation}:`, error);
    
    if (error.name === 'QuotaExceededError') {
      // Storage quota exceeded
      this.showUserError('Cart storage is full. Please clear some items.');
      return { success: false, fallback: 'memory' };
    }
    
    if (error.name === 'SecurityError') {
      // Private browsing or storage disabled
      this.showUserError('Cart storage is disabled. Please enable cookies.');
      return { success: false, fallback: 'memory' };
    }
    
    // Generic storage error
    this.showUserError('Failed to save cart. Please try again.');
    return { success: false, fallback: 'memory' };
  }
  
  static handleValidationError(item, reason) {
    console.warn(`Validation failed for item:`, item, `Reason: ${reason}`);
    
    // Log for debugging but don't show to user
    // Invalid items are silently removed
    return { valid: false, reason };
  }
  
  static handleOperationError(operation, error) {
    console.error(`Operation ${operation} failed:`, error);
    
    // Show user-friendly message
    const messages = {
      'add_duplicate': 'This item is already in your cart',
      'remove_not_found': 'Item not found in cart',
      'invalid_quantity': 'Please enter a valid quantity',
      'empty_cart_checkout': 'Your cart is empty'
    };
    
    this.showUserError(messages[operation] || 'An error occurred');
    return { success: false, error };
  }
  
  static showUserError(message) {
    // Use existing toast system
    if (window.cartManager) {
      window.cartManager.showToast(message, 'error');
    } else {
      alert(message);  // Fallback
    }
  }
}
```

### Recovery Mechanisms

```javascript
class CartRecovery {
  static attemptRecovery() {
    console.log('🔄 Attempting cart recovery...');
    
    // Priority 1: Main cart in localStorage
    let cart = this.tryLoadCart('cart', false);
    if (cart && cart.length > 0) {
      console.log('✅ Recovered from localStorage.cart');
      return cart;
    }
    
    // Priority 2: Legacy enrollCourse
    const enrollCourse = this.tryLoadCart('enrollCourse', false);
    if (enrollCourse) {
      console.log('✅ Recovered from localStorage.enrollCourse');
      return [enrollCourse];
    }
    
    // Priority 3: sessionStorage.currentCourse
    const currentCourse = this.tryLoadCart('currentCourse', true);
    if (currentCourse) {
      console.log('✅ Recovered from sessionStorage.currentCourse');
      return [currentCourse];
    }
    
    // Priority 4: bookCart
    const bookCart = this.tryLoadCart('bookCart', false);
    if (bookCart && Array.isArray(bookCart) && bookCart.length > 0) {
      console.log('✅ Recovered from localStorage.bookCart');
      return bookCart;
    }
    
    // Priority 5: sessionStorage.cart
    cart = this.tryLoadCart('cart', true);
    if (cart && cart.length > 0) {
      console.log('✅ Recovered from sessionStorage.cart');
      return cart;
    }
    
    console.log('❌ No cart data found in any location');
    return [];
  }
  
  static tryLoadCart(key, useSession) {
    try {
      const storage = useSession ? sessionStorage : localStorage;
      const data = storage.getItem(key);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      return parsed;
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
      return null;
    }
  }
}
```

### Graceful Degradation

If localStorage is unavailable, the cart will operate in memory-only mode:

```javascript
class InMemoryCart {
  constructor() {
    this.cart = [];
    this.persistent = false;
  }
  
  // Same API as CartManager but no persistence
  addToCart(item) {
    this.cart.push(item);
    // No localStorage.setItem()
  }
  
  getCart() {
    return this.cart;
  }
  
  // ... other methods
}
```


## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

### Property-Based Testing

We will use **fast-check** (for JavaScript) to implement property-based tests. Each property test will:
- Run a minimum of 100 iterations
- Generate random cart items, prices, quantities, and IDs
- Reference the design document property it validates

#### Property Test Configuration

```javascript
import fc from 'fast-check';

// Arbitraries for generating test data
const courseIdArbitrary = fc.oneof(
  fc.integer({ min: 1, max: 1000 }),  // Numeric IDs
  fc.string({ minLength: 3, maxLength: 20 })  // String IDs
);

const priceArbitrary = fc.oneof(
  fc.float({ min: 0.01, max: 1000, noNaN: true }),  // Numeric prices
  fc.string().map(s => `£${Math.random() * 1000}`),  // String prices with £
  fc.string().map(s => `${Math.random() * 1000} EGP`)  // String prices with EGP
);

const courseArbitrary = fc.record({
  id: courseIdArbitrary,
  type: fc.constant('course'),
  title: fc.string({ minLength: 5, maxLength: 50 }),
  price: priceArbitrary,
  instructor: fc.string({ minLength: 5, maxLength: 30 }),
  board: fc.constantFrom('Cambridge Board', 'Edexcel Board'),
  image: fc.string(),
  quantity: fc.integer({ min: 1, max: 10 })
});

const bookArbitrary = fc.record({
  id: courseIdArbitrary,
  type: fc.constant('book'),
  title: fc.string({ minLength: 5, maxLength: 50 }),
  price: priceArbitrary,
  author: fc.string({ minLength: 5, maxLength: 30 }),
  subject: fc.constantFrom('Mathematics', 'Physics', 'Chemistry', 'English'),
  quantity: fc.integer({ min: 1, max: 10 })
});

const cartItemArbitrary = fc.oneof(courseArbitrary, bookArbitrary);
```

#### Example Property Test

```javascript
describe('CartManager Property Tests', () => {
  test('Property 1: Immediate Persistence', () => {
    /**
     * Feature: cart-state-management-fix, Property 1: Immediate Persistence
     * For any cart modification operation (add, remove, update quantity),
     * the cart data should be immediately persisted to localStorage
     * and retrievable on the next load.
     */
    fc.assert(
      fc.property(cartItemArbitrary, (item) => {
        // Setup
        const cartManager = new CartManager();
        cartManager.clearCart();
        
        // Add item
        cartManager.addToCart(item);
        
        // Verify persistence
        const storedCart = JSON.parse(localStorage.getItem('cart'));
        expect(storedCart).toHaveLength(1);
        expect(storedCart[0].id).toBe(item.id);
        
        // Verify retrieval
        const newCartManager = new CartManager();
        const loadedCart = newCartManager.getCart();
        expect(loadedCart).toHaveLength(1);
        expect(loadedCart[0].id).toBe(item.id);
      }),
      { numRuns: 100 }
    );
  });
  
  test('Property 2: Price Normalization', () => {
    /**
     * Feature: cart-state-management-fix, Property 2: Price Normalization
     * For any price value (string with currency symbols or numeric),
     * when added to the cart, it should be stored as a numeric value
     * without currency symbols.
     */
    fc.assert(
      fc.property(priceArbitrary, (price) => {
        const normalized = PriceFormatter.parsePrice(price);
        
        // Should be a number
        expect(typeof normalized).toBe('number');
        
        // Should be non-negative
        expect(normalized).toBeGreaterThanOrEqual(0);
        
        // Should not contain currency symbols
        expect(String(normalized)).not.toMatch(/£|EGP|Â£/);
      }),
      { numRuns: 100 }
    );
  });
  
  test('Property 8: Loose Equality for ID Comparison', () => {
    /**
     * Feature: cart-state-management-fix, Property 8: Loose Equality for ID Comparison
     * For any two items with IDs that are equal when compared with loose equality (==),
     * they should be treated as duplicates regardless of whether one is a string
     * and the other is a number.
     */
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1000 }),
        courseArbitrary,
        (numericId, course) => {
          const cartManager = new CartManager();
          cartManager.clearCart();
          
          // Add course with numeric ID
          const course1 = { ...course, id: numericId };
          cartManager.addToCart(course1);
          
          // Try to add same course with string ID
          const course2 = { ...course, id: String(numericId) };
          const result = cartManager.addToCart(course2);
          
          // Should be rejected as duplicate
          expect(result).toBe(false);
          expect(cartManager.getCart()).toHaveLength(1);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Testing

Unit tests will focus on:

1. **Specific Examples**
   - Adding a specific course (mathematics)
   - Removing a specific item
   - Clearing an empty cart

2. **Edge Cases**
   - Empty cart on checkout (should redirect)
   - Cart with zero quantity items
   - Corrupted JSON in localStorage
   - localStorage quota exceeded

3. **Integration Points**
   - Cart modal rendering
   - Checkout page order summary
   - Cross-page navigation

#### Example Unit Tests

```javascript
describe('CartManager Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  
  test('should add mathematics course to cart', () => {
    const cartManager = new CartManager();
    const mathCourse = {
      id: 'mathematics',
      type: 'course',
      title: 'IGCSE Mathematics (Extended)',
      price: 299.00,
      instructor: 'Dr. Sarah Mitchell',
      board: 'Cambridge Board',
      image: 'images/teacher1.PNG',
      quantity: 1
    };
    
    cartManager.addToCart(mathCourse);
    
    expect(cartManager.getCart()).toHaveLength(1);
    expect(cartManager.getCart()[0].title).toBe('IGCSE Mathematics (Extended)');
  });
  
  test('should redirect to home when checkout page loads with empty cart', () => {
    const cartManager = new CartManager();
    cartManager.clearCart();
    
    // Mock window.location
    delete window.location;
    window.location = { href: '' };
    
    // Simulate checkout page load
    if (cartManager.getCart().length === 0) {
      window.location.href = 'index.html';
    }
    
    expect(window.location.href).toBe('index.html');
  });
  
  test('should handle corrupted cart data gracefully', () => {
    // Set corrupted data
    localStorage.setItem('cart', '{invalid json}');
    
    const cartManager = new CartManager();
    
    // Should initialize with empty cart
    expect(cartManager.getCart()).toEqual([]);
  });
  
  test('should migrate legacy enrollCourse data', () => {
    const legacyCourse = {
      courseId: 'physics',
      title: 'IGCSE Physics',
      price: '279.00 EGP'
    };
    
    localStorage.setItem('enrollCourse', JSON.stringify(legacyCourse));
    
    const cartManager = new CartManager();
    
    // Should have migrated the data
    expect(cartManager.getCart()).toHaveLength(1);
    expect(cartManager.getCart()[0].id).toBe('physics');
    
    // Should have removed legacy key
    expect(localStorage.getItem('enrollCourse')).toBeNull();
  });
});
```

### Test Coverage Goals

- **Line Coverage**: > 90%
- **Branch Coverage**: > 85%
- **Function Coverage**: 100%
- **Property Tests**: All 22 properties implemented
- **Unit Tests**: Minimum 30 tests covering examples and edge cases

### Testing Tools

- **Test Framework**: Jest
- **Property Testing**: fast-check
- **Mocking**: jest.mock() for localStorage, DOM elements
- **Coverage**: jest --coverage

