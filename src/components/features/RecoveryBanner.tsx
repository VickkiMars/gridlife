import React from "react";
import { format } from "date-fns";
import { Zap } from "lucide-react";

interface RecoveryBannerProps {
  brokenStreakDate: Date;
  hoursRemaining: number;
  recoveryThreshold: number;
  onDismiss: () => void;
}

export const RecoveryBanner: React.FC<RecoveryBannerProps> = ({
  brokenStreakDate,
  hoursRemaining,
  recoveryThreshold,
  onDismiss
}) => {
  return (
    <div className="col-span-12 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="border-2 border-yellow-500/50 rounded-lg p-4 bg-yellow-900/10 backdrop-blur-md shadow-[0_0_15px_rgba(234,179,8,0.1)]">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 bg-yellow-500/20 p-2 rounded-full">
            <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-yellow-100 mb-1">Recovery Quest Active</h3>
            <p className="text-sm text-yellow-200/80 mb-3 leading-relaxed">
              Your streak was broken on <span className="text-white font-mono">{format(brokenStreakDate, 'MMM dd')}</span>. 
              Complete a task with <strong className="text-white bg-yellow-500/20 px-1 rounded">Impact Weight ≥ {recoveryThreshold}</strong> within the next <strong className="text-white">{hoursRemaining} hours</strong> to restore your streak.
            </p>
            <button onClick={onDismiss} className="px-3 py-1.5 text-xs font-medium bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 rounded border border-yellow-500/30 transition-colors">
              Dismiss Notification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};