import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  const dbUser = await prisma.user.upsert({
    where: { email: session.user.email },
    update: {},
    create: {
      email: session.user.email,
      name: session.user.name || "",
      image: session.user.image || "w",
    },
  });

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
