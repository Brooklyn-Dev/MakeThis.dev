import { apiPath } from "@/lib/api";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import IdeaFormClient from "../../IdeaFormClient";

type Props = { params: { id: string } };

export default async function EditIdeaPage({ params }: Props) {
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect(apiPath("/auth/signin"));
	}

	const { id } = await params;

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
