import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { DiscoveryFeed } from "@/components/DiscoveryFeed";
import { Dashboard } from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, Sparkles, LogOut, User } from "lucide-react";
import { useAuth0Context } from "@/contexts/Auth0Context";

type ViewMode = "discover" | "dashboard";

const Index = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isLoading } = useAuth0Context();
  const [viewMode, setViewMode] = useState<ViewMode>("discover");
  const [userType] = useState<"fan" | "creator">("fan"); // Mock user type
  const [tokens] = useState(1000); // Mock token balance

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CreatorStake
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/signup")}
              className="gap-2 bg-white text-black hover:bg-white/90 border-white/30"
            >
              <TrendingUp className="w-4 h-4" />
              Discover
            </Button>
            <Button
              variant={viewMode === "dashboard" ? "default" : "ghost"}
              onClick={() => setViewMode("dashboard")}
              className={`gap-2 ${
                viewMode === "dashboard" 
                  ? "glass-button text-white" 
                  : "text-white/80 hover:text-white hover:bg-white/10 border border-white/20"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </Button>
            
            {/* User Info and Logout */}
            {isLoading ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-sm font-medium">{tokens} tokens</span>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin ml-2" />
              </div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-sm font-medium">{tokens} tokens</span>
                </div>
                
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg glass">
                  {user.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name || 'User'} 
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5 text-white/80" />
                  )}
                  <span className="text-sm font-medium text-white/90">
                    {user.name || user.email || 'User'}
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="gap-2 text-white/80 hover:text-white hover:bg-white/10 border border-white/20"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-sm font-medium">{tokens} tokens</span>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => navigate("/signup")}
                  className="gap-2 bg-white/10 text-white hover:bg-white/20 border-white/30"
                >
                  <User className="w-4 h-4" />
                  Login
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {viewMode === "discover" ? (
          <>
            <Hero />
            <DiscoveryFeed />
          </>
        ) : (
          <Dashboard userType={userType} />
        )}
      </main>
    </div>
  );
};

export default Index;
