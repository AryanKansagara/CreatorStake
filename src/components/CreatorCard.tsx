import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Sparkles } from "lucide-react";
import { useState } from "react";
import { InvestmentModal } from "@/components/InvestmentModal";

interface CreatorCardProps {
  id: string;
  name: string;
  handle: string;
  discoveryIndex: number;
  category: string;
  followers: string;
  growth: string;
  investmentAmount: number;
  totalBackers: number;
  content: string;
  avatar: string;
  creatorImage: string;
}

export const CreatorCard = ({
  id,
  name,
  handle,
  discoveryIndex,
  category,
  followers,
  growth,
  investmentAmount,
  totalBackers,
  content,
  avatar,
  creatorImage
}: CreatorCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="group relative rounded-2xl glass-card hover:shadow-glow transition-all duration-300 overflow-hidden">
        {/* Discovery Index Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full glass">
            <Sparkles className="w-3 h-3 text-primary-foreground" />
            <span className="text-sm font-bold text-primary-foreground">{discoveryIndex}</span>
          </div>
        </div>

        <div className="p-6">
          {/* Creator Profile */}
          <div className="flex items-start gap-4 mb-4">
            <img
              src={creatorImage}
              alt={name}
              className="w-16 h-16 rounded-full border-2 border-primary/20 object-cover"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">{name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{handle}</p>
              <Badge variant="secondary" className="text-xs">
                {category}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <p className="text-sm text-foreground mb-6 line-clamp-2">{content}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded-lg glass">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Followers</div>
              <div className="text-sm font-bold">{followers}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Growth</div>
              <div className="text-sm font-bold text-success flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {growth}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Backers</div>
              <div className="text-sm font-bold flex items-center gap-1">
                <Users className="w-3 h-3" />
                {totalBackers}
              </div>
            </div>
          </div>

          {/* Investment Info */}
          <div className="flex items-center justify-between p-4 rounded-lg glass mb-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Min. Investment</div>
              <div className="text-lg font-bold">{investmentAmount} tokens</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">Projected ROI</div>
              <div className="text-lg font-bold text-accent">+{(discoveryIndex * 20).toFixed(0)}%</div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            className="w-full glass-button shadow-glow bg-white text-white hover:text-black"
            size="lg"
            onClick={() => setIsModalOpen(true)}
          >
            Back This Creator
          </Button>
        </div>
      </div>

      <InvestmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        creator={{ name, handle, avatar, minInvestment: investmentAmount }}
      />
    </>
  );
};
