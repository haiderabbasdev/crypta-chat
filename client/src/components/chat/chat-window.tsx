import { useEffect, useRef } from "react";
import { useChat } from "@/contexts/chat-context";
import { formatDistance } from "date-fns";
import { Download, Play, Mic, File, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatWindow() {
  const { messages, users, user } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getExpirationLabel = (expiresAt?: number) => {
    if (!expiresAt) return "∞";
    const remaining = Math.max(0, expiresAt - Date.now());
    if (remaining < 60000) return `${Math.ceil(remaining / 1000)}s`;
    if (remaining < 3600000) return `${Math.ceil(remaining / 60000)}m`;
    return `${Math.ceil(remaining / 3600000)}h`;
  };

  const renderMessage = (message: any) => {
    const isOwnMessage = message.senderId === user?.id;
    const messageClass = `animate-fade-in ${
      isOwnMessage ? 'message-bubble outgoing' : 'message-bubble incoming'
    }`;

    const renderContent = () => {
      switch (message.type) {
        case 'file':
          const handleFileDownload = () => {
            if (message.metadata?.fileData) {
              try {
                // Decode base64 file data
                const byteCharacters = atob(message.metadata.fileData);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: message.metadata.fileType || 'application/octet-stream' });
                
                // Create download link
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = message.metadata.filename || 'download';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              } catch (error) {
                console.error('Download failed:', error);
              }
            }
          };
          
          return (
            <div className="flex items-center space-x-2">
              <File className="w-4 h-4 text-yellow-400" />
              <button 
                onClick={handleFileDownload}
                className="text-green-500 hover:text-green-300 underline cursor-pointer"
              >
                {message.metadata?.filename || message.content}
              </button>
              <span className="text-xs text-gray-500">
                ({message.metadata?.fileSize ? `${Math.round(message.metadata.fileSize / 1024)}KB` : 'File'})
              </span>
            </div>
          );
        
        case 'voice':
          const handleVoicePlay = () => {
            if (message.metadata?.audioData) {
              try {
                // Decode base64 audio data
                const byteCharacters = atob(message.metadata.audioData);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'audio/wav' });
                
                // Create and play audio
                const url = URL.createObjectURL(blob);
                const audio = new Audio(url);
                audio.play().catch(error => {
                  console.error('Audio playback failed:', error);
                });
                
                // Clean up URL after playback
                audio.addEventListener('ended', () => {
                  URL.revokeObjectURL(url);
                });
              } catch (error) {
                console.error('Voice playback failed:', error);
              }
            }
          };
          
          return (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mic className="w-4 h-4 text-purple-400" />
                <span className="text-green-500">{message.content}</span>
                <button 
                  onClick={handleVoicePlay}
                  className="text-purple-400 hover:text-purple-300 p-1 rounded"
                >
                  <Play className="w-4 h-4" />
                </button>
              </div>
              {/* Audio visualization */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: 20 }, (_, i) => (
                  <div 
                    key={i}
                    className="w-1 bg-purple-400 rounded animate-pulse"
                    style={{ 
                      height: `${Math.random() * 20 + 4}px`,
                      animationDelay: `${i * 100}ms`
                    }}
                  />
                ))}
              </div>
            </div>
          );
        
        default:
          return (
            <span className="text-green-500">
              {message.content}
            </span>
          );
      }
    };

    return (
      <div key={message.id} className={messageClass}>
        <div className={`text-xs text-green-700 mb-1 font-mono ${
          isOwnMessage ? 'text-right' : ''
        }`}>
          {!isOwnMessage && (
            <span className="text-blue-400">[{message.senderName}]</span>
          )}
          {message.expiresAt && (
            <span className="text-red-400 ml-2">
              <Clock className="w-3 h-3 inline mr-1" />
              {getExpirationLabel(message.expiresAt)}
            </span>
          )}
          <span className="text-gray-500 ml-2">
            {formatTime(message.timestamp)}
          </span>
          {isOwnMessage && (
            <span className="text-green-400 ml-2">[{message.senderName}]</span>
          )}
        </div>
        <div className={messageClass}>
          {renderContent()}
        </div>
      </div>
    );
  };

  const renderTypingIndicator = () => {
    const typingUsers = users.filter(u => u.isTyping && u.id !== user?.id);
    if (typingUsers.length === 0) return null;

    return (
      <div className="animate-fade-in">
        <div className="text-xs text-green-700 mb-1 font-mono">
          <span className="text-blue-400">
            [{typingUsers[0].username}]
          </span> is typing...
        </div>
        <div className="message-bubble incoming">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-text-green-500 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-text-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-text-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-black terminal-scrollbar">
      {/* System Boot Messages */}
      <div className="text-text-green-700 text-xs animate-fade-in font-mono">
        <span className="text-yellow-400">[SYSTEM]</span> Crypta Terminal initialized...
      </div>
      <div className="text-text-green-700 text-xs animate-fade-in font-mono">
        <span className="text-yellow-400">[CRYPTO]</span> End-to-end encryption: ACTIVE
      </div>
      <div className="text-text-green-700 text-xs animate-fade-in font-mono">
        <span className="text-yellow-400">[SESSION]</span> Anonymous user connected: {user?.username}
      </div>
      <div className="text-text-green-700 text-xs animate-fade-in mb-4 font-mono">
        <span className="text-yellow-400">[READY]</span> Secure channel established. Type to begin...
      </div>

      {/* Messages */}
      {messages.map(renderMessage)}
      
      {/* Typing Indicator */}
      {renderTypingIndicator()}
      
      <div ref={messagesEndRef} />
    </div>
  );
}