import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

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
