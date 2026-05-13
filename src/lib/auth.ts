import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentStudent() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const email = user.emailAddresses.find(
    (address) => address.id === user.primaryEmailAddressId,
  )?.emailAddress;

  return prisma.studentProfile.upsert({
    where: { clerkUserId: user.id },
    update: {
      email,
      name: user.fullName,
    },
    create: {
      clerkUserId: user.id,
      email,
      name: user.fullName,
    },
  });
}
