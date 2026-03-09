import React, { useEffect, useState } from 'react';

/**
 * FloatingActionButton Component
 * - Mobile-optimized FAB
 * - Positioned in thumb-zone (bottom 25% of screen on mobile)
 * - Smooth animations
 */

const FloatingActionButton = ({ 
  onClick, 
  icon = '➕', 
  label = 'Action',
  variant = 'primary',
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      
      // Hide FAB when scrolling down, show when scrolling up
      if (st > lastScrollTop) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollTop(st <= 0 ? 0 : st);
    };

    window.addEventListener('scroll', handleScroll, false);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  return (
    <button
      onClick={onClick}
      className={`fab fixed bottom-6 right-6 w-16 h-16 rounded-full bg-accent text-white
        flex items-center justify-center shadow-lg
        transition-all duration-300 hover:shadow-xl hover:scale-110 hover:bottom-7
        focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'}
        ${variant === 'secondary' ? 'bg-surface-light text-accent border border-accent' : ''}
        ${className}
        
        md:bottom-8 md:right-8
        sm:bottom-4 sm:right-4
        z-40
      `}
      title={label}
    >
      <span className="text-2xl">{icon}</span>
    </button>
  );
};

export default FloatingActionButton;
