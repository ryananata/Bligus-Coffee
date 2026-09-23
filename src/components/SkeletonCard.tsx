import React from "react";

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-[#EEEBE7] rounded-3xl p-4 sm:p-5 border border-[#352519]/10 animate-pulse flex flex-col justify-between">
      <div>
        {/* Skeleton Image */}
        <div className="w-full aspect-[4/3] rounded-2xl bg-[#352519]/10 mb-4" />

        {/* Skeleton Title & Tag */}
        <div className="h-5 bg-[#352519]/15 rounded-md w-3/4 mb-2" />
        <div className="h-3 bg-[#352519]/10 rounded-md w-full mb-1" />
        <div className="h-3 bg-[#352519]/10 rounded-md w-2/3" />
      </div>

      {/* Skeleton Bottom Action */}
      <div className="mt-5 pt-3 border-t border-[#352519]/10 flex items-center justify-between gap-4">
        <div className="h-5 bg-[#352519]/15 rounded-md w-20" />
        <div className="h-10 bg-[#352519]/20 rounded-2xl w-28" />
      </div>
    </div>
  );
};
