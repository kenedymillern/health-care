'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa';

type WebBannerProps = {
  title: string;
  subtitle: string;
  image: string;
};

export default function WebBanner({ title, subtitle, image }: WebBannerProps) {
  const bannerVariants = {
    hidden: { scale: 1.2, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 1.5, ease: 'easeOut' } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: i * 0.2, type: 'spring', stiffness: 120 },
    }),
  };

  return (
    <section className="relative h-[350px] sm:h-[450px] flex items-center justify-center overflow-hidden">
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
          layout="fill"
          objectFit="cover"
          className="opacity-75"
          priority
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-teal-700/50 to-transparent"></div>
      <div className="relative text-center section-padding">
        <motion.div
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          custom={0}
          viewport={{ once: true }}
          className="flex justify-center mb-6"
        >
          <FaHeart className="text-white/90 text-4xl animate-pulse" />
        </motion.div>
        <motion.h1
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          custom={1}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl font-lora font-bold text-white drop-shadow-lg"
        >
          {title}
        </motion.h1>
        <motion.p
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          custom={2}
          viewport={{ once: true }}
          className="mt-4 text-lg sm:text-xl text-white font-poppins drop-shadow-md"
        >
          {subtitle}
        </motion.p>
        <motion.a
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          custom={3}
          viewport={{ once: true }}
          href="/contact"
          className="mt-6 inline-block bg-teal-500 text-white px-6 py-3 rounded-full font-poppins text-base shadow-lg hover:bg-teal-600 transition-colors duration-300"
        >
          Learn More
        </motion.a>
      </div>
    </section>
  );
}