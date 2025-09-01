<script lang="ts">
	// conponents props
	let {
		store = {},
		id = 'drop',
		dropdownFields = [],
		name = 'Drop',
		bgColor = 'bg-white',
		updateDishDetails = () => {},
		readOnly = false,
		refrenceId = undefined,
		arrow = true,
		validatePage = false,
		returnfunction = false
	} = $props();
	// to mark the dropdown container
	let dropdownContainer: { contains: (arg0: any) => any };
	// to show the dropdown
	let showDrop = $state(false);
	// fn is change the state of the showDrop
	function showDropfn() {
		if (!readOnly) {
			showDrop = !showDrop;
		}
	}

	// to make ractivity in this component
	let valueDrop = $state('');
	// select the value in the dropdown
	function selectDetails(value: any) {
		store[id] = value;
		valueDrop = value.category_name || value;
		showDrop = false;
		if (returnfunction) {
			updateDishDetails('form', 'dishUpdate', { key: id, value: value });
		}
	}
	let invalid = $state(false);
	$effect(() => {
		if (!readOnly) {
			if (validatePage) {
				if (valueDrop) {
					invalid = false;
				} else {
					invalid = true;
				}
			}
		}
	});
	// to close the dropdown when click esc and click outsid the dropdown
	function closeByEsc(event: any) {
		if (event.type == 'keydown') {
			if (event.keyCode == 27) {
				showDrop = false;
			}
		} else {
			if (dropdownContainer && !dropdownContainer.contains(event.target)) {
				showDrop = false;
			}
		}
	}
</script>

<div class="{bgColor} relative flex h-full w-full">
	<div class="flex items-center justify-between {bgColor}">
		<label
			for={id}
			class="absolute -top-2 left-4 block bg-inherit p-1 font-semibold leading-6 text-color0"
		>
			{name}
		</label>
	</div>
	<div class="mt-2 h-3/4 w-full" bind:this={dropdownContainer}>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="flex h-full w-full items-center rounded-lg bg-inherit pl-4 font-bold text-color31 ring-2 ring-inset ring-black {readOnly
				? 'cursor-not-allowed'
				: 'cursor-poiner'} {invalid ? 'error' : ''}"
			onmousedown={showDropfn}
			onkeydown={showDropfn}
		>
			{refrenceId ? (valueDrop ? valueDrop : 'None') : valueDrop ? valueDrop : store[id] || 'None'}
		</div>
		{#if invalid}
			<p id="error-message" class="inputInvalid text-red-500" aria-live="polite">
				Please choose any value
			</p>
		{/if}
		{#if arrow}
			<button onclick={showDropfn} aria-labelledby="dropdown">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="absolute right-3 top-6 {showDrop ? 'rotate-180' : ''}"
				>
					<path
						d="M20.5063 9.60462C20.8119 9.29904 20.8329 8.78063 20.5533 8.4467C20.2737 8.11278 19.7993 8.0898 19.4937 8.39538L14.3221 13.5669C13.0466 14.8424 10.9534 14.8424 9.67791 13.567L4.50633 8.39538C4.20075 8.0898 3.72635 8.11278 3.44671 8.44671C3.16707 8.78063 3.1881 9.29904 3.49368 9.60462L8.66526 14.7762C10.514 16.6249 13.4861 16.6249 15.3348 14.7762L20.5063 9.60462Z"
						fill="#111214"
						stroke="black"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		{/if}

		{#if showDrop}
			<div class="absolute top-16 z-20 max-h-[250px] w-full overflow-auto bg-slate-100">
				{#each dropdownFields as fields}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="w-full px-4 py-1.5 text-black hover:bg-button hover:text-color00 {store[id] ==
						fields
							? 'bg-button text-color00'
							: ''}"
						onmousedown={() => selectDetails(fields)}
						onkeydown={() => selectDetails(fields)}
					>
						{#if refrenceId}
							{fields[refrenceId]}
						{:else}
							{fields}
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<svelte:body onmousedown={closeByEsc} onkeydown={closeByEsc} />
