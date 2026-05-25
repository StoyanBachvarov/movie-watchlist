import { getSession } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import AdminMovieForm from "@/components/AdminMovieForm";
import Link from "next/link";

export default async function NewAdminMoviePage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') redirect("/");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/admin/movies" className="text-gray-500 hover:text-gray-900 text-sm">
        &larr; Back to Movies
      </Link>
      <h1 className="text-3xl font-bold text-gray-900">Add New Movie</h1>
      <AdminMovieForm />
    </div>
  );
}