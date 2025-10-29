'use client';

import Image from 'next/image';
import Link from 'next/link';
import Reachout from './Reachout';
import { useQuery } from '@tanstack/react-query';
import { Service } from '@/types';

const fetchServices = async (): Promise<Service[]> => {
  const response = await fetch('/api/services');
  if (!response.ok) {
    throw new Error('Failed to fetch services');
  }
  return response.json();
};

export default function Services() {
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: fetchServices,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

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
        {isLoading ? (
          <div className="flex flex-col space-y-4 animate-pulse">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg shadow-md overflow-hidden flex flex-col"
              >
                <div className="h-30 w-full bg-gray-300 mb-2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500">Error loading services</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.map((service) => (
              <Link
                href={`/services/${service.slug}`}
                key={service.slug}
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
        )}
      </section>
      <Reachout />
    </div>
  );
}