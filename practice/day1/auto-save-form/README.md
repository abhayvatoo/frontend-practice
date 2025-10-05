# Auto-Save Form Exercise

## Learning Objectives

- Master useEffect with cleanup functions
- Implement debouncing pattern with timers
- Work with localStorage API
- Use useRef for mutable values (timer IDs)
- Handle loading/saving states
- Understand cleanup to prevent memory leaks

---

## Requirements

Build a form that automatically saves to localStorage with the following features:

### Functional Requirements

1. **Form Fields**
    - Title (input field)
    - Content (textarea)
    - Both fields are controlled components

2. **Auto-Save Behavior**
    - Save to localStorage **2 seconds after user stops typing**
    - Don't save on every keystroke (debouncing)
    - Show "Saving..." indicator while saving
    - Show "Saved!" indicator after successful save
    - Show "Unsaved changes" when form is modified

3. **Load Saved Data**
    - On component mount, load data from localStorage
    - If no saved data, start with empty form
    - Show "Loaded from storage" message on mount if data exists

4. **Clear Functionality**
    - "Clear" button to reset form
    - Also clear localStorage
    - Show confirmation before clearing

5. **Edge Cases**
    - Don't save empty form
    - Clear timer on unmount (cleanup)
    - Handle localStorage errors gracefully
    - Show last saved timestamp

---

## Component Structure

```
AutoSaveForm
├── FormStatus (shows save status)
├── FormFields (title and content inputs)
└── FormActions (clear button)
```

---

## Expected State Shape

```javascript
{
  form: { title: '', content: '' },
  status: 'idle' | 'saving' | 'saved' | 'unsaved',
  lastSaved: timestamp
}
```

---

## Key Concepts Practiced

### 1. Debouncing with useEffect + useRef

```javascript
const timerRef = useRef(null);

useEffect(() => {
  // Clear previous timer
  clearTimeout(timerRef.current);
  
  // Set new timer
  timerRef.current = setTimeout(() => {
    saveToLocalStorage();
  }, 2000);
  
  // Cleanup on unmount or when dependencies change
  return () => clearTimeout(timerRef.current);
}, [form]);
```

### 2. localStorage Operations

```javascript
// Save
localStorage.setItem('formData', JSON.stringify(data));

// Load
const saved = localStorage.getItem('formData');
const data = saved ? JSON.parse(saved) : null;

// Clear
localStorage.removeItem('formData');
```

### 3. Load on Mount

```javascript
useEffect(() => {
  const saved = localStorage.getItem('formData');
  if (saved) {
    setForm(JSON.parse(saved));
    setStatus('saved');
  }
}, []); // Empty deps = run once on mount
```

### 4. Status Management

```javascript
const [status, setStatus] = useState('idle');

// When user types
setStatus('unsaved');

// When saving starts
setStatus('saving');
setTimeout(() => setStatus('saved'), 500);
```

---

## Common Mistakes to Avoid

❌ **Not clearing timer on cleanup**
```javascript
useEffect(() => {
  setTimeout(() => save(), 2000);
  // Missing return cleanup!
});
```

❌ **Saving on every keystroke**
```javascript
const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
  saveToLocalStorage(); // Too frequent!
};
```

❌ **Not handling JSON parse errors**
```javascript
const data = JSON.parse(localStorage.getItem('data'));
// What if data is invalid JSON?
```

❌ **Missing dependencies in useEffect**
```javascript
useEffect(() => {
  console.log(form); // Using form but not in deps
}, []); // Missing form!
```

✅ **Correct approaches shown in solution.jsx**

---

## Testing Checklist

- [ ] Type in form - should show "Unsaved changes"
- [ ] Wait 2 seconds - should show "Saving..." then "Saved!"
- [ ] Refresh page - data should persist
- [ ] Type again before 2 seconds - timer should reset
- [ ] Clear button - should clear form and localStorage
- [ ] Close tab and reopen - data should be there
- [ ] Check for memory leaks (timer cleanup)
- [ ] Empty form should not save

---

## Advanced Features (Stretch Goals)

1. **Version History**
    - Keep last 5 versions in localStorage
    - Add "Restore Previous" button

2. **Visual Timer**
    - Show countdown: "Saving in 2...1..."
    - Progress bar for visual feedback

3. **Conflict Detection**
    - Detect if localStorage changed in another tab
    - Show warning and merge options

4. **Auto-save toggle**
    - Let user disable auto-save
    - Manual "Save" button when disabled

5. **Character count**
    - Show character/word count
    - Warn when approaching limits

---

## Time Budget

- Setup & basic structure: 5 min
- Form state management: 5 min
- localStorage load/save: 5 min
- Debouncing implementation: 10 min
- Status indicators: 5 min
- Testing & edge cases: 5 min

---

## Implementation Hints

### Debouncing Pattern
```javascript
// Key insight: Clear old timer before setting new one
useEffect(() => {
  const timer = setTimeout(() => {
    // Do the thing
  }, delay);
  
  return () => clearTimeout(timer);
}, [dependency]);
```

### Status Flow
```
idle → user types → unsaved → 
wait 2s → saving → 
save complete → saved
```

### LocalStorage Error Handling
```javascript
try {
  localStorage.setItem(key, value);
} catch (e) {
  // Handle quota exceeded, private browsing, etc.
  console.error('Cannot save:', e);
}
```

---

## Files

- `AutoSaveForm.jsx` - Your implementation
- `solution.jsx` - Reference solution
- `README.md` - This file

---

## Learning Resources

- [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [React Docs: useEffect cleanup](https://react.dev/reference/react/useEffect#cleanup-function)
- [Debouncing in React](https://www.freecodecamp.org/news/debouncing-explained/)

---

## Next Steps

After completing:
1. Compare with solution
2. Test all edge cases
3. Add learnings about useEffect cleanup to notes
4. Understand debouncing pattern thoroughly
5. Move to Day 2 exercises

---

**Status**: Not Started / In Progress / Completed  
**Date Started**:  
**Time Taken**:  
**Difficulty Rating**:  
**Key Challenges**: