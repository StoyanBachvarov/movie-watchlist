"use client";

import { useState, useTransition } from "react";
import { searchMoviesForAdd } from "@/app/actions/search";
import { addToWatchlist } from "@/app/actions/userMovies";
import Image from "next/image";

export default function AddMovieSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isAddingId, setIsAddingId] = useState<number | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    
    startTransition(async () => {
      const data = await searchMoviesForAdd(query);
      setResults(data);
    });
  };

  const handleAdd = async (movieId: number, slug: string) => {
    setIsAddingId(movieId);
    await addToWatchlist(movieId, slug);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
          className="flex-1 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white p-3"
        />
        <button
          type="submit"
          disabled={isPending || query.length < 2}
          className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition font-medium disabled:opacity-50"
        >
          {isPending ? "Searching..." : "Search"}
        </button>
      </form>

      {results.length > 0 && (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm divide-y divide-gray-100">
          {results.map((movie) => (
            <div key={movie.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
              <div className="flex items-center gap-4">
                {movie.posterUrl ? (
                  <div className="relative w-12 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-200">
                    <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" sizes="48px" />
                  </div>
                ) : (
                  <div className="w-12 h-16 rounded flex items-center justify-center bg-gray-200 text-xs text-gray-500 text-center px-1">
                    No Img
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{movie.title}</h3>
                  <p className="text-sm text-gray-500">{movie.year || "Unknown year"} {movie.director && `• Dir: ${movie.director}`}</p>
                </div>
              </div>
              <button
                onClick={() => handleAdd(movie.id, movie.slug)}
                disabled={isAddingId === movie.id}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition font-medium text-sm disabled:opacity-50"
              >
                {isAddingId === movie.id ? "Adding..." : "Add to Watchlist"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}