<script lang="ts">
	import { fetchApi } from "$lib/api";
	import { Form, TextField } from "$lib/components/forms";
	import { Modal } from "$lib/components/modals";
	import { studySets } from "$lib/stores";

	export let isOpen: boolean;
	let errorMessages: string[] = [];

	let subject = "";
	let isPublic = false;

	let questions: { question: string; answers: string[] }[] = [{ question: "", answers: [""] }];

	async function createStudySet() {
        errorMessages = []

        if (subject.length < 2) {
            errorMessages = ["Subject must be at least 2 characters long", ...errorMessages]
        }

		for (const question of questions) {
			if (!question.question) {
				errorMessages = ["A question cannot be empty", ...errorMessages];
				return;
			}

			for (const answer in question.answers) {
				if (!answer) {
					errorMessages = ["A question cannot be empty", ...errorMessages];
					return;
				}
			}
		}

		const response = await fetchApi("studysets/new/", {
			method: "POST",
			body: JSON.stringify({
				subject: subject,
				questions: questions,
				is_public: isPublic
			})
		});

		if (response.ok) {
			const newStudySet = await response.json();
			studySets.update((studysets) => {
				if (!studysets) return;
				studysets = [newStudySet, ...studysets];

				return studysets;
			});

			errorMessages = [];
			isOpen = false;

            // clear the input values
			subject = "";
			questions = [{ question: "", answers: [""] }];
		} else {
			errorMessages = [(await response.json())["detail"], ...errorMessages];
		}
	}
</script>

<Modal bind:isOpen>
	<Form bind:errorMessages on:submit={createStudySet}>
		<label for="subject">Subject</label>
		<TextField id="subject" bind:value={subject} />

		<div>
			{#each questions as question, questionIdx}
				<div class="max-w-md">
					<label for="question-{questionIdx}">Question {questionIdx + 1}</label>
					<TextField bind:value={question.question} id="question-{questionIdx}" />

					{#each question.answers as answer, answerIdx}
						<label for="question-{questionIdx}-answer-{answerIdx}"
							>Answer {answerIdx + 1} for question {questionIdx + 1}</label
						>
						<TextField id="question-{questionIdx}-answer-{answerIdx}" bind:value={answer} />
					{/each}
					<button
						class="block"
						on:click={() =>
							(questions[questionIdx].answers = [...questions[questionIdx].answers, ""])}
						>Add answer</button
					>
				</div>
			{/each}
		</div>

		<button
			class="mt-4"
			on:click={() => (questions = [...questions, { question: "", answers: [""] }])}
			>Add question</button
		>

		<button type="submit">Submit</button>
	</Form>
</Modal>
