import { getContext } from "svelte";
import type { Writable } from "svelte/store";

export { default as Tabs } from "./tabs.svelte";
export { default as TabHead } from "./tabHead.svelte";
export { default as TabContent } from "./tabContent.svelte";
export { default as TabBody } from "./tabBody.svelte";
export { default as TabButton } from "./tabButton.svelte";


export function setTabIndex(index: number) {
    (getContext("tab_ctx") as Writable<{
		index: number;
		tabButtons: number;
		tabSections: number;
	}>).update((tabCtx) => {
        tabCtx.index = index
        return tabCtx;
    });
}

export function setTabIndexCallback(index: number) {
    return () => setTabIndex(index)
}
