"use client";

import { use } from "react";
import { useEffect, useState } from "react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PostPage({
  params,
}: PageProps) {

  const { id } = use(params);

  const [post, setPost] = useState<any>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {

    const fetchPost = async () => {

      const response = await fetch(
        `/api/post/${id}`
      );

      const data = await response.json();

      setPost(data);
    };

    fetchPost();

  }, [id]);
  const handleDeletePost = async () => {
  const confirmDelete = confirm(
    "Are you sure you want to delete this post?"
  );

  if (!confirmDelete) return;

  const response = await fetch("/api/post/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      postId: id,
    }),
  });

  if (response.ok) {
    alert("Post deleted!");
    window.location.href = `/r/${post.community.name}`;
  } else {
    alert("You can only delete your own post");
  }
};


  const handleComment = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const response = await fetch(
        "/api/comment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: comment,
            postId: id,
          }),
        }
      );

      if (response.ok) {

        alert("Comment added!");

        setComment("");

        location.reload();

      } else {
        alert("Failed to add comment");
      }

    } catch (error) {

      console.log(error);

      alert("Something went wrong");
    }
  };

  if (!post) {
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="mx-auto max-w-3xl space-y-6">

        <div className="rounded bg-white p-6 shadow">

          <div className="mb-4 text-sm text-gray-500">
            Posted in r/{post.community.name}
          </div>

          <h1 className="text-4xl font-bold">
            {post.title}
          </h1>

          <p className="mt-6 text-lg text-gray-700">
            {post.content}
          </p>

          <div className="mt-8 text-sm text-gray-500">
            Posted by {post.author.username || "Anonymous"}
          </div>
          <button
  onClick={handleDeletePost}
  className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
>
  Delete Post
</button>

        </div>

        <div className="rounded bg-white p-6 shadow">

          <h2 className="mb-4 text-2xl font-bold">
            Add Comment
          </h2>

          <form
            onSubmit={handleComment}
            className="space-y-4"
          >

            <textarea
              placeholder="Write your comment..."
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              className="min-h-[120px] w-full rounded border p-3"
            />

            <button
              type="submit"
              className="rounded bg-orange-500 px-6 py-2 text-white"
            >
              Comment
            </button>

          </form>

        </div>

        <div className="space-y-4">

          <h2 className="text-2xl font-bold">
            Comments
          </h2>

          {post.comments.map((comment: any) => (

            <div
              key={comment.id}
              className="rounded bg-white p-4 shadow"
            >

              <p className="text-gray-700">
                {comment.text}
              </p>

              <div className="mt-2 text-sm text-gray-500">
                {comment.author.username || "Anonymous"}
              </div>

              <button
  onClick={async () => {
    const confirmDelete = confirm("Delete this comment?");
    if (!confirmDelete) return;

    const response = await fetch("/api/comment/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commentId: comment.id,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Comment deleted!");

      setPost((prev: any) => ({
        ...prev,
        comments: prev.comments.filter(
          (c: any) => c.id !== comment.id
        ),
      }));
    } else {
      alert(data.error);
    }
  }}
  className="mt-3 rounded bg-red-500 px-3 py-1 text-sm text-white"
>
  Delete Comment
</button>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}