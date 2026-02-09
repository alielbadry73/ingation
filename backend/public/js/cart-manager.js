/**
 * InMemoryCart - Fallback cart implementation when localStorage is unavailable
 * Provides same API as CartManager but without persistence
 */
class InMemoryCart {
  constructor() {
    this.cart = [];
    this.persistent = false;
    console.warn('⚠️ InMemoryCart: Running in memory-only mode. Cart will not persist across page reloads.');
    this.showWarning();
  }

  // Show warning to user
  showWarning() {
    if (typeof alert !== 'undefined') {
      // Use a more subtle notification if possible
      const message = 'Cart storage is unavailable. Your cart will not be saved when you leave this page.';
      if (window.cartManager && typeof window.cartManager.showToast === 'function') {
        window.cartManager.showToast(message, 'warning');
      } else {
        console.warn('⚠️', message);
      }
    }
  }

  // Initialize (no-op for in-memory)
  init() {
    console.log('🛒 InMemoryCart: Initialized in memory-only mode');
  }

  // Load cart (always empty for in-memory)
  loadCart() {
    this.cart = [];
  }

  // Save cart (no-op for in-memory)
  saveCart() {
    console.log('💾 InMemoryCart: Save skipped (memory-only mode)');
  }

  // Add item to cart
  addToCart(item) {
    const normalizedItem = this.normalizeItem(item);
    const existingItem = this.cart.find(cartItem => cartItem.id == normalizedItem.id);
    
    if (existingItem) {
      console.warn('⚠️ InMemoryCart: Item already in cart:', normalizedItem.id);
      return false;
    }

    this.cart.push(normalizedItem);
    console.log('✅ InMemoryCart: Item added');
    return true;
  }

  // Remove item from cart
  removeFromCart(itemId) {
    const initialLength = this.cart.length;
    this.cart = this.cart.filter(item => item.id != itemId);
    return this.cart.length < initialLength;
  }

  // Update quantity
  updateQuantity(itemId, quantity) {
    const item = this.cart.find(cartItem => cartItem.id == itemId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(itemId);
      } else {
        item.quantity = quantity;
      }
    }
  }

  // Clear cart
  clearCart() {
    this.cart = [];
  }

  // Get cart
  getCart() {
    return this.cart;
  }

  // Get cart count
  getCartCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  // Get cart total
  getCartTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Normalize item (same as CartManager)
  normalizeItem(item) {
    return {
      id: item.id || item.courseId || item.title,
      type: item.type || (item.author ? 'book' : 'course'),
      title: item.title || 'Unknown Item',
      price: this.parsePrice(item.price || 0),
      quantity: item.quantity || 1,
      instructor: item.instructor,
      board: item.board,
      image: item.image,
      author: item.author,
      subject: item.subject,
      addedAt: item.addedAt || new Date().toISOString()
    };
  }

  // Parse price (same as CartManager)
  parsePrice(priceStr) {
    if (typeof priceStr === 'number') {
      return priceStr;
    }
    const cleaned = String(priceStr)
      .replace(/£|EGP|Â£/g, '')
      .replace(/,/g, '')
      .trim();
    return parseFloat(cleaned) || 0;
  }

  // Format price (same as CartManager)
  formatPrice(price) {
    return `${price.toFixed(2)} EGP`;
  }

  // Validate cart (same as CartManager)
  validateCart() {
    this.cart = this.cart.filter(item => 
      item.id && item.type && item.title && typeof item.price === 'number'
    );
  }

  // Update UI (no-op for in-memory, would need to be implemented if used)
  updateUI() {
    console.log('🔄 InMemoryCart: UI update skipped (not implemented)');
  }

  // Show toast (no-op for in-memory)
  showToast(message, type) {
    console.log(`📢 InMemoryCart Toast (${type}):`, message);
  }

  // Debug
  debug() {
    console.log('🐛 InMemoryCart Debug Info:');
    console.log('Cart:', this.cart);
    console.log('Count:', this.getCartCount());
    console.log('Total:', this.getCartTotal());
    console.log('Persistent:', this.persistent);
  }
}

/**
 * CartRecovery - Recovery mechanisms for cart data
 */
class CartRecovery {
  /**
   * Attempt to recover cart data from all storage locations
   * Checks locations in priority order and returns recovered data
   * @returns {Array} - Recovered cart items or empty array
   */
  static attemptRecovery() {
    console.log('🔄 CartRecovery: Attempting cart recovery...');
    
    // Priority 1: Main cart in localStorage
    let cart = this.tryLoadCart('cart', false);
    if (cart && Array.isArray(cart) && cart.length > 0) {
      console.log('✅ CartRecovery: Recovered from localStorage.cart');
      return cart;
    }
    
    // Priority 2: Legacy enrollCourse
    const enrollCourse = this.tryLoadCart('enrollCourse', false);
    if (enrollCourse) {
      console.log('✅ CartRecovery: Recovered from localStorage.enrollCourse');
      return [enrollCourse];
    }
    
    // Priority 3: sessionStorage.currentCourse
    const currentCourse = this.tryLoadCart('currentCourse', true);
    if (currentCourse) {
      console.log('✅ CartRecovery: Recovered from sessionStorage.currentCourse');
      return [currentCourse];
    }
    
    // Priority 4: bookCart
    const bookCart = this.tryLoadCart('bookCart', false);
    if (bookCart && Array.isArray(bookCart) && bookCart.length > 0) {
      console.log('✅ CartRecovery: Recovered from localStorage.bookCart');
      return bookCart;
    }
    
    // Priority 5: sessionStorage.cart
    cart = this.tryLoadCart('cart', true);
    if (cart && Array.isArray(cart) && cart.length > 0) {
      console.log('✅ CartRecovery: Recovered from sessionStorage.cart');
      return cart;
    }
    
    console.log('❌ CartRecovery: No cart data found in any location');
    return [];
  }

  /**
   * Try to load cart data from a specific storage location
   * @param {string} key - Storage key to check
   * @param {boolean} useSession - Whether to use sessionStorage (default: localStorage)
   * @returns {any} - Parsed data or null if not found/invalid
   */
  static tryLoadCart(key, useSession = false) {
    try {
      const storage = useSession ? sessionStorage : localStorage;
      const data = storage.getItem(key);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      return parsed;
    } catch (error) {
      console.error(`❌ CartRecovery: Failed to load ${key}:`, error);
      return null;
    }
  }
}

/**
 * CartErrorHandler - Centralized error handling for cart operations
 */
class CartErrorHandler {
  /**
   * Handle storage errors (quota exceeded, access denied, etc.)
   * @param {Error} error - The error object
   * @param {string} operation - The operation that failed (e.g., 'save', 'load')
   * @returns {Object} - { success: boolean, fallback: string }
   */
  static handleStorageError(error, operation) {
    console.error(`❌ Storage error during ${operation}:`, error);
    
    if (error.name === 'QuotaExceededError') {
      // Storage quota exceeded
      this.showUserError('Cart storage is full. Please clear some items.');
      return { success: false, fallback: 'memory' };
    }
    
    if (error.name === 'SecurityError') {
      // Private browsing or storage disabled
      this.showUserError('Cart storage is disabled. Please enable cookies and try again.');
      return { success: false, fallback: 'memory' };
    }
    
    // Generic storage error
    this.showUserError('Failed to save cart. Please try again.');
    return { success: false, fallback: 'memory' };
  }

  /**
   * Handle validation errors
   * @param {Object} item - The item that failed validation
   * @param {string} reason - The reason for validation failure
   * @returns {Object} - { valid: boolean, reason: string }
   */
  static handleValidationError(item, reason) {
    console.warn(`⚠️ Validation failed for item:`, item, `Reason: ${reason}`);
    
    // Log for debugging but don't show to user
    // Invalid items are silently removed
    return { valid: false, reason };
  }

  /**
   * Handle operation errors (duplicate, not found, invalid quantity)
   * @param {string} operation - The operation that failed
   * @param {Error|string} error - The error or error message
   * @returns {Object} - { success: boolean, error: any }
   */
  static handleOperationError(operation, error) {
    console.error(`❌ Operation ${operation} failed:`, error);
    
    // Show user-friendly message
    const messages = {
      'add_duplicate': 'This item is already in your cart',
      'remove_not_found': 'Item not found in cart',
      'invalid_quantity': 'Please enter a valid quantity',
      'empty_cart_checkout': 'Your cart is empty'
    };
    
    const message = messages[operation] || 'An error occurred';
    this.showUserError(message);
    return { success: false, error };
  }

  /**
   * Show user-friendly error message
   * @param {string} message - The error message to display
   */
  static showUserError(message) {
    // Use existing toast system if available
    if (window.cartManager && typeof window.cartManager.showToast === 'function') {
      window.cartManager.showToast(message, 'error');
    } else if (typeof showToast === 'function') {
      showToast(message, 'error');
    } else {
      // Fallback to alert
      alert(message);
    }
  }
}

/**
 * CartManager - Centralized cart state management
 * Single source of truth for all cart operations
 */

class CartManager {
  constructor() {
    this.storageKey = 'cart';
    this.cart = [];
    this.init();
  }

  // Initialize cart manager
  init() {
    console.log('🛒 CartManager: Initializing...');
    this.migrateLegacyData();
    this.loadCart();
    this.validateCart();
    this.updateUI();
    console.log('✅ CartManager: Initialized with', this.cart.length, 'items');
  }

  // Load cart from localStorage
  loadCart() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        this.cart = JSON.parse(data);
        console.log('📦 CartManager: Loaded cart from storage:', this.cart);
      } else {
        this.cart = [];
        console.log('📦 CartManager: No cart data found, initialized empty cart');
      }
    } catch (error) {
      CartErrorHandler.handleStorageError(error, 'load');
      this.cart = [];
    }
  }

  // Save cart to localStorage
  saveCart() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
      console.log('💾 CartManager: Cart saved to storage');
    } catch (error) {
      const result = CartErrorHandler.handleStorageError(error, 'save');
      if (result.fallback === 'memory') {
        console.warn('⚠️ CartManager: Falling back to memory-only mode');
      }
    }
  }

  // Migrate legacy data from old storage locations
  migrateLegacyData() {
    console.log('🔄 CartManager: Checking for legacy data...');
    const migratedItems = [];

    // Check localStorage.enrollCourse
    const enrollCourse = this.getJSON('enrollCourse', false);
    if (enrollCourse) {
      console.log('📥 Found enrollCourse:', enrollCourse);
      migratedItems.push(this.normalizeItem(enrollCourse));
      localStorage.removeItem('enrollCourse');
    }

    // Check sessionStorage.currentCourse
    const currentCourse = this.getJSON('currentCourse', true);
    if (currentCourse) {
      console.log('📥 Found currentCourse:', currentCourse);
      migratedItems.push(this.normalizeItem(currentCourse));
      sessionStorage.removeItem('currentCourse');
    }

    // DO NOT MIGRATE bookCart - it's separate for book purchases
    // bookCart is managed independently by book-checkout.html

    // Check sessionStorage.cart
    const sessionCart = this.getJSON('cart', true);
    if (sessionCart && Array.isArray(sessionCart)) {
      console.log('📥 Found sessionStorage.cart:', sessionCart);
      sessionCart.forEach(item => migratedItems.push(this.normalizeItem(item)));
      sessionStorage.removeItem('cart');
    }

    if (migratedItems.length > 0) {
      console.log('✅ CartManager: Migrated', migratedItems.length, 'items from legacy storage');
      this.cart = migratedItems;
      this.saveCart();
    }
  }

  // Get JSON from storage safely
  getJSON(key, useSession = false) {
    try {
      const storage = useSession ? sessionStorage : localStorage;
      const data = storage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`❌ Failed to parse ${key}:`, error);
      return null;
    }
  }

  // Normalize item to standard format
  normalizeItem(item) {
    return {
      id: item.id || item.courseId || item.title,
      type: item.type || (item.author ? 'book' : 'course'),
      title: item.title || 'Unknown Item',
      price: this.parsePrice(item.price || 0),
      quantity: item.quantity || 1,
      instructor: item.instructor,
      board: item.board,
      image: item.image,
      author: item.author,
      subject: item.subject,
      addedAt: item.addedAt || new Date().toISOString()
    };
  }

  // Parse price to numeric format
  parsePrice(priceStr) {
    if (typeof priceStr === 'number') {
      return priceStr;
    }
    const cleaned = String(priceStr)
      .replace(/£|EGP|Â£/g, '')
      .replace(/,/g, '')
      .trim();
    return parseFloat(cleaned) || 0;
  }

  // Format price for display
  formatPrice(price) {
    return `${price.toFixed(2)} EGP`;
  }

  // Validate cart data
  validateCart() {
    const validItems = this.cart.filter(item => {
      const isValid = item.id && item.type && item.title && typeof item.price === 'number';
      if (!isValid) {
        const reason = !item.id ? 'missing id' : 
                      !item.type ? 'missing type' : 
                      !item.title ? 'missing title' : 
                      'invalid price';
        CartErrorHandler.handleValidationError(item, reason);
      }
      return isValid;
    });

    if (validItems.length !== this.cart.length) {
      console.log(`🧹 CartManager: Removed ${this.cart.length - validItems.length} invalid items`);
      this.cart = validItems;
      this.saveCart();
    }
  }

  // Add item to cart
  addToCart(item) {
    console.log('➕ CartManager: Adding item to cart:', item);

    // Normalize the item
    const normalizedItem = this.normalizeItem(item);

    // Check for duplicates using loose equality
    const existingItem = this.cart.find(cartItem => cartItem.id == normalizedItem.id);
    if (existingItem) {
      console.warn('⚠️ CartManager: Item already in cart:', normalizedItem.id);
      CartErrorHandler.handleOperationError('add_duplicate', 'Item already exists');
      return false;
    }

    // Add to cart
    this.cart.push(normalizedItem);
    this.saveCart();
    this.updateUI();
    this.showToast('Item added to cart!', 'success');
    console.log('✅ CartManager: Item added successfully');
    return true;
  }

  // Remove item from cart
  removeFromCart(itemId) {
    console.log('➖ CartManager: Removing item:', itemId);
    const initialLength = this.cart.length;
    this.cart = this.cart.filter(item => item.id != itemId); // Loose equality

    if (this.cart.length < initialLength) {
      this.saveCart();
      this.updateUI();
      this.showToast('Item removed from cart', 'info');
      console.log('✅ CartManager: Item removed successfully');
    } else {
      CartErrorHandler.handleOperationError('remove_not_found', `Item ${itemId} not found`);
    }
  }

  // Update item quantity
  updateQuantity(itemId, quantity) {
    console.log('🔢 CartManager: Updating quantity for', itemId, 'to', quantity);
    
    // Validate quantity
    if (typeof quantity !== 'number' || isNaN(quantity) || quantity < 0) {
      CartErrorHandler.handleOperationError('invalid_quantity', `Invalid quantity: ${quantity}`);
      return;
    }
    
    const item = this.cart.find(cartItem => cartItem.id == itemId);

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(itemId);
      } else {
        item.quantity = quantity;
        this.saveCart();
        this.updateUI();
        console.log('✅ CartManager: Quantity updated');
      }
    } else {
      CartErrorHandler.handleOperationError('remove_not_found', `Item ${itemId} not found`);
    }
  }

  // Clear cart
  clearCart() {
    console.log('🗑️ CartManager: Clearing cart');
    this.cart = [];
    localStorage.removeItem(this.storageKey);
    
    // Remove legacy keys
    localStorage.removeItem('enrollCourse');
    localStorage.removeItem('bookCart');
    sessionStorage.removeItem('cart');
    sessionStorage.removeItem('currentCourse');
    
    this.updateUI();
    this.showToast('Cart cleared', 'info');
    console.log('✅ CartManager: Cart cleared');
  }

  // Get cart
  getCart() {
    return this.cart;
  }

  // Get cart count
  getCartCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  // Get cart total
  getCartTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Update UI
  updateUI() {
    this.updateCartCount();
    this.updateCartModal();
  }

  // Update cart count badge
  updateCartCount() {
    const count = this.getCartCount();
    const badges = document.querySelectorAll('#cartCount, .cart-count, [data-cart-count]');
    
    badges.forEach(badge => {
      badge.textContent = count;
      // Badge should always be visible, even when count is 0
      badge.style.display = '';
    });

    console.log('🔢 CartManager: Updated cart count to', count);
  }

  // Update cart modal
  updateCartModal() {
    const cartList = document.getElementById('cartList');
    const cartModalFooter = document.querySelector('#cartModal .modal-footer');
    
    if (!cartList) return;

    if (this.cart.length === 0) {
      cartList.innerHTML = `
        <div class="text-center py-5">
          <iconify-icon icon="material-symbols:shopping-cart-outline" style="font-size: 4rem; color: #cbd5e1; margin-bottom: 1rem;"></iconify-icon>
          <h5 style="color: #64748b; margin-bottom: 1rem;">Your cart is empty</h5>
          <p style="color: #94a3b8; margin-bottom: 2rem;">Discover our amazing courses and start learning today!</p>
          <a href="courses.html" class="btn btn-primary" style="padding: 12px 30px; border-radius: 25px; font-weight: 600;">
            <iconify-icon icon="material-symbols:school" class="me-2"></iconify-icon>
            Browse Courses
          </a>
        </div>
      `;
      // Hide modal footer when cart is empty
      if (cartModalFooter) cartModalFooter.style.display = 'none';
      return;
    }

    const cartHTML = this.cart.map(item => {
      const itemTotal = item.price * item.quantity;
      return `
        <div class="cart-item d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
          <div class="d-flex align-items-center">
            ${item.image ? `<img src="${item.image}" alt="${item.title}" class="rounded me-3" style="width: 50px; height: 50px; object-fit: cover;">` : ''}
            <div>
              <div class="fw-bold">${item.title}</div>
              <div class="text-muted small">${item.instructor || item.author || ''}</div>
              <div class="text-muted small">Qty: ${item.quantity}</div>
            </div>
          </div>
          <div class="text-end">
            <div class="fw-bold">${this.formatPrice(itemTotal)}</div>
            <button class="btn btn-sm btn-danger" onclick="window.cartManager.removeFromCart('${item.id}')">Remove</button>
          </div>
        </div>
      `;
    }).join('');

    cartList.innerHTML = cartHTML + `
      <hr>
      <div class="d-flex justify-content-between align-items-center fw-bold">
        <span>Total:</span>
        <span>${this.formatPrice(this.getCartTotal())}</span>
      </div>
    `;
    
    // Show modal footer when cart has items
    if (cartModalFooter) cartModalFooter.style.display = 'flex';
  }

  // Show toast notification
  showToast(message, type = 'info') {
    console.log(`📢 Toast (${type}):`, message);
    
    // Try to use existing toast system
    if (typeof showToast === 'function') {
      showToast(message, type);
      return;
    }

    // Fallback: create simple toast
    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'error' ? 'danger' : type === 'warning' ? 'warning' : type === 'success' ? 'success' : 'info'}`;
    toast.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 250px;';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // Enroll now (clear cart and add single item, then redirect)
  enrollNow(item) {
    console.log('🎓 CartManager: Enroll now:', item);
    this.clearCart();
    this.addToCart(item);
    window.location.href = 'checkout.html';
  }

  // Debug method
  debug() {
    console.log('🐛 CartManager Debug Info:');
    console.log('Cart:', this.cart);
    console.log('Count:', this.getCartCount());
    console.log('Total:', this.getCartTotal());
    console.log('localStorage.cart:', localStorage.getItem('cart'));
    console.log('All storage keys:', Object.keys(localStorage));
  }

  // Recovery method - attempt to recover cart from all storage locations
  recover() {
    console.log('🔄 CartManager: Attempting recovery...');
    const recoveredData = CartRecovery.attemptRecovery();
    
    if (recoveredData.length > 0) {
      this.cart = recoveredData;
      this.validateCart();
      this.saveCart();
      this.updateUI();
      this.showToast(`Recovered ${recoveredData.length} item(s) from storage`, 'success');
      console.log('✅ CartManager: Recovery successful');
      return true;
    } else {
      this.showToast('No cart data found to recover', 'info');
      console.log('❌ CartManager: No data to recover');
      return false;
    }
  }
}

// Create global instance
if (typeof window !== 'undefined') {
  // Check if localStorage is available
  let storageAvailable = false;
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    storageAvailable = true;
  } catch (error) {
    console.warn('⚠️ localStorage is not available:', error);
    storageAvailable = false;
  }

  if (storageAvailable) {
    window.cartManager = new CartManager();
    console.log('✅ CartManager: Global instance created with localStorage');
  } else {
    window.cartManager = new InMemoryCart();
    console.log('⚠️ InMemoryCart: Global instance created (localStorage unavailable)');
  }
}
