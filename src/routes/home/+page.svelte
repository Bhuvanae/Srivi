<script>
	// @ts-nocheck

	import AssetImage from '$lib/assetImage.svelte';
	import InitialAnimation from '$lib/initialAnimation.svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { fade } from 'svelte/transition';
	import image1 from '$lib/assets/image1.webp';
	import CategoryCard from '$lib/categoryCard.svelte';
	import category1 from '$lib/assets/category1.png';
	import giftBox from '$lib/assets/giftbox.png';
	import WhyCard from '$lib/whyCard.svelte';
	import { linear } from 'svelte/easing';
	import { onDestroy } from 'svelte';
	import star from '$lib/assets/star.png';
	import bg1 from '$lib/assets/bg1.webp';
	import bg2 from '$lib/assets/bg2.webp';
	import bg3 from '$lib/assets/bg3.webp';
	import bg4 from '$lib/assets/bg4.jpg';
	import bg5 from '$lib/assets/bg5.webp';

	import main from '$lib/assets/mainimage.webp';
	import main1 from '$lib/assets/homePage.webp';
	import main2 from '$lib/assets/offer.webp';
	import { fetchApi } from '$lib/fetchApi';
	import CategoriesCard from '$lib/categoriesCard.svelte';
	import { goto } from '$app/navigation';
	import ReviewCard from '$lib/reviewCard.svelte';
	import catgo from '$lib/assets/category3.png';
	import packHome from '$lib/assets/packhome.png';

	let initialImage = false;

	let bannerImages = [bg4, bg1, bg2, bg3, bg5];

	let currentIndex = $state(0);

	let currentReview = $state(0);

	let currentCategory = $state(0);

	let reviewAction = $state('next');

	const nextSlide = () => {
		currentIndex = (currentIndex + 1) % bannerImages.length;
		// if (homeData.feed) {
		// 	currentReview = (currentReview + 1) % homeData.feed.length;
		// }
	};
	// Auto change slide every 3 seconds
	let interval = setInterval(nextSlide, 3000);
	let intersection = $state({
		image1: false,
		image2: false,
		image3: false,
		image4: false,
		image5: false
	});

	let homeData = $state({ feed: [], typeData: [] });

	let whyUsContent = [
		{
			title: 'Premium Quality Fireworks',
			info: `We offer only premium-grade fireworks designed for vibrant colors, loud effects, and total safety. Perfect for all celebrations, our products guarantee joyful moments you can trust year after year`,
			image: `<svg width="45" height="45" viewBox="0 0 1024 1024" class="fill-gray-100" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M678.584675 765.172506v157.995691l75.697852 31.505938V723.768586a429.379161 429.379161 0 0 1-75.697852 41.40392zM269.717473 723.768586V953.098138l75.697852-31.505938v-156.419694a429.309162 429.309162 0 0 1-75.697852-41.40392zM511.999 798.78444a428.955162 428.955162 0 0 1-105.993793-13.241974v238.457534L511.999 979.886086 617.992793 1023.998V785.542466A429.025162 429.025162 0 0 1 511.999 798.78444zM511.999 0C308.479398 0 142.903721 165.575677 142.903721 369.097279S308.479398 738.192558 511.999 738.192558s369.097279-165.575677 369.097279-369.097279S715.520602 0 511.999 0z m0 660.198711c-161.345685 0-292.611428-131.265744-292.611428-292.611429 0-161.347685 131.265744-292.613428 292.611428-292.613428s292.611428 131.265744 292.611428 292.613428c0 161.347685-131.263744 292.611428-292.611428 292.611429zM511.999 135.563735c-127.93575 0-232.021547 104.083797-232.021547 232.023547S384.06325 599.606829 511.999 599.606829s232.021547-104.083797 232.021547-232.021547c0-127.93775-104.083797-232.021547-232.021547-232.021547zM607.360814 502.999018L511.999 452.865115 416.639186 502.999018l18.211965-106.183793-77.14785-75.199853 106.617792-15.49397L511.999 209.509591l47.679907 96.611811 106.617792 15.49397-77.14785 75.199853 18.211965 106.183793z" /></svg>`
		},
		{
			title: 'Fast & Secure Shipping',
			info: `Our reliable delivery network ensures your fireworks arrive quickly, securely packaged, and always on time. No matter where you are, celebrate stress-free knowing your order will reach you safely.`,
			image: `<svg class="fill-gray-100" width="45" height="45" viewBox="0 -64 640 640" xmlns="http://www.w3.org/2000/svg"><path d="M624 352h-16V243.9c0-12.7-5.1-24.9-14.1-33.9L494 110.1c-9-9-21.2-14.1-33.9-14.1H416V48c0-26.5-21.5-48-48-48H112C85.5 0 64 21.5 64 48v48H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h272c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H40c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h208c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h208c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H64v128c0 53 43 96 96 96s96-43 96-96h128c0 53 43 96 96 96s96-43 96-96h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zM160 464c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm320 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-208H416V144h44.1l99.9 99.9V256z"/></svg>`
		},
		{
			title: 'Exclusive Discounts & Deals',
			info: `Get big savings with festival combos, bulk orders, and special seasonal offers. Shop more crackers at the best prices without compromising on quality — perfect for families and large celebrations.`,
			image: `<svg class="fill-gray-100" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 width="45" height="45" viewBox="0 0 352.326 352.327"
	 xml:space="preserve">
<g>
	<g>
		<path d="M204.994,193.713c-4.475,0-8.194,1.516-10.757,4.385c-2.3,2.571-3.564,6.068-3.564,9.847
			c0,6.939,4.532,14.41,14.482,14.41c4.474,0,8.194-1.516,10.757-4.386c2.298-2.571,3.562-6.067,3.562-9.846
			C219.475,201.183,214.943,193.713,204.994,193.713z"/>
		<path d="M147.903,158.913c4.487,0,8.217-1.513,10.787-4.373c2.3-2.562,3.567-6.045,3.567-9.808
			c0-6.918-4.542-14.363-14.517-14.363c-10.17,0-14.722,7.124-14.722,14.183C133.018,151.469,137.676,158.913,147.903,158.913z"/>
		<path d="M176.164,62.745c-62.539,0-113.418,50.879-113.418,113.418c0,62.539,50.879,113.418,113.418,113.418
			s113.418-50.879,113.418-113.418C289.582,113.624,238.703,62.745,176.164,62.745z M127.072,126.31
			c5.051-5.505,12.198-8.415,20.668-8.415c18.203,0,27.728,13.497,27.728,26.828c0,7.001-2.477,13.542-6.973,18.419
			c-5.073,5.501-12.25,8.41-20.755,8.41c-18.122,0-27.604-13.497-27.604-26.829C120.136,137.725,122.599,131.186,127.072,126.31z
			 M144.096,222.29c-1.101,1.229-3.351,2.234-5.001,2.234h-11.697c-1.65,0-2.097-1.004-0.994-2.229l82.535-91.765
			c1.104-1.227,3.355-2.255,5.006-2.285l11.584-0.212c1.649-0.03,2.099,0.951,0.998,2.18L144.096,222.29z M225.354,226.182
			c-4.977,5.396-12.018,8.25-20.359,8.25c-17.778,0-27.08-13.239-27.08-26.316c0-6.865,2.417-13.28,6.805-18.063
			c4.955-5.399,11.965-8.255,20.274-8.255c17.856,0,27.198,13.24,27.198,26.317C232.192,214.981,229.764,221.397,225.354,226.182z"
			/>
		<path d="M322.759,223.797c5.22-16.073,29.567-29.82,29.567-47.634c0-17.814-24.348-31.562-29.567-47.635
			c-5.409-16.659,6.021-42.056-4.07-55.922c-10.192-14.005-37.947-10.933-51.952-21.125C252.87,41.389,247.272,13.989,230.612,8.58
			c-16.073-5.219-36.636,13.487-54.449,13.487c-17.814,0-38.376-18.707-54.45-13.487c-16.659,5.409-22.256,32.81-36.123,42.901
			c-14.005,10.192-41.759,7.12-51.952,21.125c-10.091,13.867,1.338,39.264-4.071,55.923C24.348,144.602,0,158.35,0,176.164
			c0,17.812,24.348,31.561,29.567,47.635c5.409,16.659-6.021,42.056,4.071,55.922c10.192,14.005,37.947,10.934,51.952,21.125
			c13.866,10.092,19.464,37.492,36.124,42.901c16.073,5.219,36.635-13.488,54.449-13.488c17.813,0,38.376,18.707,54.45,13.487
			c16.659-5.409,22.256-32.811,36.123-42.901c14.005-10.191,41.759-7.12,51.952-21.125
			C328.78,265.853,317.35,240.457,322.759,223.797z M176.164,306.582c-71.913,0-130.418-58.505-130.418-130.418
			c0-71.914,58.505-130.418,130.418-130.418s130.418,58.505,130.418,130.418C306.582,248.077,248.077,306.582,176.164,306.582z"/>
	</g>
</g>
</svg>`
		}
	];

	let clickedButton = $state('next');

	let scrollContainer;

	let visibleItems = $state(4); // Default for mobile
	let cardWidth = 144; // Default mobile card width (36 * 4)
	let cardWidthWithGap = $state(208);
	let buttonVisible = $state('two');

	onMount(async () => {
		let getFeedback = await fetchApi('/home', 'GET', '', '');
		if (getFeedback.resStatus == 200) {
			homeData = getFeedback.data;
			let reviewScroll = setInterval(changeReview, 4500);
			visibleItems = Number((scrollContainer.clientWidth / cardWidthWithGap).toFixed());
			if (visibleItems >= homeData.typeData.length) {
				buttonVisible = 'two';
			} else {
				buttonVisible = 'none';
				let autoScroll = 'next';
				let cateScroll = setInterval(() => {
					if (currentCategory == 0) {
						autoScroll = 'next';
					}
					if (homeData.typeData.length == visibleItems + currentCategory) {
						autoScroll = 'back';
					}

					changeCategory(autoScroll, 'autoScroll');
				}, 2000);
			}
		}

		const options = {
			root: null, // viewport
			rootMargin: '0px',
			threshold: 0.5 // Intersection ratio
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.target.id == 'image1') {
					if (entry.isIntersecting) {
						intersection.image1 = true;
					}
				} else if (entry.target.id == 'image2') {
					if (entry.isIntersecting) {
						intersection.image2 = true;
					}
				} else if (entry.target.id == 'image3') {
					if (entry.isIntersecting) {
						intersection.image3 = true;
					}
				} else if (entry.target.id == 'image4') {
					if (entry.isIntersecting) {
						intersection.image4 = true;
					}
				} else if (entry.target.id == 'image5') {
					if (entry.isIntersecting) {
						intersection.image5 = true;
					}
				}
			});
		}, options);

		const image1 = document.querySelector('#image1');
		const image2 = document.querySelector('#image2');
		const image3 = document.querySelector('#image3');
		const image4 = document.querySelector('#image4');
		const image5 = document.querySelector('#image5');

		observer.observe(image1);
		observer.observe(image2);
		observer.observe(image3);
		observer.observe(image4);
		observer.observe(image5);

		// updateVisibleItems();
		window.addEventListener('resize', updateVisibleItems);

		// Cleanup
		return () => {
			observer.unobserve(image1);
			observer.unobserve(image2);
			observer.unobserve(image3);
			observer.unobserve(image4);
			observer.unobserve(image5);

			window.removeEventListener('resize', updateVisibleItems);
		};
	});
	// Cleanup interval when component unmounts
	onDestroy(() => {
		clearInterval(interval);
		// clearInterval(interval);
		// clearInterval(interval);
	});

	function updateVisibleItems() {
		// Adjust for different screen sizes
		if (window.innerWidth >= 768) {
			// md breakpoint
			visibleItems = 5;
			cardWidth = 160; // 40 * 4
			cardWidthWithGap = 224;
		} else {
			visibleItems = 4;
			cardWidth = 144; // 36 * 4
			cardWidthWithGap = 160;
		}
	}

	function typewriter(node, { speed = 5 }) {
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

		if (!valid) {
			throw new Error(`This transition only works on elements with a single text node child`);
		}

		const text = node.textContent;
		const duration = text.length / (speed * 0.01);

		return {
			duration,
			tick: (t) => {
				const i = Math.trunc(text.length * t);
				node.textContent = text.slice(0, i);
			}
		};
	}

	function changeReview() {
		let container = document.getElementById('reviewText');
		let cardContainer = document.getElementById('reviewCardContainer');
		if (container !== null && cardContainer !== null && container && cardContainer) {
			let containerWidth = cardContainer ? cardContainer.clientWidth + 64 : 426;
			let visibleItems = Number((container.clientWidth / containerWidth).toFixed());
			if (currentReview == 0 && reviewAction == 'back') {
				reviewAction = 'next';
			}
			if (currentReview + visibleItems >= homeData.feed.length && reviewAction == 'next') {
				reviewAction = 'back';
			}
			if (reviewAction == 'next') {
				currentReview++;
			} else {
				currentReview--;
			}
			container.scrollTo({
				left: currentReview * containerWidth,
				behavior: 'smooth'
			});
		} else {
		}
	}

	let scrollEventType = $state('button');

	function changeCategory(direction, condition = 'none') {
		scrollEventType = 'button';

		if (scrollContainer !== null && scrollContainer) {
			visibleItems = Number((scrollContainer.clientWidth / cardWidthWithGap).toFixed());

			if (
				direction === 'next' &&
				scrollContainer.scrollLeft + visibleItems * cardWidthWithGap < scrollContainer.scrollWidth
			) {
				if (condition == 'autoScroll') {
					currentCategory++;
					// if (currentCategory + 6) currentCategory++;
				} else {
					currentCategory++;
				}
			} else if (direction === 'back' && currentCategory > 0) {
				currentCategory--;
			} else {
				buttonVisible = direction;
				return;
			}

			scrollContainer.scrollTo({
				left: currentCategory * cardWidthWithGap,
				behavior: 'smooth'
			});
		}
	}
	let currentImage = $state('bg1');

	function scrollCheck(event) {
		if (scrollEventType == 'scroll') {
			if (event.target.scrollLeft < 32) {
				currentCategory = 0;
			} else if (
				event.target.scrollLeft +
					(event.target.clientWidth / cardWidthWithGap).toFixed() * cardWidthWithGap >
				event.target.scrollWidth
			) {
				buttonVisible = 'next';
			} else {
				buttonVisible = 'none';

				if ((event.target.scrollLeft / cardWidthWithGap).toFixed() > 1) {
					currentCategory = (event.target.scrollLeft / cardWidthWithGap).toFixed();
				}
			}
		} else {
			if (
				event.target.scrollLeft +
					(event.target.clientWidth / cardWidthWithGap).toFixed() * cardWidthWithGap >
				event.target.scrollWidth
			) {
				buttonVisible = 'next';
			} else {
				buttonVisible = 'none';

				if ((event.target.scrollLeft / cardWidthWithGap).toFixed() > 1) {
					currentCategory = (event.target.scrollLeft / cardWidthWithGap).toFixed();
				}
			}
		}
	}

	function navigatePage(page) {
		goto(page);
	}
</script>

<section class="relative flex h-fit min-h-[600px] w-full flex-col gap-20 overflow-hidden">
	<div class="relative flex h-[350px] w-full justify-between md:h-[550px]">
		{#each bannerImages as image, index}
			{#if index === currentIndex}
				<img
					src={image}
					alt="Slide"
					in:fly={{ x: 200, duration: 500 }}
					out:fly={{ x: -200, duration: 500 }}
					class="slide object-fill"
				/>
			{/if}
		{/each}
		<div class="absolute bottom-3 flex h-fit w-full items-center justify-center gap-2">
			{#each bannerImages as image, index}
				<div
					class="{index == currentIndex
						? 'h-3 w-3 bg-blue-400'
						: 'h-2.5 w-2.5 bg-blue-50'} rounded-full transition-all duration-200"
				></div>
			{/each}
		</div>
	</div>
	<div
		id="image1"
		class="mt-10 grid h-fit w-full justify-center gap-16 px-3 md:h-[600px] md:grid-cols-[2.5fr_3fr] md:justify-between md:px-10 lg:px-28"
	>
		<div
			class="flex h-full w-full items-center justify-center rounded-xl {intersection.image1
				? ' scale-100 opacity-100'
				: ' scale-150 opacity-0'} transition-all delay-300 duration-1000 max-md:hidden"
		>
			<div class="h-[600px] max-h-[600px] min-h-[600px] w-full overflow-hidden rounded-xl ">
				<AssetImage imageSrc={main2} rounded="rounded-xl" object="object-contain" />
			</div>
		</div>
		<div class="flex h-full w-full justify-center gap-6 md:w-full">
			<div class="flex h-full w-full flex-col justify-center gap-7">
				<div class="moveAnim relative flex h-10 w-full items-center justify-center md:hidden">
					<h3
						class="text-darkBlue text-center text-xl font-bold md:text-4xl md:font-semibold {intersection.image1
							? ' scale-100 opacity-100'
							: 'scale-200 opacity-0'} bg-lightbg w-fit px-4 transition-all duration-700"
					>
						Who We Are
					</h3>
					<div
						class="bg-bg1 faded-line absolute top-5 left-0 -z-1 h-1 w-full rounded-tr-md rounded-bl-md"
					></div>
				</div>

				<div class="relative flex h-12 w-full items-center max-md:hidden">
					<h3
						class="text-darkBlue move {intersection.image1
							? ' right-[calc(100%-232px)] opacity-100'
							: ' right-0 opacity-0'} transistion-all bg-lightbg absolute top-0 w-58 text-center text-4xl font-bold delay-1000 duration-700 md:text-left"
					>
						Who We Are
					</h3>
				</div>

				<p
					class="text-secondary-350 text-sm font-medium tracking-wide max-md:text-center md:text-xl md:leading-8 {intersection.image1
						? ' translate-x-0 opacity-100'
						: ' translate-x-4 opacity-0'} transistion-all delay-[1500ms] duration-700"
				>
					Srivi Crackers is a vibrant new firecracker brand born out of friendship and passion in
					Sivakasi – the heart of India’s fireworks industry. Founded by a group of friends with a
					shared dream, Srivi Crackers brings you the latest and most exciting range of crackers
					designed to make every celebration brighter and more memorable. From dazzling sky shots to
					sparkling fountains, rockets, and innovative fancy items, our collection is fresh, safe,
					and crafted to deliver joy with every spark. 
				</p>
				<p
					class="text-secondary-350 text-sm font-medium max-md:text-center md:text-xl md:leading-8 {intersection.image1
						? ' translate-x-0 opacity-100'
						: ' translate-x-8 opacity-0'} transistion-all delay-[2000ms] duration-700"
				>
					We believe in safe, affordable, and joyful celebrations. That’s why we offer pre-packed
					combo boxes, customized orders, and timely delivery – all at the best prices in the
					market.
				</p>
			</div>
		</div>
	</div>

	<div id="image2" class="flex h-fit w-full flex-col gap-4 px-3 sm:px-10 md:h-fit md:px-28">
		<div class="moveAnim relative flex h-10 w-full items-center justify-center">
			<h3
				class="text-secondary-450 text-center text-lg font-bold md:text-4xl md:font-semibold {intersection.image2
					? ' scale-100 opacity-100'
					: 'scale-200 opacity-0'} bg-lightbg w-fit px-4 transition-all duration-700"
			>
				Shop by Categories
			</h3>
			<div
				class="bg-bg1 faded-line absolute top-5 left-0 -z-1 h-1 w-full rounded-tr-md rounded-bl-md"
			></div>
		</div>

		<div class="relative h-fit w-full">
			{#if buttonVisible !== 'two'}
				<button
					aria-label="back"
					class="absolute top-1/2 left-0 z-10 -translate-y-1/2 transform md:-left-16 {currentCategory ==
					0
						? 'cursor-not-allowed opacity-50'
						: 'cursor-pointer'}"
					onclick={() => changeCategory('back')}
				>
					<svg
						width="40"
						height="40"
						viewBox="0 0 64 64"
						class="iconify iconify--emojione-monotone {currentCategory == 0
							? 'fill-gray-300'
							: 'fill-primary-50'}"
						preserveAspectRatio="xMidYMid meet"
					>
						<path
							d="M32 2C15.432 2 2 15.432 2 32c0 16.568 13.432 30 30 30s30-13.432 30-30C62 15.432 48.568 2 32 2zm17 35.428H30.307V48L15 32l15.307-16v11.143H49v10.285z"
						></path>
					</svg>
				</button>
				<button
					aria-label="next"
					class="absolute top-1/2 right-0 z-10 -translate-y-1/2 transform md:-right-16 {homeData
						.typeData.length <
					visibleItems + currentCategory
						? 'cursor-not-allowed opacity-50'
						: 'cursor-pointer'}"
					onclick={() => changeCategory('next')}
				>
					<svg
						width="40"
						height="40"
						viewBox="0 0 64 64"
						class="iconify iconify--emojione-monotone {homeData.typeData.length >
						visibleItems + currentCategory
							? 'fill-primary-50'
							: 'fill-gray-300'}"
						preserveAspectRatio="xMidYMid meet"
					>
						<path
							d="M32 2C15.432 2 2 15.432 2 32c0 16.568 13.432 30 30 30s30-13.432 30-30C62 15.432 48.568 2 32 2zm1.693 46V37.428H15V27.143h18.693V16L49 32L33.693 48z"
						></path>
					</svg>
				</button>
			{/if}

			<!-- Scrollable Container -->
			<!-- onscroll={(e) => {
					scrollEventType = 'scroll';
					scrollCheck(e);
				}} -->
			<div
				class="no-scrollbar relative mx-auto flex w-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 py-8 md:gap-16 md:px-8"
				bind:this={scrollContainer}
			>
				{#each homeData.typeData as type, i}
					{#if type.result.type !== 'PACK'}
						<div
							class="h-48 w-36 flex-shrink-0 snap-start md:w-40 {intersection.image2
								? 'translate-y-0 opacity-100'
								: 'translate-y-10 opacity-0'} transition-all duration-1000"
							style="transition-delay: {i * 300}ms;"
						>
							<CategoriesCard
								name={type.result.type}
								items={type.result.data.length}
								buttonHandler={navigatePage}
							/>
						</div>
					{/if}
				{/each}
			</div>
		</div>
		<div class="flex h-fit w-full justify-center">
			<button
				onclick={navigatePage('/products')}
				class="bg-bg1 text-lightbg w-fit {intersection.image2
					? ' scale-100 opacity-100'
					: 'scale-200 opacity-0'} cursor-pointer rounded-full px-5 py-2.5 font-bold transition-all duration-500 hover:scale-105"
			>
				Shop All Categories
			</button>
		</div>
	</div>

	<div
		id="image3"
		class="flex h-fit w-full flex-col justify-between gap-10 px-3 sm:px-10 md:h-fit md:px-28"
	>
		<div class="moveAnim relative flex h-10 w-full items-center justify-center">
			<h3
				class="text-secondary-450 text-center text-xl font-bold md:text-4xl md:font-semibold {intersection.image3
					? ' scale-100 opacity-100'
					: 'scale-200 opacity-0'} bg-lightbg w-fit px-4 transition-all duration-700"
			>
				Shop by Giftboxes & Packs
			</h3>
			<div
				class="bg-bg1 faded-line absolute top-5 left-0 -z-1 h-1 w-full rounded-tr-md rounded-bl-md"
			></div>
		</div>

		<div class="relative w-full">
			<div
				class="no-scrollbar relative mx-auto flex w-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 py-8 md:gap-16 md:px-8"
			>
				{#each homeData.packData as type, i}
					{#if visibleItems > i}
						<div
							class="h-48 w-36 flex-shrink-0 snap-start md:w-40 {intersection.image3
								? 'translate-y-0 opacity-100'
								: 'translate-y-10 opacity-0'} transition-all duration-1000"
							style="transition-delay: {i * 300}ms;"
						>
							<CategoriesCard
								name={type.name}
								items={type.quantity}
								buttonHandler={navigatePage}
								buttonCondition={false}
								image={packHome}
							/>
						</div>
					{/if}
				{/each}
				<div
					class="h-48 w-36 flex-shrink-0 snap-start md:w-40 {intersection.image3
						? 'translate-y-0 opacity-100'
						: 'translate-y-10 opacity-0'} transition-all duration-1000"
					style="transition-delay: {visibleItems * 300}ms;"
				>
					<CategoriesCard
						name={'Customise your pack'}
						items={0}
						buttonHandler={navigatePage}
						buttonCondition={false}
						itemsName="none"
						image={packHome}
					/>
				</div>
			</div>
		</div>
		<div class="flex h-fit w-full justify-center">
			<button
				onclick={navigatePage('/packs')}
				class="bg-bg1 text-lightbg w-fit {intersection.image3
					? ' scale-100 opacity-100'
					: 'scale-200 opacity-0'} cursor-pointer rounded-full px-5 py-2.5 font-bold transition-all duration-500 hover:scale-105"
				style="transition-delay: {(visibleItems + 1) * 300}ms;"
			>
				Explore all Giftboxes & Packs
			</button>
		</div>
	</div>

	<div class="mt-6 flex h-fit min-h-30 w-full flex-col gap-10 px-3 md:px-10 lg:px-28">
		<div id="image4" class="moveAnim relative flex h-10 w-full items-center justify-center">
			<h3
				class="text-secondary-450 text-center text-xl font-bold md:text-4xl md:font-semibold {intersection.image4
					? ' scale-100 opacity-100'
					: 'md:scale-200 md:opacity-0'} bg-lightbg w-fit px-4 transition-all duration-700"
			>
				Our Promise
			</h3>
			<div
				class="bg-bg1 faded-line absolute top-5 left-0 -z-1 h-1 w-full rounded-tr-md rounded-bl-md"
			></div>
		</div>

		<div class="grid h-fit w-full grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3">
			{#each whyUsContent as why, i}
				<div
					class=" h-[350px] w-full sm:h-[300px] md:h-[200px] lg:h-full {intersection.image4
						? ' translate-0 opacity-100'
						: ' translate-y-10 opacity-0'} transition-all duration-1000"
					style="transition-delay: {i * 300}ms;"
				>
					<WhyCard
						icon={why.image}
						title={why.title}
						info={why.info}
						bg="bg-primary-200"
						text="text-gray-100"
					/>
				</div>
			{/each}
		</div>
	</div>

	<section
		id="image5"
		class="mt-5 flex h-fit w-full scroll-mt-[140px] flex-col gap-y-6 px-3 md:px-10 lg:px-28"
	>
		{#if homeData.feed.length !== 0}
			<div class="moveAnim relative flex h-10 w-full items-center justify-center">
				<h3
					class="text-secondary-450 text-center text-xl font-bold md:text-4xl md:font-semibold {intersection.image5
						? ' scale-100 opacity-100'
						: 'scale-200 opacity-0'} bg-lightbg w-fit px-4 transition-all duration-700"
				>
					What Our Customers Say
				</h3>
				<div
					class="bg-bg1 faded-line absolute top-5 left-0 -z-1 h-1 w-full rounded-tr-md rounded-bl-md"
				></div>
			</div>
			<div id="reviewText" class="no-scrollbar flex h-fit w-full gap-16 overflow-auto">
				{#each homeData.feed as review, index}
					<div
						id="reviewCardContainer"
						class="h-70 w-74 shrink-0 sm:w-98 {intersection.image5
							? ' translate-0 opacity-100'
							: ' translate-y-10 opacity-0'} flex-shrink-0 snap-start transition-all duration-1000"
						style="transition-delay: {index * 300}ms;"
					>
						<ReviewCard name={review.name} reviewStar={review.stars} review={review.message} />
					</div>
				{/each}
			</div>
		{/if}
	</section>
</section>

<style lang="postcss">
	.slide {
		width: 100%;
		height: 100%;
		object-fit: fill;
		position: absolute;
	}
	::-webkit-scrollbar {
		@apply h-[5px] w-[5px];
	}
	::-webkit-scrollbar-track {
		@apply rounded-[5px] bg-[#f5f5f5];
	}
	::-webkit-scrollbar-thumb {
		@apply w-[1px] rounded-[5px] bg-[#00C2FF];
	}

	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	/* moveAnim {
		animation: movingAnimation 1s linear;
	}
	@keyframes movingAnimation {
		0% {
			justify-content: end;
		}

		100% {
			justify-content: center;
		}
	} */
</style>
