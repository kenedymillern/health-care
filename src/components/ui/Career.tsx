"use client";

import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useState } from "react";
import { useMutation } from '@tanstack/react-query';
import { useApp } from '@/context/app-context';
import toast from 'react-hot-toast';
import { CareerData } from '@/types';

// Zod Schema
const careerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name must be 100 characters or less"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number must be at least 8 characters").max(20, "Phone number must be 20 characters or less"),
  position: z.string().min(2, "Position must be at least 2 characters").max(100, "Position must be 100 characters or less"),
  resume: z
    .instanceof(File)
    .optional()
    .refine((file) => file !== undefined, "Resume is required")
    .refine(
      (file) => !file || file.size <= 10 * 1024 * 1024,
      "Resume file size must not exceed 10MB"
    )
    .refine(
      (file) =>
        !file ||
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type),
      "Only PDF and Word (.doc, .docx) files are allowed"
    ),
  message: z.string().min(1, "Message is required").max(1000, "Message must be 1000 characters or less"),
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
    reset,
  } = useForm<CareerFormInputs>({
    resolver: zodResolver(careerSchema),
  });

  const [fileName, setFileName] = useState<string | null>(null);
  const { actions } = useApp();
  const [retryCount, setRetryCount] = useState(0);

  const mutation = useMutation({
    mutationFn: async (data: CareerFormInputs) => {
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('phoneNumber', data.phone);
      formData.append('position', data.position);
      formData.append('message', data.message);
      formData.append('resume', data.resume!);

      const response = await fetch('/api/career', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit application');
      }
      return response.json() as Promise<CareerData>;
    },
    onMutate: () => {
      setRetryCount(0); // Reset retry count on new submission
    },
    onSuccess: () => {
      toast.success('Application submitted successfully!');
      reset();
      setFileName(null);
      actions.setLoading(false);
      setRetryCount(0);
    },
    onError: (error: any) => {
      if (error.message.includes('Cloudinary') && retryCount < 3) {
        setRetryCount((prev) => prev + 1);
        toast.error(`Retrying upload (${retryCount + 1}/3)...`, { id: 'retry-toast' });
      } else {
        toast.error(error.message || 'Failed to submit application');
        actions.setLoading(false);
        setRetryCount(0);
      }
    },
  });

  const onSubmit: SubmitHandler<CareerFormInputs> = (data) => {
    actions.setLoading(true);
    mutation.mutate(data);
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
          <p>📞 Phone Number: +1 (281) 725-7475</p>
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
                inputClass="!w-full !pl-12 !pr-3 !py-3 !border !rounded-lg"
                dropdownClass="!text-black"
                containerClass="!w-full"
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
                className="mt-1 w-full p-3 border rounded-lg bg-gray-50 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setValue("resume", file, { shouldValidate: true });
                    setFileName(`${file.name} (${Math.round(file.size / 1024)} KB)`);
                  } else {
                    setValue("resume", undefined, { shouldValidate: true });
                    setFileName(null);
                  }
                }}
              />
              {fileName && (
                <p className="text-sm text-gray-600 mt-2">📄 {fileName}</p>
              )}
              {errors.resume && (
                <p className="text-red-500 text-sm">{errors.resume.message}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("message")}
                rows={4}
                className="mt-1 w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
              ></textarea>
              {errors.message && (
                <p className="text-red-500 text-sm">{errors.message.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition disabled:opacity-50 cursor-pointer"
            >
              {mutation.isPending ? (
                <span className="flex items-center justify-center">
                  {retryCount > 0 ? `Retrying (${retryCount}/3)` : 'Submitting'}
                  <svg
                    className="animate-spin ml-2 h-5 w-5 text-white"
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
                'Submit Application'
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}