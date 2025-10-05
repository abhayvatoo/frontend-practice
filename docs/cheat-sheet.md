# React Quick Reference - Cheat Sheet

## useState Patterns

```javascript
// Basic
const [value, setValue] = useState(initial);

// Toggle
const [on, setOn] = useState(false);
setOn((prev) => !prev);

// Form object
const [form, setForm] = useState({ name: "", email: "" });
setForm((prev) => ({ ...prev, [name]: value }));

// Array add
setItems([...items, newItem]);

// Array remove
setItems(items.filter((i) => i.id !== id));

// Array update
setItems(items.map((i) => (i.id === id ? { ...i, changes } : i)));
```

---

## useEffect Patterns

```javascript
// Run once on mount
useEffect(() => {
  // code
}, []);

// Run when deps change
useEffect(() => {
  // code
}, [dep1, dep2]);

// With cleanup
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer);
}, []);

// Fetch on mount
useEffect(() => {
  fetch("/api")
    .then((r) => r.json())
    .then(setData);
}, []);
```

---

## Common Hooks

```javascript
// DOM ref
const ref = useRef(null);
ref.current.focus();

// Previous value
const prevRef = useRef();
useEffect(() => {
  prevRef.current = value;
}, [value]);

// Memoize function
const fn = useCallback(() => {}, [deps]);

// Memoize value
const val = useMemo(() => expensiveCalc(data), [data]);
```

---

## Array Methods

```javascript
// Find
const item = arr.find((i) => i.id === id);

// Find index
const idx = arr.findIndex((i) => i.id === id);

// Check exists
const exists = arr.some((i) => i.id === id);

// Filter
const filtered = arr.filter((i) => i.active);

// Map (transform)
const doubled = arr.map((i) => i * 2);

// Reduce (sum)
const total = arr.reduce((acc, i) => acc + i.price, 0);
```

---

## Event Handlers

```javascript
// Input change
const handleChange = (e) => {
  const { name, value } = e.target;
  setForm({ ...form, [name]: value });
};

// Form submit
const handleSubmit = (e) => {
  e.preventDefault();
  // validate and submit
};

// Button click
<button onClick={() => handleClick(id)}>Click</button>;

// Prevent default
const handleClick = (e) => {
  e.preventDefault();
  e.stopPropagation();
};
```

---

## Conditional Rendering

```javascript
// If/else
if (loading) return <Loading />;
if (error) return <Error />;
return <Data />;

// Ternary
{
  isOpen ? <Modal /> : null;
}
{
  count > 0 ? <Count /> : <Empty />;
}

// Logical AND
{
  error && <ErrorMessage />;
}
{
  items.length > 0 && <List />;
}

// Nullish coalescing
{
  user?.name ?? "Guest";
}
```

---

## List Rendering

```javascript
// Basic map
{
  items.map((item) => <div key={item.id}>{item.name}</div>);
}

// With index (avoid as key)
{
  items.map((item, i) => <div key={item.id}>{item.name}</div>);
}

// Filter then map
{
  items.filter((i) => i.active).map((i) => <Item key={i.id} {...i} />);
}

// Empty state
{
  items.length === 0 ? (
    <p>No items</p>
  ) : (
    items.map((i) => <Item key={i.id} {...i} />)
  );
}
```

---

## Form Validation

```javascript
// Basic validation
const validate = (form) => {
  const errors = {};
  if (!form.email) errors.email = "Required";
  if (!form.email.includes("@")) errors.email = "Invalid";
  return errors;
};

// In submit
const handleSubmit = (e) => {
  e.preventDefault();
  const errors = validate(form);
  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    return;
  }
  // Submit
};

// Clear errors on change
const handleChange = (e) => {
  const { name, value } = e.target;
  setForm({ ...form, [name]: value });
  if (errors[name]) {
    setErrors({ ...errors, [name]: "" });
  }
};
```

---

## API Patterns

```javascript
// Fetch with loading/error
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);
      const res = await fetch("/api/data");
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);

// POST request
const submit = async (formData) => {
  const res = await fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  return res.json();
};
```

---

## localStorage

```javascript
// Save
localStorage.setItem("key", JSON.stringify(data));

// Load
const saved = localStorage.getItem("key");
const data = saved ? JSON.parse(saved) : null;

// Remove
localStorage.removeItem("key");

// Clear all
localStorage.clear();

// With error handling
try {
  localStorage.setItem("key", JSON.stringify(data));
} catch (e) {
  console.error("Storage error:", e);
}
```

---

## Debouncing

```javascript
// With useEffect + useRef
const timerRef = useRef(null);

useEffect(() => {
  clearTimeout(timerRef.current);

  timerRef.current = setTimeout(() => {
    // Do something after delay
  }, 500);

  return () => clearTimeout(timerRef.current);
}, [dependency]);
```

---

## Common Mistakes

```javascript
// ❌ Mutating state
arr.push(item);
obj.name = "John";

// ✅ Immutable updates
setArr([...arr, item]);
setObj({ ...obj, name: "John" });

// ❌ Missing key
{
  items.map((i) => <div>{i.name}</div>);
}

// ✅ With key
{
  items.map((i) => <div key={i.id}>{i.name}</div>);
}

// ❌ Stale closure
setTimeout(() => setCount(count + 1), 1000);

// ✅ Callback form
setTimeout(() => setCount((c) => c + 1), 1000);

// ❌ Missing cleanup
useEffect(() => {
  setInterval(() => {}, 1000);
}, []);

// ✅ With cleanup
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer);
}, []);
```

---

## JSX Syntax

```javascript
// Self-closing
<Component prop={value} />

// With children
<Component prop={value}>
  {children}
</Component>

// Multiple props
<Component
  prop1={value1}
  prop2={value2}
  onClick={handler}
/>

// Spread props
<Component {...props} />

// Conditional prop
<Component
  disabled={isDisabled}
  className={isActive ? 'active' : ''}
/>
```

---

## Style Patterns

```javascript
// Inline styles
<div style={{ color: 'red', fontSize: '16px' }} />

// Style object
const styles = {
  container: { padding: '20px' },
  title: { fontSize: '24px' }
};
<div style={styles.container} />

// Conditional classes
<div className={`base ${isActive ? 'active' : ''}`} />

// Class array
<div className={['base', isActive && 'active'].filter(Boolean).join(' ')} />
```

---

## Performance Tips

```javascript
// ✅ Derive state, don't store
const fullName = `${firstName} ${lastName}`;

// ✅ Keep state minimal
const [users, setUsers] = useState([]);
const activeUsers = users.filter((u) => u.active); // Derive

// ✅ Use callback for updates
setCount((c) => c + 1);

// ✅ Memoize only when needed
const expensive = useMemo(() => calc(data), [data]);
```

---

## Assessment Tips

1. **Read all requirements first**
2. **Check what's provided** (HTML/CSS often given)
3. **Start simple** - basic functionality first
4. **Test incrementally** - console.log frequently
5. **Handle edge cases**:
   - Empty arrays
   - Null/undefined values
   - Loading states
   - Error states
6. **Complete all levels > Perfect one level**
7. **Time management**: 15/25/30/20 min per level

---

## Quick Checks

Before submitting:

- [ ] No console errors
- [ ] All keys in lists
- [ ] No state mutations
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Forms validate properly
- [ ] Empty states show messages
- [ ] Cleanup functions present

---

## Common Assessment Patterns

### 1. Render from JSON

```javascript
const data = require("./data.json");
{
  data.items.map((item) => <Card key={item.id} {...item} />);
}
```

### 2. Add/Remove from list

```javascript
const add = (item) => setItems([...items, { ...item, id: Date.now() }]);
const remove = (id) => setItems(items.filter((i) => i.id !== id));
```

### 3. Move between columns

```javascript
const moveRight = (id) => {
  setItems(
    items.map((i) => (i.id === id ? { ...i, column: i.column + 1 } : i)),
  );
};
```

### 4. Fetch and display

```javascript
useEffect(() => {
  fetch("/api/data")
    .then((r) => r.json())
    .then(setData);
}, []);
```

### 5. Form with validation

```javascript
const [errors, setErrors] = useState({});
const validate = () => {
  const e = {};
  if (!form.name) e.name = "Required";
  return e;
};
```

---

## Time-Savers

```javascript
// Destructuring
const { id, name, price } = product;

// Short-circuit evaluation
const value = input || 'default';
const value = input ?? 'default';

// Optional chaining
user?.profile?.name

// Template literals
`Total: ${total.toFixed(2)}`

// Object shorthand
const obj = { name, email }; // instead of { name: name, email: email }

// Array destructuring
const [first, ...rest] = array;
```

---

**Print this page for quick reference during practice!**
