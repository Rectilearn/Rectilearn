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
		// alert("Submit");
		errorMessages = [];

		if (subject.length < 2) {
			errorMessages = ["Subject must be at least 2 characters long", ...errorMessages];
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
				studysets = [...studysets, newStudySet];

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

	let tabIndex = 0;

	let reverseQNA = false;

	let textAreaVal = "";

	function onImport() {
		const values = textAreaVal.split("\n");
		const importedQuestions = values
			.map((v) => {
				const [question, answer] = reverseQNA ? v.split("\t").reverse() : v.split("\t"); // v.split("\t") or v.split("    ")
				return { question, answers: [answer] };
			})
			.filter((i) => i.question.trim());
		// setQuestions(importedQuestions);
		questions = importedQuestions;
		// setTabIndex(2);
		tabIndex = 2;
		// toast({
		//     title: "Now, add a subject! It has to be at least 2 letters long."
		// });
	}
</script>

<Modal bind:isOpen>
	<Form bind:errorMessages on:submit={createStudySet}>
		<header class="flex justify-center items-center text-2xl mb-6">Create studyset</header>

		<section class="w-full">
			<ul class="flex mb-6 w-full">
				<li class="w-full">
					<button
						type="button"
						class="w-full h-full p-2 focus-border"
						on:click={() => (tabIndex = 0)}>Start</button
					>
				</li>
				<li class="w-full">
					<button
						type="button"
						class="w-full h-full p-2 focus-border"
						on:click={() => (tabIndex = 1)}>Import</button
					>
				</li>
				<li class="w-full">
					<button
						type="button"
						class="w-full h-full p-2 focus-border"
						on:click={() => (tabIndex = 2)}>Create</button
					>
				</li>
			</ul>
			{#if tabIndex === 0}
				<div>
					<button
						type="button"
						class="w-full bg-[#3182ce] mb-2 text-white py-2 rounded-md font-medium"
						on:click={() => (tabIndex = 1)}>Import set from quizlet</button
					>
					<button
						type="button"
						class="w-full bg-[#3182ce] text-white py-2 rounded-md font-medium"
						on:click={() => (tabIndex = 2)}>Create a set yourself</button
					>
				</div>
			{:else if tabIndex === 1}
				<div>
					<p>Import from Quizlet</p>
					<p>(Note: please choose the default settings)</p>
					<img src="/site/how2export.png" class="w-full" alt="how2export" />

					<label for="chk">Reverse Question and Answer</label>
					<input type="checkbox" id="chk" bind:checked={reverseQNA} />

					<textarea placeholder="exported study set" bind:value={textAreaVal} />

					<button class="mt-2 w-full bg-blue-500" on:click={onImport}>Import</button>
				</div>
			{:else}
				<div>
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
									type="button"
									on:click={() =>
										(questions[questionIdx].answers = [...questions[questionIdx].answers, ""])}
									>Add answer</button
								>
							</div>
						{/each}
					</div>

					<button
						class="mt-4"
						type="button"
						on:click={() => (questions = [...questions, { question: "", answers: [""] }])}
						>Add question</button
					>

					<button type="submit">Submit</button>
				</div>
			{/if}
		</section>
		<!-- <Tabs bind:index on:change={(i) => (index = i)}>

		</Tabs> -->
	</Form>
</Modal>

<style lang="scss">
	.focus-border:focus {
		@apply border-2 border-solid rounded-ss-md rounded-se-md border-blue-500;
	}
</style>
