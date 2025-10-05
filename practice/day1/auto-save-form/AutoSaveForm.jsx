import { useState, useEffect, useRef } from "react";

/**
 * Auto-Save Form - Complete Solution
 * Demonstrates: useEffect, useRef, localStorage, debouncing, cleanup
 */

const STORAGE_KEY = "autoSaveFormData";
const SAVE_DELAY = 2000; // 2 seconds

function AutoSaveForm() {
  const [form, setForm] = useState({ title: "", content: "" });
  const [status, setStatus] = useState("idle");
  const [lastSaved, setLastSaved] = useState(null);

  // Use ref to store timer ID (doesn't cause re-render)
  const saveTimerRef = useRef(null);
  const statusTimerRef = useRef(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setForm(data.form);
        setLastSaved(data.timestamp);
        setStatus("saved");

        // Show "loaded" message briefly
        setTimeout(() => setStatus("saved"), 2000);
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  }, []); // Empty deps = run once on mount

  // Auto-save when form changes (with debouncing)
  useEffect(() => {
    // Don't save if form is empty
    if (!form.title && !form.content) {
      return;
    }

    // Show "unsaved" immediately when user types
    setStatus("unsaved");

    // Clear previous timer
    clearTimeout(saveTimerRef.current);

    // Set new timer for auto-save
    saveTimerRef.current = setTimeout(() => {
      saveToLocalStorage();
    }, SAVE_DELAY);

    // Cleanup: clear timer when component unmounts or form changes
    return () => {
      clearTimeout(saveTimerRef.current);
    };
  }, [form]); // Re-run when form changes

  // Save to localStorage
  const saveToLocalStorage = () => {
    try {
      setStatus("saving");

      const data = {
        form,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setLastSaved(data.timestamp);

      // Show "saving" for at least 500ms for visual feedback
      clearTimeout(statusTimerRef.current);
      statusTimerRef.current = setTimeout(() => {
        setStatus("saved");
      }, 500);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      setStatus("error");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Clear form and localStorage
  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all data?")) {
      setForm({ title: "", content: "" });
      setLastSaved(null);
      setStatus("idle");

      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
    }
  };

  // Manual save (optional)
  const handleManualSave = () => {
    clearTimeout(saveTimerRef.current);
    saveToLocalStorage();
  };

  return (
    <div style={styles.container}>
      <h1>Auto-Save Form Demo</h1>

      <FormStatus status={status} lastSaved={lastSaved} />

      <div style={styles.form}>
        <div style={styles.field}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter title..."
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Enter content..."
            rows={10}
            style={styles.textarea}
          />
        </div>

        <div style={styles.actions}>
          <button onClick={handleClear} style={styles.clearButton}>
            Clear Form
          </button>
          <button onClick={handleManualSave} style={styles.saveButton}>
            Save Now
          </button>
        </div>
      </div>

      <FormPreview form={form} />
    </div>
  );
}

/**
 * Status Indicator Component
 * Shows current save status
 */
function FormStatus({ status, lastSaved }) {
  const getStatusInfo = () => {
    switch (status) {
      case "saving":
        return { text: "💾 Saving...", color: "#2196F3" };
      case "saved":
        return { text: "✅ All changes saved", color: "#4CAF50" };
      case "unsaved":
        return { text: "⚠️ Unsaved changes", color: "#FF9800" };
      case "error":
        return { text: "❌ Error saving", color: "#F44336" };
      default:
        return { text: "📝 Start typing...", color: "#999" };
    }
  };

  const statusInfo = getStatusInfo();

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null;

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "just now";
    if (diffMins === 1) return "1 minute ago";
    if (diffMins < 60) return `${diffMins} minutes ago`;

    return date.toLocaleString();
  };

  return (
    <div style={{ ...styles.status, color: statusInfo.color }}>
      <div style={styles.statusText}>{statusInfo.text}</div>
      {lastSaved && status === "saved" && (
        <div style={styles.timestamp}>
          Last saved: {formatTimestamp(lastSaved)}
        </div>
      )}
    </div>
  );
}

/**
 * Preview Component
 * Shows live preview of form data
 */
function FormPreview({ form }) {
  if (!form.title && !form.content) {
    return null;
  }

  return (
    <div style={styles.preview}>
      <h3>Preview</h3>
      <div style={styles.previewContent}>
        {form.title && <h2>{form.title}</h2>}
        {form.content && (
          <p style={{ whiteSpace: "pre-wrap" }}>{form.content}</p>
        )}
      </div>
      <div style={styles.stats}>
        <span>Characters: {form.content.length}</span>
        <span>Words: {form.content.split(/\s+/).filter(Boolean).length}</span>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "system-ui, sans-serif",
  },
  status: {
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "8px",
    backgroundColor: "#f5f5f5",
    textAlign: "center",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  },
  statusText: {
    fontSize: "16px",
    marginBottom: "5px",
  },
  timestamp: {
    fontSize: "12px",
    opacity: 0.7,
    marginTop: "5px",
  },
  form: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  field: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    border: "2px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",
    marginTop: "5px",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    border: "2px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",
    marginTop: "5px",
    fontFamily: "system-ui, sans-serif",
    resize: "vertical",
  },
  actions: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
    marginTop: "20px",
  },
  clearButton: {
    padding: "10px 20px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  saveButton: {
    padding: "10px 20px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  preview: {
    marginTop: "30px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  previewContent: {
    padding: "15px",
    backgroundColor: "white",
    borderRadius: "4px",
    minHeight: "100px",
    marginTop: "10px",
  },
  stats: {
    marginTop: "15px",
    display: "flex",
    gap: "20px",
    fontSize: "12px",
    color: "#666",
  },
};

export default AutoSaveForm;
