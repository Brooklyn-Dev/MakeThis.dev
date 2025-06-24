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
	const { title, description } = await req.json();

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
		data: { title, description },
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
