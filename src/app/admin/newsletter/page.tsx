"use client";

import { useEffect, useState, useCallback } from "react";
import debounce from "lodash.debounce";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

type Newsletter = {
    _id: string;
    email: string;
    createdAt: string;
};

export default function NewsletterAdmin() {
    const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const [filterMonth, setFilterMonth] = useState("");

    const totalPages = Math.ceil(total / limit);

    // ---- Fetch newsletters ----
    const fetchNewsletters = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const skip = (page - 1) * limit;
            const params = new URLSearchParams({
                skip: skip.toString(),
                limit: limit.toString(),
            });

            if (search.trim()) params.append("search", search.trim());
            if (filterMonth) params.append("filterDateByMonth", filterMonth);

            const res = await fetch(`/api/newsletter?${params.toString()}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to load data");

            setNewsletters(data.data);
            setTotal(data.total);
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }, [page, limit, search, filterMonth]);

    // ---- Debounced search ----
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            setSearch(value);
            setPage(1);
        }, 500),
        []
    );

    // ---- Trigger fetch ----
    useEffect(() => {
        fetchNewsletters();
    }, [fetchNewsletters]);

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-10">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-10"
            >
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Newsletter Subscriptions
                </h1>

                {/* Search & Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
                    <input
                        type="text"
                        placeholder="Search by email..."
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-2/3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        onChange={(e) => debouncedSearch(e.target.value)}
                    />

                    <input
                        type="month"
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={filterMonth}
                        onChange={(e) => {
                            setFilterMonth(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                {/* Table / List */}
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full bg-white">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="text-left py-3 px-4 font-semibold">#</th>
                                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                                    <th className="text-left py-3 px-4 font-semibold">Date Subscribed</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={3} className="text-center py-6 text-gray-500">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={3} className="text-center py-6 text-red-500">
                                                {error}
                                            </td>
                                        </tr>
                                    ) : newsletters.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="text-center py-6 text-gray-500">
                                                No subscriptions found.
                                            </td>
                                        </tr>
                                    ) : (
                                        newsletters.map((item, index) => (
                                            <motion.tr
                                                key={item._id}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4">{(page - 1) * limit + index + 1}</td>
                                                <td className="py-3 px-4 break-all">{item.email}</td>
                                                <td className="py-3 px-4">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card Layout */}
                    <div className="block sm:hidden divide-y divide-gray-200">
                        {loading ? (
                            <p className="text-center py-6 text-gray-500">Loading...</p>
                        ) : error ? (
                            <p className="text-center py-6 text-red-500">{error}</p>
                        ) : newsletters.length === 0 ? (
                            <p className="text-center py-6 text-gray-500">No subscriptions found.</p>
                        ) : (
                            newsletters.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="p-4"
                                >
                                    <p className="text-sm text-gray-500 mb-1">
                                        #{(page - 1) * limit + index + 1}
                                    </p>
                                    <p className="text-base font-medium text-gray-800 break-all">
                                        {item.email}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </p>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6">
                        <button
                            disabled={page === 1 || loading}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className={`px-4 py-2 rounded-lg border ${page === 1
                                    ? "text-gray-400 border-gray-200"
                                    : "text-blue-600 border-blue-500 hover:bg-blue-50"
                                }`}
                        >
                            Prev
                        </button>

                        <p className="text-gray-600">
                            Page {page} of {totalPages}
                        </p>

                        <button
                            disabled={page === totalPages || loading}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className={`px-4 py-2 rounded-lg border ${page === totalPages
                                    ? "text-gray-400 border-gray-200"
                                    : "text-blue-600 border-blue-500 hover:bg-blue-50"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
