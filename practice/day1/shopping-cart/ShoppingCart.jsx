import { useState } from "react";

/**
 * Shopping Cart - Complete Solution
 * Demonstrates: useState, array operations, component composition
 */

function App() {
  const products = [
    { id: 1, name: "iPhone", price: 999 },
    { id: 2, name: "iPad", price: 599 },
    { id: 3, name: "MacBook", price: 1299 },
  ];

  const [cart, setCart] = useState([]);

  // Add item or increment quantity
  function addItem(item) {
    const existingItem = cart.find((i) => i.id === item.id);

    if (existingItem) {
      // Increment quantity immutably
      setCart(
        cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      );
    } else {
      // Add new item with quantity 1
      setCart((prev) => [...prev, { ...item, quantity: 1 }]);
    }
  }

  // Decrement quantity (remove if quantity becomes 0)
  function decrementItem(id) {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  // Remove entire product from cart
  function removeItem(id) {
    setCart(cart.filter((item) => item.id !== id));
  }

  // Update quantity directly (from input)
  function updateQuantity(id, newQuantity) {
    // Validate input
    const quantity = parseInt(newQuantity);

    if (isNaN(quantity) || quantity <= 0) {
      removeItem(id);
      return;
    }

    setCart(
      cart.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  }

  // Clear entire cart
  function clearCart() {
    setCart([]);
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Shopping Cart Demo</h1>

      <Cart
        cart={cart}
        onDecrement={decrementItem}
        onRemove={removeItem}
        onUpdateQuantity={updateQuantity}
        onClear={clearCart}
      />

      <ProductList products={products} cart={cart} onAdd={addItem} />
    </div>
  );
}

/**
 * Cart Component
 * Displays cart items with controls and total
 */
function Cart({ cart, onDecrement, onRemove, onUpdateQuantity, onClear }) {
  // Calculate total
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div style={styles.emptyCart}>
        <p>🛒 Your cart is empty</p>
      </div>
    );
  }

  return (
    <div style={styles.cart}>
      <div style={styles.cartHeader}>
        <h2>Shopping Cart ({itemCount} items)</h2>
        <button onClick={onClear} style={styles.clearButton}>
          Clear Cart
        </button>
      </div>

      {cart.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onDecrement={onDecrement}
          onRemove={onRemove}
          onUpdateQuantity={onUpdateQuantity}
        />
      ))}

      <div style={styles.total}>
        <strong>Total: ${total.toFixed(2)}</strong>
      </div>
    </div>
  );
}

/**
 * Individual Cart Item
 * Shows product details and quantity controls
 */
function CartItem({ item, onDecrement, onRemove, onUpdateQuantity }) {
  const subtotal = item.price * item.quantity;

  return (
    <div style={styles.cartItem}>
      <div style={styles.itemInfo}>
        <h3>{item.name}</h3>
        <p style={styles.price}>${item.price}</p>
      </div>

      <div style={styles.quantityControls}>
        <button
          onClick={() => onDecrement(item.id)}
          style={styles.button}
          disabled={item.quantity <= 1}
        >
          -
        </button>

        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onUpdateQuantity(item.id, e.target.value)}
          style={styles.quantityInput}
        />

        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          style={styles.button}
        >
          +
        </button>

        <button
          onClick={() => onRemove(item.id)}
          style={styles.removeButton}
          title="Remove from cart"
        >
          🗑️
        </button>
      </div>

      <div style={styles.subtotal}>
        <strong>${subtotal.toFixed(2)}</strong>
      </div>
    </div>
  );
}

/**
 * Product List Component
 * Displays available products
 */
function ProductList({ products, cart, onAdd }) {
  return (
    <div>
      <h2 style={{ marginTop: "40px" }}>Available Products</h2>
      <div style={styles.productGrid}>
        {products.map((product) => {
          const inCart = cart.find((item) => item.id === product.id);

          return (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={onAdd}
              inCart={!!inCart}
              quantity={inCart?.quantity || 0}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * Individual Product Card
 * Shows product and add button
 */
function ProductCard({ product, onAdd, inCart, quantity }) {
  return (
    <div style={styles.productCard}>
      <h3>{product.name}</h3>
      <p style={styles.productPrice}>${product.price}</p>

      {inCart && <p style={styles.inCartBadge}>In cart: {quantity}</p>}

      <button onClick={() => onAdd(product)} style={styles.addButton}>
        {inCart ? "+ Add More" : "+ Add to Cart"}
      </button>
    </div>
  );
}

// Styles
const styles = {
  cart: {
    border: "2px solid #333",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  emptyCart: {
    border: "2px dashed #ccc",
    padding: "40px",
    textAlign: "center",
    marginBottom: "20px",
    borderRadius: "8px",
    color: "#999",
  },
  cartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "1px solid #ddd",
    paddingBottom: "10px",
  },
  clearButton: {
    padding: "8px 16px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    margin: "10px 0",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "white",
  },
  itemInfo: {
    flex: 1,
  },
  price: {
    color: "#666",
    margin: "5px 0",
  },
  quantityControls: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  button: {
    padding: "5px 12px",
    fontSize: "16px",
    cursor: "pointer",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "white",
  },
  quantityInput: {
    width: "60px",
    padding: "5px",
    textAlign: "center",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  removeButton: {
    padding: "5px 10px",
    cursor: "pointer",
    border: "none",
    background: "none",
    fontSize: "18px",
    marginLeft: "10px",
  },
  subtotal: {
    minWidth: "100px",
    textAlign: "right",
  },
  total: {
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "2px solid #333",
    textAlign: "right",
    fontSize: "20px",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  productCard: {
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    backgroundColor: "white",
  },
  productPrice: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#2196F3",
    margin: "10px 0",
  },
  inCartBadge: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "5px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    display: "inline-block",
    marginBottom: "10px",
  },
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    width: "100%",
  },
};

export default App;
