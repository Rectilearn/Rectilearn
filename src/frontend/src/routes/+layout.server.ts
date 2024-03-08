import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = (request) => {
    const sessionId = request.cookies.get("Authorization");

    return {
        isLoggedIn: !!sessionId,
    };
};
