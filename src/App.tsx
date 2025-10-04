import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import CreatorSignup from "./pages/CreatorSignup";
import UserSignup from "./pages/UserSignup";

import CreatorProfile from "./components/CreatorProfile";
import CreatorProfileV2 from "./components/CreatorProfileV2";
import { Dashboard } from "./components/Dashboard";
import { CreatorDashboard } from "./components/CreatorDashboard";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Sonner position="top-center" />
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard userType="fan" />} />
              <Route path="/creator-dashboard" element={<CreatorDashboard />} />
              <Route path="/feed" element={<Feed />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="/creator/:id" element={<CreatorProfileV2 />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<UserSignup />} />
              <Route path="/creator-signup" element={<CreatorSignup />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
