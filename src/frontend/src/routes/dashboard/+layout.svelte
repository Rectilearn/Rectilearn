<script lang="ts">
	import Navbar from './dashBoardNavbar.svelte';
	import Menubar from './menubar.svelte';
	import { page } from "$app/stores";

	let selected = $page.url.hash || "";

	$: {
		// console.log(selected);
		selected = $page.url.hash;
		if (!["#", "#games", "#explore"].includes(selected)) {
			selected = "";
		}
		console.log(selected);
	}
</script>

<div class="flex flex-col w-full h-full bg-[#EDF2F7] dark:bg-[#1A202C]">
	<!-- <SideBar /> -->
	<Navbar />
	<Menubar {selected} />

	<div class="w-full h-full overflow-y-auto">
		<slot />
	</div>
</div>

<style lang="scss">
</style>
