<script>
	// @ts-nocheck

	import EmailInput from '$lib/emailInput.svelte';
	import { fetchApi } from '$lib/fetchApi';
	import InputText from '$lib/inputText.svelte';
	import InputTextarea from '$lib/inputTextarea.svelte';
	import LoadingAnimation from '$lib/loadingAnimation.svelte';
	import { onMount } from 'svelte';
	import { storeNew } from '../storeNew.svelte';

	let inputValues = $state({ rating: 5 });
	let validatePage = $state(false);
	let loading = $state(undefined);

	function validate(value, id) {
		if (value) {
			return true;
		} else {
			return false;
		}
	}

	async function submitReview() {
		loading = 'submit';
		if (inputValues.name && inputValues.message) {
			const feedback = await fetchApi('/contactus', 'POST', 'addfeedback', {
				name: inputValues.name,
				email: inputValues.email,
				message: inputValues.message,
				rating: inputValues.rating
			});
			if (feedback.resStatus == 200) {
				storeNew.toast = {
					show: 'true',
					title: 'Feedback Submitted',
					duration: 3000,
					action: 'success'
				};
				loading = undefined;
				inputValues = { rating: 5 };
			} else {
				loading = undefined;
				storeNew.toast = {
					show: 'true',
					title: 'Error Occured',
					duration: 3000,
					action: 'failure'
				};
			}
		} else {
			loading = undefined;
			validatePage = true;
		}
	}
	let intersection = $state({
		container1: false,
		container2: false,
		container3: false,
		container4: false
	});
	onMount(() => {
		const options = {
			root: null, // viewport
			rootMargin: '0px',
			threshold: 0.5 // Intersection ratio
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.target.id == 'container1') {
					if (entry.isIntersecting) {
						intersection.container1 = true;
					}
				}
				if (entry.target.id == 'container2') {
					if (entry.isIntersecting) {
						intersection.container2 = true;
					}
				}
				if (entry.target.id == 'container3') {
					if (entry.isIntersecting) {
						intersection.container3 = true;
					}
				}
				if (entry.target.id == 'container4') {
					if (entry.isIntersecting) {
						intersection.container4 = true;
					}
				}
			});
		}, options);

		const container1 = document.querySelector('#container1');
		const container2 = document.querySelector('#container2');
		const container3 = document.querySelector('#container3');
		const container4 = document.querySelector('#container4');

		observer.observe(container1);
		observer.observe(container2);
		observer.observe(container3);
		observer.observe(container4);

		// Cleanup
		return () => {
			observer.unobserve(container1);
			observer.unobserve(container2);
			observer.unobserve(container3);
			observer.unobserve(container4);
		};
	});
</script>

<section class="min-[500px] flex h-fit w-full flex-col gap-8 px-3 py-10 md:px-10 lg:px-32">
	<p
		id="container1"
		class="text-secondary-250 text-center text-4xl font-bold {intersection.container1
			? ' scale-100 opacity-100'
			: 'scale-0 opacity-0'} transistion-all delay-300 duration-800"
	>
		Contact us
	</p>

	<div
		id="container2"
		class="grid h-[640px] w-full grid-rows-2 gap-10 md:h-[300px] md:grid-cols-2 md:gap-20"
	>
		<div
			class="bg-primary-350 flex h-[300px] w-full flex-col items-center justify-center rounded-lg {intersection.container2
				? ' translate-0 opacity-100'
				: '-translate-x-4 opacity-0'} transistion-all delay-300 duration-800"
		>
			<p class="text-4xl font-bold text-white">Address</p>
			<p class="mt-6 text-2xl font-semibold text-white">Srivi Crackers</p>
			<p class="text-lg font-medium text-white">5/355,Sivakasi main road,</p>
			<p class="text-lg font-medium text-white">Srinivasa nagar, Thayilpatti,</p>
			<p class="text-lg font-medium text-white">Sivakasi - 626131,</p>
			<p class="text-lg font-medium text-white">Virudhunagar</p>
		</div>

		<div
			class="bg-primary-350 flex h-[300px] w-full flex-col items-center justify-center gap-3 rounded-lg {intersection.container2
				? ' translate-0 opacity-100'
				: 'translate-x-4 opacity-0'} transistion-all delay-300 duration-800"
		>
			<!-- <div class="flex h-fit w-fit flex-col gap-3">
				<div class="flex items-center gap-3">
					<svg
						width="22"
						height="22"
						viewBox="0 0 32 32"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z"
							fill="#BFC8D0"
						/>
						<path
							d="M28 16C28 22.6274 22.6274 28 16 28C13.4722 28 11.1269 27.2184 9.19266 25.8837L5.09091 26.9091L6.16576 22.8784C4.80092 20.9307 4 18.5589 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z"
							fill="url(#paint0_linear_87_7264)"
						/>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 18.5109 2.661 20.8674 3.81847 22.905L2 30L9.31486 28.3038C11.3014 29.3854 13.5789 30 16 30ZM16 27.8462C22.5425 27.8462 27.8462 22.5425 27.8462 16C27.8462 9.45755 22.5425 4.15385 16 4.15385C9.45755 4.15385 4.15385 9.45755 4.15385 16C4.15385 18.5261 4.9445 20.8675 6.29184 22.7902L5.23077 26.7692L9.27993 25.7569C11.1894 27.0746 13.5046 27.8462 16 27.8462Z"
							fill="white"
						/>
						<path
							d="M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z"
							fill="white"
						/>
						<defs>
							<linearGradient
								id="paint0_linear_87_7264"
								x1="26.5"
								y1="7"
								x2="4"
								y2="28"
								gradientUnits="userSpaceOnUse"
							>
								<stop stop-color="#5BD066" />
								<stop offset="1" stop-color="#27B43E" />
							</linearGradient>
						</defs>
					</svg>
					<a
						href="https://whatsapp.com/channel/0029Vb6c39P7dmejAqhTEZ39"
						class="font-semibold text-white"
					>
						Click here to join WhatsApp channel</a
					>
				</div>
			</div> -->
			<div class="flex h-fit w-fit items-center gap-4">
				<svg
					width="28"
					height="28"
					viewBox="0 -3.5 32 32"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
				>
					<title>mail</title>
					<desc>Created with Sketch Beta.</desc>
					<defs> </defs>
					<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
						<g
							id="Icon-Set-Filled"
							transform="translate(-414.000000, -261.000000)"
							class="fill-white"
						>
							<path
								d="M430,275.916 L426.684,273.167 L415.115,285.01 L444.591,285.01 L433.235,273.147 L430,275.916 L430,275.916 Z M434.89,271.89 L445.892,283.329 C445.955,283.107 446,282.877 446,282.634 L446,262.862 L434.89,271.89 L434.89,271.89 Z M414,262.816 L414,282.634 C414,282.877 414.045,283.107 414.108,283.329 L425.147,271.927 L414,262.816 L414,262.816 Z M445,261 L415,261 L430,273.019 L445,261 L445,261 Z"
								id="mail"
							>
							</path>
						</g>
					</g>
				</svg>
				<a class="text-ls font-medium text-gray-100" href="mailto:srivicrackers@gmail.com"
					>srivicrackers@gmail.com</a
				>
			</div>
			<div class="flex h-fit w-fit gap-3">
				<div class=" flex h-fit w-fit gap-2 max-lg:flex-col">
					<div class="flex w-fit gap-2">
						<svg
							width="25"
							height="25"
							viewBox="0 0 32 32"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z"
								fill="#BFC8D0"
							/>
							<path
								d="M28 16C28 22.6274 22.6274 28 16 28C13.4722 28 11.1269 27.2184 9.19266 25.8837L5.09091 26.9091L6.16576 22.8784C4.80092 20.9307 4 18.5589 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z"
								fill="url(#paint0_linear_87_7264)"
							/>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 18.5109 2.661 20.8674 3.81847 22.905L2 30L9.31486 28.3038C11.3014 29.3854 13.5789 30 16 30ZM16 27.8462C22.5425 27.8462 27.8462 22.5425 27.8462 16C27.8462 9.45755 22.5425 4.15385 16 4.15385C9.45755 4.15385 4.15385 9.45755 4.15385 16C4.15385 18.5261 4.9445 20.8675 6.29184 22.7902L5.23077 26.7692L9.27993 25.7569C11.1894 27.0746 13.5046 27.8462 16 27.8462Z"
								fill="white"
							/>
							<path
								d="M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z"
								fill="white"
							/>
							<defs>
								<linearGradient
									id="paint0_linear_87_7264"
									x1="26.5"
									y1="7"
									x2="4"
									y2="28"
									gradientUnits="userSpaceOnUse"
								>
									<stop stop-color="#5BD066" />
									<stop offset="1" stop-color="#27B43E" />
								</linearGradient>
							</defs>
						</svg>
						<a
							class="text-ls font-medium text-gray-100"
							href="https://wa.me/9025946872"
							target="_blank"
						>
							+91 9025946872
						</a>
					</div>
					<span class="text-ls font-medium text-gray-100 max-lg:hidden">,</span>
					<div class="flex w-fit gap-2">
						<svg
							width="25"
							height="25"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M15.5562 14.5477L15.1007 15.0272C15.1007 15.0272 14.0181 16.167 11.0631 13.0559C8.10812 9.94484 9.1907 8.80507 9.1907 8.80507L9.47752 8.50311C10.1841 7.75924 10.2507 6.56497 9.63424 5.6931L8.37326 3.90961C7.61028 2.8305 6.13596 2.68795 5.26145 3.60864L3.69185 5.26114C3.25823 5.71766 2.96765 6.30945 3.00289 6.96594C3.09304 8.64546 3.81071 12.259 7.81536 16.4752C12.0621 20.9462 16.0468 21.1239 17.6763 20.9631C18.1917 20.9122 18.6399 20.6343 19.0011 20.254L20.4217 18.7584C21.3806 17.7489 21.1102 16.0182 19.8833 15.312L17.9728 14.2123C17.1672 13.7486 16.1858 13.8848 15.5562 14.5477Z"
								class="fill-white"
							/>
							<path
								d="M13.2595 1.87983C13.3257 1.47094 13.7122 1.19357 14.1211 1.25976C14.1464 1.26461 14.2279 1.27983 14.2705 1.28933C14.3559 1.30834 14.4749 1.33759 14.6233 1.38082C14.9201 1.46726 15.3347 1.60967 15.8323 1.8378C16.8286 2.29456 18.1544 3.09356 19.5302 4.46936C20.906 5.84516 21.705 7.17097 22.1617 8.16725C22.3899 8.66487 22.5323 9.07947 22.6187 9.37625C22.6619 9.52466 22.6912 9.64369 22.7102 9.72901C22.7197 9.77168 22.7267 9.80594 22.7315 9.83125L22.7373 9.86245C22.8034 10.2713 22.5286 10.6739 22.1197 10.7401C21.712 10.8061 21.3279 10.53 21.2601 10.1231C21.258 10.1121 21.2522 10.0828 21.2461 10.0551C21.2337 9.9997 21.2124 9.91188 21.1786 9.79572C21.1109 9.56339 20.9934 9.21806 20.7982 8.79238C20.4084 7.94207 19.7074 6.76789 18.4695 5.53002C17.2317 4.29216 16.0575 3.59117 15.2072 3.20134C14.7815 3.00618 14.4362 2.88865 14.2038 2.82097C14.0877 2.78714 13.9417 2.75363 13.8863 2.7413C13.4793 2.67347 13.1935 2.28755 13.2595 1.87983Z"
								class="fill-white"
							/>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M13.4857 5.3293C13.5995 4.93102 14.0146 4.7004 14.4129 4.81419L14.2069 5.53534C14.4129 4.81419 14.4129 4.81419 14.4129 4.81419L14.4144 4.81461L14.4159 4.81505L14.4192 4.81602L14.427 4.81834L14.4468 4.8245C14.4618 4.82932 14.4807 4.8356 14.5031 4.84357C14.548 4.85951 14.6074 4.88217 14.6802 4.91337C14.8259 4.97581 15.0249 5.07223 15.2695 5.21694C15.7589 5.50662 16.4271 5.9878 17.2121 6.77277C17.9971 7.55775 18.4782 8.22593 18.7679 8.7154C18.9126 8.95991 19.009 9.15897 19.0715 9.30466C19.1027 9.37746 19.1254 9.43682 19.1413 9.48173C19.1493 9.50418 19.1555 9.52301 19.1604 9.53809L19.1665 9.55788L19.1688 9.56563L19.1698 9.56896L19.1702 9.5705C19.1702 9.5705 19.1707 9.57194 18.4495 9.77798L19.1707 9.57194C19.2845 9.97021 19.0538 10.3853 18.6556 10.4991C18.2607 10.6119 17.8492 10.3862 17.7313 9.99413L17.7276 9.98335C17.7223 9.96832 17.7113 9.93874 17.6928 9.89554C17.6558 9.8092 17.5887 9.66797 17.4771 9.47938C17.2541 9.10264 16.8514 8.53339 16.1514 7.83343C15.4515 7.13348 14.8822 6.73078 14.5055 6.50781C14.3169 6.39619 14.1757 6.32909 14.0893 6.29209C14.0461 6.27358 14.0165 6.26254 14.0015 6.25721L13.9907 6.25352C13.5987 6.13564 13.3729 5.72419 13.4857 5.3293Z"
								class="fill-white"
							/>
						</svg>
						<a class="text-ls font-medium text-gray-100" href="tel:+918838674753"
							>+91 883 867 4753</a
						>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div
		id="container3"
		class="flex h-fit min-h-[350px] w-full grid-cols-2 justify-center gap-20 rounded-lg bg-gray-200 px-8 py-4 {intersection.container3
			? ' translate-0 opacity-100'
			: 'translate-y-10 opacity-0'} transistion-all delay-300 duration-800"
	>
		<div class="h-full w-full sm:w-4/5 md:w-3/5 lg:w-1/2">
			<p class="text-3xl font-bold">Leave your Experinence</p>

			<div class="mt-5 flex h-fit w-full items-center gap-3">
				<p class="text-primary-350 text-lg font-semibold">Rating :</p>
				<div class="flex gap-4">
					{#each Array.from({ length: 5 }) as star, i}
						<button
							aria-label="star"
							onclick={() => {
								inputValues.rating = i + 1;
							}}
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z"
									class="{inputValues.rating > i
										? 'fill-secondary-250'
										: 'stroke-secondary-250 stroke-2'} cursor-pointer"
								/>
							</svg>
						</button>
					{/each}
				</div>
			</div>

			<div class="mt-5 flex flex-col gap-5">
				<div class="h-16 w-full">
					<InputText
						id="name"
						name="Name"
						bind:store={inputValues}
						{validate}
						bgColor="bg-gray-200"
						{validatePage}
						optional={false}
						optionalIf={true}
					/>
				</div>

				<div class="h-16 w-full">
					<EmailInput
						id="email"
						name="Email"
						bind:store={inputValues}
						{validate}
						bgColor="bg-gray-200"
						{validatePage}
						optional={true}
						optionalIf={true}
					/>
				</div>
				<div class=" h-40 w-full">
					<InputTextarea
						id="message"
						name="Message"
						bind:store={inputValues}
						optional={false}
						{validate}
						{validatePage}
						bgColor="bg-gray-200"
						optionalIf={true}
					/>
				</div>

				<button
					class="bg-primary-350 flex h-fit w-fit cursor-pointer gap-2 rounded-md px-6 py-1.5 text-gray-200"
					onclick={submitReview}
				>
					{#if loading == 'submit'}
						Loading <LoadingAnimation color="bg-white" />
					{:else}
						Submit
					{/if}
				</button>
			</div>
		</div>
	</div>
	<div
		id="container4"
		class="h-[500px] w-full rounded-lg {intersection.container4
			? ' translate-0 opacity-100'
			: 'translate-y-10 opacity-0'} transistion-all delay-300 duration-800"
	>
		<!-- svelte-ignore a11y_missing_attribute -->
		<iframe
			src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3780.5542603151625!2d77.899502!3d9.574972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zOcKwMzQnMjkuOSJOIDc3wrA1Myc1OC4yIkU!5e1!3m2!1sen!2sin!4v1752472015867!5m2!1sen!2sin"
			width="100%"
			height="100%"
			style="border:0;"
			allowfullscreen=""
			loading="lazy"
			referrerpolicy="no-referrer-when-downgrade"
		></iframe>
	</div>
</section>
