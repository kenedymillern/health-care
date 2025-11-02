"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminSidebar() {
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const res = await fetch("/api/admin/me", {
                    credentials: "include",
                    cache: "no-store",
                });
                const data = await res.json();
                setLoggedIn(data?.loggedIn);
            } catch (err) {
                setLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };
        checkAdmin();
    }, []);

    if (loading) {
        return (
            <aside className="w-64 p-4 bg-white dark:bg-gray-800 border-r animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 mb-4 rounded" />
                <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                    ))}
                </div>
            </aside>
        );
    }

    if (!loggedIn) return null;

    return (
        <aside className="w-64 p-4 bg-white dark:bg-gray-800 border-r">
            <div className="mb-6">
                <h1 className="text-xl font-bold">Admin</h1>
                <p className="text-sm text-gray-500">EUTRIV dashboard</p>
            </div>
            <nav className="flex flex-col gap-2">
                <Link href="/admin" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    Dashboard
                </Link>
                <Link href="/admin/services" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    Services
                </Link>
                <Link href="/admin/faq" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    FAQs
                </Link>
                <Link href="/admin/reviews" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    Reviews
                </Link>
                <Link href="/admin/careers" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    Careers
                </Link>
                <Link href="/admin/contacts" className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    Contacts
                </Link>
                <form action="/api/admin/logout" method="post" className="mt-4">
                    <button
                        type="submit"
                        className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Logout
                    </button>
                </form>
            </nav>
        </aside>
    );
}
