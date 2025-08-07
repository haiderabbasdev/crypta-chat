import { useState, useRef, useCallback } from "react";
import { useChat } from "@/contexts/chat-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Paperclip, Mic, Send, Square, X, Upload } from "lucide-react";

export default function MessageInput() {
  const { sendMessage, sendFile, sendVoiceNote, startTyping, stopTyping } = useChat();
  const [message, setMessage] = useState("");
  const [expirationTime, setExpirationTime] = useState("30");
  const [isRecording, setIsRecording] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout>();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else {
      // Start typing indicator
      startTyping();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 2000);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const expireSeconds = expirationTime === "0" ? undefined : parseInt(expirationTime);
    sendMessage(message, expireSeconds);
    setMessage("");
    stopTyping();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert("File size must be less than 10MB");
        return;
      }
      const expireSeconds = expirationTime === "0" ? undefined : parseInt(expirationTime);
      sendFile(file, expireSeconds);
      setShowFileUpload(false);
    }
  };

  const startVoiceRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      const chunks: Blob[] = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const expireSeconds = expirationTime === "0" ? undefined : parseInt(expirationTime);
        sendVoiceNote(blob, expireSeconds);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to access microphone');
    }
  }, [expirationTime, sendVoiceNote]);

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const cancelVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      // Don't send the recording
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.onstop = null;
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-black border-t border-green-700 p-4">
      {/* File Upload Area */}
      {showFileUpload && (
        <div className="bg-gray-900 border border-dashed border-green-700 rounded p-4 mb-4">
          <div className="text-center">
            <Upload className="w-8 h-8 text-green-700 mb-2 mx-auto" />
            <p className="text-green-700 text-sm font-mono">
              Drag & drop files here or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-1 font-mono">
              Max 10MB • Files will be encrypted before transmission
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
            />
            <div className="flex justify-center space-x-2 mt-4">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-green-500 text-black hover:bg-green-700 font-mono"
              >
                Select File
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFileUpload(false)}
                className="border-green-700 text-green-500 hover:bg-gray-800 font-mono"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Recording Area */}
      {isRecording && (
        <div className="bg-gray-900 border border-red-400 rounded p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 font-mono">
                Recording... {formatRecordingTime(recordingTime)}
              </span>
              <div className="flex space-x-1">
                {Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-red-400 animate-pulse rounded"
                    style={{ 
                      height: `${Math.random() * 20 + 8}px`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={stopVoiceRecording}
                className="text-red-400 hover:text-red-300 bg-transparent border border-red-400 hover:border-red-300"
              >
                <Square className="w-4 h-4" />
              </Button>
              <Button
                onClick={cancelVoiceRecording}
                className="text-gray-400 hover:text-gray-300 bg-transparent border border-gray-400 hover:border-gray-300"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Input Area */}
      <div className="flex items-end space-x-4">
        {/* Timer Selection */}
        <div className="flex flex-col items-center space-y-1">
          <span className="text-xs text-green-700 font-mono">Timer</span>
          <Select value={expirationTime} onValueChange={setExpirationTime}>
            <SelectTrigger className="w-16 h-8 bg-gray-900 border-green-700 text-green-500 text-xs font-mono">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-green-700">
              <SelectItem value="5" className="text-green-500 font-mono">5s</SelectItem>
              <SelectItem value="30" className="text-green-500 font-mono">30s</SelectItem>
              <SelectItem value="300" className="text-green-500 font-mono">5m</SelectItem>
              <SelectItem value="3600" className="text-green-500 font-mono">1h</SelectItem>
              <SelectItem value="0" className="text-green-500 font-mono">∞</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Message Input */}
        <div className="flex-1 relative">
          <div className="terminal-prompt">
            <div className="terminal-prompt-header">
              <span className="text-green-700 text-sm font-mono">
                {localStorage.getItem("crypta_username") || "anonymous"}@crypta:~$
              </span>
              <span className="ml-2 text-green-500 animate-blink font-mono">|</span>
            </div>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="terminal-prompt-input font-mono"
              rows={2}
              placeholder='console.log("Type your encrypted message here...");'
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          <Button
            onClick={() => setShowFileUpload(!showFileUpload)}
            className="p-2 text-yellow-400 hover:text-yellow-300 border border-yellow-400 hover:border-yellow-300 bg-transparent"
            title="Secure File Transfer"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
            className={`p-2 border bg-transparent ${
              isRecording 
                ? 'text-red-400 hover:text-red-300 border-red-400 hover:border-red-300'
                : 'text-purple-400 hover:text-purple-300 border-purple-400 hover:border-purple-300'
            }`}
            title="Voice Message"
          >
            <Mic className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="p-2 text-green-500 hover:text-green-700 border border-green-500 hover:border-green-700 bg-transparent disabled:opacity-50"
            title="Send Encrypted Message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}