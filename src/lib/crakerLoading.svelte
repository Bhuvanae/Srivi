<script>
	import chakra from '$lib/assets/chakra.png';
	import chakra1 from '$lib/assets/chakkarams.jpg';
	import AssetImage from './assetImage.svelte';
	let { height = 'h-full', width = 'w-full', imageSrc = chakra } = $props();
</script>

<section>
	<div class="{height} {width} animate-spin">
		<AssetImage {imageSrc} />
	</div>
</section>
