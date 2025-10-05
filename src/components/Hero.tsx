"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth0Context } from "@/contexts/Auth0Context";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { user, isAuthenticated } = useAuth0Context();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);
  
  // Handle discover button click
  const handleDiscoverClick = async () => {
    if (isAuthenticated && user?.email) {
      // User is authenticated with Auth0, check if they exist in Supabase
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single();
        
        if (data) {
          // User exists in Supabase, navigate to feed
          navigate('/feed');
        } else {
          // User authenticated with Auth0 but not in Supabase yet
          // Redirect to signup to complete profile
          navigate('/signup');
        }
      } catch (error) {
        console.error('Error checking user in Supabase:', error);
        navigate('/signup');
      }
    } else {
      // Not authenticated, go to signup
      navigate('/signup');
    }
  };

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
    <section className="relative overflow-hidden bg-black pt-6 md:pt-8 pb-8">
      {/* subtle radial glow behind text for depth */}
      <div className="pointer-events-none absolute -z-10 -left-40 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-60 bg-[radial-gradient(ellipse_at_center,_rgba(251,191,36,0.10),_transparent_60%)]" />

      {/* Split layout with tighter vertical footprint */}
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-center gap-6 md:gap-10 min-h-[56vh] md:min-h-[60vh]">
        {/* LEFT — content (same copy) */}
        <div className="text-left relative z-20">
          <div
            className={`transition-all duration-1000 transform ${
              isVisible ? "opacity-100" : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-white">
              Invest in creators{" "}
              <span className="relative inline-block ml-1 align-top">
                {/* Base text stays white */}
                <span className="relative z-0">before they blow up</span>

                {/* Moving yellow/orange shimmer over the base text */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-20
                            cstake-clip-text animate-cstake-shimmer
                            bg-[linear-gradient(90deg,transparent,hsl(38_92%_50%/_0.95),transparent)]"
                >
                  before they blow up
                </span>

                <Sparkles
                  className="absolute -top-6 -right-6 w-5 h-5 text-white"
                  style={{ opacity: 0.85 }}
                />
              </span>
            </h1>





          </div>

          <p
            className={`text-xl text-muted-foreground max-w-2xl transition-all duration-1000 delay-200 transform ${
              isVisible ? "opacity-100" : "opacity-0 translate-y-10"
            }`}
          >
            Discover rising stars, invest tokens early, and earn returns as they grow.
            Be part of their success story from day one.
          </p>

          <div
            className={`flex flex-wrap gap-4 pt-5 transition-all duration-1000 delay-400 transform ${
              isVisible ? "opacity-100" : "opacity-0 translate-y-10"
            }`}
          >
            <Button
              size="lg"
              className="gap-2 shadow-glow glass-button bg-white text-white hover:bg-white/90 hover:text-black transition-all duration-300 hover:scale-105"
              onClick={handleDiscoverClick}
            >
              Start Discovering
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="glass transition-all duration-300 hover:scale-105 hover:shadow-glow"
              onClick={() => navigate('/creator-signup')}
            >
              Become a Creator
            </Button>
          </div>

          {/* Stats — hover highlight like “Become a Creator” (soft white glow) */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-5 pt-8 md:pt-9 max-w-2xl transition-all duration-1000 delay-600 transform ${
              isVisible ? "opacity-100" : "opacity-0 translate-y-10"
            }`}
          >
            {[
              { top: "500+", bot: "Rising Creators" },
              { top: "$2.4M", bot: "Invested" },
              { top: "64%", bot: "Avg. ROI" },
            ].map((card) => (
              <div key={card.bot} className="group relative">
                {/* soft white glow on hover (matches button glow style) */}
                <div className="absolute -inset-[2px] rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur-lg bg-white/12" />
                <div className="relative glass p-5 rounded-xl hover:shadow-glow transition">
                  <div className="text-3xl font-bold">{card.top}</div>
                  <div className="text-muted-foreground">{card.bot}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

                {/* RIGHT — image panel with soft, natural blend */}
                <div className="relative h-[44vh] md:h-[64vh] overflow-hidden rounded-2xl md:rounded-3xl">
          {/* 1) Photo */}
          <img
            src="/bg_imgs/BG_Img.jpg"
            alt="Creator performing"
            className="absolute inset-0 w-full h-full object-cover scale-[1.03] will-change-transform"
          />

          {/* 2) Subtle top/bottom vignette */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/45" />

          {/* 3) Feathered left edge (wide, blurred gradient into black) */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-3/5 md:w-1/2 -translate-x-1/3 blur-3xl
                       bg-gradient-to-l from-transparent via-black/60 to-black/95"
          />

          {/* 4) Very light backdrop blur right on the seam */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 md:w-1/5 backdrop-blur-sm" />
        </div>
      </div> {/* ← close the grid container */}
    </section>
  );
};

