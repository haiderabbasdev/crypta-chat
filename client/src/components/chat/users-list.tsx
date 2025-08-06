import { useChat } from "@/contexts/chat-context";
import { Badge } from "@/components/ui/badge";
import { User, Crown } from "lucide-react";

export default function UsersList() {
  const { users, user: currentUser } = useChat();

  return (
    <aside className="w-64 bg-gray-900 border-l border-green-700">
      <div className="p-4 border-b border-green-700">
        <h3 className="text-green-500 font-semibold text-sm font-mono">
          ACTIVE_SESSIONS
        </h3>
        <p className="text-xs text-green-700 mt-1 font-mono">
          {users.length} user{users.length !== 1 ? 's' : ''} online
        </p>
      </div>
      
      <div className="p-4 space-y-3">
        {users.map((user) => {
          const isCurrentUser = user.id === currentUser?.id;
          const isTyping = user.isTyping;
          
          return (
            <div 
              key={user.id}
              className="flex items-center space-x-3 p-2 rounded hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {/* Status Indicator */}
              <div className={`w-2 h-2 rounded-full ${
                isCurrentUser ? 'bg-text-green-500' : 'bg-blue-400'
              }`} />
              
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500 text-sm font-mono truncate">
                    {user.username}
                  </span>
                  {isCurrentUser && (
                    <Crown className="w-3 h-3 text-yellow-400" />
                  )}
                </div>
                
                <div className="text-xs text-green-700 font-mono">
                  {isCurrentUser ? (
                    "You • Session Owner"
                  ) : isTyping ? (
                    <span className="text-yellow-400">Typing...</span>
                  ) : (
                    "Online"
                  )}
                </div>
              </div>
              
              {/* User Icon */}
              <User className="w-4 h-4 text-green-700" />
            </div>
          );
        })}
        
        {users.length === 0 && (
          <div className="text-center text-text-green-700 font-mono text-sm">
            No active users
          </div>
        )}
      </div>
      

    </aside>
  );
}