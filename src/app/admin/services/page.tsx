'use client';
import React, { useMemo, useState } from 'react';
import { useAdminFetch, useAdminMutations } from '@/lib/useAdminApi';
import toast from 'react-hot-toast';

type Service = {
  _id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  image?: string;
  createdAt?: string;
};

type ServicesResponse = {
  services: Service[];
  totalCount: number;
};

const ITEMS_PER_PAGE = 5;

export default function ServicesAdmin() {
  const [editing, setEditing] = useState<Service | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  // ✅ Fetch services from backend (already paginated + searchable)
  const { data, isLoading } = useAdminFetch<ServicesResponse>(
    ['services', page, search],
    `/api/services?page=${page}&limit=${ITEMS_PER_PAGE}&search=${encodeURIComponent(search)}`
  );

  const services = data?.services ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  const { create, update, remove } = useAdminMutations();

  // ✅ Sort locally (optional, just for latest first)
  const sortedServices = useMemo(() => {
    return [...services].sort(
      (a, b) =>
        new Date(b.createdAt || '').getTime() -
        new Date(a.createdAt || '').getTime()
    );
  }, [services]);

  async function handleCreateOrUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: any = Object.fromEntries(fd.entries());

    try {
      if (editing?._id) {
        payload._id = editing._id;
        await update.mutateAsync(payload);
        toast.success('Service updated');
      } else {
        await create.mutateAsync(payload);
        toast.success('Service created');
      }
      e.currentTarget.reset();
      setEditing(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed');
    }
  }

  async function handleDelete(id: string) {
    try {
      await remove.mutateAsync(id);
      toast.success('Service deleted');
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error('Delete failed');
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Services</h1>

      {/* Search input */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="p-2 border rounded w-full max-w-xs bg-transparent"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Form section */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded border">
          <h2 className="font-semibold mb-2">
            {editing ? 'Edit Service' : 'Create Service'}
          </h2>
          <form onSubmit={handleCreateOrUpdate} className="flex flex-col gap-2">
            <input
              name="title"
              defaultValue={editing?.title}
              required
              placeholder="Title"
              className="p-2 border rounded bg-transparent"
            />
            <input
              name="slug"
              defaultValue={editing?.slug}
              required
              placeholder="Slug"
              className="p-2 border rounded bg-transparent"
            />
            <input
              name="image"
              defaultValue={editing?.image}
              placeholder="Image URL"
              className="p-2 border rounded bg-transparent"
            />
            <input
              name="shortDescription"
              defaultValue={editing?.shortDescription}
              placeholder="Short description"
              className="p-2 border rounded bg-transparent"
            />
            <textarea
              name="fullDescription"
              defaultValue={editing?.fullDescription}
              placeholder="Full description"
              className="p-2 border rounded bg-transparent"
            />
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="px-3 py-2 bg-blue-600 text-white rounded"
              >
                {editing ? 'Update' : 'Create'}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-3 py-2 border rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Existing services section */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded border overflow-auto">
          <h2 className="font-semibold mb-2">Existing Services</h2>

          {isLoading ? (
            <p>Loading...</p>
          ) : sortedServices.length === 0 ? (
            <p>No services found.</p>
          ) : (
            <ul className="space-y-2">
              {sortedServices.map((s) => (
                <li
                  key={s._id}
                  className="p-2 border rounded flex justify-between items-start"
                >
                  <div>
                    <div className="font-medium">{s.title}</div>
                    <div className="text-sm text-gray-500">
                      {s.shortDescription}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(s)}
                      className="px-2 py-1 border rounded cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(s)}
                      className="px-2 py-1 border rounded text-red-600 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
              >
                Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-3">Confirm Delete</h3>
            <p className="text-sm mb-4">
              Are you sure you want to delete “{deleteTarget.title}”?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-3 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget._id!)}
                className="px-3 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
