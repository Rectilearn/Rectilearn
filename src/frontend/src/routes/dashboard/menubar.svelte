<script lang="ts">
	export let selected: string;
</script>

<aside class="sidebar">
	<a href="#" class:selected={selected === ""}>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
			><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
				d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z"
			/></svg
		>
		<p class="text-sm">StudySets</p>
	</a>
	<a href="#games" class:selected={selected === "#games"}>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"
			><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
				d="M192 64C86 64 0 150 0 256S86 448 192 448H448c106 0 192-86 192-192s-86-192-192-192H192zM496 168a40 40 0 1 1 0 80 40 40 0 1 1 0-80zM392 304a40 40 0 1 1 80 0 40 40 0 1 1 -80 0zM168 200c0-13.3 10.7-24 24-24s24 10.7 24 24v32h32c13.3 0 24 10.7 24 24s-10.7 24-24 24H216v32c0 13.3-10.7 24-24 24s-24-10.7-24-24V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h32V200z"
			/></svg
		>
		<p class="text-sm">Games</p>
	</a>
	<a href="#explore" class:selected={selected === "#explore"}>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
			><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
				d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm50.7-186.9L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
			/></svg
		>
		<p class="text-sm">Explore</p>
	</a>
</aside>

<style lang="scss">
	.sidebar {
		@apply flex flex-row items-center gap-2 grow-0 dark:border-t dark:border-gray-800
			   overflow-y-auto text-gray-700 dark:text-gray-300
			   bg-white dark:bg-[#171923];

		a {
			@apply flex gap-3 items-center justify-start my-4 mx-10;

			svg {
				@apply size-5 fill-black dark:fill-white;
			}

			h3 {
				@apply text-lg;
			}
		}
	}

	.selected {
		@apply rounded-full bg-blue-500 p-2 text-white;
	}
</style>
