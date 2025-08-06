import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useChat } from "@/contexts/chat-context";
import { useTheme } from "@/contexts/theme-context";
import { usePanicMode } from "@/hooks/use-panic-mode";
import ChatWindow from "@/components/chat/chat-window";
import MessageInput from "@/components/chat/message-input";
import UsersList from "@/components/chat/users-list";
import SettingsModal from "@/components/chat/settings-modal";
import PanicOverlay from "@/components/chat/panic-overlay";
import MultiUserGuide from "@/components/multi-user-guide";
import { Button } from "@/components/ui/button";
import { Shield, Settings, AlertTriangle, Users } from "lucide-react";

export default function ChatPage() {
  const [, setLocation] = useLocation();
  const [showMultiUserGuide, setShowMultiUserGuide] = useState(false);
  const { theme } = useTheme();
  const { 
    user, 
    connectionStatus, 
    encryptionStatus, 
    showSettings, 
    setShowSettings,
    connectToChat 
  } = useChat();
  const { isPanicActivated, activatePanic } = usePanicMode();

  useEffect(() => {
    const savedUsername = localStorage.getItem("crypta_username");
    if (!savedUsername) {
      setLocation("/");
      return;
    }

    connectToChat(savedUsername, "main");
  }, [connectToChat, setLocation]);

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme}`}>
        <div className="text-center">
          <div className="text-green-500 text-lg font-mono mb-2">
            Establishing secure connection...
          </div>
          <div className="animate-pulse">
            <span className="text-green-500 animate-blink">|</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex ${theme} relative overflow-hidden`}>
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 bg-background">
        {/* Dynamic grid based on theme */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: theme === 'theme-love' ? `
              linear-gradient(rgba(300, 100%, 70%, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(300, 100%, 70%, 0.1) 1px, transparent 1px)
            ` : `
              linear-gradient(rgba(34, 197, 94, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        {/* Dynamic floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          {theme === 'theme-love' ? (
            <>
              <div className="absolute top-10 left-10 w-2 h-2 bg-purple-400 opacity-40 animate-pulse"></div>
              <div className="absolute top-20 right-20 w-1 h-1 bg-pink-400 opacity-30 animate-ping"></div>
              <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-purple-500 opacity-35 animate-pulse"></div>
              <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-pink-300 opacity-40 animate-ping"></div>
              <div className="absolute bottom-10 right-10 w-2 h-2 bg-purple-400 opacity-30 animate-pulse"></div>
              
              {/* Heart-shaped elements for love theme */}
              <div className="absolute top-1/4 left-1/3 w-3 h-3 opacity-20 animate-pulse" style={{
                background: 'radial-gradient(circle, #ff69b4, transparent)',
                clipPath: 'polygon(50% 90%, 20% 30%, 80% 30%)'
              }}></div>
              <div className="absolute bottom-1/3 right-1/4 w-2 h-2 opacity-15 animate-ping" style={{
                background: 'radial-gradient(circle, #da70d6, transparent)',
                clipPath: 'polygon(50% 90%, 20% 30%, 80% 30%)'
              }}></div>
            </>
          ) : (
            <>
              <div className="absolute top-10 left-10 w-1 h-1 bg-green-500 opacity-30 animate-pulse"></div>
              <div className="absolute top-20 right-20 w-1 h-1 bg-green-400 opacity-20 animate-ping"></div>
              <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-green-600 opacity-25 animate-pulse"></div>
              <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-green-300 opacity-30 animate-ping"></div>
              <div className="absolute bottom-10 right-10 w-1 h-1 bg-green-500 opacity-20 animate-pulse"></div>
            </>
          )}
        </div>
        
        {/* Theme-specific scanning lines */}
        {theme === 'theme-love' && (
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-40 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-20 animate-pulse"></div>
            <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-15 animate-pulse"></div>
          </div>
        )}
      </div>
      {/* Action buttons in top-left corner to avoid overlap */}
      <div className="absolute top-4 left-4 z-50 flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            console.log('INVITE button clicked!');
            setShowMultiUserGuide(true);
          }}
          className="text-blue-400 hover:text-blue-300 bg-black/70 border border-blue-500/30 backdrop-blur-sm font-mono"
          title="Invite Users"
        >
          <Users className="w-4 h-4 mr-1" />
          INVITE
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={activatePanic}
          className="text-red-500 hover:text-red-400 border-red-500 hover:border-red-400 font-mono bg-black/70 backdrop-blur-sm"
          title="Ctrl+Shift+X"
        >
          <AlertTriangle className="w-4 h-4 mr-1" />
          PANIC
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(true)}
          className="text-green-500 hover:text-green-700 bg-black/70 border border-green-500/30 backdrop-blur-sm"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Main Chat Interface - Redesigned Layout */}
      <main className="flex-1 flex overflow-hidden relative z-10">
        {/* Left side - Main chat area */}
        <div className="flex-1 flex flex-col bg-black/20 backdrop-blur-sm border-r border-green-500/30">
          {/* Chat header */}
          <div className="bg-black/40 backdrop-blur-sm border-b border-green-500/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h1 className="text-green-500 font-mono text-lg font-bold">CRYPTA_TERMINAL</h1>
                <div className="text-xs text-green-700 font-mono">
                  [{new Date().toISOString().split('T')[0]}]
                </div>
              </div>
              <div className="text-xs text-green-600 font-mono">
                ENCRYPTION: ACTIVE • AES-256-GCM
              </div>
            </div>
          </div>
          
          {/* Chat messages area */}
          <div className="flex-1 relative">
            <ChatWindow />
          </div>
          
          {/* Message input area */}
          <div className="border-t border-green-500/30 bg-black/40 backdrop-blur-sm">
            <MessageInput />
          </div>
        </div>
        
        {/* Right side - Users list */}
        <UsersList />
      </main>

      {/* Modals */}
      {showSettings && <SettingsModal />}
      {showMultiUserGuide && (
        <MultiUserGuide 
          isOpen={showMultiUserGuide} 
          onClose={() => setShowMultiUserGuide(false)} 
        />
      )}
      {isPanicActivated && <PanicOverlay />}
    </div>
  );
}
