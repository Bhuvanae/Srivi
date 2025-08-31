<script>
	// @ts-nocheck
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { storeData } from '../store.svelte';
	// import crackersData from '../../lib/crackes.json';
	import { fetchApi } from '$lib/fetchApi';

	let store = $state(storeData());

	let cartItems = $state(store.cartItems);

	let couponDetail = $state({ couponAmount: 300 });
	let pdfContent;
	let html2pdf;
	let inputValues = {
		firstName: 'Krish',
		lastName: 'R',
		street: 'Main Street',
		district: 'Sivakasi',
		pincode: '626123',
		type: 'Home',
		email: 'example@email.com',
		mobile: '9876543210'
	};
	let checkPdf = `<div class="flex h-fit w-full flex-col gap-3 mb-4">
	<div
		class="no-break border-b border-primary-300 flex h-fit w-full items-center justify-between py-4"
	>
		<div class="flex w-fit items-center gap-3">
			<div class="logo-wrapper">
				<img src="/logo.png" alt="Logo" width="70" height="70" />
			</div>
			<h1 class="text-[24px] -mt-5 leading-none h-fit font-bold">Agni Siragu Pattasugal</h1>
		</div>

		<div class="flex h-fit flex-col gap-1 text-sm font-semibold">
			<p>Agni Siragu Pattasugal</p>
			<p>Veerachelliahpuram</p>
			<p>Virudhunagar to Sivakasi road</p>
			<p>Sivakasi, Virudhunagar (dt).</p>
			<p>+91 7305962902 , +91 7305962906</p>
		</div>
	</div>
 <div class="no-break flex items-start justify-between text-sm">
		<div class="flex flex-col gap-1">
			<h3 class="text-base font-bold">Delivery Address:</h3>
			<p>${inputValues.firstName || ''} ${inputValues.lastName || ''}</p>
			<p>${inputValues.street}</p>
			<p>${inputValues.district} ${inputValues.pincode}</p>
			<p>${inputValues.type}</p>
		</div>

		<div class="flex flex-col gap-1">
			<p><strong>Email:</strong> ${inputValues.email}</p>
			<p><strong>Mobile:</strong> +91 ${inputValues.mobile}</p>
		</div>
	</div>

  
  <table class="w-full border-collapse">
		<thead class="bg-[#a91b0c] text-white">
			<tr>
				<th class="border border-[#ddd] p-2 text-center">S.No</th>
				<th class="border border-[#ddd] p-2 text-center">Item</th>
				<th class="border border-[#ddd] p-2 text-center">Quantity</th>
				<th class="border border-[#ddd] p-2 text-center">Original Price</th>
				<th class="border border-[#ddd] p-2 text-center">Discounted Price</th>
				<th class="border border-[#ddd] p-2 text-center">Subtotal</th>
			</tr>
		</thead>
		
		<tbody>
      ${cartItems
				.map(
					(cart, index) => `
       	<tr>
					<td class="border border-[#ddd] p-2 text-center">${index + 1}</td>
					<td class="border border-[#ddd] p-2 text-center">${cart.name}</td>
					<td class="border border-[#ddd] p-2 text-center">${cart.cartQuantity}</td>
					<td class="border border-[#ddd] p-2 text-center"
						>${Number(cart.actualprice).toFixed(0)}</td
					>
					<td class="border border-[#ddd] p-2 text-center">${cart.price}</td>
					<td class="border border-[#ddd] p-2 text-center">${cart.cartQuantity * cart.price}</td>
				</tr>
      `
				)
				.join('')}
        <tr class=" bg-secondary-100">
				<td colspan="5" class="border border-[#ddd] p-2 text-right font-bold">Coupon Discount</td>
				<td class="border border-[#ddd] p-2 text-center">(-) ${couponDetail.couponAmount || 0}</td>
			</tr>
			<tr class="bg-secondary">
				<td colspan="5" class="border border-[#ddd] p-2 text-right font-bold">Total</td>
				<td class="border border-[#ddd] p-2 text-center"
					>${
						cartItems.reduce((sum, item) => sum + item.cartQuantity * item.price, 0) -
						(couponDetail.couponAmount || 0)
					}</td
				>
			</tr>
		</tbody>
	</table>
  </div>
`;

	onMount(async () => {
		if (browser) {
			const module = await import('html2pdf.js');
			html2pdf = module.default;
		}
		// getData();
	});

	const generatePDF = () => {
		const element = pdfContent;

		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = checkPdf;
		const opt = {
			margin: 10,
			filename: 'myfile.pdf',
			image: { type: 'jpeg', quality: 0.98 },
			html2canvas: { scale: 2 },
			jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
		};

		// Generate the PDF
		// html2pdf().from(element).set(opt).save();
		if (tempDiv) html2pdf().from(tempDiv).set(opt).save();
	};

	const toTitle = (str) =>
		str
			// split camelCase
			.replace(/([a-z])([A-Z])/g, '$1 $2')
			// turn underscores/dashes into spaces
			.replace(/[_-]+/g, ' ')
			// collapse extra spaces & trim
			.replace(/\s+/g, ' ')
			.trim()
			// make all lower, then Title Case each word
			.toLowerCase()
			.replace(/\b\w/g, (c) => c.toUpperCase());

	// let dataaa = crackersData;

	// "GIFT_BOX": [
	// 	{
	// 		"name": "21 Items",
	// 		"actual_price": 1500,
	// 		"discount": 300,
	// 		"price": 1200,
	// 		"quantity": "1 Box"
	// 	},
	// 	{
	// 		"name": "25 Items",
	// 		"actual_price": 1750,
	// 		"discount": 350,
	// 		"price": 1400,
	// 		"quantity": "1 Box"
	// 	},
	// 	{
	// 		"name": "30 Items",
	// 		"actual_price": 2250,
	// 		"discount": 450,
	// 		"price": 1800,
	// 		"quantity": "1 Box"
	// 	},
	// 	{
	// 		"name": "35 Items",
	// 		"actual_price": 2500,
	// 		"discount": 500,
	// 		"price": 2000,
	// 		"quantity": "1 Box"
	// 	},
	// 	{
	// 		"name": "40 Items",
	// 		"actual_price": 3250,
	// 		"discount": 650,
	// 		"price": 2600,
	// 		"quantity": "1 Box"
	// 	},
	// 	{
	// 		"name": "50 Items",
	// 		"actual_price": 4500,
	// 		"discount": 900,
	// 		"price": 3600,
	// 		"quantity": "1 Box"
	// 	}
	// ]

	// function getData(e) {
	// 	// console.log(crackersData);
	// 	if (crackersData.length !== 0) {
	// 		Object.entries(crackersData).forEach(([key, value]) => {
	// 			console.log(toTitle(key));
	// 			value.forEach(async (item) => {
	// 				console.log(item);
	// 				let crackerAction = await fetchApi('/products', 'POST', 'addCracker', {
	// 					name: item.name,
	// 					type: toTitle(key),
	// 					actualprice: item.actual_price,
	// 					discount: 80,
	// 					price: item.discount,
	// 					quantity: 1,
	// 					stocks: 20
	// 				});
	// 				console.log(crackerAction);

	// 				if (crackerAction.resStatus == 200) {
	// 					console.log('yes');
	// 				} else {
	// 					console.log(item.name);
	// 				}
	// 			});
	// 		});
	// 	}

		// const file = e.target.files[0];
		// const reader = new FileReader();

		// reader.onload = function (event) {
		// 	const data = new Uint8Array(event.target.result);
		// 	const workbook = XLSX.read(data, { type: 'array' });

		// 	// Loop through all sheets
		// 	let allData = {};
		// 	workbook.SheetNames.forEach((sheetName) => {
		// 		const sheet = workbook.Sheets[sheetName];
		// 		const json = XLSX.utils.sheet_to_json(sheet, { defval: null });
		// 		allData[sheetName] = json;
		// 	});

		// 	console.log(allData); // Full cracker data in JSON format
		// };

		// reader.readAsArrayBuffer(file);
	// }
</script>

<!-- <input
	type="file"
	id="upload"
	oninput={(e) => {
		getData(e);
	}}
	accept=".xlsx, .xls"
/> -->
<!-- <button onclick={getData} class=" button">data</button> -->

<div bind:this={pdfContent}>
	<!-- Your content to be converted to PDF goes here -->
	<h1>My PDF Content</h1>
	<p>This will be converted to a PDF document.</p>
</div>

<button onclick={generatePDF} class=" button">Generate PDF</button>
<div class="flex h-fit w-full flex-col gap-3">
	<div
		class="no-break border-primary-300 flex h-fit w-full items-center justify-between border-b py-4"
	>
		<div class="flex w-fit items-center gap-3">
			<div class="logo-wrapper">
				<img src="/logo.png" alt="Logo" width="70" height="70" />
			</div>
			<h1 class="-mt-5 h-fit text-[24px] leading-none font-bold">Agni Siragu Pattasugal</h1>
		</div>

		<div class="flex h-fit flex-col gap-1 text-sm font-semibold">
			<p>Agni Siragu Pattasugal</p>
			<p>Veerachelliahpuram</p>
			<p>Virudhunagar to Sivakasi road</p>
			<p>Sivakasi, Virudhunagar (dt).</p>
			<p>+91 7305962902 , +91 7305962906</p>
		</div>
	</div>
	<!-- Customer info section -->
	<div class="no-break flex items-start justify-between text-sm">
		<div class="flex flex-col gap-1">
			<h3 class="text-base font-bold">Delivery Address:</h3>
			<p>${inputValues.firstName || ''} ${inputValues.lastName || ''}</p>
			<p>${inputValues.street}</p>
			<p>${inputValues.district} ${inputValues.pincode}</p>
			<p>${inputValues.type}</p>
		</div>

		<div class="flex flex-col gap-1">
			<p><strong>Email:</strong> ${inputValues.email}</p>
			<p><strong>Mobile:</strong> +91 ${inputValues.mobile}</p>
		</div>
	</div>

	<table class="w-full border-collapse">
		<thead class="bg-[#a91b0c] text-white">
			<tr>
				<th class="border border-[#ddd] p-2 text-center">S.No</th>
				<th class="border border-[#ddd] p-2 text-center">Item</th>
				<th class="border border-[#ddd] p-2 text-center">Quantity</th>
				<th class="border border-[#ddd] p-2 text-center">Original Price</th>
				<th class="border border-[#ddd] p-2 text-center">Discounted Price</th>
				<th class="border border-[#ddd] p-2 text-center">Subtotal</th>
			</tr>
		</thead>
		<tbody>
			{#each cartItems as cart, index}
				<tr>
					<td class="border border-[#ddd] p-2 text-center">${index + 1}</td>
					<td class="border border-[#ddd] p-2 text-center">${cart.name}</td>
					<td class="border border-[#ddd] p-2 text-center">${cart.cartQuantity}</td>
					<td class="border border-[#ddd] p-2 text-center"
						>${Number(cart.actualprice).toFixed(0)}</td
					>
					<td class="border border-[#ddd] p-2 text-center">${cart.price}</td>
					<td class="border border-[#ddd] p-2 text-center">${cart.cartQuantity * cart.price}</td>
				</tr>
			{/each}
			<tr class=" bg-tertiory">
				<td colspan="5" class="border border-[#ddd] p-2 text-right font-bold">Coupon Discount</td>
				<td class="border border-[#ddd] p-2 text-center">(-) ${couponDetail.couponAmount || 0}</td>
			</tr>
			<tr class="bg-secondary">
				<td colspan="5" class="border border-[#ddd] p-2 text-right font-bold">Total</td>
				<td class="border border-[#ddd] p-2 text-center"
					>${cartItems.reduce((sum, item) => sum + item.cartQuantity * item.price, 0) -
						(couponDetail.couponAmount || 0)}</td
				>
			</tr>
			<!-- ${cartItems
			.map(
				(cart, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${cart.name}</td>
          <td>${cart.cartQuantity}</td>
          <td>${Number(cart.actualprice).toFixed(0)}</td>
          <td>${cart.price}</td>
          <td>${cart.cartQuantity * cart.price}</td>
        </tr>
      `
			)
			.join('')} -->
		</tbody>
	</table>
</div>
