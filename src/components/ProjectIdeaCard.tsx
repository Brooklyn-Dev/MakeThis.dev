"use client";

import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Idea } from "@/types/idea";

type Props = {
  idea: Idea;
  onDelete?: (id: string) => void;
};

export default function ProjectIdeaCard({ idea, onDelete }: Props) {
  const { data: session } = useSession();
  const isAuthor = session?.user?.email == idea.user.email;

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this idea?")) return;

    const res = await fetch(`/api/ideas/${idea.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("Idea deleted!");
      onDelete?.(idea.id);
    } else {
      toast.error("Failed to delete idea.");
    }
  }

  return (
    <li key={idea.id} className="bg-white shadow-sm p-4 border rounded-xl list-none">
      <h2 className="font-semibold text-lg">{idea.title}</h2>
      <p className="text-gray-600 text-sm">{idea.description}</p>
      <div className="mt-2 text-gray-600 text-xs">
        by {idea.user?.name || idea.user.email} - {new Date(idea.createdAt).toLocaleString()}
      </div>

      {isAuthor && (
        <div className="flex gap--2 mt-3">
          <Button className="cursor-pointer" size="sm" variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      )}
    </li>
  );
}
