<script>
	// @ts-nocheck
	import { fetchApi } from '$lib/fetchApi';

	import { onMount } from 'svelte';
	import { storeData } from '../store.svelte';
	import QuickViewComp from '$lib/quickViewComp.svelte';
	import { goto } from '$app/navigation';
	import OverlayWithSlot from '$lib/overlayWithSlot.svelte';
	import Toggle from '$lib/toggle.svelte';
	import ImageWithLazy from '$lib/imageWithLazy.svelte';
	import LoadingAnimation from '$lib/loadingAnimation.svelte';
	import { scale } from 'svelte/transition';
	import { InvalidFieldNamePartError } from 'pdf-lib';
	import { storeNew } from '../storeNew.svelte';

	let filterCrackerList = $state([]);
	let loading = $state(undefined);
	let store = storeData();
	let typeList = $state([]);
	let selectedTypeCracker = $state('All Crackers');
	let cartItems = $state(store.cartItems);
	let totalDetails = $state({ actual: 0, price: 0, quantity: 0 });
	let topPosition = $state(0);
	let quickViewCracker = $state({});
	let cartSlider = $state('');
	let height = $state(0);
	let containerWidth = $state(0);

	$effect(() => {
		topPositionValue();
	});

	function topPositionValue() {
		let layoutContainer = document.getElementById('layoutContainer');
		topPosition = layoutContainer?.scrollTop + window.screen.height - 440;
	}
	let removeCartData = $state({ remove: [], decrease: [] });

	onMount(async () => {
		height = window.screen.height;
		loading = 'page';
		topPositionValue();
		removeCartData = { remove: [], decrease: [] };
		let insideCart = [...store.cartItems];

		let getCrackersData = await fetchApi('/products', 'GET', 'getCrackers', '');

		if (getCrackersData && 'data' in getCrackersData) {
			if (getCrackersData.resStatus == 200) {
				filterCrackerList = getCrackersData.data.type;

				const cartMap = new Map(store.cartItems.map((item) => [item.id, item]));

				filterCrackerList.forEach((type) => {
					type.result.data.forEach((product) => {
						if (cartItems.length !== 0) {
							insideCart.forEach((item) => {
								if (product.id === item.id) {
									item.stocks = product.stocks;
									if (product.stocks <= (item.cartQuantity ? item.cartQuantity : 0))
										removeCartData.decrease.push(product);
									if (product.stocks == 0) removeCartData.remove.push(product);
									product.cartQuantity =
										product.stocks >= (item.cartQuantity ? item.cartQuantity : 0)
											? item.cartQuantity || 0
											: product.stocks;
									item.cartQuantity =
										product.stocks >= (item.cartQuantity ? item.cartQuantity : 0)
											? item.cartQuantity || 0
											: product.stocks;
									item.isStock = product.stocks == 0 ? 'outofstock' : 'stock';
								} else {
									if (cartMap.has(product.id)) {
									} else {
										product.cartQuantity = 0;
									}
								}
							});
						} else {
							product.cartQuantity = 0;
						}
					});
				});
				cartItems = insideCart.filter((x) => {
					return x.isStock !== 'outofstock';
				});

				// cartItems = insideCart;

				typeList = filterCrackerList;

				totalDetails = {
					actual: cartItems.reduce((sum, item) => sum + item.cartQuantity * item.actualprice, 0),
					price: cartItems.reduce((sum, item) => sum + item.cartQuantity * item.price, 0),
					quantity: cartItems.reduce((sum, item) => sum + item.cartQuantity, 0)
				};

				loading = undefined;
				if (cartItems.length !== 0) showTotalPopup = true;
			} else {
				loading = 'dataerror';
			}
		} else {
			console.error('Failed to fetch crackers data:', getCrackersData?.error);
			loading = undefined;
		}
	});

	function sortList(value, type) {
		if (value == 'All Crackers') {
			filterCrackerList = typeList;
		} else {
			filterCrackerList = typeList.filter((item) => {
				return item.result[type] == value;
			});
		}
	}

	let showTotalPopup = $state(false);

	async function buttonOneHandler(detail, tButton, aButton) {
		topPositionValue();

		if (tButton === 'cart') {
			let cartItems = store.cartItems;

			if (aButton === 'plus') {
				let itemExists = false;

				cartItems = cartItems.map((x) => {
					if (x.id === detail.id) {
						itemExists = true;
						if (x.stocks - x.cartQuantity > 0) {
							return { ...x, cartQuantity: x.cartQuantity + 1 };
						} else {
							storeNew.toast = {
								show: true,
								action: 'failure',
								title: `Sorry! Only ${detail.stocks} crackers available in stock. `,
								duration: 3000
							};
							return x;
						}
					}
					return x;
				});

				if (!itemExists) {
					if (detail.stocks > 0) cartItems.push({ ...detail, cartQuantity: 1 });
				}
			}

			if (aButton === 'minus') {
				cartItems = cartItems
					.map((x) => {
						if (x.id === detail.id) {
							if (x.cartQuantity === 1) return null; // Remove if quantity is 1
							return { ...x, cartQuantity: x.cartQuantity - 1 };
						}
						return x;
					})
					.filter(Boolean); // Filter out nulls (deleted)
			}

			if (aButton === 'delete') {
				cartItems = cartItems.filter((x) => x.id !== detail.id);
			}

			// Update filterCrackerList as well
			filterCrackerList = filterCrackerList.map((x) => {
				if (x.result.type === detail.type) {
					const updatedData = x.result.data.map((item) => {
						if (item.id === detail.id) {
							if (aButton === 'plus') {
								if (detail.stocks - detail.cartQuantity > 0) {
									return { ...item, cartQuantity: item.cartQuantity + 1 };
								} else {
									return item;
								}
							} else if (aButton === 'minus') {
								return {
									...item,
									cartQuantity: Math.max(item.cartQuantity - 1, 0)
								};
							} else if (aButton === 'delete') {
								return { ...item, cartQuantity: 0 };
							}
						}
						return item;
					});

					return {
						...x,
						result: {
							...x.result,
							data: updatedData
						}
					};
				}
				return x;
			});

			store.cartItems = cartItems;

			const items = store.cartItems;
			totalDetails = {
				actual: items.reduce((sum, item) => sum + item.cartQuantity * item.actualprice, 0),
				price: items.reduce((sum, item) => sum + item.cartQuantity * item.price, 0),
				quantity: items.reduce((sum, item) => sum + item.cartQuantity, 0)
			};
			if (cartItems.length !== 0) {
				showTotalPopup = true;
			} else {
				showTotalPopup = false;
			}
		}
	}

	function navigate() {
		if (store.admin) {
			goto('/checkout');
		} else {
			if (totalDetails.price >= store.minimumCartValue) goto('/checkout');
		}
	}

	function closeQuick(detail) {
		if (cartSlider == 'quickView') {
			cartSlider = undefined;
			quickViewCracker = {};
		} else {
			cartSlider = 'quickView';
			quickViewCracker = detail;
		}
	}

	async function crackerComponentButton(detail, tButton, aButton) {
		if (tButton == 'button1') {
			if (!admin) {
				quickViewCracker = detail;
			} else {
				detail.action = 'delete';
				let deleteCracker = await fetchApi('/products', 'POST', 'deleteCracker', detail);
				if (deleteCracker?.resStatus == 200) {
					filterCrackerList = filterCrackerList.filter((x) => {
						if (x.id !== deleteCracker.data.id) {
							return $state.snapshot(x);
						}
					});
				} else {
				}
			}
		} else if (tButton == 'cart') {
			if (aButton == 'plus') {
				detail.cartQuantity += 1;

				cartItems = cartItems.map((x) => {
					if (x.id === detail.id) {
						return { ...x, cartQuantity: x.cartQuantity + 1 };
					}
					return x;
				});
			} else if (aButton == 'minus') {
				detail.cartQuantity -= 1;
				cartItems = cartItems.map((x) => {
					if (x.id === detail.id) {
						return { ...x, cartQuantity: x.cartQuantity - 1 };
					}
					return x;
				});
			} else if (aButton == 'delete') {
				cartItems = cartItems.filter((x) => {
					return detail.id !== x.id;
				});
			}
			crackerCountDetails.cartTotal = cartItems.reduce(
				(sum, item) => sum + item.cartQuantity * item.price,
				0
			);

			crackerCountDetails.cartDiscount = cartItems.reduce(
				(sum, item) => sum + (item.actualprice - item.price) * item.cartQuantity,
				0
			);
		} else {
			if (!admin) {
				loading = `addCart${detail.id}`;
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
				filterCrackerList = filterCrackerList.map((x) =>
					x.id === detail.id ? { ...x, cartQuantity: detail.cartQuantity } : x
				);
				totalCartQuantity = store.cartItems.reduce((sum, item) => sum + item.cartQuantity, 0);
			} else {
				showAddcrackers = true;
				detail.action = 'update';
				crackerDetail = detail;
			}
		}
	}
	let selectedType = $state(0);
	function change(value) {
		selectedType = value;
	}
	let containerHeight = $state(0);
	let checkOutWidth = $state(0);

	function refreshBage() {
		location.reload();
	}
</script>

<section
	class="relative flex h-fit min-h-[600px] w-full flex-col"
	bind:clientHeight={containerHeight}
	bind:clientWidth={containerWidth}
>
	<div class="flex h-fit min-h-[600px] w-full flex-col gap-6 px-3 py-8 md:px-10 lg:px-32">
		<p class="text-primary-300 text-center text-3xl font-bold">Quick Purchase</p>
		{#if loading == 'page'}
			<div
				class="flex w-full items-center justify-center gap-2"
				style="height:{containerHeight - 200}px"
			>
				<p class="text-xl font-bold">Loading</p>
				<LoadingAnimation color="bg-black" />
			</div>
		{:else if loading == 'dataerror'}
			<div
				class="flex w-full flex-col items-center justify-center gap-2"
				style="height:{containerHeight - 200}px"
			>
				<p class="text-xl font-bold">Couldn't get data</p>

				<button
					class="bg-primary-350 cursor-pointer rounded-md px-4 py-1.5 font-semibold text-white"
					onclick={refreshBage}>Refresh</button
				>
			</div>
		{:else if typeList.length !== 0}
			<div class="flex h-fit w-full items-center justify-end gap-1">
				<p class="text-sm text-gray-800">Filter by :</p>
				<div
					class="border-primary-350 md:2/7 flex h-fit w-4/7 items-center border sm:w-3/7 lg:w-1/7"
				>
					<select
						class="h-8 w-full text-sm"
						bind:value={selectedTypeCracker}
						onchange={(e) => {
							sortList(e.target.value, 'type');
						}}
					>
						<option value="All Crackers">All Crackers</option>
						{#each typeList as list}
							<!-- svelte-ignore node_invalid_placement_ssr -->

							<option value={list.result.type}>{list.result.type}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="flex h-fit min-h-full w-full flex-col">
				{#each filterCrackerList as crackerList}
					<div class="h-fit w-full">
						<QuickViewComp
							data={crackerList.result}
							buttonFunction={buttonOneHandler}
							startFuncion={closeQuick}
						/>
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex h-full min-h-[500px] w-full flex-col items-center justify-center gap-2">
				<p class="text-tertiory-450 text-lg font-bold">No crackers are available at the moment.</p>
			</div>
		{/if}
	</div>

	{#if showTotalPopup}
		<div
			id="quickView"
			class="absolute z-30 flex h-fit w-fit flex-wrap items-center justify-center gap-3 rounded-lg bg-gray-200 px-4 shadow-lg max-md:py-4 md:h-20 md:gap-10"
			style="top:{topPosition}px;left:{containerWidth / 2 - checkOutWidth / 2}px"
			bind:clientWidth={checkOutWidth}
			in:scale={{ duration: 500 }}
			out:scale={{ duration: 500 }}
		>
			<p class="font-semibold text-gray-500">
				Total items : <span class="text-tertiory-750 text-bold">{totalDetails.quantity}</span>
			</p>
			<p class="flex items-end gap-2 font-semibold text-gray-500">
				Estimate Price : <span class="text-tertiory-750 text-bold">
					₹ {Math.trunc(totalDetails.price)}</span
				>
				<span class="text-xs text-black line-through opacity-45"> ₹ {totalDetails.actual}</span>
			</p>
			<button
				class="{store.admin
					? 'bg-primary-350 cursor-pointer text-white'
					: totalDetails.price >= store.minimumCartValue
						? 'bg-primary-350 cursor-pointer text-white'
						: 'cursor-not-allowed bg-gray-400 text-black'} rounded-lg px-4 py-1.5"
				onclick={navigate}>Proceed to Estimate</button
			>
		</div>
	{/if}

	{#if cartSlider == 'quickView'}
		<OverlayWithSlot close={closeQuick}>
			<section
				class="relative flex h-full w-full flex-col gap-4 overflow-auto rounded-lg bg-gray-200 px-5 py-6"
			>
				<!-- <div class="absolute flex h-fit w-full justify-end"> -->
				<button
					aria-label="close"
					class="absolute top-3 right-3 cursor-pointer transition-all duration-300 hover:scale-110"
					onclick={closeQuick}
				>
					<svg
						width="40"
						height="40"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM8.96963 8.96965C9.26252 8.67676 9.73739 8.67676 10.0303 8.96965L12 10.9393L13.9696 8.96967C14.2625 8.67678 14.7374 8.67678 15.0303 8.96967C15.3232 9.26256 15.3232 9.73744 15.0303 10.0303L13.0606 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73742 15.3232 9.26254 15.3232 8.96965 15.0303C8.67676 14.7374 8.67676 14.2625 8.96965 13.9697L10.9393 12L8.96963 10.0303C8.67673 9.73742 8.67673 9.26254 8.96963 8.96965Z"
							class="fill-tertiory-450"
						/>
					</svg>
				</button>
				<!-- </div> -->
				<div class="grid h-full w-full grid-cols-1 gap-5 md:grid-cols-2">
					<div
						class="border-secondary-300 flex {quickViewCracker.videourl !== null
							? 'h-[440px]'
							: 'h-[350px] justify-center'} w-full flex-col rounded-md border p-4"
					>
						{#if quickViewCracker.videourl !== null}
							<div class="flex h-1/5 w-full items-center justify-center">
								<Toggle selected={selectedType} {change} />
							</div>
						{/if}
						<div class="h-4/5 w-full">
							{#if selectedType == 0}
								<ImageWithLazy imageUrl={quickViewCracker.image} object="object-contain" />
							{:else}
								{@html quickViewCracker.videourl}
							{/if}
						</div>
					</div>
					<div class=" flex h-full w-full flex-col gap-3 max-md:items-center">
						<p class="text-3xl font-bold text-black">{quickViewCracker.name}</p>
						<p class="text-sm text-green-600">In Stock</p>
						<p class="text-base font-semibold text-black">
							Rs.{quickViewCracker.price}
							<span class="text-xs font-medium text-gray-400 line-through"
								>Rs.{quickViewCracker.actualprice}</span
							>
						</p>
						<div class="bg-primary-300 w-fit rounded-md px-2 py-1">
							{quickViewCracker.discount} % offer
						</div>
						{#if quickViewCracker.cartQuantity !== 0}
							<div class="flex items-center gap-4">
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
									class="bg-primary-300 flex h-full w-8 cursor-pointer items-center justify-center rounded-md text-sm font-semibold text-gray-100 shadow-lg transition-all duration-300 hover:scale-105 md:text-2xl"
								>
									+
								</button>
							</div>
						{:else}
							<button
								onclick={() => crackerComponentButton(quickViewCracker, 'button2', 'plus')}
								class="bg-primary-300 flex h-10 w-fit cursor-pointer items-center justify-center rounded-md text-sm text-gray-100 shadow-lg transition-all duration-300 hover:scale-105"
								aria-label="add to cart"
							>
								{#if loading}
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
						<p class=" font-bold text-gray-600">
							Quantity : <span class=" font-medium text-black">{quickViewCracker.quantity}</span>
						</p>
						<p class="font-bold text-gray-600">Description :</p>

						<p class="indent-8 font-medium text-black">{quickViewCracker.description}</p>
					</div>
				</div>
			</section>
		</OverlayWithSlot>
	{/if}
</section>
