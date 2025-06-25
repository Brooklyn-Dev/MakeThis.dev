import Image from "next/image";

type UserAvatarProps = {
	user: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
};

export default function UserAvatar({ user }: UserAvatarProps) {
	const initial = user.name?.[0] || (user.email?.[0] ?? "?");

	return user.image ? (
		<div className="relative w-12 h-12">
			<Image
				src={user.image}
				alt={user.name || user.email || "User avatar"}
				fill
				className="rounded-full object-cover"
			/>
		</div>
	) : (
		<div className="flex justify-center items-center bg-gray-300 rounded-full w-12 h-12 text-white text-xl">
			{initial.toUpperCase()}
		</div>
	);
}
