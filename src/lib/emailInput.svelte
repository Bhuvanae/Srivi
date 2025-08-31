<script lang="ts">
	let {
		//id used to idetify the compoent and componet value
		id = 'email',
		//label name
		name = 'Email',
		//input value is stored within this
		store = $bindable({ email: '' }),
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

		storeInput = () => {},

		optionalStyle = 'text-xs font-medium text-secondary-250 absolute right-0 -top-4.5',

		optionalIf = false
	} = $props();

	// invalid is used to show the error
	let invalid = $state(false);

	//   it's validate the component when submitS
	$effect(() => {
		if (validatePage) {
			// const isValid = await validate(store[id], id);
			if (optional) {
				invalid = false;
			} else {
				if (
					store[id] &&
					store[id] !== '' &&
					/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(store[id].trim())
				) {
					invalid = false;
				} else {
					invalid = true;
				}
			}
		}
	});

	// it's onchange handler fn to validate the value and pass value to the parent
	function validateValue(e: Event, id: string, type: string) {
		const target = e.target as HTMLInputElement | null;
		if (target) {
			if (
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(target.value.trim()) &&
				target.value.trim().length !== 0
			) {
				storeInput(id, target.value);
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
	{#if optionalIf}
		<p class={optionalStyle}>
			{optional ? 'Optional' : 'Required'}
		</p>
	{/if}
	<div class=" mt-2 h-full w-full">
		<input
			name={id}
			onchange={(e) => {
				validateValue(e, id, 'onChange');
			}}
			{id}
			type="email"
			class="input {readonly ? 'cursor-not-allowed' : ''} {invalid ? 'error' : ''} {store[id] &&
			store.username == store[id] &&
			id === 'username2'
				? 'error'
				: ''}"
			{placeholder}
			bind:value={store[id]}
			{readonly}
			aria-describedby="error-message"
		/>
		{#if invalid}
			<p id="error-message" class="inputInvalid text-red-500" aria-live="polite">
				Please Enter Valid Email
			</p>
		{/if}
	</div>
</div>
