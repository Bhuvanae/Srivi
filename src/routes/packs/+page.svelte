<script>
	// @ts-nocheck

	import AssetImage from '$lib/assetImage.svelte';
	import CrackerCard from '$lib/crackerCard.svelte';
	import { fetchApi } from '$lib/fetchApi';
	import ImageWithLazy from '$lib/imageWithLazy.svelte';
	import InputNumber from '$lib/inputNumber.svelte';
	import InputText from '$lib/inputText.svelte';
	import InputTextarea from '$lib/inputTextarea.svelte';
	import LoadingAnimation from '$lib/loadingAnimation.svelte';
	import OverlayWithSlot from '$lib/overlayWithSlot.svelte';
	import { onMount } from 'svelte';
	import { readonly } from 'svelte/store';
	import { fly, scale } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { storeData } from '../store.svelte';
	import Toggle from '$lib/toggle.svelte';
	import CrakerLoading from '$lib/crakerLoading.svelte';
	import Slider from '$lib/slider.svelte';
	import CartCard from '$lib/cartCard.svelte';
	import html2canvas from 'html2canvas';
	import { jsPDF } from 'jspdf';
	import Toast from '$lib/toast.svelte';
	import { storeNew } from '../storeNew.svelte';
	import packNull from '$lib/assets/couponNull.webp';
	import { browser } from '$app/environment';
	import Toggle1 from '$lib/toggle1.svelte';

	let store = $state(storeData());
	let packData = $state([]);
	let filterPackData = $state([]);
	let loading = $state('page');
	let crackerDetail = $state({
		items: [],
		quantity: 0
	});
	let showAddcrackers = $state(false);
	let validatePage = $state(false);
	let showSlider = $state(false);
	let previewSrc = $state('');
	let crackerList = $state([]);
	let filterCrackerList = $state([]);
	let showAutoComplete = $state(false);
	let admin = $state(store.admin);
	let quickViewCracker = $state({});
	let cartSlider = $state('');
	let selectedType = $state(1);
	let totalCartQuantity = $state(store.cartItems.reduce((sum, item) => sum + item.cartQuantity, 0));
	let topPosition = $state(0);
	let cartItems = $state(store.cartItems);
	let showList = $state(false);
	let ascanding = $state(false);
	let sortType = $state('created_at');
	let totalDetails = $state({
		cartQuantity: store.cartItems.reduce((sum, item) => sum + item.cartQuantity, 0),
		actualprice: store.cartItems.reduce((sum, item) => sum + Number(item.actualprice), 0),
		price: store.cartItems.reduce((sum, item) => sum + item.price, 0),
		discount: store.cartItems.reduce(
			(sum, item) => sum + (item.actualprice - item.price) * item.cartQuantity,
			0
		)
	});
	let html2pdf;

	onMount(async () => {
		if (browser) {
			const module = await import('html2pdf.js');
			html2pdf = module.default;
		}

		let getData = await fetchApi('/packs', 'GET', '', '');

		admin = store.admin;

		if (getData.resStatus == 200) {
			packData = getData.data.list;
			filterPackData = getData.data.list;
			crackerList = getData.data.crackers;
			filterCrackerList = getData.data.crackers;

			const favIds = new Set(store.favItems.map((product) => product.id));

			const cartMap = new Map(store.cartItems.map((item) => [item.id, item.cartQuantity]));

			// Update isFav field in allProducts
			packData = packData.map((product) => ({
				...product,
				isFav: favIds.has(product.id),
				cartQuantity: cartMap.get(product.id) || 0
			}));

			loading = 'showPage';
			// showList = true;
		} else {
			console.error('Failed to fetch crackers data:', getCrackersData?.error);
			loading = 'pageError';
		}
	});

	function filterList(value, option) {
		packData = filterPackData.filter((item) => {
			return item.name.toLowerCase().includes(value.toLowerCase());
		});
	}

	function sortData(button) {
		if (button == 'arrow') {
			ascanding = !ascanding;
		}
		packData.sort((a, b) => {
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

	async function packComponentButton(detail, tButton, aButton) {
		if (tButton == 'button1') {
			if (!admin) {
				cartSlider = 'quickView';
				quickViewCracker = detail;
			} else {
				if (aButton == 're-add') {
					loading = `delete${detail.id}`;
					let readd = await fetchApi('/products', 'POST', 're-addcracker', detail);
					if (readd?.resStatus == 200) {
						loading = 'showPage';
						packData.map((item) => {
							if (item.id === readd.data.id) {
								item.active = true;
							}
						});
						storeNew.toast = {
							show: true,
							title: 'Cracker Re-added successfully',
							action: 'success',
							duration: 3000
						};
					} else {
						loading = 'showPage';
						storeNew.toast = {
							show: true,
							title: 'Error Occured,Try again',
							action: 'Failure',
							duration: 3000
						};
					}
				} else {
					loading = `deletePack${detail.id}`;
					detail.action = 'delete';
					let deletePack = await fetchApi('/packs', 'POST', 'deletePack', detail);

					if (deletePack?.resStatus == 200) {
						loading = 'showPage';
						packData.map((item) => {
							if (item.id === deletePack.data.id) {
								item.active = false;
							}
						});
						storeNew.toast = {
							show: true,
							title: 'Cracker deleted successfully',
							action: 'success',
							duration: 3000
						};
					} else {
						loading = 'showPage';
						storeNew.toast = {
							show: true,
							title: 'Error Occured,Try again',
							action: 'Failure',
							duration: 3000
						};
					}
				}
			}
		} else if (tButton == 'cart') {
			if (aButton == 'plus') {
				detail.cartQuantity += 1;

				cartItems = cartItems.map((x) => {
					if (x.id === detail.id) {
						return { ...x, cartQuantity: x.cartQuantity + 1 };
					}
					return x;
				});
			} else if (aButton == 'minus') {
				detail.cartQuantity -= 1;
				cartItems = cartItems.map((x) => {
					if (x.id === detail.id) {
						return { ...x, cartQuantity: x.cartQuantity - 1 };
					}
					return x;
				});
			} else if (aButton == 'delete') {
				cartItems = cartItems.filter((x) => {
					return detail.id !== x.id;
				});
			}
			totalDetails.price = cartItems.reduce((sum, item) => sum + item.cartQuantity * item.price, 0);
			totalDetails.cartQuantity = cartItems.reduce((sum, item) => sum + item.cartQuantity, 0);
			totalDetails.discount = cartItems.reduce(
				(sum, item) => sum + (item.actualprice - item.price) * item.cartQuantity,
				0
			);
		} else {
			if (!admin) {
				loading = `addCart${detail.id}`;
				detail.cart += 1;
				let updatefav = await fetchApi('/products', 'POST', 'cartItems', detail);
				if (updatefav?.resStatus == 200) {
					loading = 'showPage';
				}
				if (aButton == 'plus') {
					if (detail.cartQuantity == 0) {
						if (detail.extraData) {
							detail.items = detail.extraData.items;
						}
						detail.cartQuantity += 1;
						store.cartItems = [...store.cartItems, $state.snapshot(detail)];
					} else {
						detail.cartQuantity += 1;
						store.cartItems = store.cartItems.map((x) => {
							if (x.id === detail.id) {
								return { ...x, cartQuantity: x.cartQuantity + 1 };
							}
							return x;
						});
					}
				} else {
					if (detail.cartQuantity == 1) {
						let arrayCheck = store.cartItems.filter((x) => {
							return x.id !== detail.id;
						});
						store.cartItems = arrayCheck;
					} else {
						detail.cartQuantity -= 1;
						store.cartItems = store.cartItems.map((x) => {
							if (x.id === detail.id) {
								return { ...x, cartQuantity: x.cartQuantity - 1 };
							}
							return x;
						});
					}
				}
				packData = packData.map((x) =>
					x.id === detail.id ? { ...x, cartQuantity: detail.cartQuantity } : x
				);
				totalDetails.cartQuantity = store.cartItems.reduce(
					(sum, item) => sum + item.cartQuantity,
					0
				);
			} else {
				showAddcrackers = true;
				detail.action = 'update';
				detail.items = detail.extraData.items;
				crackerDetail = detail;
			}
		}
	}

	function detailsPage(id) {
		goto(`/crackerdetail${id}`);
	}

	async function favAction(detail, isFav) {
		isFav = !isFav;
		detail.isFav = isFav;
		detail.favorite += detail.isFav ? 1 : -1;
		detail.action = 'favorite';
		let updatefav = await fetchApi('/products', 'POST', 'favorite', detail);

		packData.map((x) => {
			if (x.id == detail.id) x.isFav = isFav;
		});
		let favArray = $state.snapshot(store.favItems);
		if (isFav) {
			favArray.push($state.snapshot(detail));
		} else {
			favArray = favArray.filter((item) => {
				return item.id !== detail.id;
			});
		}
		store.favItems = favArray;
	}

	function createPack() {
		showAddcrackers = !showAddcrackers;
		showSlider = false;
		crackerDetail = {
			crackerName: '',
			actualprice: '',
			description: '',
			discount: '',
			quantity: '',
			type: '',
			image: '',
			imageSrc: '',
			name: '',
			action: '',
			searchKeyword: '',
			items: [],
			quantity: 0
		};
		previewSrc = '';

		// showAutoComplete = false;
		validatePage = false;
	}

	function validate(value, id) {
		if (id == 'type') {
			return true;
		} else {
			if (value) {
				return true;
			} else {
				return false;
			}
		}
	}

	function addImagefn(event) {
		const input = event.target;

		if (input.files && input.files[0]) {
			const file = input.files[0];
			const reader = new FileReader();

			reader.onload = (e) => {
				const result = e.target?.result;
				previewSrc = result;
				crackerDetail.imageSrc = result;
				crackerDetail.image = result;
			};

			reader.readAsDataURL(file);
			// crackerDetail.image = file;
		}
	}

	async function addPackInDatabase() {
		loading = 'add';
		if (
			crackerDetail.name &&
			crackerDetail.actualprice &&
			crackerDetail.discount &&
			crackerDetail.description &&
			createType == 'Pack'
				? crackerDetail.items.length !== 0
				: crackerDetail.items &&
					typeof crackerDetail.quantity == 'number' &&
					crackerDetail.quantity !== 0 &&
					crackerDetail.stocks
		) {
			if (crackerDetail.action == 'update') {
				let updatePack = await fetchApi('/packs', 'POST', 'updatePack', crackerDetail);
				if (updatePack) {
					loading = 'showPage';
					showAddcrackers = false;
					const index = packData.findIndex((x) => x.id === updatePack.data.details.id);
					if (index !== -1) {
						packData[index] = updatePack.data.details;
					}
					storeNew.toast = { show: true, title: 'Pack updated', duration: 3000, action: 'success' };
				} else {
					loading = 'showPage';
				}
			} else {
				let createPack = await fetchApi('/packs', 'POST', 'createPack', crackerDetail);
				if (createPack.resStatus == 200) {
					loading = 'showPage';
					showAddcrackers = false;
					packData.push(createPack.data.details);
					filterPackData.push(createPack.data.details);

					storeNew.toast = { show: true, title: 'Pack created', duration: 3000, action: 'success' };
				} else {
					loading = 'showPage';
				}
			}
		} else {
		}
	}

	function componentHandlers(eventDetails) {
		crackerList = filterCrackerList.filter((x) => {
			return x.name.toLowerCase().includes(eventDetails.value.toLowerCase());
		});
	}
	function showAutoCompletefn(event, id, type) {
		if (type == 'onFocus') {
			showAutoComplete = true;
		} else if (type == 'onEsc') {
			showAutoComplete = false;
		}
	}
	function chooseType(name) {
		crackerDetail.type = name.name;
		crackerDetail.itemId = name.id;
		showAutoComplete = false;
	}

	function addCrackersinArray(value) {
		if (value.itemid) {
			crackerDetail.items = crackerDetail.items.filter((x) => {
				return x.itemid !== value.itemid;
			});
			crackerDetail.quantity -= value.nitems;
		} else {
			crackerDetail.items.push({
				itemid: crackerDetail.itemId,
				cracker_name: crackerDetail.type,
				nitems: crackerDetail.itemQuantity
			});
			crackerDetail.quantity += crackerDetail.itemQuantity;

			crackerDetail.type = '';
			crackerDetail.itemQuantity = 0;
		}
	}

	function closeQuick() {
		cartSlider = undefined;
	}

	function showSliderfn() {
		if (!cartSlider) {
			cartItems = store.cartItems;
			let slider = document.getElementById('slider');
			slider && (slider.style.top = store.topPosition + 'px');

			let container = document.getElementById('layoutContainer');
			container && (container.style.overflow = 'hidden');
			topPosition = container?.scrollTop;

			cartSlider = 'cart';

			const event = new Event('scroll', { bubbles: true });
			container.dispatchEvent(event);
		} else {
			store.cartItems = cartItems;

			const cartMap = new Map(store.cartItems.map((item) => [item.id, item.cartQuantity]));

			// Update isFav field in allProducts
			packData = filterPackData.map((product) => ({
				...product,

				cartQuantity: cartMap.get(product.id) || 0
			}));

			totalDetails.cartQuantity = store.cartItems.reduce((sum, item) => sum + item.cartQuantity, 0);
			let container = document.getElementById('layoutContainer');
			container && (container.style.overflow = 'auto');

			cartSlider = undefined;
		}
	}

	function navigatetoCheck() {
		store.cartItems = cartItems;

		totalDetails.cartQuantity = store.cartItems.reduce((sum, item) => sum + item.cartQuantity, 0);
		let container = document.getElementById('layoutContainer');
		container && (container.style.overflow = 'auto');

		cartSlider = undefined;
		goto('/checkout');
	}

	function showListfn(details) {
		showList = !showList;
		if (showList) {
			quickViewCracker = details;
		} else {
			quickViewCracker = {};
		}
	}

	async function printList() {
		const htmlString = `
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
	<table class="w-full border-collapse">
		<thead class="bg-[#a91b0c] text-white">
			<tr>
				      <th class="border border-[#ddd] p-2 text-center">S.No</th>
				      <th class="border border-[#ddd] p-2 text-center">Cracker Name</th>
					 <th class="border border-[#ddd] p-2 text-center"> Quantity</th>
				    </tr>
		  </thead>
		  <tbody>
		${quickViewCracker.list
			.map(
				(cracker, i) => `
				          <tr>
				            <td class="border border-[#ddd] p-2 text-center">${i + 1}</td>
				            <td class="border border-[#ddd] p-2 text-center">${cracker.cracker_name}</td>
				            <td class="border border-[#ddd] p-2 text-center">${cracker.nitems}</td>
				          </tr>
				        `
			)
			.join('')}
		  </tbody>
		</table>
		  </div>
		</body>`;

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

	function reloadPage() {
		location.reload();
	}

	let createType = $state('Pack');
</script>

<section class="flex h-fit min-h-[600px] w-full flex-col gap-8 px-3 py-5 md:px-10 lg:px-32">
	<div class="flex h-fit w-full justify-between gap-4 max-md:flex-col max-md:items-center">
		<div class="h-10 w-20 max-md:hidden"></div>
		<p class="text-center text-3xl font-bold">Pack and Gift boxes</p>
		{#if admin}
			<button
				onclick={createPack}
				class="bg-primary-350 transistion-all w-20 cursor-pointer rounded-md text-white duration-300 hover:scale-105 max-md:h-10"
			>
				Create
			</button>
		{:else}
			<div class="h-10 w-20 max-md:hidden"></div>
		{/if}
	</div>
	<div class="flex h-fit w-full justify-between gap-5 max-md:flex-col max-md:items-center md:h-12">
		<div class="max-md:hidden" style="width: 250px;"></div>
		<div class="relative h-12 md:h-full" style="width: 370px;">
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
				class="h-full w-full rounded-full border border-amber-100 bg-gray-200 pl-16"
				bind:value={crackerDetail.searchKeyword}
				oninput={(e) => {
					filterList(e.target.value, 'name');
				}}
			/>
		</div>
		<div class=" grid grid-cols-[64px_auto_36px] items-center gap-0" style="width: 250px;">
			<p class="w-16">Sort by :</p>
			<select
				class="border-primary-300 h-8 w-full border"
				bind:value={sortType}
				onchange={() => {
					sortData();
				}}
			>
				<option value="name">Name</option>
				<option value="created_at">Date</option>
				<option value="price">Price</option>
				<option value="discount">Discount</option>
				<option value="quantity">Items</option>
			</select>
			<div class="flex w-full justify-end">
				<button
					class="bg-secondary-300 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md"
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
		</div>
	</div>

	<div class="flex h-fit w-full flex-wrap gap-10">
		{#if loading == 'showPage' || loading.slice(0, 10) == 'deletePack'}
			{#if packData.length !== 0}
				{#each packData as list, i}
					<div
						class="h-[400px] w-[250px]"
						in:fly={{ x: 40, y: 100, duration: 500, delay: i * 300 }}
					>
						{#if list.id}
							<CrackerCard
								index={i}
								image={list.image || packNull}
								name={list.name}
								quantity={list.quantity}
								price={list.price}
								actualprice={list.actualprice}
								discount={list.discount}
								cart={list.cart}
								favorite={list.favorite}
								type={list.type}
								id={list.id}
								isUser={!admin}
								isFav={list.isFav}
								description={list.description}
								cartQuantity={list.cartQuantity}
								buttonOneHandler={packComponentButton}
								addFav={favAction}
								videourl={list.videourl !== null ? list.videourl : ''}
								loading={loading == `deletePack${list.id}`}
								componentButton={detailsPage}
								stocks={list?.stocks == null ? 1 : list.stocks}
								cardType="pack"
								extraData={{ items: $state.snapshot(list.contents), createdat: list.created_at }}
								showList={showListfn}
								active={list.active}
							/>
						{/if}
					</div>
				{/each}
			{:else}
				<div class="flex h-[calc(100vh-120px)] w-full flex-col items-center justify-center gap-2">
					<p class="text-tertiory-450 text-lg font-bold">
						No crackers are available at the moment.
					</p>
				</div>
			{/if}
		{:else if loading == 'page'}
			<div class="flex h-[400px] w-full items-center justify-center gap-2">
				<p class="text-xl font-semibold">Loading</p>
				<LoadingAnimation color="bg-black" />
			</div>
		{:else if loading == 'pageError'}
			<div class="flex h-[400px] w-full flex-col items-center justify-center gap-2">
				<p class="text-secondary-400 text-xl font-semibold">
					Something went wrong while loading the Pack and Giftboxes.
				</p>
				<button
					onclick={reloadPage}
					class="bg-primary-350 transistion-all h-8 w-20 cursor-pointer rounded-md text-white duration-300 hover:scale-105"
					>Reload</button
				>
			</div>
		{/if}
	</div>
	{#if totalDetails.cartQuantity !== 0}
		<div id="cartcontainer" class="absolute right-[6%] z-10" style="top:460px">
			<div class="absolute -top-1.5 -right-1.5 z-20 flex h-6 w-6 items-center justify-center">
				<svg
					width="23"
					height="23"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="fill-secondary-200 absolute -top-0 -right-0"
				>
					<path
						d="M16 8C16 6.8804 15.4743 5.88358 14.6563 5.24291C14.7817 4.21146 14.4486 3.13488 13.6569 2.3432C12.8652 1.55152 11.7886 1.21838 10.7572 1.3438C10.1165 0.525732 9.11964 0 8 0C6.8804 0 5.88358 0.525698 5.24291 1.34372C4.21145 1.2183 3.13485 1.55143 2.34316 2.34312C1.55147 3.13481 1.21834 4.21141 1.34376 5.24288C0.525715 5.88354 0 6.88038 0 8C0 9.1196 0.525698 10.1164 1.34372 10.7571C1.2183 11.7886 1.55143 12.8652 2.34312 13.6568C3.13481 14.4485 4.21141 14.7817 5.24288 14.6562C5.88354 15.4743 6.88038 16 8 16C9.1196 16 10.1164 15.4743 10.7571 14.6563C11.7885 14.7817 12.8651 14.4486 13.6568 13.6569C14.4485 12.8652 14.7816 11.7886 14.6562 10.7572C15.4743 10.1165 16 9.11964 16 8Z"
					/>
				</svg>
				<p class="fill-secondary-250 text-tertiory-750 z-30 text-xs">
					{totalDetails.cartQuantity}
				</p>
			</div>

			<button
				class="bg-primary-400 relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
				aria-label="cartItems"
				onclick={showSliderfn}
			>
				<svg
					width="25"
					height="25"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z"
						class="stroke-white"
						stroke-width="1.5"
					/>
					<path
						d="M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z"
						class="stroke-white"
						stroke-width="1.5"
					/>
					<path
						d="M2 3L2.26121 3.09184C3.5628 3.54945 4.2136 3.77826 4.58584 4.32298C4.95808 4.86771 4.95808 5.59126 4.95808 7.03836V9.76C4.95808 12.7016 5.02132 13.6723 5.88772 14.5862C6.75412 15.5 8.14857 15.5 10.9375 15.5H12M16.2404 15.5C17.8014 15.5 18.5819 15.5 19.1336 15.0504C19.6853 14.6008 19.8429 13.8364 20.158 12.3075L20.6578 9.88275C21.0049 8.14369 21.1784 7.27417 20.7345 6.69708C20.2906 6.12 18.7738 6.12 17.0888 6.12H11.0235M4.95808 6.12H7"
						class="stroke-white"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				</svg>
			</button>
		</div>
	{/if}
</section>
{#if showAddcrackers}
	<OverlayWithSlot width="w-1/2" close={createPack}>
		<section class="flex h-full flex-col gap-4 rounded-lg bg-gray-200 py-6">
			<p class="text-primary-500 font-andika text-center text-xl font-semibold">Pack Details</p>
			<div class="flex h-full w-full flex-col gap-6 overflow-auto px-4">
				<div class="flex h-fit w-full justify-center">
					<Toggle1
						selected={createType}
						change={(type) => {
							createType = type;
						}}
					/>
				</div>
				<div
					class="grid h-fit w-full grid-cols-1 gap-6 sm:h-[300px] sm:max-h-[300px] sm:grid-cols-2"
				>
					<div
						class="{validatePage
							? !crackerDetail.image
								? 'border-red-500'
								: 'border-primary-500'
							: 'border-primary-500'} relative flex h-[300px] w-full items-center justify-center rounded-xl border-2 sm:h-full"
					>
						{#if previewSrc}
							<div class="h-[300px] max-h-full min-h-full w-full">
								<AssetImage imageSrc={previewSrc} rounded="rounded-xl" object="object-contain" />
							</div>
							<button
								aria-label="uploadImage"
								class="bg-primary-400 absolute right-0 bottom-0 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-tl-md rounded-br-md"
								><label>
									<svg
										class="fill-white"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
										><path
											d="M19,13a1,1,0,0,0-1,1v.38L16.52,12.9a2.79,2.79,0,0,0-3.93,0l-.7.7L9.41,11.12a2.85,2.85,0,0,0-3.93,0L4,12.6V7A1,1,0,0,1,5,6h7a1,1,0,0,0,0-2H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V14A1,1,0,0,0,19,13ZM5,20a1,1,0,0,1-1-1V15.43l2.9-2.9a.79.79,0,0,1,1.09,0l3.17,3.17,0,0L15.46,20Zm13-1a.89.89,0,0,1-.18.53L13.31,15l.7-.7a.77.77,0,0,1,1.1,0L18,17.21ZM22.71,4.29l-3-3a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-3,3a1,1,0,0,0,1.42,1.42L18,4.41V10a1,1,0,0,0,2,0V4.41l1.29,1.3a1,1,0,0,0,1.42,0A1,1,0,0,0,22.71,4.29Z"
										/></svg
									>
									<input
										type="file"
										class="absolute inset-0 h-full w-full opacity-0"
										accept=".jpeg,.jpg,.png,.webp"
										onchange={addImagefn}
									/>
								</label>
							</button>
						{:else if crackerDetail.image}
							<div class=" h-[320px] max-h-[320px] min-h-[320px] w-full">
								<ImageWithLazy
									imageUrl={crackerDetail.image}
									mobileImage={crackerDetail.image}
									object="object-contain"
								/>
							</div>
							<button
								aria-label="uploadImage"
								class="bg-primary-400 absolute right-0 bottom-0 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-tl-md rounded-br-md"
								><label>
									<svg
										class="fill-white"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
										><path
											d="M19,13a1,1,0,0,0-1,1v.38L16.52,12.9a2.79,2.79,0,0,0-3.93,0l-.7.7L9.41,11.12a2.85,2.85,0,0,0-3.93,0L4,12.6V7A1,1,0,0,1,5,6h7a1,1,0,0,0,0-2H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V14A1,1,0,0,0,19,13ZM5,20a1,1,0,0,1-1-1V15.43l2.9-2.9a.79.79,0,0,1,1.09,0l3.17,3.17,0,0L15.46,20Zm13-1a.89.89,0,0,1-.18.53L13.31,15l.7-.7a.77.77,0,0,1,1.1,0L18,17.21ZM22.71,4.29l-3-3a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-3,3a1,1,0,0,0,1.42,1.42L18,4.41V10a1,1,0,0,0,2,0V4.41l1.29,1.3a1,1,0,0,0,1.42,0A1,1,0,0,0,22.71,4.29Z"
										/></svg
									>
									<input
										type="file"
										class="absolute inset-0 h-full w-full opacity-0"
										accept=".jpeg,.jpg,.png,.webp"
										onchange={addImagefn}
									/>
								</label>
							</button>
						{:else}
							<button aria-labelledby="upload image" class="">
								<label>
									<svg
										width="80"
										height="80"
										viewBox="0 0 80 80"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										xmlns:xlink="http://www.w3.org/1999/xlink"
									>
										<rect
											opacity="0.6"
											width="80"
											height="80"
											fill="url(#pattern0_170_652)"
											fill-opacity="0.6"
										/>
										<defs>
											<pattern
												id="pattern0_170_652"
												patternContentUnits="objectBoundingBox"
												width="1"
												height="1"
											>
												<use xlink:href="#image0_170_652" transform="scale(0.00195312)" />
											</pattern>
											<image
												id="image0_170_652"
												width="512"
												height="512"
												xlink:href="data:image/png;base64,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"
											/>
										</defs>
									</svg>
									<input
										type="file"
										class="absolute inset-0 h-full w-full opacity-0"
										accept=".jpeg,.jpg,.png,.webp"
										onchange={addImagefn}
									/>
								</label>
							</button>
							<button
								aria-label="uploadImage"
								class="bg-primary-400 absolute right-0 bottom-0 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-tl-md rounded-br-md"
								><label>
									<svg
										class="fill-white"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
										><path
											d="M19,13a1,1,0,0,0-1,1v.38L16.52,12.9a2.79,2.79,0,0,0-3.93,0l-.7.7L9.41,11.12a2.85,2.85,0,0,0-3.93,0L4,12.6V7A1,1,0,0,1,5,6h7a1,1,0,0,0,0-2H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V14A1,1,0,0,0,19,13ZM5,20a1,1,0,0,1-1-1V15.43l2.9-2.9a.79.79,0,0,1,1.09,0l3.17,3.17,0,0L15.46,20Zm13-1a.89.89,0,0,1-.18.53L13.31,15l.7-.7a.77.77,0,0,1,1.1,0L18,17.21ZM22.71,4.29l-3-3a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-3,3a1,1,0,0,0,1.42,1.42L18,4.41V10a1,1,0,0,0,2,0V4.41l1.29,1.3a1,1,0,0,0,1.42,0A1,1,0,0,0,22.71,4.29Z"
										/></svg
									>
									<input
										type="file"
										class="absolute inset-0 h-full w-full opacity-0"
										accept=".jpeg,.jpg,.png,.webp"
										onchange={addImagefn}
									/>
								</label>
							</button>
						{/if}
					</div>
					<div class="flex h-fit w-full flex-col gap-5 sm:h-full">
						<div class=" h-16 w-full">
							<InputText
								id="name"
								name="Pack Name"
								bind:store={crackerDetail}
								optional={false}
								{validate}
								{validatePage}
								bgColor="bg-gray-200"
							/>
						</div>
						<div class=" h-16 w-full">
							<InputNumber
								id="actualprice"
								name="Actual Price"
								bind:store={crackerDetail}
								optional={false}
								{validate}
								{validatePage}
								bgColor="bg-gray-200"
							/>
						</div>
						<div class=" h-16 w-full">
							<InputNumber
								id="discount"
								name="Discount (%)"
								bind:store={crackerDetail}
								optional={false}
								{validate}
								{validatePage}
								bgColor="bg-gray-200"
							/>
						</div>
						<div
							class="grid h-16 w-full {createType == 'Pack' ? 'grid-cols-1' : 'grid-cols-2'} gap-2"
						>
							{#if createType !== 'Pack'}
								<div class="h-16 w-full">
									<InputNumber
										id="quantity"
										name="Quantity"
										bind:store={crackerDetail}
										optional={false}
										{validate}
										{validatePage}
										bgColor="bg-gray-200"
									/>
								</div>
							{/if}

							<div class="h-16 w-full">
								<InputNumber
									id="stocks"
									name="Stock"
									bind:store={crackerDetail}
									optional={false}
									{validate}
									{validatePage}
									bgColor="bg-gray-200"
								/>
							</div>
						</div>
					</div>
				</div>

				<div class=" h-24 w-full">
					<InputTextarea
						id="description"
						name="Description"
						bind:store={crackerDetail}
						optional={false}
						{validate}
						{validatePage}
						bgColor="bg-gray-200"
					/>
				</div>
				{#if createType == 'Pack'}
					<div class="-mt-2 flex h-fit w-full flex-col gap-2">
						<p class="text-primary-400 text-lg font-semibold">Crackers List</p>

						<div class="grid h-fit w-full grid-cols-1 gap-3 sm:min-h-16 sm:grid-cols-2">
							<div class="h-full w-full">
								<div id="parent" class=" relative h-16 w-full" onfocus={(e) => focusContainer(e)}>
									<InputText
										id="type"
										name="Cracker Name"
										bind:store={crackerDetail}
										optional={false}
										{validate}
										{validatePage}
										bgColor="bg-gray-200"
										{componentHandlers}
										focusHandler={showAutoCompletefn}
									/>
									{#if crackerList.length !== 0 && showAutoComplete}
										<div
											id="child"
											class="bg-tertiory-50 absolute top-[50px] z-20 h-fit max-h-40 w-full flex-col overflow-auto rounded-lg"
										>
											{#each crackerList as cata, i}
												<button
													id="childButton"
													class="flex h-fit w-full justify-between border border-gray-300 px-5 py-2 {i ==
													0
														? 'rounded-t-lg text-left'
														: crackerList.length - 1 == i
															? 'rounded-b-lg'
															: ''}"
													onclick={() => chooseType(cata)}
													aria-label="add crackers"
												>
													<p class="font-semibold text-gray-700">{cata.name}</p>
													<p class="font-semibold text-gray-700">(₹ {Math.trunc(cata.price)})</p>
												</button>
											{/each}
										</div>
									{/if}
								</div>
							</div>
							<div class="grid h-full w-full grid-cols-1 items-center gap-3 sm:grid-cols-2">
								<div class="h-16 w-full">
									<InputNumber
										id="itemQuantity"
										name="Quantity"
										bind:store={crackerDetail}
										optional={false}
										{validate}
										{validatePage}
										bgColor="bg-gray-200"
									/>
								</div>
								<button
									class="bg-secondary-350 h-fit cursor-pointer rounded-md px-1.5 py-3 transition-all duration-300 hover:scale-105"
									onclick={addCrackersinArray}
								>
									Add
								</button>
							</div>
						</div>
						<div class="flex flex-col gap-2">
							{#if crackerDetail.items}
								{#if crackerDetail.items.length !== 0}
									<div class="h-12 w-full">
										<table class="h-fit w-full">
											<thead>
												<tr class="text-primary-450">
													<th> S.No </th>
													<th> Cracker Name</th>
													<th> Quantity</th>
													<th> </th>
												</tr>
											</thead>
											<tbody>
												{#each crackerDetail.items as cracker, i}
													<tr
														class="h-fit"
														out:scale={{ duration: 500 }}
														in:scale={{ duration: 500 }}
													>
														<td>{i + 1}</td>
														{#each Object.entries(cracker) as [key, value], i}
															{#if key == 'cracker_name' || key == 'nitems'}
																<td class="text-center">{value}</td>
															{/if}
														{/each}
														<td class="flex items-center">
															<button
																class="transistion-all cursor-pointer duration-300 hover:scale-105"
																aria-label="delete"
																onclick={() => addCrackersinArray(cracker)}
																><svg
																	width="20"
																	height="20"
																	viewBox="0 0 24 24"
																	fill="none"
																	xmlns="http://www.w3.org/2000/svg"
																>
																	<path
																		d="M3 6.52381C3 6.12932 3.32671 5.80952 3.72973 5.80952H8.51787C8.52437 4.9683 8.61554 3.81504 9.45037 3.01668C10.1074 2.38839 11.0081 2 12 2C12.9919 2 13.8926 2.38839 14.5496 3.01668C15.3844 3.81504 15.4756 4.9683 15.4821 5.80952H20.2703C20.6733 5.80952 21 6.12932 21 6.52381C21 6.9183 20.6733 7.2381 20.2703 7.2381H3.72973C3.32671 7.2381 3 6.9183 3 6.52381Z"
																		class="fill-secondary-450"
																	/>
																	<path
																		d="M11.6066 22H12.3935C15.101 22 16.4547 22 17.3349 21.1368C18.2151 20.2736 18.3052 18.8576 18.4853 16.0257L18.7448 11.9452C18.8425 10.4086 18.8913 9.64037 18.4498 9.15352C18.0082 8.66667 17.2625 8.66667 15.7712 8.66667H8.22884C6.7375 8.66667 5.99183 8.66667 5.55026 9.15352C5.1087 9.64037 5.15756 10.4086 5.25528 11.9452L5.51479 16.0257C5.69489 18.8576 5.78494 20.2736 6.66513 21.1368C7.54532 22 8.89906 22 11.6066 22Z"
																		class="fill-secondary-450"
																	/>
																</svg>
															</button>
														</td>
													</tr>
												{/each}
											</tbody>
										</table>
									</div>
								{/if}
							{/if}
						</div>
					</div>
				{/if}
			</div>
			<div class="mt-10 flex h-fit w-full items-center justify-center gap-3">
				<button
					class="cursor-pointer rounded-md bg-gray-600 px-4 py-2 hover:scale-105"
					onclick={createPack}>Cancel</button
				>
				<button
					class="bg-primary-300 flex cursor-pointer items-end gap-1.5 rounded-md px-4 py-2 hover:scale-105"
					onclick={addPackInDatabase}
					>{crackerDetail.action == 'update'
						? loading == 'add'
							? 'Updating'
							: 'Update'
						: loading == 'add'
							? 'Adding'
							: 'Add'}
					{#if loading == 'add'}
						<LoadingAnimation />
					{/if}
				</button>
			</div>
		</section>
	</OverlayWithSlot>
{/if}
{#if cartSlider == 'quickView'}
	<OverlayWithSlot width="w-4/6" close={closeQuick} elsefn={showAutoCompletefn}>
		<section
			class="flex h-full w-full flex-col gap-5 overflow-auto rounded-lg bg-gray-200 px-5 py-6"
		>
			<div class="grid h-full w-full grid-cols-1 gap-5 sm:grid-cols-2">
				<div class="border-secondary-300 flex h-[440px] w-full flex-col rounded-md border p-4">
					<!-- {#if quickViewCracker.videourl !== null}
						<div class="flex h-1/5 w-full items-center justify-center">
							<Toggle selected={selectedType} {change} />
						</div>
					{/if} -->
					<div class="h-full w-full">
						<!-- {#if selectedType == 0} -->
						<ImageWithLazy imageUrl={quickViewCracker.image} object="object-contain" />
						<!-- {:else}
							<div class="h-fit w-full">
								<p class="text-primary-300 text-center text-2xl font-semibold">Crackers</p>
								<table class="mt-2 h-fit w-full overflow-auto">
									<thead>
										<tr class="text-primary-450">
											<th> S.No </th>
											<th> Cracker Name</th>
											<th> Quantity</th>
										</tr>
									</thead>
									<tbody>
										{#each quickViewCracker.extraData.items as cracker, i}
											<tr class="h-fit" out:scale={{ duration: 500 }} in:scale={{ duration: 500 }}>
												<td>{i + 1}</td>
												{#each Object.entries(cracker) as [key, value], i}
													{#if key == 'cracker_name' || key == 'nitems'}
														<td class="text-center">{value}</td>
													{/if}
												{/each}
											</tr>
										{/each}
									</tbody>
								</table>
							</div>

						{/if} -->
					</div>
				</div>
				<div class="relative flex h-full w-full flex-col gap-3">
					<div class="flex h-fit w-full justify-end">
						<button
							aria-label="close"
							class="cursor-pointer transition-all duration-300 hover:scale-110"
							onclick={closeQuick}
						>
							<svg
								width="40"
								height="40"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM8.96963 8.96965C9.26252 8.67676 9.73739 8.67676 10.0303 8.96965L12 10.9393L13.9696 8.96967C14.2625 8.67678 14.7374 8.67678 15.0303 8.96967C15.3232 9.26256 15.3232 9.73744 15.0303 10.0303L13.0606 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73742 15.3232 9.26254 15.3232 8.96965 15.0303C8.67676 14.7374 8.67676 14.2625 8.96965 13.9697L10.9393 12L8.96963 10.0303C8.67673 9.73742 8.67673 9.26254 8.96963 8.96965Z"
									class="fill-tertiory-450"
								/>
							</svg>
						</button>
					</div>
					<p class="text-3xl font-bold text-black">{quickViewCracker.name}</p>
					<p class="text-sm text-green-600">
						{quickViewCracker.stocks == 0
							? 'Out of stocks'
							: quickViewCracker.stocks < 10
								? 'Limited Stocks'
								: 'In Stock'}
					</p>
					<p class="text-base font-semibold text-black">
						Rs.{quickViewCracker.price}
						<span class="text-xs font-medium text-gray-400 line-through"
							>Rs.{quickViewCracker.actualprice}</span
						>
					</p>
					<div class="bg-secondary-300 w-fit rounded-md px-2 py-1">
						{quickViewCracker.discount} % offer
					</div>
					{#if quickViewCracker.cartQuantity !== 0 && !admin}
						<div class="flex items-center gap-4">
							<button
								aria-label="plus"
								class="bg-secondary-300 flex h-full w-8 cursor-pointer items-center justify-center rounded-md text-2xl font-semibold text-gray-100 shadow-lg transition-all duration-300 hover:scale-105"
								onclick={() => crackerComponentButton(quickViewCracker, 'button2', 'minus')}
							>
								-
							</button>

							<div class="felx h-full items-center justify-center px-2">
								<p class="text-lg font-semibold text-gray-700">{quickViewCracker.cartQuantity}</p>
							</div>

							<button
								onclick={() => crackerComponentButton(quickViewCracker, 'button2', 'plus')}
								aria-label="minus"
								class="bg-secondary-300 flex h-full w-8 cursor-pointer items-center justify-center rounded-md text-2xl text-sm font-semibold text-gray-100 shadow-lg transition-all duration-300 hover:scale-105"
							>
								+
							</button>
						</div>
					{:else}
						<button
							onclick={() => crackerComponentButton(quickViewCracker, 'button2', 'plus')}
							class="bg-secondary-300 flex h-10 w-fit cursor-pointer items-center justify-center rounded-md text-sm text-gray-100 shadow-lg transition-all duration-300 hover:scale-105"
							aria-label="add to cart"
						>
							{#if loading}
								<div class="h-8 w-8">
									<CrakerLoading />
								</div>
							{:else}
								<div class="flex w-fit items-center gap-5 px-3">
									<svg
										width="25"
										height="25"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											fill-rule="evenodd"
											clip-rule="evenodd"
											d="M3.04047 2.29242C2.6497 2.15503 2.22155 2.36044 2.08416 2.7512C1.94678 3.14197 2.15218 3.57012 2.54295 3.7075L2.80416 3.79934C3.47177 4.03406 3.91052 4.18961 4.23336 4.34802C4.53659 4.4968 4.67026 4.61723 4.75832 4.74609C4.84858 4.87818 4.91828 5.0596 4.95761 5.42295C4.99877 5.80316 4.99979 6.29837 4.99979 7.03832L4.99979 9.64C4.99979 12.5816 5.06302 13.5523 5.92943 14.4662C6.79583 15.38 8.19028 15.38 10.9792 15.38H16.2821C17.8431 15.38 18.6236 15.38 19.1753 14.9304C19.727 14.4808 19.8846 13.7164 20.1997 12.1875L20.6995 9.76275C21.0466 8.02369 21.2202 7.15417 20.7762 6.57708C20.3323 6 18.8155 6 17.1305 6H6.49233C6.48564 5.72967 6.47295 5.48373 6.4489 5.26153C6.39517 4.76515 6.27875 4.31243 5.99677 3.89979C5.71259 3.48393 5.33474 3.21759 4.89411 3.00139C4.48203 2.79919 3.95839 2.61511 3.34187 2.39838L3.04047 2.29242ZM13 8.25C13.4142 8.25 13.75 8.58579 13.75 9V10.25H15C15.4142 10.25 15.75 10.5858 15.75 11C15.75 11.4142 15.4142 11.75 15 11.75H13.75V13C13.75 13.4142 13.4142 13.75 13 13.75C12.5858 13.75 12.25 13.4142 12.25 13V11.75H11C10.5858 11.75 10.25 11.4142 10.25 11C10.25 10.5858 10.5858 10.25 11 10.25H12.25V9C12.25 8.58579 12.5858 8.25 13 8.25Z"
											class="fill-gray-100"
										/>
										<path
											d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z"
											class="fill-gray-100"
										/>
										<path
											d="M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z"
											class="fill-gray-100"
										/>
									</svg>
									<p class="text-lg font-semibold">Add to cart</p>
								</div>
							{/if}
						</button>
					{/if}
					<p class=" font-bold text-gray-600">
						Quantity : <span class=" font-medium text-black">{quickViewCracker.quantity}</span>
					</p>
					<p class="font-bold text-gray-600">Description :</p>

					<p class="indent-8 font-medium text-black">{quickViewCracker.description}</p>
				</div>
			</div>
			<div class="h-fit w-full">
				<p class="text-primary-300 text-center text-2xl font-semibold">Crackers List</p>
				<table class="mt-2 h-fit w-full">
					<thead>
						<tr class="text-primary-450">
							<th> S.No </th>
							<th> Cracker Name</th>
							<th> Quantity</th>
						</tr>
					</thead>
					<tbody>
						{#each quickViewCracker.extraData.items as cracker, i}
							<tr class="h-fit" out:scale={{ duration: 500 }} in:scale={{ duration: 500 }}>
								<td>{i + 1}</td>
								{#each Object.entries(cracker) as [key, value], i}
									{#if key == 'cracker_name' || key == 'nitems'}
										<td class="text-center">{value}</td>
									{/if}
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>
	</OverlayWithSlot>
{/if}

{#if showList}
	<OverlayWithSlot width="w-4/6" close={showListfn}>
		<div class="flex h-fit min-h-3/5 w-full flex-col gap-6 bg-gray-200 px-6 py-5">
			<div class="flex h-fit w-full justify-between">
				<div></div>
				<p class="text-secondary-350 text-center text-2xl font-bold">Crackers List</p>
				<div class="h-fit w-fit">
					<button
						aria-label="close"
						class="cursor-pointer transition-all duration-300 hover:scale-110"
						onclick={() => showListfn()}
					>
						<svg
							width="40"
							height="40"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM8.96963 8.96965C9.26252 8.67676 9.73739 8.67676 10.0303 8.96965L12 10.9393L13.9696 8.96967C14.2625 8.67678 14.7374 8.67678 15.0303 8.96967C15.3232 9.26256 15.3232 9.73744 15.0303 10.0303L13.0606 12L15.0303 13.9696C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73742 15.3232 9.26254 15.3232 8.96965 15.0303C8.67676 14.7374 8.67676 14.2625 8.96965 13.9697L10.9393 12L8.96963 10.0303C8.67673 9.73742 8.67673 9.26254 8.96963 8.96965Z"
								class="fill-secondary-450"
							/>
						</svg>
					</button>
				</div>
			</div>
			<div class="h-fit w-full">
				<table class="mt-2 h-fit w-full">
					<thead>
						<tr class="text-primary-450">
							<th class="text-primary-350"> S.No </th>
							<th class="text-primary-350"> Cracker Name</th>
							<th class="text-primary-350"> Quantity</th>
						</tr>
					</thead>
					<tbody>
						{#each quickViewCracker.list as cracker, i}
							<tr class="h-fit" out:scale={{ duration: 500 }} in:scale={{ duration: 500 }}>
								<td>{i + 1}</td>
								{#each Object.entries(cracker) as [key, value], i}
									{#if key == 'cracker_name' || key == 'nitems'}
										<td class="text-center">{value}</td>
									{/if}
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			{#if admin}
				<div class="flex w-full justify-center">
					<button
						class="bg-secondary-400 cursor-pointer rounded-md px-3 py-1.5 transition-all duration-300 hover:scale-105"
						onclick={printList}>Print</button
					>
				</div>
			{/if}
		</div>
	</OverlayWithSlot>
{/if}

{#if cartSlider == 'cart'}
	<Slider
		close={showSliderfn}
		containerStyles="absolute right-0 z-40"
		sliderAnimation={{ in: { x: 200, duration: 400 }, out: { x: 200, duration: 400 } }}
		sliderPosition="flex-row-reverse"
		topValue={topPosition}
	>
		<div
			class="relative z-20 flex h-[calc(100vh-100px)] w-9/10 flex-col bg-gray-200 py-4 sm:w-4/6 md:h-[calc(100vh-160px)] md:w-3/6 lg:w-1/4"
		>
			<p class="text-center text-xl font-semibold">Yout cart</p>

			<div class="flex h-4/5 w-full flex-col overflow-auto py-4">
				{#each cartItems as cart}
					<div class="h-28 min-h-28 w-full">
						<CartCard
							image={cart.image}
							name={cart.name}
							quantity={cart.quantity}
							price={cart.price}
							actualprice={cart.actualprice}
							discount={cart.discount}
							cart={cart.cart}
							favorite={cart.favorite}
							type={cart.type}
							id={cart.id}
							cartQuantity={cart.cartQuantity}
							buttonOneHandler={packComponentButton}
						/>
					</div>
				{/each}
			</div>
			<div class="border-secondary-300 flex h-fit flex-col justify-center gap-2 border-t px-2 py-3">
				<div class="flex h-fit w-full items-center justify-between">
					<p class="text-lg font-semibold">
						Subtotal <span class="text-sm">({totalDetails.cartQuantity} items)</span>
					</p>
					<p class="text-primary-400 text-xl font-bold">
						₹ {totalDetails.price}
					</p>
				</div>

				<p class="text-right text-sm">
					You’re saving <span class="text-primary-400 font-semibold">
						₹ {totalDetails.discount}
					</span> on this order.
				</p>
				<button
					class="bg-primary-400 w-full cursor-pointer rounded-full py-1.5 text-white"
					onclick={navigatetoCheck}>Checkout</button
				>
			</div>
		</div>
	</Slider>
{/if}

<style lang="postcss">
	th {
		padding: 4px 8px;
		border-bottom: 1px solid black;
		text-align: center;
	}
	td {
		padding: 6px 8px;
	}
	tr {
		border-bottom: 1px solid #7b580d;
		text-align: center;
		color: black;
		opacity: 0.7;
	}

	::-webkit-scrollbar {
		@apply h-[5px] w-[5px];
	}
	::-webkit-scrollbar-track {
		@apply rounded-[5px] bg-[#f5f5f5];
	}
	::-webkit-scrollbar-thumb {
		@apply w-[1px] rounded-[5px] bg-[#f12711];
	}
</style>
