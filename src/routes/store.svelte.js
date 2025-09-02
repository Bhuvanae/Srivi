// @ts-nocheck
import { browser } from '$app/environment';
export function storeData() {
    let admin = $state(getCookie('id'));
    let cartItems = $state()
    let favItems = $state()
    let showCartItems = $state(false);
    let topPosition = $state(0)
    let cartQuantity = $state(0)
    let minimumCartValue = $state(2499)
    let totalTop = $state(0)
    let toast = { show: false, title: "Successfully created", duration: 2000, action: "success" }

    function totalCartQuantity() {
        let cart = browser && localStorage.getItem('cartItems')
        let cartItems = JSON.parse(cart)
        if (cartItems.length !== 0) {
            return cartItems.reduce((sum, item) => sum + item.cartQuantity, 0)
        } else {
            return 0
        }
    }

    function getCookie(name) {
        if (browser) {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + '=')) {
                    return cookie.substring(name.length + 1);
                }
            }
            return '';
        }
    }

    function setLocalStorage(id, value) {
        if (browser) {
            localStorage.setItem(id, JSON.stringify(value))
        }
    }

    function getLocalStorage(id) {
        let storageValue = browser && localStorage.getItem(id)

        if (storageValue) {
            return JSON.parse(storageValue)
        } else {
            return []
        }

    }

    return {
        get admin() { return admin == 1 },
        set orders(value) { admin = value },
        get cartItems() { return getLocalStorage("cartItems") },
        set cartItems(value) { setLocalStorage('cartItems', value) },
        get favItems() { return getLocalStorage("favItems") },
        set favItems(value) { setLocalStorage('favItems', value) },
        get saveAdd() { return getLocalStorage("cusAdd") },
        set saveAdd(value) { setLocalStorage('cusAdd', value) },
        get showCartItems() { return showCartItems },
        set showCartItems(value) { showCartItems = value },
        get topPosition() { return topPosition },
        set topPosition(value) { topPosition = value },
        get totalCartQuantity() { return totalCartQuantity() },
        get minimumCartValue() { return minimumCartValue },
        get totalTop() { return totalTop },
        set totalTop(value) { totalTop = value },
        get toast() { return toast },
        set toast(value) { toast = value },
    }
}