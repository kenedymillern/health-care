'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Hero from '@/components/ui/Hero';
import ReviewCarousel from '@/components/ui/ReviewCarousel';
import WebBanner from '@/components/ui/WebBanner';
import Form from '@/components/ui/Form';
import FAQ from '@/components/ui/FAQ';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Service } from '@/types';


const fetchServices = async (): Promise<Service[]> => {
  const response = await fetch('/api/services');
  if (!response.ok) {
    throw new Error('Failed to fetch services');
  }
  const data = await response.json();
  return data.services;
};

export default function Home() {
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: fetchServices,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return (
    <>
      <Hero services={services} />
      <WebBanner
        title="Why Choose Us?"
        subtitle="Experience care that feels like family."
        image="/images/why-choose-us.jpg"
      />
      <Form title="Set An Appointment" />
      <FAQ />
      <ReviewCarousel />
    </>
  );
}