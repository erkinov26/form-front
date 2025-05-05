'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

const ScrollDownArrow = () => {
  const [isVisible, setIsVisible] = useState(true);

  const scrollToSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const arrows = [0, 1, 2]; 

  return (
    <div
      onClick={scrollToSection}
      className={`fixed bottom-10 left-[50px] sm:hidden -translate-x-1/2 z-50 w-[100px] h-[160px] flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
        }`}
    >
      <div
        className="absolute w-[100px] h-[100px] rounded-full blur-2xl opacity-50 animate-pulse"
      />
      <div
        className="absolute w-[100px] h-[100px]"
      />

      <div className="relative z-10 flex flex-col gap-2">
        {arrows.map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: [0, 1, 0], y: [0, 25, 0] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: index * 0.35,
            }}
            className="text-white drop-shadow-lg"
          >
            <ChevronDown color='#0b4075' size={50} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ScrollDownArrow;
