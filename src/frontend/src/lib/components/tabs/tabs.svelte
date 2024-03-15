<script lang="ts">
	import { setContext } from "svelte";
	import { writable } from "svelte/store";

    export let tabIndex = 0;

    setContext("tab_ctx", writable({
        index: tabIndex,
        tabButtons: 0,
        tabSections: 0,
    }))
</script>

<div class="tabs">
    <slot />
</div>

<style lang="postcss">
    .tabs {
        @apply flex flex-col items-center justify-center;
    }
</style>