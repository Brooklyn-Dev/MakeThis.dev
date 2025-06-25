import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
	return (
		<div className="flex flex-col justify-center items-center p-4 min-h-[calc(100vh-64px-50px)] text-center">
			<h1 className="mb-6 font-extrabold text-gray-900 text-5xl md:text-6xl leading-tight animate-fade-in-up">
				Discover &amp; Share <br className="hidden md:block" />{" "}
				<span className="text-blue-600">Impactful Project Ideas</span>
			</h1>
			<p className="mb-8 max-w-2xl text-gray-700 text-xl animate-fade-in delay-200">
				Find unique, real-world problems to solve with code. Stop building generic apps. Start creating
				solutions that matter.
			</p>
			<div className="flex sm:flex-row flex-col gap-4 mb-20 animate-fade-in delay-400">
				<Button asChild size="lg" className="px-8 py-3 text-lg">
					<Link href="/ideas">Browse Ideas</Link>
				</Button>
				<Button asChild size="lg" variant="outline" className="px-8 py-3 text-lg">
					<Link href="/ideas/new">Submit Your Ideas</Link>
				</Button>
			</div>
		</div>
	);
}
