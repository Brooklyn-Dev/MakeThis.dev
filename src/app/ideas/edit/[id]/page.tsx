import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import IdeaFormClient from "../../IdeaFormClient";

type EditIdeaPageProps = { params: Promise<{ id: string }> };

export default async function EditIdeaPage(context: EditIdeaPageProps) {
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect("/api/auth/signin");
	}

	const { id } = await context.params;

	const idea = await prisma.projectIdea.findUnique({
		where: { id },
	});

	if (!idea || idea.userEmail !== session.user.email) {
		redirect("api/auth/ideas");
	}

	return (
		<div className="mx-auto p-6 max-w-3xl">
			<h1 className="mb-4 font-bold text-2xl">Edit Project Idea</h1>
			<IdeaFormClient
				initialTitle={idea.title}
				initialDescription={idea.description}
				initialProblemStatement={idea.problemStatement ?? undefined}
				initialTargetAudience={idea.targetAudience ?? undefined}
				initialKeyChallenges={idea.keyChallenges ?? undefined}
				ideaId={idea.id}
				isEditing
			/>
		</div>
	);
}
