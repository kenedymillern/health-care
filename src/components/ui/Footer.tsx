'use client';

import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { useForm, SubmitHandler } from 'react-hook-form';

type NewsletterInput = {
  email: string;
};

export default function Footer() {
  const { register, handleSubmit, formState: { errors } } = useForm<NewsletterInput>();

  const onSubmit: SubmitHandler<NewsletterInput> = (data) => {
    console.log(data);
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative bg-gradient-to-r from-teal-400 via-teal-600 to-teal-300 text-white section-padding shadow-xl"
    >
      {/* Subtle dark overlay for readability */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand Section */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl font-lora font-bold">Pleasant Home Care</h3>
          <p className="mt-4 font-poppins text-gray-100">
            Delivering compassionate care with a personal touch.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-2xl font-lora font-bold">Quick Links</h3>
          <ul className="mt-4 space-y-3">
            {['About Us', 'Services', 'Contact'].map((link) => (
              <motion.li
                key={link}
                whileHover={{ x: 8 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <a
                  href={`/${link.toLowerCase().replace(' ', '-')}`}
                  className="font-poppins hover:text-accent transition-colors duration-300"
                >
                  {link}
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Newsletter */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-2xl font-lora font-bold">Newsletter</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
              })}
              placeholder="Your Email"
              className="w-full p-3 rounded-md text-gray-800 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-teal-300 transition"
            />
            {errors.email && (
              <p className="text-red-200 text-sm">{errors.email.message}</p>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-secondary hover:bg-accent text-white py-3 rounded-md font-poppins shadow-md transition-colors duration-300"
            >
              Subscribe
            </motion.button>
          </form>

          {/* Social Icons */}
          <div className="flex space-x-6 mt-6 justify-center">
            {[FaFacebook, FaTwitter, FaLinkedin].map((Icon, index) => (
              <motion.a
                key={index}
                href="#"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="text-white hover:text-accent transition-colors duration-300"
              >
                <Icon size={28} />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      <p className="relative z-10 text-center mt-12 font-poppins text-gray-100">
        &copy; 2025 Pleasant Home Care. All rights reserved.
      </p>
    </motion.footer>
  );
}
