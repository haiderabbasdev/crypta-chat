import { useEffect } from "react";
import { useLocation } from "wouter";
import { useChat } from "@/contexts/chat-context";
import { useTheme } from "@/contexts/theme-context";
import { usePanicMode } from "@/hooks/use-panic-mode";
import ChatWindow from "@/components/chat/chat-window";
import MessageInput from "@/components/chat/message-input";
import UsersList from "@/components/chat/users-list";
import SettingsModal from "@/components/chat/settings-modal";
import PanicOverlay from "@/components/chat/panic-overlay";
import { Button } from "@/components/ui/button";
import { Shield, Settings, AlertTriangle } from "lucide-react";

export default function ChatPage() {
  const [, setLocation] = useLocation();
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
      {/* Animated Background */}
      <div className="absolute inset-0 bg-black">
        {/* Matrix-style grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        {/* Subtle floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-1 h-1 bg-green-500 opacity-30 animate-pulse"></div>
          <div className="absolute top-20 right-20 w-1 h-1 bg-green-400 opacity-20 animate-ping"></div>
          <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-green-600 opacity-25 animate-pulse"></div>
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-green-300 opacity-30 animate-ping"></div>
          <div className="absolute bottom-10 right-10 w-1 h-1 bg-green-500 opacity-20 animate-pulse"></div>
        </div>
      </div>
      {/* Settings button in top-right corner */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={activatePanic}
          className="text-red-500 hover:text-red-400 border-red-500 hover:border-red-400 font-mono"
          title="Ctrl+Shift+X"
        >
          <AlertTriangle className="w-4 h-4 mr-1" />
          PANIC
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(true)}
          className="text-green-500 hover:text-green-700"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Main Chat Interface */}
      <main className="flex-1 flex overflow-hidden relative z-10">
        <div className="flex-1 flex flex-col">
          <ChatWindow />
          <MessageInput />
        </div>
        <UsersList />
      </main>

      {/* Modals */}
      {showSettings && <SettingsModal />}
      {isPanicActivated && <PanicOverlay />}
    </div>
  );
}
