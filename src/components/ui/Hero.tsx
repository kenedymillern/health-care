'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoaded(true);
      // Start content animation 0.8s after video starts (adjustable)
      setTimeout(() => setIsOpen(true), 800);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  // No animation for the door; rely on video's internal animation
  const doorVariants = {
    closed: { opacity: 1, transition: { duration: 0 } },
    open: { opacity: 1, transition: { duration: 0 } }, // Keep video visible
  };

  // Content animation: scale from 0.5 to 1
  const textVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1.2, delay: 1.0 }, // Smooth reveal
    },
  };

  const videoSrc = '/videos/door-open.mp4';

  return (
    <section className="relative overflow-hidden h-[90vh] min-h-[615px] flex items-center justify-center">
      {/* Single Door Video */}
      <motion.div
        className="absolute inset-0 z-10" // Video below content
        variants={doorVariants}
        initial="closed"
        animate={loaded ? 'open' : 'closed'} // Sync with loaded state
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
      </motion.div>

      {/* Content above video */}
      <div className="absolute inset-0 z-20 flex items-center justify-center -mt-30">
        <div className="absolute inset-0 bg-[rgba(37,92,157,0.6)] pointer-events-none" /> {/* Background overlay */}
        <motion.div
          className="relative z-30 text-center px-6 max-w-[920px] mx-auto" // Content above video and overlay
          variants={textVariants}
          initial="hidden"
          animate={isOpen ? 'visible' : 'hidden'}
        >
          <h1 className="text-white font-extrabold leading-tight mx-auto text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            Unlocking Health Solutions for Real Impact
          </h1>
          <h2 className="mt-4 text-[#EA9123] font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
            Providing personalized care <br /> to support your loved ones at home.
          </h2>
        </motion.div>
      </div>

      <style jsx>{`
        video::-webkit-media-controls {
          display: none !important;
        }
      `}</style>
    </section>
  );
}



// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';

// export default function Hero() {
//   const [isDoorOpen, setIsDoorOpen] = useState(false);
//   const [doorsLoaded, setDoorsLoaded] = useState(false);

//   // Simulate loading effect (like waiting for images before opening)
//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       setDoorsLoaded(true);
//       setTimeout(() => setIsDoorOpen(true), 400); // open after small delay
//     }, 600); // simulate preload

//     return () => clearTimeout(timeout);
//   }, []);

//   const doorVariants = {
//     closed: { x: 0 },
//     open: (side: string) => ({
//       x: side === 'left' ? '-85%' : '85%',
//       transition: { duration: 1.8, delay: 0.6 },
//     }),
//   };

//   const contentVariants = {
//     initial: { opacity: 0, scale: 0.9 },
//     animate: {
//       opacity: 1,
//       scale: 1,
//       transition: { duration: 1, delay: 1.2 },
//     },
//   };

//   return (
//     <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-r from-[#1E3A8A] to-[#065F46]">
//       {/* Sliding White Doors */}
//       <div className="door-container absolute inset-0 z-20 flex">
//         {/* Left Door */}
//         <motion.div
//           className="door-panel flex-1 bg-[rgb(60,88,120)]"
//           variants={doorVariants}
//           initial="closed"
//           animate={isDoorOpen ? 'open' : 'closed'}
//           custom="left"
//         />

//         {/* Right Door */}
//         <motion.div
//           className="door-panel flex-1 bg-[rgb(60,88,120)]"
//           variants={doorVariants}
//           initial="closed"
//           animate={isDoorOpen ? 'open' : 'closed'}
//           custom="right"
//         />
//       </div>

//       {/* Hero Content */}
//       {doorsLoaded && (
//         <motion.div
//           className="relative text-center max-w-[90%] mx-auto z-10 px-4 -mt-30"
//           variants={contentVariants}
//           initial="initial"
//           animate="animate"
//         >
//           <div className="p-6 md:p-10">
//             <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-lora leading-tight drop-shadow-lg text-white">
//               Unlocking <span className="text-yellow-400">Health Solutions</span>
//               <br />
//               for Real <span className="text-yellow-400">Impact</span>
//             </h1>
//             <p className="mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 font-poppins drop-shadow-sm">
//               Providing personalized care to support your loved ones at home.
//             </p>
//           </div>
//         </motion.div>
//       )}
//     </section>
//   );
// }
