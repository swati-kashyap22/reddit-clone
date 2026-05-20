import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function DELETE(req: Request) {
  try {
    const { commentId } = await req.json();

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Comment delete failed" },
      { status: 500 }
    );
  }
}