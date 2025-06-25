import ProjectIdeaCard from "@/components/ProjectIdeaCard";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

type UserProfilePageProps = { params: Promise<{ email: string }> };

export default async function UserProfilePage(context: UserProfilePageProps) {
  const { email } = await context.params;

  const user = await prisma.user.findUnique({
    where: { email: decodeURIComponent(email) },
    include: {
      ideas: {
        orderBy: { createdAt: "desc" },
        include: {
          user: true,
          _count: { select: { upvotes: true } },
          upvotes: email
            ? {
                where: { userEmail: email },
              }
            : false,
        },
      },
    },
  });

  if (!user) {
    return <div>User not found.</div>;
  }

  const ideas = user.ideas.map((idea) => ({
    ...idea,
    createdAt: idea.createdAt.toISOString(),
    upvoteCount: idea._count.upvotes,
    hasUpvoted: idea.upvotes.length > 0,
  }));

  const initial = user.name?.[0] || user.email[0];

  return (
    <div className="mx-auto mt-8 max-w-2xl">
      <div className="flex flex-row gap-4 mb-6">
        {user.image ? (
          <div className="relative w-12 h-12">
            <Image
              src={user.image}
              alt={user.name || user.email}
              fill
              className="rounded-full object-cover"
            />
          </div>
        ) : (
          <div className="flex justify-center items-center bg-gray-300 rounded-full w-12 h-12 text-white text-xl">
            {initial.toUpperCase()}
          </div>
        )}

        <div>
          <h1 className="font-bold text-2xl">{user.name || user.email}&apos;s Profile</h1>
          <p className="text-gray-500 text-sm">{user.ideas.length} project ideas shared</p>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-bold text-xl">Project Ideas:</h2>

        {ideas.length === 0 ? (
          <p>No project ideas yet.</p>
        ) : (
          <ul className="space-y-4">
            {ideas.map((idea) => (
              <ProjectIdeaCard key={idea.id} idea={idea} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
