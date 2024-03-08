<script lang="ts">
	import '../styles/main.scss';

	import NavBar from './navbar.svelte';
	import type { LayoutData } from './$types';
	import ProgressBar from './routeProgressBar.svelte';
	import { fetchUserData } from '$lib/api';
	import { userData } from '$lib/stores';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	export let data: LayoutData;

	$: {
		if (!browser) {
			break $;
		}

		if (data.isLoggedIn && !$userData) {
			fetchUserData();
		}
	}

	// console.log($page.url.pathname);
</script>

<ProgressBar />

{#if !$page.url.pathname.startsWith("/dashboard")}
 <NavBar bind:isLoggedIn={data.isLoggedIn} />
{/if}

<main class="h-full">
	<slot />
</main>
