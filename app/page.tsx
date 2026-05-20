import Link from "next/link";

import { currentUser } from "@clerk/nextjs/server";

import {
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

import { prisma } from "./lib/prisma";

import VoteButtons from "./components/VoteButtons";

export default async function HomePage() {

  const user = await currentUser();

  const posts = await prisma.post.findMany({

    include: {
      author: true,
      community: true,
      votes: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const communities =
    await prisma.community.findMany({

      orderBy: {
        createdAt: "desc",
      },

      take: 5,
    });

  return (
    <div className="min-h-screen bg-gray-100">

      <nav className="sticky top-0 z-50 border-b bg-white">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

          <Link
            href="/"
            className="text-3xl font-bold text-orange-500"
          >
            Reddit Clone
          </Link>
  <form
  action="/search"
  className="mx-6 flex flex-1 gap-2"
>
  <input
    type="text"
    name="q"
    placeholder="Search communities or posts..."
    className="w-full rounded-full border px-4 py-2"
  />

  <button
    type="submit"
    className="rounded-full bg-orange-500 px-5 py-2 font-semibold text-white"
  >
    Search
  </button>
</form>

          {!user ? (

            <SignInButton>

              <button className="rounded-full bg-orange-500 px-5 py-2 font-semibold text-white hover:bg-orange-600">
                Sign In
              </button>

            </SignInButton>

          ) : (

            <UserButton />

          )}

        </div>

      </nav>

      {!user ? (

        <div className="flex min-h-[80vh] items-center justify-center px-6">

          <div className="max-w-2xl text-center">

            <h1 className="mb-6 text-6xl font-extrabold text-gray-900">
              Welcome to Reddit Clone
            </h1>

            <p className="mb-10 text-xl text-gray-600">
              Discover communities, share posts,
              discuss ideas, and vote on content.
            </p>

          </div>

        </div>

      ) : (

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-6 md:grid-cols-3">

          <div className="md:col-span-2">

            <div className="space-y-4">

              {posts.map((post: any) => (

                <div
                  key={post.id}
                  className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
                >

                  <div className="flex gap-4">

                    <VoteButtons
                      postId={post.id}
                      votes={post.votes}
                    />

                    <div className="flex-1">

                      <div className="mb-2 text-sm text-gray-500">
                        Posted in r/{post.community.name}
                      </div>

                      <Link
                       href={`/r/${encodeURIComponent(post.community.name)}/post/${post.id}`}
                        className="text-2xl font-bold text-gray-900 hover:text-orange-500"
                      >
                        {post.title}
                      </Link>

                      <p className="mt-3 leading-7 text-gray-700">
                        {post.content}
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

          <div className="space-y-4">

            <div className="rounded-xl border bg-white p-6 shadow-sm">

              <h2 className="mb-4 text-2xl font-bold">
                Communities
              </h2>

              <Link
                href="/create-community"
                className="block rounded bg-orange-500 p-3 text-center font-semibold text-white hover:bg-orange-600"
              >
                Create Community
              </Link>

            </div>

            <div className="rounded-lg bg-white p-6 shadow">

              <h3 className="mb-4 text-xl font-bold">
                Top Communities
              </h3>

              <div className="space-y-3">

             {communities.map((community: any) => (
  <Link
    key={community.id}
    href={`/r/${encodeURIComponent(community.name)}`}
    className="block rounded p-2 hover:bg-gray-100"
  >
    r/{community.name}
  </Link>
))}

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}