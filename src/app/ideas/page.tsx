"use client";

import ProjectIdeaCard from "@/components/ProjectIdeaCard";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Idea } from "@/types/idea";
import { apiPath } from "@/lib/api";

export default function IdeasPage() {
	const { data: session } = useSession();
	const [ideas, setIdeas] = useState<Idea[]>([]);
	const [loading, setLoading] = useState(true);

	async function fetchIdeas() {
		const res = await fetch(apiPath("/ideas"));
		const data = await res.json();
		setIdeas(data);
		setLoading(false);
	}

	useEffect(() => {
		fetchIdeas();
	}, []);

	function removeIdea(id: string) {
		setIdeas((prev) => prev.filter((idea) => idea.id != id));
	}

	return (
		<div className="mx-auto p-6 max-w-3xl">
			<div className="flex justify-between items-center mb-4">
				<h1 className="font-bold text-2xl">Project Ideas</h1>

				{session ? (
					<Link href="/ideas/new">
						<Button>New Idea</Button>
					</Link>
				) : (
					<Link href={apiPath("/auth/signin?callbackUrl=/ideas/new")}>
						<Button>Sign in to post</Button>
					</Link>
				)}
			</div>

			{loading ? (
				<p>Loading...</p>
			) : ideas.length === 0 ? (
				<p>No ideas posted yet.</p>
			) : (
				<div className="space-y-4">
					{ideas.map((idea) => (
						<ProjectIdeaCard key={idea.id} idea={idea} onDelete={removeIdea} />
					))}
				</div>
			)}
		</div>
	);
}
