import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function IdeasPage() {
	return (
		<div className="p-6 max-w-3xl mx-auto">
			<div className="flex items-center justify-between mb-4">
				<h1 className="text-2xl font-bold">Project Ideas</h1>
				<Link href="/ideas/new">
					<Button>New Idea</Button>
				</Link>
			</div>

			<div className="space-y-4">
				<div className="border p-4 rounded-lg">
					<h2 className="font-semibold text-lg">Sample Idea Title</h2>
					<p className="text-sm text-muted-foreground">Build X</p>
					<p className="text-sm text-right mt-2 text-gray-500">By Bob</p>
				</div>
			</div>
		</div>
	);
}
