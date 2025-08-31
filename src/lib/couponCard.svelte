<script>
	// @ts-nocheck
	import ImageWithLazy from './imageWithLazy.svelte';
	import couponImage from '$lib/assets/coupon.jpg';
	import { fly } from 'svelte/transition';
	import LoadingAnimation from './loadingAnimation.svelte';
	import CrakerLoading from './crakerLoading.svelte';

	// component props
	let { coupon = {}, store = $bindable({}), buttonHandler = () => {}, loading = false } = $props();
	// to change the status of the course toggle component
	async function changeStatus(e) {
		let changeActive = await fetchApi('POST', true, 'activeUpdate', '', {
			id: course.id,
			active: e.target.checked
		});
		if (changeActive.resStatus == 200) {
			toast.update((x) => {
				x.show = true;
				x.title = e.target.checked ? 'Golf course activeted' : 'Golf course deactiveted';
				x.action = e.target.checked ? 'success' : 'fail';
				return x;
			});
		}
	}
</script>

<!-- 
			object={course.image == null ? 'object-scale-down' : 'object-fill'} -->

<div class="relative h-full w-full rounded-xl">
	<div class="h-full w-full">
		<ImageWithLazy imageUrl={couponImage} mobileImage={couponImage} />
	</div>
	{#if coupon.expiredat !== null}
		<div class="bg-secondary absolute top-1.5 right-1.5 h-fit w-fit rounded-full px-1.5 py-1">
			<p class="text-xs font-semibold">
				Expires: {new Date(coupon.expiredat).toLocaleDateString('en-us', {
					day: '2-digit',
					month: 'short',
					year: '2-digit'
				})}
			</p>
		</div>
	{/if}
	<div
		class="absolute bottom-0 flex h-2/5 w-full items-center justify-between rounded-b-xl px-4 py-3"
		style="background-color: rgba(0, 0, 0, 0.7);"
	>
		<div class="flex h-full w-5/6 flex-col gap-[2px]">
			<p class="text-tertiory-300 text-lg font-semibold">{coupon.coupon}</p>

			<p class="text text-tertiory-50 font-semibold opacity-60">
				{#if coupon.max_dis !== null}
					{coupon.discount}% discount upto ₹{coupon.max_dis}
				{:else}
					{coupon.discount}% discount
				{/if}
			</p>
			{#if coupon.min_amount !== null}
				<p class="text text-tertiory-50 font-semibold opacity-60">
					Min transction amount :{coupon.min_amount}
				</p>
			{/if}
		</div>
		<div class="h-fit w-fit">
			{#if !loading}
				<button
					aria-label="delete coupon"
					class="cursor-pointer"
					title="Delete"
					onclick={() => buttonHandler(coupon.id)}
				>
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
					</svg>
				</button>
			{:else}
				<div class="h-8 w-8">
					<CrakerLoading />
				</div>
			{/if}
		</div>
	</div>
</div>
