<script>
	// @ts-nocheck
	import AssetImage from './assetImage.svelte';

	let { image = '', buttonHandler = () => {}, buttonStyle = 'w-full h-full animate_scale ' } = $props();
</script>

<button onclick={buttonHandler} class={buttonStyle}>
	<AssetImage imageSrc={image} />
</button>
