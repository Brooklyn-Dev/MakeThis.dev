const API_VERSION = "v1";

export function apiPath(path: string) {
	if (typeof window === "undefined") {
		const baseUrl =
			process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_BASE_URL : "http://localhost:3000";
		return `${baseUrl}/api/${API_VERSION}${path}`;
	}

	return `/api/${API_VERSION}${path}`;
}
