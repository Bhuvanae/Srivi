<script>
	import { goto } from '$app/navigation';
	import AssetImage from './assetImage.svelte';

	let { image = '', title = 'Fire Crackers', bg = 'bg-[#222b4b]', navigateUrl = '' } = $props();

	function navigate() {
		goto(navigateUrl);
	}
</script>

<button
	class="flex h-full w-full flex-col items-center justify-center rounded-xl {bg} cursor-pointer"
	onclick={navigate}
>
	<div class="h-4/5 w-4/5">
		<AssetImage imageSrc={image} />
	</div>
	<h4 class="text-2xl font-semibold text-white">{title}</h4>
</button>
