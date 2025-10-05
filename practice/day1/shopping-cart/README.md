# Shopping Cart Exercise

## Learning Objectives

- Master state management with complex data structures
- Practice immutable array updates (add, remove, update)
- Implement quantity management logic
- Calculate derived state (totals)
- Handle edge cases (empty cart, quantity validation)

---

## Requirements

Build a shopping cart component with the following features:

### Data Structure
```javascript
const products = [
  { id: 1, name: "iPhone", price: 999 },
  { id: 2, name: "iPad", price: 599 },
  { id: 3, name: "MacBook", price: 1299 }
];
```

### Functional Requirements

1. **Product Display**
    - Show all available products
    - Display name and price for each product
    - "Add to Cart" button

2. **Cart Management**
    - Add product to cart (if not in cart, set quantity = 1)
    - Increment quantity if product already in cart
    - Decrement quantity button (remove when quantity reaches 0)
    - Remove entire product button (regardless of quantity)
    - Update quantity via input field

3. **Cart Display**
    - Show all items in cart with quantity
    - Display subtotal for each item (price × quantity)
    - Display total cart value
    - Show "Cart is empty" when no items

4. **Edge Cases to Handle**
    - Empty cart state
    - Quantity cannot be < 1
    - Prevent negative quantities in input
    - Handle direct quantity input (validate number)

---

## Component Structure

```
App
├── Cart (displays cart items and total)
│   └── CartItem (individual cart item with controls)
└── ProductList
    └── ProductCard (individual product with Add button)
```

---

## Expected State Shape

```javascript
// Cart state structure
[
  { id: 1, name: "iPhone", price: 999, quantity: 2 },
  { id: 2, name: "iPad", price: 599, quantity: 1 }
]
```

---

## Key Concepts Practiced

### 1. State Management
```javascript
const [cart, setCart] = useState([]);
```

### 2. Finding Items
```javascript
const existingItem = cart.find(i => i.id === item.id);
```

### 3. Adding Items (Immutably)
```javascript
// If not in cart
setCart([...cart, { ...item, quantity: 1 }]);

// If in cart
setCart(cart.map(i => 
  i.id === item.id 
    ? { ...i, quantity: i.quantity + 1 }
    : i
));
```

### 4. Removing Items
```javascript
setCart(cart.filter(i => i.id !== id));
```

### 5. Calculating Totals
```javascript
const total = cart.reduce((acc, item) => 
  acc + (item.price * item.quantity), 0
);
```

---

## Common Mistakes to Avoid

❌ **Mutating state directly**
```javascript
cart[0].quantity = 5; // DON'T
```

❌ **Not adding initial quantity**
```javascript
setCart([...cart, item]); // Missing quantity: 1
```

❌ **Comparing objects instead of IDs**
```javascript
if (i === idx) // Wrong - comparing object to number
```

❌ **Missing keys in lists**
```javascript
{cart.map(item => <div>...</div>)} // Missing key prop
```

✅ **Correct approaches shown in AutoSaveForm.jsx**

---

## Testing Checklist

- [ ] Add product to empty cart
- [ ] Add same product multiple times (quantity increments)
- [ ] Remove product entirely
- [ ] Decrement quantity (should remove when quantity = 1)
- [ ] Update quantity via input
- [ ] Verify total calculation is correct
- [ ] Empty cart shows appropriate message
- [ ] No console errors

---

## Stretch Goals (Optional)

1. Add product categories and filter
2. Implement "Clear Cart" button
3. Add localStorage persistence
4. Show item count badge on cart icon
5. Add discount/coupon code functionality

---

## Time Budget

- Setup & basic structure: 5 min
- Add to cart logic: 5 min
- Cart display & calculations: 5 min
- Remove/update logic: 5 min
- Edge cases & styling: 5 min
- Testing: 5 min

---

## Files

- `ShoppingCart.jsx` - Your implementation
- `AutoSaveForm.jsx` - Reference solution
- `README.md` - This file

---

## Next Steps

After completing:
1. Compare with solution
2. Note any difficulties
3. Add learnings to main docs
4. Move to next exercise: Auto-Save Form

---

**Status**: Not Started / In Progress / Completed  
**Date Started**:  
**Time Taken**:  
**Difficulty Rating**: