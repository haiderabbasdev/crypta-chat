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
    // Set panic state first
    setIsPanicActivated(true);

    // Clear all data after a short delay
    setTimeout(() => {
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

      // Redirect to blank page after 3 seconds
      setTimeout(() => {
        window.location.href = "about:blank";
      }, 2000);
    }, 500);
  };

  return {
    isPanicActivated,
    activatePanic
  };
};