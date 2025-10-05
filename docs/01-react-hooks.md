# React Hooks - Complete Reference

**Study Time**: 2 hours  
**Date**: Day 1, Morning Session

---

## Table of Contents
1. [useState](#usestate)
2. [useEffect](#useeffect)
3. [useRef](#useref)
4. [useCallback](#usecallback)
5. [useMemo](#usememo)
6. [Common Patterns](#common-patterns)
7. [Pitfalls to Avoid](#pitfalls-to-avoid)

---

## useState

### Basic Usage
```javascript
const [value, setValue] = useState(initialValue);
```

### ✅ DO
```javascript
// Update with new value
setCount(5);

// Update object immutably
setUser({ ...user, name: 'John' });

// Update array immutably
setItems([...items, newItem]);

// Use callback when depending on previous state
setCount(prevCount => prevCount + 1);
```

### ❌ DON'T
```javascript
// Don't mutate state directly
user.name = 'John'; // BAD
items.push(newItem); // BAD

// Don't use old state value in async/loops
setTimeout(() => setCount(count + 1), 1000); // BAD - use callback form
```

### Common Patterns

#### Toggle Boolean
```javascript
const [isOpen, setIsOpen] = useState(false);
const toggle = () => setIsOpen(prev => !prev);
```

#### Form State Management
```javascript
const [form, setForm] = useState({ name: '', email: '' });

const handleChange = (e) => {
  const { name, value } = e.target;
  setForm({ ...form, [name]: value });
};

// Alternative: computed property
const handleChange = (e) => {
  setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
};
```

#### Array Operations
```javascript
const [items, setItems] = useState([]);

// Add item
const addItem = (item) => setItems([...items, item]);
const addItemAlt = (item) => setItems(prev => [...prev, item]);

// Remove item
const removeItem = (id) => setItems(items.filter(i => i.id !== id));

// Update item
const updateItem = (id, updates) => 
  setItems(items.map(i => i.id === id ? { ...i, ...updates } : i));

// Clear all
const clearItems = () => setItems([]);
```

### Key Takeaway
> Always use **callback form** when new state depends on previous state, especially in async operations or loops.

---

## useEffect

### Three Essential Patterns

```javascript
// Pattern 1: Run EVERY render (usually a bug!)
useEffect(() => {
  console.log('Runs after every render');
}); // ⚠️ No dependency array - INFINITE LOOP RISK

// Pattern 2: Run ONCE on mount
useEffect(() => {
  console.log('Runs once when component mounts');
  return () => console.log('Cleanup on unmount');
}, []); // ✅ Empty dependency array

// Pattern 3: Run when dependencies change
useEffect(() => {
  console.log('Runs when userId changes');
}, [userId]); // ✅ With dependencies
```

### Common Use Cases

#### Fetch on Mount
```javascript
useEffect(() => {
  async function fetchData() {
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      setData(data);
    } catch (error) {
      setError(error.message);
    }
  }
  fetchData();
}, []); // Only runs once
```

#### Fetch When Prop Changes
```javascript
useEffect(() => {
  if (!userId) return; // Guard clause
  
  setLoading(true);
  fetch(`/api/users/${userId}`)
    .then(res => res.json())
    .then(data => {
      setUser(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
}, [userId]); // Re-fetch when userId changes
```

#### Event Listeners with Cleanup
```javascript
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
  
  window.addEventListener('resize', handleResize);
  
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

#### Timers with Cleanup
```javascript
useEffect(() => {
  const timer = setInterval(() => {
    setCount(c => c + 1);
  }, 1000);
  
  return () => clearInterval(timer);
}, []);
```

#### Focus Input on Error
```javascript
const inputRef = useRef(null);

useEffect(() => {
  if (error) {
    inputRef.current?.focus();
  }
}, [error]);
```

### Dependency Array Rules

```javascript
// ✅ Include ALL values from component scope used inside effect
useEffect(() => {
  console.log(userId, userName);
}, [userId, userName]); // Both must be in deps

// ❌ Missing dependencies (ESLint will warn)
useEffect(() => {
  console.log(userId);
}, []); // BAD - userId missing

// ✅ Functions in dependencies (use useCallback)
const fetchUser = useCallback(async () => {
  const data = await fetch(`/api/users/${userId}`);
  return data.json();
}, [userId]);

useEffect(() => {
  fetchUser().then(setUser);
}, [fetchUser]); // Safe - fetchUser is memoized
```

### Key Takeaway
> **No deps** = every render, **[] = once**, **[deps] = when deps change**

---

## useRef

### Use Case 1: DOM Access

```javascript
function FocusInput() {
  const inputRef = useRef(null);
  
  const handleFocus = () => {
    inputRef.current.focus();
  };
  
  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={handleFocus}>Focus</button>
    </>
  );
}
```

### Use Case 2: Mutable Values (No Re-render)

```javascript
function Timer() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);
  
  const start = () => {
    if (intervalRef.current) return;
    
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
  };
  
  const stop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };
  
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
```

### Use Case 3: Previous Value

```javascript
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

// Usage
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  
  return <div>Now: {count}, Before: {prevCount}</div>;
}
```

### Key Takeaway
> Use **useRef** for DOM access and values that persist across renders WITHOUT causing re-renders.

---

## useCallback

### When to Use
- Passing functions to optimized child components
- Dependencies in useEffect
- Preventing unnecessary re-renders

```javascript
// ❌ Without useCallback
function Parent() {
  const handleClick = () => console.log('clicked');
  return <Child onClick={handleClick} />; // Child re-renders
}

// ✅ With useCallback
function Parent() {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
  return <Child onClick={handleClick} />; // Child stable
}
```

### Common Patterns

```javascript
// Callback with dependencies
const handleFilter = useCallback((searchTerm) => {
  const filtered = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFiltered(filtered);
}, [items]);

// Event handlers
const handleSubmit = useCallback((e) => {
  e.preventDefault();
  onSubmit(formData);
}, [formData, onSubmit]);
```

---

## useMemo

### When to Use
- Expensive calculations
- Creating objects/arrays for dependencies
- Filtering/sorting large lists

```javascript
// ❌ Without useMemo - recalculates every render
function ProductList({ products, maxPrice }) {
  const filtered = products.filter(p => p.price <= maxPrice);
  return <div>{filtered.map(p => <Product {...p} />)}</div>;
}

// ✅ With useMemo - only when deps change
function ProductList({ products, maxPrice }) {
  const filtered = useMemo(() => {
    return products.filter(p => p.price <= maxPrice);
  }, [products, maxPrice]);
  
  return <div>{filtered.map(p => <Product {...p} />)}</div>;
}
```

### Common Patterns

```javascript
// Sorting
const sortedItems = useMemo(() => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}, [items]);

// Complex calculations
const stats = useMemo(() => {
  const sum = data.reduce((acc, val) => acc + val, 0);
  return { sum, avg: sum / data.length, max: Math.max(...data) };
}, [data]);
```

---

## Common Patterns

### Form Handling
```javascript
const [form, setForm] = useState({ name: '', email: '' });
const [errors, setErrors] = useState({});

const handleChange = (e) => {
  const { name, value } = e.target;
  setForm(prev => ({ ...prev, [name]: value }));
  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: '' }));
  }
};

const handleSubmit = (e) => {
  e.preventDefault();
  const newErrors = validate(form);
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
  // Submit
};
```

### API Fetching
```javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error('Failed');
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
```

---

## Pitfalls to Avoid

### 1. State Mutation
```javascript
// ❌ BAD
user.name = 'John';
items.push(newItem);

// ✅ GOOD
setUser({ ...user, name: 'John' });
setItems([...items, newItem]);
```

### 2. Missing Dependencies
```javascript
// ❌ BAD
useEffect(() => {
  console.log(userId);
}, []); // Missing userId

// ✅ GOOD
useEffect(() => {
  console.log(userId);
}, [userId]);
```

### 3. Stale Closures
```javascript
// ❌ BAD
setTimeout(() => setCount(count + 1), 1000);

// ✅ GOOD
setTimeout(() => setCount(c => c + 1), 1000);
```

---

## Quick Reference

| Hook | Purpose | Re-render? | Use When |
|------|---------|------------|----------|
| useState | Component data | Yes | Form inputs, toggles |
| useEffect | Side effects | No | API calls, subscriptions |
| useRef | DOM/persistent values | No | Focus, timers, previous values |
| useCallback | Memoize functions | No | Prevent child re-renders |
| useMemo | Memoize values | No | Expensive calculations |

---

**Next**: Component Lifecycle & Patterns (`02-component-lifecycle.md`)