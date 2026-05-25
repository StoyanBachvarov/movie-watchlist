"use client";

import { useActionState } from "react";
import { logoutUser } from "@/app/actions/auth";

export default function UserProfile({ user }: { user: { email: string, name: string | null } }) {
  const [, formAction, isPending] = useActionState(logoutUser, null);

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white border border-gray-100 rounded-2xl shadow-sm">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Your Profile</h1>
      <p className="text-gray-500 mb-8 border-b pb-6">Manage your account preferences</p>
      
      <div className="space-y-4 mb-8">
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-widest">NAME</h3>
          <p className="text-lg font-medium text-gray-900 mt-1">{user.name || "N/A"}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-widest">EMAIL ADDRESS</h3>
          <p className="text-lg font-medium text-gray-900 mt-1">{user.email}</p>
        </div>
      </div>

      <form action={formAction}>
        <button 
          type="submit" 
          disabled={isPending}
          className="bg-red-50 text-red-600 hover:bg-red-100 px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50"
        >
          {isPending ? "Logging out..." : "Log Out of All Devices"}
        </button>
      </form>
    </div>
  );
}
