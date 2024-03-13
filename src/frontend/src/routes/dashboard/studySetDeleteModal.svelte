<script lang="ts">
	import Button from "$lib/components/button.svelte";
	import { Modal, ModalActions } from "$lib/components/modals";
	import { studySets } from "$lib/stores";
	import type { IStudySet } from "$lib/types";

	export let isOpen: boolean;
	export let studySet: IStudySet | undefined;

	async function deleteStudySet() {
		if (!studySet) return;

		const response = await fetch(`/api/studysets/${studySet.id}/delete_study_set/`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" }
		});

		if (response.ok) {
			isOpen = false;
			studySets.update((sets) => {
				if (!sets) return;
				return sets.filter((i) => i.id !== studySet!.id);
			});
		}
	}
</script>

<Modal bind:isOpen>
	Are you sure you want to delete studyset {studySet?.subject}

	<ModalActions>
		<Button on:click={() => (isOpen = false)}>Cancel</Button>
		<Button on:click={deleteStudySet}>Delete</Button>
	</ModalActions>
</Modal>
