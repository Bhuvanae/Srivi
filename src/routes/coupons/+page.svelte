<script>
	// @ts-nocheck
	import { fetchApi } from '$lib/fetchApi';
	import InputDate from '$lib/inputDate.svelte';
	import InputNumber from '$lib/inputNumber.svelte';
	import InputText from '$lib/inputText.svelte';
	import LoadingAnimation from '$lib/loadingAnimation.svelte';
	import OverlayWithSlot from '$lib/overlayWithSlot.svelte';
	import CouponCard from '$lib/couponCard.svelte';
	import { fly } from 'svelte/transition';

	import { onMount } from 'svelte';
	import { storeNew } from '../storeNew.svelte';

	let loading = $state('page');
	let couponsList = $state([]);
	let coupenDetail = $state({});

	onMount(async () => {
		loading = 'page';

		if (storeNew.admin) {
			let coupons = await fetchApi('/coupons', 'GET', 'getCoupons', '');
			if (coupons.resStatus == 200) {
				couponsList = coupons.data.coupons;
				loading = undefined;
			}
		} else {
			goto('/home');
			storeNew.toast = {
				show: true,
				title: "You don't have access to this content.",
				duration: 3000,
				action: 'failure'
			};
		}
	});
	let createCouponsOverlay = $state(false);
	async function createCoupons() {
		loading = 'loading';
		if (coupenDetail.code && coupenDetail.discount) {
			validatePage = false;
			let addCoupons = await fetchApi('/coupons', 'POST', 'addCoupen', coupenDetail);
			if (addCoupons.resStatus == 200) {
				createCouponsOverlay = false;
				coupenDetail.loading = undefined;
				let coupons = await fetchApi('/coupons', 'GET', 'getCoupons', '');

				if (coupons.resStatus == 200) {
					couponsList = coupons.data.coupons;
					loading = undefined;
					storeNew.toast = {
						show: true,
						title: 'Coupon Created',
						duration: 3000,
						action: 'success'
					};
				} else {
					loading = undefined;
					storeNew.toast = {
						show: true,
						title: 'Error Occured,Try again',
						duration: 3000,
						action: 'failure'
					};
				}
			} else {
				coupenDetail.loading = 'error';
			}
		} else {
			validatePage = true;
		}
	}
	function createCouponsOverlayFn() {
		createCouponsOverlay = !createCouponsOverlay;
	}

	let validatePage = $state(false);

	function validate(value, id) {
		if (value) {
			return true;
		} else {
			return false;
		}
	}

	function generateRandomString(length = 8) {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		for (let i = 0; i < length; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		coupenDetail.code = result;
	}

	async function deleteCoupen(id) {
		loading = `delete${id}`;
		let deleteCo = await fetchApi('coupons', 'POST', 'delete', { id: id });

		if (deleteCo.resStatus == 200) {
			couponsList = couponsList.filter((item) => {
				return item.id !== id;
			});
			loading = 'showPage';
			storeNew.toast = { show: true, title: 'Coupon Deleted', duration: 3000, action: 'success' };
		} else {
			loading = 'showPage';
			storeNew.toast = {
				show: true,
				title: 'Error Occured , Try again',
				duration: 3000,
				action: 'failure'
			};
		}
	}
</script>

<section class="flex h-fit min-h-[600px] w-full flex-col px-3 py-5 md:px-10 lg:px-32">
	<div class="flex h-fit w-full">
		{#if loading == 'page'}
			<div class="flex h-[calc(100vh-120px)] w-full items-center justify-center gap-2">
				<p class="text-tertiory text-xl font-bold">Loading</p>
				<LoadingAnimation color="bg-tertiory" />
			</div>
		{:else if couponsList.length !== 0}
			<div class="relative mt-5 flex h-fit w-full flex-col gap-5">
				<button
					class="bg-primary-350 absolute top-2 right-2 h-fit w-fit cursor-pointer rounded-md px-3 py-1.5 font-semibold text-white"
					onclick={createCouponsOverlayFn}
				>
					Create
				</button>
				<p class="text-center text-3xl font-semibold">Coupons</p>
				<div class="mt-6 flex h-fit w-full flex-wrap gap-8">
					{#each couponsList as coupon, i}
						<div
							class="h-[280px] w-[380px]"
							in:fly={{ x: 40, y: 100, duration: 500, delay: i * 300 }}
						>
							<CouponCard
								{coupon}
								buttonHandler={deleteCoupen}
								loading={loading == `delete${coupon.id}`}
							/>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div class="flex h-[calc(100vh-120px)] w-full flex-col items-center justify-center gap-2">
				<p class="text-tertiory-450 text-lg font-bold">No coupons are available at the moment.</p>
				<button
					class="bg-primary-350 cursor-pointer rounded-md px-4 py-1.5 text-white"
					onclick={createCouponsOverlayFn}
				>
					Create coupon
				</button>
			</div>
		{/if}
	</div>

	{#if createCouponsOverlay}
		<OverlayWithSlot width="w-3/4 lg:w-1/2" close={createCouponsOverlayFn}>
			<section class="flex h-full flex-col gap-4 rounded-lg bg-gray-200 py-6">
				<p class="text-primary-500 font-andika text-center text-xl font-semibold">Coupen Details</p>
				<div class="flex h-full w-full flex-col gap-6 overflow-auto px-4">
					<div class="flex h-36 w-full gap-5 max-md:flex-col md:h-16">
						<div class=" relative h-16 w-full">
							<InputText
								id="code"
								name="Coupon code"
								bind:store={coupenDetail}
								optional={false}
								{validate}
								{validatePage}
								bgColor="bg-gray-200"
							/>
							<button
								onclick={() => generateRandomString()}
								aria-label="random"
								title="Random Code"
								class="bg-primary-350 absolute top-4 right-2 cursor-pointer rounded-full p-2"
								><svg
									width="15"
									height="15"
									viewBox="0 0 32 32"
									enable-background="new 0 0 32 32"
									version="1.1"
									xml:space="preserve"
									xmlns="http://www.w3.org/2000/svg"
									xmlns:xlink="http://www.w3.org/1999/xlink"
								>
									<g id="Layer_1" />

									<g id="Layer_2">
										<g>
											<polyline
												fill="none"
												points="    30,6 30,2 26,2   "
												class="stroke-white"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-miterlimit="10"
												stroke-width="2"
											/>

											<polyline
												fill="none"
												points="    6,2 2,2 2,6   "
												class="stroke-white"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-miterlimit="10"
												stroke-width="2"
											/>

											<polyline
												fill="none"
												points="    2,26 2,30 6,30   "
												class="stroke-white"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-miterlimit="10"
												stroke-width="2"
											/>

											<polyline
												fill="none"
												points="    26,30 30,30 30,26   "
												class="stroke-white"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-miterlimit="10"
												stroke-width="2"
											/>

											<rect
												fill="none"
												height="8"
												class="stroke-white"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-miterlimit="10"
												stroke-width="2"
												width="8"
												x="5"
												y="5"
											/>

											<rect
												fill="none"
												height="8"
												class="stroke-white"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-miterlimit="10"
												stroke-width="2"
												width="8"
												x="19"
												y="5"
											/>

											<rect
												fill="none"
												height="8"
												class="stroke-white"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-miterlimit="10"
												stroke-width="2"
												width="8"
												x="5"
												y="19"
											/>

											<polyline
												fill="none"
												points="    19,23 19,19 23,19   "
												class="stroke-white"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-miterlimit="10"
												stroke-width="2"
											/>

											<polyline
												fill="none"
												points="    27,23 27,27 23,27   "
												class="stroke-white"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-miterlimit="10"
												stroke-width="2"
											/>

											<rect
												fill="none"
												height="2"
												class="stroke-white"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-miterlimit="10"
												stroke-width="2"
												width="2"
												x="22"
												y="22"
											/>
										</g>
									</g>
								</svg></button
							>
						</div>
						<div class=" h-16 w-full">
							<InputNumber
								id="discount"
								name="Discount (%)"
								bind:store={coupenDetail}
								optional={false}
								{validate}
								{validatePage}
								bgColor="bg-gray-200"
							/>
						</div>
					</div>
					<div class="flex h-36 w-full gap-5 max-md:flex-col md:h-16">
						<div class=" h-16 w-full">
							<InputNumber
								id="minAmount"
								name="Min Amount"
								bind:store={coupenDetail}
								optional={true}
								{validate}
								{validatePage}
								bgColor="bg-gray-200"
							/>
						</div>
						<div class=" h-16 w-full">
							<InputNumber
								id="maxDiscount"
								name="Max discount amount"
								bind:store={coupenDetail}
								optional={true}
								{validate}
								{validatePage}
								bgColor="bg-gray-200"
							/>
						</div>
					</div>
					<div class=" flex min-h-16 w-full justify-center md:h-16">
						<div class="h-full w-full md:w-1/2">
							<InputDate
								id="expDate"
								name="Expiry Date"
								bind:store={coupenDetail}
								optional={true}
								{validate}
								{validatePage}
								bgColor="bg-gray-200"
							/>
						</div>
					</div>
				</div>

				<div class=" h-24 w-full">
					<div class="mt-5 flex h-fit w-full items-center justify-center gap-3">
						<button
							class="cursor-pointer rounded-md bg-gray-600 px-4 py-2 hover:scale-105"
							onclick={createCouponsOverlayFn}>Cancel</button
						>
						<button
							class="bg-primary-300 flex cursor-pointer items-end gap-1.5 rounded-md px-4 py-2 hover:scale-105"
							onclick={createCoupons}
							>{coupenDetail.loading == 'loading' ? 'Creating' : 'Create'}
							{#if loading == 'loading'}
								<LoadingAnimation />
							{/if}
						</button>
					</div>
				</div>
			</section>
		</OverlayWithSlot>
	{/if}
</section>
