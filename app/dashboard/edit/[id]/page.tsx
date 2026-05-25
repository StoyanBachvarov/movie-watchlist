import { db } from "@/db";
import { userMovies } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/app/actions/auth";
import { redirect, notFound } from "next/navigation";
import EditUserMovieForm from "@/components/EditUserMovieForm";
import Link from "next/link";

export default async function EditUserMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const currentParams = await params;
  const userMovieId = parseInt(currentParams.id, 10);

  if (isNaN(userMovieId)) notFound();

  const userMovie = await db.query.userMovies.findFirst({
    where: and(
      eq(userMovies.id, userMovieId),
      eq(userMovies.userId, session.userId)
    ),
    with: {
      movie: true,
    },
  });

  if (!userMovie) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 inline-block">
          &larr; Back to Watchlist
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit: {userMovie.movie.title}</h1>
      </div>

      <EditUserMovieForm userMovie={userMovie} />
    </div>
  );
}