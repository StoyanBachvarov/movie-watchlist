import { getSession } from "@/app/actions/auth";
import UserProfile from "@/components/UserProfile";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return <UserProfile user={session} />;
}
