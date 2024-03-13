<script lang="ts">
	import { page } from '$app/stores';
	import { userData } from '$lib/stores';
	import ColorToggle from './colorToggle.svelte';

	export let isLoggedIn: boolean;

	$: isActuallyLoggedIn = isLoggedIn || !!$userData;

	const links = [
		{
			name: 'Home',
			url: '/',
			authEndpoint: true
		},
		// {
		//   name: 'About',  // about page does not exist currently
		//   url: '/about'
		// },
		{
			name: 'Login',
			url: '/auth/login',
			authEndpoint: true
		},
		{
			name: 'Signup',
			url: '/auth/signup',
			authEndpoint: true
		},
		{
			name: 'Dashboard',
			url: '/dashboard',
			authEndpoint: false
		}
	];

	let display: {
		name: string;
		url: string;
	}[];

	$: {
		display = links.filter((i) => {
			// if (["/auth/login", "/auth/signup"].includes(i.url) /* && ctx.loggedIn */) {
			// 	return false;
			// } else if (i.url === "/dashboard" /* && !ctx.loggedIn */) {
			// 	return false;
			// }
			if (!isActuallyLoggedIn) return i.url !== $page.url.pathname.toLowerCase() && i.authEndpoint;
			// dont show auth endpoints to logged in users
			else return !i.authEndpoint && i.url !== $page.url.pathname.toLowerCase();
		});
	}
</script>

<header>
	<a class="nav-title" href="/">Rectilearn</a>

	<div class="ml-auto">
		<div class="flex gap-4 md:gap-9 font-semibold">
			<ColorToggle />
			{#each display as link}
				<a
					href={link.url}
					class="px-3 py-2 rounded-md font-bold text-gray-600 dark:text-inherit hover:no-underline hover:bg-blue-300 hover:dark:bg-gray-700"
					>{link.name}</a
				>
				<!-- <a href="/auth/signup" class="hover-underline">Signup</a> -->
			{/each}
		</div>
	</div>
</header>

<style lang="scss">
	header {
		@apply flex items-center z-[10000] dark:shadow-neutral-800 
               shadow-sm px-8 h-[var(--navbar-height)] max-h-[var(--navbar-height)]
			   bg-black/[.05] dark:bg-black/[.5];
	}

	.nav-title {
		@apply font-pacifico text-xl;
	}
</style>
