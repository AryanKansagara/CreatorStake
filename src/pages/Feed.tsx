"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@supabase/supabase-js";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvestmentAdvisor from "@/components/InvestmentAdvisor";
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
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  DollarSign,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

/* ---------- Supabase ---------- */
const supabaseUrl = "https://yyyfpcriefcurnosdmdv.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5eWZwY3JpZWZjdXJub3NkbWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NDc4NjYsImV4cCI6MjA3NTEyMzg2Nn0.kp3jGsec1NrTeTUpRjPuCEV2p6IXjsyKOaIPYC6S8ug";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ---------- Types ---------- */
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
  userId: string;
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

/* ---------- Utils ---------- */
const getRelativeTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

const formatCompactNumber = (num: number): string => {
  if (num < 1000) return `${num}`;
  if (num < 1_000_000) return `${(num / 1000).toFixed(1)}k`;
  return `${(num / 1_000_000).toFixed(1)}M`;
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  return `${Math.floor(diffInSeconds / 86400)}d`;
};

/* ---------- Component ---------- */
const Feed = () => {
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState(100);
  const [showAdvisor, setShowAdvisor] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Invest modal
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState(100);

  /* ---------- Data ---------- */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: creatorsData, error: creatorsError } = await supabase
          .from("creators")
          .select(`*, users:user_id(*)`);
        if (creatorsError) throw creatorsError;

        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false });
        if (postsError) throw postsError;

        const creatorsMap: Record<string, Creator> = {};
        creatorsData.forEach((c: any) => {
          const name = c.users?.name || "Unknown Creator";
          const handle = `@${name.toLowerCase().replace(/\s+/g, "")}`;
          creatorsMap[c.id] = {
            id: c.id,
            userId: c.user_id,
            name,
            handle,
            avatar: c.users?.profile_image_url || "/user1.jpg",
            verified: Math.random() > 0.5,
            stockPrice: c.current_stock_price || 1.0,
            priceChange: parseFloat(((Math.random() * 20) - 5).toFixed(1)),
            followers: c.followers_count || 0,
            investors: Math.floor((c.followers_count || 0) / 8),
          };
        });

        const formattedPosts = (postsData as DbPost[])
          .map((p) => {
            const creator = creatorsMap[p.creator_id];
            if (!creator) return null;
            return {
              id: p.id,
              creator,
              content: p.content,
              image: p.image_url || "/user1.jpg",
              likes: p.likes_count,
              comments: p.comments_count,
              isLiked: Math.random() > 0.5,
              isBookmarked: Math.random() > 0.7,
              timePosted: getRelativeTime(p.created_at),
            } as Post;
          })
          .filter(Boolean) as Post[];

        const formattedStories = Object.values(creatorsMap).map((cr) => ({
          id: cr.id,
          name: cr.handle.substring(1),
          avatar: cr.avatar,
          hasNew: Math.random() > 0.3,
        }));

        // const genericNames = [
        //   "minhhgoc",
        //   "aidan_du",
        //   "emmaa.w",
        // ];
        // const additionalStories = genericNames.map((name, i) => ({
        //   id: `generic-${i}`,
        //   name,
        //   avatar: `/user${(i % 3) + 1}.jpg`,
        //   hasNew: Math.random() > 0.3,
        // }));

        setPosts(formattedPosts);
        setStories([...formattedStories, ]);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
        toast.error("Failed to load feed data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---------- Handlers ---------- */
  const handleLike = (postId: string) =>
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );

  const handleBookmark = (postId: string) =>
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p))
    );

  const openInvestModal = (creator: Creator) => {
    setSelectedCreator(creator);
    setShowInvestModal(true);
  };

  const handleInvest = () => {
    if (!selectedCreator) return;
    toast.success(
      `Successfully invested ${investmentAmount} tokens in ${selectedCreator.name}'s creator stock!`
    );
    setShowInvestModal(false);
    setInvestmentAmount(100);
  };

  /* ---------- States ---------- */
  
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
      console.error("Sign out error:", error);
      toast.error("Failed to sign out: " + (error.message || "Unknown error"));
    } finally {
      setIsSigningOut(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero grid place-items-center">
        <div className="glass-card rounded-2xl p-8 flex items-center gap-3">
          <TrendingUp className="w-6 h-6 animate-pulse text-accent" />
          <span className="text-lg">Loading creator feeds…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero grid place-items-center">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="text-red-500 text-2xl mb-2">⚠️</div>
          <p className="mb-4">Failed to load feed</p>
          <Button onClick={() => window.location.reload()}>Try again</Button>
        </div>
      </div>
    );
  }

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gradient-hero relative flex">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -z-10 -left-40 top-1/3 w-[600px] h-[600px] rounded-full blur-3xl opacity-50 bg-[radial-gradient(ellipse_at_center,_rgba(251,191,36,.08),_transparent_60%)]" />
      <div className="pointer-events-none absolute -z-10 right-[-10%] top-1/2 w-[520px] h-[520px] rounded-full blur-3xl opacity-40 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,.08),_transparent_60%)]" />

      {/* Left rail */}
      <Navigation activePath="/feed" />
      {/* --- left-rail bottom image (soft blend) --- */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-0 bottom-0 z-[1] w-16 md:w-64 h-36 md:h-52"
      >
        <div className="relative h-full w-full overflow-hidden rounded-tr-2xl">
          {/* TODO: replace with your image path in /public */}
          <img
            src="/feed_imgs/collage_1.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* fade up to black so it merges with the pane above */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          {/* subtle seam blur at the top edge */}
          <div className="absolute -top-8 inset-x-0 h-16 backdrop-blur-md" />
        </div>
      </div>








      {/* Main column */}
      <div className="ml-16 md:ml-64 flex-1">

        {/* Top header */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-black/40 border-b border-white/10">
          <div className="container max-w-4xl mx-auto px-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Your Feed</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowAdvisor(true)}>
                <TrendingUp size={16} />
                <span className="hidden sm:inline">Investment Advisor</span>
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full">
                <Bell size={20} />
              </Button>
            </div>

          </div>
        </header>

        {/* Category pills (visual only) */}
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <Tabs defaultValue="all">
            <TabsList className="bg-white/5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="tech">Tech</TabsTrigger>
              <TabsTrigger value="music">Music</TabsTrigger>
              <TabsTrigger value="fashion">Fashion</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Stories */}
        <div className="max-w-4xl mx-auto px-4 mt-6 mb-8 overflow-x-auto">
          <div className="flex gap-6 pb-4 pl-2">
            {/* Your story */}
            <div className="w-[110px] cursor-pointer group">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-white/[0.03] ring-1 ring-white/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_60px_rgba(0,0,0,.45)]">
                <div className="absolute inset-0 grid place-items-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 grid place-items-center">
                    <div className="w-8 h-8 rounded-full bg-yellow-500/80 grid place-items-center">
                      <span className="text-lg">+</span>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-3 text-center text-xs font-medium">
                  Your Story
                </div>
              </div>
            </div>

            {stories.map((story, i) => (
              <div key={story.id} className="w-[110px] cursor-pointer group">
                <div
                  className={[
                    "relative rounded-2xl overflow-hidden aspect-[4/5]",
                    "bg-cover bg-center ring-1 ring-white/10",
                    "transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_60px_rgba(0,0,0,.45)]",
                  ].join(" ")}
                  style={{ backgroundImage: `url(${story.avatar})` }}
                >
                  <div className="absolute top-3 left-1/2 -translate-x-1/2">
                    <div
                      className={`w-10 h-10 rounded-full overflow-hidden ring-2 ${
                        story.hasNew ? "ring-yellow-400/90" : "ring-white/20"
                      }`}
                    >
                      <img src={story.avatar} alt={story.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 flex items-end justify-center pb-3">
                    <span className="text-xs font-medium truncate max-w-[90%]">{story.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feed list */}
        <div className="max-w-4xl mx-auto px-4 pb-12 space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group relative overflow-hidden rounded-2xl bg-[#0b0b0c]/60 ring-1 ring-white/10 shadow-[0_20px_60px_rgba(0,0,0,.45)] transition-transform duration-300 hover:-translate-y-1"
            >
              {/* header */}
              <div className="px-4 py-3 flex items-start justify-between border-b border-white/5">
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
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
                    <DollarSign
                      size={14}
                      className={post.creator.priceChange >= 0 ? "text-green-400" : "text-red-400"}
                    />
                    <span className="font-medium">${post.creator.stockPrice.toFixed(2)}</span>
                    <span
                      className={post.creator.priceChange >= 0 ? "text-green-400" : "text-red-400"}
                    >
                      {post.creator.priceChange >= 0 ? "+" : ""}
                      {post.creator.priceChange}%
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="mt-2 bg-white text-black hover:bg-white/90 border border-white/30"
                    onClick={() => openInvestModal(post.creator)}
                  >
                    Invest
                  </Button>
                </div>
              </div>

              {/* text */}
              {post.content && (
                <p className="px-4 pt-3 text-[15px] text-white/90">{post.content}</p>
              )}

              {/* media */}
              <div className="relative mt-2">
                <div className="aspect-[16/9] w-full overflow-hidden">
                  <img src={post.image} alt="" className="w-full h-full object-cover" />
                </div>
                {/* feathered edges so media blends with card */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35" />
              </div>

              {/* actions */}
              <div className="px-3 pb-3 pt-2 space-y-2">
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 px-2"
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart
                        size={20}
                        className={post.isLiked ? "fill-red-500 text-red-500" : ""}
                      />
                      <span>{formatCompactNumber(post.likes)}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 px-2">
                      <MessageCircle size={20} />
                      <span>{formatCompactNumber(post.comments)}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="px-2">
                      <Share2 size={20} />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-2"
                    onClick={() => handleBookmark(post.id)}
                  >
                    <Bookmark size={20} className={post.isBookmarked ? "fill-white" : ""} />
                  </Button>
                </div>

                {/* creator snapshot */}
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
            </article>
          ))}
        </div>
      </div>

      {/* Invest dialog (unchanged logic) */}
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
                    <div
                      className={`text-xl font-bold ${
                        selectedCreator.priceChange >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {selectedCreator.priceChange >= 0 ? "+" : ""}
                      {selectedCreator.priceChange}%
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-muted-foreground">
                      Investment Amount (tokens)
                    </label>
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
                    <span className="text-green-400">
                      +{Math.round(selectedCreator.priceChange * 6)}%
                    </span>
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
            <Button type="button" variant="outline" onClick={() => setShowInvestModal(false)}>
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

      {/* Investment Advisor */}
      <InvestmentAdvisor 
        isOpen={showAdvisor} 
        onClose={() => setShowAdvisor(false)} 
      />
    </div>
  );
};

export default Feed;
