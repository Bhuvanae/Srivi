<script lang="ts">
	import { fade } from 'svelte/transition';
	import { fly } from 'svelte/transition';
	let overlayHeight: number | undefined = $state(0);
	let contentHeight: number | undefined = $state(0);
	let {
		width = 'w-5/6 md:w-4/5 lg:w-3/5',
		mediaQueries = 'max-md:max-w-[80%] max-sm:max-w-full max-md:w-[60%] max-sm:w-full',
		overlayStyle = 'fixed flex w-full h-full top-0 left-0 backdrop-blur z-40 justify-center items-center max-sm:items-end px-[15px] animate-fade',
		contentStyle = 'flex text-white justify-center gap-[16px] flex-col max-sm:rounded-b-[0px] max-w-[100%]',
		cHeight = 'h-[66%] min-h-fit max-h-[66%]',
		contentAnimate = 'animate-moveup',
		close = () => {},
		rounded = 'rounded-lg',
		elsefn = () => {},
		children
	} = $props();

	let contentStyleOV = `${width} ${contentStyle} ${cHeight} ${mediaQueries} ${contentAnimate} ${rounded}`;

	function closeByesc(e: KeyboardEvent | MouseEvent): void {
		if (
			(e instanceof KeyboardEvent && e.key === 'Escape' && e.type === 'keydown') ||
			(e instanceof MouseEvent &&
				e.type === 'mousedown' &&
				(e.target as HTMLElement).id === 'backdrop')
		) {
			close();
		} else {
			if (e.type === 'mousedown') {
				if ((e.target as HTMLElement).id !== 'childButton') elsefn(e, '', 'onEsc');
			}
		}
	}
</script>

<div
	class={overlayStyle}
	bind:clientHeight={overlayHeight}
	style="background-color: rgb(255, 255, 150, 0.2);"
	in:fade={{ duration: 200 }}
	out:fade={{ duration: 200 }}
	id="backdrop"
>
	<div
		id="content"
		class={contentStyleOV}
		bind:clientHeight={contentHeight}
		in:fly={{ y: 200, duration: 200 }}
		out:fly={{ y: 200, duration: 200 }}
	>
		{@render children()}
	</div>
</div>
<svelte:body on:keydown={closeByesc} on:mousedown={closeByesc} />
