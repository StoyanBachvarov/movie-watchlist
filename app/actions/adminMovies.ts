"use server";

import { db } from "@/db";
import { movies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error("Unauthorized");
}

export async function createMovie(prevState: any, formData: FormData) {
  try {
    await verifyAdmin();
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    
    if (!title || !slug) return { error: "Title and slug are required" };
    
    await db.insert(movies).values({
      title,
      slug,
      description: formData.get("description") as string,
      year: formData.get("year") ? parseInt(formData.get("year") as string) : null,
      director: formData.get("director") as string,
      genre: formData.get("genre") as string,
      posterUrl: formData.get("posterUrl") as string,
    });
  } catch (error: any) {
    console.error(error);
    return { error: error.message || "Failed to create movie. Slug might be taken." };
  }
  
  revalidatePath("/admin/movies");
  revalidatePath("/movies");
  redirect("/admin/movies");
}

export async function updateMovie(prevState: any, formData: FormData) {
  try {
    await verifyAdmin();
    const id = parseInt(formData.get("id") as string);
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    
    if (!id || !title || !slug) return { error: "ID, Title and slug are required" };

    await db.update(movies).set({
      title,
      slug,
      description: formData.get("description") as string,
      year: formData.get("year") ? parseInt(formData.get("year") as string) : null,
      director: formData.get("director") as string,
      genre: formData.get("genre") as string,
      posterUrl: formData.get("posterUrl") as string,
    }).where(eq(movies.id, id));
  } catch (error: any) {
    console.error(error);
    return { error: "Failed to update movie. Slug might be taken." };
  }
  
  revalidatePath("/admin/movies");
  revalidatePath("/movies");
  revalidatePath(`/movies/${formData.get("slug")}`);
  redirect("/admin/movies");
}

export async function deleteMovie(formData: FormData) {
  await verifyAdmin();
  const id = parseInt(formData.get("id") as string);
  if (!id) return;
  
  await db.delete(movies).where(eq(movies.id, id));
  
  revalidatePath("/admin/movies");
  revalidatePath("/movies");
}