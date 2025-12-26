import React from 'react';
import Button from './ui/Button';

const Hero: React.FC = () => {
  const gridPattern = "bg-[length:40px_40px] opacity-[0.4] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)] pointer-events-none";

  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden">
      <div className={`absolute inset-0 z-0 ${gridPattern} bg-[linear-gradient(to_right,#E5E5E5_1px,transparent_1px),linear-gradient(to_bottom,#E5E5E5_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]`} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-gray-900 via-gray-800 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-500 pb-2">
          See the heat behind<br />every heartbeat of work.
        </h1>
        <p className="mt-4 text-xl text-[#666666] dark:text-[#A1A1A1] max-w-2xl mx-auto leading-relaxed">
          Transform raw task completion data into actionable visual heatmaps. 
          Identify bottlenecks, optimize flow, and empower your teams with precision analytics.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Button icon="arrow_forward">Start Analyzing</Button>
          <Button variant="outline" icon="play_circle">Watch Demo</Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;