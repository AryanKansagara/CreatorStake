import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth0Context } from "@/contexts/Auth0Context";
import { supabase } from "@/lib/supabase";

// Friend selection interface
interface Friend {
  id: string;
  name: string;
  image: string;
  selected: boolean;
}

const Login = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loginWithRedirect, isLoading } = useAuth0Context();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [signupStep, setSignupStep] = useState(1);
  
  // Check if user is authenticated with Auth0 and exists in Supabase
  useEffect(() => {
    const checkAuth0AndSupabase = async () => {
      if (isAuthenticated && user?.email) {
        try {
          // Check if user exists in Supabase
          const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('email', user.email)
            .single();
          
          if (data) {
            // User exists in Supabase, navigate to feed
            toast.success('Login successful!');
            navigate('/feed');
          } else {
            // User authenticated with Auth0 but not in Supabase yet
            // Redirect to signup to complete profile
            toast.info('Please complete your profile');
            navigate('/signup');
          }
        } catch (error) {
          console.error('Error checking user in Supabase:', error);
        }
      }
    };
    
    checkAuth0AndSupabase();
  }, [isAuthenticated, user, navigate]);
  
  // Sample friends for selection grid
  const [friends, setFriends] = useState<Friend[]>([
    { id: "1", name: "Alex Rivera", image: "/user1.jpg", selected: false },
    { id: "2", name: "Sarah Chen", image: "/user2.jpg", selected: false },
    { id: "3", name: "Marcus Johnson", image: "/user3.jpg", selected: false },
    { id: "4", name: "Emma Rodriguez", image: "/user1.jpg", selected: false },
    { id: "5", name: "David Kim", image: "/user2.jpg", selected: false },
    { id: "6", name: "Olivia Parker", image: "/user3.jpg", selected: false },
    { id: "7", name: "Michael Taylor", image: "/user5.jpg", selected: false },
    { id: "8", name: "Sophia Wilson", image: "/user1.jpg", selected: false },
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Redirect to Auth0 login
    toast.info('Please use Auth0 for login');
    loginWithRedirect();
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation for step 1
    if (signupStep === 1 && (!username || !password || !email)) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setSignupStep(2);
  };

  const handleSignup = () => {
    // Count selected friends
    const selectedFriends = friends.filter(friend => friend.selected);
    
    if (selectedFriends.length === 0) {
      toast.error("Please select at least one friend to start investing with");
      return;
    }
    
    // Mock successful signup
    toast.success("Account created successfully!");
    navigate("/feed");
  };

  const toggleFriendSelection = (id: string) => {
    setFriends(friends.map(friend => 
      friend.id === id ? { ...friend, selected: !friend.selected } : friend
    ));
  };

  // Function to generate floating orbs that add to the glassmorphic effect
  const FloatingOrbs = () => {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className={`absolute rounded-full bg-white/10 backdrop-blur-xl ${i % 2 === 0 ? 'animate-float' : 'animate-float-reverse'}`}
            style={{
              width: `${Math.random() * 150 + 50}px`,
              height: `${Math.random() * 150 + 50}px`,
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.4
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingOrbs />
      
      <div className="w-full max-w-md glass-card p-8 shadow-xl animate-blur-in relative z-10 glow-border light-reflection">
        <h1 className="text-3xl font-bold text-center mb-6 animate-scale-pulse">CreatorStake</h1>
        
        <Tabs 
          defaultValue="login" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8 glass animate-wave">
            <TabsTrigger value="login" className="transition-all duration-300 hover:bg-white/20">Login</TabsTrigger>
            <TabsTrigger value="signup" className="transition-all duration-300 hover:bg-white/20">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2 animate-reveal-delay-100">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  className="glass-input animate-wave" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>
              
              <div className="space-y-2 animate-reveal-delay-200">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  className="glass-input animate-wave"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter your password"
                />
              </div>
              
              <div className="flex items-center space-x-2 animate-reveal-delay-300">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm text-muted-foreground">
                  Remember me
                </label>
                <a href="#" className="text-sm text-primary ml-auto hover:text-white transition-colors duration-300">
                  Forgot password?
                </a>
              </div>
              
              <Button 
                type="submit" 
                className="w-full glass-button bg-white text-black hover:bg-white/90 animate-reveal-delay-400 animate-pulse-glow transition-all duration-300 hover:scale-105"
              >
                Login
              </Button>
              
              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-white/20"></div>
                <span className="px-3 text-sm text-muted-foreground">OR</span>
                <div className="flex-1 border-t border-white/20"></div>
              </div>

              {/* Auth0 Login Button */}
              <Button 
                type="button"
                onClick={() => loginWithRedirect()}
                className="w-full glass-button bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? 'Connecting...' : 'Sign In with Auth0'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            {signupStep === 1 ? (
              <form onSubmit={handleNextStep} className="space-y-6 animate-reveal">
                <div className="space-y-2 animate-reveal-delay-100">
                  <Label htmlFor="signup-username">Choose Username</Label>
                  <Input 
                    id="signup-username" 
                    className="glass-input animate-wave" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter a username"
                  />
                </div>
                
                <div className="space-y-2 animate-reveal-delay-200">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    className="glass-input animate-wave"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Enter your email"
                  />
                </div>
                
                <div className="space-y-2 animate-reveal-delay-300">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    className="glass-input animate-wave"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Create a password"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full glass-button bg-white text-black hover:bg-white/90 animate-reveal-delay-400 animate-pulse-glow transition-all duration-300 hover:scale-105"
                >
                  Continue
                </Button>
              </form>
            ) : (
              <div className="space-y-6 animate-blur-in">
                <h3 className="text-lg font-medium animate-scale-pulse">Select friends to start investing with</h3>
                <p className="text-sm text-muted-foreground">
                  Choose close friends you'd like to collaborate with on CreatorStake
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-reveal-delay-100">
                  {friends.map((friend, index) => (
                    <div 
                      key={friend.id} 
                      className={`
                        flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all
                        ${friend.selected ? 'glass border-2 border-white animate-pulse-glow' : 'glass hover:scale-105'}
                      `}
                      onClick={() => toggleFriendSelection(friend.id)}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="relative">
                        <img 
                          src={friend.image} 
                          alt={friend.name}
                          className={`w-16 h-16 rounded-full object-cover transition-all duration-300 ${friend.selected ? 'scale-110' : ''}`}
                        />
                        {friend.selected && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center animate-scale-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium mt-2 text-center">{friend.name}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2 animate-reveal-delay-300">
                  <Button 
                    variant="outline" 
                    className="flex-1 transition-all duration-300 hover:scale-105"
                    onClick={() => setSignupStep(1)}
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1 glass-button bg-white text-black hover:bg-white/90 animate-pulse-glow transition-all duration-300 hover:scale-105"
                    onClick={handleSignup}
                  >
                    Complete Signup
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
