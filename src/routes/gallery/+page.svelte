<script>
	// @ts-nocheck

	import { fetchApi } from '$lib/fetchApi';
	import ImageWithLazy from '$lib/imageWithLazy.svelte';
	import LoadingAnimation from '$lib/loadingAnimation.svelte';

	// @ts-nocheck

	import { onMount } from 'svelte';
	import { fly, scale } from 'svelte/transition';

	let loading = $state(undefined);

	let getCrackersData = $state([]);

	let intersection = $state({
		container1: false,
		container2: false,
		container3: false,
		container4: false
	});

	onMount(async () => {
		loading = 'page';

		let getCrackers = await fetchApi('/products', 'GET', 'getCrackers', '');

		if (getCrackers.resStatus == 200) {
			getCrackersData = getCrackers.data.list;
			loading = undefined;
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
			});
		}, options);

		const container1 = document.querySelector('#container1');
		const container2 = document.querySelector('#container2');
		const container3 = document.querySelector('#container3');
		const container4 = document.querySelector('#container4');

		observer.observe(container1);
		observer.observe(container2);
		observer.observe(container3);
		observer.observe(container4);

		// Cleanup
		return () => {
			observer.unobserve(container1);
			observer.unobserve(container2);
			observer.unobserve(container3);
			observer.unobserve(container4);
		};
	});
</script>

<section class="flex h-fit min-h-[600px] w-full flex-col items-center gap-8 py-10">
	<h1
		id="container1"
		class="text-center text-4xl font-bold {intersection.container1
			? ' scale-100 opacity-100'
			: 'scale-0 opacity-0'} transistion-all delay-300 duration-800"
	>
		Gallery
	</h1>
	<div class=" flex h-fit min-h-[600px] w-full flex-col gap-8 max-sm:px-3 md:w-4/5 lg:w-3/5">
		{#if loading == 'page'}
			<div class="flex h-full min-h-[450px] w-full items-center justify-center gap-2">
				<p class="text-tertiory-350 text-xl font-bold">Loading</p>
				<LoadingAnimation color="bg-tertiory-350" />
			</div>
		{:else if getCrackersData.length !== 0}
			{#each getCrackersData as cracker}
				{#if cracker.videourl}
					<div class="flex h-[400px] w-full flex-col gap-6" in:fly={{ y: 100, duration: 500 }}>
						<a
							href="crackerdetail  {cracker.id}"
							class="hover:text-tertiory-450 text-primary-350 text transistion-all text-3xl font-semibold italic duration-300"
							>{cracker.name}</a
						>

						<div class="grid h-9/10 w-full grid-cols-1 gap-6 sm:grid-cols-2">
							<div class="border-secondary-250 h-full w-full rounded-lg border-3 p-5 max-sm:hidden">
								<div class="h-[310px] w-full">
									<ImageWithLazy imageUrl={cracker.image} />
								</div>
							</div>
							<div class="border-secondary-250 h-full w-full rounded-lg border-3 p-5">
								<div class="h-full w-full">
									{@html cracker.videourl}
								</div>
							</div>
						</div>
					</div>
				{/if}
			{/each}
		{:else}
			<div class="flex h-full w-full items-center justify-center">
				<p class="text-primary-350 text-2xl font-semibold">No image and video found</p>
			</div>
		{/if}
	</div>
</section>
