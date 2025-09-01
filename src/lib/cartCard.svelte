<script>
	import ImageWithLazy from './imageWithLazy.svelte';

	let {
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
		cartQuantity = 0
	} = $props();
</script>

<div class="border-primary-450 flex h-full w-full items-center border-b bg-white">
	<button
		aria-label="trash"
		class="bg-primary h-full cursor-pointer px-0.5"
		onclick={() =>
			buttonOneHandler(
				{
					image,
					isUser,
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
					cartQuantity
				},
				'cart',
				'delete'
			)}
	>
		<svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
	<div class="flex w-[calc(100%-30px)] items-center justify-between gap-2 px-3">
		<div class="flex h-fit w-fit items-center gap-3">
			<div class="h-20 w-20">
				<ImageWithLazy imageUrl={image} />
			</div>
			<div class="flex flex-col gap-2 py-1">
				<div>
					<p class="text-base font-bold">{name}</p>
					<p class="text-green text-xs font-semibold">In stock</p>
				</div>
				<div class="border-primary-400 flex h-8 w-fit rounded-full border-2">
					<button
						class="flex h-full w-8 cursor-pointer items-center justify-center"
						aria-label="minus"
						onclick={() =>
							buttonOneHandler(
								{
									image,
									name,
									isUser,
									quantity,
									price,
									actualprice,
									discount,
									cart,
									favorite,
									type,
									id,
									description,
									cartQuantity
								},
								'cart',
								'minus'
							)}
					>
						<svg
							width="15"
							height="15"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
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
					<div class="flex h-full w-8 items-center justify-center text-sm">{cartQuantity}</div>
					<button
						aria-label="plus"
						class="flex h-full w-8 cursor-pointer items-center justify-center"
						onclick={() =>
							buttonOneHandler(
								{
									image,
									name,
									quantity,
									price,
									actualprice,
									discount,
									cart,
									isUser,
									favorite,
									type,
									id,
									description,
									cartQuantity
								},
								'cart',
								'plus'
							)}
						><svg
							width="15"
							height="15"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M4 12H20M12 4V20"
								stroke="#000000"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg></button
					>
				</div>
			</div>
		</div>
		<div class="flex flex-col items-end justify-center gap-3">
			<p class="text-sm font-bold">₹ {price}</p>
			<!-- <p class="text-base font-medium">Rs. {data.price * data.quantity}</p> -->
		</div>
	</div>
</div>
