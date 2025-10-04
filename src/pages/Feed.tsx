import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from '@supabase/supabase-js';
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import {
  Bell,
  Home,
  Search,
  TrendingUp,
  User,
  Users,
  Heart,
  MessageCircle,
  MessageSquare,
  Bookmark,
  Share2,
  MoreVertical,
  DollarSign,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";

// Initialize Supabase client
const supabaseUrl = 'https://yyyfpcriefcurnosdmdv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5eWZwY3JpZWZjdXJub3NkbWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NDc4NjYsImV4cCI6MjA3NTEyMzg2Nn0.kp3jGsec1NrTeTUpRjPuCEV2p6IXjsyKOaIPYC6S8ug';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define types
interface DbCreator {
  id: string;
  user_id: string;
  current_stock_price: number;
  followers_count: number;
  created_at: string;
  intro_video_url?: string;
  sample_post_url?: string;
}

interface DbUser {
  id: string;
  name: string;
  email: string;
  role: 'creator' | 'fan';
  profile_bio: string | null;
  profile_image_url: string | null;
  wallet_balance: number;
  created_at: string;
}

interface DbPost {
  id: string;
  creator_id: string;
  content: string;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface Creator {
  id: string;
  userId: string; // Added userId for navigation to creator profile
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
  stockPrice: number;
  priceChange: number;
  followers: number;
  investors: number;
}

interface Post {
  id: string;
  creator: Creator;
  content: string;
  image: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  timePosted: string;
}

interface Story {
  id: string;
  name: string;
  avatar: string;
  hasNew: boolean;
}

// Helper function to format relative time
const getRelativeTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  return `${Math.floor(diffInSeconds / 86400)}d`;
};

const Feed = () => {
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch creators with their users
        const { data: creatorsData, error: creatorsError } = await supabase
          .from('creators')
          .select(`
            *,
            users:user_id(*)
          `);

        if (creatorsError) throw creatorsError;
        
        // Fetch posts with their creators
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (postsError) throw postsError;
        
        console.log('Creators from DB:', creatorsData);
        console.log('Posts from DB:', postsData);
        
        // Format creators data
        const formattedCreators: Record<string, Creator> = {};
        creatorsData.forEach((creator: any) => {
          const userName = creator.users?.name || 'Unknown Creator';
          const handle = `@${userName.toLowerCase().replace(/\s+/g, '')}`;
          
          formattedCreators[creator.id] = {
            id: creator.id,
            userId: creator.user_id, // Store user_id to use for navigation
            name: userName,
            handle: handle,
            avatar: creator.users?.profile_image_url || '/user1.jpg',
            verified: Math.random() > 0.5, // Random for now
            stockPrice: creator.current_stock_price || 1.0,
            priceChange: parseFloat(((Math.random() * 20) - 5).toFixed(1)), // Random for now
            followers: creator.followers_count || 0,
            investors: Math.floor((creator.followers_count || 0) / 8), // Estimated
          };
        });
        
        // Format posts data
        const formattedPosts = postsData.map((post: DbPost) => {
          const creator = formattedCreators[post.creator_id];
          if (!creator) return null;
          
          return {
            id: post.id,
            creator,
            content: post.content,
            image: post.image_url || '/user1.jpg',
            likes: post.likes_count,
            comments: post.comments_count,
            isLiked: Math.random() > 0.5, // Random for demo
            isBookmarked: Math.random() > 0.7, // Random for demo
            timePosted: getRelativeTime(post.created_at),
          };
        }).filter(Boolean) as Post[];
        
        // Create stories from creators
        const formattedStories = Object.values(formattedCreators).map(creator => ({
          id: creator.id,
          name: creator.handle.substring(1), // Remove @ prefix
          avatar: creator.avatar,
          hasNew: Math.random() > 0.3, // Random for demo
        }));
        
        // Add some generic stories if needed
        const genericStoryNames = ['minhhgoc', 'aidan_du', 'emmaa.w', 'seyisexual', 'mrr_rxx', 'bayou_b.o.a'];
        const additionalStories = genericStoryNames.map((name, idx) => ({
          id: `generic-${idx}`,
          name,
          avatar: `/user${(idx % 3) + 1}.jpg`,
          hasNew: Math.random() > 0.3,
        }));
        
        setPosts(formattedPosts);
        setStories([...formattedStories, ...additionalStories]);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message);
        toast.error('Failed to load feed data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Sign out function using Supabase
  const signOut = async () => {
    try {
      setIsSigningOut(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error("Error signing out: " + error.message);
        console.error("Sign out error:", error);
      } else {
        toast.success("Signed out successfully");
        navigate('/signup');
      }
    } catch (error: any) {
      console.error("Sign out failed:", error);
      toast.error("Failed to sign out: " + (error.message || "Unknown error"));
    } finally {
      setIsSigningOut(false);
    }
  };

  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState(100);
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex justify-center items-center">
        <div className="glass-card p-8 rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <TrendingUp className="w-10 h-10 animate-pulse text-accent" />
            <h2 className="text-xl">Loading creator feeds...</h2>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero flex justify-center items-center">
        <div className="glass-card p-8 rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <div className="text-red-500 text-2xl">⚠️</div>
            <h2 className="text-xl">Failed to load feed</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newIsLiked = !post.isLiked;
        return {
          ...post,
          isLiked: newIsLiked,
          likes: newIsLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, isBookmarked: !post.isBookmarked };
      }
      return post;
    }));
  };

  const openInvestModal = (creator: Creator) => {
    setSelectedCreator(creator);
    setShowInvestModal(true);
  };

  const handleInvest = () => {
    if (selectedCreator) {
      toast.success(`Successfully invested ${investmentAmount} tokens in ${selectedCreator.name}'s creator stock!`);
      setShowInvestModal(false);
      setInvestmentAmount(100); // Reset for next time
    }
  };

  const formatCompactNumber = (num: number): string => {
    if (num < 1000) return num.toString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}k`;
    return `${(num / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex">
      {/* Navigation Sidebar */}
      <Navigation activePath="/feed" />
      
      {/* Main content */}
      <div className="ml-16 md:ml-64 flex-1">
        {/* Top header */}
        <header className="sticky top-0 z-30 glass border-b border-white/10 py-3">
          <div className="container max-w-4xl mx-auto px-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Your Feed</h2>
            <Button size="icon" variant="ghost" className="rounded-full">
              <Bell size={20} />
            </Button>
          </div>
        </header>

      {/* Stories row */}
      <div className="container max-w-4xl mx-auto px-4 mt-6 mb-8 overflow-x-auto">
        <div className="flex gap-6 pb-4 pl-2">
          {/* Your Story */}
          <div className="w-[110px] cursor-pointer group">
            <div className="relative glass-card rounded-xl overflow-hidden aspect-[4/5] transform transition-all duration-300 hover:-translate-y-2 hover:shadow-glow rotate-[-2deg] hover:rotate-0">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent to-black/30">
                <div className="w-16 h-16 flex items-center justify-center rounded-full glass bg-white/10 border border-white/20 mt-[-40px]">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-lg">+</span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-3 left-0 right-0 text-center">
                <span className="text-xs font-medium">Your Story</span>
              </div>
            </div>
          </div>

          {stories.map((story, index) => (
            <div key={story.id} className="w-[110px] cursor-pointer group">
              <div 
                className={`relative glass-card rounded-xl overflow-hidden aspect-[4/5] transform transition-all duration-300 
                  hover:-translate-y-2 hover:shadow-glow 
                  ${index % 3 === 0 ? 'rotate-[2deg] hover:rotate-0' : index % 3 === 1 ? 'rotate-[-2deg] hover:rotate-0' : ''}`}
                style={{
                  backgroundImage: `url(${story.avatar})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                  <div className={`w-10 h-10 rounded-full border-2 ${story.hasNew ? 'border-accent' : 'border-white/20'} overflow-hidden`}>
                    <img 
                      src={story.avatar} 
                      alt={story.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-3">
                  <span className="text-xs font-medium truncate max-w-[90%]">{story.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feed content */}
      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="glass-card rounded-xl overflow-hidden max-h-[500px]">
            {/* Post header */}
            <div className="p-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar 
                  className="cursor-pointer" 
                  onClick={() => navigate(`/creator/${post.creator.userId}`)}
                >
                  <img 
                    src={post.creator.avatar} 
                    alt={post.creator.name}
                    className="w-full h-full object-cover" 
                  />
                </Avatar>
                <div 
                  className="cursor-pointer" 
                  onClick={() => navigate(`/creator/${post.creator.userId}`)}
                >
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{post.creator.name}</span>
                    {post.creator.verified && (
                      <span className="text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{post.creator.handle}</div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-sm">
                  <DollarSign size={14} className={post.creator.priceChange >= 0 ? "text-green-400" : "text-red-400"} />
                  <span className="font-medium">${post.creator.stockPrice.toFixed(2)}</span>
                  <span className={post.creator.priceChange >= 0 ? "text-green-400" : "text-red-400"}>
                    {post.creator.priceChange >= 0 ? "+" : ""}{post.creator.priceChange}%
                  </span>
                </div>
                <Button 
                  size="sm" 
                  className="mt-1 bg-white text-black hover:bg-white/90 border border-white/30"
                  onClick={() => openInvestModal(post.creator)}
                >
                  Invest
                </Button>
              </div>
            </div>

            {/* Post content */}
            <div>
              <p className="px-4 pb-2 text-sm line-clamp-2">{post.content}</p>
              <div className="aspect-[16/10] w-full bg-gray-800">
                <img 
                  src={post.image} 
                  alt="Post content" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Post stats */}
            <div className="p-2 space-y-2">
              <div className="flex justify-between">
                <div className="flex gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-1 p-0"
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart 
                      size={20} 
                      className={post.isLiked ? "fill-red-500 text-red-500" : ""} 
                    />
                    <span>{formatCompactNumber(post.likes)}</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-1 p-0"
                  >
                    <MessageCircle size={20} />
                    <span>{formatCompactNumber(post.comments)}</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-1 p-0"
                  >
                    <Share2 size={20} />
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-0"
                  onClick={() => handleBookmark(post.id)}
                >
                  <Bookmark 
                    size={20} 
                    className={post.isBookmarked ? "fill-white" : ""} 
                  />
                </Button>
              </div>

              <div className="glass p-2 rounded-lg text-xs">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Creator Stats</span>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-auto p-0"
                    onClick={() => navigate(`/creator/${post.creator.userId}`)}
                  >
                    View Profile
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{formatCompactNumber(post.creator.followers)} followers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={14} />
                    <span>{formatCompactNumber(post.creator.investors)} investors</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground">{post.timePosted} ago</div>
            </div>
          </div>
        ))}
      </div>

      </div>

      {/* Investment Dialog */}
      <Dialog open={showInvestModal} onOpenChange={setShowInvestModal}>
        <DialogContent className="glass-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invest in {selectedCreator?.name}</DialogTitle>
            <DialogDescription>
              Support this creator by purchasing their creator tokens.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCreator && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <img 
                    src={selectedCreator.avatar} 
                    alt={selectedCreator.name}
                    className="w-full h-full object-cover" 
                  />
                </Avatar>
                <div>
                  <div className="font-semibold text-lg">{selectedCreator.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedCreator.handle}</div>
                </div>
              </div>
              
              <div className="glass p-4 rounded-lg space-y-4">
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Current Price</div>
                    <div className="text-2xl font-bold">${selectedCreator.stockPrice.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Price Change (24h)</div>
                    <div className={`text-xl font-bold ${selectedCreator.priceChange >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {selectedCreator.priceChange >= 0 ? "+" : ""}{selectedCreator.priceChange}%
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-muted-foreground">Investment Amount (tokens)</label>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="h-7 w-7" 
                        onClick={() => setInvestmentAmount(Math.max(10, investmentAmount - 10))}
                      >
                        <ChevronDown size={14} />
                      </Button>
                      <span className="w-10 text-center">{investmentAmount}</span>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="h-7 w-7" 
                        onClick={() => setInvestmentAmount(investmentAmount + 10)}
                      >
                        <ChevronUp size={14} />
                      </Button>
                    </div>
                  </div>
                  <Slider 
                    value={[investmentAmount]} 
                    min={10} 
                    max={500} 
                    step={10}
                    onValueChange={([value]) => setInvestmentAmount(value)} 
                    className="my-6" 
                  />
                  <div className="flex justify-between text-sm">
                    <span>Min: 10</span>
                    <span>Max: 500</span>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Cost</span>
                    <span>${(investmentAmount * selectedCreator.stockPrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Potential ROI (1yr)</span>
                    <span className="text-green-400">+{Math.round(selectedCreator.priceChange * 6)}%</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Tokens Received</span>
                    <span>{investmentAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowInvestModal(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              className="bg-white text-black hover:bg-white/90 border border-white/30"
              onClick={handleInvest}
            >
              Confirm Investment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Feed;
