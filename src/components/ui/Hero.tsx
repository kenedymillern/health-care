'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'react-lottie';

// Carousel slide data
const slides = [
  {
    title: 'Compassionate Home Care',
    description: 'Providing personalized care to support your loved ones at home.',
    bgImage: '/images/healthcare-home.jpg', // Replace with actual image paths
  },
  {
    title: 'Expert Medical Support',
    description: 'Skilled professionals delivering top-tier medical assistance.',
    bgImage: '/images/medical-support.jpg',
  },
  {
    title: 'Holistic Wellness Plans',
    description: 'Tailored wellness programs to enhance quality of life.',
    bgImage: '/images/wellness-plan.jpg',
  },
  {
    title: '24/7 Care Availability',
    description: 'Round-the-clock support for peace of mind.',
    bgImage: '/images/24-7-care.jpg',
  },
  {
    title: 'Rehabilitation Services',
    description: 'Specialized care to aid recovery and independence.',
    bgImage: '/images/rehabilitation.jpg',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationData, setAnimationData] = useState<any>(null);

  // Fetch Lottie animation data
  useEffect(() => {
    fetch('/animations/care.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  // Auto-rotate carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!animationData) return null;

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // Animation variants for slide transitions
  const slideVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: (i: number) => ({ opacity: 1, scale: 1, transition: { duration: 0.8, delay: i * 0.2  } }),
    exit: (i: number) => ({ opacity: 0, scale: 1.05, transition: { duration: 0.8, delay: i * 0.2  } }),
  };

  // Animation variants for text and button
  const contentVariants = {
    initial: { opacity: 0, y: 50 },
    animate: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: i * 0.2 } }),
  };

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Carousel Backgrounds */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${slides[currentSlide].bgImage})` }}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Glassy Overlay */}
          <div className="absolute inset-0 carousel-glass"></div>
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative text-center section-padding max-w-[90%] mx-auto z-10 mt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="bg-black/50 backdrop-blur-md rounded-xl p-6 md:p-8 glass-effect"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.h1
              variants={contentVariants}
              initial="initial"
              animate="animate"
              className="text-4xl sm:text-5xl md:text-6xl font-lora font-bold text-white drop-shadow-md"
            >
              {slides[currentSlide].title}
            </motion.h1>

            <motion.p
              variants={contentVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
              className="mt-4 text-lg sm:text-xl text-white font-poppins drop-shadow-sm"
            >
              {slides[currentSlide].description}
            </motion.p>

            <motion.div
              variants={contentVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <a
                href="/contact"
                className="inline-block bg-yellow-600 text-gray-900 px-8 py-3 rounded-full font-poppins text-lg hover:bg-yellow-500 transition animate-pulse-glow"
              >
                Get in Touch
              </a>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Lottie Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-12 flex justify-center"
        >
          <div className="max-w-[150px] w-full">
            <Lottie options={lottieOptions} height="100%" width="100%" />
          </div>
        </motion.div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-8 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`carousel-indicator ${currentSlide === index ? 'carousel-indicator-active' : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}