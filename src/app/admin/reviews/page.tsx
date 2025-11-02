"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Review } from "@/types";

interface ApiResponse {
  data: Review[];
}

export default function ReviewsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");

  // useQuery — Fixed for v5
  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["reviews", page, filter],
    queryFn: async () => {
      const res = await fetch(`/api/reviews?page=${page}&filter=${filter}`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
  });

  // useMutation — Fixed for v5
  const create = useMutation({
    mutationFn: async (body: Omit<Review, "_id">) => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Create failed");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review added!");
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review deleted!");
    },
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Reviews</h1>

      <input
        placeholder="Filter by name"
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value);
          setPage(1); // Reset to page 1 on filter
        }}
        className="w-full p-3 border rounded mb-6"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          create.mutate({
            name: fd.get("name") as string,
            rating: Number(fd.get("rating")),
            comment: fd.get("comment") as string,
          });
          e.currentTarget.reset();
        }}
        className="bg-gray-50 p-4 rounded-lg space-y-3 mb-8"
      >
        <input name="name" placeholder="Your Name" required className="w-full p-3 border rounded" />
        <input
          name="rating"
          type="number"
          min="1"
          max="5"
          placeholder="Rating (1-5)"
          required
          className="w-full p-3 border rounded"
        />
        <textarea
          name="comment"
          placeholder="Your review..."
          required
          rows={3}
          className="w-full p-3 border rounded"
        />
        <button
          type="submit"
          disabled={create.isPending}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {create.isPending ? "Adding..." : "Add Review"}
        </button>
      </form>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading reviews...</p>
      ) : (
        <div className="space-y-4">
          {Array.isArray(data) && data.length > 0 && data.map((r) => (
            <div
              key={r._id ? r._id.toString() : undefined}
              className="p-4 border rounded-lg flex justify-between items-start bg-white shadow-sm"
            >
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-lg">{r.name}</strong>
                  <span className="text-yellow-500">{'⭐'.repeat(r.rating)}</span>
                </div>
                <p className="text-gray-700 mt-1">{r.comment}</p>
              </div>
              <button
                onClick={() => r._id && remove.mutate(r._id.toString())}
                disabled={remove.isPending}
                className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
              >
                {remove.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {Array.isArray(data) && data.length > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: data.length }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded font-medium transition ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}