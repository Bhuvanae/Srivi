<script lang="ts">
	let {
		//id used to idetify the compoent and componet value
		id = 'name',
		//label name
		name = 'Name',
		//input value is stored within this
		store = $bindable({ name: '' }),
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

		customInputStyle = '',

		componentHandlers = () => {},

		focusHandler = () => {},

		optionalStyle = 'text-xs font-medium text-secondary-250 absolute right-0 -top-4.5',

		optionalIf = false
	} = $props();

	// invalid is used to show the error
	let invalid = $state(false);

	//   it's validate the component when submit
	$effect(() => {
		if (validatePage) {
			if (optional) {
				invalid = false;
			} else if (!validate(store[id], id)) {
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
					componentHandlers({ key: id, value: target.value.trim(), eventType: type });
				} else {
					invalid = true;
				}
			} else {
				if (id == 'type') {
					if (type == 'onInput') {
						invalid = false;
						componentHandlers({ key: id, value: target.value.trim(), eventType: type });
					} else {
					}
				} else {
					invalid = true;
				}
			}
		}
	}
</script>

<div class="relative h-full w-full {bgColor} ">
	<label for={id} class="label">
		{name}
	</label>
	{#if optionalIf}
		<p class={optionalStyle}>
			{optional ? 'Optional' : 'Required'}
		</p>
	{/if}
	<div class=" mt-2 h-full w-full">
		{#if id == 'type'}
			<input
				name={id}
				onchange={(e) => {
					validateValue(e, id, 'onChange');
				}}
				oninput={(e) => {
					validateValue(e, id, 'onInput');
				}}
				onfocus={(e) => {
					focusHandler(e, id, 'onFocus');
				}}
				onblur={(e) => {
					focusHandler(e, id, 'onBlur');
				}}
				{id}
				type="text"
				class="input {name == 'State' ? '' : ''} {readonly ? 'cursor-not-allowed' : ''} {invalid
					? 'error'
					: ''} "
				{placeholder}
				bind:value={store[id]}
				{readonly}
				aria-describedby="error-message"
			/>
		{:else}
			<input
				name={id}
				onchange={(e) => {
					validateValue(e, id, 'onChange');
				}}
				{id}
				type="text"
				class="input {customInputStyle} {readonly ? 'cursor-not-allowed' : ''} {invalid
					? 'error'
					: ''} "
				{placeholder}
				bind:value={store[id]}
				{readonly}
				aria-describedby="error-message"
			/>
		{/if}
		{#if invalid}
			<p id="error-message" class="inputInvalid text-red-500" aria-live="polite">
				Please Enter Valid {name}
			</p>
		{/if}
	</div>
</div>
