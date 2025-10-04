import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Grid, LayoutGrid, Play, User2, ArrowUp, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { createClient } from '@supabase/supabase-js';
import { toast } from "sonner";

// Initialize Supabase client
const supabaseUrl = 'https://yyyfpcriefcurnosdmdv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5eWZwY3JpZWZjdXJub3NkbWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NDc4NjYsImV4cCI6MjA3NTEyMzg2Nn0.kp3jGsec1NrTeTUpRjPuCEV2p6IXjsyKOaIPYC6S8ug';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface CreatorData {
  id: string;
  user_id: string;
  current_stock_price: number;
  followers_count: number;
  created_at: string;
  intro_video_url?: string;
  sample_post_url?: string;
  user?: UserData;
  posts?: PostData[];
  totalInvestment?: number;
  investors_count?: number;
  stockHistory?: {date: string; price: number}[];
  priceChange?: number;
  sentiment?: {positive: number; neutral: number; negative: number};
}

interface PostData {
  id: string;
  creator_id: string;
  content: string;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  is_video?: boolean;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  profile_bio: string | null;
  profile_image_url: string | null;
  wallet_balance: number;
  created_at: string;
}

export default function CreatorProfileV2() {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [creator, setCreator] = useState<CreatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("1M");

  // Generate mock stock history data based on current price
  const generateStockHistory = (basePrice: number) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    const stockHistory = [];
    
    // Generate last 10 months of data (or less if we're early in the year)
    const numberOfMonths = Math.min(10, currentMonth + 1);
    let price = basePrice * 0.6; // Start at 60% of current price
    
    for (let i = 0; i < numberOfMonths; i++) {
      const monthIndex = (currentMonth - numberOfMonths + i + 12) % 12;
      stockHistory.push({
        date: months[monthIndex],
        price: parseFloat(price.toFixed(2))
      });
      
      // Random growth between -10% to +20% per month
      const growth = 1 + (Math.random() * 0.3 - 0.1);
      price *= growth;
    }
    
    // Add current month at current price
    stockHistory.push({
      date: months[currentMonth],
      price: basePrice
    });
    
    return stockHistory;
  };
  
  // Load creator data from Supabase
  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch creator data based on user_id
        const { data: creatorData, error: creatorError } = await supabase
          .from('creators')
          .select(`
            *,
            user:user_id(*)
          `)
          .eq('user_id', id)
          .single();

        if (creatorError) throw creatorError;
        
        if (!creatorData) {
          throw new Error('Creator not found');
        }

        // Fetch investments for this creator
        const { data: investmentsData, error: investmentsError } = await supabase
          .from('investments')
          .select('*')
          .eq('creator_id', creatorData.id);

        if (investmentsError) throw investmentsError;

        // Fetch posts for this creator
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('creator_id', creatorData.id)
          .order('created_at', { ascending: false });

        if (postsError) throw postsError;

        // Calculate total investment and investors count
        const totalInvestment = investmentsData 
          ? investmentsData.reduce((sum, inv) => sum + (inv.tokens_invested || 0), 0) 
          : 0;
        const investors_count = investmentsData ? new Set(investmentsData.map(inv => inv.fan_id)).size : 0;
        
        // Generate mock stock history based on current price
        const stockHistory = generateStockHistory(creatorData.current_stock_price);
        
        // Calculate price change percentage from previous month
        const previousPrice = stockHistory.length > 1 ? stockHistory[stockHistory.length - 2].price : creatorData.current_stock_price * 0.9;
        const priceChange = parseFloat((((creatorData.current_stock_price - previousPrice) / previousPrice) * 100).toFixed(1));

        // Add sentiment data
        const sentiment = {
          positive: Math.floor(Math.random() * 30) + 40, // 40-70%
          neutral: Math.floor(Math.random() * 20) + 20, // 20-40%
          negative: 0 // Will be calculated to make 100%
        };
        sentiment.negative = 100 - sentiment.positive - sentiment.neutral;

        // Process posts to separate videos
        const posts = postsData?.filter(post => !post.is_video) || [];
        const videos = postsData?.filter(post => post.is_video) || [];
        
        // Combine data
        setCreator({
          ...creatorData,
          user: creatorData.user,
          posts: postsData,
          totalInvestment,
          investors_count,
          stockHistory,
          priceChange,
          sentiment
        });

      } catch (err: any) {
        console.error('Error fetching creator data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorData();
  }, [id]);

  // Format numbers with k/M suffix
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex justify-center items-center">
        <div className="glass-card p-8 rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <TrendingUp className="w-10 h-10 animate-pulse text-accent" />
            <h2 className="text-xl">Loading creator profile...</h2>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !creator) {
    return (
      <div className="min-h-screen bg-gradient-hero flex justify-center items-center">
        <div className="glass-card p-8 rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <div className="text-red-500 text-2xl">⚠️</div>
            <h2 className="text-xl">Failed to load creator profile</h2>
            <p className="text-muted-foreground">{error || 'Creator not found'}</p>
            <Button onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center p-4 md:p-6">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between border-b border-white/20 pb-4 mb-6">
        <button 
          className="flex items-center text-sm"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <div className="flex gap-2">
          <Button className="glass-button px-4 py-2 bg-white text-black hover:bg-white/90 rounded-lg font-semibold">
            Follow
          </Button>
          <Button variant="outline" className="px-4 py-2">
            Share
          </Button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="w-full max-w-4xl glass-card p-4 md:p-6 mb-6 rounded-xl">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-white/20">
            <img 
              src={creator.user?.profile_image_url || "/user1.jpg"} 
              alt={creator.user?.name || "Creator"} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold">{creator.user?.name}</h2>
            <p className="text-muted-foreground">@{creator.user?.name?.toLowerCase().replace(/\s+/g, '') || 'creator'}</p>
            <p className="mt-4 text-foreground/80">{creator.user?.profile_bio || 'This creator has not added a bio yet.'}</p>
            
            {/* Stats Section */}
            <div className="flex justify-center md:justify-start space-x-8 mt-6">
              <div className="glass p-3 rounded-lg text-center">
                <p className="text-xl font-bold">{formatNumber(creator.followers_count || 0)}</p>
                <p className="text-muted-foreground text-sm">Followers</p>
              </div>
              <div className="glass p-3 rounded-lg text-center">
                <p className="text-xl font-bold">{formatNumber(creator.investors_count || 0)}</p>
                <p className="text-muted-foreground text-sm">Investors</p>
              </div>
              <div className="glass p-3 rounded-lg text-center">
                <p className="text-xl font-bold">${formatNumber((creator.totalInvestment || 0) * (creator.current_stock_price || 1))}</p>
                <p className="text-muted-foreground text-sm">Raised</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Chart & Investment Stats */}
      <div className="w-full max-w-4xl glass-card p-4 md:p-6 mb-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold">${creator.current_stock_price.toFixed(2)}</h3>
            <div className={`flex items-center text-sm ${(creator.priceChange || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              <ArrowUp className={`h-4 w-4 mr-1 ${(creator.priceChange || 0) < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(creator.priceChange || 0)}% {(creator.priceChange || 0) >= 0 ? 'up' : 'down'}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {["LIVE", "1W", "1M", "3M", "1Y", "ALL"].map((period) => (
              <Button 
                key={period}
                variant={timeRange === period ? "default" : "ghost"}
                size="sm"
                className={`px-2 py-1 text-xs ${timeRange === period ? 'bg-emerald-600 text-white' : 'glass'}`}
                onClick={() => setTimeRange(period)}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>

        {/* Stock Chart */}
        <div className="w-full h-64 relative mb-6">
          <div className="absolute inset-0 flex items-end">
            {/* Chart */}
            <svg width="100%" height="80%" viewBox="0 0 1000 300">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(16, 185, 129, 0.2)" />
                  <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
                </linearGradient>
              </defs>
              {creator.stockHistory && creator.stockHistory.length > 0 && (
                <>
                  <path 
                    d={`M0,300 L0,${300 - (creator.stockHistory[0]?.price || 0) * 5} ${creator.stockHistory.map((point, i) => 
                      `L${(i / (creator.stockHistory.length - 1)) * 1000},${300 - (point.price || 0) * 5}`
                    ).join(' ')} L1000,300 Z`}
                    fill="url(#chartGradient)"
                  />
                  <path 
                    d={`M0,${300 - (creator.stockHistory[0]?.price || 0) * 5} ${creator.stockHistory.map((point, i) => 
                      `L${(i / (creator.stockHistory.length - 1)) * 1000},${300 - (point.price || 0) * 5}`
                    ).join(' ')}`}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  {/* Current price point */}
                  <circle 
                    cx="1000" 
                    cy={300 - creator.current_stock_price * 5} 
                    r="6" 
                    fill="#10b981"
                    stroke="white"
                    strokeWidth="2"
                  />
                </>
              )}
            </svg>
          </div>
          
          {/* Y-axis labels */}
          <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-xs text-muted-foreground p-2">
            {[...Array(5)].map((_, i) => (
              <div key={i}>${(creator.current_stock_price * 1.5 - i * (creator.current_stock_price * 0.25)).toFixed(2)}</div>
            ))}
          </div>
          
          {/* X-axis labels */}
          <div className="absolute bottom-0 inset-x-0 flex justify-between text-xs text-muted-foreground p-2">
            {creator.stockHistory && creator.stockHistory
              .filter((_, i) => i % 3 === 0 || i === (creator.stockHistory?.length || 0) - 1)
              .map(point => (
                <div key={point.date}>{point.date}</div>
              ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="glass p-4 rounded-lg">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Market Cap</p>
                <p className="text-2xl font-bold">${formatNumber(creator.current_stock_price * 10000)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Volume (24h)</p>
                <p className="text-2xl font-bold">${formatNumber(creator.current_stock_price * 2500)}</p>
              </div>
            </div>
          </div>
          
          {/* Sentiment Chart */}
          <div className="glass p-4 rounded-lg flex items-center">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Investor Sentiment</p>
              <div className="relative h-16 w-full">
                {/* Sentiment bubbles */}
                {creator.sentiment && (
                  <>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-emerald-500/60 flex items-center justify-center">
                      <span className="text-lg font-bold text-white">{creator.sentiment.positive}%</span>
                    </div>
                    <div className="absolute right-16 top-0 w-10 h-10 rounded-full bg-gray-400/60 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{creator.sentiment.neutral}%</span>
                    </div>
                    <div className="absolute right-20 bottom-0 w-6 h-6 rounded-full bg-red-400/60 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">{creator.sentiment.negative}%</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="w-24 text-center">
              <div className="glass px-2 py-1 rounded-full text-xs mb-2 text-emerald-500 border border-emerald-500/30">
                {(creator.priceChange || 0) > 5 ? 'Bullish' : (creator.priceChange || 0) < 0 ? 'Bearish' : 'Neutral'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button className="glass-button px-6 py-3 bg-white text-black hover:bg-white/90 rounded-lg font-semibold flex-1">
            Invest Now
          </Button>
          <Button variant="outline" className="px-6 py-3 rounded-lg flex-1">
            Message Creator
          </Button>
        </div>
      </div>

      {/* Content Portfolio Tabs */}
      <div className="w-full max-w-4xl mb-8">
        <Tabs defaultValue="posts" onValueChange={setActiveTab} className="w-full">
          <TabsList className="glass grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="posts" className="flex items-center justify-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              <span>Posts</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              <span>Videos</span>
            </TabsTrigger>
            <TabsTrigger value="tagged" className="flex items-center justify-center gap-2">
              <User2 className="w-4 h-4" />
              <span>Featured</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts">
            {creator.posts && creator.posts.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {creator.posts
                  .filter(post => !post.is_video)
                  .map((post, id) => (
                    <div
                      key={`post-${post.id}`}
                      className="aspect-square overflow-hidden relative group"
                    >
                      <img 
                        src={post.image_url || `/user${(id % 3) + 1}.jpg`} 
                        alt={`Post ${id+1}`} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="p-2 text-xs text-white">
                          <p className="line-clamp-2">{post.content}</p>
                          <div className="flex gap-2 mt-1">
                            <span>❤️ {post.likes_count}</span>
                            <span>💬 {post.comments_count}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-8 text-center rounded-lg">
                <p className="text-muted-foreground">No posts found for this creator.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="videos">
            {creator.posts && creator.posts.filter(post => post.is_video).length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {creator.posts
                  .filter(post => post.is_video)
                  .map((post, id) => (
                    <div
                      key={`video-${post.id}`}
                      className="aspect-square overflow-hidden relative group"
                    >
                      <img 
                        src={post.image_url || `/user${(id % 3) + 1}.jpg`} 
                        alt={`Video ${id+1}`} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <p className="text-white text-xs line-clamp-1">{post.content}</p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="glass-card p-8 text-center rounded-lg">
                <p className="text-muted-foreground">No videos found for this creator.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="tagged">
            <div className="glass-card p-8 rounded-lg mb-4">
              <h3 className="text-lg font-bold mb-4">Featured Content</h3>
              <p className="text-sm text-muted-foreground">
                This section will show content where {creator.user?.name} has been featured or mentioned by others.
                Currently no featured content is available.
              </p>
            </div>
            
            <div className="glass p-4 rounded-lg">
              <h4 className="text-md font-semibold mb-2">Creator Milestones</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-sm">Joined Starvest on {new Date(creator.created_at).toLocaleDateString()}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-sm">Reached {formatNumber(creator.followers_count || 0)} followers</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-sm">Current token price: ${creator.current_stock_price.toFixed(2)}</span>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
