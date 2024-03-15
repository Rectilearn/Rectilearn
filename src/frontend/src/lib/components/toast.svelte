<script lang="ts">
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from "svelte-sonner";

	type $$Props = SonnerProps;

	import { onMount } from "svelte";

	let isDarkMode = false;

	const handleClassChange = () => {
		isDarkMode = document.documentElement.classList.contains("dark");
		console.log(`Dark mode changed to ${isDarkMode ? "on" : "off"}`);
	};

	onMount(() => {
		handleClassChange();

		const observer = new MutationObserver(handleClassChange);
		observer.observe(document.documentElement, { attributes: true });

		return () => {
			observer.disconnect();
		};
	});
</script>

<Sonner
	theme={isDarkMode ? "dark" : "light"}
	class="toaster group"
	position="bottom-center"
	closeButton
	visibleToasts={4}
	toastOptions={{
		classes: {
			toast:
				"group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		}
	}}
	{...$$restProps}
/>
