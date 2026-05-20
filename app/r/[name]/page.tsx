import Link from "next/link";
import { prisma } from "../../lib/prisma";
import VoteButtons from "../../components/VoteButtons";
import DeleteCommunityButton from "../../components/DeleteCommunityButton";

export const dynamic = "force-dynamic";

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const communityName = decodeURIComponent(name);

  const community = await prisma.community.findFirst({
    where: {
      name: communityName,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!community) {
    return (
      <div className="p-10 text-center text-3xl">
        Community not found: {communityName}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <h1 className="text-5xl font-bold">
            r/{community.name}
          </h1>

          <p className="mt-3 text-gray-600">
            {community.description}
          </p>

          <Link
            href={`/r/${community.name}/create-post`}
            className="mt-6 inline-block rounded bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Create Post
          </Link>
          <DeleteCommunityButton
  communityId={community.id}
/>
        </div>
      </div>

      <div className="mx-auto max-w-3xl p-6">
        {community.posts.length === 0 ? (
          <div className="rounded-lg bg-white p-10 text-center shadow">
            <h2 className="text-3xl font-bold">No Posts Yet</h2>
            <p className="mt-4 text-gray-600">
              Create the first post in this community.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {community.posts.map((post: any) => (
              <div key={post.id} className="rounded-lg bg-white p-6 shadow">
                <div className="flex gap-4">
                  <VoteButtons postId={post.id} votes={post.votes} />

                  <div className="flex-1">
                    <Link
                      href={`/r/${community.name}/post/${post.id}`}
                      className="text-2xl font-bold hover:text-orange-500"
                    >
                      {post.title}
                    </Link>

                    <p className="mt-2 text-gray-700">{post.content}</p>

                    <div className="mt-4 text-sm text-gray-500">
                      Posted by {post.author.username || "Anonymous"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}