import { useEffect, useState } from "react";

export const usePanicMode = () => {
  const [isPanicActivated, setIsPanicActivated] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+Shift+X
      if (event.ctrlKey && event.shiftKey && event.key === 'X') {
        event.preventDefault();
        activatePanic();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activatePanic = () => {
    // Clear all local storage
    localStorage.clear();
    sessionStorage.clear();

    // Clear all indexedDB
    if ('indexedDB' in window) {
      window.indexedDB.databases?.().then((databases) => {
        databases.forEach((db) => {
          if (db.name) {
            window.indexedDB.deleteDatabase(db.name);
          }
        });
      });
    }

    // Set panic state
    setIsPanicActivated(true);

    // Close window after 3 seconds
    setTimeout(() => {
      window.close();
    }, 3000);
  };

  return {
    isPanicActivated,
    activatePanic
  };
};