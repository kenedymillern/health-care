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

  return (
    <section className="section-padding bg-gradient-to-r from-teal-100/95 to-blue-100/95 relative overflow-hidden">
      {/* Decorative wave */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-[url('/images/wave.jpeg')] bg-no-repeat bg-bottom opacity-15"></div>
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-4xl font-lora font-bold text-center text-teal-700 drop-shadow-sm"
      >
        Our Clients’ Stories
      </motion.h2>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        className="mt-8"
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, boxShadow: '0 10px 30px rgba(0, 125, 125, 0.25)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="glass-effect p-6 rounded-xl bg-white/70 shadow-md hover:bg-white/90 transition-all duration-300 relative"
            >
              <div className="absolute top-4 left-4 text-teal-300 text-4xl font-serif">“</div>
              <div className="flex items-center mb-4">
                <Image
                  src={review.avatar}
                  alt={`${review.name} avatar`}
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-teal-300"
                />
                <div className="ml-4">
                  <p className="font-lora font-bold text-teal-700">{review.name}</p>
                  <div className="flex mt-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        variants={starVariants}
                        initial="hidden"
                        whileInView="visible"
                        custom={i}
                        viewport={{ once: true }}
                      >
                        <FaStar className="text-yellow-400" size={16} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 font-poppins text-sm italic">{review.text}</p>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}