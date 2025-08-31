<script lang="ts">
	import { fade } from 'svelte/transition';

	let {
		//id used to idetify the compoent and componet value
		id = 'date',
		//label name
		name = 'Date of Birth',
		//input value is stored within this
		store = $bindable({ date: '' }),
		// input component is required or not
		optional = false,
		//dynamic placeholder
		placeholder = `12/03/1999`,
		//to make a compoent as readonle
		readonly = false,
		//it's function for validte the value from the parent cSomponent
		validate = () => {},
		// to handle multible error msg and use accesspility
		validatePage = false,
		// input bg color
		bgColor = 'bg-color01',

		minDate = new Date().toISOString().split('T')[0],

		customInputStyle = '',

		componentHandlers = () => {},

		focusHandler = () => {}
	} = $props();
	// dispatch input value to the parent component
	// import { createEventDispatcher } from 'svelte';
	// let dispatch = createEventDispatcher()
	// invalid is used to show the error
	let invalid = false;
	interface Store {
		[key: string]: any;
	}

	// props

	//   it's validate the component when submit
	$effect(() => {
		if (validatePage) {
			if (optional) {
				invalid = false;
			} else if (!store[id]) {
				// document.getElementById(id)?.setAttribute('aria-invalid', 'true');
				// document.getElementById(id)?.focus();
				if (id == 'type') {
					invalid = true;
				} else {
					invalid = true;
				}
			} else {
				invalid = false;
			}
		}
	});
	// it's onchange handler fn to validate the value and pass value to the parent
	function validateValue(e: Event, id: string, type: string) {
		const target = e.target as HTMLInputElement | null;
		if (target) {
			if (target.value.trim().length !== 0) {
				if (validate(store[id], id)) {
					invalid = false;
				} else {
					invalid = true;
				}
			} else {
				invalid = true;
			}
		}
	}
</script>

<div class="relative h-full w-full {bgColor}">
	<label for={id} class="label">
		{name}
	</label>
	<div class=" mt-2 h-full w-full">
		<input
			name={id}
			onchange={(e) => {
				validateValue(e, id, 'onChange');
			}}
			{id}
			type="date"
			min={minDate}
			class="input {readonly ? 'cursor-not-allowed' : ''} {invalid ? 'error' : ''} pr-4"
			{placeholder}
			bind:value={store[id]}
			{readonly}
			aria-describedby="error-message"
		/>
		{#if invalid}
			<p id="error-message" class="inputInvalid text-red-500" aria-live="polite">
				Please Enter Valid {name}
			</p>
		{/if}
	</div>
</div>
