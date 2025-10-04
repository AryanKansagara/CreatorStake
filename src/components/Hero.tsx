import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, Coins } from "lucide-react";

export const Hero = () => {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-block">
          <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <span className="text-sm font-medium bg-gradient-primary bg-clip-text text-transparent">
              Invest in the next big creators
            </span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Back creators{" "}
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            before they blow up
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover rising stars, invest tokens early, and earn returns as they grow. 
          Be part of their success story from day one.
        </p>

        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Button size="lg" className="gap-2 shadow-glow">
            Start Discovering
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline">
            Become a Creator
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border shadow-card">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-2">5,000+</div>
            <div className="text-sm text-muted-foreground">Active Creators</div>
          </div>
          
          <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border shadow-card">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 mx-auto mb-4">
              <Coins className="w-6 h-6 text-accent" />
            </div>
            <div className="text-3xl font-bold mb-2">$2.5M</div>
            <div className="text-sm text-muted-foreground">Total Backed</div>
          </div>
          
          <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border shadow-card">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-success/10 mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div className="text-3xl font-bold mb-2">156%</div>
            <div className="text-sm text-muted-foreground">Avg. Return</div>
          </div>
        </div>
      </div>
    </section>
  );
};
