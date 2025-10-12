'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';

const reviews = [
  {
    name: 'John Doe',
    text: 'The care provided was exceptional, truly making a difference in our lives.',
    rating: 5,
    avatar: '/images/avatar.jpeg',
  },
  {
    name: 'Jane Smith',
    text: 'Compassionate and professional team, always there when we need them.',
    rating: 4,
    avatar: '/images/avatar.jpeg',
  },
  {
    name: 'Emily Brown',
    text: 'Highly professional services with a personal touch.',
    rating: 5,
    avatar: '/images/avatar.jpeg',
  },
];

export default function ReviewCarousel() {
  const starVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: i * 0.1, type: 'spring', stiffness: 200 },
    }),
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.2, type: 'spring', stiffness: 100 },
    }),
    hover: { scale: 1.05, boxShadow: '0 20px 50px rgba(212, 175, 55, 0.3)' },
  };

  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-b from-[#1E3A8A] via-[#0A2A43] to-black">
      <div className="absolute inset-0 bg-[url('/images/wave-pattern.svg')] bg-repeat bg-center opacity-10"></div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-transparent bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text drop-shadow-xl">
          Our Clients’ Stories
        </h2>
        <p className="mt-4 text-sm sm:text-base md:text-lg font-inter text-gray-200 max-w-3xl mx-auto">
          Hear from those who’ve experienced the warmth and dedication of our care services firsthand.
        </p>
      </motion.div>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true, bulletClass: 'swiper-pagination-bullet-custom' }}
        className="mt-12 mb-8"
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 40 },
          1024: { slidesPerView: 3, spaceBetween: 50 },
        }}
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index}>
            <motion.div
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
              className="glass-effect p-6 sm:p-8 rounded-2xl bg-white/40 shadow-lg hover:bg-white/60 transition-all duration-400 relative overflow-hidden"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 left-4 text-[#D4AF37] text-3xl font-serif">“</div>
              <div className="flex items-center mb-6">
                <div className="relative">
                  <Image
                    src={review.avatar}
                    alt={`${review.name} avatar`}
                    width={64}
                    height={64}
                    className="rounded-full border-4 border-[#D4AF37]/40 shadow-md"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1E3A8A]/30 to-[#065F46]/30 blur-sm" />
                </div>
                <div className="ml-6">
                  <p className="text-lg sm:text-xl font-playfair font-bold text-white drop-shadow-md">{review.name}</p>
                  <div className="flex mt-2">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        variants={starVariants}
                        initial="hidden"
                        whileInView="visible"
                        custom={i}
                        viewport={{ once: true }}
                      >
                        <FaStar
                          className={`text-${i < review.rating ? 'yellow-400' : 'gray-500'}`}
                          size={18}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-base sm:text-lg font-inter text-white/90 italic leading-relaxed">
                {review.text}
              </p>
              {/* Subtle Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/20 to-transparent opacity-0 hover:opacity-30 transition-opacity duration-300 rounded-2xl pointer-events-none" />
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}