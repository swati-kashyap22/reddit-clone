import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { title, content, communityName } = await req.json();

    if (!title || !communityName) {
      return NextResponse.json(
        { error: "Title and community are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please refresh and sign in again." },
        { status: 404 }
      );
    }

    const community = await prisma.community.findFirst({
      where: {
        name: decodeURIComponent(communityName),
      },
    });

    if (!community) {
      return NextResponse.json(
        { error: "Community not found" },
        { status: 404 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: user.id,
        communityId: community.id,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Post creation failed" },
      { status: 500 }
    );
  }
}