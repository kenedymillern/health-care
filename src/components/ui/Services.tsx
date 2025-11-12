'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Reachout from './Reachout';
import { useQuery } from '@tanstack/react-query';
import { Service } from '@/types';
import debounce from 'lodash.debounce';

const ITEMS_PER_PAGE = 5;

async function fetchServices({
  page,
  search,
}: {
  page: number;
  search: string;
}): Promise<{ services: Service[]; totalCount: number }> {
  const response = await fetch(
    `/api/services?page=${page}&limit=${ITEMS_PER_PAGE}&search=${encodeURIComponent(search)}`
  );
  if (!response.ok) throw new Error('Failed to fetch services');
  return response.json();
}

export default function Services() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input for optimization
  const debouncedUpdate = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
        setPage(1); // reset to first page when search changes
      }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedUpdate(value);
  };

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['services', page, debouncedSearch],
    queryFn: () => fetchServices({ page, search: debouncedSearch }),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });

  const services = data?.services ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative h-[100vh] w-full">
        <Image
          src="/images/service2.jpg"
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

        {/* Search Input */}
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-12 px-6 md:px-16 max-w-7xl mx-auto -mt-10">
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
        ) : services.length === 0 ? (
          <p className="text-center text-gray-500">No services found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={`px-4 py-2 rounded-md border ${
                    page === 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-white hover:bg-blue-50 border-blue-200 text-blue-600'
                  }`}
                >
                  Prev
                </button>

                <span className="text-gray-700">
                  Page {page} of {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={`px-4 py-2 rounded-md border ${
                    page === totalPages
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-white hover:bg-blue-50 border-blue-200 text-blue-600'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
      <Reachout />
    </div>
  );
}
