"use client";

import { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import toast from "react-hot-toast";

interface Career {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  position: string;
  resume?: string;
  message: string;
  status: "new" | "reviewed" | "archived";
  createdAt: string;
  updatedAt: string;
}

export default function CareersAdmin() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | "new" | "reviewed" | "archived">("");
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useCallback(debounce((value: string) => {
    setSearchQuery(value);
    setSkip(0);
  }, 500), [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  }

  const fetchCareers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        skip: skip.toString(),
        limit: limit.toString(),
      });
      if (status) params.append("status", status);
      if (search) params.append("search", searchQuery);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/career?${params.toString()}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Failed to fetch careers");

      const data = await res.json();
      setCareers(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load careers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, [skip, status, searchQuery]);

  const handleStatusUpdate = async (id: string, newStatus: "reviewed" | "archived") => {
    try {
      const res = await fetch("/api/career", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");
      toast.success(`Marked as ${newStatus}`);
      fetchCareers();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error updating status");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Career Applications</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <input
          type="text"
          placeholder="Search name, email, or position..."
          value={search}
          onChange={handleSearchChange}
          className="border rounded px-3 py-2 w-64"
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as any);
            setSkip(0);
          }}
          className="border rounded px-3 py-2"
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="reviewed">Reviewed</option>
          <option value="archived">Archived</option>
        </select>
        <button
          onClick={() => {
            setSkip(0);
            fetchCareers();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply
        </button>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="text-gray-500 text-sm">Loading...</div>
      ) : careers.length === 0 ? (
        <div className="text-gray-500 text-sm">No applications found.</div>
      ) : (
        <div className="space-y-4">
          {careers.map((c) => (
            <div
              key={c._id}
              className="p-4 border rounded-lg bg-white shadow-sm flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-lg">
                    {c.fullName} — {c.position}
                  </div>
                  <div className="text-sm text-gray-500">
                    {c.email} • {c.phoneNumber}
                  </div>
                  <p className="mt-2 text-gray-700">{c.message}</p>
                </div>
                <div className="text-right">
                  {c.resume && (
                    <a
                      href={c.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-600 underline"
                    >
                      View Resume
                    </a>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                  <span
                    className={`inline-block mt-1 px-2 py-1 rounded text-xs ${c.status === "new"
                      ? "bg-yellow-100 text-yellow-700"
                      : c.status === "reviewed"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {c.status}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                {c.status !== "reviewed" && (
                  <button
                    onClick={() => handleStatusUpdate(c._id, "reviewed")}
                    className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 cursor-pointer"
                  >
                    Mark Reviewed
                  </button>
                )}
                {c.status !== "archived" && (
                  <button
                    onClick={() => handleStatusUpdate(c._id, "archived")}
                    className="text-xs bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 cursor-pointer"
                  >
                    Archive
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            disabled={skip === 0}
            onClick={() => setSkip(Math.max(0, skip - limit))}
            className={`px-3 py-1 rounded border ${skip === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 border-blue-300 hover:bg-blue-50"
              }`}
          >
            Prev
          </button>
          <span className="text-gray-500">
            Page {Math.floor(skip / limit) + 1} of {totalPages}
          </span>
          <button
            disabled={skip + limit >= total}
            onClick={() => setSkip(skip + limit)}
            className={`px-3 py-1 rounded border ${skip + limit >= total
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 border-blue-300 hover:bg-blue-50"
              }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
