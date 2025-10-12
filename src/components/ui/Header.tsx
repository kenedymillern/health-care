'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState('en');

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const contactInfo = [
    { icon: FaPhone, label: '(555) 123-4567', href: 'tel:+15551234567', key: 'phone' },
    { icon: FaEnvelope, label: 'info@pleasanthomecare.net', href: 'mailto:info@pleasanthomecare.net', key: 'email' },
    { icon: FaMapMarkerAlt, label: '123 Care St, Atlanta, GA 30301', href: 'https://maps.google.com/?q=123+Care+St,+Atlanta,+GA+30301', key: 'address' },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇳' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  ];

  // Animation variants
  const topBarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.1 } },
  };

  const contactItemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 150 } },
    hover: { scale: 1.05, transition: { type: 'spring', stiffness: 200 } },
  };

  const langSwitcherVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 150 } },
  };

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: 'easeOut', when: 'beforeChildren' } },
  };

  const navContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delayChildren: 0.2, staggerChildren: 0.1 } },
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
    hover: { scale: 1.05, color: '#D4AF37', transition: { type: 'spring', stiffness: 300 } },
    tap: { scale: 0.95 },
  };

  const mobileMenuVariants = {
    closed: { x: '100%', opacity: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
    open: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 20, when: 'beforeChildren', staggerChildren: 0.1 },
    },
  };

  const hamburgerVariants = {
    closed: { rotate: 0, scale: 1 },
    open: { rotate: 90, scale: 1.1, transition: { type: 'spring', stiffness: 200 } },
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-50 bg-gradient-to-r from-[#1E3A8A] to-[#065F46] text-white shadow-lg"
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'linear-gradient(90deg, rgba(30, 58, 138, 0.9) 0%, rgba(6, 95, 70, 0.9) 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      {/* Top Contact Bar */}
      <motion.div
        variants={topBarVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-[#1E3A8A]/80 to-[#065F46]/80 py-3 sm:py-4"
        style={{
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center space-y-3 sm:space-y-0 text-sm">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-6 sm:space-y-0 lg:space-x-8">
            {contactInfo.map((item) => (
              <motion.a
                key={item.key}
                variants={contactItemVariants}
                whileHover="hover"
                href={item.href}
                className="flex items-center space-x-3 hover:text-[#D4AF37] transition-colors duration-300 group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <item.icon className="text-white group-hover:text-[#D4AF37] group-hover:scale-110 transition-all duration-300" size={18} />
                <span className="font-inter text-white/90 group-hover:text-[#D4AF37]">{item.label}</span>
              </motion.a>
            ))}
          </div>
          {/* Language Switcher */}
          <motion.div
            variants={langSwitcherVariants}
            className="relative flex items-center bg-white/10 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow-md border border-white/20"
          >
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="appearance-none bg-transparent text-white font-inter text-xs sm:text-sm font-medium pr-8 pl-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-full cursor-pointer"
              aria-label="Select Language"
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code} className="font-inter bg-[#1E3A8A] text-white">
                  {language.flag} {language.name}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-2 sm:right-3 text-[#D4AF37] pointer-events-none"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 sm:space-x-4" title="Pleasant Home Care Home Page">
          <motion.div
            variants={{
              rest: { scale: 1, rotate: 0 },
              hover: { scale: 1.1, rotate: 5 },
            }}
            initial="rest"
            whileHover="hover"
            animate="rest"
            transition={{ type: 'spring', stiffness: 200 }}
            className="relative"
          >
            <Image
              src="/images/logo.jpg"
              alt="Pleasant Home Care Logo"
              width={48}
              height={48}
              className="md:w-[64px] md:h-[64px] rounded-full shadow-lg border-2 border-white/30"
              priority
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1E3A8A]/30 to-[#065F46]/30 blur-md" />
          </motion.div>
          <span className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-white drop-shadow-md">
            Pleasant Home Care
          </span>
        </Link>

        {/* Desktop Navigation */}
        <motion.nav
          variants={navContainerVariants}
          initial="hidden"
          animate="visible"
          className="hidden md:flex items-center space-x-6 lg:space-x-10"
        >
          {navItems.map((item) => (
            <motion.div
              key={item.name}
              variants={navItemVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                href={item.href}
                className="text-base lg:text-lg font-inter text-white/90 hover:text-[#D4AF37] transition-colors duration-300 relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] group-hover:w-full transition-all duration-300" />
              </Link>
            </motion.div>
          ))}
          <motion.a
            variants={navItemVariants}
            whileHover="hover"
            whileTap="tap"
            href="/contact"
            className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1E3A8A] px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full font-inter text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started
          </motion.a>
        </motion.nav>

        {/* Mobile Hamburger Button */}
        <motion.button
          variants={hamburgerVariants}
          animate={isOpen ? 'open' : 'closed'}
          whileTap="tap"
          className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded p-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="md:hidden bg-gradient-to-b from-[#1E3A8A]/95 to-[#065F46]/95 shadow-xl"
            style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          >
            <motion.div
              variants={navContainerVariants}
              initial="hidden"
              animate="visible"
              className="container mx-auto px-4 sm:px-6 py-12 flex flex-col space-y-8"
            >
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  variants={navItemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="relative"
                >
                  <Link
                    href={item.href}
                    className="text-xl font-inter text-white hover:text-[#D4AF37] transition-colors duration-300 block py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] group-hover:w-full transition-all duration-300" />
                  </Link>
                </motion.div>
              ))}
              <motion.a
                variants={navItemVariants}
                whileHover="hover"
                whileTap="tap"
                href="/contact"
                className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1E3A8A] px-8 py-4 rounded-full font-inter text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </motion.a>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}