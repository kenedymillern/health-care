"use client";

import Image from "next/image";
import Link from "next/link";
import Reachout from "./Reachout";

export default function Services() {
  // Define services with titles, slugs, short and full descriptions, and image paths
  const services = [
    {
      title: "Alzheimer's and Dementia",
      slug: "alzheimers-dementia",
      shortDescription:
        "Specialized care for Alzheimer's and dementia, focusing on memory support and safety.",
      fullDescription:
        "Our Alzheimer's and Dementia care services are tailored to meet the unique needs of individuals with memory-related conditions. Our compassionate caregivers provide structured routines, cognitive stimulation, and emotional support to enhance safety and well-being, while fostering a sense of dignity and comfort in familiar surroundings.",
      image: "/images/alzheimers-care.jpg",
    },
    {
      title: "Companion Care",
      slug: "companion-care",
      shortDescription:
        "Companionship and support to enhance daily life and social engagement.",
      fullDescription:
        "Our Companion Care services focus on building meaningful connections to improve quality of life. Caregivers assist with daily activities, engage in conversations, and encourage social interaction, helping clients stay active and connected while maintaining their independence at home.",
      image: "/images/companion-care.jpg",
    },
    {
      title: "Live-In and 24-Hour Care",
      slug: "live-in-24-hour-care",
      shortDescription:
        "Round-the-clock care for continuous support and safety.",
      fullDescription:
        "Our Live-In and 24-Hour Care services provide continuous support for individuals requiring constant supervision. Dedicated caregivers ensure safety, comfort, and assistance with daily tasks, offering peace of mind for families and personalized care for clients around the clock.",
      image: "/images/live-in-care.jpg",
    },
    {
      title: "Personal Care",
      slug: "personal-care",
      shortDescription:
        "Assistance with daily activities like bathing and grooming with dignity.",
      fullDescription:
        "Personal Care services at EUTRIV Health Care are designed to support independence while assisting with daily activities such as bathing, dressing, grooming, and mobility. Our caregivers provide respectful, compassionate care to ensure comfort and maintain dignity for every client.",
      image: "/images/personal-care.jpg",
    },
    {
      title: "Home Care",
      slug: "home-care",
      shortDescription:
        "In-home support for daily tasks to maintain independence.",
      fullDescription:
        "Our Home Care services offer comprehensive support, including meal preparation, light housekeeping, medication reminders, and transportation assistance. Tailored to each client’s needs, we help individuals maintain their independence and live comfortably in their own homes.",
      image: "/images/home-care.jpg",
    },
    {
      title: "Respite Care",
      slug: "respite-care",
      shortDescription:
        "Temporary care to provide relief for family caregivers.",
      fullDescription:
        "Respite Care offers family caregivers a well-deserved break while ensuring their loved ones receive professional, compassionate care. Our caregivers provide temporary support, maintaining safety and well-being, so families can recharge with confidence.",
      image: "/images/respite-care.jpg",
    },
    {
      title: "Skilled Nursing",
      slug: "skilled-nursing",
      shortDescription:
        "Expert medical care by licensed nurses for complex health needs.",
      fullDescription:
        "Our Skilled Nursing services deliver expert medical care at home, provided by licensed nurses. From wound care and medication management to health monitoring, we address complex health needs with professionalism, ensuring comfort and recovery in a familiar environment.",
      image: "/images/skilled-nursing.jpg",
    },
  ];

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative h-[100vh] w-full">
        <Image
          src="/images/service.jpg"
          alt="About EUTRIV Health Care"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-3xl text-center sm:text-5xl font-bold text-white drop-shadow-lg">
            Our Services
          </h1>
        </div>
      </section>

      {/* Services Intro Section */}
      <section className="py-12 px-6 md:px-16 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Comprehensive Home Care Services for Diverse Needs
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          At EUTRIV Health Care, we provide personalized, compassionate care to
          support individuals and families in the comfort of their own homes. Our
          services are designed to promote independence, enhance quality of life,
          and address a wide range of needs with professionalism and empathy.
        </p>
      </section>

      {/* Services Grid Section */}
      <section className="py-12 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Link
              href={`/services/${service.slug}`}
              key={index}
              className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.shortDescription}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Reachout />
    </div>
  );
}