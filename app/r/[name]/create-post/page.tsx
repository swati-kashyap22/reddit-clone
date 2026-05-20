"use client";

import { use } from "react";
import { useState } from "react";

interface CreatePostPageProps {
  params: Promise<{
    name: string;
  }>;
}

export default function CreatePostPage({
  params,
}: CreatePostPageProps) {

  const { name } = use(params);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreatePost = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    const response = await fetch(
      "/api/post/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          communityName: name,
        }),
      }
    );

    if (response.ok) {

      alert("Post created!");

      window.location.href = `/r/${name}`;

    } else {

      alert("Failed to create post");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">

      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow">

        <h1 className="text-4xl font-bold">
          Create Post
        </h1>

        <p className="mt-2 text-gray-600">
          Posting in r/{name}
        </p>

        <form
          onSubmit={handleCreatePost}
          className="mt-8 space-y-5"
        >

          <div>

            <label className="mb-2 block font-semibold">
              Title
            </label>

            <input
              type="text"
              placeholder="Post title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-orange-500"
              required
            />

          </div>

          <div>

            <label className="mb-2 block font-semibold">
              Content
            </label>

            <textarea
              placeholder="Write your post..."
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              className="min-h-[180px] w-full rounded-lg border px-4 py-3 outline-none focus:border-orange-500"
            />

          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Create Post
          </button>

        </form>

      </div>

    </div>
  );
}