<script>
	// @ts-nocheck

	import { page } from '$app/state';
	import { fetchApi } from '$lib/fetchApi';
	import ImageWithLazy from '$lib/imageWithLazy.svelte';
	import Toggle from '$lib/toggle.svelte';
	import { onMount } from 'svelte';
	import { storeData } from '../store.svelte';
	import LoadingAnimation from '$lib/loadingAnimation.svelte';
	import CrakerLoading from '$lib/crakerLoading.svelte';
	import { fly, scale } from 'svelte/transition';

	let quickViewCracker = $state({});
	let selectedType = $state(0);
	let store = $state(storeData());
	let admin = false;
	let loading = $state(undefined);
	let intersection = $state({
		container1: false,
		container2: false,
		container3: false,
		container4: false,
		container5: false
	});
	onMount(async () => {
		loading = 'page';

		let getCrackersData = await fetchApi('/products', 'GET', 'getCrackers', '');
		if (getCrackersData.resStatus == 200) {
			const favIds = new Set(store.favItems.map((product) => product.id));

			const cartMap = new Map(store.cartItems.map((item) => [item.id, item.cartQuantity]));

			// Update isFav field in allProducts
			let crackerList = getCrackersData.data.list.map((product) => ({
				...product,
				isFav: favIds.has(product.id),
				cartQuantity: cartMap.get(product.id) || 0
			}));
			let cracker = crackerList.filter((x) => {
				return x.id == page.params.id;
			});
			quickViewCracker = cracker[0];
			if (quickViewCracker.id) {
				loading = undefined;
			}

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
					if (entry.target.id == 'container5') {
						if (entry.isIntersecting) {
							intersection.container5 = true;
						}
					}
				});
			}, options);

			const container1 = document.querySelector('#container1');
			const container2 = document.querySelector('#container2');

			observer.observe(container1);
			observer.observe(container2);

			// Cleanup
			return () => {
				observer.unobserve(container1);
				observer.unobserve(container2);
			};
		}

	});

	function change(value) {
		selectedType = value;
	}

	async function crackerComponentButton(detail, tButton, aButton) {

		if ((tButton = 'button2')) {
			loading = `addCart`;
			detail.cart += 1;

			let updatefav = await fetchApi('/products', 'POST', 'cartItems', detail);
			if (updatefav?.resStatus == 200) {
				loading = '';
			}
			if (aButton == 'plus') {
				if (detail.cartQuantity == 0) {
					detail.cartQuantity += 1;
					store.cartItems = [...store.cartItems, $state.snapshot(detail)];
				} else {
					detail.cartQuantity += 1;
					store.cartItems = store.cartItems.map((x) => {
						if (x.id === detail.id) {
							return { ...x, cartQuantity: x.cartQuantity + 1 };
						}
						return x;
					});
				}
			} else {
				if (detail.cartQuantity == 1) {
					let arrayCheck = store.cartItems.filter((x) => {
						return x.id !== detail.id;
					});
					store.cartItems = arrayCheck;
				} else {
					detail.cartQuantity -= 1;
					store.cartItems = store.cartItems.map((x) => {
						if (x.id === detail.id) {
							return { ...x, cartQuantity: x.cartQuantity - 1 };
						}
						return x;
					});
				}
			}
			loading = undefined;
		}
	}
</script>

<section class="flex h-full min-h-[600px] w-full flex-col gap-4 px-32 py-6">
	{#if loading == 'page'}
		<div class="flex h-full w-full items-center justify-center gap-2">
			<p class="text-tertiory-350 text-xl font-bold">Loading</p>
			<LoadingAnimation color="bg-tertiory-350" />
		</div>
	{:else if quickViewCracker.id}
		<div class=" grid h-full w-full grid-cols-2 gap-10">
			<div
				id="container1"
				class=" flex h-full w-full flex-col rounded-md p-4"
				in:scale={{ start: 0, duration: 500 }}
			>
				{#if quickViewCracker.videourl !== null}
					<div class="flex h-1/5 w-full items-center justify-center">
						<Toggle selected={selectedType} {change} />
					</div>
				{/if}
				<div class="h-[80%] max-h-4/5 min-h-4/5 w-full">
					{#if selectedType == 0}
						<div class="h-4/5 max-h-[400px] min-h-full w-full">
							<ImageWithLazy imageUrl={quickViewCracker.image} object="object-contain" />
						</div>
					{:else}
						{@html quickViewCracker.videourl}
					{/if}
				</div>
			</div>
			<div id="container2" class="relative flex h-full w-full flex-col gap-8 py-8">
				<div class="h-fit w-full" in:fly={{ x: 100, duration: 500 }}>
					<p class="text-4xl font-bold text-black">{quickViewCracker.name}</p>
					<p class="mt-3 text-sm text-green-600">In Stock</p>
				</div>
				<p
					class="text-base font-semibold text-black"
					in:fly={{ x: 100, duration: 500, delay: 300 }}
				>
					Rs.{quickViewCracker.price}
					<span class="text-xs font-medium text-gray-400 line-through"
						>Rs.{quickViewCracker.actualprice}</span
					>
				</p>
				<div
					class="bg-primary-300 w-fit rounded-md px-2 py-1"
					in:fly={{ x: 100, duration: 500, delay: 600 }}
				>
					<p class="font-semibold text-gray-100">{quickViewCracker.discount} % offer</p>
				</div>
				{#if quickViewCracker.cartQuantity !== 0}
					<div class="flex items-center gap-2" in:fly={{ x: 100, duration: 500, delay: 1200 }}>
						<button
							aria-label="plus"
							class="bg-primary-300 flex h-full w-8 cursor-pointer items-center justify-center rounded-md text-2xl font-semibold text-gray-100 shadow-lg transition-all duration-300 hover:scale-105"
							onclick={() => crackerComponentButton(quickViewCracker, 'button2', 'minus')}
						>
							-
						</button>

						<div class="felx h-full items-center justify-center px-2">
							<p class="text-lg font-semibold text-gray-700">{quickViewCracker.cartQuantity}</p>
						</div>

						<button
							onclick={() => crackerComponentButton(quickViewCracker, 'button2', 'plus')}
							aria-label="minus"
							class="bg-primary-300 flex h-full w-8 cursor-pointer items-center justify-center rounded-md text-2xl text-sm font-semibold text-gray-100 shadow-lg transition-all duration-300 hover:scale-105"
						>
							+
						</button>
					</div>
				{:else}
					<button
						onclick={() => crackerComponentButton(quickViewCracker, 'button2', 'plus')}
						class="bg-primary-300 flex h-10 w-fit cursor-pointer items-center justify-center rounded-md text-sm text-gray-100 shadow-lg transition-all duration-300 hover:scale-105"
						aria-label="add to cart"
						in:fly={{ x: 100, duration: 500, delay: 1200 }}
					>
						{#if loading == 'addCart'}
							<div class="h-8 w-8">
								<CrakerLoading />
							</div>
						{:else}
							<div class="flex w-fit items-center gap-5 px-3">
								<svg
									width="25"
									height="25"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M3.04047 2.29242C2.6497 2.15503 2.22155 2.36044 2.08416 2.7512C1.94678 3.14197 2.15218 3.57012 2.54295 3.7075L2.80416 3.79934C3.47177 4.03406 3.91052 4.18961 4.23336 4.34802C4.53659 4.4968 4.67026 4.61723 4.75832 4.74609C4.84858 4.87818 4.91828 5.0596 4.95761 5.42295C4.99877 5.80316 4.99979 6.29837 4.99979 7.03832L4.99979 9.64C4.99979 12.5816 5.06302 13.5523 5.92943 14.4662C6.79583 15.38 8.19028 15.38 10.9792 15.38H16.2821C17.8431 15.38 18.6236 15.38 19.1753 14.9304C19.727 14.4808 19.8846 13.7164 20.1997 12.1875L20.6995 9.76275C21.0466 8.02369 21.2202 7.15417 20.7762 6.57708C20.3323 6 18.8155 6 17.1305 6H6.49233C6.48564 5.72967 6.47295 5.48373 6.4489 5.26153C6.39517 4.76515 6.27875 4.31243 5.99677 3.89979C5.71259 3.48393 5.33474 3.21759 4.89411 3.00139C4.48203 2.79919 3.95839 2.61511 3.34187 2.39838L3.04047 2.29242ZM13 8.25C13.4142 8.25 13.75 8.58579 13.75 9V10.25H15C15.4142 10.25 15.75 10.5858 15.75 11C15.75 11.4142 15.4142 11.75 15 11.75H13.75V13C13.75 13.4142 13.4142 13.75 13 13.75C12.5858 13.75 12.25 13.4142 12.25 13V11.75H11C10.5858 11.75 10.25 11.4142 10.25 11C10.25 10.5858 10.5858 10.25 11 10.25H12.25V9C12.25 8.58579 12.5858 8.25 13 8.25Z"
										class="fill-gray-100"
									/>
									<path
										d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z"
										class="fill-gray-100"
									/>
									<path
										d="M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z"
										class="fill-gray-100"
									/>
								</svg>
								<p class="text-lg font-semibold">Add to cart</p>
							</div>
						{/if}
					</button>
				{/if}
				<p class=" font-bold text-gray-600" in:fly={{ x: 100, duration: 500, delay: 1500 }}>
					Quantity : <span class=" font-medium text-black">{quickViewCracker.quantity}</span>
				</p>
				<p class="font-bold text-gray-600" in:fly={{ x: 100, duration: 500, delay: 1800 }}>
					Description :
				</p>

				<p class="indent-8 font-medium text-black" in:fly={{ x: 100, duration: 500, delay: 1800 }}>
					{quickViewCracker.description}
				</p>
			</div>
		</div>
	{:else}
		<div class="flex h-full w-full items-center justify-center gap-2">
			<p class="text-tertiory-350 text-2xl font-semibold">No details found</p>
		</div>
	{/if}
</section>
