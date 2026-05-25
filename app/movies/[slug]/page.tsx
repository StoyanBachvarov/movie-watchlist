import { db } from "@/db";
import { movies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const currentParams = await params;
  
  const movie = await db.query.movies.findFirst({
    where: eq(movies.slug, currentParams.slug),
  });

  if (!movie) {
    notFound();
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/3 border rounded-2xl overflow-hidden shadow-lg bg-gray-100 relative aspect-[2/3]">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image Provided
          </div>
        )}
      </div>

      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{movie.title}</h1>
          <div className="flex items-center gap-2 text-gray-600 text-lg">
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.director || 'Unknown Director'}</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
              {movie.genre || 'Uncategorized'}
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {movie.description || 'No description available for this movie.'}
          </p>
        </div>

        <div className="pt-6 border-t">
          <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition">
            + Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  );
}
