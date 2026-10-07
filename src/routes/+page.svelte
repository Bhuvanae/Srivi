<script>
	import { goto } from '$app/navigation';
	import LoadingAnimation from '$lib/loadingAnimation.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/home');
	});
</script>

<section class="bg-lightbg flex h-full min-h-[400px] w-[100vw] items-center justify-center">
	<div class="flex items-center gap-2">
		<p class="loadingText">loading</p>
		<LoadingAnimation color="bg-tertiory" />
	</div>
</section>
