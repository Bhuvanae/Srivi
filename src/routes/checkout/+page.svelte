<script>
	// @ts-nocheck

	import ImageWithLazy from '$lib/imageWithLazy.svelte';
	import { check } from 'prettier';
	import { storeData } from '../store.svelte';
	import { fly, slide } from 'svelte/transition';
	import InputText from '$lib/inputText.svelte';
	import InputZipcode from '$lib/InputZipcode.svelte';
	import EmailInput from '$lib/emailInput.svelte';
	import InputNumber from '$lib/inputNumber.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { fetchApi } from '$lib/fetchApi';
	import { error } from '@sveltejs/kit';
	import { storeNew } from '../storeNew.svelte';
	import { browser } from '$app/environment';

	let html2pdf;

	let store = storeData();
	// let loading = $state('startPage');
	let cartQuantity = $state(store.cartItems.reduce((sum, item) => sum + item.cartQuantity, 0));
	let cartPrice = $state(
		store.cartItems.reduce((sum, item) => sum + item.cartQuantity * item.price, 0)
	);
	let inputValues = $state({
		country: 'India',
		coupon: ''
	});
	let intersection = $state({
		container1: false,
		container2: false,
		container3: false,
		container4: false,
		container5: false
	});
	onMount(async () => {
		if (browser) {
			const module = await import('html2pdf.js');
			html2pdf = module.default;
		}
		if (storeNew.saveAdd) {
			let tempValue = storeNew.saveAdd;
			tempValue.coupon = '';
			storeNew.saveAdd = tempValue;
			inputValues = storeNew.saveAdd;
			inputValues.country = 'India';
		}
		const options = {
			root: null, // viewport
			rootMargin: '0px',
			threshold: 0.5 // Intersection ratio
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.target.id == 'container1') {
					if (entry.isIntersecting) {
						intersection.container1 = true;
					}
				}
				if (entry.target.id == 'container2') {
					if (entry.isIntersecting) {
						intersection.container2 = true;
					} else if (entry.isVisible) {
						intersection.container2 = true;
					}
				}
				if (entry.target.id == 'container3') {
					if (entry.isIntersecting) {
						intersection.container3 = true;
					}
				}
				if (entry.target.id == 'container4') {
					if (entry.isIntersecting) {
						intersection.container4 = true;
					}
				}
				if (entry.target.id == 'container5') {
					if (entry.isIntersecting) {
						intersection.container5 = true;
					}
				}
			});
		}, options);

		const container1 = document.querySelector('#container1');
		const container2 = document.querySelector('#container2');
		const container3 = document.querySelector('#container3');

		if (container1) {
			observer.observe(container1);
		}
		if (container2) {
			observer.observe(container2);
		}
		if (container3) {
			observer.observe(container3);
		}

		// Cleanup
		return () => {
			if (container1) {
				observer.unobserve(container1);
			}
			if (container2) {
				observer.unobserve(container2);
			}
			if (container3) {
				observer.unobserve(container3);
			}
		};
	});

	let states = [
		'Andhra Pradesh',
		'Arunachal Pradesh',
		'Assam',
		'Bihar',
		'Chhattisgarh',
		'Goa',
		'Gujarat',
		'Haryana',
		'Himachal Pradesh',
		'Jammu and Kashmir',
		'Jharkhand',
		'Karnataka',
		'Kerala',
		'Madhya Pradesh',
		'Maharashtra',
		'Manipur',
		'Meghalaya',
		'Mizoram',
		'Nagaland',
		'Odisha',
		'Punjab',
		'Rajasthan',
		'Sikkim',
		'Tamil Nadu',
		'Telangana',
		'Tripura',
		'Uttarakhand',
		'Uttar Pradesh',
		'West Bengal',
		'Andaman and Nicobar Islands',
		'Chandigarh',
		'Dadra and Nagar Haveli',
		'Daman and Diu',
		'Delhi',
		'Lakshadweep',
		'Puducherry'
	];
	let serialTable = 1;
	async function downloadPDF(id) {
		const tableHTML = `<div class="flex h-fit w-full flex-col gap-3 mb-4">
	<div
		class="no-break border-b-2 border-primary-300 flex h-fit w-full items-center justify-between py-4"
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
 	<div class="no-break flex flex-col gap-5 py-4 border-b-2 border-primary-300">
		<p class="text-xl font-bold">Customer Details</p>
		<div class="flex items-start justify-between text-sm">
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
	</div>
	<div class="w-full h-fit flex flex-col gap-5 no-break">
		<p class="font-bold text-xl">OrderDetails</p>
		<p><strong>Invoice no</strong> : ${id}</p>
	

  <table class="w-full border-collapse table">
		<thead class="bg-[#a91b0c] text-white">
			<tr class="no_break">
				<th class="border border-[#ddd] px-2 py-2.5 text-center table-cell">S.No</th>
				<th class="border border-[#ddd] px-2 py-2.5 text-center table-cell">Item</th>
				<th class="border border-[#ddd] px-2 py-2.5 text-center table-cell">Quantity</th>
				<th class="border border-[#ddd] px-2 py-2.5 text-center table-cell">Original Price</th>
				<th class="border border-[#ddd] px-2 py-2.5 text-center table-cell">Discounted Price</th>
				<th class="border border-[#ddd] px-2 py-2.5 text-center table-cell">Subtotal</th>
			</tr>
		</thead>
		
		<tbody>
      ${cartItems
				.map(
					(cart, index) => `
       	<tr class="no_break">
					<td class="border border-[#ddd] p-2.5 text-center table-cell">${index + 1}</td>
					<td class="border border-[#ddd] p-2.5 text-center table-cell">${cart.name}</td>
					<td class="border border-[#ddd] p-2.5 text-center table-cell">${cart.cartQuantity}</td>
					<td class="border border-[#ddd] p-2.5 text-center table-cell"
						>${Number(cart.actualprice).toFixed(0)}</td
					>
					<td class="border border-[#ddd] p-2.5 text-center table-cell">${Math.trunc(cart.price)}</td>
					<td class="border border-[#ddd] p-2.5 text-center table-cell">${Math.trunc(cart.cartQuantity * cart.price)}</td>
				</tr>
      `
				)
				.join('')}
        <tr class=" bg-secondary-100 no_break">
				<td colspan="5" class="border border-[#ddd] p-2.5 text-right font-bold table-cell">Coupon Discount</td>
				<td class="border border-[#ddd] p-2.5 text-center table-cell">(-) ${couponDetail.couponAmount || 0}</td>
			</tr>
			<tr class="bg-secondary no_break">
				<td colspan="5" class="border border-[#ddd] p-2.5 text-right font-bold table-cell">Total</td>
				<td class="border border-[#ddd] p-2.5 text-center table-cell"
					>${Math.trunc(
						cartItems.reduce((sum, item) => sum + item.cartQuantity * item.price, 0) -
							(couponDetail.couponAmount || 0)
					)}</td
				>
			</tr>
		</tbody>
	</table>
		<p class="text-tertiory-550 mt-1 text-sm text-right font-bold">
					Freight charges are extra and will be applied as per actuals.*
				</p>
  </div>
  </div>
`;
		// sendOrderToWhatsApp(id);

		generateAndDownloadPDF(tableHTML);
	}

	async function generateAndDownloadPDF(htmlString) {
		try {
			// Create a temporary div to render the HTML
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = htmlString;
			const opt = {
				margin: 10,
				filename: 'Order_Invoice.pdf',
				image: { type: 'jpeg', quality: 0.98 },
				html2canvas: { scale: 2 },
				jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
			};
			if (tempDiv) html2pdf().from(tempDiv).set(opt).save();

			// Your success logic here
			if (
				inputValues.firstName &&
				inputValues.mobile &&
				inputValues.street &&
				inputValues.district &&
				inputValues.pincode &&
				inputValues.type &&
				inputValues.city
			) {
				store.cartItems = [];
				checkoutType = 'updateCart';
				goto('/products');
				inputValues.coupon = '';

				storeNew.saveAdd = inputValues;
				storeData().saveAdd = inputValues;
				inputValues = {
					country: 'India',
					coupon: ''
				};
			} else {
				validatePage = true;
			}
		} catch (error) {
			console.error('Error generating PDF:', error);
		} finally {
			// Remove the temporary div
			// document.body.removeChild(tempDiv);
		}
	}

	async function createOrder() {
		try {
			if (
				inputValues.firstName &&
				inputValues.mobile &&
				inputValues.street &&
				inputValues.district &&
				inputValues.pincode &&
				inputValues.type &&
				inputValues.city
			) {
				let queryData = [];
				cartItems.map((item) => {
					queryData.push({ itemid: item.id, nitems: item.cartQuantity });
				});

				let createOrder = await fetchApi('/orders', 'POST', 'createOrder', {
					name: inputValues.firstName || '' + inputValues.lastName || '',
					mobile: inputValues.mobile,
					cartData: queryData,
					actual: totalDetails.actual,
					amount: couponDetail.finalAmount ? couponDetail.finalAmount : totalDetails.price,
					coupon: inputValues.coupon,
					email: inputValues.email || null,
					address: `${inputValues.street || ''}_${inputValues.city}_${inputValues.district || ''}-${inputValues.pincode || ''}_${inputValues.type || ''}`,
					city: inputValues.city
				});
				if (createOrder.resStatus == 200) {
					downloadPDF(createOrder.data.create_orders);

					storeNew.toast = {
						show: true,
						title: 'Order Created Successfully',
						duration: 3000,
						action: 'success'
					};
				} else {
					storeNew.toast = {
						show: true,
						title: 'Error Occured,try again',
						duration: 3000,
						action: 'failure'
					};
				}
			} else {
				validatePage = true;
			}
		} catch (error) {
			console.error('Error generating PDF:', error);
		}
	}

	let statesList = $state(states);

	let checkoutType = $state('updateCart');

	let totalDetails = $state({
		actual: store.cartItems.reduce((sum, item) => sum + item.cartQuantity * item.actualprice, 0),
		price: Math.trunc(
			store.cartItems.reduce((sum, item) => sum + item.cartQuantity * item.price, 0)
		),
		quantity: store.cartItems.reduce((sum, item) => sum + item.cartQuantity, 0)
	});

	let cartItems = $state(store.cartItems);

	async function buttonOneHandler(detail, tButton, aButton) {
		if (tButton === 'cart') {
			cartItems = store.cartItems.map((x) => {
				if (x.id !== detail.id) return x;

				if (aButton === 'plus') {
					if (x.stocks - x.cartQuantity > 0) {
						return { ...x, cartQuantity: x.cartQuantity + 1 };
					} else {
						storeNew.toast = {
							show: true,
							action: 'failure',
							title: `Sorry! Only ${x.stocks} crackers available in stock. `,
							duration: 3000
						};
						return x;
					}
				} else if (aButton === 'minus') {
					return { ...x, cartQuantity: Math.max(x.cartQuantity - 1, 0) };
				}
				return x;
			});

			if (aButton === 'delete') {
				cartItems = store.cartItems.filter((x) => x.id !== detail.id);
			}

			store.cartItems = cartItems;

			totalDetails = {
				actual: store.cartItems.reduce(
					(sum, item) => sum + item.cartQuantity * item.actualprice,
					0
				),
				price: Math.trunc(
					store.cartItems.reduce((sum, item) => sum + item.cartQuantity * item.price, 0)
				),
				quantity: store.cartItems.reduce((sum, item) => sum + item.cartQuantity, 0)
			};
		}
	}

	function nextPage() {
		if (totalDetails.price > store.minimumCartValue) {
			checkoutType = 'address';
		}
	}

	function validate(value, id) {
		if (id == 'firstName' || id == 'lastName') {
			return /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/.test(value);
		} else if (id == 'mobile') {
			if (value !== undefined) {
				if (value) {
					if (value.toString().length == 10) {
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
		} else if (id == 'coupon') {
			if (value) {
				getCouponDetails(value);
				return true;
			} else {
				return true;
			}
		} else {
			if (value) {
				return true;
			} else {
				return false;
			}
		}
	}

	let validatePage = $state(false);

	// check
	function focusContainer(e) {}

	let showAutoComplete = $state(false);

	function componentHandlers(eventDetails) {
		statesList = states.filter((x) => {
			return x.toLowerCase().includes(eventDetails.value.toLowerCase());
		});
	}
	function showAutoCompletefn(Event, id, type) {
		if (type == 'onFocus') {
			showAutoComplete = true;
		} else if (type == 'onEsc') {
			showAutoComplete = false;
		}
	}
	function chooseType(name) {
		inputValues.type = name;
		showAutoComplete = false;
	}

	function sendOrderToWhatsApp(order) {
		let check = '8380619635:AAFaN7ZNCGTe4UIfnMISofqYPTiq342I7dw';
		let checkId = '-1002837140308';

		const message = `🎇 New order id ${order} has been placed!
                    To check order details to visit https://srivicrackers.com/orders as a admin
		
		`;

		fetch(`https://api.telegram.org/bot${check}/sendMessage`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				chat_id: checkId,
				text: message
			})
		})
			.then((res) => res.json())
			.then((data) => {})
			.catch((err) => console.error('Telegram error:', err));
	}

	// function orderCrackers() {
	// 	if (
	// 		(inputValues.firstName || inputValues.lastName) &&
	// 		inputValues.email &&
	// 		/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputValues.email) &&
	// 		inputValues.mobile &&
	// 		inputValues.type &&
	// 		inputValues.district &&
	// 		inputValues.street &&
	// 		inputValues.pincode &&
	// 		inputValues.country
	// 	) {
	// 		downloadPDF();
	// 	} else {
	// 		validatePage = true;
	// 	}
	// }
	let couponDetail = $state({ apply: false, error: undefined });
	async function getCouponDetails(value) {
		couponDetail = { apply: false, error: undefined, loading: 'load', min_amount: null };
		let getValue = await fetchApi('/coupons', 'POST', 'getDetails', { value: value });

		let couponValue = getValue.data.get_coupon_details;
		if (couponValue.id) {
			couponDetail.loading = 'done';
			if (totalDetails.actual > couponValue.min_amount || 0) {
				if (couponValue.discount !== null) {
					let discountValue = (couponValue.discount / 100) * totalDetails.price;
					if (couponValue.max_dis !== null) {
						if (couponValue.max_dis > discountValue) {
							couponDetail.couponAmount = Math.trunc(couponValue.max_dis);
							couponDetail.apply = true;
							couponDetail.finalAmount = Math.trunc(totalDetails.price - couponValue.max_dis);
						} else {
							couponDetail.couponAmount = Math.trunc(discountValue);
							couponDetail.apply = true;
							couponDetail.finalAmount = Math.trunc(totalDetails.price - discountValue);
						}
					} else {
						couponDetail.couponAmount = Math.trunc(discountValue);
						couponDetail.apply = true;
						couponDetail.finalAmount = Math.trunc(totalDetails.price - discountValue);
					}
				}
			} else {
				couponDetail.error = 'minAmount';
				couponDetail.min_amount = couponValue.min_amount;
				couponValue.apply = false;
			}
		} else {
			couponDetail.error = 'invalid';
			couponDetail.loading = 'done';
			couponValue.apply = false;
		}
	}
</script>

{#if checkoutType == 'updateCart'}
	<section
		class="flex h-fit min-h-[600px] w-full gap-8 px-3 py-8 md:px-10 lg:px-32"
		in:fly={{ x: 200, duration: 300 }}
		out:fly={{ x: -200, duration: 300 }}
	>
		<div class="h-full w-full py-4">
			<p
				id="container1"
				class="text-primary-350 text-center text-3xl font-semibold {intersection.container1
					? ' scale-100 opacity-100'
					: 'scale-0 opacity-0'} transistion-all delay-300 duration-800"
			>
				Your Cart
			</p>
			{#if cartItems}
				{#if cartItems.length !== 0}
					<div id="container2" class="min-h-[320px]">
						<table
							in:scale={{ duration: 300 }}
							class="transistion-all mt-8 w-full table-auto border-collapse delay-300 duration-800 {intersection.container1
								? ' translate-0 opacity-100'
								: 'translate-y-10 opacity-0'}"
						>
							<thead class="bg-gray-200">
								<tr class="h-12">
									<th scope="col" class=" w-1/10"></th>
									<th scope="col" class="w-1/5 text-center">Image</th>
									<th scope="col" class="w-2/5 text-left">Cracker Details</th>
									<th scope="col" class=" w-1/5">Amount</th>
								</tr>
							</thead>
							<tbody>
								{#each cartItems as item}
									<tr class="h-28 border-b border-gray-300">
										<td class="w-1/20">
											<button
												aria-label="Remove item"
												class="bg-primary-200 focus:ring-primary-500 flex h-10 w-10 items-center justify-center rounded-full focus:ring-2 focus:outline-none"
												onclick={() => buttonOneHandler(item, 'cart', 'delete')}
											>
												<svg
													width="20"
													height="20"
													viewBox="0 0 24 24"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
													aria-hidden="true"
												>
													<path
														d="M3 6.52381C3 6.12932 3.32671 5.80952 3.72973 5.80952H8.51787C8.52437 4.9683 8.61554 3.81504 9.45037 3.01668C10.1074 2.38839 11.0081 2 12 2C12.9919 2 13.8926 2.38839 14.5496 3.01668C15.3844 3.81504 15.4756 4.9683 15.4821 5.80952H20.2703C20.6733 5.80952 21 6.12932 21 6.52381C21 6.9183 20.6733 7.2381 20.2703 7.2381H3.72973C3.32671 7.2381 3 6.9183 3 6.52381Z"
														class="fill-gray-100"
													/>
													<path
														fill-rule="evenodd"
														clip-rule="evenodd"
														d="M11.5956 22H12.4044C15.1871 22 16.5785 22 17.4831 21.1141C18.3878 20.2281 18.4803 18.7749 18.6654 15.8685L18.9321 11.6806C19.0326 10.1036 19.0828 9.31511 18.6289 8.81545C18.1751 8.31579 17.4087 8.31579 15.876 8.31579H8.12404C6.59127 8.31579 5.82488 8.31579 5.37105 8.81545C4.91722 9.31511 4.96744 10.1036 5.06788 11.6806L5.33459 15.8685C5.5197 18.7749 5.61225 20.2281 6.51689 21.1141C7.42153 22 8.81289 22 11.5956 22ZM10.2463 12.1885C10.2051 11.7546 9.83753 11.4381 9.42537 11.4815C9.01321 11.5249 8.71251 11.9117 8.75372 12.3456L9.25372 17.6087C9.29494 18.0426 9.66247 18.3591 10.0746 18.3157C10.4868 18.2724 10.7875 17.8855 10.7463 17.4516L10.2463 12.1885ZM14.5746 11.4815C14.9868 11.5249 15.2875 11.9117 15.2463 12.3456L14.7463 17.6087C14.7051 18.0426 14.3375 18.3591 13.9254 18.3157C13.5132 18.2724 13.2125 17.8855 13.2537 17.4516L13.7537 12.1885C13.7949 11.7546 14.1625 11.4381 14.5746 11.4815Z"
														class="fill-gray-100"
													/>
												</svg>
											</button>
										</td>

										<td class="text-center">
											<div class="mx-auto h-20 w-20">
												<ImageWithLazy imageUrl={item.image} alt={`Image of ${item.name}`} />
											</div>
										</td>

										<td>
											<a
												href="crackerdetail{item.id}"
												class=" hover:text-primary-350 font-semibold hover:scale-110">{item.name}</a
											>
											<div class="mt-2 flex items-center">
												<button
													aria-label="Decrease quantity"
													class="focus:ring-primary-500 flex h-8 w-8 items-center justify-center rounded-l border border-gray-300 focus:ring-2 focus:outline-none"
													onclick={() => buttonOneHandler(item, 'cart', 'minus')}
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
															stroke="#000000"
															stroke-width="2"
															stroke-linecap="round"
															stroke-linejoin="round"
														/>
													</svg>
												</button>

												<div
													class="flex h-8 w-8 items-center justify-center border-t border-b border-gray-300"
												>
													{item.cartQuantity}
												</div>

												<button
													aria-label="Increase quantity"
													class="focus:ring-primary-500 flex h-8 w-8 items-center justify-center rounded-r border border-gray-300 focus:ring-2 focus:outline-none"
													onclick={() => buttonOneHandler(item, 'cart', 'plus')}
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
															stroke="#000000"
															stroke-width="2"
															stroke-linecap="round"
															stroke-linejoin="round"
														/>
													</svg>
												</button>
											</div>
											<p class="mt-2 font-medium">
												₹ {Math.trunc(item.price)}
												<span class="ml-2 text-sm text-gray-400 line-through">
													₹ {item.actualprice}
												</span>
											</p>
										</td>

										<td class="text-center font-semibold">
											₹ {Math.trunc(item.price * item.cartQuantity)}
										</td>
									</tr>
								{/each}

								<!-- Total Row -->
								<tr class="h-12 border-b border-gray-300 bg-gray-200">
									<td colspan="1"></td>
									<td class=" text-center font-bold">Total</td>
									<td class="text-left font-bold">{totalDetails.quantity} items</td>

									<td class="text-center font-bold"
										>₹ {totalDetails.price}
										<span class="text-sx pl-3 text-gray-400 line-through"
											>₹ {totalDetails.actual}</span
										></td
									>
								</tr>
							</tbody>
						</table>
					</div>
					<div
						id="container3"
						class="mt-4 flex h-12 w-full items-center justify-end {intersection.container3
							? ' scale-100 opacity-100'
							: 'scale-0 opacity-0'} transistion-all delay-300 duration-800"
					>
						<button
							onclick={nextPage}
							class="{totalDetails.price > store.minimumCartValue
								? 'bg-primary-300 cursor-pointer'
								: 'cursor-not-allowed bg-gray-400'} transistion-all flex h-10 items-center rounded-md px-4 text-gray-100 duration-300 hover:scale-110"
						>
							Continue
						</button>
					</div>
				{:else}
					<div class="flex h-[350px] w-full flex-col items-center justify-center gap-5">
						<p class="text-secondary-300 text-lg font-bold">
							Looks like your cart is feeling lonely. Let's add some Crackers!
						</p>
						<button
							class="bg-primary-300 transistion-all flex h-10 cursor-pointer items-center rounded-md px-4 text-gray-100 duration-300 hover:scale-110"
							onclick={() => {
								goto('/products');
							}}
						>
							Add Crackers
						</button>
					</div>
				{/if}
			{/if}
		</div>
	</section>
{:else if checkoutType == 'address'}
	<section
		class="transistion-all grid h-fit min-h-[600px] w-full grid-cols-1 gap-8 px-3 py-8 md:px-10 lg:grid-cols-[12fr_6fr] lg:px-32"
	>
		<div class="flex h-fit min-h-full w-full flex-col gap-5 py-4">
			<p class="text-2xl font-bold">Deliver to</p>
			<div class=" grid h-[64px] w-full grid-cols-2 gap-5">
				<div class="relative h-full w-full">
					<InputText
						id="firstName"
						name="Firstname"
						bind:store={inputValues}
						{validate}
						bgColor="bg-lightbg"
						{validatePage}
					/>
				</div>
				<div class="relative h-full w-full">
					<InputText
						id="lastName"
						name="Lastname"
						bind:store={inputValues}
						{validate}
						bgColor="bg-lightbg"
						{validatePage}
						optional={true}
					/>
				</div>
			</div>

			<div class=" grid h-16 w-full grid-cols-2 gap-5">
				<div class="relative h-full w-full">
					<EmailInput
						id="email"
						name="Email"
						bind:store={inputValues}
						{validate}
						bgColor="bg-lightbg"
						{validatePage}
					/>
				</div>
				<div class="relative h-full w-full">
					<InputNumber
						id="mobile"
						name="Mobile Number"
						bind:store={inputValues}
						{validate}
						bgColor="bg-lightbg"
						{validatePage}
					/>
				</div>
			</div>
			<div class=" grid h-16 w-full grid-cols-2 gap-5">
				<div id="parent" class=" relative min-h-16 w-full" onfocus={(e) => focusContainer(e)}>
					<InputText
						id="type"
						name="State"
						bind:store={inputValues}
						optional={false}
						{validate}
						{validatePage}
						bgColor="bg-lightbg"
						{componentHandlers}
						focusHandler={showAutoCompletefn}
					/>
					{#if statesList.length !== 0 && showAutoComplete}
						<div
							id="child"
							class="bg-tertiory-50 absolute top-[60px] z-20 h-fit max-h-40 w-full flex-col overflow-auto rounded-lg"
						>
							{#each statesList as cata, i}
								<button
									id="childButton"
									class=" flex h-fit w-full border border-gray-300 px-5 py-2 {i == 0
										? 'rounded-t-lg text-left'
										: statesList.length - 1 == i
											? 'rounded-b-lg'
											: ''}"
									onclick={() => {
										chooseType(cata);
									}}
								>
									<p class=" font-semibold text-gray-700">
										{cata}
									</p>
								</button>
							{/each}
						</div>
					{/if}
				</div>
				<div class="relative h-full w-full">
					<InputText
						id="country"
						name="Country"
						bind:store={inputValues}
						{validate}
						bgColor="bg-lightbg"
						{validatePage}
						readonly={true}
					/>
				</div>
			</div>
			<div class="grid-col-1 relative grid h-16 w-full gap-5">
				<div class="relative h-full w-full">
					<InputText
						id="street"
						name="Street address"
						bind:store={inputValues}
						{validate}
						bgColor="bg-lightbg"
						{validatePage}
					/>
				</div>
			</div>
			<div class=" grid h-16 w-full grid-cols-2 gap-5">
				<div class="relative h-full w-full">
					<InputText
						id="city"
						name="City"
						bind:store={inputValues}
						{validate}
						bgColor="bg-lightbg"
						{validatePage}
					/>
				</div>
				<div class="relative h-full w-full">
					<InputText
						id="district"
						name="District"
						bind:store={inputValues}
						{validate}
						bgColor="bg-lightbg"
						{validatePage}
					/>
				</div>
			</div>
			<div class=" grid h-16 w-full grid-cols-2 gap-5">
				<div class="relative h-full w-full">
					<InputZipcode
						id="pincode"
						name="Pincode"
						bind:store={inputValues}
						{validate}
						bgColor="bg-lightbg"
						{validatePage}
					/>
				</div>
			</div>
		</div>
		<div
			id="container5"
			class="transistion-all border-tertiory-700 mt-4 h-fit w-full rounded-md border bg-gray-200 delay-300 duration-800"
		>
			<div class="h-full w-full px-6 py-5">
				<p class="text-xl font-semibold">Cart Totals</p>
				<div class="mt-2 flex h-fit w-full justify-between">
					<p class="text-gray-600">Total Price</p>
					<p>₹ {totalDetails.actual}</p>
				</div>
				<div class="mt-2 flex h-fit w-full justify-between">
					<p class="text-gray-600">Discount</p>
					<p>(-) ₹ {totalDetails.actual - totalDetails.price}</p>
				</div>
				<div class="mt-2 flex h-16 w-full items-center justify-between">
					<div class="relative h-full w-full">
						<InputText
							id="coupon"
							name="Coupon code"
							bind:store={inputValues}
							{validate}
							bgColor="bg-gray-200"
							{validatePage}
						/>
						{#if couponDetail.loading == 'load'}
							<svg
								class="text-tertiory-550 absolute top-5.5 right-0.5 mr-3 h-5 w-5 animate-spin"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.96 7.96 0 014 12H0c0 4.418 3.582 8 8 8v-4c-2.155 0-4.147-.84-5.657-2.343L6 12.584z"
								></path>
							</svg>
						{/if}
					</div>
				</div>
				{#if couponDetail.loading == 'done'}
					<div class="mt-1 flex items-center justify-between">
						<div class="flex items-center gap-3">
							{#if couponDetail.couponAmount}
								<svg
									class="fill-green-400"
									width="15"
									height="15"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
									><path
										d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm5.676,8.237-6,5.5a1,1,0,0,1-1.383-.03l-3-3a1,1,0,1,1,1.414-1.414l2.323,2.323,5.294-4.853a1,1,0,1,1,1.352,1.474Z"
									/></svg
								>
								<p class="text-sm font-semibold text-green-400">Coupon applied</p>
							{:else if couponDetail.error}
								<svg
									width="15"
									height="15"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM8.96963 8.96965C9.26252 8.67676 9.73739 8.67676 10.0303 8.96965L12 10.9393L13.9696 8.96967C14.2625 8.67678 14.7374 8.67678 15.0303 8.96967C15.3232 9.26256 15.3232 9.73744 15.0303 10.0303L13.0606 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73742 15.3232 9.26254 15.3232 8.96965 15.0303C8.67676 14.7374 8.67676 14.2625 8.96965 13.9697L10.9393 12L8.96963 10.0303C8.67673 9.73742 8.67673 9.26254 8.96963 8.96965Z"
										class="fill-red-500"
									/>
								</svg>
								<p class="text-sm font-semibold text-red-500">
									{#if couponDetail.error == 'invalid'}
										Invalid coupon code
									{:else if couponDetail.error == 'minAmount'}
										Coupon valid on orders ₹ {couponDetail.min_amount} or above.
									{/if}
								</p>
							{/if}
						</div>
						{#if couponDetail.couponAmount}
							<p class="">₹ {couponDetail.couponAmount}</p>
						{/if}
					</div>
				{/if}
				<div class="mt-2 flex h-fit w-full justify-between">
					<p class="text-gray-600">Amount Payable</p>
					<p class="text-lg font-bold">
						₹ {couponDetail.apply
							? Math.trunc(totalDetails.price - couponDetail.couponAmount)
							: totalDetails.price}
					</p>
				</div>
				<p class="text-tertiory-550 mt-1 text-xs font-bold">
					Freight charges are extra and will be applied as per actuals.*
				</p>
			</div>
			<button
				class="bg-primary-300 flex w-full cursor-pointer justify-center rounded-b-md py-2 text-white"
				aria-label="continue"
				onclick={createOrder}
			>
				Continue
			</button>
		</div>
	</section>
{/if}
