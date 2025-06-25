import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
	const session = await getServerSession(authOptions);
	if (!session?.user.email) {
		return new NextResponse("Not Authenticated", { status: 401 });
	}

	const { id } = await context.params;
	const userEmail = session.user.email;

	const existingUpvote = await prisma.upvote.findUnique({
		where: {
			userEmail_ideaId: {
				userEmail,
				ideaId: id,
			},
		},
	});

	if (existingUpvote) {
		await prisma.upvote.delete({
			where: { id: existingUpvote.id },
		});
	} else {
		await prisma.upvote.create({
			data: {
				userEmail,
				ideaId: id,
			},
		});
	}

	const upvoteCount = await prisma.upvote.count({
		where: { ideaId: id },
	});

	return NextResponse.json({ upvoteCount });
}
