import Link from "next/link";
import { prisma } from "../lib/prisma";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params.q || "";

  const posts = query
    ? await prisma.post.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              content: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          community: true,
          author: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  const communities = query
    ? await prisma.community.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-orange-500">
          ← Back Home
        </Link>

        <h1 className="my-6 text-4xl font-bold">
          Search Results for "{query}"
        </h1>

        <form action="/search" className="mb-6 flex gap-2">
          <input
            name="q"
            defaultValue={query}
            placeholder="Search posts or communities..."
            className="w-full rounded border p-3"
          />

          <button
            type="submit"
            className="rounded bg-orange-500 px-5 text-white"
          >
            Search
          </button>
        </form>

        <div className="space-y-6">
          <div className="rounded bg-white p-6 shadow">
            <h2 className="mb-4 text-2xl font-bold">
              Communities
            </h2>

            {communities.length === 0 ? (
              <p className="text-gray-500">
                No communities found
              </p>
            ) : (
              communities.map((community: any) => (
                <Link
                  key={community.id}
                  href={`/r/${community.name}`}
                  className="block rounded p-2 hover:bg-gray-100"
                >
                  r/{community.name}
                </Link>
              ))
            )}
          </div>

          <div className="rounded bg-white p-6 shadow">
            <h2 className="mb-4 text-2xl font-bold">
              Posts
            </h2>

            {posts.length === 0 ? (
              <p className="text-gray-500">
                No posts found
              </p>
            ) : (
              <div className="space-y-4">
                {posts.map((post: any) => (
                  <div key={post.id} className="border-b pb-4">
                    <div className="text-sm text-gray-500">
                      r/{post.community.name}
                    </div>

                    <Link
                      href={`/r/${post.community.name}/post/${post.id}`}
                      className="text-xl font-bold hover:text-orange-500"
                    >
                      {post.title}
                    </Link>

                    <p className="mt-2 text-gray-700">
                      {post.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}