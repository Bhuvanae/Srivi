<script lang="ts">
	import { fetchApi } from '$lib/fetchApi';
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';
	import LoadingAnimation from '$lib/loadingAnimation.svelte';
	import { storeData } from '../store.svelte';
	import { storeNew } from '../storeNew.svelte';
	import { browser } from '$app/environment';
	import OverlayWithSlot from '$lib/overlayWithSlot.svelte';
	import InputText from '$lib/inputText.svelte';
	import InputNumber from '$lib/inputNumber.svelte';

	let html2pdf: () => {
		(): any;
		new (): any;
		from: {
			(arg0: HTMLDivElement): {
				(): any;
				new (): any;
				set: {
					(arg0: {
						margin: number;
						filename: string;
						image: { type: string; quality: number };
						html2canvas: { scale: number };
						jsPDF: { unit: string; format: string; orientation: string };
					}): { (): any; new (): any; save: { (): void; new (): any } };
					new (): any;
				};
			};
			new (): any;
		};
	};

	let store = $state(storeData());
	let admin = store.admin;

	let toast = $state({
		show: false,
		title: 'Stock updated successfully',
		duration: 2000,
		action: 'success'
	});

	// Define a type for crackers
	type Cracker = {
		type: any;
		result: any;
		name: string;
		actualprice?: number; // from API
		price: number | string;
		quantity: string;
	};

	// Response type from fetchApi
	type CrackersApiResponse = {
		data: {
			list: Cracker[];
		};
	};

	let crackersList: Cracker[] = $state([]);
	// svelte-ignore non_reactive_update
	let invoice: HTMLElement;
	// let serial = $state(1);
	let serial = 1;

	let serialTable = 1;

	let loading = $state('');
	let windowHeight = $state(0);

	let filterCrackerList = $state([]);

	let topPosition = $state(0);
	let containerWidth = $state(0);
	let checkOutWidth = $state(0);
	$effect(() => {
		let layoutContainer = document.getElementById('layoutContainer');
		topPosition = layoutContainer?.scrollTop + window.screen.height - 400;
	});

	onMount(async () => {
		if (browser) {
			const module = await import('html2pdf.js');
			html2pdf = module.default;
		}

		windowHeight = window.screen.height;
		if (invoice !== null) {
			containerWidth = invoice.clientWidth;
		}
		if (admin) {
			store.cartItems = [];
		}

		loading = 'page';
		const getCrackersData = (await fetchApi(
			'/products',
			'GET',
			'getCrackers',
			''
		)) as CrackersApiResponse;

		if (getCrackersData.resStatus == 200) {
			loading = 'start';
			crackersList = getCrackersData?.data.type || [];
			filterCrackerList = getCrackersData?.data.type || [];
		} else {
			loading = 'pageError';
		}
	});

	// Optional logo (base64 or image URL)
	const logoBase64: string =
		'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcBhhpwYgo4dQj8vGk1e-dEi0Ml4gBXUc1cQ&s';

	// onclick={() => {
	// 				if (userNamePhone.Name && userNamePhone.Phone) {
	// 					let message = `Thank you for your interest in our products. Here is the price list for the crackers you requested:\n\n${generateMessage()}\n\nPlease let us know if you have any questions or if you would like to place an order. We look forward to serving you!\n\nBest regards,\n${userNamePhone.Name}\nPhone: ${userNamePhone.Phone}`;
	// 					window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
	// 					userNamePhone.overlay = false;
	// 				} else {
	// 					alert('Please enter both name and phone number.');
	// 				}
	// 			}}

	async function downloadPDF(list: any): Promise<void> {
	
		loading = 'updateStock';
		if (list == 'stock') {
			let convertArray: { id: any; stocks: any }[] = [];
			filterCrackerList.map((item) => {
				item.result.data.forEach((x: { id: any; stocks: any }) => {
					convertArray.push({ id: x.id, stocks: x.stocks });
				});
			});
			let updateBulk = await fetchApi('/pricelist', 'POST', 'updateBulk', convertArray);
			if (updateBulk?.resStatus == 200) {
				loading = 'start';
				toast.show = true;
				storeNew.toast = { show: true, title: 'Stock Updated', duration: 3000 };
			} else {
				loading = 'start';
				toast = {
					show: true,
					title: 'Error occured, Try again',
					duration: 2000,
					action: 'failure'
				};
			}
		} else {
			console.log('check');
			const tableHTML = `
<div class="flex h-fit w-full flex-col gap-3 mb-4">
	<div
		class="no-break border-b border-primary-300 flex h-fit w-full items-center justify-between pt-4 pb-10"
	>
		<div class="flex w-fit items-center gap-3">
			<div class="logo-wrapper">
				<img src="/logo.png" alt="Logo" width="70" height="70" />
			</div>
			<h1 class="text-[24px] -mt-5 leading-none h-fit font-bold">${storeNew.cAddress.address1.toUpperCase()}</h1>
		</div>

		<div class="flex h-fit flex-col gap-1 text-sm font-semibold">
			<p>${storeNew.cAddress.address1}</p>
			<p>${storeNew.cAddress.address2}</p>
			<p>${storeNew.cAddress.address3}</p>
			<p>${storeNew.cAddress.address4},${storeNew.cAddress.address5}</p>
			<p>${storeNew.cAddress.mobile1}, ${storeNew.cAddress.mobile2}</p>
		</div>
	</div>
	


<table class="w-full border-collapse mt-8 table">
		<thead class="bg-[#a91b0c] text-white">
			<tr class="no_break">
				<th class="border border-[#ddd] p-2 text-center table-cell">S.No</th>
				<th class="border border-[#ddd] p-2 text-center table-cell">Cracker Name</th>
				<th class="border border-[#ddd] p-2 text-center table-cell">Base price</th>
				<th class="border border-[#ddd] p-2 text-center table-cell">Final price</th>
				<th class="border border-[#ddd] p-2 text-center table-cell">Quantity</th>${list == 'preview' ? ' <th>Cart Quantity</th> <th>Value</th>' : ''}
			</tr>
		</thead>
  <tbody>
${
	list === 'list'
		? filterCrackerList
				.map(
					(crackers) => `
		          <tr class="section-row no_break">
		            <td class="border border-[#ddd] font-bold bg-secondary-200 p-2 text-center table-cell" colspan="5">${crackers.result.type}</td>
		          </tr>
		          ${crackers.result.data
								.map(
									(cracker: { name: any; actualprice: any; price: any; quantity: any }) => `
		                <tr class="no_break ">
		                  <td class="border border-[#ddd] p-2 text-center table-cell">${serialTable++}</td>
		                  <td class="border border-[#ddd] p-2 text-center table-cell">${cracker.name}</td>
		                  <td class="border border-[#ddd] p-2 text-center table-cell">${Number(cracker.actualprice).toFixed(0)}</td>
		                  <td class="border border-[#ddd] p-2 text-center table-cell">${Math.trunc(cracker.price)}</td>
		                  <td class="border border-[#ddd] p-2 text-center table-cell">${cracker.quantity}</td>

		                </tr>
		              `
								)
								.join('')}
		        `
				)
				.join('')
		: cartItems
				.map(
					(cracker: {
						name: any;
						actualprice: any;
						price: number;
						quantity: any;
						cartQuantity: number;
					}) => `
		          <tr class="no_break ">
		            <td class="border border-[#ddd] p-2 text-center table-cell">${serialTable++}</td>
		            <td class="border border-[#ddd] p-2 text-center table-cell">${cracker.name}</td>
		            <td class="border border-[#ddd] p-2 text-center table-cell">${Number(cracker.actualprice).toFixed(0)}</td>
		            <td class="border border-[#ddd] p-2 text-center table-cell">${Math.trunc(cracker.price)}</td>
		            <td class="border border-[#ddd] p-2 text-center table-cell">${cracker.quantity}</td>
					<td class="border border-[#ddd] p-2 text-center table-cell">${cracker.cartQuantity}</td>
					<td class="border border-[#ddd] p-2 text-center table-cell">${cracker.cartQuantity ? Math.trunc(cracker.cartQuantity * cracker.price) : 0}</td>

		          </tr>
		        `
				)
				.join('')
}
				${
					list === 'preview'
						? `
		<tr><td colspan=6 class="text-tertiory-700 font-bold text-right px-2 py-2 border border-[#ddd]">Gross Amount</td>
		<td class="text-tertiory-700 font-bold border border-[#ddd] px-2 py-2 text-center ">${totalDetails.actual}</td>
		</tr>
		<tr><td colspan=6 class="text-tertiory-700 font-bold text-right border border-[#ddd] px-2 py-2 "><span class="text-[#a91b0c]">(80% Discount)</span> Discount Amount</td>
		<td class="text-tertiory-700 font-bold border border-[#ddd] px-2 py-2 text-center">${totalDetails.actual - totalDetails.price} (-)</td>
		</tr>
	<tr><td colspan=6 class="text-tertiory-700 font-bold text-right border border-[#ddd] px-2 py-2 ">Net Amount</td>
		<td class="text-tertiory-700 font-bold border border-[#ddd] px-2 py-2 text-center">${totalDetails.price}</td>
		</tr>`
						: ''
				}
   
  </tbody>
</table>
  </div>
</div>`;
			generateAndDownloadPDF(tableHTML, list);

		}
	}
	let pricelist = $state('list');

	async function generateAndDownloadPDF(htmlString: string, action: 'preview' | 'list') {
		try {
			loading = 'generating';

			// Create a temporary div to render the HTML

			// Handle actions
			if (action === 'preview') {
				const tempDiv = document.createElement('div');
				tempDiv.innerHTML = htmlString;
				const opt = {
					margin: 10,
					filename: userNamePhone?.name,
					image: { type: 'jpeg', quality: 0.98 },
					html2canvas: { scale: 2 },
					jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
				};

				if (userNamePhone.overlay) {
					await html2pdf().set(opt).from(tempDiv).save();
					if (userNamePhone.name && userNamePhone.phone) {
						let message = `Thank you for your interest in our products. Here is the price list for the crackers you requested`;
						window.open(`https://wa.me/${userNamePhone.phone}?text=${message}`, '_blank');
						userNamePhone.overlay = false;
					} else {
						alert('Please enter both name and phone number.');
					}
				} else {
					// Open in new window for preview
					await html2pdf()
						.set(opt)
						.from(tempDiv)
						.toPdf()
						.get('pdf')
						.then((pdf: { output: (arg0: string) => any }) => {
							const pdfBlob = pdf.output('blob');
							const pdfUrl = URL.createObjectURL(pdfBlob);
							// const link = document.createElement(pdfUrl);
							// link.href = pdfUrl;
							// link.download = 'fileName';
							// document.body.appendChild(link);
							// link.click();
							// document.body.removeChild(link);
							// console.log(link, 'link has been craeted');
							// console.log(pdfUrl, 'url');
							window.open(pdfUrl, '_blank');
						});
				}
			} else {
				const tempDiv = document.createElement('div');
				tempDiv.innerHTML = htmlString;
				const opt = {
					margin: 10,
					filename: 'Crackers list.pdf',
					image: { type: 'jpeg', quality: 0.98 },
					html2canvas: { scale: 2 },
					jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
				};

				if (tempDiv) html2pdf().from(tempDiv).set(opt).save();
			}
		} catch (error) {
			console.error('PDF generation failed:', error);
		} finally {
			loading = 'start';
			pricelist = 'list';
		}
	}

	export async function getImageUrl(image: any) {
		const getImage = await fetchApi('/pricelist', 'POST', 'getImage', { image });
		return getImage?.data;
	}

	function refreshBage() {
		location.reload();
	}

	let selectedTypeCracker = $state('All Crackers');
	function filterList(value: any, type: any) {
		filterCrackerList = crackersList
			.map((item) => {
				if (type === 'name') {
					const matchedData = item.result.data.filter((x: any) =>
						x.name.toLowerCase().includes(value.toLowerCase())
					);

					if (matchedData.length > 0) {
						return {
							...item,
							result: {
								...item.result,
								data: matchedData
							}
						};
					}
					return null;
				}

				if (type === 'type') {
					if (value === 'All Crackers' || item.result.type === value) {
						return item;
					}
					return null;
				}

				return null;
			})
			.filter(Boolean); // remove nulls
	}

	let totalDetails = $state({ actual: 0, quantity: 0, price: 0 });
	let showTotalPopup = $state(false);
	let cartItems = $state(store.cartItems);

	async function buttonOneHandler(detail: any, tButton: any, aButton: any) {
		let layoutContainer = document.getElementById('layoutContainer');
		topPosition = layoutContainer?.scrollTop + window.screen.height - 400;

		if (tButton === 'cart') {
			cartItems = store.cartItems;

			if (aButton === 'plus') {
				let itemExists = false;

				cartItems = cartItems.map((x: { id: any; cartQuantity: number }) => {
					if (x.id === detail.id) {
						itemExists = true;
						return { ...x, cartQuantity: x.cartQuantity + 1 };
					}
					return x;
				});

				if (!itemExists) {
					cartItems.push({ ...detail, cartQuantity: 1 });
				}
			}

			if (aButton === 'minus') {
				cartItems = cartItems
					.map((x: { id: any; cartQuantity: number }) => {
						if (x.id === detail.id) {
							if (x.cartQuantity === 1) return null; // Remove if quantity is 1
							return { ...x, cartQuantity: x.cartQuantity - 1 };
						}
						return x;
					})
					.filter(Boolean); // Filter out nulls (deleted)
			}

			if (aButton === 'delete') {
				cartItems = cartItems.filter((x: { id: any }) => x.id !== detail.id);
			}

			// Update filterCrackerList as well
			filterCrackerList = filterCrackerList.map((x) => {
				if (x.result.type === detail.type) {
					const updatedData = x.result.data.map((item: { id: any; cartQuantity: number }) => {
						if (item.id === detail.id) {
							if (aButton === 'plus') {
								return {
									...item,
									cartQuantity: !item.cartQuantity ? 1 : item.cartQuantity + 1
								};
							} else if (aButton === 'minus') {
								return {
									...item,
									cartQuantity: Math.max(item.cartQuantity - 1, 0)
								};
							} else if (aButton === 'delete') {
								return { ...item, cartQuantity: 0 };
							}
						}
						return item;
					});

					return {
						...x,
						result: {
							...x.result,
							data: updatedData
						}
					};
				}
				return x;
			});

			store.cartItems = cartItems;

			const items = store.cartItems;
			totalDetails = {
				actual: items.reduce(
					(sum: number, item: { cartQuantity: number; actualprice: number }) =>
						sum + item.cartQuantity * item.actualprice,
					0
				),
				price: items.reduce(
					(sum: number, item: { cartQuantity: number; price: number }) =>
						sum + item.cartQuantity * item.price,
					0
				),
				quantity: items.reduce(
					(sum: any, item: { cartQuantity: any }) => sum + item.cartQuantity,
					0
				)
			};
			if (cartItems.length !== 0) {
				showTotalPopup = true;
			} else {
				showTotalPopup = false;
			}
		}
	}

	function movePage(page: any) {
		pricelist = page;
		let scroll = document.querySelector('#layoutContainer');
		scroll?.scrollTo({ top: 0, behavior: 'smooth' });
		serial = 1;
	}
	let userNamePhone = $state({ name: '', phone: '', overlay: false });

	function getNameandNumber() {
		userNamePhone.overlay = true;
	}
</script>

<section
	class="relative flex h-fit min-h-[500px] w-full flex-col items-center gap-4 px-3 py-4 md:px-10 lg:px-32"
	bind:this={invoice}
>
	<h1
		id="container1"
		class="transistion-all mb-4 text-2xl font-bold duration-500"
		in:scale={{ duration: 1000 }}
	>
		Cracker Price List
	</h1>
	{#if admin}
		<div
			class="grid h-fit w-full grid-cols-1 justify-center gap-4 md:h-12 md:grid-cols-3 md:gap-10"
		>
			<div class="flex h-full w-full max-md:justify-center">
				{#if pricelist === 'preview' || pricelist == 'stock'}
					<button
						class="bg-primary-350 flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-white"
						aria-label="back"
						onclick={() => movePage('list')}
					>
						<svg
							class="fill-white"
							height="25"
							width="25"
							version="1.1"
							id="Layer_1"
							xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink"
							viewBox="0 0 512 512"
							xml:space="preserve"
						>
							<g>
								<g>
									<path
										d="M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z M384,277.333H179.499
			l48.917,48.917c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251
			l-85.333-85.333c-1.963-1.963-3.52-4.309-4.608-6.933c-2.155-5.205-2.155-11.093,0-16.299c1.088-2.624,2.645-4.971,4.608-6.933
			l85.333-85.333c8.341-8.341,21.824-8.341,30.165,0s8.341,21.824,0,30.165l-48.917,48.917H384c11.776,0,21.333,9.557,21.333,21.333
			S395.776,277.333,384,277.333z"
									/>
								</g>
							</g>
						</svg>
						Back
					</button>
				{:else if pricelist === 'list'}
					<button
						onclick={() => movePage('stock')}
						aria-label="stocks"
						class="bg-primary-350 flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-white"
					>
						Stocks
					</button>
				{/if}
			</div>

			<div class="relative h-12 w-full md:h-full">
				<div class="absolute top-0 left-0 flex h-full w-[55px] items-center justify-center">
					<svg
						width="25"
						height="25"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
							class="stroke-gray-500"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
				<input
					type="text"
					name="search"
					placeholder="Search"
					class="h-full w-full rounded-full border border-amber-100 bg-gray-200 pl-16 {pricelist ==
					'preview'
						? 'cursor-not-allowed'
						: ''}"
					oninput={(e: any) => {
						filterList(e.target.value, 'name');
					}}
				/>
			</div>

			<div class="flex h-full w-full items-center justify-center gap-1.5 md:justify-end">
				<p class="text-sm text-gray-800">Filter by :</p>
				<select
					class="border-primary-350 h-8 w-3/6 border text-sm {pricelist == 'preview'
						? 'cursor-not-allowed'
						: ''}"
					bind:value={selectedTypeCracker}
					onchange={(e) => {
						filterList(e.target.value, 'type');
					}}
				>
					<option value="All Crackers">All Crackers</option>
					{#each crackersList as list}
						<!-- svelte-ignore node_invalid_placement_ssr -->

						<option value={list?.result.type}>{list?.result.type}</option>
					{/each}
				</select>
			</div>
		</div>
	{/if}
	<!-- (₹) -->
	{#if loading == 'start' || loading == 'updateStock'}
		{#if filterCrackerList.length !== 0}
			<table
				id="container2"
				class="transistion-all w-full table-auto border-collapse border border-gray-300 duration-500"
				in:scale={{ duration: 1000 }}
			>
				<thead class="border">
					<tr class="bg-primary-300 border border-black text-white">
						<th class="border px-4 py-2.5">S.No</th>
						<th class="border px-4 py-2.5">Cracker Name </th>
						<th class="border px-4 py-2.5">Base price</th>
						<th class="border px-4 py-2.5">Final price</th>
						<th class="border px-4 py-2.5">Quantity</th>
						{#if admin}
							{#if pricelist == 'stock'}
								<th class="border px-4 py-2.5">Stocks</th>
							{:else}
								<th class="border px-4 py-2.5">Cart Quantity</th>
								<th class="border px-4 py-2.5">Value</th>
							{/if}
						{/if}
					</tr>
				</thead>
				<!-- {:else if pricelist=="preview"} -->
				<tbody>
					{#if pricelist == 'list' || pricelist == 'stock'}
						{#each filterCrackerList as crackers, i}
							<tr class="bg-secondary-200 text-center"
								><td class="border py-2.5 text-center font-bold" colspan="7"
									>{crackers.result.type}</td
								></tr
							>

							{#each crackers.result.data as cracker, crackerIndex}
								<tr
									class="text-center {cracker.cartQuantity
										? 'bg-green-700 text-white'
										: ''} no_break {admin && cracker.stocks < 11
										? 'bg-primary-200 text-gray-100'
										: ''}"
								>
									<td class="border px-4 py-2.5">{serial++}</td>

									<td class="border px-4 py-2.5 font-semibold">{cracker.name}</td>
									<td class="border px-4 py-2.5">{Number(cracker.actualprice).toFixed(0)}</td>
									<td class="border px-4 py-2.5">{Math.trunc(cracker.price)}</td>
									<td class="border px-4 py-2.5">{cracker.quantity}</td>
									{#if admin}
										{#if pricelist == 'stock'}
											<td class="h-full w-16 border">
												<input
													class="h-10 w-full border-0 px-5 text-center"
													type="number"
													bind:value={cracker.stocks}
												/>
											</td>
										{:else}
											<td class="border py-2.5">
												<div class=" flex w-full items-center justify-center">
													<button
														aria-label="Decrease quantity"
														class="focus:ring-primary-500 flex h-8 w-8 cursor-pointer items-center justify-center rounded-l border border-gray-300"
														onclick={() => {
															buttonOneHandler(cracker, 'cart', 'minus');
														}}
													>
														<svg
															width="15"
															height="15"
															viewBox="0 0 24 24"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
															aria-hidden="true"
														>
															<path
																d="M6 12L18 12"
																class={!cracker.cartQuantity ? 'stroke-black' : 'stroke-white'}
																stroke-width="2"
																stroke-linecap="round"
																stroke-linejoin="round"
															/>
														</svg>
													</button>

													<div
														class="flex h-8 w-12 items-center justify-center border-t border-b border-gray-300"
													>
														<!-- {cracker.cartQuantity || 0} -->
														<div class="h-full w-full">
															<input
																class="h-full w-full px-2 text-center"
																type="number"
																bind:value={cracker.cartQuantity}
															/>
															<!-- <InputNumber
																id="cartQuantity"
																name="Quantity"
																placeholder=" "
																bind:store={crackers[i]}
																bgColor="bg-gray-200"
																validate={() => {
																	return true;
																}}
															/> -->
															<!-- <InputText
													id="phone"
													name="Phone"
													bind:store={userNamePhone}
													bgColor="bg-gray-200"
													validate={() => {
														return true;
													}}
												/> -->
														</div>
													</div>

													<!-- <div
														class="flex h-8 w-8 items-center justify-center border-t border-b border-gray-300"
													>
														{cracker.cartQuantity || 0}
													</div> -->

													<button
														aria-label="Increase quantity"
														class="focus:ring-primary-500 flex h-8 w-8 cursor-pointer items-center justify-center rounded-r border border-gray-300"
														onclick={() => {
															buttonOneHandler(cracker, 'cart', 'plus');
														}}
													>
														<svg
															width="15"
															height="15"
															viewBox="0 0 24 24"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
															aria-hidden="true"
														>
															<path
																d="M4 12H20M12 4V20"
																class={!cracker.cartQuantity ? 'stroke-black' : 'stroke-white'}
																stroke-width="2"
																stroke-linecap="round"
																stroke-linejoin="round"
															/>
														</svg>
													</button>
												</div>
											</td>
											<td class="border px-4 py-2.5"
												>{cracker.cartQuantity ? cracker.cartQuantity * cracker.price : 0}</td
											>
										{/if}
									{/if}
								</tr>
							{/each}
						{/each}
					{:else if pricelist == 'preview'}
						{#each cartItems as cracker}
							<tr class="text-center">
								<td class="border px-4 py-2.5">{serial++}</td>
								<td class="border px-4 py-2.5 font-semibold">{cracker.name}</td>
								<td class="border px-4 py-2.5">{Number(cracker.actualprice).toFixed(0)}</td>
								<td class="border px-4 py-2.5">{Math.trunc(cracker.price)}</td>
								<td class="border px-4 py-2.5">{cracker.quantity}</td>
								<td class="border py-2.5">
									<div class=" flex w-full items-center justify-center">
										<button
											aria-label="Decrease quantity"
											class="focus:ring-primary-500 flex h-8 w-8 cursor-pointer items-center justify-center rounded-l border border-gray-300"
											onclick={() => {
												buttonOneHandler(cracker, 'cart', 'minus');
											}}
										>
											<svg
												width="15"
												height="15"
												viewBox="0 0 24 24"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
												aria-hidden="true"
											>
												<path
													d="M6 12L18 12"
													class="stroke-black"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
											</svg>
										</button>

										<div
											class="flex h-8 w-8 items-center justify-center border-t border-b border-gray-300"
										>
											<!-- {cracker.cartQuantity || 0} -->
											<div class="h-full w-full">
												<input
													class="h-full w-full px-2 text-center"
													type="number"
													bind:value={cracker.cartQuantity}
												/>
												<!-- <InputText
													id="phone"
													name="Phone"
													bind:store={userNamePhone}
													bgColor="bg-gray-200"
													validate={() => {
														return true;
													}}
												/> -->
											</div>
										</div>

										<button
											aria-label="Increase quantity"
											class="focus:ring-primary-500 flex h-8 w-8 cursor-pointer items-center justify-center rounded-r border border-gray-300"
											onclick={() => {
												buttonOneHandler(cracker, 'cart', 'plus');
											}}
										>
											<svg
												width="15"
												height="15"
												viewBox="0 0 24 24"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
												aria-hidden="true"
											>
												<path
													d="M4 12H20M12 4V20"
													class="stroke-black"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
											</svg>
										</button>
									</div>
								</td>
								<td class="border px-4 py-2.5"
									>{cracker.cartQuantity ? cracker.cartQuantity * cracker.price : 0}</td
								>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		{:else}
			<div class="flex h-[calc(100vh-120px)] w-full flex-col items-center justify-center gap-2">
				<p class="text-tertiory-450 text-lg font-bold">No crackers are available at the moment.</p>
			</div>
		{/if}

		{#if showTotalPopup && pricelist == 'list'}
			<div
				id="quickView"
				class="absolute z-30 flex h-fit w-fit flex-wrap items-center justify-center gap-3 rounded-lg bg-gray-200 px-4 shadow-lg max-md:py-4 md:h-20 md:gap-10"
				style="top:{topPosition}px;left:{containerWidth / 2 - checkOutWidth / 2}px"
				bind:clientWidth={checkOutWidth}
				in:scale={{ duration: 500 }}
				out:scale={{ duration: 500 }}
			>
				<p class="font-semibold text-gray-500">
					Total items : <span class="text-tertiory-650 text-bold">{totalDetails.quantity}</span>
				</p>
				<p class="flex items-end gap-2 font-semibold text-gray-500">
					Estimate Price : <span class="text-tertiory-650 text-bold"> ₹ {totalDetails.price}</span>
					<span class="text-xs text-black line-through opacity-45"> ₹ {totalDetails.actual}</span>
				</p>
				{#if !admin}
					<button
						onclick={movePage}
						class="{totalDetails.price >= store.minimumCartValue
							? 'bg-primary-350 cursor-pointer text-white'
							: 'cursor-not-allowed bg-gray-400 text-black'} rounded-lg px-4 py-1.5"
						>Proceed to Estimate</button
					>
				{:else if pricelist == 'list'}
					<button
						onclick={() => movePage('preview')}
						class="bg-primary-350 cursor-pointer rounded-lg px-4 py-1.5 text-white">Preview</button
					>
				{/if}
			</div>
		{/if}

		{#if pricelist == 'list'}<a href="/pricelist.pdf" download
				><button
					in:scale={{ duration: 1000 }}
					class="bg-primary-400 mt-4 cursor-pointer rounded px-6 py-2 text-white transition-all duration-500 hover:scale-105"
				>
					Download Price List (PDF)
				</button>
			</a>{:else}
			<button
				in:scale={{ duration: 1000 }}
				onclick={() => downloadPDF(pricelist)}
				class="bg-primary-400 mt-4 cursor-pointer rounded px-6 py-2 text-white transition-all duration-500 hover:scale-105"
			>
				{#if loading == 'updateStock'}
					<div class="flex h-full w-full gap-2">
						<p>loading</p>
						<LoadingAnimation color="bg-white" />
					</div>
				{:else}
					{pricelist == 'list'
						? 'Download Price List (PDF)'
						: pricelist == 'stock'
							? 'Update Stocks'
							: 'Print'}
				{/if}
			</button>
			{#if pricelist == 'preview'}
				<button
					in:scale={{ duration: 1000 }}
					onclick={() => getNameandNumber('list')}
					class="bg-primary-400 mt-4 cursor-pointer rounded px-6 py-2 text-white transition-all duration-500 hover:scale-105"
				>
					Share via WhatsApp
				</button>
			{/if}
		{/if}
	{:else}
		<div
			id="loadingContainer"
			class=" flex w-full {loading == 'pageError'
				? 'flex-col'
				: ''} items-center justify-center gap-2"
			style="height:{windowHeight - 380}px"
		>
			{#if loading == 'pageError'}
				<p class="text-xl font-bold">Couldn't get data</p>

				<button
					class="bg-primary-350 cursor-pointer rounded-md px-4 py-1.5 font-semibold text-white"
					onclick={refreshBage}>Refresh</button
				>
			{:else if loading == 'page'}
				<p class="text-xl font-bold">Loading</p>
				<LoadingAnimation color="bg-black" />
			{/if}
		</div>
	{/if}
</section>
{#if userNamePhone.overlay}
	<OverlayWithSlot
		width="w-2/5"
		close={() => (userNamePhone.overlay = false)}
		elsefn={() => {
			window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
			userNamePhone.overlay = false;
		}}
	>
		<div class="flex h-fit w-full flex-col gap-4 rounded-lg bg-gray-200 px-5 py-6">
			<h1 class="text-lg font-semibold text-gray-700">Enter your details</h1>
			<div class="h-16 w-full">
				<InputText
					id="name"
					name="Name"
					bind:store={userNamePhone}
					bgColor="bg-gray-200"
					validate={() => {
						return true;
					}}
				/>
			</div>
			<div class="h-16 w-full">
				<InputText
					id="phone"
					name="Phone"
					bind:store={userNamePhone}
					bgColor="bg-gray-200"
					validate={() => {
						return true;
					}}
				/>
			</div>
			<div class="flex w-full justify-center gap-4">
				<button
					onclick={() => {
						userNamePhone.overlay = false;
					}}
					class="bg-primary-400 mt-4 cursor-pointer rounded px-6 py-2 text-white transition-all duration-500 hover:scale-105"
				>
					Cancel
				</button>

				<button
					onclick={() => downloadPDF(pricelist)}
					class="bg-primary-400 mt-4 cursor-pointer rounded px-6 py-2 text-white transition-all duration-500 hover:scale-105"
				>
					Send via WhatsApp
				</button>
			</div>
		</div>
	</OverlayWithSlot>
{/if}
<!-- <OverlayWithSlot width="w-4/6" close={closeQuick} elsefn={showAutoCompletefn}></OverlayWithSlot> -->

<!-- <div class="flex h-full w-8 flex-col justify-between pt-4">
	<svg
		width="28"
		height="28"
		viewBox="0 0 8.4666669 8.4666669"
		id="svg8"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:cc="http://creativecommons.org/ns#"
		xmlns:dc="http://purl.org/dc/elements/1.1/"
		xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
		xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
		xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
		xmlns:svg="http://www.w3.org/2000/svg"
	>
		<defs id="defs2" />

		<g id="layer1" transform="translate(0,-288.53332)">
			<path
				d="m 15.996094,0.99609375 c -6.0632836,0 -10.9980445,4.93673065 -10.9980471,11.00000025 -3.8e-6,10.668737 10.3789061,18.779297 10.3789061,18.779297 0.364612,0.290384 0.881482,0.290384 1.246094,0 0,0 10.380882,-8.11056 10.380859,-18.779297 C 27.003893,5.9328244 22.059377,0.99609375 15.996094,0.99609375 Z m 0,6.00195315 c 2.749573,0 5.00585,2.2484784 5.005859,4.9980471 C 21.001971,14.7457 18.745685,17 15.996094,17 c -2.749591,0 -4.998064,-2.2543 -4.998047,-5.003906 9e-6,-2.7495687 2.248474,-4.9980471 4.998047,-4.9980471 z"
				id="path929"
				style="color:#000000;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:medium;line-height:normal;font-family:sans-serif;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-feature-settings:normal;text-indent:0;text-align:start;text-decoration:none;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000000;letter-spacing:normal;word-spacing:normal;text-transform:none;writing-mode:lr-tb;direction:ltr;text-orientation:mixed;dominant-baseline:auto;baseline-shift:baseline;text-anchor:start;white-space:normal;shape-padding:0;clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;opacity:1;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-color:#000000;solid-opacity:1;vector-effect:none;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.99999988;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;paint-order:stroke fill markers;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate"
				transform="matrix(0.26458333,0,0,0.26458333,0,288.53332)"
			/>
		</g>
	</svg>

	<svg
		width="28"
		height="28"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		class=""
	>
		<path
			d="M15.5562 14.5477L15.1007 15.0272C15.1007 15.0272 14.0181 16.167 11.0631 13.0559C8.10812 9.94484 9.1907 8.80507 9.1907 8.80507L9.47752 8.50311C10.1841 7.75924 10.2507 6.56497 9.63424 5.6931L8.37326 3.90961C7.61028 2.8305 6.13596 2.68795 5.26145 3.60864L3.69185 5.26114C3.25823 5.71766 2.96765 6.30945 3.00289 6.96594C3.09304 8.64546 3.81071 12.259 7.81536 16.4752C12.0621 20.9462 16.0468 21.1239 17.6763 20.9631C18.1917 20.9122 18.6399 20.6343 19.0011 20.254L20.4217 18.7584C21.3806 17.7489 21.1102 16.0182 19.8833 15.312L17.9728 14.2123C17.1672 13.7486 16.1858 13.8848 15.5562 14.5477Z"
			class="fill-black"
		/>
		<path
			d="M13.2595 1.87983C13.3257 1.47094 13.7122 1.19357 14.1211 1.25976C14.1464 1.26461 14.2279 1.27983 14.2705 1.28933C14.3559 1.30834 14.4749 1.33759 14.6233 1.38082C14.9201 1.46726 15.3347 1.60967 15.8323 1.8378C16.8286 2.29456 18.1544 3.09356 19.5302 4.46936C20.906 5.84516 21.705 7.17097 22.1617 8.16725C22.3899 8.66487 22.5323 9.07947 22.6187 9.37625C22.6619 9.52466 22.6912 9.64369 22.7102 9.72901C22.7197 9.77168 22.7267 9.80594 22.7315 9.83125L22.7373 9.86245C22.8034 10.2713 22.5286 10.6739 22.1197 10.7401C21.712 10.8061 21.3279 10.53 21.2601 10.1231C21.258 10.1121 21.2522 10.0828 21.2461 10.0551C21.2337 9.9997 21.2124 9.91188 21.1786 9.79572C21.1109 9.56339 20.9934 9.21806 20.7982 8.79238C20.4084 7.94207 19.7074 6.76789 18.4695 5.53002C17.2317 4.29216 16.0575 3.59117 15.2072 3.20134C14.7815 3.00618 14.4362 2.88865 14.2038 2.82097C14.0877 2.78714 13.9417 2.75363 13.8863 2.7413C13.4793 2.67347 13.1935 2.28755 13.2595 1.87983Z"
			class="fill-black"
		/>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M13.4857 5.3293C13.5995 4.93102 14.0146 4.7004 14.4129 4.81419L14.2069 5.53534C14.4129 4.81419 14.4129 4.81419 14.4129 4.81419L14.4144 4.81461L14.4159 4.81505L14.4192 4.81602L14.427 4.81834L14.4468 4.8245C14.4618 4.82932 14.4807 4.8356 14.5031 4.84357C14.548 4.85951 14.6074 4.88217 14.6802 4.91337C14.8259 4.97581 15.0249 5.07223 15.2695 5.21694C15.7589 5.50662 16.4271 5.9878 17.2121 6.77277C17.9971 7.55775 18.4782 8.22593 18.7679 8.7154C18.9126 8.95991 19.009 9.15897 19.0715 9.30466C19.1027 9.37746 19.1254 9.43682 19.1413 9.48173C19.1493 9.50418 19.1555 9.52301 19.1604 9.53809L19.1665 9.55788L19.1688 9.56563L19.1698 9.56896L19.1702 9.5705C19.1702 9.5705 19.1707 9.57194 18.4495 9.77798L19.1707 9.57194C19.2845 9.97021 19.0538 10.3853 18.6556 10.4991C18.2607 10.6119 17.8492 10.3862 17.7313 9.99413L17.7276 9.98335C17.7223 9.96832 17.7113 9.93874 17.6928 9.89554C17.6558 9.8092 17.5887 9.66797 17.4771 9.47938C17.2541 9.10264 16.8514 8.53339 16.1514 7.83343C15.4515 7.13348 14.8822 6.73078 14.5055 6.50781C14.3169 6.39619 14.1757 6.32909 14.0893 6.29209C14.0461 6.27358 14.0165 6.26254 14.0015 6.25721L13.9907 6.25352C13.5987 6.13564 13.3729 5.72419 13.4857 5.3293Z"
			class="fill-black"
		/>
	</svg>
</div> -->
