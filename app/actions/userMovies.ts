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
