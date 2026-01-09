'use client';

import Reachout from '@/components/ui/Reachout';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Service } from '@/types';

const fetchServiceBySlug = async (slug: string): Promise<Service> => {
  const response = await fetch(`/api/services/${slug}`);
  if (!response.ok) {
    throw new Error('Failed to fetch service');
  }
  return response.json();
};

export default function ServicePage() {
  const params = useParams();
  const slug = params.slug as string;

  // Guard against invalid slug (e.g., array or undefined)
  if (!slug || Array.isArray(slug)) {
    notFound();
  }

  const {
    data: service,
    isLoading,
    error,
  } = useQuery<Service>({
    queryKey: ['service', slug],
    queryFn: () => fetchServiceBySlug(slug),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  if (isLoading) {
    return (
      <div className="w-full bg-white">
        {/* Loading Hero Section */}
        <section className="relative h-[100vh] w-full animate-pulse">
          <div className="absolute inset-0 bg-gray-300" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="h-12 w-64 bg-gray-400 rounded sm:h-16 sm:w-96" />
          </div>
        </section>

        {/* Loading Details Section */}
        <section className="py-12 px-6 md:px-16 max-w-4xl mx-auto text-center animate-pulse">
          <div className="h-8 w-48 bg-gray-300 rounded mx-auto mb-4" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-300 rounded" />
            <div className="h-4 w-3/4 bg-gray-300 rounded mx-auto" />
            <div className="h-4 w-1/2 bg-gray-300 rounded mx-auto" />
          </div>
        </section>

        <Reachout />
      </div>
    );
  }

  if (error || !service) {
    notFound();
  }

  return (
    <div className="w-full bg-white">
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