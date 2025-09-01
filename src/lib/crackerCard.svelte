<script>
	import AssetImage from './assetImage.svelte';
	import CrakerLoading from './crakerLoading.svelte';
	import nullImage from '$lib/assets/nullimage.webp';
	import { fly } from 'svelte/transition';

	let {
		index = 0,
		stocks = 0,
		isUser = true,
		buttonOneHandler = () => {},
		isFav = false,
		addFav = () => {},
		image = '',
		name = '',
		quantity = 0,
		price = 0,
		actualprice = 0,
		discount = 0,
		cart = 0,
		favorite = 0,
		type = '',
		id = 1,
		description = '',
		cartQuantity = 0,
		loading = false,
		videourl = '',
		componentButton = () => {},
		cardType = 'single',
		extraData = {},
		showList = () => {},
		active = 'true'
	} = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<section
	class="{cardType == 'single'
		? 'border-primary-50'
		: 'border-secondary-200'} relative grid h-full w-full cursor-pointer grid-cols-1 grid-rows-2 justify-center gap-4 rounded-lg border-2 px-2 py-2 shadow-xl sm:px-4 md:px-6 md:py-4"
	onclick={(e) => componentButton(id)}
>
	{#if isUser}
		<button
			title="Add favorite"
			onclick={(e) => {
				e.stopPropagation();
				addFav(
					{
						image,
						name,
						quantity,
						price,
						actualprice,
						discount,
						cart,
						favorite,
						type,
						id,
						description,
						cartQuantity,
						videourl,
						stocks
					},
					isFav
				);
			}}
			aria-label="fav"
			class="{isFav
				? 'hover:bg-gray-400'
				: 'hover:bg-primary-300'} absolute top-2 right-2 z-20 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-gray-200"
		>
			<svg
				width="19"
				height="19"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
					class="stroke-primary-300 {isFav ? 'fill-primary-250' : 'fill-gray-200'}"
				/>
			</svg>
		</button>
	{/if}

	<div class="relative h-full w-full">
		<div class="relative h-full max-h-full min-h-full w-full max-w-full min-w-full">
			<AssetImage imageSrc={image == null ? nullImage : image} />
			{#if !active && !isUser}
				<div class="absolute inset-0 flex items-center justify-center">
					<div
						class=" {cardType == 'single'
							? 'bg-secondary-500'
							: 'bg-primary-350'} flex h-fit w-9/10 items-center justify-center rounded-md px-1 py-2 text-white shadow-xl"
					>
						Deleted {cardType == 'single' ? 'Cracker' : 'Pack'}
					</div>
				</div>
			{/if}
		</div>

		{#if cardType == 'pack'}
			<button
				aria-label="crackers list"
				title="Crackers list"
				class="bg-secondary-350 absolute right-1 bottom-1 cursor-pointer rounded-full p-1 transition-all duration-300 hover:scale-105"
				onclick={(e) => {
					e.stopPropagation();
					showList({ list: extraData.items, name: name });
				}}
			>
				<svg
					width="28"
					height="28"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M8 8H16M8 12H16M10 16H14M3.5 12C3.5 5.5 5.5 3.5 12 3.5C18.5 3.5 20.5 5.5 20.5 12C20.5 18.5 18.5 20.5 12 20.5C5.5 20.5 3.5 18.5 3.5 12Z"
						class=" stroke-gray-200"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		{/if}
	</div>
	<div class="flex h-full w-full flex-col gap-2">
		<p class="text-lg font-[900] text-gray-700">
			{name.length > 18 ? `${name.slice(0, 17)}...` : name}
		</p>
		<div class="flex h-fit w-full items-center gap-2">
			<p class="text-sm text-gray-600">{quantity} {cardType == 'single' ? 'pcs' : 'items'}</p>
			{#if stocks < 10}
				<div
					class="{cardType == 'single'
						? stocks == 0
							? 'bg-tertiory-450'
							: 'bg-secondary-500'
						: stocks == 0
							? 'bg-tertiory-450'
							: 'bg-primary-300'} h-fit w-fit rounded-md px-2 py-0.5 text-xs text-white"
				>
					{stocks == 0 ? 'Out of Stock' : 'Limited Stock'}
				</div>
			{/if}
		</div>

		<div class="flex items-center gap-2">
			<p class="text-base font-bold">
				Rs.{Math.trunc(price || actualprice * ((100 - discount) / 100))}
			</p>
			<div
				class="{cardType == 'single'
					? 'bg-primary-350'
					: 'bg-secondary-350'} w-fit rounded-md px-1.5 text-sm text-white"
			>
				{discount} %
			</div>
		</div>
		<p class="text-sm font-bold">
			M.R.P: <span class="text-sm font-medium text-gray-400 line-through">
				₹ {Math.trunc(actualprice)}
			</span>
		</p>
		<!-- <p class="text-base font-bold">
			Rs.{price || actualprice * (discount / 100)}<span
				class="ml-3 text-sm font-medium text-gray-400 line-through">Rs.{actualprice}</span
			>
		</p> -->
		<div
			class=" grid h-10 w-full {!active && !isUser
				? 'grid-cols-1'
				: isUser
					? cartQuantity !== 0
						? 'grid-cols-[1fr_1fr_2fr]'
						: 'grid-cols-2'
					: 'grid-cols-2'} gap-3"
		>
			{#if !active && !isUser}
				<button
					onclick={(e) => {
						e.stopPropagation();
						buttonOneHandler(
							{
								id
							},
							'button1',
							're-add'
						);
					}}
					class="{cardType !== 'single'
						? 'bg-primary-300'
						: 'bg-secondary-350'} flex h-full w-full cursor-pointer items-center justify-center gap-0.5 rounded-md text-sm text-gray-100 shadow-lg transition-all duration-300 hover:scale-105"
				>
					{#if loading}
						<div class="h-8 w-8">
							<CrakerLoading />
						</div>
					{:else}
						Re Add
					{/if}</button
				>
			{:else}
				<button
					title={isUser ? 'Quick view' : 'Delete'}
					onclick={(e) => {
						e.stopPropagation();
						buttonOneHandler(
							{
								image,
								name,
								quantity,
								price,
								actualprice,
								discount,
								cart,
								favorite,
								type,
								id,
								description,
								cartQuantity,
								videourl,
								stocks,
								extraData
							},
							'button1'
						);
					}}
					class="{cardType == 'single'
						? 'bg-primary-300'
						: 'bg-secondary-350'} flex h-full w-full cursor-pointer items-center justify-center gap-0.5 rounded-md text-sm text-gray-100 shadow-lg transition-all duration-300 hover:scale-105"
				>
					{#if isUser}
						<svg
							class="fill-gray-100"
							width="20"
							height="20"
							viewBox="0 0 32 32"
							version="1.1"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M0 16q0.064 0.128 0.16 0.352t0.48 0.928 0.832 1.344 1.248 1.536 1.664 1.696 2.144 1.568 2.624 1.344 3.136 0.896 3.712 0.352 3.712-0.352 3.168-0.928 2.592-1.312 2.144-1.6 1.664-1.632 1.248-1.6 0.832-1.312 0.48-0.928l0.16-0.352q-0.032-0.128-0.16-0.352t-0.48-0.896-0.832-1.344-1.248-1.568-1.664-1.664-2.144-1.568-2.624-1.344-3.136-0.896-3.712-0.352-3.712 0.352-3.168 0.896-2.592 1.344-2.144 1.568-1.664 1.664-1.248 1.568-0.832 1.344-0.48 0.928zM10.016 16q0-2.464 1.728-4.224t4.256-1.76 4.256 1.76 1.76 4.224-1.76 4.256-4.256 1.76-4.256-1.76-1.728-4.256zM12 16q0 1.664 1.184 2.848t2.816 1.152 2.816-1.152 1.184-2.848-1.184-2.816-2.816-1.184-2.816 1.184l2.816 2.816h-4z"
							></path>
						</svg>
					{:else if loading}
						<div class="h-8 w-8">
							<CrakerLoading />
						</div>
					{:else}
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M3 6.52381C3 6.12932 3.32671 5.80952 3.72973 5.80952H8.51787C8.52437 4.9683 8.61554 3.81504 9.45037 3.01668C10.1074 2.38839 11.0081 2 12 2C12.9919 2 13.8926 2.38839 14.5496 3.01668C15.3844 3.81504 15.4756 4.9683 15.4821 5.80952H20.2703C20.6733 5.80952 21 6.12932 21 6.52381C21 6.9183 20.6733 7.2381 20.2703 7.2381H3.72973C3.32671 7.2381 3 6.9183 3 6.52381Z"
								class="fill-gray-100"
							/>
							<path
								d="M11.6066 22H12.3935C15.101 22 16.4547 22 17.3349 21.1368C18.2151 20.2736 18.3052 18.8576 18.4853 16.0257L18.7448 11.9452C18.8425 10.4086 18.8913 9.64037 18.4498 9.15352C18.0082 8.66667 17.2625 8.66667 15.7712 8.66667H8.22884C6.7375 8.66667 5.99183 8.66667 5.55026 9.15352C5.1087 9.64037 5.15756 10.4086 5.25528 11.9452L5.51479 16.0257C5.69489 18.8576 5.78494 20.2736 6.66513 21.1368C7.54532 22 8.89906 22 11.6066 22Z"
								class="fill-gray-100"
							/>
						</svg>{/if}
				</button>

				{#if isUser && cartQuantity !== 0}
					<button
						title="Decrease"
						aria-label="plus"
						class="{cardType == 'single'
							? 'bg-primary-300'
							: 'bg-secondary-350'} flex h-full w-full cursor-pointer items-center justify-center rounded-md text-2xl font-semibold text-gray-100 shadow-lg transition-all duration-300 hover:scale-105"
						onclick={(e) => {
							e.stopPropagation();
							buttonOneHandler(
								{
									image,
									name,
									quantity,
									price,
									actualprice,
									discount,
									cart,
									favorite,
									type,
									id,
									description,
									cartQuantity,
									videourl,
									stocks,
									extraData
								},
								'button2',
								'minus'
							);
						}}
					>
						-
					</button>
				{/if}

				<!-- Quick View -->
				{#if stocks == 0}
					<button
						class="{cardType !== 'single'
							? 'bg-primary-300'
							: 'bg-secondary-350'} flex h-full w-full cursor-pointer items-center justify-center rounded-md text-sm font-semibold text-gray-100 shadow-lg transition-all duration-300 hover:scale-105"
					>
						Out of Stock
					</button>
				{:else if cartQuantity !== 0 && isUser}
					<div class="grid grid-cols-2 gap-3">
						<!-- <button
							title="Decrease"
							aria-label="plus"
							class="{cardType == 'single'
								? 'bg-primary-300'
								: 'bg-secondary-350'} flex h-full w-full cursor-pointer items-center justify-center rounded-md text-2xl font-semibold text-gray-100 shadow-lg transition-all duration-300 hover:scale-105"
							onclick={(e) => {
								e.stopPropagation();
								buttonOneHandler(
									{
										image,
										name,
										quantity,
										price,
										actualprice,
										discount,
										cart,
										favorite,
										type,
										id,
										description,
										cartQuantity,
										videourl,
										stocks,
										extraData
									},
									'button2',
									'minus'
								);
							}}
						>
							-
						</button> -->

						<div
							class="border-secondary-250 flex h-full w-full items-center justify-center rounded-md border-2"
						>
							{cartQuantity}
						</div>

						<button
							title="Increase"
							onclick={(e) => {
								e.stopPropagation();
								buttonOneHandler(
									{
										image,
										name,
										quantity,
										price,
										actualprice,
										discount,
										cart,
										favorite,
										type,
										id,
										description,
										cartQuantity,
										videourl,
										stocks,
										extraData
									},
									'button2',
									'plus'
								);
							}}
							aria-label="minus"
							class="{cardType == 'single'
								? 'bg-primary-300'
								: 'bg-secondary-350'} flex h-full w-full cursor-pointer items-center justify-center rounded-md text-2xl text-sm font-semibold text-gray-100 shadow-lg transition-all duration-300 hover:scale-105"
						>
							+
						</button>
					</div>
				{:else}
					<button
						title="Add cart"
						onclick={(e) => {
							e.stopPropagation();
							buttonOneHandler(
								{
									image,
									name,
									quantity,
									price,
									actualprice,
									discount,
									cart,
									favorite,
									type,
									id,
									description,
									cartQuantity,
									videourl,
									stocks,
									extraData
								},
								'button2',
								'plus'
							);
						}}
						class="{cardType == 'single'
							? 'bg-primary-300'
							: 'bg-secondary-350'} flex h-full w-full cursor-pointer items-center justify-center rounded-md text-sm text-gray-100 shadow-lg transition-all duration-300 hover:scale-105"
						aria-label="add to cart"
					>
						{#if isUser}
							{#if loading}
								<div class="h-8 w-8">
									<CrakerLoading />
								</div>
							{:else}
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
							{/if}
						{:else}<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								><path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="m3.99 16.854-1.314 3.504a.75.75 0 0 0 .966.965l3.503-1.314a3 3 0 0 0 1.068-.687L18.36 9.175s-.354-1.061-1.414-2.122c-1.06-1.06-2.122-1.414-2.122-1.414L4.677 15.786a3 3 0 0 0-.687 1.068zm12.249-12.63 1.383-1.383c.248-.248.579-.406.925-.348.487.08 1.232.322 1.934 1.025.703.703.945 1.447 1.025 1.934.058.346-.1.677-.348.925L19.774 7.76s-.353-1.06-1.414-2.12c-1.06-1.062-2.121-1.415-2.121-1.415z"
									class="fill-gray-100"
								/></svg
							>
						{/if}
					</button>
				{/if}
			{/if}
		</div>
	</div>
</section>
