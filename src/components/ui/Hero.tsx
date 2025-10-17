'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  { title: 'Compassionate Home Care', description: 'Providing personalized care to support your loved ones at home.' },
  { title: 'Expert Medical Support', description: 'Skilled professionals delivering top-tier medical assistance.' },
  { title: 'Holistic Wellness Plans', description: 'Tailored wellness programs to enhance quality of life.' },
  { title: '24/7 Care Availability', description: 'Round-the-clock support for peace of mind.' },
  { title: 'Rehabilitation Services', description: 'Specialized care to aid recovery and independence.' },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [doorsLoaded, setDoorsLoaded] = useState(false);

  // Preload door images
  useEffect(() => {
    const left = new Image();
    const right = new Image();
    let loadedCount = 0;

    const handleLoad = () => {
      loadedCount += 1;
      if (loadedCount === 2) {
        setDoorsLoaded(true);
        setTimeout(() => setIsDoorOpen(true), 400); // open after load
      }
    };

    left.src = '/images/door_left.png';
    right.src = '/images/door_right.png';
    left.onload = handleLoad;
    right.onload = handleLoad;
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
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
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.6, delay: 1.2 } },
  };

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-blue-900">
      {/* Sliding Doors */}
      <div className="door-container absolute inset-0 z-20 flex">
        <motion.div
          className="door-panel door-panel-left relative"
          style={{
            backgroundImage: 'url(/images/door_left.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          variants={doorVariants}
          initial="closed"
          animate={isDoorOpen ? 'open' : 'closed'}
          custom="left"
        >
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/70 via-black/30 to-transparent shadow-2xl"></div>
        </motion.div>

        <motion.div
          className="door-panel door-panel-right relative"
          style={{
            backgroundImage: 'url(/images/door_right.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          variants={doorVariants}
          initial="closed"
          animate={isDoorOpen ? 'open' : 'closed'}
          custom="right"
        >
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/70 via-black/30 to-transparent shadow-2xl"></div>
        </motion.div>
      </div>

      {/* Carousel Content (only show after doors are loaded) */}
      {doorsLoaded && (
        <motion.div
          className="relative text-center max-w-[90%] mx-auto z-10 px-4"
          variants={contentVariants}
          initial="initial"
          animate="animate"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              className="p-6 md:p-10 -mt-30"
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <h1 className="text-2xl sm:text-3xl font-lora font-bold text-white drop-shadow-md">
                {slides[currentSlide].title}
              </h1>
              <p className="mt-4 text-lg text-gray-100 font-poppins drop-shadow-sm">
                {slides[currentSlide].description}
              </p>
              <div className="mt-8 cursor-pointer">
                <motion.a
                  whileHover="hover"
                  whileTap="tap"
                  href="/contact"
                  className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1E3A8A] px-3 py-2 rounded-full font-inter text-sm md:text-base lg:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  See More
                </motion.a>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Indicators */}
          <motion.div
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex space-x-3"
          >
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`carousel-indicator ${
                  currentSlide === index ? 'carousel-indicator-active' : ''
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
