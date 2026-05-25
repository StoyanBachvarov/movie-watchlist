import { db } from "@/db";
import { userMovies } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardPage() {
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
    orderBy: [desc(userMovies.createdAt)],
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">My Watchlist</h1>
      
      {myMovies.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-500 mb-4">Your watchlist is empty.</p>
          <Link href="/movies" className="px-5 py-2 inline-block bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {myMovies.map((um) => (
            <div key={um.id} className="border rounded-xl p-4 flex flex-col gap-4 shadow-sm bg-white">
              <Link href={`/movies/${um.movie.slug}`} className="group block relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-200">
                {um.movie.posterUrl ? (
                  <Image
                    src={um.movie.posterUrl}
                    alt={um.movie.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 border border-gray-200 rounded-lg">
                    No Image
                  </div>
                )}
              </Link>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link href={`/movies/${um.movie.slug}`} className="hover:underline block">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{um.movie.title}</h3>
                  </Link>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    um.status === 'watched' ? 'bg-green-100 text-green-800' :
                    um.status === 'watching' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {um.status === 'to_watch' ? 'To Watch' : um.status === 'watching' ? 'Watching' : 'Watched'}
                  </span>
                  
                  {um.rating !== null && (
                    <span className="text-sm font-semibold text-yellow-600 flex items-center gap-1">
                      ★ {um.rating}/10
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
