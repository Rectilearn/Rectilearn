import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const urlEndpoint = event.url.pathname.slice();
    const authEndpoints = ["/auth/", "/auth/login", "/auth/signup", "/"];

    const isLoggedIn = !!event.cookies.get("Authorization"); // Check if the sessionid cookie exists
    console.log(urlEndpoint)
    if (isLoggedIn) {
        // If the user is logged in and he visits the authentication pages
        if (authEndpoints.includes(urlEndpoint)) {
            // redirect the user to the dashboard
            event.url = new URL(event.url.origin + '/dashboard');
            return Response.redirect(event.url);
        }
    } else {
        // If the user is not logged in and visits any other pages than the auth pages
        if (!authEndpoints.includes(urlEndpoint)) {
            // redirect him to the welcome page
            event.url = new URL(`${event.url.origin}/?from=${event.url.pathname}`);

            return Response.redirect(event.url);
        }
    }

    return await resolve(event);
};
