import { db } from "@/db";
import { movies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/app/actions/auth";
import { redirect, notFound } from "next/navigation";
import AdminMovieForm from "@/components/AdminMovieForm";
import Link from "next/link";

export default async function EditAdminMoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect("/");

  const currentParams = await params;
  const id = parseInt(currentParams.id, 10);
  if (isNaN(id)) notFound();

  const movie = await db.query.movies.findFirst({
    where: eq(movies.id, id),
  });

  if (!movie) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/admin/movies" className="text-gray-500 hover:text-gray-900 text-sm">
        &larr; Back to Movies
      </Link>
      <h1 className="text-3xl font-bold text-gray-900">Edit Movie: {movie.title}</h1>
      <AdminMovieForm movie={movie} />
    </div>
  );
}