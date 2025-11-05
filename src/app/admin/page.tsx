import React from 'react';
import { cookies } from "next/headers";
import { verifyAdminToken, COOKIE_NAME } from "@/lib/adminAuth";
import { redirect } from "next/navigation";

async function fetchCount(path: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api${path}`, { cache: 'no-store' });
  if (!res.ok) return 0;

  const data = await res.json();

  // Determine count based on path
  if (path === '/services') {
    return data.totalCount || 0;
  }
 
  if (path === '/reviews') {
    return Array.isArray(data) ? data.length : 0;
  }

  if (path === '/career' || path === '/contact') {
    return Array.isArray(data.data) ? data.data.length : 0;
  }

  return 0;
}


export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const payload = token ? await verifyAdminToken(token) : null;

  if (!payload) redirect("/admin/login");

  const [servicesCount, reviewsCount, careersCount, contactsCount] = await Promise.all([
    fetchCount('/services'),
    fetchCount('/reviews'),
    fetchCount('/career'),
    fetchCount('/contact'),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 border rounded bg-white dark:bg-gray-800">
          <p className="text-sm text-gray-500">Services</p>
          <p className="text-2xl font-semibold">{servicesCount}</p>
        </div>
        <div className="p-4 border rounded bg-white dark:bg-gray-800">
          <p className="text-sm text-gray-500">Reviews</p>
          <p className="text-2xl font-semibold">{reviewsCount}</p>
        </div>
        <div className="p-4 border rounded bg-white dark:bg-gray-800">
          <p className="text-sm text-gray-500">Career Applications</p>
          <p className="text-2xl font-semibold">{careersCount}</p>
        </div>
        <div className="p-4 border rounded bg-white dark:bg-gray-800">
          <p className="text-sm text-gray-500">Contact Messages</p>
          <p className="text-2xl font-semibold">{contactsCount}</p>
        </div>
      </div>
      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Quick actions</h2>
        <div className="flex gap-3">
          <a href="/admin/services" className="px-3 py-2 bg-green-600 text-white rounded">Create service</a>
          <a href="/admin/faq" className="px-3 py-2 bg-indigo-600 text-white rounded">Manage FAQs</a>
          <a href="/admin/register" className="px-3 py-2 bg-indigo-900 text-white rounded">Register an Admin</a>
        </div>
      </section>
    </div>
  );
}
