<script lang="ts">
	import '../styles/main.scss';

	import NavBar from './navbar.svelte';
	import type { LayoutData } from './$types';
	import ProgressBar from './routeProgressBar.svelte';
	import { fetchUserData } from '$lib/api';
	import { userData } from '$lib/stores';
	import { browser } from '$app/environment';

	export let data: LayoutData;

	$: {
		if (!browser) {
			break $;
		}

		if (data.isLoggedIn && !$userData) {
			fetchUserData();
		}
	}
</script>

<ProgressBar />

<NavBar bind:isLoggedIn={data.isLoggedIn} />

<main class="h-[calc(100vh_-_var(--navbar-height))]">
	<slot />
</main>
