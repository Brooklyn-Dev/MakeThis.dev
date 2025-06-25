import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
	const session = await getServerSession(authOptions);
	const email = session?.user.email ?? null;

	const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
	const limit = parseInt(req.nextUrl.searchParams.get("limit") || "1", 10);
	const offset = (page - 1) * limit;

	const ideas = await prisma.projectIdea.findMany({
		include: {
			user: true,
			_count: { select: { upvotes: true } },
			upvotes: email
				? {
						where: { userEmail: email },
				  }
				: false,
		},
		orderBy: { createdAt: "desc" },
		skip: offset,
		take: limit,
	});

	const response = ideas.map((idea) => ({
		...idea,
		upvoteCount: idea._count.upvotes,
		hasUpvoted: idea.upvotes?.length > 0,
	}));

	const totalCount = await prisma.projectIdea.count();
	const numPages = Math.ceil(totalCount / limit);

	return NextResponse.json({ response, numPages });
}

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	const { title, description } = await req.json();

	if (!title || title.trim().length < 5) {
		return new NextResponse("Title must be at least 5 characters.", { status: 400 });
	}

	if (!description || description.trim().length < 10) {
		return new NextResponse("Description must be at least 10 characters.", { status: 400 });
	}

	const dbUser = await prisma.user.findUnique({
		where: { email: session.user.email },
	});

	if (!dbUser) {
		return NextResponse.json({ error: "User not found." }, { status: 404 });
	}

	const existing = await prisma.projectIdea.findFirst({
		where: {
			userEmail: dbUser.email,
			title,
		},
	});

	if (existing) {
		return new NextResponse("You've already submitted an idea with the same title.", { status: 400 });
	}

	const idea = await prisma.projectIdea.create({
		data: { title, description, userEmail: dbUser.email },
	});

	return NextResponse.json(idea);
}
