"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiPath } from "@/lib/api";

type IdeaFormClientProps = {
	initialTitle?: string;
	initialDescription?: string;
	ideaId?: string;
	isEditing?: boolean;
};

export default function IdeaFormClient({
	initialTitle = "",
	initialDescription = "",
	ideaId,
	isEditing = false,
}: IdeaFormClientProps) {
	const router = useRouter();
	const [title, setTitle] = useState(initialTitle);
	const [description, setDescription] = useState(initialDescription);
	const [isLoading, setIsLoading] = useState(false);

	const isDirty = title !== initialTitle || description !== initialDescription;

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

		const url = apiPath(isEditing ? `/ideas/${ideaId}` : "/ideas");
		const method = isEditing ? "PATCH" : "POST";

		let success = false;

		try {
			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title, description }),
			});

			if (res.ok) {
				router.push("/ideas");
				toast.success(`Idea ${isEditing ? "updated" : "submitted"}!`);
				success = true;
			} else {
				toast.error(`Failed to ${isEditing ? "update" : "submit"} idea.`);
			}
		} catch (err) {
			console.error("Network or fetch error:", err);
			toast.error("A network error occurred. Please check your connection.");
		} finally {
			if (!success) {
				setIsLoading(false);
			}
		}
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
				<Button type="submit" disabled={isLoading || !isDirty}>
					{isLoading
						? isEditing
							? "Updating..."
							: "Submitting..."
						: isEditing
						? "Update Idea"
						: "Submit Idea"}
				</Button>
			</fieldset>
		</form>
	);
}
