"use client";

import Reachout from "@/components/ui/Reachout";
import Image from "next/image";
import { notFound } from "next/navigation";
import { use } from "react";

// Define services array (ideally, this would come from a shared data source or API)
const services = [
  {
    title: "Alzheimer's and Dementia",
    slug: "alzheimers-dementia",
    fullDescription:
      "Our Alzheimer's and Dementia care services are tailored to meet the unique needs of individuals with memory-related conditions. Our compassionate caregivers provide structured routines, cognitive stimulation, and emotional support to enhance safety and well-being, while fostering a sense of dignity and comfort in familiar surroundings.",
    image: "/images/alzheimers-care.jpg",
  },
  {
    title: "Companion Care",
    slug: "companion-care",
    fullDescription:
      "Our Companion Care services focus on building meaningful connections to improve quality of life. Caregivers assist with daily activities, engage in conversations, and encourage social interaction, helping clients stay active and connected while maintaining their independence at home.",
    image: "/images/companion-care.jpg",
  },
  {
    title: "Live-In and 24-Hour Care",
    slug: "live-in-24-hour-care",
    fullDescription:
      "Our Live-In and 24-Hour Care services provide continuous support for individuals requiring constant supervision. Dedicated caregivers ensure safety, comfort, and assistance with daily tasks, offering peace of mind for families and personalized care for clients around the clock.",
    image: "/images/live-in-care.jpg",
  },
  {
    title: "Personal Care",
    slug: "personal-care",
    fullDescription:
      "Personal Care services at EUTRIV Health Care are designed to support independence while assisting with daily activities such as bathing, dressing, grooming, and mobility. Our caregivers provide respectful, compassionate care to ensure comfort and maintain dignity for every client.",
    image: "/images/personal-care.jpg",
  },
  {
    title: "Home Care",
    slug: "home-care",
    fullDescription:
      "Our Home Care services offer comprehensive support, including meal preparation, light housekeeping, medication reminders, and transportation assistance. Tailored to each client’s needs, we help individuals maintain their independence and live comfortably in their own homes.",
    image: "/images/home-care.jpg",
  },
  {
    title: "Respite Care",
    slug: "respite-care",
    fullDescription:
      "Respite Care offers family caregivers a well-deserved break while ensuring their loved ones receive professional, compassionate care. Our caregivers provide temporary support, maintaining safety and well-being, so families can recharge with confidence.",
    image: "/images/respite-care.jpg",
  },
  {
    title: "Skilled Nursing",
    slug: "skilled-nursing",
    fullDescription:
      "Our Skilled Nursing services deliver expert medical care at home, provided by licensed nurses. From wound care and medication management to health monitoring, we address complex health needs with professionalism, ensuring comfort and recovery in a familiar environment.",
    image: "/images/skilled-nursing.jpg",
  },
];

export default function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  // Unwrap the params Promise using React.use()
  const { slug } = use(params);

  // Find the service based on the slug
  const service = services.find((s) => s.slug === slug);

  // If no service is found, return 404
  if (!service) {
    notFound();
  }

  return (
    <div className="w-full bg-white">
      {/* Hero Section with Service Image as Background */}
      <section className="relative h-[100vh] w-full">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-3xl text-center sm:text-5xl font-bold text-white drop-shadow-lg">
            {service.title}
          </h1>
        </div>
      </section>

      {/* Service Details Section */}
      <section className="py-12 px-6 md:px-16 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          {service.title}
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          {service.fullDescription}
        </p>
      </section>
      <Reachout />
    </div>
  );
}