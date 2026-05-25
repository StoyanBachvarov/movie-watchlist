import { db } from "@/db";
import { movies } from "@/db/schema";
import { ilike, count } from "drizzle-orm";
import { getSession } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { deleteMovie } from "@/app/actions/adminMovies";
import Image from "next/image";

export default async function AdminMoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect("/");

  const { q, page } = await searchParams;
  const currentPage = parseInt(page || "1", 10);
  const limit = 5;
  const offset = (currentPage - 1) * limit;

  const whereClause = q ? ilike(movies.title, `%${q}%`) : undefined;

  const results = await db.query.movies.findMany({
    where: whereClause,
    limit,
    offset,
    orderBy: (m, { desc }) => [desc(m.createdAt)],
  });

  const totalCountData = await db.select({ value: count() }).from(movies).where(whereClause);
  const totalCount = totalCountData[0].value;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Manage Movies</h1>
        <Link href="/admin/movies/new" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
          + Add New Movie
        </Link>
      </div>

      <div className="bg-white p-4 border rounded shadow-sm">
        <form className="flex gap-2 w-full max-w-md">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search movies..."
            className="flex-1 border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
          <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800">
            Search
          </button>
        </form>
      </div>

      <div className="bg-white border rounded shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-900">Movie</th>
              <th className="px-6 py-3 font-medium text-gray-900">Year</th>
              <th className="px-6 py-3 font-medium text-gray-900">Added</th>
              <th className="px-6 py-3 font-medium text-gray-900 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {results.map((movie) => (
              <tr key={movie.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 flex items-center gap-3">
                  {movie.posterUrl ? (
                    <div className="relative h-12 w-8 rounded overflow-hidden flex-shrink-0 bg-gray-200">
                      <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" sizes="32px" />
                    </div>
                  ) : (
                    <div className="h-12 w-8 bg-gray-200 rounded flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{movie.title}</h3>
                    <p className="text-xs text-gray-500">/{movie.slug}</p>
                  </div>
                </td>
                <td className="px-6 py-4">{movie.year || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{movie.createdAt.toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right space-x-2 w-32">
                  <Link href={`/admin/movies/edit/${movie.id}`} className="text-blue-600 hover:underline">
                    Edit
                  </Link>
                  <form action={deleteMovie} className="inline-block" onSubmit={(e) => {
                    if(!confirm('Are you sure you want to delete this movie?')) e.preventDefault();
                  }}>
                    <input type="hidden" name="id" value={movie.id} />
                    <button type="submit" className="text-red-600 hover:underline ml-2">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No movies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Link
              key={i}
              href={`/admin/movies?page=${i + 1}${q ? `&q=${q}` : ''}`}
              className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}