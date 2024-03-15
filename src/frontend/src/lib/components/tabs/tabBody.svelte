<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	type $$Props = HTMLAttributes<HTMLDivElement>;
</script>

<div class="flex flex-row items-center justify-center {$$restProps.class || ''}" {...$$restProps}>
	<slot />
</div>
