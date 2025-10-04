import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Coins, TrendingUp, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: {
    name: string;
    handle: string;
    avatar: string;
    minInvestment: number;
  };
}

export const InvestmentModal = ({
  isOpen,
  onClose,
  creator,
}: InvestmentModalProps) => {
  const [investment, setInvestment] = useState(creator.minInvestment);
  const maxInvestment = 500;
  const potentialReturn = investment * 1.8;
  const stakePercentage = (investment / 1000) * 100;

  const handleInvest = () => {
    toast.success("Investment Successful!", {
      description: `You've backed ${creator.name} with ${investment} tokens`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md glass-card">
        <DialogHeader>
          <DialogTitle className="text-2xl">Back {creator.name}</DialogTitle>
          <DialogDescription>
            Invest tokens to secure your stake in their success
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Creator Info */}
          <div className="flex items-center gap-3 p-4 rounded-lg glass">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="font-semibold">{creator.name}</div>
              <div className="text-sm text-muted-foreground">{creator.handle}</div>
            </div>
          </div>

          {/* Investment Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Investment Amount</label>
              <div className="flex items-center gap-2 text-2xl font-bold">
                <Coins className="w-5 h-5 text-accent" />
                {investment}
              </div>
            </div>
            <Slider
              value={[investment]}
              onValueChange={(value) => setInvestment(value[0])}
              min={creator.minInvestment}
              max={maxInvestment}
              step={10}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Min: {creator.minInvestment}</span>
              <span>Max: {maxInvestment}</span>
            </div>
          </div>

          {/* Investment Details */}
          <div className="space-y-3 p-4 rounded-lg glass">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Your Stake</span>
              <span className="text-sm font-semibold">{stakePercentage.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Potential Return</span>
              <span className="text-sm font-semibold text-accent flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {potentialReturn.toFixed(0)} tokens (+80%)
              </span>
            </div>
          </div>

          {/* Warning */}
          <div className="flex gap-2 p-3 rounded-lg glass">
            <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Returns are estimates based on creator potential. Actual returns may vary.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 glass-button">
              Cancel
            </Button>
            <Button onClick={handleInvest} className="flex-1 glass-button shadow-glow">
              Confirm Investment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
