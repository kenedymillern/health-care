'use client';
import React, { useState } from 'react';
import { useAdminFetch, useAdminMutations } from '@/lib/useAdminApi';
import toast from 'react-hot-toast';

type Service = {
  _id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  image?: string;
};

export default function ServicesAdmin() {
  const { data: services = [], isLoading } = useAdminFetch<Service[]>('services', '/api/services');
  const { create, update, remove } = useAdminMutations();

  const [editing, setEditing] = useState<Service | null>(null);

  async function handleCreateOrUpdate(form: React.FormEvent<HTMLFormElement>) {
    form.preventDefault();
    const fd = new FormData(form.currentTarget as HTMLFormElement);
    const payload: any = Object.fromEntries(fd as any);
    try {
      if (editing?._id) {
        payload._id = editing._id;
        await update.mutateAsync(payload);
        toast.success('Updated');
      } else {
        await create.mutateAsync(payload);
        toast.success('Created');
      }
      (form.currentTarget as HTMLFormElement).reset();
      setEditing(null);
    } catch (err: any) {
      toast.error(err?.message || 'Failed');
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Services</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded border">
          <h2 className="font-semibold mb-2">{editing ? 'Edit Service' : 'Create Service'}</h2>
          <form onSubmit={handleCreateOrUpdate} className="flex flex-col gap-2">
            <input name="title" defaultValue={editing?.title} required placeholder="Title" className="p-2 border rounded bg-transparent" />
            <input name="slug" defaultValue={editing?.slug} required placeholder="slug" className="p-2 border rounded bg-transparent" />
            <input name="image" defaultValue={editing?.image} placeholder="Image URL" className="p-2 border rounded bg-transparent" />
            <input name="shortDescription" defaultValue={editing?.shortDescription} placeholder="Short description" className="p-2 border rounded bg-transparent" />
            <textarea name="fullDescription" defaultValue={editing?.fullDescription} placeholder="Full description" className="p-2 border rounded bg-transparent" />
            <div className="flex gap-2">
              <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">{editing ? 'Update' : 'Create'}</button>
              {editing && <button type="button" onClick={() => setEditing(null)} className="px-3 py-2 border rounded">Cancel</button>}
            </div>
          </form>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded border overflow-auto">
          <h2 className="font-semibold mb-2">Existing Services</h2>
          {isLoading ? <p>Loading...</p> : (
            <ul className="space-y-2">
              {services.map(s => (
                <li key={(s as any)._id} className="p-2 border rounded flex justify-between items-start">
                  <div>
                    <div className="font-medium">{s.title}</div>
                    <div className="text-sm text-gray-500">{s.shortDescription}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(s)} className="px-2 py-1 border rounded">Edit</button>
                    <button onClick={async () => {
                      if (!confirm('Delete service?')) return;
                      try {
                        await remove.mutateAsync((s as any)._id);
                        toast.success('Deleted');
                      } catch (err: any) {
                        toast.error('Delete failed');
                      }
                    }} className="px-2 py-1 border rounded text-red-600">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
