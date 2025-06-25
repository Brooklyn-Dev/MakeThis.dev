export type Idea = {
	id: string;
	title: string;
	description: string;
	createdAt: string;
	user: {
		email: string;
		name: string | null;
		image: string | null;
	};
	upvoteCount: number;
	hasUpvoted?: boolean;
};
