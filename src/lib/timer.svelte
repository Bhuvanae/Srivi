<script lang="ts">
	import { onMount } from 'svelte';

	let { seconds = 60, stop = () => {} } = $props();
	let interval = 0;

	onMount(() => {
		// start the timer when component mounts
		startTimer();
	});

	function startTimer() {
		interval = setInterval(() => {
			seconds--;
			if (seconds === 0) {
				clearInterval(interval);
				stop();
			}
		}, 1000);
	}
	// function stopTimer() {
	// 	clearInterval(interval);
	// }

	// function resetTimer() {
	// 	seconds = 60; // Reset to 60 seconds
	// 	clearInterval(interval);
	// }
</script>

<div>
	<p class="font-bold text-button"><span class="text-solid">{seconds}</span> sec</p>
</div>
