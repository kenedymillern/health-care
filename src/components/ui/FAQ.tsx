'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus } from 'react-icons/fa';

const faqs = [
  {
    question: 'What types of care services do you offer?',
    answer: 'We provide a range of services including personal care, companionship care, Alzheimer’s and dementia care, rehabilitation services, and 24/7 care availability, all tailored to your needs.',
  },
  {
    question: 'How do you ensure the quality of your caregivers?',
    answer: 'Our caregivers are rigorously vetted, trained, and certified professionals with a passion for compassionate care, ensuring the highest standards of service.',
  },
  {
    question: 'Can services be customized for specific needs?',
    answer: 'Yes, we create personalized care plans based on individual needs, preferences, and medical requirements to ensure the best possible care experience.',
  },
  {
    question: 'What is the process to start care services?',
    answer: 'Simply contact us to schedule a consultation. We’ll assess your needs, create a care plan, and match you with a suitable caregiver to begin services promptly.',
  },
  {
    question: 'Do you provide 24/7 support?',
    answer: 'Absolutely, our 24/7 care availability ensures support is always available, day or night, for peace of mind and continuous care.',
  },
  {
    question: 'How do you handle emergency situations?',
    answer: 'Our team is trained to respond swiftly to emergencies, with protocols in place to coordinate with medical professionals and family members as needed.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.2, type: 'spring', stiffness: 100 },
    }),
  };

  const answerVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: 'auto', opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-b from-lilac-200 to-purple-600">
      <div className="absolute inset-0 bg-[url('/images/wave-pattern.svg')] bg-repeat bg-center opacity-15"></div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-black drop-shadow-xl" role="heading" aria-level={2}>
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-sm sm:text-base md:text-lg font-inter text-black max-w-3xl mx-auto">
          Find answers to common questions about our compassionate healthcare services.
        </p>
      </motion.div>
      <div className="mt-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {faqs.map((faq, index) => (
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
        ))}
      </div>
    </section>
  );
}