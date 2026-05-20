import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../lib/prisma";

export async function POST(req: Request) {

  try {

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const { postId, type } = body;

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const existingVote =
      await prisma.vote.findUnique({
        where: {
          userId_postId: {
            userId: user.id,
            postId,
          },
        },
      });

    if (existingVote) {

      if (existingVote.type === type) {

        await prisma.vote.delete({
          where: {
            id: existingVote.id,
          },
        });

        return NextResponse.json({
          message: "Vote removed",
        });
      }

      await prisma.vote.update({
        where: {
          id: existingVote.id,
        },

        data: {
          type,
        },
      });

      return NextResponse.json({
        message: "Vote updated",
      });
    }

    await prisma.vote.create({
      data: {
        type,
        userId: user.id,
        postId,
      },
    });

    return NextResponse.json({
      message: "Vote added",
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}