"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewIdeaPage() {
	const router = useRouter();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		const res = await fetch("/api/ideas", {
			method: "POST",
			body: JSON.stringify({ title, description }),
		});

		if (res.ok) {
			router.push("/ideas");
		}
	}

	return (
		<div className="mx-auto p-6 max-w-xl">
			<h1 className="mb-4 font-bold text-2xl">Submit a New Idea</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block font-medium">Title</label>
					<Input value={title} onChange={(e) => setTitle(e.target.value)} required />
				</div>
				<div>
					<label className="block font-medium">Description</label>
					<Textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} required />
				</div>
				<Button type="submit">Submit</Button>
			</form>
		</div>
	);
}
