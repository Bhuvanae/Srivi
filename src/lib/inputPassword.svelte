<script lang="ts">
	// to show the error message and styles
	let invalid = $state(false);
	// component props
	let {
		//id used to idetify the compoent and componet value
		id = 'password',
		//label name
		name = 'Password',
		//input value is stored within this
		store = $bindable({ password: '' }),
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
		// pasword condtion variable
		validation = 'strong'
	} = $props();

	//its trigger a validate when a submit
	$effect(() => {
		if (validatePage) {
			if (optional) {
				invalid = false;
			} else if (!store[id] && validate(store[id], id)) {
				document.getElementById(id)?.setAttribute('aria-invalid', 'true');
				document.getElementById(id)?.focus();
				invalid = true;
			} else {
				invalid = false;
			}
		}
	});
	// fn to handle validate the input value
	async function validateValue(e: Event, id: string, type: string) {
		const target = e.target as HTMLInputElement | null;
		if (target) {
			if (
				validation == 'strong'
					? /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(target.value)
					: validation == 'moderate'
						? target.value.trim().length > 7
						: target.value.trim().length !== 0
			) {
				let validatefn = await validate(target.value, id);
				if (validatefn) {
					invalid = false;
				} else {
					invalid = true;
				}
			} else {
				invalid = true;
			}
		}
	}
	// show password button condition
	let password = $state(true);
	function showPassword(id: string): void {
		const element = document.getElementById(id) as HTMLInputElement | null;
		if (element) {
			password = !password;
			if (element.type === 'password') {
				element.type = 'text';
			} else {
				element.type = 'password';
			}
		} else {
			console.error(`Element with id "${id}" not found.`);
		}
	}
</script>

<div class="relative h-full w-full {bgColor}">
	<label for={id} class="label">
		{name}
	</label>
	<div class="relative mt-2 h-full w-full">
		<input
			name={id}
			oninput={(e) => {
				validateValue(e, id, 'onchange');
			}}
			{id}
			type="password"
			class="input pl-3 {readonly ? 'cursor-not-allowed' : ''} {invalid ? 'error' : ''} "
			{placeholder}
			bind:value={store[id]}
			{readonly}
			aria-describedby="error-message"
		/>

		{#if store[id]}
			<button class="absolute right-2 top-4 cursor-pointer" onclick={() => showPassword(id)}>
				{#if password}
					<svg
						width="20"
						height="20"
						viewBox="0 0 48 48"
						xmlns="http://www.w3.org/2000/svg"
						class="fill-color31"
					>
						<path d="M0 0h48v48H0z" fill="none" />
						<g id="Shopicon">
							<circle cx="24" cy="24" r="4" />
							<path
								d="M24,38c12,0,20-14,20-14s-8-14-20-14S4,24,4,24S12,38,24,38z M24,16c4.418,0,8,3.582,8,8s-3.582,8-8,8s-8-3.582-8-8
                            S19.582,16,24,16z"
							/>
						</g>
					</svg>
				{:else}
					<svg
						width="20"
						height="20"
						viewBox="0 0 48 48"
						xmlns="http://www.w3.org/2000/svg"
						class="fill-button"
					>
						<path d="M0 0h48v48H0z" fill="none" />
						<g id="Shopicon">
							<path
								d="M11.957,33.214L7.171,38L10,40.828l5.305-5.305C17.867,36.992,20.788,38,24,38c12,0,20-14,20-14s-2.953-5.159-7.957-9.214
                            L40.829,10L38,7.172l-5.305,5.305C30.133,11.008,27.212,10,24,10C12,10,4,24,4,24S6.953,29.159,11.957,33.214z M16,24
                            c0-4.418,3.582-8,8-8c1.483,0,2.867,0.411,4.058,1.114l-3.035,3.035C24.694,20.062,24.356,20,24,20c-2.206,0-4,1.794-4,4
                            c0,0.356,0.062,0.694,0.149,1.023l-3.035,3.035C16.411,26.867,16,25.483,16,24z M32,24c0,4.418-3.582,8-8,8
                            c-1.483,0-2.867-0.411-4.058-1.114l3.035-3.035C23.306,27.938,23.644,28,24,28c2.206,0,4-1.794,4-4
                            c0-0.356-0.062-0.694-0.149-1.023l3.035-3.035C31.589,21.133,32,22.517,32,24z"
							/>
						</g>
					</svg>
				{/if}</button
			>
		{/if}
		{#if invalid}
			<p id="error-message" class="inputInvalid" aria-live="polite">
				{store[id] ? 'Please Enter Strong Password' : 'Please Enter Valid password'}
			</p>
		{:else if store[id]}
			<p class="mt-1.5 text-xs">
				Password Strength : <span
					class="font-medium {store[id].length < 5
						? 'text-color33'
						: store[id].length > 4 &&
							  !/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(store[id])
							? 'text-yellow-500'
							: 'text-green-400'}"
				>
					{store[id].length < 5
						? 'Week'
						: store[id].length > 4 &&
							  !/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(store[id])
							? 'Moderate'
							: 'Strong'}
				</span>
			</p>
		{/if}
	</div>
</div>
