"use client";

import React, { useEffect, useState, useCallback } from "react";
import debounce from "lodash.debounce";

type Contact = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: "new" | "replied" | "archived";
  createdAt: string;
};

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // --- Debounced Search ---
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
      setSkip(0);
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  // --- Fetch Contacts ---
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        skip: skip.toString(),
        limit: limit.toString(),
      });
      if (statusFilter) params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/contact?${params}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch contacts");
      setContacts(data.data);
      setTotal(data.total);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [skip, statusFilter, searchQuery]);

  // --- Update Contact Status ---
  const handleStatusUpdate = async (
    id: string,
    status: "replied" | "archived"
  ) => {
    try {
      setUpdatingId(id);
      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (res.ok) {
        setContacts((prev) =>
          prev.map((c) =>
            c._id === id ? { ...c, status: data.status || status } : c
          )
        );
      } else {
        console.error(data.error || "Failed to update");
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Contact Messages</h1>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name, email, or message..."
          value={search}
          onChange={handleSearchChange}
          className="border rounded px-3 py-1 text-sm w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setSkip(0);
          }}
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="">All</option>
          <option value="new">New</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
        <button
          onClick={() => {
            setSkip(0);
            fetchContacts();
          }}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
        >
          Apply
        </button>
      </div>

      {/* Loading */}
      {loading && <div className="text-gray-500 text-sm">Loading...</div>}

      {/* List */}
      <div className="space-y-3">
        {!loading && contacts.length === 0 && (
          <div className="text-sm text-gray-500">No messages found.</div>
        )}

        {contacts.map((c) => (
          <div
            key={c._id}
            className="p-4 bg-white dark:bg-gray-800 rounded border flex flex-col gap-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-gray-500">
                  {c.email} • {c.phone || "-"}
                </div>
                <p className="mt-2 text-sm">{c.message}</p>
              </div>

              <div className="flex flex-col items-end gap-2 text-right">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    c.status === "new"
                      ? "bg-yellow-100 text-yellow-700"
                      : c.status === "replied"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {c.status}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            {c.status !== "archived" && (
              <div className="flex gap-2 justify-end mt-2">
                {c.status === "new" && (
                  <button
                    onClick={() => handleStatusUpdate(c._id, "replied")}
                    disabled={updatingId === c._id}
                    className={`text-xs px-2 py-1 rounded text-white flex items-center gap-1 ${
                      updatingId === c._id
                        ? "bg-green-400 cursor-wait"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {updatingId === c._id && (
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    Mark as Replied
                  </button>
                )}
                <button
                  onClick={() => handleStatusUpdate(c._id, "archived")}
                  disabled={updatingId === c._id}
                  className={`text-xs px-2 py-1 rounded text-white flex items-center gap-1 ${
                    updatingId === c._id
                      ? "bg-gray-400 cursor-wait"
                      : "bg-gray-600 hover:bg-gray-700"
                  }`}
                >
                  {updatingId === c._id && (
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  Archive
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <button
            disabled={skip === 0}
            onClick={() => setSkip(Math.max(0, skip - limit))}
            className={`px-3 py-1 rounded border ${
              skip === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 border-blue-300 hover:bg-blue-50"
            }`}
          >
            Previous
          </button>
          <span className="text-gray-500">
            Page {Math.floor(skip / limit) + 1} of {totalPages}
          </span>
          <button
            disabled={skip + limit >= total}
            onClick={() => setSkip(skip + limit)}
            className={`px-3 py-1 rounded border ${
              skip + limit >= total
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
