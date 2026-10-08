<script>
	// @ts-nocheck
	import { fly } from 'svelte/transition';

	let {
		values = ['Pack', 'Giftbox'],
		selected = values[0],
		change = () => {},
		height = 'h-8',
		width = 'w-40'
	} = $props();
</script>

<div class="bg-secondary-250 flex {height} {width} rounded-full">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="flex h-full {selected == values[0]
			? 'w-3/5'
			: 'w-1/2'} items-center justify-center {selected == values[0]
			? 'bg-tertiory-800 rounded-full'
			: ''} cursor-pointer"
		onclick={() => {
			change(values[0]);
		}}
	>
		{values[0]}
	</div>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="flex h-full {selected == values[1]
			? 'w-3/5'
			: 'w-1/2'} items-center justify-center {selected == values[1]
			? 'bg-tertiory-800 rounded-full'
			: ''} cursor-pointer"
		onclick={() => {
			change(values[1]);
		}}
	>
		{values[1]}
	</div>
</div>
