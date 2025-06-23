"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButton() {
	const { data: session } = useSession();

	if (session?.user) {
		return (
			<div className="flex gap-2 items-center">
				<p>Signed in as {session.user.name}</p>
				<button onClick={() => signOut()} className="text-blue-500">
					Sign Out
				</button>
			</div>
		);
	}

	return (
		<button onClick={() => signIn("github")} className="text-blue-500">
			Sign In with Github
		</button>
	);
}
