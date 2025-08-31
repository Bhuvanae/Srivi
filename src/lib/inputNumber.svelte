<script lang="ts">
	let {
		//id used to idetify the compoent and componet value
		id = 'number',
		//label name
		name = 'Number',
		//input value is stored within this
		store = $bindable({ Number: '' }),
		// input component is required or not
		optional = false,
		//dynamic placeholder
		placeholder = `Enter a ${name}`,
		//to make a compoent as readonle
		readonly = false,
		//it's function for validte the value from the parent cSomponent
		validate = () => {},
		// to handle multible error msg and use accesspility
		validatePage = false,
		// input bg color
		bgColor = 'bg-color01',
		// update price value when on change the event
		updateDishDetails = () => {}
	} = $props();

	// invalid is used to show the error
	let invalid = $state(false);

	//   it's validate the component when submit
	$effect(() => {
		if (validatePage) {
			if (optional) {
				invalid = false;
			} else if (!store[id] && !validate(store[id], id)) {
				// document.getElementById(id)?.setAttribute('aria-invalid', 'true');
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
			if (target.value.trim().length !== 0) {
				if (validate(store[id], id)) {
					invalid = false;
					updateDishDetails('form', 'dishUpdate', { key: id, value: target.value.trim() });
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
			type="number"
			class="input {readonly ? 'cursor-not-allowed' : ''} {invalid ? 'error' : ''} "
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


