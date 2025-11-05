'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function RegisterAdminForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Registration failed');
        return;
      }

      toast.success('New admin created successfully');
      setEmail('');
      setPassword('');
    } catch {
      toast.error('Network error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold">Create New Admin</h3>
      <label className="block">
        <span>Email</span>
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mt-1 bg-transparent"
        />
      </label>
      <label className="block">
        <span>Password</span>
        <input
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mt-1 bg-transparent"
        />
      </label>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Register
      </button>
    </form>
  );
}
