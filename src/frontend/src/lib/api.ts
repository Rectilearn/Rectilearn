import { userData } from './stores';

export async function fetchApi(endpoint: string, options?: RequestInit): Promise<Response> {
	const defaultOptions = { ...options };

	defaultOptions.headers = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		...defaultOptions.headers
	};

	defaultOptions.credentials = 'include';
	return await fetch('/api/' + endpoint, defaultOptions);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatApiErrors = (data: any): Array<string> => {
	const messages: Array<string> = [];
	for (const [key, value] of Object.entries(data)) {
		messages.push(
			`${key !== 'detail' ? `${key}: ` : ''}${Array.isArray(value) ? value.join(', ') : value}`
		);
	}
	return messages;
};

export async function fetchUserData() {
	const response = await fetchApi('auth/users/me/');

	if (response.ok) {
		// @ts-ignore
		userData.set(JSON.parse(await response.text(), (_key, value, data) => typeof value === 'number' ? BigInt(data.source) : value));
	} else {
		console.error(`Failed to fetch user data ${response.status}: ${response.statusText}`);
	}
}
