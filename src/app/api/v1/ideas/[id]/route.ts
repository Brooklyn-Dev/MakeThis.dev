import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
	const { id } = await context.params;

	const session = await getServerSession(authOptions);
	const email = session?.user.email ?? null;

	try {
		const idea = await prisma.projectIdea.findUnique({
			where: { id },
			include: {
				user: true,
				_count: { select: { upvotes: true } },
				...(email && {
					upvotes: {
						where: { userEmail: email },
					},
				}),
			},
		});

		if (!idea) {
			return NextResponse.json({ message: "Idea not found " }, { status: 404 });
		}

		return NextResponse.json({
			...idea,
			upvoteCount: idea._count.upvotes,
			hasUpvoted: idea.upvotes?.length > 0,
		});
	} catch (err) {
		console.error("Error fetching idea:", err);
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
	const session = await getServerSession(authOptions);
	if (!session?.user.email) {
		return new NextResponse("Not Authenticated", { status: 401 });
	}

	const { id } = await context.params;
	const { title, description, problemStatement, targetAudience, keyChallenges } = await req.json();

	if (!title || title.trim().length < 5) {
		return NextResponse.json({ error: "Title must be at least 5 characters." }, { status: 400 });
	}

	if (!description || description.trim().length < 10) {
		return NextResponse.json({ error: "Description must be at least 10 characters." }, { status: 400 });
	}

	const idea = await prisma.projectIdea.findUnique({ where: { id } });
	if (!idea || idea.userEmail !== session.user.email) {
		return new NextResponse("Not found or forbidden", { status: 403 });
	}

	const updatedIdea = await prisma.projectIdea.update({
		where: { id },
		data: {
			title,
			description,
			problemStatement: problemStatement ?? "",
			targetAudience: targetAudience ?? "",
			keyChallenges: keyChallenges ?? "",
		},
	});

	return NextResponse.json(updatedIdea);
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
	const session = await getServerSession(authOptions);
	if (!session?.user.email) {
		return new NextResponse("Not Authenticated", { status: 401 });
	}

	const { id } = await context.params;

	const idea = await prisma.projectIdea.findUnique({ where: { id } });
	if (!idea || idea.userEmail !== session.user.email) {
		return new NextResponse("Not found or forbidden", { status: 403 });
	}

	await prisma.projectIdea.delete({
		where: { id },
	});

	return new NextResponse("Deleted", { status: 200 });
}
