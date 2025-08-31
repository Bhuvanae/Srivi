<script>
	import { slide } from 'svelte/transition';

	let {
		orderId = 'ORDER00001',
		name = 'Navaneethakrishnan',
		email = 'vnkrish12@gmail.com',
		mobile = '+917449002181',
		amount = 2600,
		status = 'confirmed',
		crackers = [],
		confirmOrder = () => {},
		accountList = [],
		account = '',
		coupon = '',
		printList = () => {},
		address = '',
		city = ''
	} = $props();

	let addressChange = $state(address !== null ? address.replace('_', ',') : address);

	let showDetail = $state(false);

	function showDetailfn() {
		showDetail = !showDetail;
	}
</script>

<section
	class="flex {!showDetail
		? 'transition-scale h-fit duration-300 hover:scale-102'
		: 'h-fit'} border-secondary-400 w-full flex-col border-b shadow-lg"
>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="relative grid h-10 w-full cursor-pointer grid-cols-[0.5fr_2fr_2fr_0.3fr] items-center gap-1.5 px-3 sm:grid-cols-[0.5fr_2fr_1.2fr_1.5fr_1.5fr_0.3fr] md:grid-cols-[0.5fr_2fr_1.2fr_1.5fr_1.5fr_1.5fr_0.3fr] lg:grid-cols-[0.4fr_2fr_2fr_2fr_2fr_2fr_1fr_0.5fr] lg:gap-3 xl:grid-cols-[0.9fr_2fr_2fr_2fr_0.8fr_2fr_2.2fr_0.5fr] xl:px-5"
		onclick={showDetailfn}
	>
		<!-- <span
			class="text-primary-300 pointer-events-none absolute inset-0 z-0 flex items-center justify-center text-3xl font-bold opacity-30"
		>
			{status.toUpperCase()}
		</span> -->
		<!-- <span
			class="pointer-events-none absolute top-1/2 right-2 z-0 -translate-y-1/2 text-3xl font-bold text-red-300 opacity-20"
		>
			ORDERED
		</span> -->
		<p class="text-sm max-xl:hidden">
			ORDER <span class="text-tertiory-650">{orderId}</span>
		</p>
		<p class="text-sm xl:hidden">{orderId}</p>
		<div class="flex gap-1 max-lg:hidden">
			<svg
				width="20"
				height="20"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="max-lg:hidden"
			>
				<path
					d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z"
					class="fill-tertiory-550"
				/>
				<path
					d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z"
					class="fill-tertiory-550"
				/>
			</svg>
			<p>{name.length > 14 ? `${name.slice(0, 13)}...` : name}</p>
		</div>
		<div class="max-sm:hidden">
			<div class="flex h-fit items-center gap-1">
				<svg
					version="1.0"
					id="Layer_1"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					width="18"
					height="18"
					viewBox="0 0 64 64"
					enable-background="new 0 0 64 64"
					xml:space="preserve"
				>
					<g>
						<path
							class="fill-tertiory-550"
							d="M32,0C18.745,0,8,10.745,8,24c0,5.678,2.502,10.671,5.271,15l17.097,24.156C30.743,63.686,31.352,64,32,64
		s1.257-0.314,1.632-0.844L50.729,39C53.375,35.438,56,29.678,56,24C56,10.745,45.255,0,32,0z M32,38c-7.732,0-14-6.268-14-14
		s6.268-14,14-14s14,6.268,14,14S39.732,38,32,38z"
						/>
						<path
							class="fill-tertiory-550"
							d="M32,12c-6.627,0-12,5.373-12,12s5.373,12,12,12s12-5.373,12-12S38.627,12,32,12z M32,34
		c-5.523,0-10-4.478-10-10s4.477-10,10-10s10,4.478,10,10S37.523,34,32,34z"
						/>
					</g>
				</svg>
				<p>{city !== null ? city : ''}</p>
			</div>
		</div>
		<div class="flex h-fit items-center gap-1 max-sm:hidden">
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M16.5562 12.9062L16.1007 13.359C16.1007 13.359 15.0181 14.4355 12.0631 11.4972C9.10812 8.55901 10.1907 7.48257 10.1907 7.48257L10.4775 7.19738C11.1841 6.49484 11.2507 5.36691 10.6342 4.54348L9.37326 2.85908C8.61028 1.83992 7.13596 1.70529 6.26145 2.57483L4.69185 4.13552C4.25823 4.56668 3.96765 5.12559 4.00289 5.74561C4.09304 7.33182 4.81071 10.7447 8.81536 14.7266C13.0621 18.9492 17.0468 19.117 18.6763 18.9651C19.1917 18.9171 19.6399 18.6546 20.0011 18.2954L21.4217 16.883C22.3806 15.9295 22.1102 14.2949 20.8833 13.628L18.9728 12.5894C18.1672 12.1515 17.1858 12.2801 16.5562 12.9062Z"
					class="fill-tertiory-550"
				/>
			</svg>

			<p>{mobile}</p>
		</div>
		<p class=" max-md:hidden">
			<span class="text-tertiory-550">₹</span>
			{amount}
			<span class="text-secondary-450 text-xs max-lg:hidden"
				>{coupon !== '' && coupon !== null ? `(${coupon})` : ''}</span
			>
		</p>
		<div class="flex w-full min-w-28 justify-center gap-3">
			{#if status == 'Confirmed'}
				<select
					class="border-primary-400 cursor-pointer border"
					onchange={(e) => {
						e.stopPropagation();
					}}
					bind:value={account}
				>
					{#each accountList as accountno}
						<option value={accountno.account}>{accountno.account}</option>
					{/each}
				</select>
			{:else}
				<p>{account}</p>
			{/if}
		</div>
		<div
			class="flex w-full max-w-full justify-center gap-1 overflow-hidden sm:justify-end lg:gap-3"
		>
			<button
				class="flex cursor-pointer items-center gap-1 text-lg sm:gap-2 {status == 'Delivered'
					? 'w-full justify-center rounded-md bg-gray-500 px-2 py-1 text-white xl:w-[calc(100%-50px)]'
					: 'w-[calc(100%-40px)] overflow-hidden max-xl:max-w-[calc(100%-50px)] max-xl:text-sm xl:w-[calc(100%-50px)]'} "
			>
				{#if status !== 'Delivered'}
					<svg
						width="18"
						height="18"
						viewBox="0 0 14 14"
						xmlns="http://www.w3.org/2000/svg"
						class="max-xl:hidden"
					>
						<path d="M7 14A7 7 0 107 0a7 7 0 000 14z" class="fill-tertiory-550" />
						<path d="M7 13A6 6 0 107 1a6 6 0 000 12z" fill="#ffffff" />
						<path
							d="M6.995 10.64a3.645 3.645 0 110-7.29 3.645 3.645 0 010 7.29zm0-1.042a2.603 2.603 0 100-5.206 2.603 2.603 0 000 5.206z"
							class="fill-tertiory-550"
						/>
						<path
							d="M7.033 4.92h-.065a.488.488 0 00-.488.488v1.627c0 .27.218.488.488.488h.065c.27 0 .488-.218.488-.488V5.408a.488.488 0 00-.488-.488z"
							class="fill-tertiory-550"
						/>
						<path
							d="M8.075 6.48H6.968a.488.488 0 00-.488.488v.065c0 .27.218.488.488.488h1.107c.27 0 .488-.218.488-.488v-.065a.488.488 0 00-.488-.488z"
							class="fill-tertiory-550"
						/>
					</svg>
				{/if}
				<p class="line-clamp-1 text-balance text-ellipsis">
					{status}
				</p></button
			>
			{#if status !== 'Delivered'}
				<button
					aria-label="close"
					onclick={(e) => {
						e.stopPropagation();
						confirmOrder('close', { id: orderId });
					}}
					class="cursor-pointer"
				>
					<svg
						width="33"
						height="33"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
							class="fill-primary-250"
						/>
						<path
							d="M8.96967 8.96967C9.26256 8.67678 9.73744 8.67678 10.0303 8.96967L12 10.9394L13.9697 8.96969C14.2626 8.6768 14.7374 8.6768 15.0303 8.96969C15.3232 9.26258 15.3232 9.73746 15.0303 10.0304L13.0607 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0304 15.0303C9.73746 15.3232 9.26258 15.3232 8.96969 15.0303C8.6768 14.7374 8.6768 14.2626 8.96969 13.9697L10.9394 12L8.96967 10.0303C8.67678 9.73744 8.67678 9.26256 8.96967 8.96967Z"
							class="fill-white"
						/>
					</svg>
				</button>
				<button
					aria-label="confirm"
					onclick={(e) => {
						e.stopPropagation();
						confirmOrder(
							status.toLowerCase() == 'ordered'
								? 'Confirmed'
								: status == 'Confirmed'
									? 'Payment'
									: status == 'Payment'
										? 'Dispatched'
										: 'Delivered',
							{ id: orderId, account: account }
						);
					}}
					class="cursor-pointer"
				>
					<svg
						class="fill-green-600"
						width="33"
						height="33"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						><path
							d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm5.676,8.237-6,5.5a1,1,0,0,1-1.383-.03l-3-3a1,1,0,1,1,1.414-1.414l2.323,2.323,5.294-4.853a1,1,0,1,1,1.352,1.474Z"
						/></svg
					>
				</button>
				<!-- <button class="bg-primary-350 cursor-pointer rounded-md px-2 py-1 text-white"
					>Confirm</button
				> -->
				<!-- {:else}
				<button class="cursor-pointer rounded-md bg-gray-500 px-2 py-1 text-white">Confirmed</button
				> -->
			{/if}
		</div>
		<div class="flex h-full w-full items-center justify-center sm:justify-end">
			<button
				aria-label="download invoice"
				title="download invoice"
				class="cursor-pointer"
				onclick={(e) => {
					e.stopPropagation();
					printList({ name, email, mobile, amount, crackers: $state.snapshot(crackers), address });
				}}
				><svg
					class="fill-secondary-500"
					width="25"
					height="25"
					viewBox="0 0 32 32"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>print</title>
					<path
						d="M5.656 6.938l-0.344 2.688h11.781l-0.344-2.688c0-0.813-0.656-1.438-1.469-1.438h-8.188c-0.813 0-1.438 0.625-1.438 1.438zM1.438 11.094h19.531c0.813 0 1.438 0.625 1.438 1.438v8.563c0 0.813-0.625 1.438-1.438 1.438h-2.656v3.969h-14.219v-3.969h-2.656c-0.813 0-1.438-0.625-1.438-1.438v-8.563c0-0.813 0.625-1.438 1.438-1.438zM16.875 25.063v-9.281h-11.344v9.281h11.344zM15.188 18.469h-8.125c-0.188 0-0.344-0.188-0.344-0.375v-0.438c0-0.188 0.156-0.344 0.344-0.344h8.125c0.188 0 0.375 0.156 0.375 0.344v0.438c0 0.188-0.188 0.375-0.375 0.375zM15.188 21.063h-8.125c-0.188 0-0.344-0.188-0.344-0.375v-0.438c0-0.188 0.156-0.344 0.344-0.344h8.125c0.188 0 0.375 0.156 0.375 0.344v0.438c0 0.188-0.188 0.375-0.375 0.375zM15.188 23.656h-8.125c-0.188 0-0.344-0.188-0.344-0.375v-0.438c0-0.188 0.156-0.344 0.344-0.344h8.125c0.188 0 0.375 0.156 0.375 0.344v0.438c0 0.188-0.188 0.375-0.375 0.375z"
					></path>
				</svg></button
			>
		</div>
	</div>

	{#if showDetail}
		<div class="h-fit w-full" in:slide out:slide>
			<div class="flex flex-col gap-3 rounded-md bg-gray-200 px-4 py-1.5">
				<p class="text-primary-350 text-lg font-semibold">Customer Details:</p>

				<div class="flex h-fit w-full items-center justify-around gap-4 max-md:flex-col">
					<div class="flex h-fit items-center gap-1">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M5.96802 4H18.032C18.4706 3.99999 18.8491 3.99998 19.1624 4.02135C19.4922 4.04386 19.8221 4.09336 20.1481 4.22836C20.8831 4.53284 21.4672 5.11687 21.7716 5.85195C21.9066 6.17788 21.9561 6.50779 21.9787 6.83762C22 7.15088 22 7.52936 22 7.96801V16.032C22 16.4706 22 16.8491 21.9787 17.1624C21.9561 17.4922 21.9066 17.8221 21.7716 18.1481C21.4672 18.8831 20.8831 19.4672 20.1481 19.7716C19.8221 19.9066 19.4922 19.9561 19.1624 19.9787C18.8491 20 18.4706 20 18.032 20H5.96801C5.52936 20 5.15088 20 4.83762 19.9787C4.50779 19.9561 4.17788 19.9066 3.85195 19.7716C3.11687 19.4672 2.53284 18.8831 2.22836 18.1481C2.09336 17.8221 2.04386 17.4922 2.02135 17.1624C1.99998 16.8491 1.99999 16.4706 2 16.032V7.96802C1.99999 7.52937 1.99998 7.15088 2.02135 6.83762C2.04386 6.50779 2.09336 6.17788 2.22836 5.85195C2.53284 5.11687 3.11687 4.53284 3.85195 4.22836C4.17788 4.09336 4.50779 4.04386 4.83762 4.02135C5.15088 3.99998 5.52937 3.99999 5.96802 4ZM4.31745 6.27777C4.68114 5.86214 5.3129 5.82002 5.72854 6.1837L11.3415 11.095C11.7185 11.4249 12.2815 11.4249 12.6585 11.095L18.2715 6.1837C18.6871 5.82002 19.3189 5.86214 19.6825 6.27777C20.0462 6.69341 20.0041 7.32517 19.5885 7.68885L13.9755 12.6002C12.8444 13.5899 11.1556 13.5899 10.0245 12.6002L4.41153 7.68885C3.99589 7.32517 3.95377 6.69341 4.31745 6.27777Z"
								class="fill-tertiory-550"
							/>
						</svg>
						<p>{email}</p>
					</div>
					<div class="flex h-fit items-center gap-1">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M16.5562 12.9062L16.1007 13.359C16.1007 13.359 15.0181 14.4355 12.0631 11.4972C9.10812 8.55901 10.1907 7.48257 10.1907 7.48257L10.4775 7.19738C11.1841 6.49484 11.2507 5.36691 10.6342 4.54348L9.37326 2.85908C8.61028 1.83992 7.13596 1.70529 6.26145 2.57483L4.69185 4.13552C4.25823 4.56668 3.96765 5.12559 4.00289 5.74561C4.09304 7.33182 4.81071 10.7447 8.81536 14.7266C13.0621 18.9492 17.0468 19.117 18.6763 18.9651C19.1917 18.9171 19.6399 18.6546 20.0011 18.2954L21.4217 16.883C22.3806 15.9295 22.1102 14.2949 20.8833 13.628L18.9728 12.5894C18.1672 12.1515 17.1858 12.2801 16.5562 12.9062Z"
								class="fill-tertiory-550"
							/>
						</svg>

						<p>{mobile}</p>
					</div>
				</div>
				{#if address}
					<div class="flex justify-center gap-2.5">
						<svg
							version="1.0"
							id="Layer_1"
							xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink"
							width="18"
							height="18"
							viewBox="0 0 64 64"
							enable-background="new 0 0 64 64"
							xml:space="preserve"
						>
							<g>
								<path
									class="fill-tertiory-550"
									d="M32,0C18.745,0,8,10.745,8,24c0,5.678,2.502,10.671,5.271,15l17.097,24.156C30.743,63.686,31.352,64,32,64
		s1.257-0.314,1.632-0.844L50.729,39C53.375,35.438,56,29.678,56,24C56,10.745,45.255,0,32,0z M32,38c-7.732,0-14-6.268-14-14
		s6.268-14,14-14s14,6.268,14,14S39.732,38,32,38z"
								/>
								<path
									class="fill-tertiory-550"
									d="M32,12c-6.627,0-12,5.373-12,12s5.373,12,12,12s12-5.373,12-12S38.627,12,32,12z M32,34
		c-5.523,0-10-4.478-10-10s4.477-10,10-10s10,4.478,10,10S37.523,34,32,34z"
								/>
							</g>
						</svg>
						<p>{addressChange}</p>
					</div>
				{/if}
			</div>
			<p class="text-primary-350 px-2.5 py-1 text-lg font-semibold">Cracker Details:</p>
			<table class="h-fit w-full">
				<thead>
					<tr class="text-primary-450">
						<th> S.No </th>
						<th> Cracker Name</th>
						<!-- <th> Price</th>  -->
						<th> Quantity</th>
					</tr>
				</thead>
				<tbody>
					{#each crackers as cracker, i}
						<tr>
							<td>{i + 1}</td>
							{#each Object.entries(cracker) as [key, value]}
								{#if key !== 'item_id'}
									<!-- <td>{}</td> -->
									<!-- <td> </td> -->
									<td class="text-center">{value}</td>
									<!-- {:else}
									<td class="text-center">{value}</td> -->
								{/if}
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</section>

<style>
	th {
		padding: 4px 8px;
		border-bottom: 1px solid black;
		text-align: center;
	}
	td {
		padding: 6px 8px;
		border-bottom: 1px solid #7b580d;
		text-align: center;
	}
</style>
