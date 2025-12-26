import React from 'react';
import Button from './ui/Button';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed w-full z-50 top-0 border-b border-[#E5E5E5] dark:border-[#262626] bg-[#FFFFFF]/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 rounded-md flex items-center justify-center">
              <span className="material-symbols-outlined text-white dark:text-black text-lg">layers</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">FocusMetrics</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#666666] dark:text-[#A1A1A1]">
            {['Product', 'Solutions', 'Enterprise', 'Pricing'].map(link => (
              <a key={link} className="hover:text-[#171717] dark:hover:text-[#EDEDED] transition-colors" href={`#${link.toLowerCase()}`}>{link}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:block h-auto px-0">Log in</Button>
            <Button size="md">Request Demo</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;