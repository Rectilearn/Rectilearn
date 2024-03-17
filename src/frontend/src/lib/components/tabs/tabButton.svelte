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
	on:mousedown={() => ($tabCtx.index = btnIndex)}
>
	<div class="rounded-lg">
		<slot />
	</div>
</button>

<style lang="scss">
	.tab-button {
		@apply inline-flex items-center justify-center whitespace-nowrap
			px-3 py-1 text-sm font-medium border border-transparent
			focus-visible:outline-none focus-visible:ring-2
			focus-visible:ring-offset-2 disabled:pointer-events-none
			disabled:opacity-50 mb-[-6px] z-50;

		&:not([data-state="active"]) {
			@apply border-b-transparent;
		}

		&[data-state="active"] {
			@apply border-b-[rgb(45_55_72)] border-t-gray-400 border-x-gray-400;
		}
	}
</style>
