<script lang="ts">
    import { userData } from "$lib/stores"
	import ColorToggle from "./colorToggle.svelte"; 
	import UserProfileModal from "./userProfileModal.svelte";
	
	let isUserProfileModalOpen = false;
</script>

<UserProfileModal bind:isOpen={isUserProfileModalOpen} />

<header>
	<a class="nav-title" href="/">Rectilearn</a>

	<div class="ml-auto">
		<div class="flex gap-4 md:gap-9 font-semibold">
			<ColorToggle />
			<div class="flex justify-center items-center">
				<button class="flex gap-2 justify-center items-center" on:click={() => isUserProfileModalOpen = true}>
					<img class="size-8 object-cover" src="https://rectilearn.vercel.app/avatars/avatar_b.png" alt="avatar b">
					<div class="flex flex-col text-left">
						<p class="text-xs font-normal">{$userData?.name ?? 'Loading...'}</p>
						<p class="text-xs text-[#4A5568] font-normal">{$userData?.role ?? 'Loading...'}</p>
					</div>
					<div>
						<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"></polyline></svg>
					</div>
				</button>
			</div>
		</div>
	</div>
</header>

<style lang="scss">
	header {
		@apply flex items-center z-[10000] dark:shadow-neutral-800 
               shadow-sm px-8 h-[var(--navbar-height)] max-h-[var(--navbar-height)]
			   bg-white dark:bg-[#171923];
	}

	.nav-title {
		@apply font-pacifico text-xl;
	}
</style>