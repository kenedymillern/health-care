'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, easeOut } from 'framer-motion';
import { Service } from '@/types';
import Link from 'next/link';

interface IServices {
  services: Service[] | undefined;
}

export default function Hero({ services }: IServices) {
  const [doorReady, setDoorReady] = useState(false);
  const [doorOpening, setDoorOpening] = useState(false);
  const [carouselActive, setCarouselActive] = useState(false); 

  const [currentIndex, setCurrentIndex] = useState(0);

  const displayedServices = services?.slice(0, 4) || [];
  const totalSlides = displayedServices.length + 1;

  useEffect(() => {
    if (!doorReady) return;

    setDoorOpening(true); 

    const t = setTimeout(() => setCarouselActive(true), 600);
    return () => clearTimeout(t);

  }, [doorReady]);

  useEffect(() => {
    if (!carouselActive) return;

    const advance = () => {
      setCurrentIndex((i) => (i + 1) % totalSlides);
    };

    const duration = currentIndex === 0 ? 12000 : 20000;
    const t = setTimeout(advance, duration);

    return () => clearTimeout(t);

  }, [carouselActive, currentIndex, totalSlides]);

  const messageVariants = {
    hidden: {
      opacity: 0,
      y: 25,
      scale: 0.85
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.4,
        ease: easeOut
      }
    },
    exit: {
      opacity: 0,
      y: -25,
      scale: 0.92,
      transition: {
        duration: 0.8,
        ease: easeOut
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: easeOut }
    }
  };

  const isMessageSlide = currentIndex === 0;
  const serviceIndex = currentIndex - 1;
  const currentService = displayedServices[serviceIndex];

  const videoSrc = '/videos/door-open.mp4';

  return (
    <section className="relative overflow-hidden h-[70vh] min-h-[400px] sm:h-[80vh] lg:h-[90vh] flex items-center justify-center">

      {/* DOOR CINEMATIC LAYER */}
      <div className="absolute inset-0 z-10">
        <video
          autoPlay
          muted
          playsInline
          loop={false}
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2"
          src={videoSrc}
          onCanPlay={() => setDoorReady(true)}
        />
        <div className="absolute inset-0 bg-[rgba(37,92,157,0.6)]" />
      </div>

      {/* OVERLAY + CONTENT */}
      {doorOpening && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">

          {/* BACKGROUND TRANSITION */}
          <AnimatePresence mode="wait">
            {isMessageSlide ? (
              <motion.div
                key="msg-bg"
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
                  key={currentService.slug}
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

          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] z-30" />

          <AnimatePresence mode="wait">
            {isMessageSlide ? (
              <motion.div
                key="message"
                className="relative z-40 max-w-[920px] mx-auto -mt-10 md:-mt-20"
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h1 className="text-white font-extrabold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                  Caring With Purpose, Serving With Heart
                </h1>

                <h2 className="mt-4 text-[#EA9123] font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl">
                  Providing compassionate, reliable <br />
                  care that makes a lasting difference.
                </h2>
              </motion.div>
            ) : (
              currentService && (
                <motion.div
                  key={currentService.slug}
                  className="relative z-40 text-white max-w-2xl mx-auto sm:-mt-40"
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -30 }}
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

          {/* INDICATORS */}
          {displayedServices.length > 0 && (
            <div className="absolute bottom-10 flex items-center gap-3 z-40">

              {/* Main message dot */}
              <button
                onClick={() => setCurrentIndex(0)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === 0
                  ? 'bg-[#EA9123] scale-125'
                  : 'bg-white/70 hover:bg-[#EA9123]/70'
                }`}
              />

              {/* Service dots */}
              {displayedServices.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx + 1)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === idx + 1
                    ? 'bg-[#EA9123] scale-125'
                    : 'bg-white/70 hover:bg-[#EA9123]/70'
                  }`}
                />
              ))}

              {/* + BUTTON */}
              <Link
                href="/services"
                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-white text-white hover:bg-[#EA9123] hover:border-[#EA9123] transition-all text-xs font-semibold"
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
