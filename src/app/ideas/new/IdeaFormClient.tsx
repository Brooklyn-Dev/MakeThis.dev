"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function IdeaFormClient() {
	const router = useRouter();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (isLoading) return;

		if (title.trim().length < 5) {
			toast.error("Title must be at least 5 characters.");
			return;
		}

		if (description.trim().length < 10) {
			toast.error("Description must be at least 10 characters.");
			return;
		}

		setIsLoading(true);

		const res = await fetch("/api/ideas", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ title, description }),
		});

		if (res.ok) {
			router.push("/ideas");
			toast.success("Idea submitted!");
		} else {
			toast.error("Failed to submit idea.");
		}

		setIsLoading(false);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<fieldset disabled={isLoading} className="space-y-4">
				<div>
					<label className="block font-medium">Title</label>
					<Input value={title} onChange={(e) => setTitle(e.target.value)} required />
				</div>
				<div>
					<label className="block font-medium">Description</label>
					<Textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} required />
				</div>
				<Button type="submit" disabled={isLoading}>
					{isLoading ? "Submitting..." : "Submit Idea"}
				</Button>
			</fieldset>
		</form>
	);
}
