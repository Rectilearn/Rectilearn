<script lang="ts">
	import { getContext } from "svelte";
	import type { Writable } from "svelte/store";

	let ctx = getContext("tab_ctx") as Writable<{
		index: number;
		tabButtons: number;
		tabSections: number;
	}>;

	let sectionIndex = $ctx.tabSections;
	$ctx.tabSections++;
</script>

{#if $ctx.index === sectionIndex}
	<slot />
{/if}
