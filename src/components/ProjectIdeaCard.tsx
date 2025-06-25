"use client";

import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Idea } from "@/types/idea";
import { apiPath } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
	idea: Idea;
	onDelete?: (id: string) => void;
};

export default function ProjectIdeaCard({ idea, onDelete }: Props) {
	const { data: session } = useSession();
	const router = useRouter();
	const isAuthor = session?.user?.email == idea.user.email;

	const [deleting, setDeleting] = useState(false);
	const [upvoteCount, setUpvoteCount] = useState(idea.upvoteCount ?? 0);
	const [hasUpvoted, setHasUpvoted] = useState(idea.hasUpvoted ?? false);

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
		router.push(`/ideas/edit/${ideaId}`);
	}

	async function handleUpvote() {
		if (!session) {
			signIn(undefined, { callbackUrl: window.location.href });
			return;
		}

		const res = await fetch(apiPath(`/ideas/${idea.id}/upvote`), { method: "PATCH" });

		if (res.ok) {
			const { upvoteCount } = await res.json();
			setUpvoteCount(upvoteCount);
			setHasUpvoted(!hasUpvoted);
		} else {
			toast.error("Failed to upvote.");
		}
	}

	return (
		<li key={idea.id} className="bg-white shadow-sm p-4 border rounded-xl list-none">
			<div className="flex items-start gap-4">
				<Button
					variant={hasUpvoted ? "default" : "outline"}
					size="sm"
					onClick={handleUpvote}
					className="flex items-center gap-1"
				>
					<span>👍</span>
					<span>{upvoteCount}</span>
				</Button>

				<Link href={`ideas/${idea.id}`} className="block flex-1 cursor-pointer">
					<h2 className="font-semibold text-lg">{idea.title}</h2>
					<p className="text-gray-600 text-sm">{idea.description}</p>
					<div className="mt-2 text-gray-600 text-xs">
						by {idea.user?.name || idea.user.email} - {new Date(idea.createdAt).toLocaleString()}
					</div>
				</Link>
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
