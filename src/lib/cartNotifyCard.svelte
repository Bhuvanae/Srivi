<script>
	// @ts-nocheck
	import { fly } from 'svelte/transition';
	let { title = '', closeNotify = () => {}, data = {} } = $props();
</script>

<section
	class="bg-primary-250 flex h-fit w-full flex-col gap-4 rounded-lg px-3 py-2 text-white shadow-2xl"
	in:fly={{ x: 100, duration: 200 }}
	out:fly={{ x: 100, duration: 200 }}
>
	<div class="flex h-fit w-full items-center justify-between">
		<p class=" font-bold">{title}</p>
		<button
			aria-label="close"
			class=" cursor-pointer transition-all duration-300 hover:scale-110"
			onclick={() => closeNotify()}
		>
			<svg
				width="30"
				height="30"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM8.96963 8.96965C9.26252 8.67676 9.73739 8.67676 10.0303 8.96965L12 10.9393L13.9696 8.96967C14.2625 8.67678 14.7374 8.67678 15.0303 8.96967C15.3232 9.26256 15.3232 9.73744 15.0303 10.0303L13.0606 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73742 15.3232 9.26254 15.3232 8.96965 15.0303C8.67676 14.7374 8.67676 14.2625 8.96965 13.9697L10.9393 12L8.96963 10.0303C8.67673 9.73742 8.67673 9.26254 8.96963 8.96965Z"
					class="fill-white"
				/>
			</svg>
		</button>
	</div>
	<div class=" flex flex-col gap-4">
		{#if data.decrease.length !== 0}
			<p>{data.decrease.length} items removed from your cart due to stock changes</p>
		{/if}
		{#if data.remove.length !== 0}
			<p>
				We adjusted {data.decrease.length} items in your cart to match our current stock levels.
			</p>
		{/if}
	</div>
</section>
