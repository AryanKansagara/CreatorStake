import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp, Users, Coins } from "lucide-react";
import { useState, useEffect } from "react";

export const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Random floating particles
  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <div 
          key={i} 
          className="absolute rounded-full bg-white/20"
          style={{
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.2,
            animation: `float ${Math.random() * 10 + 15}s infinite linear`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );

  // Floating glass orbs
  const FloatingOrbs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <div 
          key={i} 
          className={`absolute rounded-full glass ${i % 2 === 0 ? 'animate-float' : 'animate-float-reverse'}`}
          style={{
            width: `${Math.random() * 300 + 100}px`,
            height: `${Math.random() * 300 + 100}px`,
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 90}%`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.2
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="pt-20 pb-16 relative overflow-hidden">
      <FloatingParticles />
      <FloatingOrbs />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Main Headline */}
        <div className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Invest in creators
            <span className="bg-gradient-primary bg-clip-text text-transparent light-reflection relative inline-blockv ml-6">
              {" "}
              before they blow up
              <Sparkles 
                className="absolute -top-6 -right-6 w-5 h-5 text-white animate-float-fast" 
                style={{opacity: 0.7}}
              />
            </span>
          </h1>
        </div>
        
        {/* Description */}
        <p className={`text-xl text-muted-foreground max-w-2xl mx-auto transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          Discover rising stars, invest tokens early, and earn returns as they grow. 
          Be part of their success story from day one.
        </p>

        {/* CTA Buttons */}
        <div className={`flex flex-wrap gap-4 justify-center pt-4 transition-all duration-1000 delay-500 transform ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          <Button 
            size="lg" 
            className="gap-2 shadow-glow glass-button bg-white text-white hover:bg-white/90 hover:text-black transition-all duration-300 hover:scale-105"
            onClick={() => window.location.href = "/login"}
          >
            Start Discovering
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="glass transition-all duration-300 hover:scale-105 hover:shadow-glow"
            onClick={() => window.location.href = "/creator-signup"}
          >
            Become a Creator
          </Button>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 transition-all duration-1000 delay-700 transform ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          <div className="glass p-4 rounded-lg hover:animate-wave transition-all duration-300 hover:shadow-glow">
            <div className="text-3xl font-bold animate-scale-pulse">500+</div>
            <div className="text-muted-foreground">Rising Creators</div>
          </div>
          <div className="glass p-4 rounded-lg hover:animate-wave transition-all duration-300 hover:shadow-glow">
            <div className="text-3xl font-bold animate-scale-pulse">$2.4M</div>
            <div className="text-muted-foreground">Invested</div>
          </div>
          <div className="glass p-4 rounded-lg hover:animate-wave transition-all duration-300 hover:shadow-glow">
            <div className="text-3xl font-bold animate-scale-pulse">64%</div>
            <div className="text-muted-foreground">Avg. ROI</div>
          </div>
        </div>
      </div>
    </div>
  );
};
