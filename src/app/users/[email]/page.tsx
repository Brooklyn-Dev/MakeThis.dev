import ProjectIdeaCard from "@/components/ProjectIdeaCard";
import UserAvatar from "@/components/UserAvatar";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

type UserProfilePageProps = { params: Promise<{ email: string }> };

export default async function UserProfilePage(context: UserProfilePageProps) {
	const { email: profileEmail } = await context.params;

	const profileUser = await prisma.user.findUnique({
		where: { email: decodeURIComponent(profileEmail) },
		include: {
			ideas: {
				orderBy: { createdAt: "desc" },
				include: {
					user: true,
					_count: { select: { upvotes: true } },
				},
			},
		},
	});

	if (!profileUser) {
		return <div>User not found.</div>;
	}

	const session = await getServerSession(authOptions);

	const viewerEmail = session?.user.email;

	const ideasIds = profileUser?.ideas.map((idea) => idea.id);

	const viewerUpvotes = viewerEmail
		? await prisma.upvote.findMany({
				where: {
					userEmail: viewerEmail,
					ideaId: { in: ideasIds },
				},
		  })
		: [];

	const upvotedIds = new Set(viewerUpvotes.map((u) => u.ideaId));

	const ideas = profileUser?.ideas.map((idea) => ({
		...idea,
		createdAt: idea.createdAt.toISOString(),
		problemStatement: idea.problemStatement ?? "",
		targetAudience: idea.targetAudience ?? "",
		keyChallenges: idea.keyChallenges ?? "",
		upvoteCount: idea._count.upvotes,
		hasUpvoted: upvotedIds.has(idea.id),
	}));

	return (
		<div className="mx-auto mt-8 max-w-2xl">
			<div className="flex flex-row gap-4 mb-6">
				<UserAvatar user={profileUser} />

				<div>
					<h1 className="font-bold text-2xl">{profileUser.name || profileUser.email}&apos;s Profile</h1>
					<p className="text-gray-500 text-sm">
						{profileUser.ideas.length} project idea{profileUser.ideas.length === 1 ? "" : "s"} shared
					</p>
				</div>
			</div>

			<div>
				<h2 className="mb-4 font-bold text-xl">Project Ideas:</h2>

				{ideas.length === 0 ? (
					<p>No project ideas yet.</p>
				) : (
					<ul className="space-y-4">
						{ideas.map((idea) => (
							<ProjectIdeaCard key={idea.id} idea={idea} />
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
