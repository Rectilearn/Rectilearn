<script lang="ts">
	import { userData } from '$lib/stores';

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
</script>

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

<style lang="scss">
	.stats-grid {
		@apply grid gap-1 w-full my-4 px-2;
		grid-template-columns: 1fr 1fr 1fr 1fr;
	}

	.stats-card {
		@apply flex flex-col items-center justify-center
               border border-sky-950 bg-slate-900 rounded-lg h-52;
		&#visit-streak {
			grid-column: 1;
		}
		&#personal-high-score {
			@apply items-start justify-start p-8;
			grid-column: 2 / 4;
		}
		&#rank {
			@apply font-semibold;
			grid-column: 4;

			.rank-number {
				@apply aspect-square border-[1px] flex items-center text-4xl
                       justify-center border-sky-600 rounded-lg p-4;
			}
		}
	}
</style>
