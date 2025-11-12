'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Service } from '@/types';
import Link from 'next/link';

interface IServices {
  services: Service[] | undefined;
}

export default function Hero({ services }: IServices) {
  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [hideMessage, setHideMessage] = useState(false);

  const displayedServices = services?.slice(0, 4) || [];
  const totalSlides = displayedServices.length;

  useEffect(() => {
    const t = setTimeout(() => {
      setLoaded(true);
      setTimeout(() => {
        setIsOpen(true);
        // Show message after door opens
        setShowMessage(true);

        // Hide message after 7 seconds
        setTimeout(() => {
          setHideMessage(true);
          setTimeout(() => setShowMessage(false), 800); // match fade-out duration
        }, 7000);
      }, 800);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  // Auto-slide every 10s
  useEffect(() => {
    if (totalSlides <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 20000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const doorVariants = {
    closed: { opacity: 1, transition: { duration: 0 } },
    open: { opacity: 1, transition: { duration: 0 } },
  };

  const textVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1.2, delay: 0.5 },
    },
  };

  const messageVariants = {
    hidden: { scale: 0.4, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        scale: { duration: 1.2, delay: 0.5 },
        opacity: { duration: 0.8 },
      },
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      transition: { duration: 0.8, delay: 0.5 },
    },
  };

  const videoSrc = '/videos/door-open.mp4';

  return (
    <section className="relative overflow-hidden h-[70vh] min-h-[400px] sm:h-[80vh] sm:min-h-[480px] lg:h-[90vh] lg:min-h-[615px] flex items-center justify-center">
      {/* Door Video */}
      <motion.div
        className="absolute inset-0 z-10"
        variants={doorVariants}
        initial="closed"
        animate={loaded ? 'open' : 'closed'}
      >
        <video
          autoPlay
          muted
          playsInline
          loop={false}
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2"
          src={videoSrc}
          onCanPlay={() => setLoaded(true)}
        />
        {/* Blue Overlay (over video) */}
        <div className="absolute inset-0 bg-[rgba(37,92,157,0.6)]" />
      </motion.div>

      {/* Compassionate Care Message - Shows for 5s */}
      <AnimatePresence>
        {showMessage && (
          <div className="absolute inset-0 z-50 flex items-center justify-center -mt-10 md:-mt-30">
            {/* <div className="absolute inset-0 bg-[rgba(37,92,157,0.6)] pointer-events-none" /> */}
            {/* Background overlay */}
            <motion.div className="relative z-50 text-center px-6 max-w-[920px] mx-auto"
              variants={messageVariants} initial="hidden" animate={isOpen ? 'visible' : 'hidden'} >
              <h1 className="text-white font-extrabold leading-tight mx-auto text-2xl sm:text-3xl md:text-4xl lg:text-6xl">
                Caring With Purpose, Serving With Heart </h1>
              <h2 className="mt-4 text-[#EA9123] font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl">
                Providing compassionate, reliable <br />
                care that makes a lasting difference in the lives of those we serve.
              </h2>
            </motion.div>
          </div>
          // <motion.div
          //   className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
          //   initial="hidden"
          //   animate="visible"
          //   exit="exit"
          //   variants={messageVariants}
          // >
          //   <h1 className="text-white font-extrabold leading-tight mx-auto text-2xl sm:text-3xl md:text-4xl lg:text-6xl">
          //     Caring With Purpose, Serving With Heart
          //   </h1>
          //   <h2 className="mt-4 text-[#EA9123] font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl">
          //     Providing compassionate, reliable <br /> care that makes a lasting difference in the lives of those we serve. </h2>
          // </motion.div>
        )}
      </AnimatePresence>

      {/* Carousel Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
        {/* Dynamic Service Background */}
        <AnimatePresence mode="wait">
          {displayedServices.length > 0 && !showMessage && (
            <motion.div
              key={
                (displayedServices[currentIndex]?._id?.toString() ??
                  displayedServices[currentIndex]?.slug ??
                  currentIndex).toString()
              }
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
              style={{
                backgroundImage: `url(${displayedServices[currentIndex].image})`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>

        {/* Dark Gradient Overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] z-30" />

        {/* Carousel Content */}
        <AnimatePresence mode="wait">
          {displayedServices.length > 0 && !showMessage && (
            <motion.div
              key={
                (displayedServices[currentIndex]?._id?.toString() ??
                  displayedServices[currentIndex]?.slug ??
                  currentIndex).toString()
              }
              className="relative z-40 text-white max-w-2xl mx-auto sm:-mt-40"
              variants={textVariants}
              initial="hidden"
              animate={isOpen ? 'visible' : 'hidden'}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 drop-shadow-2xl">
                {displayedServices[currentIndex].title}
              </h1>
              <p className="text-base sm:text-lg lg:text-xl mb-6 text-gray-100 leading-relaxed drop-shadow-md">
                {displayedServices[currentIndex].shortDescription}
              </p>
              <Link
                href={`/services/${displayedServices[currentIndex].slug}`}
                className="inline-block bg-[#EA9123] hover:bg-[#d97c12] text-white font-semibold px-6 py-3 rounded-full shadow-md transition-all duration-300"
              >
                Learn More
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Carousel Controls */}
        {displayedServices.length > 0 && !showMessage && (
          <div className="absolute bottom-10 sm:bottom-10 flex items-center gap-3 z-40">
            {displayedServices.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === idx
                  ? 'bg-[#EA9123] scale-125'
                  : 'bg-white/70 hover:bg-[#EA9123]/70'
                  }`}
              />
            ))}
            {/* "More services" control */}
            <Link
              href="/services"
              className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-white text-white hover:bg-[#EA9123] hover:border-[#EA9123] transition-all text-xs font-semibold"
            >
              +
            </Link>
          </div>
        )}
      </div>

      <style jsx>{`
        video::-webkit-media-controls {
          display: none !important;
        }
      `}</style>
    </section>
  );
}
