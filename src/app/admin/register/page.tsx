"use client"

import RegisterAdminForm from "@/components/RegisterAdminForm";

export default function RegisterPage() {
  return (
    <div className="p-6 -mt-20 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register New Admin</h1>
      <p className="mb-6">Use the form below to create a new admin account.</p>
      <RegisterAdminForm />
    </div>
  );
}