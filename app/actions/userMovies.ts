"use server";

import { db } from "@/db";
import { userMovies } from "@/db/schema";
import { getSession } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addToWatchlist(movieId: number, slug: string) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const userId = session.userId;

  // Check if it already exists
  const existing = await db.query.userMovies.findFirst({
    where: and(
      eq(userMovies.userId, userId),
      eq(userMovies.movieId, movieId)
    ),
  });

  if (!existing) {
    await db.insert(userMovies).values({
      userId,
      movieId,
      status: "to_watch",
    });
  }

  revalidatePath("/dashboard");
  revalidatePath(`/movies/${slug}`);
  redirect("/dashboard");
}

export async function updateUserMovie(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const id = formData.get("id") as string;
  const status = formData.get("status") as "to_watch" | "watching" | "watched";
  const ratingStr = formData.get("rating") as string;
  const review = formData.get("review") as string;

  if (!id || !status) {
    return { error: "ID and Status are required" };
  }

  const userMovieId = parseInt(id, 10);
  const rating = ratingStr ? parseInt(ratingStr, 10) : null;

  try {
    await db.update(userMovies)
      .set({
        status,
        rating,
        review,
      })
      .where(and(eq(userMovies.id, userMovieId), eq(userMovies.userId, session.userId)));
  } catch (error) {
    console.error(error);
    return { error: "Failed to update movie details." };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
