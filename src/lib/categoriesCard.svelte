<script>
	import AssetImage from './assetImage.svelte';
	import catgo from '$lib/assets/category3.png';

	let {
		name = 'Arial Fancy',
		items = 4,
		buttonHandler = () => {},
		buttonCondition = true,
		itemsName = 'crackers',
		image = catgo
	} = $props();
</script>

<section
	class="group flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg bg-gray-200 px-2 shadow-xl"
>
	<div class="h-2/5 w-3/5">
		<AssetImage imageSrc={image} />
	</div>
	<div class="flex w-full flex-col items-center gap-2">
		<p
			class="text-secondary-350 wrap-break-word w-full truncate text-center font-bold group-hover:overflow-visible group-hover:whitespace-normal"
		>
			{name}
		</p>
		{#if itemsName !== 'none'}
			<p class="wrap-break-word text-center text-sm text-gray-500">{items} {itemsName}</p>
		{/if}
		{#if buttonCondition}
			<button
				class="transistion-all h-fit w-fit cursor-pointer duration-300 hover:scale-105"
				aria-label="navigate"
				onclick={() =>
					buttonHandler(name.toLowerCase() !== 'pack' ? `/products?type=${name}` : '/packs')}
			>
				<svg
					width="30"
					height="30"
					viewBox="0 0 32 32"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M2 16C2 8.26801 8.26801 2 16 2C23.732 2 30 8.26801 30 16C30 23.732 23.732 30 16 30C8.26801 30 2 23.732 2 16ZM15.2929 11.7071C14.9024 11.3166 14.9024 10.6834 15.2929 10.2929C15.6834 9.90237 16.3166 9.90237 16.7071 10.2929L21.7071 15.2929C22.0976 15.6834 22.0976 16.3166 21.7071 16.7071L16.7071 21.7071C16.3166 22.0976 15.6834 22.0976 15.2929 21.7071C14.9024 21.3166 14.9024 20.6834 15.2929 20.2929L18.5858 17H11C10.4477 17 10 16.5523 10 16C10 15.4477 10.4477 15 11 15H18.5858L15.2929 11.7071Z"
						class="fill-primary-350"
					/>
				</svg>
			</button>
		{/if}
	</div>
</section>
