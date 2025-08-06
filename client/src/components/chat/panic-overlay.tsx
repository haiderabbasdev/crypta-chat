import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

export default function PanicOverlay() {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Redirect to blank page when countdown reaches 0
          window.location.href = "about:blank";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-red-900 bg-opacity-95 flex items-center justify-center z-50">
      <div className="text-center animate-fade-in">
        <div className="text-6xl text-red-400 mb-4">
          <Flame className="w-24 h-24 mx-auto animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold text-red-400 mb-2 font-mono">
          🔥 PANIC MODE ACTIVATED
        </h2>
        <p className="text-red-300 text-lg font-mono">
          All data cleared. Session terminated.
        </p>
        <p className="text-red-400 text-sm mt-4 font-mono">
          Window will close in {countdown} second{countdown !== 1 ? 's' : ''}...
        </p>
        
        {/* Terminal-style progress bar */}
        <div className="mt-6 w-64 mx-auto">
          <div className="bg-red-800 rounded-full h-2">
            <div 
              className="bg-red-400 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${((3 - countdown) / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}