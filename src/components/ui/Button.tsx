import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'md' | 'lg';
  icon?: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200";
  
  const variants = {
    primary: "bg-[#FF4F00] text-white hover:scale-105 shadow-lg shadow-orange-500/20 hover:bg-opacity-90",
    outline: "bg-white dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] text-[#171717] dark:text-[#EDEDED] hover:bg-gray-50 dark:hover:bg-gray-800",
    ghost: "text-[#666666] dark:text-[#A1A1A1] hover:text-[#171717] dark:hover:text-[#EDEDED]"
  };

  const sizes = {
    md: "h-12 px-8 text-sm",
    lg: "h-14 px-8 text-lg"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
      {icon && <span className="material-symbols-outlined text-sm">{icon}</span>}
    </button>
  );
};

export default Button;