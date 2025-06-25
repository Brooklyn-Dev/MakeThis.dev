import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import IdeaFormClient from "../IdeaFormClient";
import { signIn } from "next-auth/react";

export default async function NewIdeaPage() {
	const session = await getServerSession(authOptions);
	if (!session) {
		signIn(undefined, { callbackUrl: window.location.href });
		return;
	}

	return (
		<div className="mx-auto p-6 max-w-2xl">
			<h1 className="mb-4 font-bold text-2xl">Submit a New Idea</h1>
			<IdeaFormClient />
		</div>
	);
}
