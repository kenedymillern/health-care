"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FAQ } from "@/types";
import debounce from "lodash.debounce";
import { fetchFaqs } from "@/lib/utils";

type FAQResponse = {
  total: number;
  data: FAQ[];
};

const LIMIT = 5;

export default function FAQPage() {
  const qc = useQueryClient();
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
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Create Mutation
  const create = useMutation({
    mutationFn: async (body: Pick<FAQ, "question" | "answer">) => {
      const res = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to create FAQ");
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["faqs"] });
      toast.success("FAQ added!");
      setSkip(1); // jump to first page
    },
    onError: (err: any) => toast.error(err.message || "Create failed"),
  });

  // Delete Mutation
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/faq", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      if (!res.ok) throw new Error("Failed to delete FAQ");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["faqs"] });
      toast.success("FAQ deleted!");
    },
    onError: () => toast.error("Delete failed"),
  });

  const goPrev = () => setSkip(Math.max(0, skip - limit));
  const goNext = () => setSkip(skip + limit);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">FAQ Manager</h1>
        <p className="text-gray-500 mt-2">Add, search, and delete FAQs instantly</p>
      </header>

      {/* Search */}
      <input
        type="text"
        placeholder="Search questions..."
        value={search}
        onChange={handleSearchChange}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
      />

      {/* Create Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const question = fd.get("question")?.toString().trim();
          const answer = fd.get("answer")?.toString().trim();

          if (!question || !answer) return toast.error("Fill all fields");

          create.mutate({ question, answer });
          e.currentTarget.reset();
        }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-md space-y-4"
      >
        <input
          name="question"
          required
          placeholder="Enter your question"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <textarea
          name="answer"
          required
          rows={4}
          placeholder="Write the answer..."
          className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          disabled={create.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {create.isPending ? "Adding..." : "➕ Add FAQ"}
        </button>
      </form>

      {/* Loading / Error / Empty */}
      {(isLoading || isFetching) && !data ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading FAQs...</p>
        </div>
      ) : error ? (
        <p className="text-center text-red-400">Error loading FAQs</p>
      ) : faqs.length === 0 ? (
        <p className="text-center text-gray-500 py-12 text-lg">
          {search ? "No FAQs match your search." : "No FAQs yet. Create one!"}
        </p>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq._id ? faq._id.toString() : undefined}
              className="group bg-white dark:bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
                <button
                  onClick={() => faq._id && remove.mutate(faq._id.toString())}
                  disabled={remove.isPending || !faq._id}
                  className="text-red-500 hover:text-red-700 font-medium opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  {remove.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
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
  );
}