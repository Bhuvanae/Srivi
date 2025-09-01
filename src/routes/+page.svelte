<script>
	import { goto } from '$app/navigation';
	import LoadingAnimation from '$lib/loadingAnimation.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/home');
	});
</script>

<section class="h-[500px] w-full">
	<div class="flex h-full w-full gap-2">
		<p>loading</p>
		<LoadingAnimation color="bg-white" />
	</div>
</section>
