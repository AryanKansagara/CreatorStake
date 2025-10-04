import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Grid, LayoutGrid, Play, User2, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";

// Mock data for creator profiles
const mockCreators = [
  {
    id: "1",
    name: "Sarah Chen",
    handle: "sarahstyle",
    avatar: "/user2.jpg",
    bio: "Fashion designer with a focus on sustainable, ethical clothing. My work has been featured in Vogue and displayed at Paris Fashion Week.",
    followers: 12500,
    investors: 320,
    raised: 4200,
    posts: ["/user1.jpg", "/user2.jpg", "/user3.jpg", "/user5.jpg", "/user1.jpg", "/user2.jpg", "/user3.jpg", "/user1.jpg", "/user2.jpg"],
    videos: ["/user2.jpg", "/user3.jpg"],
    tagged: ["/user1.jpg", "/user2.jpg"],
    stockPrice: 48.32,
    stockHistory: [
      { date: "Jan", price: 30.2 },
      { date: "Feb", price: 32.4 },
      { date: "Mar", price: 38.1 },
      { date: "Apr", price: 35.6 },
      { date: "May", price: 37.2 },
      { date: "Jun", price: 42.8 },
      { date: "Jul", price: 41.9 },
      { date: "Aug", price: 44.5 },
      { date: "Sep", price: 46.2 },
      { date: "Oct", price: 48.32 }
    ],
    priceChange: 12.7,
    sentiment: { positive: 53, neutral: 40, negative: 7 }
  },
  {
    id: "2",
    name: "Alex Rivera",
    handle: "alexcreates",
    avatar: "/user1.jpg",
    bio: "Game developer and digital artist creating immersive worlds and experiences. Working on my first major indie game launch.",
    followers: 8400,
    investors: 156,
    raised: 1800,
    posts: ["/user5.jpg", "/user3.jpg", "/user1.jpg", "/user2.jpg"],
    videos: ["/user5.jpg", "/user2.jpg"],
    tagged: ["/user3.jpg", "/user1.jpg"],
    stockPrice: 23.75,
    stockHistory: [
      { date: "Jan", price: 15.1 },
      { date: "Feb", price: 14.8 },
      { date: "Mar", price: 16.3 },
      { date: "Apr", price: 18.4 },
      { date: "May", price: 17.9 },
      { date: "Jun", price: 19.2 },
      { date: "Jul", price: 20.5 },
      { date: "Aug", price: 22.1 },
      { date: "Sep", price: 21.8 },
      { date: "Oct", price: 23.75 }
    ],
    priceChange: 5.2,
    sentiment: { positive: 48, neutral: 42, negative: 10 }
  },
  {
    id: "3",
    name: "Marcus Johnson",
    handle: "marcusmusic",
    avatar: "/user3.jpg",
    bio: "Independent musician and producer specializing in lo-fi beats and ambient soundscapes. Building my own studio one track at a time.",
    followers: 8900,
    investors: 215,
    raised: 2800,
    posts: ["/user2.jpg", "/user1.jpg", "/user5.jpg"],
    videos: ["/user3.jpg", "/user1.jpg"],
    tagged: ["/user2.jpg"],
    stockPrice: 12.85,
    stockHistory: [
      { date: "Jan", price: 15.2 },
      { date: "Feb", price: 14.6 },
      { date: "Mar", price: 13.8 },
      { date: "Apr", price: 12.5 },
      { date: "May", price: 11.9 },
      { date: "Jun", price: 12.1 },
      { date: "Jul", price: 11.7 },
      { date: "Aug", price: 12.3 },
      { date: "Sep", price: 12.6 },
      { date: "Oct", price: 12.85 }
    ],
    priceChange: -2.4,
    sentiment: { positive: 35, neutral: 45, negative: 20 }
  }
];

export default function CreatorProfileV2() {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [creator, setCreator] = useState(mockCreators[0]);
  const [timeRange, setTimeRange] = useState("1M");

  // Load creator data based on ID
  useEffect(() => {
    const foundCreator = mockCreators.find(c => c.id === id) || mockCreators[0];
    setCreator(foundCreator);
  }, [id]);

  // Format numbers with k/M suffix
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

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
              src={creator.avatar} 
              alt={creator.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold">{creator.name}</h2>
            <p className="text-muted-foreground">@{creator.handle}</p>
            <p className="mt-4 text-foreground/80">{creator.bio}</p>
            
            {/* Stats Section */}
            <div className="flex justify-center md:justify-start space-x-8 mt-6">
              <div className="glass p-3 rounded-lg text-center">
                <p className="text-xl font-bold">{formatNumber(creator.followers)}</p>
                <p className="text-muted-foreground text-sm">Followers</p>
              </div>
              <div className="glass p-3 rounded-lg text-center">
                <p className="text-xl font-bold">{formatNumber(creator.investors)}</p>
                <p className="text-muted-foreground text-sm">Investors</p>
              </div>
              <div className="glass p-3 rounded-lg text-center">
                <p className="text-xl font-bold">${formatNumber(creator.raised)}</p>
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
            <h3 className="text-xl font-bold">${creator.stockPrice.toFixed(2)}</h3>
            <div className={`flex items-center text-sm ${creator.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              <ArrowUp className={`h-4 w-4 mr-1 ${creator.priceChange < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(creator.priceChange)}% {creator.priceChange >= 0 ? 'up' : 'down'}
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
            {/* Mock Chart */}
            <svg width="100%" height="80%" viewBox="0 0 1000 300">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(16, 185, 129, 0.2)" />
                  <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
                </linearGradient>
              </defs>
              <path 
                d={`M0,300 L0,${300 - creator.stockHistory[0].price * 5} ${creator.stockHistory.map((point, i) => 
                  `L${(i / (creator.stockHistory.length - 1)) * 1000},${300 - point.price * 5}`
                ).join(' ')} L1000,300 Z`}
                fill="url(#chartGradient)"
              />
              <path 
                d={`M0,${300 - creator.stockHistory[0].price * 5} ${creator.stockHistory.map((point, i) => 
                  `L${(i / (creator.stockHistory.length - 1)) * 1000},${300 - point.price * 5}`
                ).join(' ')}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              />
              {/* Current price point */}
              <circle 
                cx="1000" 
                cy={300 - creator.stockPrice * 5} 
                r="6" 
                fill="#10b981"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
          </div>
          
          {/* Y-axis labels */}
          <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-xs text-muted-foreground p-2">
            {[...Array(5)].map((_, i) => (
              <div key={i}>${(creator.stockPrice * 1.5 - i * (creator.stockPrice * 0.25)).toFixed(2)}</div>
            ))}
          </div>
          
          {/* X-axis labels */}
          <div className="absolute bottom-0 inset-x-0 flex justify-between text-xs text-muted-foreground p-2">
            {creator.stockHistory.filter((_, i) => i % 3 === 0 || i === creator.stockHistory.length - 1).map(point => (
              <div key={point.date}>{point.date}</div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="glass p-4 rounded-lg">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Market Cap</p>
                <p className="text-2xl font-bold">${formatNumber(creator.stockPrice * 10000)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Volume (24h)</p>
                <p className="text-2xl font-bold">${formatNumber(creator.stockPrice * 2500)}</p>
              </div>
            </div>
          </div>
          
          {/* Sentiment Chart */}
          <div className="glass p-4 rounded-lg flex items-center">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Investor Sentiment</p>
              <div className="relative h-16 w-full">
                {/* Sentiment bubbles */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-emerald-500/60 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{creator.sentiment.positive}%</span>
                </div>
                <div className="absolute right-16 top-0 w-10 h-10 rounded-full bg-gray-400/60 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{creator.sentiment.neutral}%</span>
                </div>
                <div className="absolute right-20 bottom-0 w-6 h-6 rounded-full bg-red-400/60 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">{creator.sentiment.negative}%</span>
                </div>
              </div>
            </div>
            <div className="w-24 text-center">
              <div className="glass px-2 py-1 rounded-full text-xs mb-2 text-emerald-500 border border-emerald-500/30">Bullish</div>
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
              <span>Tagged</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts">
            <div className="grid grid-cols-3 gap-1">
              {creator.posts.map((img, id) => (
                <div
                  key={`post-${id}`}
                  className="aspect-square overflow-hidden relative group"
                >
                  <img 
                    src={img} 
                    alt={`Post ${id+1}`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="ghost" size="icon" className="text-white">
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="videos">
            <div className="grid grid-cols-3 gap-1">
              {creator.videos.map((video, id) => (
                <div
                  key={`video-${id}`}
                  className="aspect-square overflow-hidden relative group"
                >
                  <img 
                    src={video} 
                    alt={`Video ${id+1}`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tagged">
            <div className="grid grid-cols-3 gap-1">
              {creator.tagged.map((img, id) => (
                <div
                  key={`tagged-${id}`}
                  className="aspect-square overflow-hidden relative group"
                >
                  <img 
                    src={img} 
                    alt={`Tagged ${id+1}`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <div className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
                      <User2 className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
