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
    name: 'Michael Carter',
    text: 'The care team went above and beyond to ensure my mother felt safe and loved at home.',
    rating: 5,
    avatar: '/images/avatar.jpeg',
  },
  {
    name: 'Sarah Johnson',
    text: 'Their compassionate approach made a huge difference in my father’s recovery journey.',
    rating: 4,
    avatar: '/images/avatar.jpeg',
  },
  {
    name: 'Emily Davis',
    text: 'Professional, kind, and always attentive. I couldn’t ask for better care services.',
    rating: 5,
    avatar: '/images/avatar.jpeg',
  },
  {
    name: 'David Lee',
    text: 'The companionship care provided brought joy and connection to my grandmother’s life.',
    rating: 4,
    avatar: '/images/avatar.jpeg',
  },
  {
    name: 'Laura Martinez',
    text: 'Exceptional service with a personal touch, tailored to our family’s needs.',
    rating: 5,
    avatar: '/images/avatar.jpeg',
  },
  {
    name: 'James Thompson',
    text: 'Reliable and heartfelt care that gave us peace of mind during a tough time.',
    rating: 5,
    avatar: '/images/avatar.jpeg',
  },
];

export default function ReviewCarousel() {
  const starVariants = {
    hidden: { scale: 0, opacity: 0, rotate: -45 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: { delay: i * 0.15, type: 'spring', stiffness: 200, damping: 10 },
    }),
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.7, delay: i * 0.3, type: 'spring', stiffness: 120, damping: 12 },
    }),
    hover: { 
      scale: 1.05, 
      boxShadow: '0 15px 40px rgba(139, 92, 246, 0.3)', // Purple shadow
      transition: { duration: 0.3 },
    },
  };

  return (
    <section id="reviews" className="section-padding relative overflow-hidden bg-gradient-to-b from-lilac-200 to-purple-600">
      <div className="absolute inset-0 bg-[url('/images/wave-pattern.svg')] bg-repeat bg-center opacity-15"></div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-black drop-shadow-xl">
          Our Clients’ Stories
        </h2>
        <p className="mt-4 text-sm sm:text-base md:text-lg font-inter text-black max-w-3xl mx-auto">
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
              className="glass-effect p-6 sm:p-8 rounded-2xl bg-lilac-100/50 shadow-lg hover:bg-lilac-100/70 transition-all duration-300 relative overflow-hidden"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 left-4 text-black text-4xl font-serif opacity-50">“</div>
              <div className="flex items-center mb-6">
                <div className="relative">
                  <Image
                    src={review.avatar}
                    alt={`${review.name} avatar`}
                    width={64}
                    height={64}
                    className="rounded-full border-4 border-[#D4AF37]/50 shadow-md"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/30 to-lilac-200/30 blur-sm" />
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
                          className={`text-${i < review.rating ? 'yellow-400' : 'gray-400'}`}
                          size={20}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-base sm:text-lg font-inter text-black italic leading-relaxed">
                {review.text}
              </p>
              {/* Subtle Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-lilac-200/20 opacity-0 hover:opacity-40 transition-opacity duration-300 rounded-2xl pointer-events-none" />
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}