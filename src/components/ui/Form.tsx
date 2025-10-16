'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaComment, FaPaperPlane } from 'react-icons/fa';

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
    hidden: { opacity: 0, scale: 0.95, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        when: 'beforeChildren',
        staggerChildren: 0.15,
      },
    },
  };

  // Field animation variants
  const fieldVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  };

  // Button animation variants
  const buttonVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
    hover: { scale: 1.05, boxShadow: '0 12px 30px rgba(107, 70, 193, 0.4)' },
    tap: { scale: 0.98 },
  };

  return (
    <section id='contact' className="section-padding relative overflow-hidden bg-gradient-to-b from-[#6B46C1] via-[#4A2C2A] to-black">
      <div className="absolute inset-0 bg-[url('/images/wave-pattern.svg')] bg-repeat bg-center opacity-10 mix-blend-overlay"></div>
      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          variants={formVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="glass-effect p-6 sm:p-8 lg:p-10 rounded-2xl shadow-2xl border border-white/20 bg-white/30 backdrop-blur-md"
        >
          {/* Header Section */}
          <motion.div
            variants={fieldVariants}
            className="text-center mb-8"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-transparent bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text drop-shadow-xl">
              {title}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/80 font-inter">
              We’d love to hear from you. Fill out the form below to get in touch.
            </p>
          </motion.div>

          {/* Form Container */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <motion.div variants={fieldVariants} className="relative">
              <label htmlFor="name" className="flex items-center text-sm sm:text-base font-inter text-white/90 mb-2">
                <FaUser className="mr-2 text-[#D4AF37]" size={18} />
                Name <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                id="name"
                className="w-full p-3 sm:p-4 rounded-xl bg-white/10 text-white border border-white/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/50 transition-all duration-300 placeholder-white/60"
                placeholder="Enter your name"
                aria-invalid={errors.name ? 'true' : 'false'}
              />
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.name.message}
                </motion.p>
              )}
            </motion.div>

            {/* Email Field */}
            <motion.div variants={fieldVariants} className="relative">
              <label htmlFor="email" className="flex items-center text-sm sm:text-base font-inter text-white/90 mb-2">
                <FaEnvelope className="mr-2 text-[#D4AF37]" size={18} />
                Email <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                id="email"
                className="w-full p-3 sm:p-4 rounded-xl bg-white/10 text-white border border-white/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/50 transition-all duration-300 placeholder-white/60"
                placeholder="Enter your email"
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </motion.div>

            {/* Phone Field */}
            <motion.div variants={fieldVariants} className="relative">
              <label htmlFor="phone" className="flex items-center text-sm sm:text-base font-inter text-white/90 mb-2">
                <FaPhone className="mr-2 text-[#D4AF37]" size={18} />
                Phone (Optional)
              </label>
              <input
                {...register('phone')}
                id="phone"
                className="w-full p-3 sm:p-4 rounded-xl bg-white/10 text-white border border-white/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/50 transition-all duration-300 placeholder-white/60"
                placeholder="Enter your phone number"
              />
            </motion.div>

            {/* Message Field */}
            <motion.div variants={fieldVariants} className="relative">
              <label htmlFor="message" className="flex items-center text-sm sm:text-base font-inter text-white/90 mb-2">
                <FaComment className="mr-2 text-[#D4AF37]" size={18} />
                Message <span className="text-red-400 ml-1">*</span>
              </label>
              <textarea
                {...register('message', { required: 'Message is required' })}
                id="message"
                className="w-full p-3 sm:p-4 rounded-xl bg-white/10 text-white border border-white/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/50 transition-all duration-300 placeholder-white/60"
                rows={4}
                placeholder="Enter your message"
                aria-invalid={errors.message ? 'true' : 'false'}
              />
              {errors.message && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.message.message}
                </motion.p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={buttonVariants}>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#4A2C2A] py-3 sm:py-4 rounded-xl font-playfair text-lg sm:text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                <span className="relative z-10">Send Message <FaPaperPlane className="inline ml-2 animate-bounce" size={18} /></span>
                <motion.div
                  className="absolute inset-0 bg-[#6B46C1]/30"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                />
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}