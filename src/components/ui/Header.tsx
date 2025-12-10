"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname() || "/";
  const text = pathname === "/" ? "LLC" : "Care";
  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Reviews", href: "/#reviews" },
    { name: "Career", href: "/career" },
    { name: "Contact Us", href: "/contact" },
  ];

  const contactInfo = [
    {
      icon: FaPhone,
      label: "+1 (281) 455-2017",
      href: "tel:+12814552017",
      key: "phone",
    },
    {
      icon: FaEnvelope,
      label: "Office@eutrivhealth.com",
      href: "mailto:Office@eutrivhealth.com",
      key: "email",
    },
    {
      icon: FaMapMarkerAlt,
      label: "1506 Broadway St. Suite 211 Pearland, Texas 77581",
      href: "https://maps.google.com/?q=12808+W+Airport+Blvd,+Suite+225C,+Sugar+Land,+TX+77478",
      key: "address",
    },
  ];

  const languages = [
    { code: "en", name: "English", flag: "🇺🇳" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "zh", name: "Chinese", flag: "🇨🇳" },
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
    // hover: {
    //   scale: 1.05,
    //   rotate: 5,
    //   transition: { type: "spring" as const, stiffness: 200, damping: 10 },
    // },
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
        className="bg-gradient-to-r from-[#1E3A8A]/80 to-[#065F46]/80 py-2"
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="container mx-auto px-4 flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center space-y-2 sm:space-y-0 text-[10px] sm:text-xs md:text-sm">
          <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-x-4 lg:space-x-6">
            {contactInfo.map((item) => (
              <motion.a
                key={item.key}
                variants={contactItemVariants}
                whileHover="hover"
                href={item.href}
                className="flex items-center space-x-1.5 hover:text-[#D4AF37] transition-colors duration-300 group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <item.icon
                  className="text-white group-hover:text-[#D4AF37] group-hover:scale-110 transition-all duration-300"
                  size={14}
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
            className="relative flex items-center bg-white/10 rounded-full px-2 py-1 shadow-md border border-white/20"
          >
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="appearance-none bg-transparent text-white font-inter text-xs md:text-sm font-medium pr-5 pl-1 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-full cursor-pointer"
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
              className="absolute right-1.5 text-[#D4AF37] pointer-events-none"
              width="12"
              height="12"
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
      <div className="container mx-auto px-4 sm:px-1 max-h-[140px] flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center"
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
              src="/images/eutriv-logo.png"
              alt="Rich Healthcare Services Logo"
              width={180} // Increased logo size
              height={100}
              className="object-contain max-w-[130px] sm:max-w-[150px] md:max-w-[200px]"
              priority
            />
          </motion.div>
          <span className="text-base sm:text-lg md:text-xl font-playfair font-bold text-white drop-shadow-md">
            {`EUTRIV Health ${text}`}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <motion.nav
          variants={navContainerVariants}
          initial="visible"
          animate="visible"
          className="hidden lg:flex items-center space-x-6 xl:space-x-8"
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
                className="text-sm xl:text-base font-inter text-white/90 hover:text-[#D4AF37] transition-colors duration-300 relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] group-hover:w-full transition-all duration-300" />
              </Link>
            </motion.div>
          ))}
          <Link
            href="/contact"
            className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1E3A8A] px-3 py-1.5 rounded-full font-inter text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started
          </Link>
        </motion.nav>

        {/* Mobile Hamburger */}
        <motion.button
          variants={hamburgerVariants}
          animate={isOpen ? "open" : "closed"}
          whileTap="tap"
          className="lg:hidden text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded p-1.5"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
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
              className="container mx-auto px-6 py-8 flex flex-col space-y-6"
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
                    className="text-base sm:text-lg font-inter text-white hover:text-[#D4AF37] transition-colors duration-300 block py-1.5"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/contact"
                className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#1E3A8A] px-6 py-3 rounded-full font-inter text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-center"
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