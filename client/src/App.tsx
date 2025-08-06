import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ChatProvider } from "@/contexts/chat-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { usePanicMode } from "@/hooks/use-panic-mode";
import LoginPage from "@/pages/login";
import ChatPage from "@/pages/chat";
import NotFound from "@/pages/not-found";
import PanicOverlay from "@/components/chat/panic-overlay";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/chat" component={ChatPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { isPanicActivated } = usePanicMode();
  
  return (
    <>
      <Router />
      {isPanicActivated && <PanicOverlay />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <ChatProvider>
            <Toaster />
            <AppContent />
          </ChatProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
