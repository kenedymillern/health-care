'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa';
import Link from 'next/link';

type WebBannerProps = {
  title: string;
  subtitle: string;
  image: string;
};

export default function WebBanner({ title, subtitle, image }: WebBannerProps) {
  const bannerVariants = {
    hidden: { scale: 1.2, opacity: 0, filter: 'blur(10px)' },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 1.5, delay: i * 0.2 },
    }),
  };

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: i * 0.2, type: 'spring' as const, stiffness: 120 },
    }),
  };

  return (
    <section className="relative h-[400px] sm:h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
      <motion.div
        variants={bannerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="absolute inset-0"
      >
        <Image
          src={image}
          alt={title}
          fill
          objectFit="cover"
          className="brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A]/60 via-[#0A2A43]/70 to-black/80"></div>
        <div className="absolute inset-0 bg-[url('/images/wave-pattern.svg')] bg-repeat bg-center opacity-15 mix-blend-overlay"></div>
      </motion.div>
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          custom={0}
          viewport={{ once: true }}
          className="flex justify-center mb-6"
        >
          <FaHeart className="text-[#D4AF37] text-5xl sm:text-6xl animate-pulse-slow" />
        </motion.div>
        <motion.h1
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          custom={1}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold text-transparent bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text drop-shadow-2xl"
        >
          {title}
        </motion.h1>
        <motion.p
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          custom={2}
          viewport={{ once: true }}
          className="mt-4 text-lg sm:text-xl md:text-2xl font-inter text-white/90 drop-shadow-lg max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
        <motion.div
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          custom={3}
          viewport={{ once: true }}
        >
          <Link
            href="/contact"
            className="mt-6 inline-block bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1E3A8A] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-inter text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:from-[#FFD700] hover:to-[#D4AF37]"
          >
            Learn More
          </Link>
        </motion.div>
      </div>
    </section>
  );
}