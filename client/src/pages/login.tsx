import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateUsername } from "@/lib/username-generator";
import { useTheme } from "@/contexts/theme-context";
import { Shield, Terminal, Lock, Settings, Globe, Clock, Zap } from "lucide-react";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [room, setRoom] = useState("main");
  const [encryptionLevel, setEncryptionLevel] = useState("aes-256");
  const [serverRegion, setServerRegion] = useState("auto");
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
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme} relative overflow-hidden`}>
      {/* Animated Background */}
      <div className="absolute inset-0 bg-black">
        {/* Matrix-style grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-2 h-2 bg-green-500 opacity-60 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-green-400 opacity-40 animate-ping"></div>
          <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-green-600 opacity-50 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-green-300 opacity-60 animate-ping"></div>
          <div className="absolute bottom-20 right-10 w-2 h-2 bg-green-500 opacity-40 animate-pulse"></div>
          
          {/* Scanning lines */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-30 animate-pulse"></div>
          </div>
          
          {/* Vertical scanning line */}
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-green-500 to-transparent opacity-20 animate-pulse"></div>
        </div>
        
        {/* Circuit-like patterns */}
        <div className="absolute top-10 right-10 w-20 h-20 border border-green-700 opacity-20 rotate-45"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 border border-green-600 opacity-15 rotate-12"></div>
        <div className="absolute top-1/2 left-20 w-12 h-12 border border-green-500 opacity-25 -rotate-45"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
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
        <div className="bg-black/80 backdrop-blur-sm border border-green-700 rounded-lg p-6 shadow-2xl shadow-green-500/20">
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
              className="w-full bg-green-500 text-black hover:bg-green-400 font-semibold font-mono"
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
              className="w-full bg-green-500 text-black hover:bg-green-400 font-semibold font-mono"
            >
              <Lock className="w-4 h-4 mr-2" />
              INITIALIZE SECURE SESSION
            </Button>
          )}

          <div className="mt-4 text-center">
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-green-700 hover:text-green-500 text-sm transition-colors font-mono flex items-center justify-center mx-auto">
                  <Settings className="w-3 h-3 mr-1" />
                  Advanced Options
                </button>
              </DialogTrigger>
              <DialogContent className="bg-black border-green-700 text-green-500 font-mono">
                <DialogHeader>
                  <DialogTitle className="text-green-500 font-mono">Security Configuration</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-green-700 mb-2">
                      <Globe className="w-4 h-4 inline mr-2" />
                      Chat Room
                    </label>
                    <Select value={room} onValueChange={setRoom}>
                      <SelectTrigger className="bg-black border-green-700 text-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-green-700">
                        <SelectItem value="main">Main Channel</SelectItem>
                        <SelectItem value="secure">Secure Channel</SelectItem>
                        <SelectItem value="private">Private Channel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-green-700 mb-2">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Encryption Level
                    </label>
                    <Select value={encryptionLevel} onValueChange={setEncryptionLevel}>
                      <SelectTrigger className="bg-black border-green-700 text-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-green-700">
                        <SelectItem value="aes-128">AES-128 (Fast)</SelectItem>
                        <SelectItem value="aes-256">AES-256 (Standard)</SelectItem>
                        <SelectItem value="aes-512">AES-512 (Maximum)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-green-700 mb-2">
                      <Zap className="w-4 h-4 inline mr-2" />
                      Server Region
                    </label>
                    <Select value={serverRegion} onValueChange={setServerRegion}>
                      <SelectTrigger className="bg-black border-green-700 text-green-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-green-700">
                        <SelectItem value="auto">Auto-Select</SelectItem>
                        <SelectItem value="us-east">US East</SelectItem>
                        <SelectItem value="us-west">US West</SelectItem>
                        <SelectItem value="eu-central">EU Central</SelectItem>
                        <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-4 border-t border-green-700">
                    <div className="text-xs text-green-700 space-y-1">
                      <div>• End-to-end encryption enabled</div>
                      <div>• Zero-knowledge architecture</div>
                      <div>• Perfect forward secrecy</div>
                      <div>• Quantum-resistant algorithms</div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
