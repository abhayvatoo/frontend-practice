/**
 * Common React Patterns - Copy & Paste Templates
 * Use these as starting points for common scenarios
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ============================================
// PATTERN 1: FORM WITH VALIDATION
// ============================================

function FormWithValidation() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!form.password) newErrors.password = "Password is required";
    if (form.password && form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      // Submit form
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form submitted:", form);
      setForm({ name: "", email: "", password: "" });
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} />
      {errors.name && <span className="error">{errors.name}</span>}

      <input name="email" value={form.email} onChange={handleChange} />
      {errors.email && <span className="error">{errors.email}</span>}

      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
      />
      {errors.password && <span className="error">{errors.password}</span>}

      <button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

// ============================================
// PATTERN 2: API DATA FETCHING
// ============================================

function DataFetching({ userId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/users/${userId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();

        if (!cancelled) {
          setData(json);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data found</div>;

  return <div>{JSON.stringify(data)}</div>;
}

// ============================================
// PATTERN 3: LIST MANAGEMENT (CRUD)
// ============================================

function ListManagement() {
  const [items, setItems] = useState([
    { id: 1, text: "Item 1", completed: false },
    { id: 2, text: "Item 2", completed: true },
  ]);
  const [inputValue, setInputValue] = useState("");

  // Create
  const addItem = () => {
    if (!inputValue.trim()) return;

    const newItem = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };

    setItems([...items, newItem]);
    setInputValue("");
  };

  // Update
  const updateItem = (id, updates) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  // Toggle
  const toggleItem = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  // Delete
  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Filter
  const activeItems = items.filter((item) => !item.completed);
  const completedItems = items.filter((item) => item.completed);

  return (
    <div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && addItem()}
      />
      <button onClick={addItem}>Add</button>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleItem(item.id)}
            />
            <span>{item.text}</span>
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// PATTERN 4: DEBOUNCED SEARCH
// ============================================

function DebouncedSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchTimerRef = useRef(null);

  useEffect(() => {
    // Clear previous timer
    clearTimeout(searchTimerRef.current);

    if (!searchTerm) {
      setResults([]);
      return;
    }

    setSearching(true);

    // Set new timer
    searchTimerRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${searchTerm}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => clearTimeout(searchTimerRef.current);
  }, [searchTerm]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      {searching && <span>Searching...</span>}
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// PATTERN 5: PAGINATION
// ============================================

function PaginatedList({ itemsPerPage = 10 }) {
  const [allItems] = useState(
    Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
    })),
  );
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allItems.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allItems.slice(startIndex, startIndex + itemsPerPage);
  }, [allItems, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div>
      <ul>
        {currentItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>

      <div>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// ============================================
// PATTERN 6: MODAL/DIALOG
// ============================================

function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "500px",
          width: "90%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

// ============================================
// PATTERN 7: TABS
// ============================================

function Tabs() {
  const [activeTab, setActiveTab] = useState("tab1");

  const tabs = [
    { id: "tab1", label: "Tab 1", content: "Content 1" },
    { id: "tab2", label: "Tab 2", content: "Content 2" },
    { id: "tab3", label: "Tab 3", content: "Content 3" },
  ];

  return (
    <div>
      <div style={{ display: "flex", borderBottom: "2px solid #ddd" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 20px",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid blue" : "none",
              background: activeTab === tab.id ? "#f0f0f0" : "transparent",
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "20px" }}>
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}

// ============================================
// PATTERN 8: INFINITE SCROLL
// ============================================

function InfiniteScroll() {
  const [items, setItems] = useState(Array.from({ length: 20 }, (_, i) => i));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);

    setTimeout(() => {
      const newItems = Array.from({ length: 20 }, (_, i) => items.length + i);

      setItems((prev) => [...prev, ...newItems]);
      setLoading(false);

      if (items.length >= 100) {
        setHasMore(false);
      }
    }, 1000);
  }, [items, loading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div>
      <ul>
        {items.map((item) => (
          <li key={item}>Item {item}</li>
        ))}
      </ul>

      {hasMore && (
        <div ref={loaderRef} style={{ padding: "20px", textAlign: "center" }}>
          {loading ? "Loading..." : "Scroll for more"}
        </div>
      )}
    </div>
  );
}

// ============================================
// PATTERN 9: DRAG AND DROP (Simple)
// ============================================

function DragAndDrop() {
  const [items, setItems] = useState(["Item 1", "Item 2", "Item 3"]);
  const [dragging, setDragging] = useState(null);

  const handleDragStart = (index) => {
    setDragging(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();

    if (dragging === null || dragging === index) return;

    const newItems = [...items];
    const draggedItem = newItems[dragging];
    newItems.splice(dragging, 1);
    newItems.splice(index, 0, draggedItem);

    setItems(newItems);
    setDragging(index);
  };

  const handleDragEnd = () => {
    setDragging(null);
  };

  return (
    <ul>
      {items.map((item, index) => (
        <li
          key={index}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          style={{
            padding: "10px",
            margin: "5px 0",
            background: dragging === index ? "#e0e0e0" : "white",
            cursor: "move",
            border: "1px solid #ddd",
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

// ============================================
// PATTERN 10: LOCAL STORAGE SYNC
// ============================================

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  const setStoredValue = (newValue) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  };

  return [value, setStoredValue];
}

// Usage
function LocalStorageExample() {
  const [name, setName] = useLocalStorage("name", "");

  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}

export {
  FormWithValidation,
  DataFetching,
  ListManagement,
  DebouncedSearch,
  PaginatedList,
  Modal,
  Tabs,
  InfiniteScroll,
  DragAndDrop,
  useLocalStorage,
  LocalStorageExample,
};
