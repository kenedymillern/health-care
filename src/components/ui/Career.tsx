"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useState } from "react";

// Zod Schema
const careerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number is required"),
  position: z.string().min(2, "Position is required"),
  resume: z
    .any()
    .refine((file) => file && file.length > 0, "Resume is required"),
  message: z.string().optional(),
  terms: z.literal(true, {
    message: "You must accept the terms",
  }),
});

// TypeScript type
type CareerFormInputs = z.infer<typeof careerSchema>;

export default function Career() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CareerFormInputs>({
    resolver: zodResolver(careerSchema),
  });

  const [fileName, setFileName] = useState<string | null>(null);

  const onSubmit = (data: CareerFormInputs) => {
    console.log("Form Submitted:", data);
    alert("Application submitted successfully!");
  };

  // Watch for resume changes
  const resumeFile = watch("resume");

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative h-[100vh] w-full">
        <Image
          src="/images/career-hero.jpg"
          alt="Career at EUTRIV Health Care"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-3xl sm:text-5xl font-bold text-white drop-shadow-lg">
            Careers at EUTRIV Health Care
          </h1>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 px-6 md:px-16 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Join our home care team and make a positive difference.
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          EUTRIV Health Care delivers exceptional home care services for seniors,
          injured, and disabled individuals. We focus on pairing clients with
          caregivers who meet their specific needs. All our caregivers undergo
          thorough background checks and credential verification.
        </p>
        <p className="text-gray-600 leading-relaxed mb-6">
          Joining EUTRIV Health Care offers the chance to work in a dynamic and
          positive environment. Complete the form below to get started.
        </p>
        <div className="text-gray-800 font-medium">
          <p>
            <strong>Contact Us!</strong>
          </p>
          <p>📞 Phone Number: +15551234567</p>
          <p>📧 Email Address: eutrivhealth@gmail.com</p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-6 md:px-16 bg-gradient-to-r from-[#1E3A8A] to-[#065F46]">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Apply Now
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                {...register("fullName")}
                className="mt-1 w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                {...register("email")}
                className="mt-1 w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <PhoneInput
                country={"us"}
                enableSearch={true}
                inputProps={{
                  name: "phone",
                  required: true,
                  autoFocus: false,
                }}
                inputClass="!w-full !p-3 !border !rounded-lg"
                dropdownClass="!text-black"
                onChange={(value) => {
                  setValue("phone", value, { shouldValidate: true });
                }}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Position Applying For
              </label>
              <input
                type="text"
                {...register("position")}
                className="mt-1 w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
              />
              {errors.position && (
                <p className="text-red-500 text-sm">{errors.position.message}</p>
              )}
            </div>

            {/* Resume */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload Resume
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                {...register("resume")}
                className="mt-1 w-full p-3 border rounded-lg bg-gray-50"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    setFileName(`${file.name} (${Math.round(file.size / 1024)} KB)`);
                  } else {
                    setFileName(null);
                  }
                }}
              />
              {fileName && (
                <p className="text-sm text-gray-600 mt-2">📄 {fileName}</p>
              )}
              {errors.resume && errors.resume.message === "string" && (
                <p className="text-red-500 text-sm">{errors.resume.message}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                {...register("message")}
                rows={4}
                className="mt-1 w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
              ></textarea>
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                type="checkbox"
                {...register("terms")}
                className="mt-1 mr-2"
              />
              <span className="text-sm text-gray-700">
                I agree to the{" "}
                <a href="/terms" className="text-blue-600 underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-blue-600 underline">
                  Privacy Policy
                </a>
              </span>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-sm">{errors.terms.message}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition"
            >
              Submit Application
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
