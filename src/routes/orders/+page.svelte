<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { fetchApi } from '$lib/fetchApi';
	import OrdersComponent from '$lib/ordersComponent.svelte';
	import OverlayWithSlot from '$lib/overlayWithSlot.svelte';
	import { onMount } from 'svelte';
	import LoadingAnimation from '$lib/loadingAnimation.svelte';
	import { storeNew } from '../storeNew.svelte';
	import { browser } from '$app/environment';
	import { storeData } from '../store.svelte';

	let html2pdf;
	let ordersData = $state([]);
	let ordersDataforFilter = $state([]);
	let accountData = $state([]);
	let loading = $state('pageLoading');

	onMount(async () => {
		if (await storeData().admin) {
			if (browser) {
				const module = await import('html2pdf.js');
				html2pdf = module.default;
			}
			let getData = await fetchApi('/orders', 'GET', '', {});
			if (getData.resStatus == 200) {
				ordersData = getData.data.list ? getData?.data.list : [];
				loading = 'showPage';
				ordersDataforFilter = getData.data.list ? getData?.data.list : [];
				if (ordersData.length !== 0) {
					sortData();
				}
				accountData = getData.data.account ? getData?.data.account : [];
			} else {
				loading = 'pageError';
			}
		} else {
			goto('/home');
			storeNew.toast = {
				show: true,
				title: "You don't have access to this content.",
				duration: 3000,
				action: 'failure'
			};
		}
	});

	let ascanding = $state(false);
	function sortData(button) {
		if (button == 'arrow') {
			ascanding = !ascanding;
		}
		ordersData.sort((a, b) => {
			if (sortType === 'order_date') {
				return ascanding
					? new Date(a[sortType]) - new Date(b[sortType])
					: new Date(b[sortType]) - new Date(a[sortType]);
			} else if (typeof a[sortType] === 'string') {
				return ascanding
					? a[sortType].localeCompare(b[sortType])
					: b[sortType].localeCompare(a[sortType]);
			} else {
				return ascanding ? a[sortType] - b[sortType] : b[sortType] - a[sortType];
			}
		});
	}
	function filterData(value, filter) {
		if (value) {
			ordersData = ordersDataforFilter.filter((item) => {
				return item.order_date.split('T')[0] == value;
			});
		} else {
			ordersData = ordersDataforFilter;
		}
	}
	let sortType = $state('order_date');
	let today = new Date().toISOString().split('T')[0];
	let showErrorOverlay = $state({ show: false, message: '' });

	async function confirmOrder(status, details) {
		if (
			status == 'Dispatched' ||
			status == 'Payment' ||
			status == 'Confirmed' ||
			status == 'Delivered'
		) {
			if (
				(status == 'Payment' && details.account && details.account !== null) ||
				status == 'Dispatched' ||
				status == 'Confirmed' ||
				status == 'Delivered'
			) {
				details.status = status;
				let confirmOrder = await fetchApi('/orders', 'POST', 'confirmOrder', details);
				if (confirmOrder.resStatus == 200) {
					let amount = 0;
					let phoneNumber = '';
					let name = '';
					ordersData.forEach((item) => {
						if (item.order_id == details.id) {
							item.status = status;
							item.confirmby = details.account;
							amount = item.amount_with_discount;
							phoneNumber = item.phone_number;
							name = item.customer_name;
						}
					});
					sendWhatsAppMessage(status, {
						name,
						amount,
						orderId: details.id,
						upiId: 7987654643,
						trackingNumber: 0,
						phoneNumber
					});
					ordersDataforFilter = ordersData;
					storeNew.toast = {
						show: true,
						title: 'Status updated',
						action: 'success',
						duration: 3000
					};
				} else {
					showErrorOverlay = { show: true, message: confirmOrder.data };
					storeNew.toast = {
						show: true,
						title: 'Error Occured, Try again',
						action: 'failure',
						duration: 3000
					};
				}
			} else {
				storeNew.toast = {
					show: true,
					title: 'Account details is necessary',
					action: 'failure',
					duration: 3000
				};
			}
		} else {
			let closeOrder = await fetchApi('/orders', 'POST', 'deleteOrder', details);
			if (closeOrder.resStatus == 200) {
				ordersData = ordersData.filter((item) => {
					return item.order_id !== details.id;
				});
				storeNew.toast = {
					show: true,
					title: 'Order Deleted',
					action: 'success',
					duration: 3000
				};
			} else {
				storeNew.toast = {
					show: true,
					title: 'Error Occured, Try again',
					action: 'failure',
					duration: 3000
				};
			}
		}
	}

	function sendWhatsAppMessage(
		stage,
		{ name, amount, orderId, upiId, trackingNumber, phoneNumber }
	) {
		let message = '';
		let channelLink = 'https://whatsapp.com/channel/0029Vb6c39P7dmejAqhTEZ39';

		switch (stage) {
			case 'Confirmed':
				message = `Dear ${name},\nWe have received your order (ID: ${orderId}).\nPlease complete your payment of ₹${amount} via UPI to ${upiId} to proceed.\n You can pay this account number 74859665646546 and IFSC code is BKID 6546546654. \n Thank you for choosing us! \n\n Join our WhatsApp Channel for updates : ${channelLink}`;
				break;

			case 'Payment':
				message = `Dear ${name},\nWe have received your payment of ₹${amount}.\nYour order (ID: ${orderId}) is being processed and will be dispatched soon.\nThank you for your prompt payment! \n\n Join our WhatsApp Channel for updates : ${channelLink}`;
				break;

			case 'Dispatched':
				message = `Dear ${name},\nYour order (ID: ${orderId}) has been dispatched via courier.\nTracking Number: ${trackingNumber}.\nThank you for shopping with us! \n\n Join our WhatsApp Channel for updates : ${channelLink}`;
				break;

			case 'Delivered':
				message = `Dear ${name},\nYour order (ID: ${orderId}) has been successfully delivered.\nWe hope you enjoy your crackers!\nThank you for trusting us! \n\n Join our WhatsApp Channel for updates : ${channelLink}`;
				break;

			default:
				console.error('Invalid stage provided');
				return;
		}

		// Encode message for WhatsApp URL
		const encodedMessage = encodeURIComponent(message);
		const url = `https://wa.me/+91${phoneNumber}?text=${encodedMessage}`;

		// Open WhatsApp
		window.open(url, '_blank');
	}

	function printList(value) {
		let list = 'preview';
		let serialTable = 1;
		let addressSplit = value.address.split('_');
		const tableHTML = `
		
		<div class="flex h-fit w-full flex-col gap-3 mb-4">
	<div
		class="no-break border-b border-primary-300 flex h-fit w-full items-center justify-between py-4"
	>
		<div class="flex w-fit items-center gap-3">
			<div class="logo-wrapper">
				<img src="/logo.png" alt="Logo" width="70" height="70" />
			</div>
			<h1 class="text-[24px] -mt-5 leading-none h-fit font-bold">${storeNew.cAddress.address1}</h1>
		</div>

		<div class="flex h-fit flex-col gap-1 text-sm font-semibold">
			<p>${storeNew.cAddress.address1}</p>
			<p>${storeNew.cAddress.address2}</p>
			<p>${storeNew.cAddress.address3}</p>
			<p>${storeNew.cAddress.address4},${storeNew.cAddress.address5}</p>
			<p>${storeNew.cAddress.mobile1}, ${storeNew.cAddress.mobile2}</p>
		</div>
	</div>
 <div class="no-break flex items-start justify-between text-sm">
		<div class="flex flex-col gap-1">
			<h3 class="text-base font-bold">Delivery Address:</h3>
					<p>${value.name},</p>
		${addressSplit.map((item) => `<p>${item}</p>`).join('')}
		</div>

		<div class="flex flex-col gap-1">
			<p><strong>Email:</strong> ${value.email}</p>
			<p><strong>Mobile:</strong> +91 ${value.mobile}</p>
		</div>
	</div>

	<table class="w-full border-collapse table">
		<thead class="bg-[#a91b0c] text-white">
			<tr class="no_break">
				<th class="border border-[#ddd] p-2 text-center table-cell">S.No</th>
				<th class="border border-[#ddd] p-2 text-center table-cell">Cracker Name</th>
				<th class="border border-[#ddd] p-2 text-center table-cell">Quantity</th>
				
			</tr>
		</thead>
		
		<tbody>
      ${value.crackers
				.map(
					(cart, index) => `
       	<tr class="no_break">
					<td class="border border-[#ddd] p-2 text-center table-cell">${index + 1}</td>
					<td class="border border-[#ddd] p-2 text-center table-cell">${cart.name}</td>
					<td class="border border-[#ddd] p-2 text-center table-cell">${cart.quantity}</td>
				</tr>
      `
				)
				.join('')}
       
		</tbody>
	</table>
  </div>
		`;
		generateAndDownloadPDF(tableHTML, 'preview');
	}

	async function generateAndDownloadPDF(htmlString, action) {
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = htmlString;

		const opt = {
			margin: 10,
			filename: 'myfile.pdf',
			image: { type: 'jpeg', quality: 0.98 },
			html2canvas: { scale: 2 },
			jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
		};

		await html2pdf()
			.set(opt)
			.from(tempDiv)
			.toPdf()
			.get('pdf')
			.then((pdf) => {
				const pdfBlob = pdf.output('blob');
				const pdfUrl = URL.createObjectURL(pdfBlob);
				window.open(pdfUrl, '_blank');
			});
	}

	function closeOverlay() {
		showErrorOverlay = { show: false, message: '' };
	}

	function refreshBage() {
		location.reload();
	}
</script>

<section class="h-fit min-h-[600px] w-full">
	<div class="flex h-fit w-full flex-col gap-6 px-3 py-9 md:px-10 lg:px-32">
		<h1 class="text-center text-2xl font-semibold md:hidden lg:text-4xl">Orders</h1>

		<div class="flex h-12 w-full justify-between gap-4 max-sm:flex-col">
			<div
				class="flex h-8 w-full items-center gap-2 max-sm:justify-center sm:w-1/2 md:w-4/10 lg:w-3/10"
			>
				<p class="max-md:text-sm">Sort by :</p>
				<select
					class="h-full w-4/5 max-w-36"
					onchange={(e) => {
						sortData(e.target.value);
					}}
					bind:value={sortType}
				>
					<option value="order_date">Date</option>
					<option value="customer_name">Customer Name</option>
					<option value="amount_with_discount">Amount</option>
					<option value="confirmby">Bank</option>
					<option value="order_id">Order No.</option>
					<option value="status">Status</option>
				</select>
				<button
					class="bg-primary-250 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md"
					onclick={() => sortData('arrow')}
					>{#if ascanding}
						<svg
							width="15"
							height="15"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M0 5H3L3 16H5L5 5L8 5V4L4 0L0 4V5Z" class="fill-white" />
							<path d="M16 16H10V14H16V16Z" class="fill-white" />
							<path d="M10 12H14V10H10V12Z" class="fill-white" />
							<path d="M12 8H10V6H12V8Z" class="fill-white" />
						</svg>{:else}
						<svg
							width="15"
							height="15"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M0 11H3L3 0H5L5 11H8V12L4 16L0 12V11Z" class="fill-white" />
							<path d="M16 0H10V2H16V0Z" class="fill-white" />
							<path d="M10 4H14V6H10V4Z" class="fill-white" />
							<path d="M12 8H10V10H12V8Z" class="fill-white" />
						</svg>
					{/if}</button
				>
			</div>
			<h1 class="text-center text-2xl font-semibold max-md:hidden lg:text-4xl">Orders</h1>
			<div
				class="flex h-10 w-full items-center justify-center gap-2.5 sm:w-1/2 sm:justify-end md:w-4/10 lg:w-3/10"
			>
				<p class="max-md:text-sm">Filter by date :</p>
				<input
					type="date"
					class="border border-gray-300"
					onchange={(e) => {
						filterData(e.target.value, 'filter');
					}}
					max={today}
				/>
			</div>
		</div>
		{#if loading == 'pageLoading'}
			<div class="flex h-full min-h-[400px] w-full items-center justify-center gap-3">
				<p class="text-xl font-semibold">Loading</p>
				<LoadingAnimation color="bg-black" />
			</div>
		{:else if loading == 'showPage'}
			<div class="flex h-fit min-h-[500px] w-full flex-col max-sm:my-3">
				{#if ordersData.length !== 0}
					{#each ordersData as orders}
						<div class=" h-fit w-full">
							<OrdersComponent
								orderId={orders.order_id}
								name={orders.customer_name}
								mobile={orders.phone_number}
								crackers={orders.items}
								email={orders.email}
								status={orders.status}
								amount={orders.amount_with_discount}
								{confirmOrder}
								accountList={accountData}
								account={orders.confirmby}
								coupon={orders.coupons}
								address={orders.address}
								city={orders.city}
								{printList}
							/>
						</div>
					{/each}
				{:else}
					<div class="flex h-full min-h-[400px] w-full items-center justify-center">
						<p class="text-secondary-400 text-xl font-semibold">No orders found</p>
					</div>
				{/if}
			</div>
		{:else if loading == 'pageError'}
			<div class="flex h-full min-h-[400px] w-full flex-col items-center justify-center gap-4">
				<p class="text-xl font-bold">Couldn't get data</p>

				<button
					class="bg-primary-350 w-fit cursor-pointer rounded-md px-4 py-1.5 font-semibold text-white"
					onclick={refreshBage}>Refresh</button
				>
			</div>
		{/if}
	</div>
</section>

{#if showErrorOverlay.show}
	<OverlayWithSlot width="w-1/2" close={closeOverlay}>
		<div
			class=" flex w-full flex-col items-center justify-center gap-3 rounded-lg bg-gray-100 py-3 shadow-lg"
		>
			<p class="text text-xl font-semibold text-black">Please add the stocks</p>

			<p class="text text-lg font-medium text-black opacity-70">{showErrorOverlay.message}</p>
			<div class="flex gap-3">
				<button
					onclick={closeOverlay}
					class="bg-tertiory-400 cursor-pointer rounded-md px-2 py-1.5 font-semibold text-black transition-all duration-300 hover:scale-105"
				>
					Close
				</button>
				<button
					onclick={() => {
						goto('/pricelist');
					}}
					class="bg-primary-400 cursor-pointer rounded-md px-2 py-1.5 font-semibold text-white transition-all duration-300 hover:scale-105"
				>
					Update stocks
				</button>
			</div>
		</div>
	</OverlayWithSlot>
{/if}
