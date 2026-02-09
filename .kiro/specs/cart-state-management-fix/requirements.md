# Requirements Document

## Introduction

The IGCSE tutoring platform currently suffers from critical cart state management issues that prevent users from successfully completing purchases. Cart data is inconsistently stored across multiple storage locations (localStorage.cart, sessionStorage.cart, localStorage.enrollCourse, sessionStorage.currentCourse, and localStorage.bookCart), leading to data loss during navigation, especially when users navigate to the checkout page. Additionally, cart functionality is duplicated across multiple HTML files with slight variations, creating maintenance challenges and inconsistent behavior. This specification addresses these issues by centralizing cart state management, standardizing data structures, and ensuring reliable cart persistence across all pages.

## Glossary

- **Cart_Manager**: A centralized JavaScript module responsible for all cart operations including add, remove, update, persist, and retrieve
- **Cart_Item**: A standardized data structure representing an item in the shopping cart (course or book)
- **Storage_Layer**: The unified localStorage-based persistence mechanism for cart data
- **Cart_Count_Badge**: UI element displaying the number of items in the cart
- **Checkout_Page**: The page where users review their cart and complete payment information
- **Course_ID**: A unique identifier for a course (can be numeric or string-based)
- **Book_Cart**: A specialized cart for digital book purchases
- **Cart_State**: The current contents and metadata of the shopping cart
- **Cart_Recovery**: The process of restoring cart data when it appears to be lost
- **Price_Format**: The standardized currency display format (EGP)

## Requirements

### Requirement 1: Centralized Cart State Management

**User Story:** As a developer, I want a single source of truth for cart state, so that cart data is consistent across all pages and operations.

#### Acceptance Criteria

1. THE Cart_Manager SHALL store all cart data in a single localStorage key named 'cart'
2. WHEN any page needs cart data, THE Cart_Manager SHALL provide it from the single storage location
3. THE Cart_Manager SHALL be the only module that directly reads or writes cart data to storage
4. WHEN cart data is modified, THE Cart_Manager SHALL immediately persist changes to localStorage
5. THE Cart_Manager SHALL validate cart data structure on every load operation

### Requirement 2: Standardized Cart Item Data Structure

**User Story:** As a developer, I want all cart items to follow a consistent data structure, so that cart operations work reliably regardless of item type.

#### Acceptance Criteria

1. WHEN a course is added to the cart, THE Cart_Manager SHALL store it with fields: id, type, title, price, instructor, board, image, quantity, addedAt
2. WHEN a book is added to the cart, THE Cart_Manager SHALL store it with fields: id, type, title, author, subject, price, quantity, addedAt
3. THE Cart_Manager SHALL reject items that do not contain required fields (id, type, title, price)
4. WHEN cart data is loaded, THE Cart_Manager SHALL remove any items with invalid structure
5. THE Cart_Manager SHALL normalize price values to numeric format (removing currency symbols)

### Requirement 3: Cart Persistence Across Navigation

**User Story:** As a user, I want my cart items to remain in my cart when I navigate between pages, so that I don't lose my selections.

#### Acceptance Criteria

1. WHEN a user adds an item to the cart on any page, THE Cart_Manager SHALL persist it to localStorage immediately
2. WHEN a user navigates to a different page, THE Cart_Manager SHALL load cart data from localStorage on page load
3. WHEN the checkout page loads, THE Cart_Manager SHALL display all cart items that were added on previous pages
4. WHEN cart data exists in localStorage, THE Cart_Manager SHALL use it as the primary source
5. IF cart data is corrupted or invalid, THE Cart_Manager SHALL initialize an empty cart and log the error

### Requirement 4: Checkout Page Cart Loading

**User Story:** As a user, I want to see all my cart items on the checkout page, so that I can review my order before completing payment.

#### Acceptance Criteria

1. WHEN the checkout page loads, THE Cart_Manager SHALL retrieve cart data from localStorage
2. WHEN cart data is successfully loaded, THE Checkout_Page SHALL display all items with correct details (title, price, instructor, image)
3. WHEN the cart is empty on checkout page load, THE Checkout_Page SHALL redirect the user to the home page
4. THE Checkout_Page SHALL calculate and display the correct total price for all cart items
5. WHEN cart items are displayed, THE Checkout_Page SHALL use the standardized price format (EGP)

### Requirement 5: Unified Cart Count Display

**User Story:** As a user, I want to see an accurate count of items in my cart on every page, so that I know how many items I have selected.

#### Acceptance Criteria

1. WHEN the cart count changes, THE Cart_Manager SHALL update all Cart_Count_Badge elements on the page immediately without requiring a page refresh
2. THE Cart_Manager SHALL calculate cart count as the sum of quantities of all items
3. WHEN the cart is empty, THE Cart_Count_Badge SHALL display "0" and remain visible
4. THE Cart_Count_Badge SHALL always be visible regardless of cart count (never hidden with display:none)
5. WHEN a page loads, THE Cart_Manager SHALL immediately update the Cart_Count_Badge with the current count
6. THE Cart_Manager SHALL update the Cart_Count_Badge after every add, remove, or quantity change operation without requiring a page refresh
7. WHEN an item is removed from the cart, THE cart data SHALL be reloaded from localStorage before updating the UI to ensure consistency

### Requirement 6: Course ID Mapping Consistency

**User Story:** As a developer, I want consistent course ID handling, so that courses are correctly identified across all operations.

#### Acceptance Criteria

1. THE Cart_Manager SHALL accept both numeric and string course IDs
2. WHEN comparing course IDs, THE Cart_Manager SHALL use loose equality to handle type differences
3. THE Cart_Manager SHALL store course IDs in their original format without conversion
4. WHEN searching for a course in the cart, THE Cart_Manager SHALL match IDs regardless of type (string vs number)
5. THE Cart_Manager SHALL log a warning when duplicate courses with different ID types are detected

### Requirement 7: Standardized Currency Display

**User Story:** As a user, I want to see consistent pricing across all pages, so that I understand the cost in my local currency.

#### Acceptance Criteria

1. THE Cart_Manager SHALL store all prices as numeric values without currency symbols
2. WHEN displaying prices, THE System SHALL format them as "XXX.XX EGP"
3. THE Cart_Manager SHALL convert any price strings (containing £ or EGP) to numeric values on input
4. WHEN calculating totals, THE Cart_Manager SHALL use numeric price values
5. THE Checkout_Page SHALL display all prices in EGP format consistently

### Requirement 8: Legacy Storage Cleanup

**User Story:** As a developer, I want to remove obsolete storage keys, so that the system doesn't have conflicting data sources.

#### Acceptance Criteria

1. WHEN the Cart_Manager initializes, THE Cart_Manager SHALL check for legacy storage keys (enrollCourse, currentCourse, bookCart)
2. IF legacy data exists and the main cart is empty, THE Cart_Manager SHALL migrate the legacy data to the main cart
3. AFTER migrating legacy data, THE Cart_Manager SHALL remove the legacy storage keys
4. THE Cart_Manager SHALL log all migration operations for debugging
5. WHEN clearing the cart, THE Cart_Manager SHALL remove all legacy storage keys in addition to the main cart key

### Requirement 9: Cart State Debugging and Recovery

**User Story:** As a developer, I want comprehensive logging and recovery mechanisms, so that I can diagnose and fix cart issues quickly.

#### Acceptance Criteria

1. THE Cart_Manager SHALL log all cart operations (add, remove, update, load, save) to the console
2. WHEN cart data fails to load, THE Cart_Manager SHALL log the error with details about the failure
3. THE Cart_Manager SHALL provide a recovery function that attempts to restore cart data from all possible sources
4. WHEN cart validation fails, THE Cart_Manager SHALL log which items were removed and why
5. THE Cart_Manager SHALL expose a debug method that displays current cart state and all storage keys

### Requirement 10: Duplicate Function Elimination

**User Story:** As a developer, I want a single implementation of cart functions, so that behavior is consistent and maintenance is simplified.

#### Acceptance Criteria

1. THE System SHALL have only one implementation of updateCartCount function (in Cart_Manager)
2. THE System SHALL have only one implementation of updateCartModal function (in Cart_Manager)
3. WHEN pages need cart functionality, THE System SHALL load the Cart_Manager module
4. THE Cart_Manager SHALL expose a public API for all cart operations
5. WHEN legacy inline cart functions are encountered, THE System SHALL replace them with Cart_Manager calls

### Requirement 11: Cart Clearing Functionality

**User Story:** As a user, I want to clear my cart completely, so that I can start fresh with new selections.

#### Acceptance Criteria

1. WHEN a user clicks a "Clear Cart" button, THE Cart_Manager SHALL remove all items from the cart
2. WHEN the cart is cleared, THE Cart_Manager SHALL remove the cart data from localStorage
3. WHEN the cart is cleared, THE Cart_Manager SHALL remove all legacy storage keys
4. AFTER clearing the cart, THE Cart_Manager SHALL update the Cart_Count_Badge to show "0"
5. AFTER clearing the cart, THE Cart_Manager SHALL update the cart modal to show an empty state message

### Requirement 12: Book Cart Integration

**User Story:** As a user, I want to add both courses and books to my cart, so that I can purchase multiple types of content together.

#### Acceptance Criteria

1. WHEN a user adds a book to the cart, THE Cart_Manager SHALL store it with type: 'book'
2. WHEN a user adds a course to the cart, THE Cart_Manager SHALL store it with type: 'course'
3. THE Cart_Manager SHALL support mixed carts containing both books and courses
4. WHEN displaying cart items, THE Checkout_Page SHALL render books and courses with appropriate styling
5. WHEN calculating totals, THE Cart_Manager SHALL include both book and course prices

### Requirement 13: Cart Modal Updates

**User Story:** As a user, I want to see my cart contents in a modal popup, so that I can quickly review my selections without leaving the current page.

#### Acceptance Criteria

1. WHEN the cart modal opens, THE Cart_Manager SHALL populate it with current cart items without requiring a page refresh
2. WHEN cart items are displayed in the modal, THE System SHALL show item image, title, price, and quantity
3. WHEN a user clicks remove on an item in the modal, THE Cart_Manager SHALL remove it and update the display dynamically without page refresh
4. WHEN a user changes quantity in the modal, THE Cart_Manager SHALL update the item quantity and recalculate totals dynamically without page refresh
5. WHEN the cart is empty, THE Cart_Modal SHALL display a message "Your cart is empty"

### Requirement 14: Add to Cart Validation

**User Story:** As a user, I want to be prevented from adding duplicate items to my cart, so that I don't accidentally purchase the same course twice.

#### Acceptance Criteria

1. WHEN a user attempts to add an item already in the cart, THE Cart_Manager SHALL reject the addition
2. WHEN duplicate addition is prevented, THE Cart_Manager SHALL show a warning message to the user
3. THE Cart_Manager SHALL check for duplicates by comparing item IDs
4. WHEN checking for duplicates, THE Cart_Manager SHALL handle both string and numeric ID types
5. THE Cart_Manager SHALL allow the same course with different variants (if applicable)

### Requirement 15: Enroll Now vs Add to Cart

**User Story:** As a user, I want to either enroll immediately or add to cart, so that I have flexibility in my purchase flow.

#### Acceptance Criteria

1. WHEN a user clicks "Enroll Now", THE System SHALL add the course to the cart and redirect to checkout immediately
2. WHEN a user clicks "Add to Cart", THE System SHALL add the course to the cart and remain on the current page
3. WHEN "Enroll Now" is clicked, THE Cart_Manager SHALL ensure the cart contains only the selected course
4. WHEN "Add to Cart" is clicked, THE Cart_Manager SHALL add the course to existing cart items
5. BOTH operations SHALL use the Cart_Manager to ensure consistent behavior
