"use client";

import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Idea } from "@/types/idea";
import { apiPath } from "@/lib/api";
import { redirect } from "next/navigation";
import { useState } from "react";

type Props = {
	idea: Idea;
	onDelete?: (id: string) => void;
};

export default function ProjectIdeaCard({ idea, onDelete }: Props) {
	const { data: session } = useSession();
	const isAuthor = session?.user?.email == idea.user.email;
	const [deleting, setDeleting] = useState(false);

	async function handleDelete() {
		if (!confirm("Are you sure you want to delete this idea?")) return;

		setDeleting(true);
		const res = await fetch(apiPath(`/ideas/${idea.id}`), {
			method: "DELETE",
		});

		if (res.ok) {
			toast.success("Idea deleted!");
			onDelete?.(idea.id);
		} else {
			toast.error("Failed to delete idea.");
		}

		setDeleting(false);
	}

	async function handleEdit(ideaId: string) {
		redirect(`/ideas/edit/${ideaId}`);
	}

	return (
		<li key={idea.id} className="bg-white shadow-sm p-4 border rounded-xl list-none">
			<h2 className="font-semibold text-lg">{idea.title}</h2>
			<p className="text-gray-600 text-sm">{idea.description}</p>
			<div className="mt-2 text-gray-600 text-xs">
				by {idea.user?.name || idea.user.email} - {new Date(idea.createdAt).toLocaleString()}
			</div>

			{isAuthor && (
				<div className="flex justify-end gap-4">
					<div className="flex gap--2 mt-3">
						<Button
							className="cursor-pointer"
							size="sm"
							variant="outline"
							onClick={() => handleEdit(idea.id)}
						>
							Edit
						</Button>
					</div>

					<div className="flex gap--2 mt-3">
						<Button
							disabled={deleting}
							className="cursor-pointer"
							size="sm"
							variant="destructive"
							onClick={handleDelete}
						>
							Delete
						</Button>
					</div>
				</div>
			)}
		</li>
	);
}
