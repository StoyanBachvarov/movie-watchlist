import { db } from "@/db";
import { userMovies, movies } from "@/db/schema";
import { eq, and, isNotNull } from "drizzle-orm";
import { getSession } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardStatsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const userId = session.userId;

  const myMovies = await db.query.userMovies.findMany({
    where: eq(userMovies.userId, userId),
    with: {
      movie: true,
    },
  });

  const totalMovies = myMovies.length;
  
  const statusCounts = {
    to_watch: myMovies.filter(m => m.status === 'to_watch').length,
    watching: myMovies.filter(m => m.status === 'watching').length,
    watched: myMovies.filter(m => m.status === 'watched').length,
  };

  const ratedMovies = myMovies.filter(m => m.rating !== null);
  const avgRating = ratedMovies.length > 0
    ? (ratedMovies.reduce((acc, curr) => acc + (curr.rating as number), 0) / ratedMovies.length).toFixed(1)
    : "N/A";

  const genreCounts: Record<string, number> = {};
  myMovies.forEach(um => {
    if (um.movie.genre) {
      um.movie.genre.split(',').forEach(g => {
        const genre = g.trim();
        if (genre) {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        }
      });
    }
  });

  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Your Watchlist Statistics</h1>
        <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">
          &larr; Back to Watchlist
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-center items-center text-center h-40">
          <p className="text-4xl font-bold text-blue-600 mb-2">{totalMovies}</p>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Movies</p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-center items-center text-center h-40">
          <p className="text-4xl font-bold text-yellow-500 mb-2">{avgRating}</p>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Avg Rating</p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-center h-40">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 text-center">By Status</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">To Watch</span>
              <span className="font-semibold text-gray-900">{statusCounts.to_watch}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Watching</span>
              <span className="font-semibold text-gray-900">{statusCounts.watching}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Watched</span>
              <span className="font-semibold text-gray-900">{statusCounts.watched}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Top Genres</h2>
        {topGenres.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No genres found yet.</p>
        ) : (
          <div className="space-y-4">
            {topGenres.map(([genre, count], idx) => {
              const percentage = Math.round((count / totalMovies) * 100);
              return (
                <div key={genre}>
                  <div className="flex justify-between text-sm mb-1 line-clamp-1">
                    <span className="font-medium text-gray-700">{idx + 1}. {genre}</span>
                    <span className="text-gray-500">{count} movies ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}