<script lang="ts">
	import { onMount } from 'svelte';
	import Timer from './timer.svelte';
	import LoadingAnimation from '$lib/loadingAnimation.svelte';

	let {
		// funtion to validate the otp
		validate = () => {},
		sendOtpfn = () => {},
		// we can change using parent
		otpLength = 6
	} = $props();

	// invalid is used change the error styles
	let invalid = $state(false);

	// OTP input handling
	let otp: string[] = $state(Array.from({ length: otpLength }, () => ''));
	let inputs: HTMLInputElement[] = $state([]);
	let loading: boolean = $state(false);

	// on input handler for every input to store the value and change to the nxt input
	async function handleInput(e: Event, index: number): Promise<void> {
		const target = e.target as HTMLInputElement;
		let value = target.value;

		// Restrict input to last digit
		value = value.slice(-1);

		// Check if the value is a digit
		if (/^\d+$/.test(value)) {
			otp[index] = value;
			// Move to next input field if not at the last one
			if (value && index < inputs.length - 1) {
				inputs[index + 1].focus();
			}
			// If all OTP digits are filled, validate the OTP
			if (otp.every((digit) => digit !== '')) {
				loading = true;
				// Run validation
				const isValid = await validate(otp.join(''), 'otp'); // Assume `validate` returns a Promise<boolean>
				if (!isValid) {
					loading = false;
					const otpField = document.getElementById('otp1') as HTMLInputElement | null;
					if (otpField) {
						otpField.setAttribute('aria-invalid', 'true');
					}
					invalid = true;
				} else {
					loading = false;

					invalid = false;
				}
			}
		}
	}

	// Timer management
	let timer = $state(false);
	onMount(() => {
		// Focus the first input on mount
		if (inputs.length > 0) {
			inputs[0].focus();
		}
		timer = true;
	});

	// Function to handle OTP resend
	function resendOtp(): void {
		if (sendOtpfn()) {
			timer = true;
		}
	}

	// Function to stop the timer
	function stopTimer(): void {
		timer = false;
	}
</script>

<div class="bg-customBackground items-centers flex w-full flex-col justify-center px-6 lg:px-1">
	<div class="w-full space-y-6 sm:mx-auto sm:w-full sm:max-w-sm">
		<div class=" flex items-center justify-center gap-4">
			{#each otp as _, i}
				<input
					id="otp{i}"
					class="ring-button focus:ring-button h-9 w-10 rounded-md text-center shadow-md outline-none ring-2 transition-all duration-300 ease-in-out {invalid
						? 'error'
						: ''}"
					placeholder="*"
					type="text"
					inputmode="numeric"
					pattern="[0-9]*"
					maxlength="1"
					bind:value={otp[i]}
					oninput={(e) => handleInput(e, i)}
					onfocus={() => inputs[i].select()}
					bind:this={inputs[i]}
					aria-describedby="error-message"
				/>
			{/each}
		</div>
		{#if loading}
			<div class="flex w-full items-center justify-center gap-3">
				<p class=" font-semibold">Loading</p>
				<LoadingAnimation color="bg-black" />
			</div>
		{/if}
		{#if invalid}
			<p id="error-message" class="inputInvalid text-center" aria-live="polite">
				Please Enter Valid OTP
			</p>
		{/if}

		{#if timer}
			<p class="flex w-full justify-center gap-2 text-nowrap text-center font-semibold">
				Resend OTP in <Timer stop={stopTimer} />
			</p>
		{:else}
			<button
				class="text-solid w-full text-nowrap text-center font-semibold"
				type="button"
				onclick={resendOtp}
			>
				Resend OTP
			</button>
		{/if}
	</div>
</div>
