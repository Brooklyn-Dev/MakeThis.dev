const API_VERSION = "v1";

export function apiPath(path: string) {
	return `/api/${API_VERSION}${path}`;
}
