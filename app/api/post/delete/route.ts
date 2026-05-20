import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function DELETE(req: Request) {
  try {
    const { postId } = await req.json();

    await prisma.comment.deleteMany({
      where: { postId },
    });

    await prisma.vote.deleteMany({
      where: { postId },
    });

    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Post delete failed" },
      { status: 500 }
    );
  }
}