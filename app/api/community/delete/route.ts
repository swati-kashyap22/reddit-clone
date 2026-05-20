import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function DELETE(req: Request) {
  try {
    const { communityId } = await req.json();

    if (!communityId) {
      return NextResponse.json(
        { error: "Community ID is required" },
        { status: 400 }
      );
    }

    const posts = await prisma.post.findMany({
      where: {
        communityId,
      },
      select: {
        id: true,
      },
    });

    const postIds = posts.map((post) => post.id);

    await prisma.$transaction([
      prisma.comment.deleteMany({
        where: {
          postId: {
            in: postIds,
          },
        },
      }),

      prisma.vote.deleteMany({
        where: {
          postId: {
            in: postIds,
          },
        },
      }),

      prisma.post.deleteMany({
        where: {
          communityId,
        },
      }),

      prisma.community.delete({
        where: {
          id: communityId,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Community delete failed" },
      { status: 500 }
    );
  }
}