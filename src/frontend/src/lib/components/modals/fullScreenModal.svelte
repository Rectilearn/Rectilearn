<script lang="ts">
    import Modal from "./modal.svelte";

    export let isOpen: boolean;
</script>

<Modal bind:isOpen>
    <div class="full-screen-modal-wrapper">
        <slot />
    </div>
    <button class="fixed right-8 top-8" on:click={() => (isOpen = false)}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            fill="currentColor"
            viewBox="0 0 16 16"
        >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path
                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"
            />
        </svg></button
    >
</Modal>

<style lang="postcss">
    .full-screen-modal-wrapper {
        @apply mt-9 min-h-screen min-w-[100vw] max-h-screen max-w-[100vw] overflow-x-hidden;
    }
</style>
