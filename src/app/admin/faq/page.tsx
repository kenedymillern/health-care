"use client";

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FAQ } from "@/types";

interface FAQResponse {
  faqs: FAQ[];
}

const LIMIT = 5;

export default function FAQPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Fetch FAQs — v5 syntax
  const { data, isLoading, isError } = useQuery<FAQResponse>({
    queryKey: ["faqs", search, page],
    queryFn: async () => {
      const res = await fetch(
        `/api/faq?search=${encodeURIComponent(search)}&page=${page}&limit=${LIMIT}`
      );
      if (!res.ok) throw new Error("Failed to fetch FAQs");
      return res.json();
    },
    placeholderData: (prev) => prev, // keeps previous data while loading
    staleTime: 1000 * 30, // 30 seconds
  });

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
      setPage(1); // jump to first page
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

  const faqs = Array.isArray(data) ? data : [];
  const total = faqs.length;
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">FAQ Manager</h1>
        <p className="text-gray-500 mt-2">Add, search, and delete FAQs instantly</p>
      </header>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search questions..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
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
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading FAQs...</p>
        </div>
      ) : isError ? (
        <p className="text-center text-red-500">Failed to load FAQs</p>
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
        <div className="flex justify-center items-center gap-3 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-5 py-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ← Prev
          </button>

          <span className="text-sm font-medium text-gray-600">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-5 py-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}