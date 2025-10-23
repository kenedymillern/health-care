'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '@/lib/react-query';
import { AppProvider } from '@/context/app-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg, #363636)',
                color: 'var(--toast-color, #fff)',
              },
              success: {
                style: {
                  background: 'var(--toast-success-bg, #10b981)',
                },
              },
              error: {
                style: {
                  background: 'var(--toast-error-bg, #ef4444)',
                },
              },
            }}
          />
          <ReactQueryDevtools initialIsOpen={false} />
        </AppProvider>
      </QueryClientProvider>
  );
}