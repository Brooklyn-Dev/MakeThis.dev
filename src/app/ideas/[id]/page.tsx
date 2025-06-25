import { apiPath } from "@/lib/api";
import IdeaPageClient from "./page.client";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

type IdeaPageProps = { params: Promise<{ id: string }> };

export default async function IdeaPage(context: IdeaPageProps) {
	const { id } = await context.params;

	const requestHeaders = new Headers(await headers());
	const cookies = requestHeaders.get("cookie");

	const res = await fetch(apiPath(`/ideas/${id}`), { cache: "no-store", headers: { Cookie: cookies || "" } });
	const idea = await res.json();

	if (!res.ok) {
		return notFound();
	}

	return (
		<div className="bg-white shadow-sm mx-auto p-6 border rounded-xl max-w-2xl">
			<IdeaPageClient idea={idea} />
		</div>
	);
}
