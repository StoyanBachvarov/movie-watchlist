"use client";

import { useActionState } from "react";
import { updateUserMovie } from "@/app/actions/userMovies";

export default function EditUserMovieForm({ userMovie }: { userMovie: any }) {
  const [state, formAction, isPending] = useActionState(updateUserMovie, null);

  return (
    <form action={formAction} className="bg-white p-6 border rounded-xl shadow-sm space-y-6">
      <input type="hidden" name="id" value={userMovie.id} />
      
      {state?.error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select 
          name="status" 
          id="status" 
          defaultValue={userMovie.status}
          className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-2 text-sm"
        >
          <option value="to_watch">To Watch</option>
          <option value="watching">Watching</option>
          <option value="watched">Watched</option>
        </select>
      </div>

      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating (1-10)</label>
        <input 
          type="number" 
          name="rating" 
          id="rating" 
          min="1" 
          max="10" 
          defaultValue={userMovie.rating || ""}
          className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-2 text-sm"
          placeholder="e.g. 8"
        />
      </div>

      <div>
        <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">Review / Notes</label>
        <textarea 
          name="review" 
          id="review" 
          rows={4}
          defaultValue={userMovie.review || ""}
          className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50 p-2 text-sm"
          placeholder="Write your thoughts..."
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save Details"}
      </button>
    </form>
  );
}