<script>
	// @ts-nocheck
	import LoadingAnimation from './loadingAnimation.svelte';

	let {
		buttonName = 'button',
		buttonClick = () => {},
		buttonStyle = 'button w-full',
		loadingStyle = '',
		loading = false
	} = $props();
</script>

<button class={buttonStyle} onclick={buttonClick}
	>{buttonName}
	{#if loading}
		<div class="h-full w-fit">
			<LoadingAnimation color="bg-black" />
		</div>
	{/if}</button
>
