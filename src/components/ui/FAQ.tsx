'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { FAQ as FAQTypes } from '@/types';
import { useQuery } from '@tanstack/react-query';

const fetchFaqs = async (): Promise<FAQTypes[]> => {
  const response = await fetch('/api/faq');
  if (!response.ok) {
    throw new Error('Failed to fetch faqs');
  }
  return response.json();
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { data: faqs, isLoading, error } = useQuery<FAQTypes[]>({
    queryKey: ['faqs'],
    queryFn: fetchFaqs,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.2 },
    }),
  };

  const answerVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: (i: number) => ({ height: 'auto', opacity: 1, transition: { duration: 0.5, delay: i * 0.2 } }),
  };

  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-r from-[#1E3A8A] to-[#065F46]">
      <div className="absolute inset-0 bg-[url('/images/wave-pattern.svg')] bg-repeat bg-center opacity-15"></div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-white drop-shadow-xl" role="heading" aria-level={2}>
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-sm sm:text-base md:text-lg font-inter text-white max-w-3xl mx-auto">
          Find answers to common questions about our compassionate healthcare services.
        </p>
      </motion.div>
      <div className="mt-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex flex-col space-y-3 animate-pulse">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg shadow-md overflow-hidden flex flex-col"
              >
                <div className="h-10 w-full bg-gray-300 mb-2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500">Error loading FAQs</p>
        ) : (
          faqs?.map((faq, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={faqVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass-effect rounded-xl mb-4 bg-lilac-100/50 hover:bg-lilac-100/70 transition-all duration-300"
              whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)' }}
            >
              <button
                className="w-full flex justify-between items-center p-4 sm:p-6 text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-lg sm:text-xl font-playfair font-semibold text-white drop-shadow-md">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {openIndex === index ? (
                    <FaMinus className="text-black" size={20} />
                  ) : (
                    <FaPlus className="text-black" size={20} />
                  )}
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    variants={answerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="px-4 sm:px-6 pb-4 sm:pb-6 text-black font-inter text-base sm:text-lg leading-relaxed overflow-hidden"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )))}
      </div>
    </section>
  );
}