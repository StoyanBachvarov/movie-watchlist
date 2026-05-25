import { getSession } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AddMovieSearch from "@/components/AddMovieSearch";

export default async function DashboardNewPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 inline-block">
          &larr; Back to Watchlist
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add a Movie</h1>
        <p className="text-gray-500 mt-2">Search for a movie in our database to add to your watchlist.</p>
      </div>

      <AddMovieSearch />
    </div>
  );
}