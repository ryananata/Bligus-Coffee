import React from "react";
import { OrderStatus } from "@/types";
import { Clock, Flame, Coffee, CheckCircle2 } from "lucide-react";

interface StatusTrackerProps {
  currentStatus: OrderStatus;
}

const STEPS: { status: OrderStatus; label: string; icon: React.FC<{ className?: string }> }[] = [
  { status: "Menunggu Diproses", label: "Menunggu", icon: Clock },
  { status: "Sedang Diproses", label: "Diproses", icon: Flame },
  { status: "Siap Diambil", label: "Siap Diambil", icon: Coffee },
  { status: "Selesai", label: "Selesai", icon: CheckCircle2 },
];

export const StatusTracker: React.FC<StatusTrackerProps> = ({ currentStatus }) => {
  const currentIndex = STEPS.findIndex((s) => s.status === currentStatus);

  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between relative">
        {/* Track Line */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-[#352519]/15 rounded-full z-0" />
        <div
          className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-[#352519] rounded-full transition-all duration-500 z-0"
          style={{
            width: `${(Math.max(0, currentIndex) / (STEPS.length - 1)) * 90}%`,
          }}
        />

        {/* Step Nodes */}
        {STEPS.map((step, index) => {
          const isPassed = index < currentIndex;
          const isCurrent = index === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  isCurrent
                    ? "bg-[#352519] text-[#EEEBE7] border-[#352519] ring-4 ring-[#352519]/20 scale-110"
                    : isPassed
                    ? "bg-[#352519] text-[#EEEBE7] border-[#352519]"
                    : "bg-[#EEEBE7] text-[#352519]/40 border-[#352519]/25"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-[10px] sm:text-xs font-bold mt-1.5 text-center leading-tight whitespace-nowrap ${
                  isCurrent
                    ? "text-[#352519]"
                    : isPassed
                    ? "text-[#352519]/80"
                    : "text-[#352519]/40"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
