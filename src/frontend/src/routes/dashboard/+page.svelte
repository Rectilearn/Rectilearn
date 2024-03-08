<script lang="ts">
	import { onMount } from "svelte";
	import { fetchApi } from '$lib/api';
	import { userData, studySets } from '$lib/stores';
	import StudySetCard from "./studysetCard.svelte";
	import { page } from "$app/stores";

	let selected = $page.url.hash || "";

	$: {
		selected = $page.url.hash || "";
		if (!["#", "#games", "#explore"].includes(selected)) {
			selected = "";
		}
		console.log("s");
	}

	function getHighScoreAndGame(obj: any) {
		return Object.entries(obj || {}).sort((a, b) => {
			if (a[1] === b[1]) {
				return 0;
			} else {
				return (a[1] as number) < (b[1] as number) ? -1 : 1;
			}
		})[0];
	}

	$: highScore = getHighScoreAndGame($userData?.high_scores || {}) as [string, number];

	onMount(async () => {
		if ($studySets === undefined) {
			const response = await fetchApi("studysets/");

			if (response.ok) {
				// @ts-ignore
				const data = JSON.parse(await response.text(), (_key, value, data) => typeof value === 'number' ? BigInt(data.source) : value);
				console.log("Data", data);
				studySets.set(data);
			}
		}
	})
	
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

{#if selected === ""}
<div class="stats-grid">
	<div class="stats-card" id="visit-streak">
		<div class="flex items-center justify-center rounded-full border-[10px] border-sky-600 size-24">
			<span class="text-4xl font-bold">{$userData?.visit_streak}</span>
		</div>
		<h1 class="font-semibold text-xl mt-4">Login Streak</h1>
	</div>
	<div class="stats-card" id="personal-high-score">
		<span class="font-semibold text-lg">Highscore</span>
		{#if highScore}
			<div class="flex items-center flex-col w-full h-full justify-around">
				<span class="font-bold text-5xl">{highScore[1].toString().padStart(4, '0')}</span>
				<span class="capitalize text-4xl font-semibold">{highScore[0].split('_')[0]}</span>
			</div>
		{/if}
	</div>
	<div class="stats-card" id="rank">
		<span class="rank-number">4</span>
		<span class="mt-4 text-3xl">Rank</span>
	</div>
</div>

<h1 class="font-semibold text-4xl ml-2 mt-4">Your studysets</h1>

<section class="studyset-card-grid mb-4">
	{#each ($studySets || []) as studySet (studySet.id)}
		<StudySetCard {studySet}
			on:delete={(e) => {
				studySets.update((set) => {
					if (!set) return;
					return set.filter((i) => i.id !== e.detail);
				});
			}} />
	{/each}
	<div class="flex justify-center items-center">
		<div class="flex flex-col justify-between max-w-[320px] w-full bg-white dark:bg-gray-700 shadow-2xl rounded-xl p-4 text-center h-full min-h-[22em] md:min-h-[26em]">
			<p class="h-full md:text-[1.5em] flex items-center justify-center">Create new studyset</p>
			<button class="flex justify-center items-center w-full aspect-square rounded-xl text-[12em] font-thin bg-gray-200 dark:bg-gray-800">+</button>
		</div>
	</div>
</section>
{:else if selected === "#games"}
<section>
	you got no games
</section>
{:else if selected === "#explore"}
<section>
	explore the world
</section>
{/if}

<style lang="scss">
	.stats-grid {
		@apply grid gap-1 w-full my-4 px-2;
		grid-template-rows: 1fr 1fr 1fr;
		grid-template-columns: auto;
	}

	.stats-card {
		@apply flex flex-col items-center justify-center
               border border-sky-200 dark:border-sky-950 bg-slate-50 dark:bg-slate-900 rounded-lg h-52;
		&#visit-streak {
			grid-column: 1;
			grid-row: 1;
		}
		&#personal-high-score {
			@apply items-start justify-start p-8;
			grid-column: 1;
			grid-row: 2;
		}
		&#rank {
			@apply font-semibold;
			grid-column: 1;
			grid-row: 3;

			.rank-number {
				@apply aspect-square border-[1px] flex items-center text-4xl
                       justify-center border-sky-600 rounded-lg p-4;
			}
		}
	}

	@media screen and (min-width: theme("screens.sm")) {
		.stats-grid {
			grid-template-rows: auto;
			grid-template-columns: 1fr 1fr 1fr 1fr;
		}


		.stats-card {
			&#visit-streak {
				grid-column: 1;
				grid-row: 1;
			}

			&#personal-high-score {
				grid-column: 2 / 4;
				grid-row: 1;
			}

			&#rank {
				grid-column: 4;
				grid-row: 1;
			}
		}
	}
	
	.studyset-card-grid {
		@apply grid gap-3 gap-y-4 pt-4 pr-4 h-full ml-4;
        max-width: 100%; /* DON'T TOUCH THIS!, WITHOUT THIS THE auto-fit DOESN'T WORK FOR SOME REASON */
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		// grid-template-rows: repeat(auto-fit, minmax(500px, 1fr));
		height: auto;
	}
	
    @media screen and (min-width: theme("screens.sm")) {
		.studyset-card-grid {
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
			// grid-template-rows: repeat(auto-fit, minmax(500px, 1fr));
		}
	}
</style>
