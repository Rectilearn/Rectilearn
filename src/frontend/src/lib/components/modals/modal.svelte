<script lang="ts">
    export let isOpen: boolean = false;
    export const closeOnOutsideClick = true;
    let dialog: HTMLDialogElement | undefined;
    let dialogContent: HTMLDivElement | undefined;

    function handleClick(event: MouseEvent) {
        // First check that the dialog content does not contain the click
        if (!dialogContent?.contains(event.target as HTMLElement)) {
            // Then check if the dialog is open AND if closeOnOutsideClick is true
            if (isOpen && closeOnOutsideClick) {
                // Then check if the dialog overlay was clicked
                /* We need this extra statement because without this
			 it'll also close button that was supposed to open the dialog in the first place */
                if (dialog?.contains(event.target as HTMLElement)) {
                    isOpen = false;
                }
            }
        }
    }
    function closeDialog() {
        const closeAnimation = dialog?.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 200
        });
        closeAnimation?.addEventListener("finish", () => dialog?.close());
        closeAnimation?.addEventListener("cancel", () => dialog?.close());
    }

    $: {
        if (isOpen) {
            dialog?.showModal();
        } else {
            closeDialog();
        }
    }
</script>

<svelte:window on:click={handleClick} />

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
    bind:this={dialog}
    class:open={isOpen}
    on:close|preventDefault={() => (isOpen = false)}
    on:keydown={(event) => {
        if (event.code === "Escape") {
            event.preventDefault();
            isOpen = false;
        }
    }}
>
    <!-- Have an inner div so outside clicks can be detected -->
    <div bind:this={dialogContent} class="content">
        <slot />
    </div>
</dialog>

<style lang="scss">
    dialog {
        @apply opacity-0 rounded-lg -translate-y-3 bg-white dark:bg-[#2D3748] text-black dark:text-white
			   transition-all duration-200 min-w-[35%] select-none max-h-full max-w-full;
    }
    dialog.open {
        @apply opacity-100 translate-y-0 scale-100;
    }
    dialog::backdrop {
        @apply opacity-0 transition-opacity duration-200
		     bg-neutral-900; /* The actual color of the backdrop */
    }
    .content {
        @apply flex flex-col gap-2 h-full w-full min-h-[23dvh] px-7 py-5;
    }
    dialog.open::backdrop {
        @apply opacity-60;
    }
</style>
