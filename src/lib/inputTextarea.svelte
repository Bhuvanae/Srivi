<script lang="ts">
	// component props
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

		updateDishDetails = () => {},

		validateLength = 0,

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
			} else if (!store[id] || store[id] == '') {
				// document.getElementById(id)?.setAttribute('aria-invalid', 'true');
				// document.getElementById(id)?.focus();
				invalid = true;
			} else {
				invalid = false;
			}
		}
	});

	let componentValue = $state(store[id]);
	// it's onchange handler fn to validate the value and pass value to the parent
	function validateValue(e: Event, id: string, type: string) {
		const target = e.target as HTMLInputElement | null;
		if (target) {
			if (validateLength !== 0) {
				if (target.value.trim().length <= validateLength) {
					store[id] = target.value;
					componentValue = target.value;
				} else {
					store[id] = store[id].slice(0, validateLength);
				}
			}
			if (target.value.trim().length !== 0) {
				if (validate(store[id], id)) {
					invalid = false;
					if (type == 'onchange') {
						updateDishDetails('form', 'dishUpdate', { key: id, value: target.value.trim() });
					}
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
	{#if optionalIf}
		<p class={optionalStyle}>
			{optional ? 'Optional' : 'Required'}
		</p>
	{/if}
	<div class=" mt-2 h-full w-full">
		<!-- svelte-ignore element_invalid_self_closing_tag -->
		<textarea
			name={id}
			{id}
			oninput={(e) => validateValue(e, id, 'textarea')}
			onchange={(e) => validateValue(e, id, 'onchange')}
			class="{id == 'description' || id == 'cstatus'
				? 'h-[90%]'
				: 'h-[75%]'} w-full resize-none rounded-lg bg-inherit px-4 py-4 font-bold text-black placeholder:text-gray-400 {readonly
				? 'cursor-not-allowed '
				: ''}  {invalid
				? 'error border-color21 border ring-0'
				: 'ring-primary-500 ring-2 ring-inset'}"
			placeholder="Enter the {name}"
			bind:value={store[id]}
			{readonly}
		/>
		{#if validateLength !== 0}
			<p class="absolute right-3 bottom-6 font-semibold">
				<!-- <span class="text-xl">{store[id] ? store[id].trim().length : 0}</span>/{validateLength} -->
				<span class="text-xl">{componentValue ? componentValue.trim().length : 0}</span
				>/{validateLength}
			</p>
		{/if}
		{#if invalid}
			<p id="error-message" class="-mt-1 text-xs font-medium text-red-500" aria-live="polite">
				Please Enter Valid {name}
			</p>
		{/if}
	</div>
</div>
