export type Idea = {
	id: string;
	title: string;
	description: string;
	problemStatement: string;
	targetAudience?: string;
	keyChallenges?: string;
	createdAt: string;
	user: {
		email: string;
		name: string | null;
		image: string | null;
	};
	upvoteCount: number;
	hasUpvoted?: boolean;
};
