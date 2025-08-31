<script>
	// @ts-nocheck

	import AssetImage from './assetImage.svelte';
	import saraswathi from '$lib/assets/lakshmi.webp';
	import { slide } from 'svelte/transition';
	import kuruvi from '$lib/assets/kuruvi.webp';
	import goldLakshmi from '$lib/assets/gold lakshmi.webp';
	import saraswathi5 from '$lib/assets/saraswathi.jpeg';

	let {
		title = 'Single Sound Crackers',
		edit = 'false',
		crackersList1 = [
			// {
			// 	name: "3 1/2 ' Lakshmi",
			// 	item: "10 No's",
			// 	mrPrice: 110,
			// 	price: 15,
			// 	image: saraswathi,
			// 	quantity: 0
			// },
			{
				name: '2 3/4 Kuruvi',
				item: "10 No's",
				mrPrice: 120,
				price: 30,
				image: kuruvi,
				quantity: 0
			},
			{
				name: 'Gold Laxmi',
				item: "10 No's",
				mrPrice: 127,
				price: 35,
				image: goldLakshmi,
				quantity: 0
			},
			{
				name: "5 ' Laxmi",
				item: "10 No's",
				mrPrice: 111,
				price: 33,
				image: saraswathi5,
				quantity: 0
			}
		]
	} = $props();

	let crackersList = $state(crackersList1);

	function changeValue(action, id) {
		if (action == 'plus') {
			crackersList[id].quantity = crackersList[id].quantity + 1;
		} else {
			crackersList[id].quantity = crackersList[id].quantity - 1;
		}
	}
	let showCrackers = $state(false);
</script>

<section class="flex h-fit w-full flex-col rounded-b-lg border-amber-600">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="flex h-12 w-full cursor-pointer items-center justify-between {showCrackers
			? 'rounded-t-lg'
			: 'rounded-lg'} bg-[#FF8C00] px-3"
		onclick={() => {
			showCrackers = !showCrackers;
		}}
	>
		<p class="text-xl font-semibold text-white">{title}</p>
		{#if showCrackers}
			<button
				aria-label="collapse"
				onclick={() => {
					showCrackers = !showCrackers;
				}}
				class="cursor-pointer"
			>
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M6 12L18 12"
						class="stroke-white"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		{:else}
			<button
				class="cursor-pointer"
				aria-label="expand"
				onclick={() => {
					showCrackers = !showCrackers;
				}}
			>
				<svg
					width="25"
					height="25"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M4 12H20M12 4V20"
						class="stroke-white"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		{/if}
	</div>
	{#if showCrackers}
		<div
			class="flex h-fit w-full flex-col rounded-b-lg border-x border-b border-[#FF8C00]"
			transition:slide
		>
			{#each crackersList as list, i}
				<div
					class="flex h-[200px] w-full items-center justify-between border-b-2 border-amber-600 px-3 {crackersList.length ==
					i + 1
						? 'rounded-b-lg'
						: ''}"
				>
					<div class="flex h-full w-[40%] items-center gap-10">
						<div
							class="relative h-[150px] max-h-[150px] min-h-[150px] w-[150px] max-w-[150px] min-w-[150px]"
						>
							<AssetImage imageSrc={list.image} />
							{#if edit}
								<button
									aria-label="change"
									class=" absolute right-0 bottom-0 rounded-md bg-gradient-to-r from-red-500 to-orange-500 px-2 py-2 font-bold text-white transition-transform duration-200 hover:shadow-lg"
								>
									<svg
										class="fill-white"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
										><path
											d="M19,13a1,1,0,0,0-1,1v.38L16.52,12.9a2.79,2.79,0,0,0-3.93,0l-.7.7L9.41,11.12a2.85,2.85,0,0,0-3.93,0L4,12.6V7A1,1,0,0,1,5,6h7a1,1,0,0,0,0-2H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V14A1,1,0,0,0,19,13ZM5,20a1,1,0,0,1-1-1V15.43l2.9-2.9a.79.79,0,0,1,1.09,0l3.17,3.17,0,0L15.46,20Zm13-1a.89.89,0,0,1-.18.53L13.31,15l.7-.7a.77.77,0,0,1,1.1,0L18,17.21ZM22.71,4.29l-3-3a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-3,3a1,1,0,0,0,1.42,1.42L18,4.41V10a1,1,0,0,0,2,0V4.41l1.29,1.3a1,1,0,0,0,1.42,0A1,1,0,0,0,22.71,4.29Z"
										/></svg
									>
								</button>
							{/if}
						</div>
						<div class="flex h-fit w-fit flex-col gap-3.5">
							<div class="flex h-fit w-full items-end gap-1.5">
								<p class="font-lg font-semibold">{list.name}</p>
								<p class="text-xs">({list.item})</p>
							</div>
							<div class="flex h-fit w-fit items-center gap-3">
								<s class="text-lg">₹ {list.mrPrice}</s>
								<p class="font-bold text-[#4B0082]">₹ {list.price}</p>
							</div>
						</div>
					</div>

					<div class="flex h-[120] w-[30%] justify-center">
						{#if edit}
							<button aria-label="attachement">
								<svg
									width="30"
									height="30"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									class="rotate-45"
								>
									<path
										d="M20 10.9696L11.9628 18.5497C10.9782 19.4783 9.64274 20 8.25028 20C6.85782 20 5.52239 19.4783 4.53777 18.5497C3.55315 17.6211 3 16.3616 3 15.0483C3 13.7351 3.55315 12.4756 4.53777 11.547L12.575 3.96687C13.2314 3.34779 14.1217 3 15.05 3C15.9783 3 16.8686 3.34779 17.525 3.96687C18.1814 4.58595 18.5502 5.4256 18.5502 6.30111C18.5502 7.17662 18.1814 8.01628 17.525 8.63535L9.47904 16.2154C9.15083 16.525 8.70569 16.6989 8.24154 16.6989C7.77738 16.6989 7.33224 16.525 7.00403 16.2154C6.67583 15.9059 6.49144 15.4861 6.49144 15.0483C6.49144 14.6106 6.67583 14.1907 7.00403 13.8812L14.429 6.88674"
										stroke="#000000"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</button>
						{:else}
							<iframe
								width="200"
								height="120"
								src="https://www.youtube.com/embed/d9RY0tx6ERs?autoplay=1&mute=1"
								title="Deepawali fire crackers....peacock crackers.....Diwali crackers...fancy shots..."
								frameborder="0"
								allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								referrerpolicy="strict-origin-when-cross-origin"
								allowfullscreen
							></iframe>
						{/if}
					</div>
					<div class="flex h-full w-[30%] flex-col items-end justify-center">
						<div class="flex h-fit w-fit flex-col items-end gap-4">
							<div class="flex h-10 w-fit">
								{#if list.quantity !== 0}
									<button
										aria-label="minus"
										class="rounded-l-lg bg-[#002244] p-2"
										onclick={() => {
											changeValue('minus', i);
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
												d="M6 12L18 12"
												class="stroke-white"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
									</button>
									<input
										class="h-full w-12 bg-white px-4 font-semibold"
										bind:value={list.quantity}
									/>
								{/if}
								{#if edit}
									<div class="flex h-fit w-fit gap-3">
										<button
											aria-label="edit"
											class="rounded-md bg-gradient-to-r from-red-500 to-orange-500 px-2 py-2 font-bold text-white transition-transform duration-200 hover:scale-105 hover:shadow-lg"
										>
											<svg
												width="25"
												height="25"
												viewBox="0 0 24 24"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
												><path
													fill-rule="evenodd"
													clip-rule="evenodd"
													d="m3.99 16.854-1.314 3.504a.75.75 0 0 0 .966.965l3.503-1.314a3 3 0 0 0 1.068-.687L18.36 9.175s-.354-1.061-1.414-2.122c-1.06-1.06-2.122-1.414-2.122-1.414L4.677 15.786a3 3 0 0 0-.687 1.068zm12.249-12.63 1.383-1.383c.248-.248.579-.406.925-.348.487.08 1.232.322 1.934 1.025.703.703.945 1.447 1.025 1.934.058.346-.1.677-.348.925L19.774 7.76s-.353-1.06-1.414-2.12c-1.06-1.062-2.121-1.415-2.121-1.415z"
													class="fill-white"
												/></svg
											>
										</button>
										<button
										onclick="{()=>deleteCracker()}"
											aria-label="delete"
											class="rounded-md bg-gradient-to-r from-red-600 to-red-400 px-2 py-2 font-bold text-white transition-transform duration-200 hover:scale-105 hover:shadow-lg"
										>
											<svg
												class="cursor-pointer fill-white"
												width="25"
												height="25"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
												><path
													d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z"
												/></svg
											>
										</button>
									</div>
								{:else}
									<button
										aria-label="plus"
										class="{list.quantity == 0
											? 'rounded-lg'
											: 'rounded-r-lg'} cursor-pointer bg-[#002244] p-2"
										onclick={() => {
											changeValue('plus', i);
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
												d="M4 12H20M12 4V20"
												class="stroke-white"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
									</button>
								{/if}
							</div>
							{#if list.quantity}
								<p class="text-lg font-bold text-[#03852e]">₹ {list.price * list.quantity}</p>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>
