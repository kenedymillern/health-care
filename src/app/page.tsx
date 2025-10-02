'use client';

import { motion } from 'framer-motion';
import Hero from '@/components/ui/Hero';
import ReviewCarousel from '@/components/ui/ReviewCarousel';
import WebBanner from '@/components/ui/WebBanner';
import Form from '@/components/ui/Form';
import { FaHandsHelping, FaHeart, FaBed } from 'react-icons/fa';

export default function Home() {
  return (
    <>
      <Hero />
      <section className="section-padding bg-gradient-to-b from-teal-50/90 to-white/90 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/heart-pattern.jpg')] bg-repeat opacity-5"></div>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl font-lora font-bold text-center text-teal-700 drop-shadow-sm"
        >
          Our Services
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[
            { name: 'Personal Care', icon: <FaHandsHelping className="text-teal-500 text-3xl" />, description: 'Personalized assistance with daily tasks to promote independence and comfort.' },
            { name: 'Companionship', icon: <FaHeart className="text-teal-500 text-3xl" />, description: 'Warm, engaging support to foster emotional well-being and connection.' },
            { name: 'Respite Care', icon: <FaBed className="text-teal-500 text-3xl" />, description: 'Compassionate care to provide relief for family caregivers.' },
          ].map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 50, rotate: -5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2, type: 'spring', stiffness: 120 }}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.95)', boxShadow: '0 10px 30px rgba(0, 125, 125, 0.25)' }}
              className="glass-effect p-6 rounded-xl text-center bg-white/60 shadow-md transition-all duration-300"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-lora font-bold text-teal-700">{service.name}</h3>
              <p className="mt-3 font-poppins text-gray-600 text-sm">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <ReviewCarousel />
      <WebBanner
        title="Why Choose Us?"
        subtitle="Experience care that feels like family."
        image="/images/why-choose-us.jpg"
      />
      <Form title="Set An Appointment" />
    </>
  );
}