"use client";

export default function DeleteCommunityButton({
  communityId,
}: {
  communityId: string;
}) {

  const handleDelete = async () => {

    const confirmDelete = confirm(
      "Delete this community?"
    );

    if (!confirmDelete) return;

    const response = await fetch(
      "/api/community/delete",
      {
        method: "DELETE",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          communityId,
        }),
      }
    );

    if (response.ok) {

      alert("Community deleted!");

      window.location.href = "/";

    } else {

      alert("Failed to delete community");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="ml-3 rounded bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-600"
    >
      Delete Community
    </button>
  );
}