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
          <div className="text-green-700 text-sm">
            Share this URL with friends to join your chat room:
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
          
          <div className="space-y-3 text-xs text-green-700">
            <div className="flex items-center space-x-2">
              <Monitor className="w-4 h-4" />
              <span>Open incognito window with this URL</span>
            </div>
            <div className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4" />
              <span>Share URL to friends' phones/tablets</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Works on any device with internet</span>
            </div>
          </div>
          
          <div className="border-t border-green-700 pt-3 text-xs text-green-600">
            <div>• Each user gets a unique anonymous identity</div>
            <div>• All messages are end-to-end encrypted</div>
            <div>• Real-time messaging and file sharing</div>
            <div>• Self-destructing messages available</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}