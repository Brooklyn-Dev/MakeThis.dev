import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);

	if (!session?.user?.email) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	const dbUser = await prisma.user.upsert({
		where: { email: session.user.email },
		update: {},
		create: {
			email: session.user.email,
			name: session.user.name || "",
			image: session.user.image || "w",
		},
	});

	const body = await req.json();
	const { title, description } = body;

	const idea = await prisma.projectIdea.create({
		data: { title, description, userId: dbUser.id },
	});

	return NextResponse.json(idea);
}

export async function GET() {
	const ideas = await prisma.projectIdea.findMany({
		orderBy: { createdAt: "desc" },
	});

	return NextResponse.json(ideas);
}
