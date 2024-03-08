<script lang="ts">
    import {FullScreenModal} from "$lib/components/modals/";
 
    export let isOpen: boolean;
</script>

<FullScreenModal bind:isOpen>
    <h1 class="text-4xl font-semibold">hahahaha</h1>
</FullScreenModal>
