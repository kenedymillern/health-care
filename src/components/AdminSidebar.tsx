"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface SidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: SidebarProps) {
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
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </aside>
    );
  }

  if (!loggedIn) return null;

  return (
    <aside className="w-64 h-full p-4 bg-white border-r flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Admin</h1>
          <p className="text-sm text-gray-500">EUTRIV dashboard</p>
        </div>
        {/* Close button (mobile only) */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-2 flex-1">
        {[
          { href: "/admin", label: "Dashboard" },
          { href: "/admin/services", label: "Services" },
          { href: "/admin/faq", label: "FAQs" },
          { href: "/admin/reviews", label: "Reviews" },
          { href: "/admin/careers", label: "Careers" },
          { href: "/admin/contacts", label: "Contacts" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <form action="/api/admin/logout" method="post" className="mt-4">
        <button
          type="submit"
          onClick={onClose}
          className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer"
        >
          Logout
        </button>
      </form>
    </aside>
  );
}
