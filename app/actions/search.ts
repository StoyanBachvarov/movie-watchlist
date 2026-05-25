"use server";

export async function searchMoviesForAdd(query: string) {
  if (!query || query.length < 2) return [];
  
  const { db } = await import("@/db");
  const { movies } = await import("@/db/schema");
  const { ilike } = await import("drizzle-orm");

  const results = await db.query.movies.findMany({
    where: ilike(movies.title, `%${query}%`),
    limit: 10,
  });

  return results;
}