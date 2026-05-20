"use client";

import { useRouter } from "next/navigation";

interface VoteButtonsProps {
  postId: string;

  votes: {
    type: string;
  }[];
}

export default function VoteButtons({
  postId,
  votes,
}: VoteButtonsProps) {

  const router = useRouter();

  const score = votes.reduce(
    (acc, vote) =>
      vote.type === "UP"
        ? acc + 1
        : acc - 1,
    0
  );

  async function vote(type: "UP" | "DOWN") {

    await fetch("/api/vote", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        postId,
        type,
      }),
    });

    router.refresh();
  }

  return (

    <div className="flex flex-col items-center">

      <button
        onClick={() => vote("UP")}
        className="text-2xl hover:scale-110"
      >
        ⬆️
      </button>

      <div className="font-bold">
        {score}
      </div>

      <button
        onClick={() => vote("DOWN")}
        className="text-2xl hover:scale-110"
      >
        ⬇️
      </button>

    </div>

  );
}