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
  const { isPanicMode, activatePanicMode } = usePanicMode();

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
    <div className={`h-screen flex flex-col ${theme}`}>
      {/* Header */}
      <header className="bg-black border-b border-green-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="text-green-500 w-5 h-5" />
            <span className="text-lg font-semibold font-mono text-green-500">
              CRYPTA_TERMINAL_v2.1
            </span>
          </div>
          <div className="text-xs text-green-700 font-mono">
            <span className={connectionStatus === 'connected' ? 'text-green-500' : 'terminal-red'}>
              {connectionStatus.toUpperCase()}
            </span>
            {" | "}
            <span className={encryptionStatus === 'active' ? 'text-green-500' : 'terminal-red'}>
              {encryptionStatus === 'active' ? 'E2E_ENCRYPTED' : 'UNENCRYPTED'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-xs text-green-700 font-mono">
            Session: <span className="text-green-500">{user.username}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={activatePanicMode}
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
      </header>

      {/* Main Chat Interface */}
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          <ChatWindow />
          <MessageInput />
        </div>
        <UsersList />
      </main>

      {/* Modals */}
      {showSettings && <SettingsModal />}
      {isPanicMode && <PanicOverlay />}
    </div>
  );
}
