<script lang="ts">
	import { getContext } from "svelte";
	import type { HTMLButtonAttributes } from "svelte/elements";
	import { type Writable } from "svelte/store";

	let tabCtx = getContext("tab_ctx") as Writable<{
		index: number;
		tabButtons: number;
		tabSections: number;
	}>;

	let btnIndex = $tabCtx!.tabButtons;
	$tabCtx!.tabButtons++;

	type $$Props = HTMLButtonAttributes;
</script>

<button
	{...$$restProps}
	class="tab-button {$$restProps.class || ''}"
	data-state={$tabCtx.index === btnIndex ? "active" : "inactive"}
	on:click={() => ($tabCtx.index = btnIndex)}><slot /></button
>

<style lang="postcss">
	.tab-button {
		@apply inline-flex items-center justify-center whitespace-nowrap
			rounded-md px-3 py-1 text-sm font-medium 
			transition-all focus-visible:outline-none focus-visible:ring-2
			focus-visible:ring-offset-2 disabled:pointer-events-none
			disabled:opacity-50 data-[state=active]:bg-sky-700 data-[state=active]:text-gray-50
			data-[state=active]:shadow;
	}
</style>
