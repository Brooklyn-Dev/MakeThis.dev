import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function IdeasPage() {
	const session = await getServerSession(authOptions);

	const ideas = await prisma.projectIdea.findMany({
		include: { user: true },
		orderBy: { createdAt: "desc" },
	});

	return (
		<div className="mx-auto p-6 max-w-3xl">
			<div className="flex justify-between items-center mb-4">
				<h1 className="font-bold text-2xl">Project Ideas</h1>

				{session ? (
					<Link href="/ideas/new">
						<Button>New Idea</Button>
					</Link>
				) : (
					<Link href="/api/auth/signin">
						<Button>Sign in to post</Button>
					</Link>
				)}

				{ideas.length === 0 && <p>No ideas posted yet.</p>}
			</div>

			<div className="space-y-4">
				{ideas.map((idea) => (
					<li key={idea.id} className="bg-white shadow-sm p-4 border rounded-xl list-none">
						<h2 className="font-semibold text-lg">{idea.title}</h2>
						<p className="text-gray-600 text-sm">{idea.description}</p>
						<div className="mt-2 text-gray-600 text-xs">
							by {idea.user?.name || idea.user.email} - {new Date(idea.createdAt).toLocaleString()}
						</div>
					</li>
				))}
			</div>
		</div>
	);
}
