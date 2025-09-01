<script>
	import chakra from '$lib/assets/images.png';
	import AssetImage from './assetImage.svelte';
</script>

<section class="flex h-full w-full items-center justify-center bg-[#1b1f3b]">
	<div class="flex h-fit w-fit flex-col items-center">
		<div class="h-40 w-40 animate-spin">
			<AssetImage imageSrc={chakra} />
		</div>
		<p class="font-semibold text-white">Loading...</p>
	</div>
</section>
