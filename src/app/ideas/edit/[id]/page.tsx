import { apiPath } from "@/lib/api";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import IdeaFormClient from "../../IdeaFormClient";
import { signIn } from "next-auth/react";

type EditIdeaPageProps = { params: Promise<{ id: string }> };

export default async function EditIdeaPage(context: EditIdeaPageProps) {
	const session = await getServerSession(authOptions);
	if (!session) {
		signIn(undefined, { callbackUrl: window.location.href });
		return;
	}

	const { id } = await context.params;

	const idea = await prisma.projectIdea.findUnique({
		where: { id },
	});

	if (!idea || idea.userEmail !== session.user.email) {
		redirect(apiPath("/auth/ideas"));
	}

	return (
		<div className="mx-auto p-6 max-w-3xl">
			<h1 className="mb-4 font-bold text-2xl">Edit Project Idea</h1>
			<IdeaFormClient
				initialTitle={idea.title}
				initialDescription={idea.description}
				ideaId={idea.id}
				isEditing
			/>
		</div>
	);
}
