<script>
	// @ts-nocheck

	let { store = {}, list = [], selectValue = () => {} } = $props();

	import InputText from './inputText.svelte';

	let showAutoComplete = $state(false);
	function focusContainer(e) {
	}

	function componentHandlers(eventDetails) {
		statesList = states.filter((x) => {
			return x.toLowerCase().includes(eventDetails.value.toLowerCase());
		});
	}
</script>

<div id="parent" class=" relative h-full w-full" onfocus={(e) => focusContainer(e)}>
	<InputText
		id="type"
		name="State"
		bind:store
		optional={false}
		{validate}
		{validatePage}
		bgColor="bg-lightbg"
		{componentHandlers}
		focusHandler={showAutoCompletefn}
	/>
	{#if statesList.length !== 0 && showAutoComplete}
		<div
			id="child"
			class="bg-tertiory-50 absolute top-[60px] z-20 h-fit max-h-40 w-full flex-col overflow-auto rounded-lg"
		>
			{#each statesList as cata, i}
				<button
					id="childButton"
					class=" flex h-fit w-full border border-gray-300 px-5 py-2 {i == 0
						? 'rounded-t-lg text-left'
						: statesList.length - 1 == i
							? 'rounded-b-lg'
							: ''}"
					onclick={() => {
						chooseType(cata);
					}}
				>
					<p class=" font-semibold text-gray-700">
						{cata}
					</p>
				</button>
			{/each}
		</div>
	{/if}
</div>
