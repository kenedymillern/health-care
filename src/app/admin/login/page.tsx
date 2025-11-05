'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json();
        toast.error(body?.error || 'Login failed');
        return;
      }
      toast.success('Logged in');
      window.location.replace("/admin");
      // router.refresh();
      // router.push('/admin');
    } catch (err) {
      toast.error('Network error');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 -mt-20">
      <form onSubmit={submit} className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full p-2 border rounded bg-transparent" />
        </label>
        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full p-2 border rounded bg-transparent" />
        </label>
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">Login</button>
      </form>
    </div>
  );
}
