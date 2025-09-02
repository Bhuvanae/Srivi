// @ts-nocheck
import { browser } from '$app/environment';

export function createStore() {
    // Reactive state properties
    let admin = $derived(browser ? getCookie('id') : '');
    let showCartItems = $state(false);
    let topPosition = $state(0);
    let minimumCartValue = $state(2500);
    let totalTop = $state(0);
    let toast = $state({
        show: false,
        title: "Successfully created",
        duration: 2000,
        action: "success"
    });
    let cartNotify = $state({ title: "Cart Update", data: {}, duration: 5000, show: false })
    let cAddress = $state({ address1: "Srivi Crackers", address2: "5/355,Sivakasi main road,", address3: "Srinivasa nagar, Thayilpatti,", address4: "Sivakasi-626125", address5: 'Virudhunagar (dt.)', mobile1: "+91 9025946872", mobile2: "+91 8838674753" })

    // Derived states
    const cartItems = $derived(getLocalStorage("cartItems"));
    const favItems = $derived(getLocalStorage("favItems"));
    const saveAdd = $derived(getLocalStorage("cusAdd"));
    const cartQuantity = $derived(calculateCartQuantity());


    // Helper functions
    function calculateCartQuantity() {

        if (!browser) return 0;
        const cart = localStorage.getItem('cartItems');
        if (!cart) return 0;

        try {
            const items = JSON.parse(cart);
            return items.length ? { items: items.reduce((sum, item) => sum + item.cartQuantity, 0), actual: items.reduce((sum, item) => sum + (Number(item.actualprice) * item.cartQuantity), 0), price: items.reduce((sum, item) => sum + (Math.trunc(item.price * item.cartQuantity)), 0) } : { items: 0, actual: 0, price: 0 };
        } catch {
            return 0;
        }
    }

    function getCookie(name) {
        if (!browser) return '';
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [key, value] = cookie.trim().split('=');
            if (key === name) return value;
        }
        return '';
    }

    function setLocalStorage(id, value) {
        if (browser) {
            try {
                localStorage.setItem(id, JSON.stringify(value));
                console.log('updated')
            } catch (error) {
                console.error('LocalStorage set failed:', error);
            }
        }
    }

    function getLocalStorage(id) {
        if (!browser) return [];
        try {
            const value = localStorage.getItem(id);
            return value ? JSON.parse(value) : [];
        } catch (error) {
            console.error('LocalStorage get failed:', error);
            return [];
        }
    }

    // Public API
    return {
        get admin() { return admin === '1'; },
        get cartItems() { return cartItems; },
        set cartItems(value) { setLocalStorage('cartItems', value); },
        get favItems() { return favItems; },
        set favItems(value) { setLocalStorage('favItems', value); },
        get saveAdd() { return saveAdd; },
        set saveAdd(value) { setLocalStorage('cusAdd', value); },
        get showCartItems() { return showCartItems; },
        set showCartItems(value) { showCartItems = value; },
        get topPosition() { return topPosition; },
        set topPosition(value) { topPosition = value; },
        get cartQuantity() { return calculateCartQuantity() },
        get minimumCartValue() { return minimumCartValue; },
        get totalTop() { return totalTop; },
        set totalTop(value) { totalTop = value; },
        get toast() { return toast; },
        set toast(value) { toast = { ...toast, ...value }; },
        get cartNotify() { return cartNotify; },
        set cartNotify(value) { cartNotify = { ...cartNotify, ...value }; },
        get cAddress() { return cAddress; },
    };
}

// Singleton store instance
export const storeNew = createStore();