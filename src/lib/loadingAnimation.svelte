<script lang="ts">
	// component props
	let {
		contianerStyle = 'flex gap-1 items-end h-[16px] ',
		containerHeight = 'h-[16px]',
		color = 'bg-white',
		dotStyle = `h-1 w-1 rounded-full ${color} bounce-animation`
	} = $props();
	// container overstyles
	let containerStylesOv = $derived(`${containerHeight} ${contianerStyle}`);
</script>

<span class={containerStylesOv}>
	<span class="{dotStyle} dot1"></span>
	<span class="{dotStyle} dot2"></span>
	<span class="{dotStyle} dot3"></span>
</span>

<style>
	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-7px);
		}
	}

	.bounce-animation {
		animation: bounce 1s infinite;
	}
	.dot1 {
		animation-delay: 0s;
	}
	.dot2 {
		animation-delay: 0.2s;
	}
	.dot3 {
		animation-delay: 0.4s;
	}
</style>
