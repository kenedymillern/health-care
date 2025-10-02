'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaComment } from 'react-icons/fa';

type FormInput = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

export default function Form({ title = 'Contact Us' }: { title?: string }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInput>();

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data); // Replace with API call
  };

  // Form animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  // Field animation variants
  const fieldVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120 } },
  };

  return (
    <motion.section
      variants={formVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="section-padding max-w-lg mx-auto relative bg-gradient-to-b from-teal-50/90 to-white/90 overflow-hidden glass-effect p-8 rounded-xl shadow-lg"
    >
      {/* Subtle heart pattern */}
      <div className="absolute inset-0 bg-[url('/images/heart-pattern.jpg')] bg-repeat opacity-5"></div>
      <motion.h2
        variants={fieldVariants}
        className="text-3xl sm:text-4xl font-lora font-bold text-center text-teal-700 drop-shadow-sm"
      >
        {title}
      </motion.h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <motion.div variants={fieldVariants} className="relative">
          <label htmlFor="name" className="absolute -top-2 left-3 bg-white/80 px-2 text-sm font-poppins font-medium text-teal-700 transition-all duration-300">
            <FaUser className="inline-block mr-1 text-teal-500" size={14} /> Name
          </label>
          <input
            {...register('name', { required: 'Name is required' })}
            id="name"
            className="w-full p-3 pt-5 rounded-lg glass-effect text-gray-800 border border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 transition-all duration-300"
            aria-invalid={errors.name ? 'true' : 'false'}
          />
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.name.message}
            </motion.p>
          )}
        </motion.div>
        <motion.div variants={fieldVariants} className="relative">
          <label htmlFor="email" className="absolute -top-2 left-3 bg-white/80 px-2 text-sm font-poppins font-medium text-teal-700 transition-all duration-300">
            <FaEnvelope className="inline-block mr-1 text-teal-500" size={14} /> Email
          </label>
          <input
            {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
            id="email"
            className="w-full p-3 pt-5 rounded-lg glass-effect text-gray-800 border border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 transition-all duration-300"
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.email.message}
            </motion.p>
          )}
        </motion.div>
        <motion.div variants={fieldVariants} className="relative">
          <label htmlFor="phone" className="absolute -top-2 left-3 bg-white/80 px-2 text-sm font-poppins font-medium text-teal-700 transition-all duration-300">
            <FaPhone className="inline-block mr-1 text-teal-500" size={14} /> Phone (Optional)
          </label>
          <input
            {...register('phone')}
            id="phone"
            className="w-full p-3 pt-5 rounded-lg glass-effect text-gray-800 border border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 transition-all duration-300"
          />
        </motion.div>
        <motion.div variants={fieldVariants} className="relative">
          <label htmlFor="message" className="absolute -top-2 left-3 bg-white/80 px-2 text-sm font-poppins font-medium text-teal-700 transition-all duration-300">
            <FaComment className="inline-block mr-1 text-teal-500" size={14} /> Message
          </label>
          <textarea
            {...register('message', { required: 'Message is required' })}
            id="message"
            className="w-full p-3 pt-5 rounded-lg glass-effect text-gray-800 border border-teal-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 transition-all duration-300"
            rows={5}
            aria-invalid={errors.message ? 'true' : 'false'}
          />
          {errors.message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.message.message}
            </motion.p>
          )}
        </motion.div>
        <motion.button
          variants={fieldVariants}
          whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(0, 125, 125, 0.3)' }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white py-3 rounded-lg font-poppins text-lg shadow-md hover:bg-teal-600 transition-all duration-300 relative overflow-hidden"
        >
          <span className="relative z-10">Submit</span>
          <motion.div
            className="absolute inset-0 bg-teal-400/50"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </motion.button>
      </form>
    </motion.section>
  );
}