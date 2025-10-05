# Day 2: Advanced State Management & Custom Hooks

## Learning Objectives

- Master custom hooks creation and reusability
- Implement `useReducer` for complex state logic
- Learn Context API for global state management
- Practice compound components pattern
- Handle async state with loading/error states
- Understand performance optimization with React.memo

---

## Exercise 1: useReducer Todo App

**Time Budget: 30 minutes**

Build a todo app using `useReducer` instead of `useState` to practice complex state management.

### Requirements

- Add todos with auto-generated IDs
- Toggle completion status
- Delete todos
- Filter by: All, Active, Completed
- Clear all completed todos
- Display todo count
- Persist to localStorage

### State Shape

```javascript
{
  todos: [
    { id: 1, text: "Learn React", completed: false, createdAt: timestamp }
  ],
  filter: 'all' | 'active' | 'completed'
}
```

### Actions to Implement

```javascript
{ type: 'ADD_TODO', payload: text }
{ type: 'TOGGLE_TODO', payload: id }
{ type: 'DELETE_TODO', payload: id }
{ type: 'SET_FILTER', payload: filter }
{ type: 'CLEAR_COMPLETED' }
{ type: 'LOAD_TODOS', payload: todos }
```

**File**: `practice/day2/todo-reducer/TodoApp.jsx`

---

## Exercise 2: Custom Hook - useFetch

**Time Budget: 25 minutes**

Create a reusable custom hook for API calls with loading states.

### Hook Interface

```javascript
const { data, loading, error, refetch } = useFetch(url, options);
```

### Features

- Automatic fetch on mount
- Loading state management
- Error handling with retry capability
- Cleanup to prevent state updates on unmounted components
- Optional manual refetch function

### Test Component

Create a component that uses `useFetch` to display:

- Posts from JSONPlaceholder API
- Loading spinner
- Error message with retry button
- Refresh button

**Files**:

- `practice/day2/custom-hooks/useFetch.js`
- `practice/day2/custom-hooks/PostList.jsx`

---

## Exercise 3: Theme Context with useContext

**Time Budget: 25 minutes**

Implement a theme system using Context API for global state.

### Requirements

- Light/Dark theme toggle
- Theme affects multiple components
- Persist theme preference
- Provide theme context to entire app
- Custom hook `useTheme` for easy consumption

### Context Structure

```javascript
{
  theme: 'light' | 'dark',
  toggleTheme: () => void,
  colors: { primary, secondary, background, text }
}
```

### Components to Style

- Header with theme toggle
- Card components
- Button components

**Files**:

- `practice/day2/context-theme/ThemeContext.jsx`
- `practice/day2/context-theme/ThemeDemo.jsx`

---

## Exercise 4: Compound Components - Modal

**Time Budget: 30 minutes**

Build a flexible Modal component using compound component pattern.

### Usage Example

```jsx
<Modal isOpen={isOpen} onClose={closeModal}>
  <Modal.Header>
    <Modal.Title>Confirm Action</Modal.Title>
    <Modal.CloseButton />
  </Modal.Header>
  <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
  <Modal.Footer>
    <Button onClick={closeModal}>Cancel</Button>
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  </Modal.Footer>
</Modal>
```

### Features

- Compound component pattern
- Portal rendering (document.body)
- Click outside to close
- Escape key to close
- Focus management
- Smooth animations

**File**: `practice/day2/compound-components/Modal.jsx`

---

## Bonus Exercise: Performance Optimization

**Time Budget: 20 minutes**

Optimize a slow component using React.memo, useMemo, and useCallback.

### Scenario

Heavy list component that re-renders frequently with expensive calculations.

### Optimizations to Apply

- React.memo for list items
- useMemo for expensive calculations
- useCallback for event handlers
- Proper dependency arrays

**File**: `practice/day2/performance/OptimizedList.jsx`

---

## Key Concepts Covered

### 1. useReducer Pattern

```javascript
function todoReducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload,
            completed: false,
          },
        ],
      };
    default:
      return state;
  }
}
```

### 2. Custom Hook Structure

```javascript
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch logic with cleanup
  }, [url]);

  return { data, loading, error };
}
```

### 3. Context Pattern

```javascript
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
```

### 4. Compound Components

```javascript
function Modal({ children, isOpen, onClose }) {
  return isOpen
    ? createPortal(
        <div className="modal-backdrop">{children}</div>,
        document.body,
      )
    : null;
}

Modal.Header = function ModalHeader({ children }) {
  return <div className="modal-header">{children}</div>;
};
```

---

## Success Criteria

By the end of Day 2, you should:

- ✅ Understand when to use useReducer vs useState
- ✅ Can create reusable custom hooks
- ✅ Comfortable with Context API for global state
- ✅ Know compound component pattern
- ✅ Understand basic performance optimization techniques

---

## Common Mistakes to Avoid

❌ **Over-using useReducer for simple state**
❌ **Creating context for every piece of state**
❌ **Not cleaning up effects in custom hooks**
❌ **Missing dependency arrays in useEffect**
❌ **Not handling loading/error states properly**

---

## Next Steps

After Day 2:

1. Review each exercise
2. Compare implementations
3. Note performance differences
4. Plan Day 3: Advanced patterns & testing

---

## Assessment Status

**Started**: ****\_\_\_****
**Completed**: ****\_\_\_****
**Time Taken**: ****\_\_\_****
**Difficulty Rating**: ****\_\_\_****
**Key Learnings**: ****\_\_\_****
**Areas for Improvement**: ****\_\_\_****
