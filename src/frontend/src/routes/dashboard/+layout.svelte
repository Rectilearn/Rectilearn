<script lang="ts">
	import SideBar from './sidebar.svelte';
</script>

<div class="flex h-[100%]">
	<SideBar />

	<div class="w-full h-full">
		<slot />
	</div>
</div>
