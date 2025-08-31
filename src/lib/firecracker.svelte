<script>
	import { onMount } from 'svelte';

	let { x = 0, y = 0 } = $props();
	let particles = $state([]);

	onMount(() => {
		particles = Array.from({ length: 15 }, () => ({
			angle: Math.random() * 360,
			speed: Math.random() * 5 + 2,
			color: `hsl(${Math.random() * 360}, 100%, 60%)`
		}));

		setTimeout(() => {
			particles = [];
		}, 1000);
	});
</script>

{#each particles as particle}
	<div
		class="firecracker"
		style="
        background: {particle.color};
        left: {x}px;
        top: {y}px;
        --x: {Math.cos(particle.angle) * particle.speed * 20}px;
        --y: {Math.sin(particle.angle) * particle.speed * 20}px;
      "
	></div>
{/each}

<style>
	.firecracker {
		position: absolute;
		left: 0;
		top: 0;
		width: 5px;
		height: 5px;
		border-radius: 50%;
        background-color: aqua;
		animation: explode 0.8s ease-out forwards;
	}

	@keyframes explode {
		from {
			transform: translate(0, 0) scale(1);
			opacity: 1;
		}
		to {
			transform: translate(var(--x), var(--y)) scale(0.5);
			opacity: 0;
		}
	}
</style>
