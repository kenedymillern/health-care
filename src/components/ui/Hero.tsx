'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'react-lottie';

export default function Hero() {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch('/animations/care.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
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

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden overflow-x-hidden">
      {/* background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>

      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-transparent"></div>

      {/* content */}
      <div className="relative text-center section-padding max-w-[90%] mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl md:text-6xl font-lora font-bold text-white"
        >
          Compassionate Care, Always
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          className="mt-4 text-lg sm:text-xl text-white font-poppins"
        >
          Your trusted partner in home care services.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8"
        >
          <a
            href="/contact"
            className="inline-block bg-secondary text-white px-8 py-3 rounded-full font-poppins text-lg hover:bg-accent transition animate-pulse-glow"
          >
            Get in Touch
          </a>
        </motion.div>

        {/* Lottie animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-12 flex justify-center"
        >
          <div className="max-w-[150px] w-full">
            <Lottie options={lottieOptions} height={'100%'} width={'100%'} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
