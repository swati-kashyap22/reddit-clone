import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/prisma";import { NextResponse } from "next/server";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        clerkId: userId,
        username: user.username || "",
        imageUrl: user.imageUrl,
      },
    });
  }

  return NextResponse.json({
    success: true,
  });
}