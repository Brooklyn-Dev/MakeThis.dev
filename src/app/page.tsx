import { AuthButton } from "@/components/AuthButton";

export default function Home() {
	return (
		<main className="p-6">
			<h1 className="text-xl font-bold">Welcome to MakeThis.dev</h1>
			<AuthButton />
		</main>
	);
}
