import { useChat } from "@/contexts/chat-context";
import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings, 
  X, 
  Palette, 
  Shield, 
  User, 
  Shuffle,
  Lock,
  Eye,
  Clock
} from "lucide-react";

export default function SettingsModal() {
  const { setShowSettings, user } = useChat();
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      id: "theme-terminal",
      name: "Terminal",
      description: "Active",
      preview: "bg-black border-green-500",
      active: theme === "theme-terminal"
    },
    {
      id: "theme-glassmorphism",
      name: "Glassmorphism",
      description: "Dark Mode",
      preview: "bg-gradient-to-br from-gray-800 to-gray-900 border-cyan-400",
      active: theme === "theme-glassmorphism"
    },
    {
      id: "theme-love",
      name: "Love",
      description: "Purple Vibes",
      preview: "bg-gradient-to-br from-purple-900 to-pink-900 border-purple-400",
      active: theme === "theme-love"
    },
    {
      id: "theme-light",
      name: "Modern Light",
      description: "Professional",
      preview: "bg-white border-gray-300",
      active: theme === "theme-light"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-green-500 rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-green-800">
          <div className="flex items-center space-x-3">
            <Settings className="text-green-500" />
            <h2 className="text-xl font-semibold text-green-500 font-mono">
              CRYPTA_SETTINGS
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(false)}
            className="text-gray-400 hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          
          {/* Theme Settings */}
          <div>
            <h3 className="text-lg font-semibold text-green-500 mb-4 flex items-center font-mono">
              <Palette className="w-5 h-5 mr-2" />
              THEME_CONFIG
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themes.map((themeOption) => (
                <div
                  key={themeOption.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    themeOption.active
                      ? 'border-green-500 bg-black'
                      : 'border-gray-600 hover:border-cyan-400'
                  }`}
                  onClick={() => {
                    console.log('Setting theme to:', themeOption.id);
                    setTheme(themeOption.id as any);
                  }}
                >
                  <div className="text-center mb-3">
                    <div className={`w-full h-20 rounded border mb-2 relative overflow-hidden ${themeOption.preview}`}>
                      {themeOption.id === "theme-terminal" && (
                        <>
                          <div className="absolute top-1 left-1 text-xs text-green-400">
                            $ crypta --init
                          </div>
                          <div className="absolute bottom-1 left-1 text-xs text-green-400 animate-blink">
                            |
                          </div>
                        </>
                      )}
                      {themeOption.id === "theme-glassmorphism" && (
                        <>
                          <div className="absolute top-1 left-1 text-xs text-cyan-400">
                            Messages
                          </div>
                          <div className="absolute bottom-1 right-1 w-8 h-1 bg-purple-400 rounded" />
                        </>
                      )}
                      {themeOption.id === "theme-love" && (
                        <>
                          <div className="absolute top-1 left-1 text-xs text-purple-400">
                            💜 Love
                          </div>
                          <div className="absolute bottom-1 right-1 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full animate-pulse" />
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-pink-300">
                            ♥
                          </div>
                        </>
                      )}
                      {themeOption.id === "theme-light" && (
                        <>
                          <div className="absolute top-1 left-1 text-xs text-blue-600">
                            Chat
                          </div>
                          <div className="absolute bottom-1 right-1 w-8 h-1 bg-blue-400 rounded" />
                        </>
                      )}
                    </div>
                    <span className="text-green-500 text-sm font-medium font-mono">
                      {themeOption.name}
                    </span>
                    <div className="text-xs text-green-800 mt-1 font-mono">
                      {themeOption.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div>
            <h3 className="text-lg font-semibold text-green-500 mb-4 flex items-center font-mono">
              <Shield className="w-5 h-5 mr-2" />
              SECURITY_CONFIG
            </h3>
            <div className="space-y-4">
              
              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <div className="text-green-500 font-medium font-mono">
                    Panic Mode
                  </div>
                  <div className="text-xs text-gray-400 mt-1 font-mono">
                    Ctrl+Shift+X to instantly clear all data
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-red-400 text-sm font-mono">ENABLED</span>
                  <Switch checked={true} className="data-[state=checked]:bg-red-600" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <div className="text-green-500 font-medium font-mono">
                    Auto-Lock on Startup
                  </div>
                  <div className="text-xs text-gray-400 mt-1 font-mono">
                    Require password to access Crypta
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm font-mono">DISABLED</span>
                  <Switch checked={false} />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <div className="text-green-500 font-medium font-mono">
                    Hidden Vault Chats
                  </div>
                  <div className="text-xs text-gray-400 mt-1 font-mono">
                    Create password-protected secret channels
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-green-500 text-green-500 hover:bg-gray-700 font-mono"
                >
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <div className="text-green-500 font-medium font-mono">
                    Default Message Timer
                  </div>
                  <div className="text-xs text-gray-400 mt-1 font-mono">
                    Auto-destruct messages after
                  </div>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-32 bg-gray-700 border-green-800 text-green-500 font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-green-800">
                    <SelectItem value="30" className="text-green-500 font-mono">30 seconds</SelectItem>
                    <SelectItem value="300" className="text-green-500 font-mono">5 minutes</SelectItem>
                    <SelectItem value="3600" className="text-green-500 font-mono">1 hour</SelectItem>
                    <SelectItem value="0" className="text-green-500 font-mono">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div>
            <h3 className="text-lg font-semibold text-green-500 mb-4 flex items-center font-mono">
              <User className="w-5 h-5 mr-2" />
              ACCOUNT_CONFIG
            </h3>
            <div className="space-y-4">
              
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-green-500 font-medium font-mono">
                    Current Session
                  </div>
                  <span className="text-xs bg-green-500 text-black px-2 py-1 rounded font-mono">
                    ANONYMOUS
                  </span>
                </div>
                <div className="text-sm space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Username:</span>
                    <span className="text-green-500">{user?.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Session ID:</span>
                    <span className="text-green-500 font-mono text-xs">
                      {user?.id?.slice(0, 8)}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Connected:</span>
                    <span className="text-green-500">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              <Button className="w-full p-4 bg-gray-800 hover:bg-gray-700 border border-green-800 hover:border-green-500 transition-all font-mono">
                <div className="flex items-center justify-center space-x-2">
                  <Shuffle className="w-4 h-4 text-green-500" />
                  <span className="text-green-500">Generate New Identity</span>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-green-800 flex justify-between items-center">
          <div className="text-xs text-gray-400 font-mono">
            Crypta v2.1.0 • End-to-End Encrypted
          </div>
          <Button
            onClick={() => setShowSettings(false)}
            className="bg-green-500 text-black hover:bg-green-600 font-mono"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}