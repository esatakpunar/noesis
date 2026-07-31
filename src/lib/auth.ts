import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/** Clerk oturumundaki kullanıcıyı DB'de garanti eder (ilk girişte satırı oluşturur). */
export async function ensureDbUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (existing) return existing;

  const clerkUser = await currentUser();
  return prisma.user.create({
    data: {
      id: userId,
      email: clerkUser?.primaryEmailAddress?.emailAddress,
      name: clerkUser?.firstName,
    },
  });
}
