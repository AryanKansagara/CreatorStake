import { useState } from "react";
import { Hero } from "@/components/Hero";
import { DiscoveryFeed } from "@/components/DiscoveryFeed";
import { Dashboard } from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, Sparkles } from "lucide-react";

type ViewMode = "discover" | "dashboard";

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("discover");
  const [userType] = useState<"fan" | "creator">("fan"); // Mock user type
  const [tokens] = useState(1000); // Mock token balance

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
              onClick={() => setViewMode("discover")}
              className="gap-2 bg-white text-black hover:bg-white/90 border-white/30"
            >
              <TrendingUp className="w-4 h-4" />
              Discover
            </Button>
            <Button
              variant={viewMode === "dashboard" ? "default" : "ghost"}
              onClick={() => setViewMode("dashboard")}
              className={`gap-2 ${viewMode === "dashboard" ? "glass-button" : ""}`}
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </Button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium">{tokens} tokens</span>
            </div>
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
