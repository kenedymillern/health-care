'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [doorsLoaded, setDoorsLoaded] = useState(false);

  // Simulate loading effect (like waiting for images before opening)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDoorsLoaded(true);
      setTimeout(() => setIsDoorOpen(true), 400); // open after small delay
    }, 600); // simulate preload

    return () => clearTimeout(timeout);
  }, []);

  const doorVariants = {
    closed: { x: 0 },
    open: (side: string) => ({
      x: side === 'left' ? '-85%' : '85%',
      transition: { duration: 1.8, delay: 0.6 },
    }),
  };

  const contentVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, delay: 1.2 },
    },
  };

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-r from-[#1E3A8A] to-[#065F46]">
      {/* Sliding White Doors */}
      <div className="door-container absolute inset-0 z-20 flex">
        {/* Left Door */}
        <motion.div
          className="door-panel flex-1 bg-white"
          variants={doorVariants}
          initial="closed"
          animate={isDoorOpen ? 'open' : 'closed'}
          custom="left"
        />

        {/* Right Door */}
        <motion.div
          className="door-panel flex-1 bg-white"
          variants={doorVariants}
          initial="closed"
          animate={isDoorOpen ? 'open' : 'closed'}
          custom="right"
        />
      </div>

      {/* Hero Content */}
      {doorsLoaded && (
        <motion.div
          className="relative text-center max-w-[90%] mx-auto z-10 px-4 -mt-30"
          variants={contentVariants}
          initial="initial"
          animate="animate"
        >
          <div className="p-6 md:p-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-lora leading-tight drop-shadow-lg text-white">
              Unlocking <span className="text-yellow-400">Health Solutions</span>
              <br />
              for Real <span className="text-yellow-400">Impact</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 font-poppins drop-shadow-sm">
              Providing personalized care to support your loved ones at home.
            </p>
          </div>
        </motion.div>
      )}
    </section>
  );
}
