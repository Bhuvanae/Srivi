<script>
	let {
		icon = '',
		title = 'Fast Delivery',
		info = '',
		bg = 'bg-white',
		text = 'text-[#111730]'
	} = $props();
</script>

<!-- <div
	class="flex h-full w-full flex-col items-center justify-center gap-4 rounded-xl py-3 {bg} group cursor-default px-6 py-6"
>
	<span
		class="animate-fade-in-scale absolute inset-0 hidden h-full w-full rounded-xl bg-amber-500 group-hover:flex"
	>
	</span>
	<div class="h-fit w-fit">{@html icon}</div>
	<h3 class="text-center text-2xl font-semibold {text}">{title}</h3>
	<p class="text-center text-lg {text}">{info}</p>
</div> -->

<div
	class="flex h-full w-full flex-col items-center justify-center gap-4 rounded-xl py-3 shadow-lg {bg} group hover:2xl transistion-all relative isolate cursor-default px-6 py-6 duration-400 hover:scale-105"
>
	<div class="h-fit w-fit">{@html icon}</div>
	<h3 class="text-secondary-50 text-center text-2xl font-bold">{title}</h3>
	<p class="text-center leading-7 tracking-wide {text}">{info}</p>
</div>

<style>
	/*--color-secondary-300: #c48c14;
	--color-secondary-350: #ac7a12;
	--color-secondary-400: #93690f;
	--color-secondary-450: #7b580d;
	--color-secondary-500: #62460a;
	--color-tertiory-600: #b33000;
	--color-tertiory-650: #992900;
	--color-tertiory-700: #802300;
	--color-tertiory-750: #661c00;
	--color-tertiory-800: #4c1500;
	--color-tertiory-850: #330e00;
	--color-tertiory-900: #190700; */
	.group::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 0;
		height: 0;
		background: #222b4b; 
		border-radius: 0.75rem; /* rounded-xl */
		z-index: -1;
		transition:
			width 0.4s ease,
			height 0.4s ease;
		transform-origin: top left;
	}
	.group:hover::before {
		width: 100%;
		height: 100%;
	}

	@keyframes fade-in-scale {
		0% {
			opacity: 0;
			transform: scale(0);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
