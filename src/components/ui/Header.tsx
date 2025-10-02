'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState('en'); // Language state (ISO codes for i18n)

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  // Contact details (update with real info)
  const contactInfo = [
    { icon: FaPhone, label: '(555) 123-4567', href: 'tel:+15551234567', key: 'phone' },
    { icon: FaEnvelope, label: 'info@pleasanthomecare.net', href: 'mailto:info@pleasanthomecare.net', key: 'email' },
    { icon: FaMapMarkerAlt, label: '123 Care St, Atlanta, GA 30301', href: 'https://maps.google.com/?q=123+Care+St,+Atlanta,+GA+30301', key: 'address' },
  ];

  // Language options with flags
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

  // Top bar animation
  const topBarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

  // Contact item variants
  const contactItemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 150 },
    },
    hover: {
      scale: 1.05,
      transition: { type: 'spring', stiffness: 200 },
    },
  };

  // Language switcher variants
  const langSwitcherVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 150 },
    },
  };

  // Header animation
  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        when: 'beforeChildren',
      },
    },
  };

  // Navigation container
  const navContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  // Nav link variants
  const navItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 120 },
    },
    hover: {
      scale: 1.05,
      color: '#34D399',
      transition: { type: 'spring', stiffness: 300 },
    },
    tap: { scale: 0.95 },
  };

  // Mobile menu
  const mobileMenuVariants = {
    closed: {
      x: '100%',
      opacity: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  // Hamburger button
  const hamburgerVariants = {
    closed: { rotate: 0 },
    open: { rotate: 90, transition: { type: 'spring', stiffness: 200 } },
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-50 header-glass-effect bg-gradient-to-r from-teal-50/80 via-white/80 to-teal-50/80 shadow-sm"
    >
      {/* Top Contact Bar */}
      <motion.div
        variants={topBarVariants}
        initial="hidden"
        animate="visible"
        className="bg-teal-100/90 header-glass-effect border-b border-gradient-to-r from-teal-300/50 via-transparent to-teal-300/50 py-2 sm:py-3"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0 text-sm text-teal-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 lg:space-x-8">
            {contactInfo.map((item) => (
              <motion.a
                key={item.key}
                variants={contactItemVariants}
                whileHover="hover"
                href={item.href}
                className="flex items-center space-x-2 hover:text-teal-500 transition-colors duration-200 group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <item.icon className="text-teal-600 group-hover:scale-110 group-hover:text-teal-500 transition-transform duration-200" size={16} />
                <span className="font-poppins">{item.label}</span>
              </motion.a>
            ))}
          </div>
          {/* Language Switcher */}
          <motion.div
            variants={langSwitcherVariants}
            className="relative flex items-center bg-white/70 header-glass-effect rounded-full px-3 py-1.5 shadow-sm"
          >
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="appearance-none bg-transparent text-teal-700 font-poppins text-sm font-semibold pr-8 pl-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full cursor-pointer"
              aria-label="Select Language"
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code} className="font-poppins">
                  {language.flag} {language.name}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-2 text-teal-600 pointer-events-none"
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3" title="Pleasant Home Care Home Page">
          <motion.div
            variants={{
              rest: { scale: 1, rotate: 0 },
              hover: { scale: 1.1, rotate: 5 },
            }}
            initial="rest"
            whileHover="hover"
            animate="rest"
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Image
              src="/images/logo.jpg"
              alt="Pleasant Home Care Logo"
              width={48}
              height={48}
              className="rounded-full shadow-md"
              priority
            />
          </motion.div>
          <span className="text-2xl sm:text-3xl font-lora font-semibold text-teal-700 drop-shadow-sm">
            Pleasant Home Care
          </span>
        </Link>

        {/* Desktop Navigation */}
        <motion.nav
          variants={navContainerVariants}
          initial="hidden"
          animate="visible"
          className="hidden md:flex items-center space-x-6 lg:space-x-8"
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
                className="text-base lg:text-lg font-poppins text-teal-800 hover:text-teal-500 transition-colors duration-200 relative"
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
          <motion.a
            variants={navItemVariants}
            whileHover="hover"
            whileTap="tap"
            href="/contact"
            className="bg-teal-500 text-white px-4 py-2 rounded-full font-poppins text-base shadow-md hover:bg-teal-600 transition-colors cursor-pointer"
          >
            Get Started
          </motion.a>
        </motion.nav>

        {/* Mobile Hamburger Button */}
        <motion.button
          variants={hamburgerVariants}
          animate={isOpen ? 'open' : 'closed'}
          whileTap="tap"
          className="md:hidden text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
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
            className="md:hidden bg-teal-50/95 header-glass-effect shadow-lg"
          >
            <motion.div
              variants={navContainerVariants}
              initial="hidden"
              animate="visible"
              className="container mx-auto px-4 sm:px-6 py-8 flex flex-col space-y-6"
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
                    className="text-lg font-poppins text-teal-800 hover:text-teal-500 transition-colors duration-200 cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.a
                variants={navItemVariants}
                whileHover="hover"
                whileTap="tap"
                href="/contact"
                className="bg-teal-500 text-white px-6 py-3 rounded-full font-poppins text-lg text-center shadow-md hover:bg-teal-600 transition-colors"
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