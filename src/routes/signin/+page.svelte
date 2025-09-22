<script lang="ts">
	// @ts-nocheck
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import EmailInput from '$lib/emailInput.svelte';
	import { fetchApi } from '$lib/fetchApi';
	import InputOtpBox from '$lib/inputOtpBox.svelte';
	import InputPassword from '$lib/inputPassword.svelte';
	import LoadingAnimation from '$lib/loadingAnimation.svelte';
	import LoadingOverlay from '$lib/loadingOverlay.svelte';
	import { onMount } from 'svelte';
	// button container
	import Button from '$lib/button.svelte';
	import { userDetails } from '$lib/store.svelte';

	// sign in credientials
	let inputData = $state({ passButton: 'Submit', passError: undefined });
	// to show the error message , it has a value the error message will be shown
	let error = $state(undefined);
	// to show loading in sign in button when click sign process
	let signinButton = $state('Signin');
	// to determine the sign page or forget password page
	let action = $state('signin');
	// page value for forget password flow
	let currentPage = $state(1);
	// it is used to validate the input when click the submit button
	let validatePage = false;

	function setCookie(name: any, value: any, days: any) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Days to milliseconds
		const expires = 'expires=' + date.toUTCString();
		document.cookie = `${name}=${value}; ${expires}; path=/`;
	}
	function getCookie(name: any) {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			if (cookie.startsWith(name + '=')) {
				return cookie.substring(name.length + 1);
			}
		}
		return '';
	}
	// sign in function
	async function signinfn() {
		if (signinButton == 'Signin') {
			signinButton = 'Loading';
			if (inputData.email) {
				if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputData.email.trim())) {
					if (inputData.password) {
						let result = await fetchApi('/signin', 'POST', 'signin', {
							email: inputData.email,
							password: inputData.password,
							name: 'signin'
						});
						if (result.resStatus == 200) {
							if (inputData.password == '12345678') {
								let sendOtp = await fetchApi('/signin', 'POST', 'forget', inputData);
								if (sendOtp.resStatus == 200) {
									action = 'forget';
									inputData.password = '';
								} else {
									error =
										sendOtp.error || sendOtp.message || 'Failed to send otp , try again later';
									signinButton = 'Signin';
								}
							} else {
								if (result.data.id) {
									userDetails.id = result.data.id;
									userDetails.name = result.data.name;
									setCookie('id', result?.data.id, 7);
									goto('/products');
								} else {
									error = 'Please enter valid Email / Password';
									signinButton = 'Signin';
								}
							}
						} else {
							if (result.error == 'inactive') {
								error = 'Your account has inactive';
								signinButton = 'Signin';
							} else {
								error = 'Please enter valid password';
								signinButton = 'Signin';
							}
						}
					} else {
						error = 'Please enter valid password';
						signinButton = 'Signin';
					}
				} else {
					error = 'Please enter valid Email';
					signinButton = 'Signin';
				}
			} else {
				error = 'Please enter valid Email';
				signinButton = 'Signin';
			}
		}
	}

	// function for forget password
	async function forgetPassword() {
		error = 'sending';
		if (
			inputData.email &&
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputData.email.trim())
		) {
			let sendOtp = (await sendOtpfn({ email: inputData.email })).sendOtp;
			if (sendOtp.resStatus == 200) {
				action = 'forget';
				inputData.password = '';
				inputData.otp = sendOtp.data.otp;
				error = undefined;
			} else {
				error =
					sendOtp.error ||
					sendOtp.message ||
					sendOtp.data ||
					'Failed to send otp , try again later';
				signinButton = 'Signin';
			}
		} else {
			error = 'Please enter valid Email';
		}
	}

	// fn. to send the otp for forgetpassword
	async function sendOtpfn(email) {
		let sendOtp = await fetchApi('/signin', 'POST', 'forget', email);
		return { sendOtp };
	}

	// otp validation function
	async function validate(value, id) {
		if (id == 'otp') {
			if (inputData.otp === value) {
				currentPage = 2;
				return true;
			} else {
				return false;
			}
		} else if (id == 'newPassword' || id == 'reEnter') {
			if (value == '12345678') {
				return false;
			} else {
				``;
				return true;
			}
		} else if (id == 'email') {
			if (inputData.email) {
				return true;
			} else {
				return false;
			}
		} else {
			return true;
		}
	}

	// object contain forgetpassword screen button name and error detail
	// let passwordChange = $state({ button: 'Submit', error: undefined });

	// function to change the password
	async function passwordChangefn() {
		if (inputData.newPassword && inputData.reEnter) {
			if (inputData.newPassword == inputData.reEnter) {
				if (inputData.newPassword !== '12345678' && inputData.passButton == 'Submit') {
					if (
						/(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(
							inputData.newPassword
						)
					) {
						inputData.passButton = 'Loading';
						let changePass = await fetchApi('/signin', 'POST', 'changePassword', {
							email: inputData.email,
							otp: inputData.otp,
							password: inputData.newPassword
						});
						if (changePass.resStatus == 200) {
							currentPage = 3;
						} else {
							inputData.passError = changePass.error;
							inputData.passButton = 'Submit';
						}
					} else {
						inputData.passError = 'Please enter valid password';
						inputData.passButton = 'Submit';
					}
				} else {
					inputData.passError = 'Please enter valid password';
					inputData.passButton = 'Submit';
				}
			} else {
				inputData.passError = 'Must be same both password';
				inputData.passButton = 'Submit';
			}
		} else {
			inputData.passError = 'Must be filled both password';
			inputData.passButton = 'Submit';
		}
	}
	// close the pasword page when click the close button
	function closePass() {
		action = 'signin';
		signinButton = 'Signin';
		inputData.password = '';
		error = undefined;
	}

	// prevent back and forward button
	beforeNavigate((navigation) => {
		window.history.forward();
	});
	afterNavigate((navigation) => {
		window.history.forward();
	});
	function storeInput(id, value) {
		inputData[id] = value;
	}
</script>

<div
	class="flex h-full w-full items-center overflow-auto max-md:flex-col {action == 'signin' &&
		'justify-center'}"
>
	<div
		class="flex h-fit justify-center {action == 'signin' ? 'w-full' : 'w-full md:w-1/2'} relative"
	>
		<div
			class=" flex h-full w-full flex-col items-center gap-y-5 p-2 {action == 'signin'
				? 'max-md:p-4 md:w-1/2 lg:w-1/4'
				: 'lg:w-1/2'}"
		>
			<p class="text-dark1 mb-0.5 text-center text-2xl font-bold">Signin to your account</p>
			{#if error && error !== 'sending'}
				<p class="text-center text-lg font-semibold text-red-500 italic">{error}</p>
			{/if}
			<div class="relative h-[64px] w-full">
				<EmailInput
					bind:store={inputData}
					optional="false"
					{validatePage}
					{validate}
					bgColor="bg-lightbg"
					{storeInput}
				/>
			</div>
			<div class="h-[64px] w-full">
				<InputPassword bind:store={inputData} validation="week" {validate} bgColor="bg-lightbg" />
			</div>
			<Button
				buttonName={signinButton}
				loading={signinButton == 'Loading'}
				buttonClick={signinfn}
				buttonStyle="button w-full bg-secondary "
			/>

			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			{#if error == 'sending'}
				<p class="flex gap-2 font-semibold">Sending Otp <LoadingAnimation color="bg-black" /></p>
			{:else}
				<!-- <p class="text-dark1 font-medium">
					if you forget password, <span
						onclick={forgetPassword}
						class="cursor-pointer font-semibold text-amber-600">click here</span
					>
				</p> -->
			{/if}
		</div>
		{#if action == 'forget'}
			<div class="w-fit- h-full">
				<LoadingOverlay load="" />
			</div>
		{/if}
	</div>
	{#if action == 'forget'}
		<div class="flex h-[350px] w-full justify-center px-2 md:w-1/2">
			<div
				class="flex {currentPage == 2
					? 'w-full md:w-1/2'
					: 'w-full'} flex-col items-center justify-center gap-y-5"
				in:fly={{ x: 150, duration: 200 }}
			>
				{#if currentPage == 1}
					<p class=" font-semibold">Otp has been sent to your registered Email</p>
					<InputOtpBox {validate} {sendOtpfn} />

					<button
						class="bg-button rounded-md px-3 py-1.5 font-semibold text-white"
						onclick={closePass}>Cancel</button
					>
				{:else if currentPage == 2}
					{#if inputData.passError}
						<p class="text-error text-center text-lg font-semibold">{inputData.passError}</p>
					{/if}
					<div class=" h-16 w-full">
						<InputPassword
							id="newPassword"
							name="New password"
							bind:store={inputData}
							validation="strong"
							{validate}
							bgColor="bg-bg"
						/>
					</div>
					<div class="mt-1 h-16 w-full">
						<InputPassword
							id="reEnter"
							name="Re-Enter password"
							bind:store={inputData}
							validation="strong"
							{validate}
							bgColor="bg-bg"
						/>
					</div>
					<Button
						buttonName={inputData.passButton}
						loading={inputData.passButton == 'Loading'}
						buttonClick={passwordChangefn}
					/>
				{:else if currentPage == 3}
					<p class="text-xl font-bold">Your password has been changed</p>
					<Button buttonName="Close" buttonClick={closePass} buttonStyle="button w-fit px-4" />
				{/if}
			</div>
		</div>
	{/if}
</div>
