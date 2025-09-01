<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import ImageWithLazy from './imageWithLazy.svelte';

	let { data = {}, buttonFunction = () => {}, startFuncion = () => {} } = $props();

	onMount(() => {});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<section class="relative flex h-fit w-full flex-col">
	<div class="bg-tertiory-600 flex h-10 w-full items-center justify-center">
		<p class="font-semibold text-gray-100">{data.type}</p>
	</div>

	<div class="flex h-fit w-full flex-col">
		{#each data.data as item}
			<div
				class="border-secondary-250 grid h-fit w-full grid-cols-1 items-center border-b px-2 sm:px-4 md:h-[150px] md:grid-cols-[4fr_1fr_3.5fr] md:px-6"
				onclick={() => startFuncion(item)}
			>
				<div
					class="flex h-full w-full items-center justify-start gap-6 max-md:justify-between max-md:py-3"
				>
					<div class="h-[250px] w-2/5 md:h-[120px] md:w-[120px]">
						<ImageWithLazy imageUrl={item.image} alt={`Image of ${item.name}`} />
					</div>
					<div
						class="flex h-full w-3/5 items-center justify-between gap-3 max-sm:flex-col md:w-fit"
					>
						<div class="flex h-fit w-fit flex-col gap-2">
							<a
								href="crackerdetail{item.id}"
								class=" hover:text-primary-350 font-semibold hover:scale-110 max-sm:text-center"
								>{item.name}</a
							>
							<p class="text-gray-500 max-sm:text-center">
								Quantity : <span class="text-black">{item.quantity}</span>
							</p>
							<p class="mt-2 font-medium max-sm:text-center md:hidden">
								₹ {Math.trunc(item.price)}
								<span class="ml-2 text-sm text-gray-400 line-through">
									₹ {item.actualprice}
								</span>
							</p>
						</div>
						<div class="flex h-full w-fit flex-col items-center justify-center gap-3 md:hidden">
							<div class=" flex items-center">
								<button
									aria-label="Decrease quantity"
									class="focus:ring-primary-500 flex h-8 w-8 {item.stocks == 0
										? 'cursor-not-allowed'
										: 'cursor-pointer'} items-center justify-center rounded-l border border-gray-300 focus:ring-2 focus:outline-none"
									onclick={(e) => {
										e.stopPropagation();
										if (item.stocks !== 0) {
											buttonFunction(item, 'cart', 'minus');
										}
									}}
								>
									<svg
										width="15"
										height="15"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden="true"
									>
										<path
											d="M6 12L18 12"
											stroke="#000000"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</button>

								<div
									class="flex h-8 w-8 items-center justify-center border-t border-b border-gray-300"
								>
									{item.cartQuantity}
								</div>

								<button
									aria-label="Increase quantity"
									class="focus:ring-primary-500 flex h-8 w-8 {item.stocks == 0
										? 'cursor-not-allowed'
										: 'cursor-pointer'} items-center justify-center rounded-r border border-gray-300 focus:ring-2 focus:outline-none"
									onclick={(e) => {
										e.stopPropagation();
										if (item.stocks !== 0) {
											buttonFunction(item, 'cart', 'plus');
										}
									}}
								>
									<svg
										width="15"
										height="15"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden="true"
									>
										<path
											d="M4 12H20M12 4V20"
											stroke="#000000"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</button>
							</div>

							<p
								class="bg-primary-500 w-20 rounded-tl-lg rounded-br-lg p-2 text-center font-semibold text-white"
							>
								₹ {Math.trunc(item.price || 0 * item.cartQuantity || 0)}
							</p>
						</div>
					</div>
				</div>
				<div class=" flex h-full w-full items-center justify-center">
					<p class="mt-2 font-medium max-md:hidden">
						₹ {Math.trunc(item.price)}
						<span class="ml-2 text-sm text-gray-400 line-through">
							₹ {item.actualprice}
						</span>
					</p>
				</div>
				<div class=" flex h-full w-full items-center justify-end">
					{#if item.stocks == 0}
						<div class="flex h-fit w-[18%] items-center justify-end">
							<div class="bg-secondary-450 w-fit rounded-tr-md rounded-bl-md px-3 py-2 text-white">
								<p>Out of stock</p>
							</div>
						</div>
					{:else}
						<div class="flex h-full w-fit items-center gap-10 max-md:hidden">
							<div class=" flex items-center">
								<button
									aria-label="Decrease quantity"
									class="focus:ring-primary-500 flex h-8 w-8 {item.stocks == 0
										? 'cursor-not-allowed'
										: 'cursor-pointer'} items-center justify-center rounded-l border border-gray-300 focus:ring-2 focus:outline-none"
									onclick={(e) => {
										e.stopPropagation();
										buttonFunction(item, 'cart', 'minus');
									}}
								>
									<svg
										width="15"
										height="15"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden="true"
									>
										<path
											d="M6 12L18 12"
											stroke="#000000"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</button>

								<div
									class="flex h-8 w-8 items-center justify-center border-t border-b border-gray-300"
								>
									{item.cartQuantity}
								</div>

								<button
									aria-label="Increase quantity"
									class="focus:ring-primary-500 flex h-8 w-8 {item.stocks == 0
										? 'cursor-not-allowed'
										: 'cursor-pointer'} items-center justify-center rounded-r border border-gray-300 focus:ring-2 focus:outline-none"
									onclick={(e) => {
										e.stopPropagation();
										buttonFunction(item, 'cart', 'plus');
									}}
								>
									<svg
										width="15"
										height="15"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden="true"
									>
										<path
											d="M4 12H20M12 4V20"
											stroke="#000000"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</button>
							</div>

							<p
								class="bg-primary-500 w-20 rounded-tl-lg rounded-br-lg p-2 text-center font-semibold text-white"
							>
								₹ {Math.trunc(item.price * item.cartQuantity)}
							</p>
						</div>
					{/if}
				</div>

				<!-- <div
					class="flex h-full w-full items-center gap-6 max-md:justify-between max-md:py-3 md:w-fit"
				>
					<div class="h-[250px] w-2/5 md:h-[120px] md:w-[120px]">
						<ImageWithLazy imageUrl={item.image} alt={`Image of ${item.name}`} />
					</div>
					<div
						class="flex h-full w-3/5 items-center justify-between gap-3 max-sm:flex-col md:w-fit"
					>
						<div class="flex h-fit w-fit flex-col gap-2">
							<a
								href="crackerdetail{item.id}"
								class=" hover:text-primary-350 font-semibold hover:scale-110">{item.name}</a
							>
							<p class="text-gray-500">
								Quantity : <span class="text-black">{item.quantity}</span>
							</p>
							<p class="mt-2 font-medium md:hidden">
								₹ {Math.trunc(item.price)}
								<span class="ml-2 text-sm text-gray-400 line-through">
									₹ {item.actualprice}
								</span>
							</p>
						</div>
						<div class="flex h-full w-fit flex-col items-center justify-center gap-3 md:hidden">
							<div class=" flex items-center">
								<button
									aria-label="Decrease quantity"
									class="focus:ring-primary-500 flex h-8 w-8 {item.stocks == 0
										? 'cursor-not-allowed'
										: 'cursor-pointer'} items-center justify-center rounded-l border border-gray-300 focus:ring-2 focus:outline-none"
									onclick={(e) => {
										e.stopPropagation();
										if (item.stocks !== 0) {
											buttonFunction(item, 'cart', 'minus');
										}
									}}
								>
									<svg
										width="15"
										height="15"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden="true"
									>
										<path
											d="M6 12L18 12"
											stroke="#000000"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</button>

								<div
									class="flex h-8 w-8 items-center justify-center border-t border-b border-gray-300"
								>
									{item.cartQuantity}
								</div>

								<button
									aria-label="Increase quantity"
									class="focus:ring-primary-500 flex h-8 w-8 {item.stocks == 0
										? 'cursor-not-allowed'
										: 'cursor-pointer'} items-center justify-center rounded-r border border-gray-300 focus:ring-2 focus:outline-none"
									onclick={(e) => {
										e.stopPropagation();
										if (item.stocks !== 0) {
											buttonFunction(item, 'cart', 'plus');
										}
									}}
								>
									<svg
										width="15"
										height="15"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden="true"
									>
										<path
											d="M4 12H20M12 4V20"
											stroke="#000000"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</button>
							</div>

							<p
								class="bg-primary-500 w-20 rounded-tl-lg rounded-br-lg p-2 text-center font-semibold text-white"
							>
								₹ {Math.trunc(item.price || 0 * item.cartQuantity || 0)}
							</p>
						</div>
					</div>
				</div>

				<p class="mt-2 font-medium max-md:hidden">
					₹ {Math.trunc(item.price)}
					<span class="ml-2 text-sm text-gray-400 line-through">
						₹ {item.actualprice}
					</span>
				</p>
				{#if item.stocks == 0}
					<div class="flex h-fit w-[18%] items-center justify-end">
						<div class="bg-secondary-450 w-fit rounded-tr-md rounded-bl-md px-3 py-2 text-white">
							<p>Out of stock</p>
						</div>
					</div>
				{:else}
					<div class="flex h-full w-fit items-center gap-10 max-md:hidden">
						<div class=" flex items-center">
							<button
								aria-label="Decrease quantity"
								class="focus:ring-primary-500 flex h-8 w-8 {item.stocks == 0
									? 'cursor-not-allowed'
									: 'cursor-pointer'} items-center justify-center rounded-l border border-gray-300 focus:ring-2 focus:outline-none"
								onclick={(e) => {
									e.stopPropagation();
									buttonFunction(item, 'cart', 'minus');
								}}
							>
								<svg
									width="15"
									height="15"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
								>
									<path
										d="M6 12L18 12"
										stroke="#000000"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</button>

							<div
								class="flex h-8 w-8 items-center justify-center border-t border-b border-gray-300"
							>
								{item.cartQuantity}
							</div>

							<button
								aria-label="Increase quantity"
								class="focus:ring-primary-500 flex h-8 w-8 {item.stocks == 0
									? 'cursor-not-allowed'
									: 'cursor-pointer'} items-center justify-center rounded-r border border-gray-300 focus:ring-2 focus:outline-none"
								onclick={(e) => {
									e.stopPropagation();
									buttonFunction(item, 'cart', 'plus');
								}}
							>
								<svg
									width="15"
									height="15"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
								>
									<path
										d="M4 12H20M12 4V20"
										stroke="#000000"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</button>
						</div>

						<p
							class="bg-primary-500 w-20 rounded-tl-lg rounded-br-lg p-2 text-center font-semibold text-white"
						>
							₹ {Math.trunc(item.price * item.cartQuantity)}
						</p>
					</div>
				{/if}-->
			</div>
		{/each}
	</div>
</section>
