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
  const [showCarousel, setShowCarousel] = useState(false);

  const displayedServices = services?.slice(0, 4) || [];
  const totalSlides = displayedServices.length + 1; // +1 for Compassionate Care Message

  useEffect(() => {
    // Step 1: wait for short delay to ensure video load
    const t = setTimeout(() => {
      setLoaded(true);

      // Step 2: open cinematic door
      setTimeout(() => {
        setIsOpen(true);

        // Step 3: start carousel (with message as first slide) after door opens
        setTimeout(() => {
          setShowCarousel(true);
        }, 800);
      }, 800);
    }, 600);

    return () => clearTimeout(t);
  }, []);

  // Auto-advance every 20s (except first slide lasts 7s)
  useEffect(() => {
    if (totalSlides <= 1 || !showCarousel) return;

    const advance = () => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    };

    const timeouts: NodeJS.Timeout[] = [];

    if (currentIndex === 0) {
      // First slide (message) shows for 12s
      timeouts.push(setTimeout(advance, 12000));
    } else {
      // Service slides show for 20s
      timeouts.push(setTimeout(advance, 20000));
    }

    return () => timeouts.forEach(clearTimeout);
  }, [currentIndex, totalSlides, showCarousel]);

  const doorVariants = {
    closed: { opacity: 1, transition: { duration: 0 } },
    open: { opacity: 1, transition: { duration: 0 } },
  };

  const textVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1.2 },
    },
  };

  const messageVariants = {
    hidden: { scale: 0.4, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        scale: { duration: 1.2 },
        opacity: { duration: 0.8 },
      },
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      transition: { duration: 0.8 },
    },
  };

  const videoSrc = '/videos/door-open.mp4';

  // Determine current content
  const isMessageSlide = showCarousel && currentIndex === 0;
  const serviceIndex = currentIndex - 1;
  const currentService = displayedServices[serviceIndex];

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

      {/* Carousel Overlay - Unified for Message + Services */}
      {showCarousel && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          {/* Background: Video overlay for message, service image otherwise */}
          <AnimatePresence mode="wait">
            {isMessageSlide ? (
              <motion.div
                key="message-bg"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="absolute inset-0 bg-[rgba(37,92,157,0.6)]" />
              </motion.div>
            ) : (
              currentService && (
                <motion.div
                  key={currentService._id?.toString() ?? currentService.slug}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${currentService.image})` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                />
              )
            )}
          </AnimatePresence>

          {/* Dark Gradient Overlay for text visibility */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] z-30" />

          {/* Carousel Content */}
          <AnimatePresence mode="wait">
            {isMessageSlide ? (
              // Compassionate Care Message - First Slide
              <motion.div
                key="compassionate-message"
                className="relative z-40 text-center max-w-[920px] mx-auto -mt-10 md:-mt-30"
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h1 className="text-white font-extrabold leading-tight mx-auto text-2xl sm:text-3xl md:text-4xl lg:text-6xl">
                  Caring With Purpose, Serving With Heart
                </h1>
                <h2 className="mt-4 text-[#EA9123] font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl">
                  Providing compassionate, reliable <br />
                  care that makes a lasting difference in the lives of those we serve.
                </h2>
              </motion.div>
            ) : (
              currentService && (
                // Service Slide
                <motion.div
                  key={currentService._id?.toString() ?? currentService.slug}
                  className="relative z-40 text-white max-w-2xl mx-auto sm:-mt-40"
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 1 }}
                >
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 drop-shadow-2xl">
                    {currentService.title}
                  </h1>
                  <p className="text-base sm:text-lg lg:text-xl mb-6 text-gray-100 leading-relaxed drop-shadow-md">
                    {currentService.shortDescription}
                  </p>
                  <Link
                    href={`/services/${currentService.slug}`}
                    className="inline-block bg-[#EA9123] hover:bg-[#d97c12] text-white font-semibold px-6 py-3 rounded-full shadow-md transition-all duration-300"
                  >
                    Learn More
                  </Link>
                </motion.div>
              )
            )}
          </AnimatePresence>

          {/* Unified Carousel Controls - Includes Message as First Dot */}
          {displayedServices.length > 0 && (
            <div className="absolute bottom-10 sm:bottom-10 flex items-center gap-3 z-40">
              {/* Dot for Compassionate Care Message */}
              <button
                onClick={() => setCurrentIndex(0)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === 0
                    ? 'bg-[#EA9123] scale-125'
                    : 'bg-white/70 hover:bg-[#EA9123]/70'
                  }`}
                aria-label="Compassionate Care Message"
              />

              {/* Dots for Services */}
              {displayedServices.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx + 1)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === idx + 1
                      ? 'bg-[#EA9123] scale-125'
                      : 'bg-white/70 hover:bg-[#EA9123]/70'
                    }`}
                  aria-label={`Service ${idx + 1}`}
                />
              ))}

              {/* View All Services */}
              <Link
                href="/services"
                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-white text-white hover:bg-[#EA9123] hover:border-[#EA9123] transition-all text-xs font-semibold"
                aria-label="View all services"
              >
                +
              </Link>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        video::-webkit-media-controls {
          display: none !important;
        }
      `}</style>
    </section>
  );
}