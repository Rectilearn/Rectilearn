<script lang="ts">
    import type { HTMLFormAttributes } from "svelte/elements";
    import FormErrorMessages from "./errorMessages.svelte";

    export let errorMessages: string[] = [];

    interface $$Props extends HTMLFormAttributes {
        errorMessages?: string[];
    }
</script>

<form {...$$restProps} on:submit|preventDefault>
    <slot />

    <FormErrorMessages {errorMessages} />
</form>

<style></style>
