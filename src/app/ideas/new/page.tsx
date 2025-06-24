import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import IdeaFormClient from "./IdeaFormClient";
import { apiPath } from "@/lib/api";

export default async function NewIdeaPage() {
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect(apiPath("/auth/signin?callbackUrl=/ideas/new"));
	}

	return (
		<div className="mx-auto p-6 max-w-2xl">
			<h1 className="mb-4 font-bold text-2xl">Submit a New Idea</h1>
			<IdeaFormClient />
		</div>
	);
}
