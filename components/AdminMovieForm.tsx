"use client";

import { useActionState } from "react";
import { createMovie, updateMovie } from "@/app/actions/adminMovies";
import Link from "next/link";

export default function AdminMovieForm({ movie }: { movie?: any }) {
  const isEditing = !!movie;
  const action = isEditing ? updateMovie : createMovie;
  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="bg-white p-6 rounded shadow-sm border space-y-4">
      {isEditing && <input type="hidden" name="id" value={movie.id} />}
      
      {state?.error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input required type="text" name="title" defaultValue={movie?.title} className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug * (must be unique)</label>
          <input required type="text" name="slug" defaultValue={movie?.slug} className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input type="number" name="year" defaultValue={movie?.year} className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Director</label>
          <input type="text" name="director" defaultValue={movie?.director} className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
        <input type="text" name="genre" defaultValue={movie?.genre} placeholder="e.g. Action, Sci-Fi" className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Poster URL</label>
        <input type="url" name="posterUrl" defaultValue={movie?.posterUrl} className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea name="description" rows={4} defaultValue={movie?.description} className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500" />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Link href="/admin/movies" className="px-4 py-2 text-gray-600 hover:text-gray-900 transition">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isPending ? "Saving..." : isEditing ? "Update Movie" : "Create Movie"}
        </button>
      </div>
    </form>
  );
}