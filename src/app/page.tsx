'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Hero from '@/components/ui/Hero';
import ReviewCarousel from '@/components/ui/ReviewCarousel';
import WebBanner from '@/components/ui/WebBanner';
import Form from '@/components/ui/Form';
import FAQ from '@/components/ui/FAQ';

export default function Home() {
  return (
    <>
      <Hero />
      <section className="section-padding relative overflow-hidden bg-gradient-to-r from-[#1E3A8A] to-[#065F46]">
        <div className="absolute inset-0 bg-[url('/images/home-care-bg.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
          {/* Curved Top Corners Wrapper */}
          <div className="clip-path-curved-top bg-transparent">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-transparent bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text drop-shadow-lg">
                What We Do - Services We Offer
              </h2>
              <p className="mt-3 text-sm sm:text-base md:text-lg font-inter text-gray-200 max-w-2xl mx-auto">
                We offer a wide range of services to care for elderly, disabled family members, or those in need, delivered with compassion and professionalism.
              </p>
            </motion.div>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-12">
              {[
                {
                  name: 'Personal Care',
                  image: '/images/personal-care.jpg',
                  description: 'Alzheimer’s and dementia care to live life to the fullest in a safe and secure environment.',
                },
                {
                  name: 'Companionship Care',
                  image: '/images/companionship-care.jpg',
                  description: 'More than just care, we offer companionship, fostering social connection, and enriching lives.',
                },
                {
                  name: 'View More Services',
                  image: '/images/view-more-services.jpg',
                  description: 'Explore all our home care services, tailored to meet your unique needs and preferences.',
                },
              ].map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, scale: 0.5, y: 0, x: '50%' }}
                  whileInView={{ opacity: 1, scale: 1, y: 0, x: 0 }} // Expand to full view
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2, type: 'spring', stiffness: 80 }}
                  whileHover={{
                    background: 'linear-gradient(to right, #1E3A8A, #065F46)',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
                  }}
                  className={`relative rounded-2xl p-6 text-white shadow-xl overflow-hidden bg-gray-800 transition-all duration-300`}
                >
                  {/* Circular Image */}
                  <div className="flex justify-center mb-6">
                    <div className="relative w-48 h-48">
                      <img
                        src={service.image}
                        alt={`${service.name} Image`}
                        className="w-full h-full object-cover rounded-full border-4 border-white/40 shadow-lg"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1E3A8A]/40 to-[#065F46]/40 blur-md" />
                    </div>
                  </div>
                  {/* Service Name and Description with Overlay on Hover */}
                  <div className="relative">
                    <h3 className="text-2xl sm:text-3xl font-playfair font-bold text-center mb-4 text-[#D4AF37] drop-shadow-md">
                      {service.name}
                    </h3>
                    <p className="text-base sm:text-lg font-inter text-white/90 text-center leading-relaxed">
                      {service.description}
                    </p>
                    {/* Subtle Overlay on Hover for Text Readability */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.2 }}
                      className="absolute inset-0 bg-black rounded-2xl pointer-events-none"
                    />
                  </div>
                  {/* Arrow Button */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 20 }}
                    className="mt-8 flex justify-center cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-[#D4AF37]/80 rounded-full flex items-center justify-center hover:bg-[#FFD700] transition-colors duration-300">
                      <span className="text-white font-bold text-2xl">→</span>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <ReviewCarousel />
      <WebBanner
        title="Why Choose Us?"
        subtitle="Experience care that feels like family."
        image="/images/why-choose-us.jpg"
      />
      <Form title="Set An Appointment" />
      <FAQ />
    </>
  );
}