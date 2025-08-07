import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, Monitor, Smartphone, Globe } from "lucide-react";

interface MultiUserGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MultiUserGuide({ isOpen, onClose }: MultiUserGuideProps) {
  const currentUrl = window.location.href;
  
  const copyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-green-700 text-green-500 font-mono max-w-md">
        <DialogHeader>
          <DialogTitle className="text-green-500 font-mono flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Multi-User Connection Guide
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-green-500 text-sm font-bold">
            HOW TO CONNECT MULTIPLE USERS:
          </div>
          
          <div className="bg-gray-900 border border-green-700 rounded p-3 text-xs break-all">
            {currentUrl}
          </div>
          
          <Button 
            onClick={copyUrl}
            className="w-full bg-green-500 text-black hover:bg-green-400"
          >
            Copy Chat URL
          </Button>
          
          <div className="space-y-3 text-xs text-green-700 bg-black/50 p-3 rounded border border-green-700/30">
            <div className="text-green-500 font-bold mb-2">QUICK CONNECTION METHODS:</div>
            <div className="flex items-center space-x-2">
              <Monitor className="w-4 h-4 text-blue-400" />
              <span>1. Open an incognito window with this URL</span>
            </div>
            <div className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <span>2. Share URL to friends' phones/tablets</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-green-400" />
              <span>3. Send link via any messaging app</span>
            </div>
          </div>
          
          <div className="border-t border-green-700 pt-3 text-xs">
            <div className="text-green-500 font-bold mb-2">IMPORTANT NOTES:</div>
            <div className="text-green-600">• Each user must enter a unique username</div>
            <div className="text-green-600">• All users will connect to the same room</div>
            <div className="text-green-600">• Messages are end-to-end encrypted</div>
            <div className="text-green-600">• Files and voice messages are supported</div>
            <div className="text-yellow-500 mt-2">• If connection fails, try refreshing the page</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}