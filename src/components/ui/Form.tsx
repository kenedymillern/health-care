"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaComment, FaPaperPlane } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { useApp } from "@/context/app-context";
import toast from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import sanitizeHtml from "sanitize-html"; // Import sanitize-html

// Sanitization configuration
const sanitizeOptions = {
  allowedTags: [], // Remove all HTML tags
  allowedAttributes: {}, // Remove all attributes
};

// Define Zod schema for form validation with regex for name
const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less")
    .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
  email: z.string().email("Invalid email format"),
  phone: z
    .string()
    .min(8, "Phone number must be at least 8 characters")
    .max(20, "Phone number must be 20 characters or less")
    .optional(),
  message: z
    .string()
    .min(1, "Message is required")
    .max(1000, "Message must be 1000 characters or less"),
  recaptchaToken: z.string().min(1, "Please complete the reCAPTCHA verification"),
});

// Infer TypeScript type from Zod schema
type FormInput = z.infer<typeof contactSchema>;

export default function Form({ title = "Contact Us" }: { title?: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormInput>({
    resolver: zodResolver(contactSchema),
  });
  const { actions } = useApp();
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle reCAPTCHA v2 callback
  const handleRecaptcha = useCallback(
    (token: string) => {
      setValue("recaptchaToken", token, { shouldValidate: true });
      setIsRecaptchaVerified(true); // Enable submit button after verification
    },
    [setValue]
  );

  // Handle reCAPTCHA expiration or reset
  const handleRecaptchaExpired = useCallback(() => {
    // Only handle expiration if not submitting
    if (!isSubmitting) {
      setValue("recaptchaToken", "", { shouldValidate: true });
      setIsRecaptchaVerified(false); // Disable submit button if reCAPTCHA expires
    }
  }, [setValue, isSubmitting]);

  // Load reCAPTCHA v2 script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.onload = () => setRecaptchaLoaded(true);
    document.body.appendChild(script);

    // Set global callbacks
    window.onRecaptchaSuccess = handleRecaptcha;
    window.onRecaptchaExpired = handleRecaptchaExpired;

    return () => {
      document.body.removeChild(script);
      if (window.onRecaptchaSuccess) {
        delete window.onRecaptchaSuccess;
      }
      if (window.onRecaptchaExpired) {
        delete window.onRecaptchaExpired;
      }
    };
  }, [handleRecaptcha, handleRecaptchaExpired]);

  const mutation = useMutation({
    mutationFn: async (data: FormInput) => {
      // Sanitize inputs before sending to API
      const sanitizedData = {
        name: sanitizeHtml(data.name, sanitizeOptions),
        email: data.email,
        phone: data.phone,
        message: sanitizeHtml(data.message, sanitizeOptions),
        recaptchaToken: data.recaptchaToken,
      };
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit contact form");
      }
      return response.json();
    },
    onMutate: () => {
      setIsSubmitting(true); // Set submitting state
    },
    onSuccess: () => {
      toast.success("Message sent successfully!");
      reset(); // Clear form fields
      actions.setLoading(false);
      setIsRecaptchaVerified(false); // Reset reCAPTCHA state
      setIsSubmitting(false); // Reset submitting state
      if (window.grecaptcha) {
        window.grecaptcha.reset();
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send message");
      actions.setLoading(false);
      setIsRecaptchaVerified(false); // Reset reCAPTCHA state
      setIsSubmitting(false); // Reset submitting state
      if (window.grecaptcha) {
        window.grecaptcha.reset();
      }
    },
  });

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    actions.setLoading(true);
    mutation.mutate(data);
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
        when: "beforeChildren",
        staggerChildren: 0.15,
      },
    },
  };

  // Field animation variants
  const fieldVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
  };

  // Button animation variants
  const buttonVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120 } },
    hover: { scale: 1.05, boxShadow: "0 12px 30px rgba(107, 70, 193, 0.4)" },
    tap: { scale: 0.98 },
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[url('/images/wave-pattern.svg')] bg-repeat bg-center opacity-10 mix-blend-overlay"></div>
      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          variants={formVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="p-6 sm:p-8 lg:p-10 rounded-2xl shadow-2xl border border-white/20 bg-white/30 bg-gradient-to-r from-[#1E3A8A] to-[#065F46] backdrop-blur-md"
        >
          {/* Header Section */}
          <motion.div variants={fieldVariants} className="text-center mb-8">
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
                {...register("name")}
                id="name"
                className="w-full p-3 sm:p-4 rounded-xl bg-white/10 text-white border border-white/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/50 transition-all duration-300 placeholder-white/60"
                placeholder="Enter your name"
                aria-invalid={errors.name ? "true" : "false"}
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
                {...register("email")}
                id="email"
                className="w-full p-3 sm:p-4 rounded-xl bg-white/10 text-white border border-white/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/50 transition-all duration-300 placeholder-white/60"
                placeholder="Enter your email"
                aria-invalid={errors.email ? "true" : "false"}
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
              <PhoneInput
                country={"us"}
                enableSearch={true}
                inputProps={{
                  name: "phone",
                  required: false,
                  autoFocus: false,
                }}
                inputClass="!w-full !p-6 !pl-12 !sm:p-4 !rounded-xl !bg-white/10 !text-white !border !border-white/30 !focus:border-[#D4AF37] !focus:ring-2 !focus:ring-[#D4AF37]/50 !transition-all !duration-300 !placeholder-white/60"
                dropdownClass="!text-black"
                containerClass="!w-full"
                onChange={(value) => {
                  setValue("phone", value || undefined, { shouldValidate: true });
                }}
              />
              {errors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.phone.message}
                </motion.p>
              )}
            </motion.div>

            {/* Message Field */}
            <motion.div variants={fieldVariants} className="relative">
              <label htmlFor="message" className="flex items-center text-sm sm:text-base font-inter text-white/90 mb-2">
                <FaComment className="mr-2 text-[#D4AF37]" size={18} />
                Message <span className="text-red-400 ml-1">*</span>
              </label>
              <textarea
                {...register("message")}
                id="message"
                className="w-full p-3 sm:p-4 rounded-xl bg-white/10 text-white border border-white/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/50 transition-all duration-300 placeholder-white/60"
                rows={4}
                placeholder="Enter your message"
                aria-invalid={errors.message ? "true" : "false"}
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

            {/* reCAPTCHA v2 Checkbox */}
            <motion.div variants={fieldVariants}>
              <label className="flex items-center text-sm sm:text-base font-inter text-white/90 mb-2">
                Verify You're Not a Robot
              </label>
              {recaptchaLoaded && (
                <div
                  className="g-recaptcha"
                  data-sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY}
                  data-callback="onRecaptchaSuccess"
                  data-expired-callback="onRecaptchaExpired"
                ></div>
              )}
              {errors.recaptchaToken && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2"
                >
                  {errors.recaptchaToken.message}
                </motion.p>
              )}
            </motion.div>

            {/* reCAPTCHA Notice */}
            <motion.div variants={fieldVariants} className="text-sm text-white/80 font-inter">
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">
                Terms of Service
              </a>{" "}
              apply.
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={buttonVariants}>
              <button
                type="submit"
                disabled={mutation.isPending || !recaptchaLoaded || !isRecaptchaVerified}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#4A2C2A] py-3 sm:py-4 rounded-xl font-playfair text-lg sm:text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">
                  {mutation.isPending ? (
                    <span className="flex items-center justify-center">
                      Sending...
                      <svg
                        className="animate-spin ml-2 h-5 w-5 text-[#4A2C2A]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                        ></path>
                      </svg>
                    </span>
                  ) : (
                    <>
                      Send Message <FaPaperPlane className="inline ml-2 animate-bounce" size={18} />
                    </>
                  )}
                </span>
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