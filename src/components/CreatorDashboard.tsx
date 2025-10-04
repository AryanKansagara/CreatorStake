import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { TrendingUp, Coins, Users, DollarSign, BarChart2, MessageCircle, Image as ImageIcon } from "lucide-react";
import { createClient } from '@supabase/supabase-js';
import { toast } from "sonner";

// Initialize Supabase client
const supabaseUrl = 'https://yyyfpcriefcurnosdmdv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5eWZwY3JpZWZjdXJub3NkbWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NDc4NjYsImV4cCI6MjA3NTEyMzg2Nn0.kp3jGsec1NrTeTUpRjPuCEV2p6IXjsyKOaIPYC6S8ug';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
interface CreatorData {
  id: string;
  user_id: string;
  current_stock_price: number;
  followers_count: number;
  created_at: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  profile_bio: string | null;
  profile_image_url: string | null;
  created_at: string;
}

interface InvestorData {
  id: string;
  name: string;
  profile_image_url: string | null;
  tokens_invested: number;
  percentage_owned: number;
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

export const CreatorDashboard = () => {
  const [creatorData, setCreatorData] = useState<CreatorData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [investors, setInvestors] = useState<InvestorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalInvestedTokens, setTotalInvestedTokens] = useState(0);
  const [newPost, setNewPost] = useState({ content: '', imageUrl: '' });
  const [postLoading, setPostLoading] = useState(false);

  // Get current creator data from logged in user
  useEffect(() => {
    const fetchCreatorData = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("Error fetching user:", userError);
          toast.error("Please log in to access your dashboard");
          return;
        }
        
        // Get user profile
        const { data: userData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          toast.error("Error loading user profile");
          return;
        }
        
        // Get creator data
        const { data: creatorData, error: creatorError } = await supabase
          .from('creators')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (creatorError) {
          console.error("Error fetching creator data:", creatorError);
          toast.error("Error loading creator data");
          return;
        }

        // Fetch posts by this creator
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('creator_id', creatorData.id)
          .order('created_at', { ascending: false });
          
        if (postsError) {
          console.error("Error fetching posts:", postsError);
        }

        // Fetch investors for this creator
        const { data: investmentsData, error: investmentsError } = await supabase
          .from('investments')
          .select(`
            *,
            fans:fan_id(id, name, profile_image_url)
          `)
          .eq('creator_id', creatorData.id);
          
        if (investmentsError) {
          console.error("Error fetching investments:", investmentsError);
        }

        // Calculate total tokens invested
        const totalTokens = investmentsData?.reduce((sum, inv) => sum + inv.tokens_invested, 0) || 0;
        
        // Format investors data
        const formattedInvestors = investmentsData?.map(inv => ({
          id: inv.fans?.id,
          name: inv.fans?.name || 'Anonymous',
          profile_image_url: inv.fans?.profile_image_url,
          tokens_invested: inv.tokens_invested,
          percentage_owned: (inv.tokens_invested / totalTokens) * 100,
        })) || [];
        
        // Set all data
        setUserData(userData);
        setCreatorData(creatorData);
        setPosts(postsData || []);
        setInvestors(formattedInvestors);
        setTotalInvestedTokens(totalTokens);
        
      } catch (error) {
        console.error("Dashboard loading error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCreatorData();
  }, []);

  // Create a new post
  const handleCreatePost = async () => {
    if (!newPost.content.trim() || !creatorData) {
      toast.error("Please add some content to your post");
      return;
    }
    
    try {
      setPostLoading(true);
      
      // Create post in Supabase
      const { data, error } = await supabase
        .from('posts')
        .insert({
          creator_id: creatorData.id,
          content: newPost.content,
          image_url: newPost.imageUrl || null,
          likes_count: 0,
          comments_count: 0,
        })
        .select();
        
      if (error) {
        throw error;
      }
      
      // Add new post to the posts list
      setPosts([data[0], ...posts]);
      
      // Reset form
      setNewPost({ content: '', imageUrl: '' });
      toast.success("Post created successfully!");
      
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post: " + error.message);
    } finally {
      setPostLoading(false);
    }
  };

  // Format numbers with k/M suffix
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <TrendingUp className="w-12 h-12 text-accent animate-pulse" />
          <p className="text-xl">Loading your creator dashboard...</p>
        </div>
      </div>
    );
  }

  // No creator data
  if (!creatorData || !userData) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
        <Card className="p-8 glass-card w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Creator Account Required</h2>
          <p className="mb-6">You need to register as a creator to access this dashboard.</p>
          <Button>Register as Creator</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Creator Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your creator profile, posts, and track your stock performance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{userData.name}</p>
              <p className="text-sm text-muted-foreground">Creator since {formatDate(creatorData.created_at)}</p>
            </div>
            <div className="h-12 w-12 rounded-full overflow-hidden">
              <img 
                src={userData.profile_image_url || "/user1.jpg"} 
                alt={userData.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 glass-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg glass flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Stock Price</span>
            </div>
            <div className="text-3xl font-bold">${creatorData.current_stock_price.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground mt-1">per token</div>
          </Card>

          <Card className="p-6 glass-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg glass flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <span className="text-sm text-muted-foreground">Followers</span>
            </div>
            <div className="text-3xl font-bold">{formatNumber(creatorData.followers_count)}</div>
            <div className="text-xs text-muted-foreground mt-1">total followers</div>
          </Card>

          <Card className="p-6 glass-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg glass flex items-center justify-center">
                <Coins className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Tokens Invested</span>
            </div>
            <div className="text-3xl font-bold">{totalInvestedTokens}</div>
            <div className="text-xs text-success mt-1">Valued at ${(totalInvestedTokens * creatorData.current_stock_price).toFixed(2)}</div>
          </Card>

          <Card className="p-6 glass-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg glass flex items-center justify-center">
                <BarChart2 className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Investors</span>
            </div>
            <div className="text-3xl font-bold">{investors.length}</div>
            <div className="text-xs text-muted-foreground mt-1">active investors</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create Post Section */}
          <Card className="p-6 glass-card md:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Create Post
            </h2>
            <div className="space-y-4">
              <Textarea 
                placeholder="Share an update with your investors..." 
                className="min-h-[150px] glass resize-none"
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              />
              <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Image URL (optional)"
                  className="glass border-none"
                  value={newPost.imageUrl}
                  onChange={(e) => setNewPost({...newPost, imageUrl: e.target.value})}
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  className="glass-button px-6 py-2 bg-white text-black hover:bg-white/90 rounded-lg font-semibold"
                  onClick={handleCreatePost}
                  disabled={postLoading || !newPost.content.trim()}
                >
                  {postLoading ? 'Posting...' : 'Post Update'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Top Investors */}
          <Card className="p-6 glass-card">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Top Investors
            </h2>
            <div className="space-y-4 max-h-[350px] overflow-y-auto">
              {investors.length > 0 ? (
                investors
                  .sort((a, b) => b.tokens_invested - a.tokens_invested)
                  .slice(0, 5)
                  .map((investor, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img 
                            src={investor.profile_image_url || "/user1.jpg"} 
                            alt={investor.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{investor.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {investor.tokens_invested} tokens ({investor.percentage_owned.toFixed(1)}%)
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-accent/20 text-accent border-accent/30">
                        ${(investor.tokens_invested * creatorData.current_stock_price).toFixed(0)}
                      </Badge>
                    </div>
                  ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No investors yet
                </p>
              )}
              
              {investors.length > 5 && (
                <Button variant="ghost" className="w-full text-sm">
                  View All ({investors.length})
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Recent Posts */}
        <Card className="p-6 glass-card">
          <h2 className="text-2xl font-bold mb-6">Your Recent Posts</h2>
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="glass p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img 
                        src={userData.profile_image_url || "/user1.jpg"} 
                        alt={userData.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{userData.name}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(post.created_at)}</p>
                    </div>
                  </div>
                  <p className="mb-4">{post.content}</p>
                  {post.image_url && (
                    <div className="rounded-lg overflow-hidden mb-4 max-h-[300px]">
                      <img 
                        src={post.image_url} 
                        alt="Post" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>Seen by {Math.floor(Math.random() * investors.length)} investors</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments_count} comments</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>You haven't created any posts yet</p>
              <p className="text-sm">Share updates with your investors to keep them engaged</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
