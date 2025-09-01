<script lang="ts">
	import { fade } from 'svelte/transition';
	// props
	let {
		//id used to idetify the compoent and componet value
		id = 'zipCode',
		//label name
		name = 'Zipcode',
		//input value is stored within this
		store = $bindable({ zipCode: '' }),
		// input component is required or not
		optional = false,
		//dynamic placeholder
		placeholder = '12345',
		//to make a compoent as readonle
		readonly = false,
		//it's function for validte the value from the parent cSomponent
		validate = () => {},
		// to handle multible error msg and use accesspility
		validatePage = false,
		// input bg color
		bgColor = 'bg-color01'
	} = $props();

	// invalid is used to show the error
	let invalid = $state(false);
	//   it's validate the component when submit
	$effect(() => {
		if (validatePage) {
			if (optional) {
				invalid = false;
			} else if (!store[id]) {
				document.getElementById(id)?.setAttribute('aria-invalid', 'true');
				// document.getElementById(id)?.focus();
				invalid = true;
			} else {
				invalid = false;
			}
		}
	});

	// it's onchange handler fn to validate the value and pass value to the parent
	function validateValue(e: Event, id: string, type: string) {
		const target = e.target as HTMLInputElement | null;
		if (target) {
			if (validate(target.value, id) && /\d{5}/.test(target.value) && target.value.length < 7) {
				invalid = false;
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
				validateValue(e, id, 'onchange');
			}}
			{id}
			type="number"
			class="input pl-3 pr-7 {readonly ? 'cursor-not-allowed' : ''} {invalid ? 'error' : ''} "
			{placeholder}
			bind:value={store[id]}
			{readonly}
			aria-describedby="error-message"
		/>
		{#if invalid}
			<p
				id="error-message"
				class="inputInvalid text-red-500"
				aria-live="polite"
				in:fade={{ duration: 500 }}
				out:fade
			>
				Please Enter Valid Zipcode
			</p>
		{/if}
	</div>
</div>
