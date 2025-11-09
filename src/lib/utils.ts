import { FAQ as FAQTypes } from '@/types'; 

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue || null;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }
};

type FAQResponse = {
  total: number;
  data: FAQTypes[];
};

export const fetchFaqs = async ({
  skip,
  limit,
  search,
}: {
  skip: number;
  limit: number;
  search: string;
}): Promise<FAQResponse> => {
  const params = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString(),
  });
  if (search) params.append('search', search);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/faq?${params.toString()}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error('Failed to fetch FAQs');
  return res.json();
};