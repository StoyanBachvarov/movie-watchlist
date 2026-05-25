"use client";

import { useActionState } from "react";
import { loginUser } from "@/app/actions/auth";
import Link from "next/link";

const initialState = {
  error: "",
};

export default function UserLogin() {
  const [state, formAction, isPending] = useActionState(loginUser, initialState);

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white border border-gray-100 rounded-2xl shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Login to MovieSync</h1>
      
      {state?.error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
          <input 
            name="email" 
            type="email" 
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            required 
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
          <input 
            name="password" 
            type="password" 
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            required 
            placeholder="••••••••"
          />
        </div>
        <button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-blue-600 text-white p-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>
      
      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/register" className="text-blue-600 hover:underline font-medium">
          Register here
        </Link>
      </p>
    </div>
  );
}
