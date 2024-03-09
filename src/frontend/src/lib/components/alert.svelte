<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";

    interface $$Props extends HTMLAttributes<any> {
        inTransition?: Function;
        outTransition?: Function;
        applyTransitionBothSides?: boolean;
    }

    const emptyFunc = (...args: any[]) => undefined;

    export let inTransition: Function = emptyFunc;
    export let outTransition: Function = emptyFunc;
    export let applyTransitionBothSides: boolean = false;

    $: {
        if (applyTransitionBothSides) {
            if (inTransition !== emptyFunc && outTransition !== emptyFunc) {
                break $;
            } else if (inTransition === emptyFunc) {
                inTransition === outTransition;
            } else if (outTransition === emptyFunc) {
                outTransition = inTransition;
            }
        }
    }
</script>

<div
    in:inTransition|global
    out:outTransition|global
    {...$$restProps}
    class="alert {$$restProps.class ?? ''}"
>
    <slot />
</div>

<style lang="scss">
    .alert {
        @apply flex gap-4 text-lg p-4 items-center rounded-md;

        &.alert-error {
            @apply bg-red-500;
        }
    }
</style>
