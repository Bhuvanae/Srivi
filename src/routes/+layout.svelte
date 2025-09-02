<script lang="ts">
	// @ts-nocheck

	import '../app.css';
	import logo from '$lib/assets/logo.png';
	import AssetImage from '$lib/assetImage.svelte';
	import { onMount } from 'svelte';
	import FireworkEffext from '$lib/fireworkEffext.svelte';
	import { Fireworks } from 'fireworks-js';
	import ImageWithLazy from '$lib/imageWithLazy.svelte';
	import { page } from '$app/stores';
	import { goto, afterNavigate } from '$app/navigation';
	import Slider from '$lib/slider.svelte';
	import CartCard from '$lib/cartCard.svelte';
	import { fetchApi } from '$lib/fetchApi';
	import { scale } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { json } from '@sveltejs/kit';
	import Toast from '$lib/toast.svelte';
	import chakra from '$lib/assets/chakra.png';
	import discount3 from '$lib/assets/discount3.png';

	import { storeData } from './store.svelte';
	import { storeNew } from './storeNew.svelte';
	import CartNotifyCard from '$lib/cartNotifyCard.svelte';
	import ScaleAnimationButton from '$lib/scaleAnimationButton.svelte';

	let store = $state(storeData());
	let containerHeight = $state(0);
	// svelte-ignore state_referenced_locally
	let admin = store.admin;
	// svelte-ignore non_reactive_update
	let fireworksContainer;

	let showInfo = $state({ info: false, chat: false });
	// itha konjam test panna venidiyahtu irukku
	// let cartValue = $state(0);

	// let cart = browser && localStorage.getItem('cartItems');

	// let cartValue = $derived.by(() => {
	// 	let value = store.cartItems?.length
	// 		? store.cartItems.reduce((sum, item) => sum + item.cartQuantity, 0)
	// 		: 0;
	// 	return value;
	// });

	let cartValue = $derived(store.cartItems.reduce((sum, item) => sum + item.cartQuantity, 0));

	onMount(() => {
		storeNew.topPosition = 0;
		const container = document.querySelector('#fireworks');
		if (container) {
			const fireworks = new Fireworks(container, {
				delay: { min: 95, max: 100 },
				traceSpeed: 1
			});
			fireworks.start();
		}

		setTimeout(() => {
			showInfo = { info: true, chat: true };
		}, 1500);
	});

	function closeInfo() {
		showInfo.info = !showInfo.info;
	}

	let { children } = $props();
	let currentRoute = $derived($page.route.id);
	let topPosition = $state(0);

	function scrollfn(event) {
		topPosition = event.target.scrollTop;
		storeNew.topPosition = event.target.scrollTop;
		let cartcontainer = document.getElementById('cartcontainer');
		cartcontainer &&
			(cartcontainer.style.top = event.target.scrollTop + containerHeight - 120 + 'px');
		let slider = document.getElementById('slider');
		slider && (slider.style.top = event.target.scrollTop + 'px');
		let quickView = document.getElementById('quickView');
		quickView && (quickView.style.top = event.target.scrollTop + window.screen.height - 440 + 'px');
		quickView && (store.totalTop = event.target.scrollTop + window.screen.height - 440);
	}

	function navChange(route) {
		showSlider = false;
		if (route == 'signin') {
			document.cookie = 'id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
			location.reload();
		} else {
			goto(`/${route}`);
		}
	}

	afterNavigate(() => {
		let scroll = document.querySelector('#layoutContainer');
		scroll?.scrollTo({ top: 0, behavior: 'smooth' });
		if (currentRoute == '/home') {
			showInfo = { info: true, chat: true };
		} else {
			showInfo = { info: false, chat: false };
		}
	});
	function showSliderfn() {
		store.showCartItems = !store.showCartItems;
	}
	let infoHeight = $state(0);
	let wholeContainerHeight = $state(0);

	let showSlider = $state(false);
	function showMenuSlider() {
		showSlider = !showSlider;
	}
	function closeToast() {
		if (storeNew.cartNotify.show) storeNew.cartNotify.data = {};
		storeNew.toast.show = false;
		storeNew.cartNotify.show = false;
	}

	let scrollingText = $state('It is scrolling text check');
	let scrollDetails = $state([
		{
			icon: '💥',
			title: 'Welcome to Srivi Crackers',
			detail: 'Your one-stop shop for premium firecrackers!'
		},
		{
			icon: '🔥',
			title: 'Offer',
			detail: 'Get up to 80% off for all orders.'
		},
		{
			icon: '🎁',
			title: 'Gift Packs Now Available',
			detail: 'Perfect for family and friends!'
		},
		{
			icon: '⚡',
			title: 'New Stock Alert',
			detail: 'Atom Bombs, Flower Pots, Sky Shots & more just arrived!'
		}
	]);
</script>

<div
	class="relative h-screen w-[calc(100vw-2px)] {currentRoute == '/' ? 'bg-bg' : 'bg-lightbg'}"
	bind:clientHeight={wholeContainerHeight}
>
	{#if currentRoute !== '/signin'}
		{#if currentRoute !== '/home' && currentRoute !== 'contactus'}
			<div class="bg-tertiory-800 flex h-10 w-full items-center justify-center">
				<p class="text-sm font-semibold text-gray-100 sm:text-base md:text-lg">
					The minimum required estimate is Rs. {store.minimumCartValue}.
				</p>
			</div>
		{/if}
		<!-- style="--scrollPercentage:-{scrollingText.length}%" -->
		<header class="relative flex w-full flex-col">
			<!-- <div class="bg-secondary-100 flex h-9 w-full items-center overflow-hidden">
				<div class="scrollText flex items-center gap-3 hover:[animation-play-state:paused]">
					{#each scrollDetails as detail, i}
						<div class=" flex items-center gap-1.5">
							<p class="text-base font-semibold">{detail.icon}</p>
							<p class="text-base font-semibold">{detail.title}</p>
							<p class="font-semibold">-</p>
							<p class="">{detail.detail}</p>
						</div>
						{#if scrollDetails.length !== i + 1}
							<p>🧨</p>
						{/if}
					{/each}
				</div>
			</div> -->
			<div
				class=" sticky top-0 flex h-[80px] w-full items-center justify-between px-3 sm:px-10 md:h-[120px] lg:px-28 {currentRoute ==
				'/'
					? ''
					: 'bg-bg1'} "
			>
				<div class="h-[65px] w-[55px] md:h-28 md:w-30">
					<AssetImage imageSrc={logo} />
				</div>
				<nav class="flex h-fit w-fit gap-6 max-md:hidden lg:gap-12">
					<button
						onclick={() => {
							navChange('home');
						}}
						class=" {currentRoute == '/home'
							? ' text-navYellow scale-110 font-bold'
							: 'text-lightbg'} cursor-pointer transition-all duration-500 hover:scale-110"
						>Home</button
					>
					<button
						onclick={() => {
							navChange('quickbuy');
						}}
						class=" {currentRoute == '/quickbuy'
							? ' text-navYellow scale-110 font-bold'
							: 'text-lightbg hover:text-navHover'} cursor-pointer transition-all duration-500 hover:scale-110"
						>Quick Buy</button
					>

					<button
						onclick={() => {
							navChange('products');
						}}
						class=" {currentRoute == '/products'
							? ' text-navYellow scale-110 font-bold'
							: 'text-lightbg hover:text-navHover'} cursor-pointer transition-all duration-500 hover:scale-110"
						>Shop</button
					><button
						onclick={() => {
							navChange('pricelist');
						}}
						class=" {currentRoute == '/pricelist'
							? ' text-navYellow scale-110 font-bold'
							: 'text-lightbg hover:text-navHover'} cursor-pointer transition-all duration-500 hover:scale-110"
						>Pricelist</button
					><button
						onclick={() => {
							navChange('packs');
						}}
						class=" {currentRoute == '/packs'
							? ' text-navYellow scale-110 font-bold'
							: 'text-lightbg hover:text-navHover'} cursor-pointer transition-all duration-500 hover:scale-110"
						>Packs & Giftboxes</button
					><button
						onclick={() => {
							navChange('contactus');
						}}
						class=" {currentRoute == '/contactus'
							? ' text-navYellow scale-110 font-bold'
							: 'text-lightbg hover:text-navHover'} cursor-pointer transition-all duration-500 hover:scale-110"
						>Contact Us</button
					>
				</nav>
				<div class="flex h-fit w-fit items-center gap-4">
					<button aria-label="menu" class="cursor-pointer md:hidden" onclick={showMenuSlider}>
						<svg
							width="25"
							height="25"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M4 6H20M4 12H20M4 18H20"
								class="stroke-lightbg hover:text-[#FFD54F]"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
					{#if storeData().admin}
						<button
							aria-label="orders"
							title="orders"
							class="cursor-pointer"
							onclick={() => navChange('orders')}
						>
							<svg
								class={currentRoute == '/orders'
									? 'fill-white'
									: 'fill-lightbg hover:text-[#FFD54F]'}
								xmlns="http://www.w3.org/2000/svg"
								width="30"
								height="30"
								viewBox="0 0 100 100"
								xml:space="preserve"
							>
								<g>
									<g>
										<path
											d="M78.8,62.1l-3.6-1.7c-0.5-0.3-1.2-0.3-1.7,0L52,70.6c-1.2,0.6-2.7,0.6-3.9,0L26.5,60.4
			c-0.5-0.3-1.2-0.3-1.7,0l-3.6,1.7c-1.6,0.8-1.6,2.9,0,3.7L48,78.5c1.2,0.6,2.7,0.6,3.9,0l26.8-12.7C80.4,65,80.4,62.8,78.8,62.1z"
										/>
									</g>
									<g>
										<path
											d="M78.8,48.1l-3.7-1.7c-0.5-0.3-1.2-0.3-1.7,0L52,56.6c-1.2,0.6-2.7,0.6-3.9,0L26.6,46.4
			c-0.5-0.3-1.2-0.3-1.7,0l-3.7,1.7c-1.6,0.8-1.6,2.9,0,3.7L48,64.6c1.2,0.6,2.7,0.6,3.9,0l26.8-12.7C80.4,51.1,80.4,48.9,78.8,48.1
			z"
										/>
									</g>
									<g>
										<path
											d="M21.2,37.8l26.8,12.7c1.2,0.6,2.7,0.6,3.9,0l26.8-12.7c1.6-0.8,1.6-2.9,0-3.7L51.9,21.4
			c-1.2-0.6-2.7-0.6-3.9,0L21.2,34.2C19.6,34.9,19.6,37.1,21.2,37.8z"
										/>
									</g>
								</g>
							</svg>
						</button>
						<button
							aria-label="coupons"
							title="coupons"
							class="cursor-pointer"
							onclick={() => navChange('coupons')}
						>
							<svg
								class={currentRoute == '/coupons'
									? 'fill-white'
									: 'fill-lightbg hover:text-[#FFD54F]'}
								height="25"
								width="25"
								version="1.1"
								id="Layer_1"
								xmlns="http://www.w3.org/2000/svg"
								xmlns:xlink="http://www.w3.org/1999/xlink"
								viewBox="0 0 512 512"
								xml:space="preserve"
							>
								<g>
									<g>
										<path
											d="M395.13,306.087c-9.206,0-16.696,7.49-16.696,16.696c0,9.206,7.49,16.696,16.696,16.696s16.696-7.49,16.696-16.696
			C411.826,313.577,404.336,306.087,395.13,306.087z"
										/>
									</g>
								</g>
								<g>
									<g>
										<path
											d="M261.565,172.522c-9.206,0-16.696,7.49-16.696,16.696s7.49,16.696,16.696,16.696c9.206,0,16.696-7.49,16.696-16.696
			S270.771,172.522,261.565,172.522z"
										/>
									</g>
								</g>
								<g>
									<g>
										<path
											d="M495.304,72.348H144.696v50.087c0,9.217-7.479,16.696-16.696,16.696s-16.696-7.479-16.696-16.696V72.348H16.696
			C7.479,72.348,0,79.826,0,89.044v333.913c0,9.217,7.479,16.696,16.696,16.696h94.609v-50.087c0-9.217,7.479-16.696,16.696-16.696
			s16.696,7.479,16.696,16.696v50.087h350.609c9.217,0,16.696-7.479,16.696-16.696V89.044C512,79.826,504.521,72.348,495.304,72.348
			z M144.696,322.783c0,9.217-7.479,16.696-16.696,16.696s-16.696-7.479-16.696-16.696v-33.391c0-9.217,7.479-16.696,16.696-16.696
			s16.696,7.479,16.696,16.696V322.783z M144.696,222.609c0,9.217-7.479,16.696-16.696,16.696s-16.696-7.479-16.696-16.696v-33.391
			c0-9.217,7.479-16.696,16.696-16.696s16.696,7.479,16.696,16.696V222.609z M211.478,189.217c0-27.619,22.468-50.087,50.087-50.087
			c27.619,0,50.087,22.468,50.087,50.087c0,27.619-22.468,50.087-50.087,50.087C233.946,239.304,211.478,216.836,211.478,189.217z
			 M257.512,343.544c-4.271,0-8.544-1.631-11.804-4.892c-6.521-6.521-6.521-17.087,0-23.609L387.37,173.37
			c6.521-6.522,17.086-6.522,23.608,0c6.521,6.521,6.521,17.087,0,23.609L269.315,338.652
			C266.054,341.914,261.782,343.544,257.512,343.544z M395.13,372.87c-27.619,0-50.087-22.468-50.087-50.087
			c0-27.619,22.468-50.087,50.087-50.087s50.087,22.468,50.087,50.087C445.217,350.402,422.75,372.87,395.13,372.87z"
										/>
									</g>
								</g>
							</svg>
						</button>
						<button
							aria-label="signout"
							title="signout"
							class="cursor-pointer"
							onclick={() => navChange('signin')}
						>
							<svg
								class="fill-lightbg hover:text-[#FFD54F]"
								width="25"
								height="25"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
								enable-background="new 0 0 24 24"
								><path
									d="M17,2H7C5.3,2,4,3.3,4,5v6h8.6l-2.3-2.3c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l4,4c0.4,0.4,0.4,1,0,1.4c0,0,0,0,0,0l-4,4c-0.4,0.4-1,0.4-1.4,0c-0.4-0.4-0.4-1,0-1.4l2.3-2.3H4v6c0,1.7,1.3,3,3,3h10c1.7,0,3-1.3,3-3V5C20,3.3,18.7,2,17,2z"
								/></svg
							>
						</button>
					{:else}
						<button
							aria-label="favorites"
							class="cursor-pointer transition-all duration-300 hover:scale-115"
							onclick={() => {
								navChange('favourite');
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
									d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
									class="fill-lightbg stroke-lightbg hover:text-[#FFD54F] hover:text-[#FFD54F]"
								/>
							</svg>
						</button>
						<button
							aria-label="cart"
							class="relative cursor-pointer transition-all duration-300 hover:scale-115"
							onclick={() => {
								navChange('checkout');
							}}
						>
							{#if cartValue !== 0}
								<div
									class="absolute -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-gray-100 text-xs"
								>
									<!-- {storeNew.cartQuantity.items} -->
								</div>
							{/if}
							<svg
								width="35"
								height="35"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z"
									class={currentRoute == '/'
										? 'stroke-white'
										: 'stroke-lightbg hover:text-[#FFD54F]'}
									stroke-width="1.5"
								/>
								<path
									d="M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z"
									class={currentRoute == '/'
										? 'stroke-white'
										: 'stroke-lightbg hover:text-[#FFD54F]'}
									stroke-width="1.5"
								/>
								<path
									d="M2 3L2.26121 3.09184C3.5628 3.54945 4.2136 3.77826 4.58584 4.32298C4.95808 4.86771 4.95808 5.59126 4.95808 7.03836V9.76C4.95808 12.7016 5.02132 13.6723 5.88772 14.5862C6.75412 15.5 8.14857 15.5 10.9375 15.5H12M16.2404 15.5C17.8014 15.5 18.5819 15.5 19.1336 15.0504C19.6853 14.6008 19.8429 13.8364 20.158 12.3075L20.6578 9.88275C21.0049 8.14369 21.1784 7.27417 20.7345 6.69708C20.2906 6.12 18.7738 6.12 17.0888 6.12H11.0235M4.95808 6.12H7"
									class={currentRoute == '/'
										? 'stroke-white'
										: 'stroke-lightbg hover:text-[#FFD54F]'}
									stroke-width="1.5"
									stroke-linecap="round"
								/>
							</svg>
						</button>
					{/if}
				</div>
			</div>
		</header>
	{/if}

	<section
		id="container"
		class=" {currentRoute == '/signin'
			? 'h-[calc(100%-2px)]'
			: currentRoute !== '/home'
				? 'h-[calc(100%-120px)] md:h-[calc(100%-160px)]'
				: 'h-[calc(100%-80px)] md:h-[calc(100%-120px)]'} relative"
	>
		<!-- <FireworkEffext /> -->
		{#if currentRoute == '/signin'}
			<main class="z-10 h-full w-full bg-transparent">
				{@render children()}

				<div
					id="fireworks"
					class="absolute h-full w-full"
					style="top:{storeNew.topPosition}px;pointer-events: none"
					bind:this={fireworksContainer}
				></div>
			</main>
		{:else}
			<main
				id="layoutContainer"
				class=" relative z-10 h-full w-full {store.showCartItems
					? 'overflow-auto'
					: 'overflow-auto'} bg-transparent"
				bind:clientHeight={containerHeight}
				onscroll={scrollfn}
			>
				{@render children()}

				<footer
					class=" bg-tertiory mt-10 flex h-fit w-full flex-col px-3 md:min-h-[350px] md:px-10 lg:px-28"
				>
					<div
						class="flex h-fit w-full items-center justify-between py-5 max-md:flex-col md:h-[350px]"
					>
						<div class="flex h-full w-36 flex-col items-center justify-center gap-3">
							<div class="h-16 w-16 md:h-32 md:w-32">
								<ImageWithLazy imageUrl={logo} mobileImage={logo} />
							</div>
							<p class="text-lightbg w-48 text-center text-base font-semibold md:text-xl">
								Srivi Crackers
							</p>
						</div>

						<div
							class="flex h-fit w-fit flex-col items-start justify-center gap-3 md:h-4/5 md:justify-start"
						>
							<p class="text-lightbg text-lg font-bold">Quick Links</p>
							<button
								onclick={() => {
									navChange('home');
								}}
								class=" {currentRoute == '/home'
									? ' font-bold text-gray-100'
									: 'text-darkblue hover:text-[#FFD54F]'} flex cursor-pointer items-center gap-1 font-semibold transition-all duration-500 hover:scale-110 max-md:text-sm max-sm:text-xs"
								><div class="h-6 w-6"><AssetImage imageSrc={chakra} /></div>
								Home</button
							>
							<button
								onclick={() => {
									navChange('products');
								}}
								class=" {currentRoute == '/products'
									? ' font-bold text-gray-100'
									: 'text-darkblue hover:text-navHover'} flex cursor-pointer items-center gap-1 font-semibold transition-all duration-500 hover:scale-110 max-md:text-sm max-sm:text-xs"
								><div class="h-6 w-6"><AssetImage imageSrc={chakra} /></div>
								Quick buy</button
							>
							<button
								onclick={() => {
									navChange('pricelist');
								}}
								class=" {currentRoute == '/offers'
									? ' font-bold text-gray-100'
									: 'text-darkblue hover:text-navHover'} flex cursor-pointer items-center gap-1 font-semibold transition-all duration-500 hover:scale-110 max-md:text-sm max-sm:text-xs"
								><div class="h-6 w-6"><AssetImage imageSrc={chakra} /></div>
								Pricelist</button
							><button
								onclick={() => {
									navChange('packs');
								}}
								class=" {currentRoute == '/packs'
									? ' font-bold text-gray-100'
									: 'text-darkblue hover:text-navHover'} flex cursor-pointer items-center gap-1 font-semibold transition-all duration-500 hover:scale-110 max-md:text-sm max-sm:text-xs"
								><div class="h-6 w-6"><AssetImage imageSrc={chakra} /></div>
								Packs & Giftboxes</button
							><button
								onclick={() => {
									navChange('contactus');
								}}
								class=" {currentRoute == '/contactus'
									? ' font-bold text-gray-100'
									: 'text-darkblue hover:text-navHover'} flex cursor-pointer items-center gap-1 font-semibold transition-all duration-500 hover:scale-110 max-md:text-sm max-sm:text-xs"
								><div class="h-6 w-6"><AssetImage imageSrc={chakra} /></div>
								Contact Us</button
							>
						</div>
						<div
							class=" items:center flex h-fit w-full flex-col justify-center gap-3 md:h-4/5 md:w-fit md:items-start md:justify-start"
						>
							<p class="text-lightbg text-lg font-bold max-md:text-center">Find Us Here</p>

							<address class="text-base font-semibold text-black max-md:text-center">
								Srivi Crackers,<br />
								5/355,Sivakasi main road,<br />
								Srinivasa nagar, Thayilpatti,<br />
								Sivakasi - 626131,<br />
								Virudhunagar Dist.<br />
							</address>
						</div>
						<div
							class=" flex h-fit w-full flex-col justify-center gap-3 max-md:items-center md:h-4/5 md:w-fit md:justify-start"
						>
							<p class="text-lightbg text-lg font-bold">Reach Us Before the Bang</p>
							<div class="flex w-fit gap-5">
								<button
									aria-label="whatsapp"
									class="cursor-pointer transition-all duration-300 hover:scale-110"
									onclick={() => {
										window.open('https://wa.me/9025946872', '_blank');
									}}
								>
									<svg
										width="35"
										height="35"
										viewBox="0 0 32 32"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z"
											fill="#BFC8D0"
										/>
										<path
											d="M28 16C28 22.6274 22.6274 28 16 28C13.4722 28 11.1269 27.2184 9.19266 25.8837L5.09091 26.9091L6.16576 22.8784C4.80092 20.9307 4 18.5589 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z"
											fill="url(#paint0_linear_87_7264)"
										/>
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 18.5109 2.661 20.8674 3.81847 22.905L2 30L9.31486 28.3038C11.3014 29.3854 13.5789 30 16 30ZM16 27.8462C22.5425 27.8462 27.8462 22.5425 27.8462 16C27.8462 9.45755 22.5425 4.15385 16 4.15385C9.45755 4.15385 4.15385 9.45755 4.15385 16C4.15385 18.5261 4.9445 20.8675 6.29184 22.7902L5.23077 26.7692L9.27993 25.7569C11.1894 27.0746 13.5046 27.8462 16 27.8462Z"
											fill="white"
										/>
										<path
											d="M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z"
											fill="white"
										/>
										<defs>
											<linearGradient
												id="paint0_linear_87_7264"
												x1="26.5"
												y1="7"
												x2="4"
												y2="28"
												gradientUnits="userSpaceOnUse"
											>
												<stop stop-color="#5BD066" />
												<stop offset="1" stop-color="#27B43E" />
											</linearGradient>
										</defs>
									</svg>
								</button>

								<button
									aria-label="youtube"
									class="cursor-pointer transition-all duration-300 hover:scale-110"
									onclick={() => {
										window.open(
											'https://youtube.com/@phoenix_brand_crackers?si=UW5whOWhAGEzvf9d',
											'_blank'
										);
									}}
								>
									<svg
										width="40"
										height="40"
										viewBox="0 -7 48 48"
										version="1.1"
										xmlns="http://www.w3.org/2000/svg"
										xmlns:xlink="http://www.w3.org/1999/xlink"
									>
										<title>Youtube-color</title>
										<desc>Created with Sketch.</desc>
										<defs> </defs>
										<g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
											<g id="Color-" transform="translate(-200.000000, -368.000000)" fill="#CE1312">
												<path
													d="M219.044,391.269916 L219.0425,377.687742 L232.0115,384.502244 L219.044,391.269916 Z M247.52,375.334163 C247.52,375.334163 247.0505,372.003199 245.612,370.536366 C243.7865,368.610299 241.7405,368.601235 240.803,368.489448 C234.086,368 224.0105,368 224.0105,368 L223.9895,368 C223.9895,368 213.914,368 207.197,368.489448 C206.258,368.601235 204.2135,368.610299 202.3865,370.536366 C200.948,372.003199 200.48,375.334163 200.48,375.334163 C200.48,375.334163 200,379.246723 200,383.157773 L200,386.82561 C200,390.73817 200.48,394.64922 200.48,394.64922 C200.48,394.64922 200.948,397.980184 202.3865,399.447016 C204.2135,401.373084 206.612,401.312658 207.68,401.513574 C211.52,401.885191 224,402 224,402 C224,402 234.086,401.984894 240.803,401.495446 C241.7405,401.382148 243.7865,401.373084 245.612,399.447016 C247.0505,397.980184 247.52,394.64922 247.52,394.64922 C247.52,394.64922 248,390.73817 248,386.82561 L248,383.157773 C248,379.246723 247.52,375.334163 247.52,375.334163 L247.52,375.334163 Z"
													id="Youtube"
												>
												</path>
											</g>
										</g>
									</svg>
								</button>
								<button
									aria-label="instagram"
									class="cursor-pointer transition-all duration-300 hover:scale-110"
									onclick={(e) => {
										window.open(
											'https://www.instagram.com/srivi_crackers?igsh=b2llZnJnaHBrM29l',
											'_blank'
										);
									}}
								>
									<svg
										width="35"
										height="35"
										viewBox="0 0 3364.7 3364.7"
										xmlns="http://www.w3.org/2000/svg"
										><defs
											><radialGradient
												id="0"
												cx="217.76"
												cy="3290.99"
												r="4271.92"
												gradientUnits="userSpaceOnUse"
												><stop offset=".09" stop-color="#fa8f21" /><stop
													offset=".78"
													stop-color="#d82d7e"
												/></radialGradient
											><radialGradient
												id="1"
												cx="2330.61"
												cy="3182.95"
												r="3759.33"
												gradientUnits="userSpaceOnUse"
												><stop offset=".64" stop-color="#8c3aaa" stop-opacity="0" /><stop
													offset="1"
													stop-color="#8c3aaa"
												/></radialGradient
											></defs
										><path
											d="M853.2,3352.8c-200.1-9.1-308.8-42.4-381.1-70.6-95.8-37.3-164.1-81.7-236-153.5S119.7,2988.6,82.6,2892.8c-28.2-72.3-61.5-181-70.6-381.1C2,2295.4,0,2230.5,0,1682.5s2.2-612.8,11.9-829.3C21,653.1,54.5,544.6,82.5,472.1,119.8,376.3,164.3,308,236,236c71.8-71.8,140.1-116.4,236-153.5C544.3,54.3,653,21,853.1,11.9,1069.5,2,1134.5,0,1682.3,0c548,0,612.8,2.2,829.3,11.9,200.1,9.1,308.6,42.6,381.1,70.6,95.8,37.1,164.1,81.7,236,153.5s116.2,140.2,153.5,236c28.2,72.3,61.5,181,70.6,381.1,9.9,216.5,11.9,281.3,11.9,829.3,0,547.8-2,612.8-11.9,829.3-9.1,200.1-42.6,308.8-70.6,381.1-37.3,95.8-81.7,164.1-153.5,235.9s-140.2,116.2-236,153.5c-72.3,28.2-181,61.5-381.1,70.6-216.3,9.9-281.3,11.9-829.3,11.9-547.8,0-612.8-1.9-829.1-11.9"
											fill="url(#0)"
										/><path
											d="M853.2,3352.8c-200.1-9.1-308.8-42.4-381.1-70.6-95.8-37.3-164.1-81.7-236-153.5S119.7,2988.6,82.6,2892.8c-28.2-72.3-61.5-181-70.6-381.1C2,2295.4,0,2230.5,0,1682.5s2.2-612.8,11.9-829.3C21,653.1,54.5,544.6,82.5,472.1,119.8,376.3,164.3,308,236,236c71.8-71.8,140.1-116.4,236-153.5C544.3,54.3,653,21,853.1,11.9,1069.5,2,1134.5,0,1682.3,0c548,0,612.8,2.2,829.3,11.9,200.1,9.1,308.6,42.6,381.1,70.6,95.8,37.1,164.1,81.7,236,153.5s116.2,140.2,153.5,236c28.2,72.3,61.5,181,70.6,381.1,9.9,216.5,11.9,281.3,11.9,829.3,0,547.8-2,612.8-11.9,829.3-9.1,200.1-42.6,308.8-70.6,381.1-37.3,95.8-81.7,164.1-153.5,235.9s-140.2,116.2-236,153.5c-72.3,28.2-181,61.5-381.1,70.6-216.3,9.9-281.3,11.9-829.3,11.9-547.8,0-612.8-1.9-829.1-11.9"
											fill="url(#1)"
										/><path
											d="M1269.25,1689.52c0-230.11,186.49-416.7,416.6-416.7s416.7,186.59,416.7,416.7-186.59,416.7-416.7,416.7-416.6-186.59-416.6-416.7m-225.26,0c0,354.5,287.36,641.86,641.86,641.86s641.86-287.36,641.86-641.86-287.36-641.86-641.86-641.86S1044,1335,1044,1689.52m1159.13-667.31a150,150,0,1,0,150.06-149.94h-0.06a150.07,150.07,0,0,0-150,149.94M1180.85,2707c-121.87-5.55-188.11-25.85-232.13-43-58.36-22.72-100-49.78-143.78-93.5s-70.88-85.32-93.5-143.68c-17.16-44-37.46-110.26-43-232.13-6.06-131.76-7.27-171.34-7.27-505.15s1.31-373.28,7.27-505.15c5.55-121.87,26-188,43-232.13,22.72-58.36,49.78-100,93.5-143.78s85.32-70.88,143.78-93.5c44-17.16,110.26-37.46,232.13-43,131.76-6.06,171.34-7.27,505-7.27S2059.13,666,2191,672c121.87,5.55,188,26,232.13,43,58.36,22.62,100,49.78,143.78,93.5s70.78,85.42,93.5,143.78c17.16,44,37.46,110.26,43,232.13,6.06,131.87,7.27,171.34,7.27,505.15s-1.21,373.28-7.27,505.15c-5.55,121.87-25.95,188.11-43,232.13-22.72,58.36-49.78,100-93.5,143.68s-85.42,70.78-143.78,93.5c-44,17.16-110.26,37.46-232.13,43-131.76,6.06-171.34,7.27-505.15,7.27s-373.28-1.21-505-7.27M1170.5,447.09c-133.07,6.06-224,27.16-303.41,58.06-82.19,31.91-151.86,74.72-221.43,144.18S533.39,788.47,501.48,870.76c-30.9,79.46-52,170.34-58.06,303.41-6.16,133.28-7.57,175.89-7.57,515.35s1.41,382.07,7.57,515.35c6.06,133.08,27.16,223.95,58.06,303.41,31.91,82.19,74.62,152,144.18,221.43s139.14,112.18,221.43,144.18c79.56,30.9,170.34,52,303.41,58.06,133.35,6.06,175.89,7.57,515.35,7.57s382.07-1.41,515.35-7.57c133.08-6.06,223.95-27.16,303.41-58.06,82.19-32,151.86-74.72,221.43-144.18s112.18-139.24,144.18-221.43c30.9-79.46,52.1-170.34,58.06-303.41,6.06-133.38,7.47-175.89,7.47-515.35s-1.41-382.07-7.47-515.35c-6.06-133.08-27.16-224-58.06-303.41-32-82.19-74.72-151.86-144.18-221.43S2586.8,537.06,2504.71,505.15c-79.56-30.9-170.44-52.1-303.41-58.06C2068,441,2025.41,439.52,1686,439.52s-382.1,1.41-515.45,7.57"
											fill="#ffffff"
										/></svg
									>
								</button>
							</div>

							<div class="flex w-full flex-col gap-2 max-md:items-center">
								<div class="flex w-fit gap-2">
									<svg
										width="25"
										height="25"
										viewBox="0 0 32 32"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z"
											fill="#BFC8D0"
										/>
										<path
											d="M28 16C28 22.6274 22.6274 28 16 28C13.4722 28 11.1269 27.2184 9.19266 25.8837L5.09091 26.9091L6.16576 22.8784C4.80092 20.9307 4 18.5589 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z"
											fill="url(#paint0_linear_87_7264)"
										/>
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 18.5109 2.661 20.8674 3.81847 22.905L2 30L9.31486 28.3038C11.3014 29.3854 13.5789 30 16 30ZM16 27.8462C22.5425 27.8462 27.8462 22.5425 27.8462 16C27.8462 9.45755 22.5425 4.15385 16 4.15385C9.45755 4.15385 4.15385 9.45755 4.15385 16C4.15385 18.5261 4.9445 20.8675 6.29184 22.7902L5.23077 26.7692L9.27993 25.7569C11.1894 27.0746 13.5046 27.8462 16 27.8462Z"
											fill="white"
										/>
										<path
											d="M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z"
											fill="white"
										/>
										<defs>
											<linearGradient
												id="paint0_linear_87_7264"
												x1="26.5"
												y1="7"
												x2="4"
												y2="28"
												gradientUnits="userSpaceOnUse"
											>
												<stop stop-color="#5BD066" />
												<stop offset="1" stop-color="#27B43E" />
											</linearGradient>
										</defs>
									</svg>
									<a
										class="text-ls text-darkBlue font-semibold"
										href="https://wa.me/9025946872"
										target="_blank"
									>
										+91 9025946872
									</a>
								</div>

								<div class="flex w-fit gap-2">
									<svg
										width="25"
										height="25"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M15.5562 14.5477L15.1007 15.0272C15.1007 15.0272 14.0181 16.167 11.0631 13.0559C8.10812 9.94484 9.1907 8.80507 9.1907 8.80507L9.47752 8.50311C10.1841 7.75924 10.2507 6.56497 9.63424 5.6931L8.37326 3.90961C7.61028 2.8305 6.13596 2.68795 5.26145 3.60864L3.69185 5.26114C3.25823 5.71766 2.96765 6.30945 3.00289 6.96594C3.09304 8.64546 3.81071 12.259 7.81536 16.4752C12.0621 20.9462 16.0468 21.1239 17.6763 20.9631C18.1917 20.9122 18.6399 20.6343 19.0011 20.254L20.4217 18.7584C21.3806 17.7489 21.1102 16.0182 19.8833 15.312L17.9728 14.2123C17.1672 13.7486 16.1858 13.8848 15.5562 14.5477Z"
											class="fill-darkBlue"
										/>
										<path
											d="M13.2595 1.87983C13.3257 1.47094 13.7122 1.19357 14.1211 1.25976C14.1464 1.26461 14.2279 1.27983 14.2705 1.28933C14.3559 1.30834 14.4749 1.33759 14.6233 1.38082C14.9201 1.46726 15.3347 1.60967 15.8323 1.8378C16.8286 2.29456 18.1544 3.09356 19.5302 4.46936C20.906 5.84516 21.705 7.17097 22.1617 8.16725C22.3899 8.66487 22.5323 9.07947 22.6187 9.37625C22.6619 9.52466 22.6912 9.64369 22.7102 9.72901C22.7197 9.77168 22.7267 9.80594 22.7315 9.83125L22.7373 9.86245C22.8034 10.2713 22.5286 10.6739 22.1197 10.7401C21.712 10.8061 21.3279 10.53 21.2601 10.1231C21.258 10.1121 21.2522 10.0828 21.2461 10.0551C21.2337 9.9997 21.2124 9.91188 21.1786 9.79572C21.1109 9.56339 20.9934 9.21806 20.7982 8.79238C20.4084 7.94207 19.7074 6.76789 18.4695 5.53002C17.2317 4.29216 16.0575 3.59117 15.2072 3.20134C14.7815 3.00618 14.4362 2.88865 14.2038 2.82097C14.0877 2.78714 13.9417 2.75363 13.8863 2.7413C13.4793 2.67347 13.1935 2.28755 13.2595 1.87983Z"
											class="fill-darkBlue"
										/>
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M13.4857 5.3293C13.5995 4.93102 14.0146 4.7004 14.4129 4.81419L14.2069 5.53534C14.4129 4.81419 14.4129 4.81419 14.4129 4.81419L14.4144 4.81461L14.4159 4.81505L14.4192 4.81602L14.427 4.81834L14.4468 4.8245C14.4618 4.82932 14.4807 4.8356 14.5031 4.84357C14.548 4.85951 14.6074 4.88217 14.6802 4.91337C14.8259 4.97581 15.0249 5.07223 15.2695 5.21694C15.7589 5.50662 16.4271 5.9878 17.2121 6.77277C17.9971 7.55775 18.4782 8.22593 18.7679 8.7154C18.9126 8.95991 19.009 9.15897 19.0715 9.30466C19.1027 9.37746 19.1254 9.43682 19.1413 9.48173C19.1493 9.50418 19.1555 9.52301 19.1604 9.53809L19.1665 9.55788L19.1688 9.56563L19.1698 9.56896L19.1702 9.5705C19.1702 9.5705 19.1707 9.57194 18.4495 9.77798L19.1707 9.57194C19.2845 9.97021 19.0538 10.3853 18.6556 10.4991C18.2607 10.6119 17.8492 10.3862 17.7313 9.99413L17.7276 9.98335C17.7223 9.96832 17.7113 9.93874 17.6928 9.89554C17.6558 9.8092 17.5887 9.66797 17.4771 9.47938C17.2541 9.10264 16.8514 8.53339 16.1514 7.83343C15.4515 7.13348 14.8822 6.73078 14.5055 6.50781C14.3169 6.39619 14.1757 6.32909 14.0893 6.29209C14.0461 6.27358 14.0165 6.26254 14.0015 6.25721L13.9907 6.25352C13.5987 6.13564 13.3729 5.72419 13.4857 5.3293Z"
											class="fill-darkBlue"
										/>
									</svg>
									<a class=" text-darkBlue font-semibold" href="tel:+918838674753"
										>+91 883 867 4753</a
									>
								</div>
								<div class="flex h-fit w-fit items-center gap-4">
									<svg
										width="28"
										height="28"
										viewBox="0 -3.5 32 32"
										version="1.1"
										xmlns="http://www.w3.org/2000/svg"
										xmlns:xlink="http://www.w3.org/1999/xlink"
									>
										<title>mail</title>
										<desc>Created with Sketch Beta.</desc>
										<defs> </defs>
										<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
											<g
												id="Icon-Set-Filled"
												transform="translate(-414.000000, -261.000000)"
												class="fill-darkBlue"
											>
												<path
													d="M430,275.916 L426.684,273.167 L415.115,285.01 L444.591,285.01 L433.235,273.147 L430,275.916 L430,275.916 Z M434.89,271.89 L445.892,283.329 C445.955,283.107 446,282.877 446,282.634 L446,262.862 L434.89,271.89 L434.89,271.89 Z M414,262.816 L414,282.634 C414,282.877 414.045,283.107 414.108,283.329 L425.147,271.927 L414,262.816 L414,262.816 Z M445,261 L415,261 L430,273.019 L445,261 L445,261 Z"
													id="mail"
												>
												</path>
											</g>
										</g>
									</svg>
									<a
										class="text-ls text-darkBlue font-semibold text-wrap"
										href="mailto:srivicrackes@gmail.com">srivicrackes@gmail.com</a
									>
								</div>
								<!-- <div class="flex h-fit w-fit flex-col gap-3">
									<p class="text-lightbg text-lg font-bold max-sm:text-center">
										For more update follow this channel
									</p>
									<div class="flex items-center gap-3">
										<svg
											width="25"
											height="25"
											viewBox="0 0 32 32"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fill-rule="evenodd"
												clip-rule="evenodd"
												d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z"
												fill="#BFC8D0"
											/>
											<path
												d="M28 16C28 22.6274 22.6274 28 16 28C13.4722 28 11.1269 27.2184 9.19266 25.8837L5.09091 26.9091L6.16576 22.8784C4.80092 20.9307 4 18.5589 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z"
												fill="url(#paint0_linear_87_7264)"
											/>
											<path
												fill-rule="evenodd"
												clip-rule="evenodd"
												d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 18.5109 2.661 20.8674 3.81847 22.905L2 30L9.31486 28.3038C11.3014 29.3854 13.5789 30 16 30ZM16 27.8462C22.5425 27.8462 27.8462 22.5425 27.8462 16C27.8462 9.45755 22.5425 4.15385 16 4.15385C9.45755 4.15385 4.15385 9.45755 4.15385 16C4.15385 18.5261 4.9445 20.8675 6.29184 22.7902L5.23077 26.7692L9.27993 25.7569C11.1894 27.0746 13.5046 27.8462 16 27.8462Z"
												fill="white"
											/>
											<path
												d="M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z"
												fill="white"
											/>
											<defs>
												<linearGradient
													id="paint0_linear_87_7264"
													x1="26.5"
													y1="7"
													x2="4"
													y2="28"
													gradientUnits="userSpaceOnUse"
												>
													<stop stop-color="#5BD066" />
													<stop offset="1" stop-color="#27B43E" />
												</linearGradient>
											</defs>
										</svg>
										<a
											href="https://whatsapp.com/channel/0029Vb6c39P7dmejAqhTEZ39"
											class="text-darkBlue font-semibold max-sm:text-center"
										>
											Click here to join WhatsApp channel</a
										>
									</div>
								</div> -->
							</div>
						</div>
					</div>
				</footer>

				<div
					id="fireworks"
					class="absolute h-full w-full overflow-hidden"
					style="top:{storeNew.topPosition}px;pointer-events: none"
					bind:this={fireworksContainer}
				></div>
				<!-- {#if currentRoute == '/home' || currentRoute == '/'}
					{#if showInfo.info}
						<div
							class="bg-tertiory-650 absolute right-3 z-20 flex h-fit w-9/10 flex-col gap-5 rounded-md p-4 md:w-[450px]"
							style="top:{storeNew.topPosition + (wholeContainerHeight - infoHeight - 180)}px;"
							bind:clientHeight={infoHeight}
							in:scale={{ duration: 500, delay: 100 }}
							out:scale={{ duration: 500, delay: 100 }}
						>
							<div class="flex h-fit w-full justify-between">
								<p class="text-lg font-bold text-gray-100 md:text-xl">Dear Customer's</p>
								<button
									aria-label="close"
									class="transistion-all cursor-pointer duration-300 hover:scale-110"
									onclick={closeInfo}
								>
									<svg
										width="30"
										height="30"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM8.96963 8.96965C9.26252 8.67676 9.73739 8.67676 10.0303 8.96965L12 10.9393L13.9696 8.96967C14.2625 8.67678 14.7374 8.67678 15.0303 8.96967C15.3232 9.26256 15.3232 9.73744 15.0303 10.0303L13.0606 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73742 15.3232 9.26254 15.3232 8.96965 15.0303C8.67676 14.7374 8.67676 14.2625 8.96965 13.9697L10.9393 12L8.96963 10.0303C8.67673 9.73742 8.67673 9.26254 8.96963 8.96965Z"
											class="fill-gray-100"
										/>
									</svg>
								</button>
							</div>
							<p
								class="text-gray-100 max-md:text-sm"
								in:scale={{ duration: 500, delay: 100 }}
								out:scale={{ duration: 500, delay: 100 }}
							>
								As per 2018 supreme court order, online sale of firecrackers are not permitted! We
								value our customers and at the same time, respect jurisdiction. We request you to
								add your products to the cart and submit the required crackers through the Get
								Estimate button. We will contact you within 24 hrs and confirm the order through
								WhatsApp or phone call. Please add and submit your enquiries and enjoy your Diwali
								with vedi Crackers.
							</p>
						</div>
					{/if}
				{/if} -->

				{#if currentRoute == '/home' || currentRoute == '/'}
					{#if showInfo.chat}
						<button
							aria-label="customerService"
							class="bg-secondary-450 transistion-all absolute left-16 cursor-pointer rounded-full p-4 duration-300 hover:scale-110 max-md:hidden md:p-5"
							style="top: {storeNew.topPosition + wholeContainerHeight - 300}px;"
							onclick={() => {
								navChange('contactus');
							}}
							in:scale={{ duration: 500, delay: 100 }}
							out:scale={{ duration: 500, delay: 100 }}
						>
							<svg
								class="fill-gray-100"
								height="30"
								width="30"
								version="1.1"
								id="Layer_1"
								xmlns="http://www.w3.org/2000/svg"
								xmlns:xlink="http://www.w3.org/1999/xlink"
								viewBox="0 0 512 512"
								xml:space="preserve"
							>
								<g>
									<g>
										<path
											d="M364.216,323.939c-10.685,9.799-22.695,18.172-35.731,24.812v9.427c0,39.968-32.516,72.484-72.484,72.484
			s-72.484-32.516-72.484-72.484v-9.427c-13.036-6.64-25.047-15.013-35.729-24.812C87.77,324.203,39.026,373.105,39.026,433.183V512
			h433.952v-78.817C472.977,373.105,424.232,324.203,364.216,323.939z"
										/>
									</g>
								</g>
								<g>
									<g>
										<path
											d="M284.73,363.524c-0.198,0.035-0.395,0.073-0.593,0.108c-1.107,0.196-2.215,0.38-3.328,0.553
			c-0.414,0.065-0.829,0.125-1.244,0.186c-1.042,0.153-2.085,0.306-3.131,0.439c-0.477,0.061-0.957,0.109-1.436,0.166
			c-1.573,0.186-3.149,0.35-4.731,0.489c-0.893,0.079-1.788,0.156-2.686,0.221c-0.671,0.048-1.344,0.089-2.017,0.128
			c-1.03,0.061-2.062,0.111-3.097,0.152c-0.553,0.021-1.104,0.047-1.657,0.063c-1.598,0.048-3.201,0.078-4.81,0.078
			s-3.212-0.031-4.81-0.078c-0.554-0.016-1.105-0.042-1.657-0.063c-1.035-0.042-2.068-0.091-3.097-0.152
			c-0.673-0.04-1.345-0.08-2.017-0.128c-0.897-0.064-1.792-0.141-2.686-0.221c-1.582-0.139-3.158-0.303-4.731-0.489
			c-0.478-0.057-0.959-0.105-1.436-0.166c-1.046-0.133-2.089-0.286-3.131-0.439c-0.415-0.062-0.83-0.122-1.244-0.186
			c-1.111-0.172-2.22-0.357-3.328-0.553c-0.198-0.035-0.395-0.073-0.593-0.108c-4.465-0.809-8.894-1.786-13.272-2.976
			c1.231,22.099,19.599,39.698,42.001,39.698c22.402,0,40.77-17.599,42.001-39.698C293.624,361.737,289.195,362.715,284.73,363.524z
			"
										/>
									</g>
								</g>
								<g>
									<g>
										<path
											d="M450.41,138.037c-13.248-37.843-37.764-71.676-69.849-96.092C344.499,14.505,301.427,0,256,0
			s-88.498,14.505-124.559,41.945c-32.086,24.416-56.602,58.248-69.851,96.092c-15.267,3.614-26.665,17.348-26.665,33.703v68.252
			c0,19.101,15.54,34.641,34.641,34.641h41.717c-9.946-20.85-15.524-44.169-15.524-68.767c0-24.598,5.578-47.917,15.525-68.766
			H94.561c11.91-27.801,31.076-52.515,55.3-70.949C180.581,42.774,217.284,30.417,256,30.417s75.419,12.356,106.141,35.734
			c24.223,18.433,43.388,43.148,55.298,70.949h-16.723c9.947,20.849,15.525,44.168,15.525,68.766
			c0,24.598-5.577,47.917-15.525,68.767h41.717c19.101,0,34.641-15.54,34.641-34.641V171.74
			C477.074,155.385,465.677,141.651,450.41,138.037z"
										/>
									</g>
								</g>
								<g>
									<g>
										<path
											d="M256,76.043c-48.738,0-91.282,27.001-113.478,66.827c3.323,0.403,6.68,0.609,10.06,0.609
			c19.882,0,39.094-7.161,54.096-20.164l10.706-9.278l10.013,10.021c20.568,20.583,47.92,31.919,77.018,31.919
			c22.07,0,43.499-6.72,61.526-19.077C342.944,100.372,302.263,76.043,256,76.043z"
										/>
									</g>
								</g>
								<g>
									<g>
										<path
											d="M243.102,265.849h25.796c7.915,0,14.955,3.721,19.483,9.503l77.542-0.495c12.6-19.999,19.901-43.658,19.901-68.991
			c0-14.395-2.359-28.249-6.704-41.2c-22.203,14.111-48.096,21.729-74.705,21.729c-32.728,0-63.73-11.209-88.625-31.812
			c-18.578,12.529-40.578,19.313-63.208,19.313c-7.379,0-14.683-0.729-21.85-2.135c-2.964,10.873-4.555,22.306-4.555,34.106
			c0,71.585,58.238,129.823,129.823,129.823c31.63,0,60.65-11.376,83.195-30.244l-50.771,0.323
			c-4.527,5.814-11.587,9.558-19.527,9.558h-25.796c-13.663,0-24.739-11.076-24.739-24.739S229.438,265.849,243.102,265.849z"
										/>
									</g>
								</g>
							</svg>
						</button>
						<button
							aria-label="customerService"
							class="bg-tertiory-450 transistion-all absolute left-6 cursor-pointer rounded-full p-4 duration-300 hover:scale-110 md:hidden md:p-5"
							style="top: {storeNew.topPosition + wholeContainerHeight - 200}px;"
							onclick={() => {
								navChange('contactus');
							}}
							in:scale={{ duration: 500, delay: 100 }}
							out:scale={{ duration: 500, delay: 100 }}
						>
							<svg
								class="fill-gray-100"
								height="30"
								width="30"
								version="1.1"
								id="Layer_1"
								xmlns="http://www.w3.org/2000/svg"
								xmlns:xlink="http://www.w3.org/1999/xlink"
								viewBox="0 0 512 512"
								xml:space="preserve"
							>
								<g>
									<g>
										<path
											d="M364.216,323.939c-10.685,9.799-22.695,18.172-35.731,24.812v9.427c0,39.968-32.516,72.484-72.484,72.484
			s-72.484-32.516-72.484-72.484v-9.427c-13.036-6.64-25.047-15.013-35.729-24.812C87.77,324.203,39.026,373.105,39.026,433.183V512
			h433.952v-78.817C472.977,373.105,424.232,324.203,364.216,323.939z"
										/>
									</g>
								</g>
								<g>
									<g>
										<path
											d="M284.73,363.524c-0.198,0.035-0.395,0.073-0.593,0.108c-1.107,0.196-2.215,0.38-3.328,0.553
			c-0.414,0.065-0.829,0.125-1.244,0.186c-1.042,0.153-2.085,0.306-3.131,0.439c-0.477,0.061-0.957,0.109-1.436,0.166
			c-1.573,0.186-3.149,0.35-4.731,0.489c-0.893,0.079-1.788,0.156-2.686,0.221c-0.671,0.048-1.344,0.089-2.017,0.128
			c-1.03,0.061-2.062,0.111-3.097,0.152c-0.553,0.021-1.104,0.047-1.657,0.063c-1.598,0.048-3.201,0.078-4.81,0.078
			s-3.212-0.031-4.81-0.078c-0.554-0.016-1.105-0.042-1.657-0.063c-1.035-0.042-2.068-0.091-3.097-0.152
			c-0.673-0.04-1.345-0.08-2.017-0.128c-0.897-0.064-1.792-0.141-2.686-0.221c-1.582-0.139-3.158-0.303-4.731-0.489
			c-0.478-0.057-0.959-0.105-1.436-0.166c-1.046-0.133-2.089-0.286-3.131-0.439c-0.415-0.062-0.83-0.122-1.244-0.186
			c-1.111-0.172-2.22-0.357-3.328-0.553c-0.198-0.035-0.395-0.073-0.593-0.108c-4.465-0.809-8.894-1.786-13.272-2.976
			c1.231,22.099,19.599,39.698,42.001,39.698c22.402,0,40.77-17.599,42.001-39.698C293.624,361.737,289.195,362.715,284.73,363.524z
			"
										/>
									</g>
								</g>
								<g>
									<g>
										<path
											d="M450.41,138.037c-13.248-37.843-37.764-71.676-69.849-96.092C344.499,14.505,301.427,0,256,0
			s-88.498,14.505-124.559,41.945c-32.086,24.416-56.602,58.248-69.851,96.092c-15.267,3.614-26.665,17.348-26.665,33.703v68.252
			c0,19.101,15.54,34.641,34.641,34.641h41.717c-9.946-20.85-15.524-44.169-15.524-68.767c0-24.598,5.578-47.917,15.525-68.766
			H94.561c11.91-27.801,31.076-52.515,55.3-70.949C180.581,42.774,217.284,30.417,256,30.417s75.419,12.356,106.141,35.734
			c24.223,18.433,43.388,43.148,55.298,70.949h-16.723c9.947,20.849,15.525,44.168,15.525,68.766
			c0,24.598-5.577,47.917-15.525,68.767h41.717c19.101,0,34.641-15.54,34.641-34.641V171.74
			C477.074,155.385,465.677,141.651,450.41,138.037z"
										/>
									</g>
								</g>
								<g>
									<g>
										<path
											d="M256,76.043c-48.738,0-91.282,27.001-113.478,66.827c3.323,0.403,6.68,0.609,10.06,0.609
			c19.882,0,39.094-7.161,54.096-20.164l10.706-9.278l10.013,10.021c20.568,20.583,47.92,31.919,77.018,31.919
			c22.07,0,43.499-6.72,61.526-19.077C342.944,100.372,302.263,76.043,256,76.043z"
										/>
									</g>
								</g>
								<g>
									<g>
										<path
											d="M243.102,265.849h25.796c7.915,0,14.955,3.721,19.483,9.503l77.542-0.495c12.6-19.999,19.901-43.658,19.901-68.991
			c0-14.395-2.359-28.249-6.704-41.2c-22.203,14.111-48.096,21.729-74.705,21.729c-32.728,0-63.73-11.209-88.625-31.812
			c-18.578,12.529-40.578,19.313-63.208,19.313c-7.379,0-14.683-0.729-21.85-2.135c-2.964,10.873-4.555,22.306-4.555,34.106
			c0,71.585,58.238,129.823,129.823,129.823c31.63,0,60.65-11.376,83.195-30.244l-50.771,0.323
			c-4.527,5.814-11.587,9.558-19.527,9.558h-25.796c-13.663,0-24.739-11.076-24.739-24.739S229.438,265.849,243.102,265.849z"
										/>
									</g>
								</g>
							</svg>
						</button>
					{/if}
				{/if}
			</main>
		{/if}
		<!-- h-44 w-54 -->
		<!-- {#if currentRoute == '/home' || currentRoute == '/products' || currentRoute == '/quickbuy'}
			<div
				class="absolute right-[2%] {currentRoute == '/home'
					? showInfo.info
						? `bottom-[calc(5%+400px)] md:bottom-[calc(5%+300px)]`
						: 'bottom-[10%] md:bottom-[5%]'
					: currentRoute == '/products'
						? 'bottom-[20%]'
						: 'bottom-[10%] md:bottom-[5%]'} z-40 h-30 w-38 md:h-44 md:w-58"
			>
				<ScaleAnimationButton image={discount3} />
			</div>
		{/if} -->
	</section>
	{#if showSlider}
		<Slider
			close={showMenuSlider}
			containerStyles="absolute left-0 z-40"
			sliderAnimation={{ in: { x: -200, duration: 400 }, out: { x: -200, duration: 400 } }}
			topValue={0}
		>
			<header
				class="relative flex h-full w-full flex-col px-3 {currentRoute == '/' ? '' : 'bg-bg2'}"
			>
				<div class="h-[80px] w-[80px] md:h-[120px] md:w-[120px]">
					<AssetImage imageSrc={logo} />
				</div>
				<button
					aria-label="close"
					class="absolute top-5 right-5 cursor-pointer transition-all duration-300 hover:scale-110"
					onclick={showMenuSlider}
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
							class="fill-secondary-200"
						/>
					</svg>
				</button>
				<nav class="mt-5 flex h-fit w-full flex-col gap-6 px-3 lg:gap-12">
					<button
						onclick={() => {
							navChange('home');
						}}
						class=" {currentRoute == '/'
							? currentRoute == '/'
								? 'text-amber-400'
								: 'text-white'
							: currentRoute == '/home'
								? ' text-tertiory-600 bg-gray-200'
								: 'text-[#222b4b]'} w-4/5 cursor-pointer rounded-md px-4 py-1.5 text-left font-semibold transition-all duration-500 hover:bg-gray-200"
						>Home</button
					>
					<button
						onclick={() => {
							navChange('quickbuy');
						}}
						class=" {currentRoute == '/'
							? currentRoute == '/quickbuy'
								? 'text-amber-400'
								: 'text-white'
							: currentRoute == '/quickbuy'
								? ' text-tertiory-600 bg-gray-200'
								: 'text-[#222b4b]'} w-4/5 cursor-pointer rounded-md px-4 py-1.5 text-left font-semibold transition-all duration-500 hover:bg-gray-200"
						>Quick Buy</button
					>

					<button
						onclick={() => {
							navChange('products');
						}}
						class=" {currentRoute == '/'
							? currentRoute == '/products'
								? 'text-amber-400'
								: 'text-white'
							: currentRoute == '/products'
								? ' text-tertiory-600 bg-gray-200'
								: 'text-[#222b4b]'} w-4/5 cursor-pointer rounded-md px-4 py-1.5 text-left font-semibold transition-all duration-500 hover:bg-gray-200"
						>Shop</button
					><button
						onclick={() => {
							navChange('pricelist');
						}}
						class=" {currentRoute == '/'
							? currentRoute == '/offers'
								? 'text-amber-400'
								: 'text-white'
							: currentRoute == '/pricelist'
								? ' text-tertiory-600 bg-gray-200'
								: 'text-[#222b4b]'} w-4/5 cursor-pointer rounded-md px-4 py-1.5 text-left font-semibold transition-all duration-500 hover:bg-gray-200"
						>Pricelist</button
					><button
						onclick={() => {
							navChange('gallery');
						}}
						class=" {currentRoute == '/'
							? currentRoute == '/gallery'
								? 'text-amber-400'
								: 'text-white'
							: currentRoute == '/gallery'
								? ' text-tertiory-600 bg-gray-200'
								: 'text-[#222b4b]'} w-4/5 cursor-pointer rounded-md px-4 py-1.5 text-left font-semibold transition-all duration-500 hover:bg-gray-200"
						>Gallery</button
					><button
						onclick={() => {
							navChange('contactus');
						}}
						class=" {currentRoute == '/'
							? currentRoute == '/contact'
								? 'text-amber-400'
								: 'text-white'
							: currentRoute == '/contactus'
								? ' text-tertiory-600 bg-gray-200'
								: 'text-[#222b4b]'} w-4/5 cursor-pointer rounded-md px-4 py-1.5 text-left font-semibold transition-all duration-500 hover:bg-gray-200"
						>Contact Us</button
					>
				</nav>
			</header>
		</Slider>
	{/if}

	{#if storeNew.cartNotify.show}
		<div class="absolute right-3 bottom-3 z-50 h-fit w-1/4">
			<CartNotifyCard
				title={storeNew.cartNotify.title}
				data={storeNew.cartNotify.data}
				closeNotify={closeToast}
			/>
		</div>
	{/if}

	{#if storeNew.toast.show}
		<div class=" absolute top-[168px] flex h-fit w-full justify-center">
			<Toast
				{closeToast}
				action={storeNew.toast.action}
				duration={storeNew.toast.duration}
				title={storeNew.toast.title}
			/>
		</div>
	{/if}
</div>

<!-- // "dev": "vite dev", -->

<style lang="postcss">
	::-webkit-scrollbar {
		@apply h-[5px] w-[5px];
	}
	::-webkit-scrollbar-track {
		@apply rounded-[5px] bg-[#f5f5f5];
	}
	::-webkit-scrollbar-thumb {
		@apply w-[1px] rounded-[5px] bg-[#f12711];
	}

	.scrollText {
		white-space: nowrap;
		animation: scrollText 50s linear infinite;
		cursor: pointer;
	}

	/* Define the animation */
	@keyframes scrollText {
		0% {
			transform: translateX(80%);
		}

		100% {
			/* transform: translateX(var(--scrollPercentage)); */
			transform: translateX(-100%);
		}
	}

	.scrollText:hover {
		animation-play-state: paused;
	}
</style>
