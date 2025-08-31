<script>
	import FirecrackersCard from '$lib/firecrackersCard.svelte';
</script>

<section class="flex h-fit min-h-[500px] w-full flex-col items-center px-20 py-5 ">
	<p class="text-center text-3xl font-semibold text-black">Admin</p>
	<div class="flex h-20 w-full items-center justify-end">
		<button class="rounded-md bg-[#FF8C00] px-4 py-[10px]">Add crackers</button>
	</div>
	<div class="flex h-fit w-4/5 flex-col mt-4">
		<FirecrackersCard edit="true" />
	</div>
</section>
<!-- <iframe src="https://lottie.host/embed/9eb7209a-9a97-4f7d-87e9-a48f816e008b/sZOyLWc6nG.lottie"
></iframe>
<dotlottie-player
	src="https://lottie.host/9eb7209a-9a97-4f7d-87e9-a48f816e008b/sZOyLWc6nG.lottie"
	background="transparent"
	speed="1"
	style="width: 300px; height: 300px"
	loop
	autoplay
></dotlottie-player> -->
