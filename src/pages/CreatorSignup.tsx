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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Globe,
  Instagram,
  Linkedin,
  Music,
  Paintbrush,
  TrendingUp,
  Twitter,
  VideoIcon,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";

const CreatorSignup = () => {
  const navigate = useNavigate();
  const [signupStep, setSignupStep] = useState(1);
  const [activeTab, setActiveTab] = useState("signup");
  
  // Creator basic info
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Creator profile
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  
  // Creator content type
  const [contentType, setContentType] = useState<string[]>([]);
  const [niche, setNiche] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    twitter: "",
    youtube: "",
    linkedin: "",
    website: ""
  });
  
  // Creator goals
  const [goalType, setGoalType] = useState("");
  const [targetAmount, setTargetAmount] = useState(10000);
  const [timeline, setTimeline] = useState("6 months");
  
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Login successful!");
    navigate("/creator-dashboard");
  };
  
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation for each step
    if (signupStep === 1 && (!username || !password || !email)) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (signupStep === 2 && (!fullName || !bio)) {
      toast.error("Please provide your name and bio");
      return;
    }
    
    if (signupStep === 3 && contentType.length === 0) {
      toast.error("Please select at least one content type");
      return;
    }
    
    if (signupStep < 4) {
      setSignupStep(signupStep + 1);
    } else {
      // Final submission
      toast.success("Creator account created successfully!");
      navigate("/creator-dashboard");
    }
  };
  
  const handlePreviousStep = () => {
    if (signupStep > 1) {
      setSignupStep(signupStep - 1);
    }
  };
  
  const handleContentTypeChange = (type: string) => {
    if (contentType.includes(type)) {
      setContentType(contentType.filter(t => t !== type));
    } else {
      setContentType([...contentType, type]);
    }
  };
  
  // Function to render a placeholder for file upload
  const renderImagePlaceholder = (label: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, image: File | null) => (
    <div className="flex flex-col items-center">
      <div className={`w-full aspect-[3/2] rounded-lg flex items-center justify-center glass mb-2 ${image ? 'p-0 overflow-hidden' : 'p-6'}`}>
        {image ? (
          <img 
            src={URL.createObjectURL(image)} 
            alt={label} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="text-center">
            <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center mx-auto mb-2">
              <Paintbrush className="w-6 h-6" />
            </div>
            <p>{label}</p>
          </div>
        )}
      </div>
      <Input
        type="file"
        onChange={onChange}
        className="glass-input"
        accept="image/*"
      />
    </div>
  );
  
  // Function for step progress display
  const ProgressSteps = () => (
    <div className="flex justify-between items-center mb-8 relative">
      <div className="absolute h-1 top-1/2 left-0 right-0 -translate-y-1/2 bg-muted"></div>
      {[1, 2, 3, 4].map((step) => (
        <div
          key={step}
          className={`w-8 h-8 rounded-full z-10 flex items-center justify-center ${
            step <= signupStep ? "glass-card bg-white/10" : "bg-muted"
          } ${step < signupStep ? "text-green-500" : ""}`}
        >
          {step < signupStep ? (
            <Check className="w-4 h-4" />
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
        <h1 className="text-3xl font-bold text-center mb-6 animate-scale-pulse">Creator Registration</h1>
        
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
              Existing Creator
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className="transition-all duration-300 hover:bg-white/20"
            >
              New Creator
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
              >
                Sign In as Creator
              </Button>
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
                  <Input 
                    id="signup-username" 
                    className="glass-input" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your unique creator handle"
                  />
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
                </div>
              </form>
            )}
            
            {/* Step 2: Profile Details */}
            {signupStep === 2 && (
              <div className="space-y-6 animate-blur-in">
                <h3 className="text-xl font-medium mb-2">Complete Your Profile</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Tell us more about you and your creative work
                </p>
                
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Full Name *</Label>
                    <Input 
                      id="fullname" 
                      className="glass-input" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio *</Label>
                    <Textarea
                      id="bio"
                      className="glass-input min-h-[120px]"
                      placeholder="Tell your story and what makes you unique as a creator"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">This will be displayed on your profile page</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Profile Picture</Label>
                      {renderImagePlaceholder(
                        "Upload Profile Picture", 
                        (e) => e.target.files?.length && setProfileImage(e.target.files[0]),
                        profileImage
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Cover Photo</Label>
                      {renderImagePlaceholder(
                        "Upload Cover Photo", 
                        (e) => e.target.files?.length && setCoverImage(e.target.files[0]),
                        coverImage
                      )}
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
            
            {/* Step 3: Content & Niche */}
            {signupStep === 3 && (
              <div className="space-y-6 animate-blur-in">
                <h3 className="text-xl font-medium mb-2">Your Creative Niche</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Tell us about the content you create and how to find you online
                </p>
                
                <form className="space-y-6">
                  <div className="space-y-3">
                    <Label>What type of content do you create? (Select all that apply) *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { id: "video", label: "Video", icon: <VideoIcon className="w-4 h-4" /> },
                        { id: "music", label: "Music", icon: <Music className="w-4 h-4" /> },
                        { id: "art", label: "Visual Art", icon: <Paintbrush className="w-4 h-4" /> },
                        { id: "writing", label: "Writing", icon: <Check className="w-4 h-4" /> },
                        { id: "podcast", label: "Podcast", icon: <Check className="w-4 h-4" /> },
                        { id: "other", label: "Other", icon: <Check className="w-4 h-4" /> }
                      ].map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => handleContentTypeChange(item.id)}
                          className={`
                            p-3 rounded-lg cursor-pointer transition-all flex gap-2 items-center
                            ${contentType.includes(item.id) ? 'glass-card bg-white/10' : 'glass'}
                          `}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="niche">Specific Niche/Category *</Label>
                    <Select value={niche} onValueChange={setNiche}>
                      <SelectTrigger className="glass-input">
                        <SelectValue placeholder="Select your niche" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="education">Education & Learning</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="gaming">Gaming</SelectItem>
                        <SelectItem value="fitness">Health & Fitness</SelectItem>
                        <SelectItem value="fashion">Fashion & Beauty</SelectItem>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="food">Food & Cooking</SelectItem>
                        <SelectItem value="travel">Travel & Adventure</SelectItem>
                        <SelectItem value="finance">Finance & Investing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Social Media Links (Add at least one)</Label>
                    
                    <div className="space-y-3">
                      <div className="flex gap-3 items-center">
                        <Instagram className="w-5 h-5 text-pink-400" />
                        <Input 
                          className="glass-input flex-1" 
                          placeholder="Instagram username" 
                          value={socialLinks.instagram}
                          onChange={(e) => setSocialLinks({...socialLinks, instagram: e.target.value})}
                        />
                      </div>
                      
                      <div className="flex gap-3 items-center">
                        <Twitter className="w-5 h-5 text-blue-400" />
                        <Input 
                          className="glass-input flex-1" 
                          placeholder="Twitter username" 
                          value={socialLinks.twitter}
                          onChange={(e) => setSocialLinks({...socialLinks, twitter: e.target.value})}
                        />
                      </div>
                      
                      <div className="flex gap-3 items-center">
                        <Youtube className="w-5 h-5 text-red-400" />
                        <Input 
                          className="glass-input flex-1" 
                          placeholder="YouTube channel" 
                          value={socialLinks.youtube}
                          onChange={(e) => setSocialLinks({...socialLinks, youtube: e.target.value})}
                        />
                      </div>
                      
                      <div className="flex gap-3 items-center">
                        <Globe className="w-5 h-5 text-cyan-400" />
                        <Input 
                          className="glass-input flex-1" 
                          placeholder="Website URL" 
                          value={socialLinks.website}
                          onChange={(e) => setSocialLinks({...socialLinks, website: e.target.value})}
                        />
                      </div>
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
            
            {/* Step 4: Investment Goals */}
            {signupStep === 4 && (
              <div className="space-y-6 animate-blur-in">
                <h3 className="text-xl font-medium mb-2">Your Funding Goals</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Set your investment goals and tell potential investors what you're raising for
                </p>
                
                <form className="space-y-6">
                  <div className="space-y-3">
                    <Label>What are you raising funds for? *</Label>
                    <RadioGroup value={goalType} onValueChange={setGoalType}>
                      <div className="flex items-center space-x-2 glass p-3 rounded-lg">
                        <RadioGroupItem value="project" id="project" />
                        <Label htmlFor="project" className="cursor-pointer flex-1">Specific Project</Label>
                        <TrendingUp className="w-5 h-5 text-amber-400" />
                      </div>
                      <div className="flex items-center space-x-2 glass p-3 rounded-lg">
                        <RadioGroupItem value="equipment" id="equipment" />
                        <Label htmlFor="equipment" className="cursor-pointer flex-1">Equipment/Gear</Label>
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="flex items-center space-x-2 glass p-3 rounded-lg">
                        <RadioGroupItem value="growth" id="growth" />
                        <Label htmlFor="growth" className="cursor-pointer flex-1">Channel Growth</Label>
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex items-center space-x-2 glass p-3 rounded-lg">
                        <RadioGroupItem value="general" id="general" />
                        <Label htmlFor="general" className="cursor-pointer flex-1">General Support</Label>
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between">
                        <Label>Target Funding Amount</Label>
                        <span className="text-xl font-bold">${targetAmount.toLocaleString()}</span>
                      </div>
                      <Slider
                        defaultValue={[10000]}
                        max={100000}
                        step={1000}
                        value={[targetAmount]}
                        onValueChange={([value]) => setTargetAmount(value)}
                        className="my-6"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>$5,000</span>
                        <span>$100,000</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timeline">Funding Timeline</Label>
                      <Select value={timeline} onValueChange={setTimeline}>
                        <SelectTrigger className="glass-input">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3 months">3 months</SelectItem>
                          <SelectItem value="6 months">6 months</SelectItem>
                          <SelectItem value="12 months">12 months</SelectItem>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2 glass-card p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <label htmlFor="terms" className="text-sm">
                        I agree to the <a href="#" className="text-primary">Terms and Conditions</a> and <a href="#" className="text-primary">Creator Guidelines</a>
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
                    >
                      Complete Registration
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreatorSignup;
