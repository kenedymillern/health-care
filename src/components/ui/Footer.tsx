'use client';

import { motion } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  ArrowUpIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

type NewsletterInput = {
  email: string;
};

export default function Footer() {
  const { register, handleSubmit, formState: { errors } } = useForm<NewsletterInput>();

  const onSubmit: SubmitHandler<NewsletterInput> = (data) => {
    console.log(data);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative bg-gradient-to-r from-[#1E3A8A] to-[#065F46] text-white"
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'linear-gradient(90deg, rgba(30, 58, 138, 0.9) 0%, rgba(6, 95, 70, 0.9) 100%)',
      }}
    >
      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1E3A8A] rounded-full p-3 shadow-lg transition-colors hover:shadow-xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Scroll to top"
      >
        <ArrowUpIcon className="h-6 w-6" />
      </motion.button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center mb-6">
              <div className="relative mr-3">
                <Image
                  src="/images/logo3.png"
                  alt="Rich Healthcare Services Logo"
                  width={120}
                  height={84}
                  className="object-contain"
                  priority
                  sizes="(max-width: 640px) 60px, (max-width: 1024px) 70px, 80px"
                />
                {/* <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1E3A8A]/30 to-[#065F46]/30 blur-md" /> */}
              </div>
              <div>
                <h3 className="text-2xl font-playfair font-bold">Pleasant Home Care</h3>
                <p className="text-sm text-gray-300 font-inter">Compassionate Care Services</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md font-inter">
              Your trusted partner for compassionate home care services. We provide personalized care plans to ensure comfort and well-being for you and your loved ones.
            </p>
            {/* Social Media */}
            <div className="flex space-x-4">
              {[
                { name: 'Facebook', href: '#', initial: 'F' },
                { name: 'Twitter', href: '#', initial: 'T' },
                { name: 'Instagram', href: '#', initial: 'I' },
                { name: 'LinkedIn', href: '#', initial: 'L' },
              ].map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#FFD700] rounded-full flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  aria-label={social.name}
                >
                  <span className="text-sm font-bold font-inter">{social.initial}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h4 className="text-lg font-playfair font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'About Us', href: '/about' },
                { name: 'Services', href: '/services' },
                { name: 'Reviews', href: '/reviews' },
                { name: 'Blog', href: '/blog' },
                { name: 'Contact', href: '/contact' },
                { name: 'Get Started', href: '/contact' },
              ].map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={{ x: 8 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-[#D4AF37] transition-colors font-inter"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h4 className="text-lg font-playfair font-semibold mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <PhoneIcon className="h-5 w-5 text-[#D4AF37] mt-1 flex-shrink-0" />
                <div>
                  <a href="tel:+15551234567" className="text-gray-300 hover:text-white transition-colors font-inter">
                    (555) 123-4567
                  </a>
                  <p className="text-xs text-gray-400 font-inter">Mon - Sat: 8AM - 6PM</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-[#D4AF37] mt-1 flex-shrink-0" />
                <div>
                  <a href="mailto:info@pleasanthomecare.net" className="text-gray-300 hover:text-white transition-colors font-inter">
                    info@pleasanthomecare.net
                  </a>
                  <p className="text-xs text-gray-400 font-inter">We reply within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-[#D4AF37] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-inter">123 Care St</p>
                  <p className="text-gray-300 font-inter">Atlanta, GA 30301</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <ClockIcon className="h-5 w-5 text-[#D4AF37] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-inter">Mon - Sat: 8AM - 6PM</p>
                  <p className="text-xs text-gray-400 font-inter">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="border-t border-white/20 pt-8 mb-8"
        >
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-lg font-playfair font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-300 mb-6 font-inter">Receive the latest care tips, updates, and special offers directly to your inbox.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex">
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                })}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-inter"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1E3A8A] px-6 py-3 rounded-r-lg font-semibold font-inter transition-colors"
              >
                Subscribe
              </motion.button>
            </form>
            {errors.email && (
              <p className="text-red-200 text-sm mt-2 font-inter">{errors.email.message}</p>
            )}
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm mb-4 md:mb-0 font-inter">
              © {currentYear} Pleasant Home Care. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center space-x-6 text-sm">
              <Link href="#" className="text-gray-300 hover:text-[#D4AF37] transition-colors font-inter">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-300 hover:text-[#D4AF37] transition-colors font-inter">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-300 hover:text-[#D4AF37] transition-colors font-inter">
                Cookie Policy
              </Link>
              <span className="text-gray-500">|</span>
              <span className="text-gray-300 font-inter">Made with ❤️ in Atlanta</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}