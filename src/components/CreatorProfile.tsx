import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { TrendingUp, ChevronLeft } from "lucide-react";

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
  totalInvestment?: number;
  investors_count?: number;
  posts?: PostData[];
}

interface PostData {
  id: string;
  creator_id: string;
  content: string;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
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

export default function CreatorProfile() {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const [creator, setCreator] = useState<CreatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Format numbers with k/M suffix
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  // Fetch creator data from Supabase
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
          ? investmentsData.reduce((sum, inv) => sum + inv.tokens_invested, 0) 
          : 0;
        const investors_count = investmentsData ? new Set(investmentsData.map(inv => inv.fan_id)).size : 0;

        // Combine data
        setCreator({
          ...creatorData,
          user: creatorData.user,
          totalInvestment,
          investors_count,
          posts: postsData
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
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center p-6">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between border-b border-white/20 pb-4 mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost"
            className="mr-4 p-2"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Creator Profile</h1>
        </div>
        <Button className="glass-button px-4 py-2 bg-white text-black hover:bg-white/90 rounded-lg font-semibold">
          Follow
        </Button>
      </div>

      {/* Profile Section */}
      <div className="w-full max-w-4xl glass-card p-6 mb-8 rounded-xl">
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
            <p className="mt-4 text-foreground/80">
              {creator.user?.profile_bio || 'This creator has not added a bio yet.'}
            </p>
            
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

      {/* Investment Stats */}
      <div className="w-full max-w-4xl glass-card p-6 mb-8 rounded-xl">
        <h3 className="text-xl font-bold mb-4">Investment Opportunities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Current Valuation</p>
            <p className="text-2xl font-bold">
              ${formatNumber((creator.current_stock_price || 1) * 10000)} {/* Estimate based on stock price */}
            </p>
          </div>
          <div className="glass p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Minimum Investment</p>
            <p className="text-2xl font-bold">10 tokens</p>
          </div>
          <div className="glass p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Price per Token</p>
            <p className="text-2xl font-bold">${creator.current_stock_price?.toFixed(2) || '1.00'}</p>
          </div>
          <div className="glass p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Projected ROI (1yr)</p>
            <p className="text-2xl font-bold text-accent">+{Math.round((Math.random() * 30) + 20)}%</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex mt-6 space-x-4">
          <Button className="glass-button px-6 py-3 bg-white text-black hover:bg-white/90 rounded-lg font-semibold flex-1">
            Invest Now
          </Button>
          <Button variant="outline" className="px-6 py-3 rounded-lg flex-1">
            Message Creator
          </Button>
        </div>
      </div>

      {/* Content Portfolio */}
      <div className="w-full max-w-4xl mb-8">
        <h3 className="text-xl font-bold mb-4">Portfolio Highlights</h3>
        {creator.posts && creator.posts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {creator.posts.map((post, id) => (
              <div
                key={post.id}
                className="glass rounded-lg overflow-hidden"
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={post.image_url || `/user${(id % 3) + 1}.jpg`} 
                    alt={`Portfolio item ${id+1}`} 
                    className="w-full h-full object-cover hover:scale-105 transition-all duration-300"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm line-clamp-2">{post.content}</p>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>❤️ {post.likes_count}</span>
                    <span>💬 {post.comments_count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center rounded-lg">
            <p className="text-muted-foreground">No portfolio items found for this creator.</p>
          </div>
        )}
      </div>
    </div>
  );
}
