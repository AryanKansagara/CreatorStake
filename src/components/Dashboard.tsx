import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Coins, Users, DollarSign } from "lucide-react";
import { Navigation } from "@/components/Navigation";

interface DashboardProps {
  userType: "fan" | "creator";
}

const mockInvestments = [
  {
    creator: "Alex Rivera",
    handle: "@alexcreates",
    invested: 200,
    currentValue: 340,
    return: 70,
    stake: 2.3,
    status: "growing",
    creatorImage: "/user1.jpg",
  },
  {
    creator: "Sarah Chen",
    handle: "@sarahstyle",
    invested: 150,
    currentValue: 285,
    return: 90,
    stake: 1.8,
    status: "growing",
    creatorImage: "/user2.jpg",
  },
  {
    creator: "Marcus Johnson",
    handle: "@marcusmusic",
    invested: 100,
    currentValue: 165,
    return: 65,
    stake: 1.2,
    status: "growing",  
    creatorImage: "/user3.jpg",
    
  },
];

export const Dashboard = ({ userType }: DashboardProps) => {
  const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.invested, 0);
  const totalValue = mockInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalReturn = ((totalValue - totalInvested) / totalInvested) * 100;

  return (
    <div className="min-h-screen bg-gradient-hero flex">
      {/* Navigation Sidebar */}
      <Navigation activePath="/dashboard" />
      
      {/* Main content */}
      <div className="ml-16 md:ml-64 flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Your Portfolio</h1>
          <p className="text-muted-foreground">
            Track your investments and returns in real-time
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 glass-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg glass flex items-center justify-center">
                <Coins className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Total Invested</span>
            </div>
            <div className="text-3xl font-bold">{totalInvested}</div>
            <div className="text-xs text-muted-foreground mt-1">tokens</div>
          </Card>

          <Card className="p-6 glass-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg glass flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <span className="text-sm text-muted-foreground">Current Value</span>
            </div>
            <div className="text-3xl font-bold">{totalValue}</div>
            <div className="text-xs text-muted-foreground mt-1">tokens</div>
          </Card>

          <Card className="p-6 glass-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg glass flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Total Return</span>
            </div>
            <div className="text-3xl font-bold text-accent">+{totalReturn.toFixed(1)}%</div>
            <div className="text-xs text-success mt-1">+{totalValue - totalInvested} tokens</div>
          </Card>

          <Card className="p-6 glass-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg glass flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Creators Backed</span>
            </div>
            <div className="text-3xl font-bold">{mockInvestments.length}</div>
            <div className="text-xs text-muted-foreground mt-1">active investments</div>
          </Card>
        </div>

        {/* Investments Table */}
        <Card className="p-6 glass-card">
          <h2 className="text-2xl font-bold mb-6">Your Investments</h2>
          <div className="space-y-4">
            {mockInvestments.map((investment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg glass hover:border-white/20 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={"/user1.jpg"}
                    alt={investment.creator}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">Test</div>
                    <div className="text-sm text-muted-foreground">{investment.handle}</div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-8 flex-1">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Invested</div>
                    <div className="font-semibold">{investment.invested} tokens</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Current Value</div>
                    <div className="font-semibold text-accent">{investment.currentValue} tokens</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Return</div>
                    <div className="font-semibold text-success">+{investment.return}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Your Stake</div>
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{investment.stake}%</div>
                      <Badge variant="secondary" className="text-xs">
                        {investment.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
};
