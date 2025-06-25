import { apiPath } from "@/lib/api";
import IdeaPageClient from "./page.client";

type IdeaPageProps = { params: Promise<{ id: string }> };

export default async function IdeaPage(context: IdeaPageProps) {
	const { id } = await context.params;

	const res = await fetch(apiPath(`/ideas/${id}`), { cache: "no-store" });
	if (!res.ok) return null;
	const idea = await res.json();

	if (!idea) {
		return <p>Idea not found.</p>;
	}

	return (
		<div className="bg-white shadow-sm mx-auto p-6 border rounded-xl max-w-2xl">
			<IdeaPageClient idea={idea} />
		</div>
	);
}
