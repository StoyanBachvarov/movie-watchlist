import { db } from "@/db";
import { movies } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 600; // ISR: revalidate every 10 minutes

export default async function Home() {
  const recentMovies = await db.query.movies.findMany({
    orderBy: [desc(movies.createdAt)],
    limit: 8,
  });

  return (
    <div className="space-y-12">
      <section className="bg-blue-600 text-white rounded-2xl p-8 sm:p-12 text-center shadow-lg">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Track Your Favorite Movies</h1>
        <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
          Discover new films, keep a watchlist, and rate what you have seen. Join MovieSync today and build your personal library.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/register" className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow">
            Get Started
          </Link>
          <Link href="/movies" className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition">
            Browse Movies
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recently Added (Public Feed)</h2>
          <Link href="/movies" className="text-blue-600 hover:underline text-sm font-medium">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recentMovies.map((movie) => (
            <Link key={movie.id} href={`/movies/${movie.slug}`} className="group block">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-200 mb-3 shadow-md">
                {movie.posterUrl ? (
                  <Image 
                    src={movie.posterUrl} 
                    alt={movie.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition duration-300"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 line-clamp-1">{movie.title}</h3>
              <p className="text-sm text-gray-500">{movie.year} • {movie.genre}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
