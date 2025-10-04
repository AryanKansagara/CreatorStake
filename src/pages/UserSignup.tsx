import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, User2, AtSign } from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "@/components/ImageUploader";
import { useAuth } from "@/contexts/AuthContext";

const UserSignup = () => {
  const navigate = useNavigate();
  const { signUp, signIn, loading } = useAuth();
  const [signupStep, setSignupStep] = useState(1);
  const [activeTab, setActiveTab] = useState("signup");
  
  // User basic info
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // User profile
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  
  // User interests (for content recommendations)
  const [interests, setInterests] = useState<string[]>([]);
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Get the email/username and password from the form
      const formElement = e.target as HTMLFormElement;
      const emailInput = formElement.elements.namedItem('username') as HTMLInputElement;
      const passwordInput = formElement.elements.namedItem('password') as HTMLInputElement;
      
      if (!emailInput?.value || !passwordInput?.value) {
        toast.error('Please enter both email and password');
        return;
      }
      
      await signIn(emailInput.value, passwordInput.value);
      navigate('/feed');
    } catch (error) {
      // Error is already handled in the auth context
    }
  };
  
  const  handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupStep === 1 && (!username || !password || !email)) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (signupStep === 1 && password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    if (signupStep === 2) {
      // Register the user with Supabase
      const { data, error } = await signUp(email, password, {
        username,
        name: fullName || username,
        bio,
        role: 'fan',
        profile_image_url: null // In a real app, you'd upload this to storage first
      });
      if (error) {
        // Error is handled in auth context
        return;
      }
      navigate("/feed");
      return;
    }
    
    setSignupStep(signupStep + 1);
  };
  
  const handlePreviousStep = () => {
    if (signupStep > 1) {
      setSignupStep(signupStep - 1);
    }
  };
  
  const handleInterestToggle = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };
  
  // Interest categories for content recommendations
  const interestCategories = [
    { id: "fashion", label: "Fashion" },
    { id: "music", label: "Music" },
    { id: "tech", label: "Technology" },
    { id: "gaming", label: "Gaming" },
    { id: "art", label: "Art" },
    { id: "fitness", label: "Fitness" },
    { id: "food", label: "Food" },
    { id: "travel", label: "Travel" },
    { id: "finance", label: "Finance" },
    { id: "education", label: "Education" },
    { id: "photography", label: "Photography" },
    { id: "writing", label: "Writing" }
  ];
  
  // Function for step progress display
  const ProgressSteps = () => (
    <div className="flex justify-between items-center mb-8 relative">
      <div className="absolute h-1 top-1/2 left-0 right-0 -translate-y-1/2 bg-muted"></div>
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          className={`w-8 h-8 rounded-full z-10 flex items-center justify-center ${
            step <= signupStep ? "glass-card bg-white/10" : "bg-muted"
          } ${step < signupStep ? "text-green-500" : ""}`}
        >
          {step < signupStep ? (
            <div className="w-4 h-4">✓</div>
          ) : (
            <span className={step === signupStep ? "text-white" : "text-muted-foreground"}>{step}</span>
          )}
        </div>
      ))}
    </div>
  );

  // Background animation elements
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
      
      <div className="w-full max-w-2xl glass-card p-8 shadow-xl animate-blur-in relative z-10 glow-border light-reflection">
        <h1 className="text-3xl font-bold text-center mb-6 animate-scale-pulse">Join Starvest</h1>
        
        <Tabs 
          defaultValue="signup" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8 glass animate-wave">
            <TabsTrigger 
              value="login" 
              className="transition-all duration-300 hover:bg-white/20"
            >
              Log In
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className="transition-all duration-300 hover:bg-white/20"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-6">
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-2 animate-reveal-delay-100">
                <Label htmlFor="username">Username or Email</Label>
                <Input 
                  id="username" 
                  className="glass-input animate-wave" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username or email"
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
                className="w-full glass-button bg-white text-black hover:bg-white/90 transition-all duration-300 hover:scale-105"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Are you a creator? <a href="/creator-signup" className="text-accent hover:underline">Sign up as creator</a>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            {/* Step progress indicator */}
            <ProgressSteps />
            
            {/* Step 1: Account Info */}
            {signupStep === 1 && (
              <form onSubmit={handleNextStep} className="space-y-6 animate-reveal">
                <div className="space-y-2 animate-reveal-delay-100">
                  <Label htmlFor="signup-username">Choose Username *</Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="signup-username" 
                      className="glass-input pl-10" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Your unique username"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">This will be your @handle on the platform</p>
                </div>
                
                <div className="space-y-2 animate-reveal-delay-200">
                  <Label htmlFor="signup-email">Email Address *</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    className="glass-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Your email address"
                  />
                </div>
                
                <div className="space-y-2 animate-reveal-delay-300">
                  <Label htmlFor="signup-password">Password *</Label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    className="glass-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Create a secure password"
                  />
                  <p className="text-xs text-muted-foreground">Must be at least 8 characters with numbers and symbols</p>
                </div>
                
                <div className="pt-4 animate-reveal-delay-400">
                  <Button 
                    type="submit" 
                    className="w-full glass-button bg-white text-black hover:bg-white/90 transition-all duration-300 hover:scale-105"
                  >
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>

                  <div className="text-center text-sm text-muted-foreground mt-4">
                    Are you a creator? <a href="/creator-signup" className="text-accent hover:underline">Sign up as creator</a>
                  </div>
                </div>
              </form>
            )}
            
            {/* Step 2: Profile Details with Image Upload */}
            {signupStep === 2 && (
              <div className="space-y-6 animate-blur-in">
                <h3 className="text-xl font-medium mb-2">Create Your Profile</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Tell us a bit about yourself and upload a profile picture
                </p>
                
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Full Name</Label>
                    <div className="relative">
                      <User2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="fullname" 
                        className="glass-input pl-10" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      className="glass-input min-h-[100px]"
                      placeholder="Tell us a little about yourself..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Profile Picture</Label>
                      <ImageUploader
                        onImageChange={(file) => setProfileImage(file)}
                        aspectRatio="aspect-square"
                        placeholderText="Upload Profile Picture"
                        className="max-w-[200px] mx-auto"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Cover Photo (Optional)</Label>
                      <ImageUploader
                        onImageChange={(file) => setCoverImage(file)}
                        aspectRatio="aspect-[3/1]"
                        placeholderText="Upload Cover Photo"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1"
                      onClick={handlePreviousStep}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      className="flex-1 glass-button bg-white text-black hover:bg-white/90"
                      onClick={handleNextStep}
                    >
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Step 3: Interests for Personalization */}
            {signupStep === 3 && (
              <div className="space-y-6 animate-blur-in">
                <h3 className="text-xl font-medium mb-2">Personalize Your Experience</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Select interests to help us recommend creators you might like
                </p>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label>Select your interests (Pick at least 3)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {interestCategories.map((category) => (
                        <div 
                          key={category.id}
                          onClick={() => handleInterestToggle(category.id)}
                          className={`
                            p-3 rounded-lg cursor-pointer transition-all flex gap-2 items-center
                            ${interests.includes(category.id) ? 'glass-card bg-white/10' : 'glass'}
                          `}
                        >
                          <Checkbox 
                            id={`interest-${category.id}`}
                            checked={interests.includes(category.id)} 
                            onCheckedChange={() => handleInterestToggle(category.id)}
                          />
                          <label htmlFor={`interest-${category.id}`} className="cursor-pointer flex-1">{category.label}</label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {interests.length} of 3 minimum selected
                    </p>
                  </div>
                  
                  {/* Creator Suggestions */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Suggested Creators for You</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { id: 'creator1', name: 'Sarah Chen', avatar: '/user2.jpg', category: 'Fashion' },
                        { id: 'creator2', name: 'Alex Rivera', avatar: '/user1.jpg', category: 'Gaming' },
                        { id: 'creator3', name: 'Marcus Johnson', avatar: '/user3.jpg', category: 'Music' },
                        { id: 'creator4', name: 'Emma Davis', avatar: '/user5.jpg', category: 'Art' },
                        { id: 'creator5', name: 'David Kim', avatar: '/user4.jpg', category: 'Technology' },
                        { id: 'creator6', name: 'Sophia Lee', avatar: '/user2.jpg', category: 'Fitness' }
                      ].filter(creator => 
                        // Show creators that match user interests or show all if no interests selected
                        interests.length === 0 || 
                        interests.some(interest => creator.category.toLowerCase() === interest.toLowerCase())
                      ).slice(0, 6).map(creator => (
                        <div key={creator.id} className="glass-card p-3 rounded-lg hover:bg-white/10 transition-all cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              <img 
                                src={creator.avatar} 
                                alt={creator.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium truncate">{creator.name}</p>
                              <p className="text-xs text-muted-foreground">{creator.category}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2 glass-card p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <label htmlFor="terms" className="text-sm">
                        I agree to the <a href="#" className="text-primary">Terms and Conditions</a> and <a href="#" className="text-primary">Privacy Policy</a>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1"
                      onClick={handlePreviousStep}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      className="flex-1 glass-button bg-white text-black hover:bg-white/90"
                      onClick={handleNextStep}
                      disabled={interests.length < 3}
                    >
                      Complete Registration
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserSignup;
