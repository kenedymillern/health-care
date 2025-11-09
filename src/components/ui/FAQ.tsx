'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { FAQ as FAQTypes } from '@/types';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import { fetchFaqs } from '@/lib/utils';

type FAQResponse = {
  total: number;
  data: FAQTypes[];
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [limit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [skip, setSkip] = useState(0);

  const debouncedSearch = useMemo(() =>
    debounce((value: string) => {
      setSearchQuery(value);
      setSkip(0);
    }, 500),
    []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  }

  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useQuery<FAQResponse>({
    queryKey: ['faqs', skip, limit, searchQuery],
    queryFn: () => fetchFaqs({ skip, limit, search: searchQuery }),
    placeholderData: (previousData) => previousData,
    staleTime: 0,
  });

  const faqs = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    setOpenIndex(null);
  }, [faqs]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.2 },
    }),
  };

  const answerVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: (i: number) => ({ height: 'auto', opacity: 1, transition: { duration: 0.5, delay: i * 0.2 } }),
  };

  /* ---------- Pagination helpers ---------- */
  const goPrev = () => setSkip(Math.max(0, skip - limit));
  const goNext = () => setSkip(skip + limit);

  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-r from-[#1E3A8A] to-[#065F46]">
      <div className="absolute inset-0 bg-[url('/images/wave-pattern.svg')] bg-repeat bg-center opacity-[0.15] pointer-events-none"></div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-white drop-shadow-xl" role="heading" aria-level={2}>
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-sm sm:text-base md:text-lg font-inter text-white max-w-3xl mx-auto">
          Find answers to common questions about our compassionate healthcare services.
        </p>
      </motion.div>
      <div className="flex mt-8 justify-center">
        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={handleSearchChange}
          className="w-full max-w-md border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white"
        />
      </div>

      {/* ---------- FAQ list ---------- */}
      <div className="mt-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Loading skeleton */}
        {(isLoading || isFetching) && !data ? (
          <div className="flex flex-col space-y-4 animate-pulse">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg h-20 shadow-md" />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-400">Error loading FAQs</p>
        ) : faqs.length === 0 ? (
          <p className="text-center text-gray-300">No FAQs found.</p>
        ) : (
          faqs.map((faq, index) => (
            <motion.div
              key={faq._id?.toString() ?? index} // prefer Mongo _id
              custom={index}
              variants={faqVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass-effect rounded-xl mb-4 bg-lilac-100/50 hover:bg-lilac-100/70 transition-all duration-300"
              whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)' }}
            >
              <button
                className="w-full flex justify-between items-center p-4 sm:p-6 text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-lg sm:text-xl font-playfair font-semibold text-white drop-shadow-md">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {openIndex === index ? (
                    <FaMinus className="text-black" size={20} />
                  ) : (
                    <FaPlus className="text-black" size={20} />
                  )}
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    variants={answerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="px-4 sm:px-6 pb-4 sm:pb-6 text-black font-inter text-base sm:text-lg leading-relaxed overflow-hidden"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}

        {/* ---------- Pagination (only when >1 page) ---------- */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              disabled={skip === 0}
              onClick={goPrev}
              className={`px-4 py-2 rounded border cursor-pointer ${skip === 0
                ? 'text-gray-400 cursor-not-allowed border-gray-400'
                : 'text-blue-600 border-blue-300 hover:bg-blue-50'
                }`}
            >
              Prev
            </button>

            <span className="text-gray-300">
              Page {Math.floor(skip / limit) + 1} of {totalPages}
            </span>

            <button
              disabled={skip + limit >= total}
              onClick={goNext}
              className={`px-4 py-2 rounded border cursor-pointer ${skip + limit >= total
                ? 'text-gray-400 cursor-not-allowed border-gray-400'
                : 'text-blue-600 border-blue-300 hover:bg-blue-50'
                }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}