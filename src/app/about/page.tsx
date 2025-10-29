'use client';

import { Suspense } from 'react';
import About from '@/components/ui/About';

export default function AboutPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <About />
    </Suspense>
  );
}
