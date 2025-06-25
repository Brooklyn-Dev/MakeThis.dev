"use client";

import ProjectIdeaCard from "@/components/ProjectIdeaCard";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Idea } from "@/types/idea";
import { apiPath } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";

const PAGE_SIZE = 10;

export default function IdeasPageClient() {
	const { data: session } = useSession();
	const router = useRouter();
	const searchParams = useSearchParams();

	const page = parseInt(searchParams.get("page") || "1", 10);

	const [ideas, setIdeas] = useState<Idea[]>([]);
	const [loading, setLoading] = useState(true);
	const [numPages, setNumPages] = useState(1);
	const [hasMore, setHasMore] = useState(false);

	async function fetchIdeas(currentPage: number) {
		setLoading(true);

		const res = await fetch(apiPath(`/ideas?page=${currentPage}&limit=${PAGE_SIZE}`));
		const { response: ideas, numPages } = await res.json();

		setIdeas(ideas);
		setNumPages(numPages);
		setHasMore(numPages > currentPage);
		setLoading(false);
	}

	useEffect(() => {
		fetchIdeas(page);
	}, [page]);

	async function handleDelete(id: string) {
		const updatedIdeas = ideas.filter((idea) => idea.id !== id);
		setIdeas(updatedIdeas);

		if (updatedIdeas.length === 0 && page > 1) {
			goToPage(page - 1);
		} else {
			fetchIdeas(page);
		}
	}

	function goToPage(p: number) {
		router.push(`?page=${p}`);
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
					<Link href={"api/auth/signin?callbackUrl=/ideas/new"}>
						<Button>Sign in to post</Button>
					</Link>
				)}
			</div>

			{loading ? (
				<p>Loading...</p>
			) : ideas.length === 0 ? (
				<p>No ideas posted yet.</p>
			) : (
				<>
					<div className="space-y-4">
						{ideas.map((idea) => (
							<ProjectIdeaCard key={idea.id} idea={idea} onDelete={() => handleDelete(idea.id)} />
						))}
					</div>

					<div className="flex justify-center items-center space-x-4 mt-6">
						<Button disabled={page === 1} onClick={() => goToPage(page - 1)}>
							Prev
						</Button>
						<span>
							Page {page} of {numPages}
						</span>
						<Button disabled={!hasMore} onClick={() => goToPage(page + 1)}>
							Next
						</Button>
					</div>
				</>
			)}
		</div>
	);
}
