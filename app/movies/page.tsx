import { db } from "@/db";
import { movies } from "@/db/schema";
import { desc, count } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const currentParams = await searchParams;
  const page = parseInt(currentParams.page || "1", 10);
  const limit = 8;
  const offset = (page - 1) * limit;

  const [moviesList, [{ totalCount }]] = await Promise.all([
    db.query.movies.findMany({
      orderBy: [desc(movies.createdAt)],
      limit,
      offset,
    }),
    db.select({ totalCount: count() }).from(movies),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Browse Movies</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {moviesList.map((movie) => (
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
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 line-clamp-1">{movie.title}</h3>
            <p className="text-sm text-gray-500">{movie.year} • {movie.genre}</p>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {page > 1 ? (
            <Link
              href={`/movies?page=${page - 1}`}
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition"
            >
              Previous
            </Link>
          ) : (
            <span className="px-4 py-2 bg-gray-50 text-gray-400 rounded-md cursor-not-allowed">
              Previous
            </span>
          )}
          
          <span className="text-sm text-gray-600 font-medium">
            Page {page} of {totalPages}
          </span>
          
          {page < totalPages ? (
            <Link
              href={`/movies?page=${page + 1}`}
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition"
            >
              Next
            </Link>
          ) : (
            <span className="px-4 py-2 bg-gray-50 text-gray-400 rounded-md cursor-not-allowed">
              Next
            </span>
          )}
        </div>
      )}
    </div>
  );
}
