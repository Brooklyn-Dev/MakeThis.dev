"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";

export default function NavBar() {
	const { data: session, status } = useSession();
	const loading = status === "loading";

	const user = session?.user;
	const displayName = user?.name || user?.email?.split("@")[0] || "User";

	return (
		<nav className="bg-white shadow-sm py-4 border-b">
			<div className="flex justify-between items-center mx-auto px-4 container">
				<Link href="/" className="font-bold text-gray-800 text-2xl">
					MakeThis.<span className="text-blue-600">dev</span>
				</Link>

				<div className="flex items-center space-x-6">
					<Link href="/ideas" className="text-gray-700 hover:text-black text-sm">
						Browse Ideas
					</Link>
					<Link href="/ideas/new" className="text-gray-700 hover:text-black text-sm">
						Submit Idea
					</Link>

					{!loading && session?.user ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<div className="flex items-center space-x-2 cursor-pointer">
									<UserAvatar user={session.user} />
									<span className="max-w-[120px] text-gray-700 text-sm truncate">{displayName}</span>
								</div>
							</DropdownMenuTrigger>

							<DropdownMenuContent align="end">
								<DropdownMenuItem asChild>
									<Link href={`/users/${session.user.email}`}>My Profile</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button variant="outline" size="sm" onClick={() => signIn()}>
							Sign in
						</Button>
					)}
				</div>
			</div>
		</nav>
	);
}
