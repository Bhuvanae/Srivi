<script>
	// @ts-nocheck

	let {
		errorMessage = 'Unable to get the crackers list. Please try again later.',
		containerStyle = 'flex h-fit min-h-[400px] w-full flex-col items-center justify-center gap-3',
		textStyle = 'text-primary-300 text-xl font-bold',
		buttonStyle = 'bg-primary-400 cursor-pointer rounded-md px-4 py-1.5 font-semibold text-white',
		buttonText = 'Refresh',
		buttonHandler = () => {}
	} = $props();
</script>

<div class={containerStyle}>
	<p class={textStyle}>{errorMessage}</p>
	<button class={buttonStyle} onclick={buttonHandler}>{buttonText}</button>
</div>
