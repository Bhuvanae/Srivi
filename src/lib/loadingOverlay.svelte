<script lang="ts">
	let { load = 'Loading...' } = $props();
	import { fade } from 'svelte/transition';
	import { fly } from 'svelte/transition';
</script>

<div
	id="backdrop"
	class="animate-fade absolute inset-0 z-40 flex h-full w-full items-center justify-center px-[15px] backdrop-blur"
	style="background-color: rgb(255, 255, 255, 0.01);"
	in:fade={{ duration: 200 }}
	out:fade={{ duration: 200 }}
>
	<div
		id="content"
		in:fly={{ y: 200, duration: 200 }}
		out:fly={{ y: 200, duration: 200 }}
		class="flex h-fit items-center gap-3"
	>
		{#if load !== ''}
			<svg
				class="animate-spin"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 50 50"
				width="25"
				height="25"
			>
				<circle
					class="text-button"
					cx="25"
					cy="25"
					r="20"
					fill="none"
					stroke-width="4"
					stroke="currentColor"
					stroke-dasharray="100"
					stroke-dashoffset="360"
					stroke-linecap="round"
				/>
			</svg>
		{/if}
		<p class="text-lg text-button">{load}</p>
	</div>
</div>
