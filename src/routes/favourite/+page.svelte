<script>
	// @ts-nocheck

	import { fetchApi } from '$lib/fetchApi';
	import { onMount } from 'svelte';
	import { storeData } from '../store.svelte';
	import ImageWithLazy from '$lib/imageWithLazy.svelte';

	let store = $state(storeData());
	let favList = $state([]);
	let loading = undefined;
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

		if (getCrackersData && 'data' in getCrackersData) {
			let crackersList = getCrackersData.data.list;

			const favIds = new Set(store.favItems.map((product) => product.id));

			let favListcracker = crackersList.filter((cracker) => favIds.has(cracker.id));

			const cartMap = new Map(store.cartItems.map((item) => [item.id, item.cartQuantity]));

			favList = favListcracker.map((cracker) => ({
				...cracker,
				cartQuantity: cartMap.get(cracker.id) || 0
			}));

			loading = '';
		} else {
			console.error('Failed to fetch crackers data:', getCrackersData?.error);
			loading = '';
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
	});

	async function buttonOneHandler(detail, tButton, aButton) {
		if (aButton === 'delete') {
			favList = store.favItems.filter((x) => x.id !== detail.id);
		} else {
			let updatefav = await fetchApi('/products', 'POST', 'cartItems', detail);
			favList.forEach((item) => {
				if (item.id == detail.id) item.cartQuantity += 1;
			});
			detail.cartQuantity += 1;
			store.cartItems = [...store.cartItems, $state.snapshot(detail)];
		}

		store.favItems = favList;
	}
</script>

<section class="flex h-fit min-h-[600px] w-full flex-col gap-6 px-3 py-5 md:px-10 lg:px-32">
	<p
		id="container1"
		class="text-darkBlue text-center text-3xl font-bold {intersection.container2
			? ' scale-100 opacity-100'
			: 'scale-0 opacity-0'} transistion-all duration-500"
	>
		Your Wishlist
	</p>
	<div class="flex h-fit min-h-full w-full flex-col gap-6">
		<table
			id="container2"
			class="h-fit w-full min-w-[600px] border-collapse {intersection.container2
				? ' translate-0 opacity-100'
				: 'translate-y-10 opacity-0'} transistion-all duration-500"
		>
			<thead class="h-10 w-full bg-gray-200">
				<tr class="grid h-full grid-cols-[2fr_4fr_8fr_4fr] items-center font-bold">
					<th></th>
					<th class="flex h-full w-full items-center justify-center">IMAGE</th>
					<th class="flex h-full w-full items-center justify-center">CRACKER DETAILS</th>
					<th class="flex h-full w-full items-center justify-center">AMOUNT</th>
				</tr>
			</thead>
			<tbody class="h-fit w-full">
				{#each favList as items}
					<tr
						class="border-secondary-400 grid h-28 grid-cols-[2fr_4fr_5fr_4fr] items-center border-b md:grid-cols-[2fr_4fr_8fr_4fr]"
					>
						<td class="flex h-full w-full min-w-full items-center justify-center gap-5">
							<button
								aria-label="trash"
								class="bg-primary-200 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
								onclick={() => buttonOneHandler(items, 'cart', 'delete')}
							>
								<svg
									width="25"
									height="25"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M3 6.52381C3 6.12932 3.32671 5.80952 3.72973 5.80952H8.51787C8.52437 4.9683 8.61554 3.81504 9.45037 3.01668C10.1074 2.38839 11.0081 2 12 2C12.9919 2 13.8926 2.38839 14.5496 3.01668C15.3844 3.81504 15.4756 4.9683 15.4821 5.80952H20.2703C20.6733 5.80952 21 6.12932 21 6.52381C21 6.9183 20.6733 7.2381 20.2703 7.2381H3.72973C3.32671 7.2381 3 6.9183 3 6.52381Z"
										class="fill-gray-200"
									/>
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M11.5956 22H12.4044C15.1871 22 16.5785 22 17.4831 21.1141C18.3878 20.2281 18.4803 18.7749 18.6654 15.8685L18.9321 11.6806C19.0326 10.1036 19.0828 9.31511 18.6289 8.81545C18.1751 8.31579 17.4087 8.31579 15.876 8.31579H8.12404C6.59127 8.31579 5.82488 8.31579 5.37105 8.81545C4.91722 9.31511 4.96744 10.1036 5.06788 11.6806L5.33459 15.8685C5.5197 18.7749 5.61225 20.2281 6.51689 21.1141C7.42153 22 8.81289 22 11.5956 22ZM10.2463 12.1885C10.2051 11.7546 9.83753 11.4381 9.42537 11.4815C9.01321 11.5249 8.71251 11.9117 8.75372 12.3456L9.25372 17.6087C9.29494 18.0426 9.66247 18.3591 10.0746 18.3157C10.4868 18.2724 10.7875 17.8855 10.7463 17.4516L10.2463 12.1885ZM14.5746 11.4815C14.9868 11.5249 15.2875 11.9117 15.2463 12.3456L14.7463 17.6087C14.7051 18.0426 14.3375 18.3591 13.9254 18.3157C13.5132 18.2724 13.2125 17.8855 13.2537 17.4516L13.7537 12.1885C13.7949 11.7546 14.1625 11.4381 14.5746 11.4815Z"
										class="fill-gray-200"
									/>
								</svg>
							</button>
							{#if items.cartQuantity == 0}
								<button
									onclick={() => buttonOneHandler(items, 'cart', 'add')}
									aria-label="add to cart"
									class="bg-primary-350 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
								>
									<svg
										width="25"
										height="25"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z"
											class="stroke-white"
											stroke-width="1.5"
										/>
										<path
											d="M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z"
											class="stroke-white"
											stroke-width="1.5"
										/>
										<path
											d="M2 3L2.26121 3.09184C3.5628 3.54945 4.2136 3.77826 4.58584 4.32298C4.95808 4.86771 4.95808 5.59126 4.95808 7.03836V9.76C4.95808 12.7016 5.02132 13.6723 5.88772 14.5862C6.75412 15.5 8.14857 15.5 10.9375 15.5H12M16.2404 15.5C17.8014 15.5 18.5819 15.5 19.1336 15.0504C19.6853 14.6008 19.8429 13.8364 20.158 12.3075L20.6578 9.88275C21.0049 8.14369 21.1784 7.27417 20.7345 6.69708C20.2906 6.12 18.7738 6.12 17.0888 6.12H11.0235M4.95808 6.12H7"
											class="stroke-white"
											stroke-width="1.5"
											stroke-linecap="round"
										/>
									</svg>
								</button>
							{/if}
						</td>
						<td class="flex h-20 w-full items-center justify-center">
							<div class="h-full w-20">
								<ImageWithLazy imageUrl={items.image} />
							</div>
						</td>
						<td class="flex items-center gap-2">
							<a
								href="crackerdetail{items.id}"
								class=" hover:text-primary-350 font-semibold hover:scale-110">{items.name}</a
							>
							<p class=" text-sm font-medium">({items.quantity} Pcs)</p>
						</td>
						<td class="px-4 text-center font-semibold">
							<p class=" font-medium">
								₹ {items.price}
								<span class="text-sm font-medium text-gray-400 line-through">
									₹ {items.actualprice}
								</span>
							</p>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
