import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, Users, TrendingUp, User, Bell, PlusSquare, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';

// Initialize Supabase client
const supabaseUrl = 'https://yyyfpcriefcurnosdmdv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5eWZwY3JpZWZjdXJub3NkbWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NDc4NjYsImV4cCI6MjA3NTEyMzg2Nn0.kp3jGsec1NrTeTUpRjPuCEV2p6IXjsyKOaIPYC6S8ug';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface NavigationProps {
  activePath?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ activePath = '' }) => {
  const { user, signOut } = useAuth();
  const [isCreator, setIsCreator] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) return;
      
      try {
        // Check if the user has a creator role
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (!error && data) {
          setIsCreator(data.role === 'creator');
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };
    
    checkUserRole();
  }, [user]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
  };

  return (
    <div className="w-16 md:w-64 glass border-r border-white/10 fixed h-full left-0 top-0 z-40 flex flex-col py-6">
      <div className="flex items-center justify-center md:justify-start md:px-6 mb-10">
        <h1 className="text-xl font-bold hidden md:block">Starvest</h1>
        <div className="w-10 h-10 rounded-xl glass flex items-center justify-center md:hidden">
          <TrendingUp className="w-6 h-6 text-primary-foreground" />
        </div>
      </div>
      
      <div className="flex flex-col items-center md:items-start gap-6 flex-1 px-2 md:px-4">
        <Button 
          variant="ghost" 
          className={`w-full justify-center md:justify-start gap-3 ${activePath === '/' ? 'bg-white/10' : ''}`}
          onClick={() => navigate("/")}
        >
          <Home size={22} />
          <span className="hidden md:inline">Home</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className={`w-full justify-center md:justify-start gap-3 ${activePath === '/search' ? 'bg-white/10' : ''}`}
        >
          <Search size={22} />
          <span className="hidden md:inline">Discover</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className={`w-full justify-center md:justify-start gap-3 ${activePath === '/feed' ? 'bg-white/10' : ''}`}
          onClick={() => navigate("/feed")}
        >
          <Users size={22} />
          <span className="hidden md:inline">Feed</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className={`w-full justify-center md:justify-start gap-3 ${activePath === '/dashboard' ? 'bg-white/10' : ''}`}
          onClick={() => navigate("/dashboard")}
        >
          <BarChart2 size={22} />
          <span className="hidden md:inline">Portfolio</span>
        </Button>
        
        {isCreator && (
          <Button 
            variant="ghost" 
            className={`w-full justify-center md:justify-start gap-3 ${activePath === '/creator-dashboard' ? 'bg-white/10' : ''}`}
            onClick={() => navigate("/creator-dashboard")}
          >
            <TrendingUp size={22} />
            <span className="hidden md:inline">Creator Dashboard</span>
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          className="w-full justify-center md:justify-start gap-3"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <User size={22} />
          <span className="hidden md:inline">
            {isSigningOut ? 'Signing out...' : 'Sign Out'}
          </span>
        </Button>
      </div>
      
      <div className="px-2 md:px-4 mt-auto">
        <Button variant="ghost" className="w-full justify-center md:justify-start gap-3">
          <Bell size={22} />
          <span className="hidden md:inline">Notifications</span>
          <span className="w-5 h-5 rounded-full bg-accent text-xs flex items-center justify-center ml-auto">3</span>
        </Button>
      </div>
    </div>
  );
};

export default Navigation;
