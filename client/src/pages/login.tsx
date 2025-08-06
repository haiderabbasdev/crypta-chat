import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { generateUsername } from "@/lib/username-generator";
import { useTheme } from "@/contexts/theme-context";
import { Shield, Terminal, Lock } from "lucide-react";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { theme } = useTheme();

  const handleGenerateUsername = () => {
    setIsGenerating(true);
    // Simulate generation delay for terminal effect
    setTimeout(() => {
      setUsername(generateUsername());
      setIsGenerating(false);
    }, 1500);
  };

  const handleConnect = () => {
    if (username) {
      localStorage.setItem("crypta_username", username);
      setLocation("/chat");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme}`}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-green-500 mr-2" />
            <h1 className="text-4xl font-bold font-mono text-green-500">CRYPTA</h1>
          </div>
          <p className="text-green-700 font-mono">
            Secure Terminal Chat • v2.1.0
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="mb-6">
            <div className="text-green-500 text-sm mb-2 font-mono">
              AUTHENTICATION_PROTOCOL
            </div>
            <div className="bg-black border border-green-700 rounded p-3 font-mono">
              <div className="text-xs text-green-700 mb-2">
                crypta@secure:~$ generate --anonymous-session
              </div>
              {isGenerating ? (
                <>
                  <div className="text-green-500 text-sm">
                    Generating secure identity...
                  </div>
                  <div className="text-green-500 text-sm">
                    Initializing encryption keys...
                  </div>
                  <div className="text-green-500 text-sm flex items-center">
                    Establishing secure channel
                    <span className="ml-2 animate-blink">|</span>
                  </div>
                </>
              ) : username ? (
                <>
                  <div className="text-green-500 text-sm">
                    Identity generated successfully
                  </div>
                  <div className="text-green-500 text-sm">
                    Session ID: {username}
                  </div>
                  <div className="text-green-500 text-sm flex items-center">
                    Ready to connect
                    <span className="ml-2 animate-blink">|</span>
                  </div>
                </>
              ) : (
                <div className="text-green-500 text-sm flex items-center">
                  Awaiting authentication
                  <span className="ml-2 animate-blink">|</span>
                </div>
              )}
            </div>
          </div>

          {!username ? (
            <Button
              onClick={handleGenerateUsername}
              disabled={isGenerating}
              className="w-full bg-text-green-500 text-black hover:bg-text-green-700 font-semibold font-mono"
            >
              {isGenerating ? (
                <>
                  <Terminal className="w-4 h-4 mr-2 animate-spin" />
                  GENERATING IDENTITY...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  GENERATE ANONYMOUS IDENTITY
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleConnect}
              className="w-full bg-text-green-500 text-black hover:bg-text-green-700 font-semibold font-mono"
            >
              <Lock className="w-4 h-4 mr-2" />
              INITIALIZE SECURE SESSION
            </Button>
          )}

          <div className="mt-4 text-center">
            <button 
              className="text-green-700 hover:text-green-500 text-sm transition-colors font-mono"
              onClick={() => {
                // TODO: Implement advanced options
                console.log("Advanced options");
              }}
            >
              Advanced Options
            </button>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-6 text-center text-xs text-green-700 font-mono">
          <div className="flex items-center justify-center space-x-4">
            <span className="flex items-center">
              <Lock className="w-3 h-3 mr-1" />
              End-to-End Encrypted
            </span>
            <span>•</span>
            <span>Zero Data Retention</span>
            <span>•</span>
            <span>No Registration Required</span>
          </div>
        </div>
      </div>
    </div>
  );
}
