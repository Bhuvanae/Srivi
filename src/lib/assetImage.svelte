<script lang="ts">
	import logo from '$lib/assets/logo.png';

	let {
		imageSrc = logo,
		alt = 'image',
		width = '100%',
		height = '100%',
		rounded = 'rounded-none',
		object = 'object-'

		// loading = 'lazy',
		// decoding = 'async'
	} = $props();
</script>

<div class="h-full w-full transition-all duration-500 hover:scale-105">
	<img
		src={imageSrc}
		class="max-h-full min-h-full max-w-full min-w-full {object} {rounded}"
		{alt}
		{width}
		{height}
	/>
</div>
