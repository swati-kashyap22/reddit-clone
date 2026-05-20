import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  req: Request,
  { params }: RouteProps
) {

  try {

    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: {
        id,
      },

      include: {
        author: true,

        community: true,

        comments: {
          include: {
            author: true,
          },

          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}