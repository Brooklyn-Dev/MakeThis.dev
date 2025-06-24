import { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!,
		}),
	],

	callbacks: {
		async signIn({ user }) {
			try {
				await prisma.user.upsert({
					where: { email: user.email! },
					update: {},
					create: {
						email: user.email!,
						name: user.name ?? "",
						image: user.image ?? "",
					},
				});
			} catch (err) {
				console.error("Error upserting user:", err);
				return false;
			}

			return true;
		},

		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.sub!;
			}
			return session;
		},
	},
};
