"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { apiPath } from "@/lib/api";
import { Idea } from "@/types/idea";

export default function IdeaPageClient({ idea }: { idea: Idea }) {
	const { data: session } = useSession();
	const [upvoteCount, setUpvoteCount] = useState(idea.upvoteCount ?? 0);
	const [hasUpvoted, setHasUpvoted] = useState(idea.hasUpvoted ?? false);

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
		<>
			<div className="flex items-center gap-4 mb-4">
				<Button
					variant={hasUpvoted ? "default" : "outline"}
					size="sm"
					onClick={handleUpvote}
					className="flex items-center gap-1"
				>
					<span>👍</span>
					<span>{upvoteCount}</span>
				</Button>
				<h1 className="font-bold text-2xl">{idea.title}</h1>
			</div>

			<p className="mb-4 text-gray-600">{idea.description}</p>

			{idea.problemStatement && (
				<section className="mb-6">
					<h2 className="mb-1 font-semibold text-lg">Why this idea?</h2>
					<p className="text-gray-700 whitespace-pre-wrap">{idea.problemStatement}</p>
				</section>
			)}

			{idea.targetAudience && (
				<section className="mb-6">
					<h2 className="mb-1 font-semibold text-lg">Who is this for?</h2>
					<p className="text-gray-700">{idea.targetAudience}</p>
				</section>
			)}

			{idea.keyChallenges && (
				<section className="mb-6">
					<h2 className="mb-1 font-semibold text-lg">What are the key challenges?</h2>
					<p className="text-gray-700 whitespace-pre-wrap">{idea.keyChallenges}</p>
				</section>
			)}

			<footer className="pt-4 border-t text-gray-500 text-xs">
				<p>
					Posted by: <span className="font-medium text-gray-900">{idea.user.name || idea.user.email}</span>
				</p>
				<p>On: {new Date(idea.createdAt).toLocaleString()}</p>
			</footer>
		</>
	);
}
