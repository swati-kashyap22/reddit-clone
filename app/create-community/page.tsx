"use client";

import { useState } from "react";

export default function CreateCommunityPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/community/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
      }),
    });

    if (response.ok) {
      alert("Community created!");
      setName("");
      setDescription("");
    } else {
      alert("Failed to create community");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-gray-900">
          Create a Community
        </h1>

        <p className="mt-2 text-gray-600">
          Start a new space for people to post and discuss.
        </p>

        <form onSubmit={handleCreateCommunity} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block font-semibold">
              Community Name
            </label>

            <input
              type="text"
              placeholder="example: gaming"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Description
            </label>

            <textarea
              placeholder="What is this community about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[140px] w-full rounded-lg border px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600"
          >
            Create Community
          </button>
        </form>
      </div>
    </div>
  );
}