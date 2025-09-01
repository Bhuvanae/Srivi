<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	// component props
	let {
		closeToast = () => {},
		duration = 3000,
		action = 'success',
		title = 'Toast created successfully'
	} = $props();

	onMount(() => {
		// close the toast after the time
		setTimeout(() => {
			closeToast();
		}, duration || 3000);
	});
</script>

<div
	class="z-50 flex h-fit w-fit items-center justify-center gap-1.5 rounded-lg md:gap-3 {action ==
	'success'
		? 'bg-green-700'
		: 'bg-tertiory-650'} px-2 py-1 md:px-8 md:py-4"
	in:fly={{ y: -100, duration: 300 }}
	out:fly={{ y: -100, duration: 300 }}
>
	<p class="text:xs font-semibold text-white max-md:text-center md:text-lg">{title}</p>
	<button aria-labelledby="close button" onclick={() => closeToast()}>
		<svg
			width="40"
			height="40"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class="fill-white"
		>
			<path
				d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
				class="fill-white"
			/>
			<path
				d="M8.96967 8.96967C9.26256 8.67678 9.73744 8.67678 10.0303 8.96967L12 10.9394L13.9697 8.96969C14.2626 8.6768 14.7374 8.6768 15.0303 8.96969C15.3232 9.26258 15.3232 9.73746 15.0303 10.0304L13.0607 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0304 15.0303C9.73746 15.3232 9.26258 15.3232 8.96969 15.0303C8.6768 14.7374 8.6768 14.2626 8.96969 13.9697L10.9394 12L8.96967 10.0303C8.67678 9.73744 8.67678 9.26256 8.96967 8.96967Z"
				class={action == 'success' ? 'fill-green-700' : 'fill-primary-300'}
			/>
		</svg>
	</button>
</div>
