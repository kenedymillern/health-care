"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState("en");

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Reviews", href: "/#reviews" }, // ✅ SSR safe
    { name: "Career", href: "/career" },
    { name: "Contact Us", href: "/contact" },
  ];

  const contactInfo = [
    {
      icon: FaPhone,
      label: "(555) 123-4567",
      href: "tel:+15551234567",
      key: "phone",
    },
    {
      icon: FaEnvelope,
      label: "info@richhealthcare.net",
      href: "mailto:info@richhealthcare.net",
      key: "email",
    },
    {
      icon: FaMapMarkerAlt,
      label: "123 Care St, Atlanta, GA 30301",
      href: "https://maps.google.com/?q=123+Care+St,+Atlanta,+GA+30301",
      key: "address",
    },
  ];

  const languages = [
    { code: "en", name: "English", flag: "🇺🇳" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "zh", name: "Chinese", flag: "🇨🇳" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹" },
    { code: "ar", name: "Arabic", flag: "🇸🇦" },
    { code: "ru", name: "Russian", flag: "🇷🇺" },
  ];

  // Motion Variants
  const topBarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.2 },
    }),
  };

  const contactItemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 150 },
    },
    hover: {
      scale: 1.05,
      transition: { type: "spring" as const, stiffness: 200 },
    },
  };

  const langSwitcherVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring" as const, stiffness: 150 },
    },
  };

  const navContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.2, staggerChildren: 0.1 },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 120 },
    },
    hover: {
      scale: 1.05,
      color: "#D4AF37",
      transition: { type: "spring" as const, stiffness: 300 },
    },
    tap: { scale: 0.95 },
  };

  const mobileMenuVariants = {
    closed: {
      x: "100%",
      opacity: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 20 },
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const hamburgerVariants = {
    closed: { rotate: 0, scale: 1 },
    open: {
      rotate: 90,
      scale: 1.1,
      transition: { type: "spring" as const, stiffness: 200 },
    },
  };

  const logoVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { type: "spring" as const, stiffness: 200, damping: 10 },
    },
  };

  return (
    <header
      className="sticky top-0 z-50 text-white shadow-lg"
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        background:
          "linear-gradient(90deg, rgba(30, 58, 138, 0.9) 0%, rgba(6, 95, 70, 0.9) 100%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      {/* Top Contact Bar */}
      <motion.div
        variants={topBarVariants}
        initial="visible"
        animate="visible"
        className="bg-gradient-to-r from-[#1E3A8A]/80 to-[#065F46]/80 py-2 sm:py-3"
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center space-y-3 sm:space-y-0 text-xs sm:text-sm md:text-sm">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-6 lg:space-x-8">
            {contactInfo.map((item) => (
              <motion.a
                key={item.key}
                variants={contactItemVariants}
                whileHover="hover"
                href={item.href}
                className="flex items-center space-x-2 hover:text-[#D4AF37] transition-colors duration-300 group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <item.icon
                  className="text-white group-hover:text-[#D4AF37] group-hover:scale-110 transition-all duration-300"
                  size={16}
                />
                <span className="font-inter text-white/90 group-hover:text-[#D4AF37]">
                  {item.label}
                </span>
              </motion.a>
            ))}
          </div>

          {/* Language Switcher */}
          <motion.div
            variants={langSwitcherVariants}
            initial="visible"
            animate="visible"
            className="relative flex items-center bg-white/10 rounded-full px-3 py-1.5 shadow-md border border-white/20"
          >
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="appearance-none bg-transparent text-white font-inter text-sm font-medium pr-6 pl-1.5 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-full cursor-pointer"
            >
              {languages.map((language) => (
                <option
                  key={language.code}
                  value={language.code}
                  className="bg-[#1E3A8A] text-white"
                >
                  {language.flag} {language.name}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-2 text-[#D4AF37] pointer-events-none"
              width="14"
              height="14"
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
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-3"
          title="Rich Healthcare Services Home Page"
        >
          <motion.div
            variants={logoVariants}
            initial="rest"
            whileHover="hover"
            animate="rest"
            className="relative"
          >
            <Image
              src="/images/logo3.png"
              alt="Rich Healthcare Services Logo"
              width={120}
              height={84}
              className="object-contain"
              priority
            />
          </motion.div>
          <span className="text-lg md:text-xl lg:text-2xl font-playfair font-bold text-white drop-shadow-md">
            Pleasant Care
          </span>
        </Link>

        {/* Desktop Navigation */}
        <motion.nav
          variants={navContainerVariants}
          initial="visible"
          animate="visible"
          className="hidden lg:flex items-center space-x-8 xl:space-x-10"
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
                className="text-base xl:text-lg font-inter text-white/90 hover:text-[#D4AF37] transition-colors duration-300 relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] group-hover:w-full transition-all duration-300" />
              </Link>
            </motion.div>
          ))}
          <Link
            href="/contact"
            className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1E3A8A] px-4 py-2 rounded-full font-inter text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started
          </Link>
        </motion.nav>

        {/* Mobile Hamburger */}
        <motion.button
          variants={hamburgerVariants}
          animate={isOpen ? "open" : "closed"}
          whileTap="tap"
          className="lg:hidden text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </motion.button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="lg:hidden bg-gradient-to-b from-[#1E3A8A]/95 to-[#065F46]/95 shadow-xl"
            style={{
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <motion.div
              variants={navContainerVariants}
              initial="hidden"
              animate="visible"
              className="container mx-auto px-6 py-12 flex flex-col space-y-8"
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
                    className="text-lg sm:text-xl font-inter text-white hover:text-[#D4AF37] transition-colors duration-300 block py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/contact"
                className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1E3A8A] px-8 py-4 rounded-full font-inter text-lg sm:text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
