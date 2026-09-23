module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[project]/src/context/CartContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartProvider",
    ()=>CartProvider,
    "generateCartItemId",
    ()=>generateCartItemId,
    "useCart",
    ()=>useCart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$orderId$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/orderId.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/products.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const CartContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const CART_STORAGE_KEY = "bligus_coffee_cart_v2";
function generateCartItemId(productId, selectedAddOns = []) {
    const sortedAddonIds = [
        ...selectedAddOns
    ].map((a)=>a.id).sort().join("_");
    return `${productId}${sortedAddonIds ? `_${sortedAddonIds}` : ""}`;
}
const CartProvider = ({ children })=>{
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoaded, setIsLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isCartOpen, setIsCartOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [customizingProduct, setCustomizingProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [lastOrder, setLastOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeToast, setActiveToast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const showToast = (msg)=>{
        setActiveToast(msg);
        setTimeout(()=>{
            setActiveToast((current)=>current === msg ? null : current);
        }, 2800);
    };
    // Load from localStorage on client mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                const validated = parsed.map((item)=>{
                    const product = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PRODUCTS"].find((p)=>p.id === item.product.id) || item.product;
                    const validAddOns = item.selectedAddOns || [];
                    const addOnsSum = validAddOns.reduce((sum, a)=>sum + a.price, 0);
                    const unitTotalPrice = product.price + addOnsSum;
                    return {
                        ...item,
                        product,
                        selectedAddOns: validAddOns,
                        unitTotalPrice
                    };
                }).filter((item)=>item.quantity > 0);
                setItems(validated);
            }
        } catch (e) {
            console.error("Error loading cart from localStorage", e);
        } finally{
            setIsLoaded(true);
        }
    }, []);
    // Save to localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isLoaded) return;
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch (e) {
            console.error("Error saving cart to localStorage", e);
        }
    }, [
        items,
        isLoaded
    ]);
    const getProductTotalQuantity = (productId)=>{
        return items.filter((item)=>item.product.id === productId).reduce((sum, item)=>sum + item.quantity, 0);
    };
    const addToCart = (product, quantityToAdd = 1, selectedAddOns = [])=>{
        if (!product.isAvailable) {
            showToast(`${product.name} sedang tidak tersedia.`);
            return {
                success: false,
                message: "Tidak tersedia"
            };
        }
        const cartItemId = generateCartItemId(product.id, selectedAddOns);
        const addOnsTotal = selectedAddOns.reduce((sum, a)=>sum + a.price, 0);
        const unitTotalPrice = product.price + addOnsTotal;
        setItems((prevItems)=>{
            const existingIndex = prevItems.findIndex((item)=>item.cartItemId === cartItemId);
            if (existingIndex > -1) {
                const updated = [
                    ...prevItems
                ];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + quantityToAdd
                };
                return updated;
            } else {
                return [
                    ...prevItems,
                    {
                        cartItemId,
                        product,
                        quantity: quantityToAdd,
                        selectedAddOns,
                        unitTotalPrice
                    }
                ];
            }
        });
        const addOnNames = selectedAddOns.map((a)=>a.name).join(", ");
        showToast(`${product.name}${addOnNames ? ` (${addOnNames})` : ""} ditambahkan ke keranjang`);
        return {
            success: true
        };
    };
    const increaseQuantity = (cartItemId)=>{
        let success = true;
        let message = "";
        setItems((prevItems)=>{
            const item = prevItems.find((i)=>i.cartItemId === cartItemId);
            if (!item) return prevItems;
            if (!item.product.isAvailable) {
                success = false;
                message = "Menu tidak tersedia";
                showToast(`${item.product.name} sedang tidak tersedia`);
                return prevItems;
            }
            return prevItems.map((i)=>i.cartItemId === cartItemId ? {
                    ...i,
                    quantity: i.quantity + 1
                } : i);
        });
        return {
            success,
            message
        };
    };
    const decreaseQuantity = (cartItemId)=>{
        setItems((prevItems)=>{
            const item = prevItems.find((i)=>i.cartItemId === cartItemId);
            if (!item) return prevItems;
            if (item.quantity <= 1) {
                showToast(`${item.product.name} dihapus dari keranjang`);
                return prevItems.filter((i)=>i.cartItemId !== cartItemId);
            }
            return prevItems.map((i)=>i.cartItemId === cartItemId ? {
                    ...i,
                    quantity: i.quantity - 1
                } : i);
        });
    };
    const removeFromCart = (cartItemId)=>{
        setItems((prevItems)=>{
            const item = prevItems.find((i)=>i.cartItemId === cartItemId);
            if (item) {
                showToast(`${item.product.name} dihapus dari keranjang`);
            }
            return prevItems.filter((i)=>i.cartItemId !== cartItemId);
        });
    };
    const clearCart = ()=>{
        setItems([]);
    };
    const totalItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return items.reduce((acc, item)=>acc + item.quantity, 0);
    }, [
        items
    ]);
    const subtotal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return items.reduce((acc, item)=>acc + item.unitTotalPrice * item.quantity, 0);
    }, [
        items
    ]);
    const createOrder = async (customerName, whatsapp, notes, proofImage)=>{
        const orderItems = items.map((item)=>({
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                unitTotalPrice: item.unitTotalPrice,
                quantity: item.quantity,
                subtotal: item.unitTotalPrice * item.quantity,
                addOns: item.selectedAddOns.map((a)=>`${a.name} (+Rp${a.price.toLocaleString("id-ID")})`)
            }));
        const newOrder = {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$orderId$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateOrderId"])(),
            customerName: customerName.trim(),
            whatsapp: whatsapp.trim(),
            notes: notes?.trim() || undefined,
            items: orderItems,
            total: subtotal,
            proofImage,
            status: "Menunggu Diproses",
            createdAt: new Date().toISOString()
        };
        setLastOrder(newOrder);
        clearCart();
        setIsCartOpen(false);
        setIsCheckoutOpen(false);
        try {
            const existingOrders = JSON.parse(localStorage.getItem("bligus_orders") || "[]");
            localStorage.setItem("bligus_orders", JSON.stringify([
                newOrder,
                ...existingOrders
            ]));
        } catch (e) {
            console.error("Error saving order to localStorage", e);
        }
        return newOrder;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CartContext.Provider, {
        value: {
            items,
            addToCart,
            increaseQuantity,
            decreaseQuantity,
            removeFromCart,
            clearCart,
            getProductTotalQuantity,
            totalItems,
            subtotal,
            isCartOpen,
            setIsCartOpen,
            isCheckoutOpen,
            setIsCheckoutOpen,
            customizingProduct,
            setCustomizingProduct,
            lastOrder,
            setLastOrder,
            createOrder,
            activeToast,
            showToast
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/CartContext.tsx",
        lineNumber: 259,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const useCart = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
}),
"[project]/src/data/products.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PRODUCTS",
    ()=>PRODUCTS
]);
const PRODUCTS = [
    // ==========================================
    // 1. SIGNATURE SERIES
    // ==========================================
    {
        id: 1,
        name: "Kopi Susu BliGus",
        category: "Signature Series",
        description: "Signature kopi susu khas BliGus dengan rasa creamy, gurih, dan manis pas yang nikmat.",
        price: 18000,
        image: "/images/products/kopi_susu_bligus.png",
        isAvailable: true,
        badge: "Best Seller"
    },
    {
        id: 2,
        name: "Golden Caramel",
        category: "Signature Series",
        description: "Perpaduan kopi susu lembut dengan topping caramel crumble renyah dan lelehan saus karamel gurih.",
        price: 20000,
        image: "/images/products/golden_caramel.png",
        isAvailable: true,
        badge: "Best Seller"
    },
    {
        id: 3,
        name: "Klepon Macchiato",
        category: "Signature Series",
        description: "Inovasi unik rasa klepon tradisional perpaduan espresso, wangi pandan, dan kelapa gula aren lembut.",
        price: 22000,
        image: "/images/products/klepon_macchiato.png",
        isAvailable: true
    },
    {
        id: 4,
        name: "Burnt Aren",
        category: "Signature Series",
        description: "Kopi susu gula aren spesial dengan lapisan brulee burnt aren karamelisasi di atas foam.",
        price: 22000,
        image: "/images/products/burnt_aren.png",
        isAvailable: true
    },
    // ==========================================
    // 2. COFFEE SERIES
    // ==========================================
    {
        id: 5,
        name: "Cafe Latte",
        category: "Coffee Series",
        description: "Espresso klasik berpadu steamed fresh milk dengan tekstur lembut, creamy, dan seimbang.",
        price: 12000,
        image: "/images/products/kopi_susu_bligus.png",
        isAvailable: true
    },
    {
        id: 6,
        name: "Cappuccino",
        category: "Coffee Series",
        description: "Espresso mantap dengan microfoam susu tebal bertabur bubuk cokelat aromatik pilihan.",
        price: 15000,
        image: "/images/products/cappuccino.png",
        isAvailable: true,
        badge: "Best Seller"
    },
    {
        id: 7,
        name: "Dalgona",
        category: "Coffee Series",
        description: "Susu segar dingin creamy dengan whipped dalgona coffee foam kental manis di atasnya.",
        price: 13000,
        image: "/images/products/dalgona.png",
        isAvailable: true
    },
    {
        id: 8,
        name: "Caramel",
        category: "Coffee Series",
        description: "Kopi susu dengan saus karamel manis legit yang harum dan memanjakan lidah.",
        price: 15000,
        image: "/images/products/caramel.png",
        isAvailable: true,
        badge: "Best Seller"
    },
    {
        id: 9,
        name: "Hazelnut",
        category: "Coffee Series",
        description: "Kopi susu nikmat berpadu sirup hazelnut panggang dengan aroma nutty yang khas dan gurih.",
        price: 15000,
        image: "/images/products/hazelnut.png",
        isAvailable: true
    },
    {
        id: 10,
        name: "Butterscotch",
        category: "Coffee Series",
        description: "Paduan kopi susu dengan rasa butterscotch manis gurih mentega karamel khas cafe.",
        price: 15000,
        image: "/images/products/butterscotch.png",
        isAvailable: true
    },
    {
        id: 11,
        name: "Gula Aren",
        category: "Coffee Series",
        description: "Kopi susu klasik dipadukan dengan manis alami gula aren asli nusantara yang harum.",
        price: 15000,
        image: "/images/products/gula_aren.png",
        isAvailable: true,
        badge: "Best Seller"
    },
    {
        id: 12,
        name: "Dirty Matcha",
        category: "Coffee Series",
        description: "Kombinasi unik matcha Jepang pekat dengan espresso shot dan susu segar berlapis.",
        price: 15000,
        image: "/images/products/dirty matcha.png",
        isAvailable: true
    },
    {
        id: 13,
        name: "Moccacino",
        category: "Coffee Series",
        description: "Kombinasi klasik espresso beraroma cokelat pekat dan susu segar yang kaya rasa.",
        price: 15000,
        image: "/images/products/moccacino.png",
        isAvailable: true
    },
    {
        id: 14,
        name: "Coconut Aren",
        category: "Coffee Series",
        description: "Sensasi kopi susu gula aren dengan sentuhan rasa kelapa tropis yang segar dan gurih.",
        price: 15000,
        image: "/images/products/coconut_aren.png",
        isAvailable: true,
        badge: "New"
    },
    {
        id: 15,
        name: "Butterpalm",
        category: "Coffee Series",
        description: "Kombinasi butter caramel gurih dengan manisnya gula palm aren alami yang menggoda.",
        price: 15000,
        image: "/images/products/butter_palm.png",
        isAvailable: true,
        badge: "New"
    },
    {
        id: 16,
        name: "Pandan",
        category: "Coffee Series",
        description: "Kopi susu beraroma daun pandan wangi yang menenangkan dan menyegarkan harimu.",
        price: 15000,
        image: "/images/products/pandan.png",
        isAvailable: true,
        badge: "New"
    },
    // ==========================================
    // 3. AMERICANO SERIES
    // ==========================================
    {
        id: 17,
        name: "Berry-Cano",
        category: "Americano Series",
        description: "Espresso dipadukan dengan kesegaran sari buah beri manis asam yang menyegarkan dahaga.",
        price: 15000,
        image: "/images/products/berrycano.png",
        isAvailable: true,
        badge: "Best Seller"
    },
    {
        id: 18,
        name: "Apple-Cano",
        category: "Americano Series",
        description: "Perpaduan espresso beraroma tajam dengan jus apel segar manis alami yang unik.",
        price: 15000,
        image: "/images/products/AppleCano.png",
        isAvailable: true
    },
    {
        id: 19,
        name: "Orange-Cano",
        category: "Americano Series",
        description: "Sensasi citrus jeruk manis segar berpadu dengan espresso dingin yang aromatik.",
        price: 15000,
        image: "/images/products/OrangeCano.png",
        isAvailable: true
    },
    {
        id: 20,
        name: "Americano",
        category: "Americano Series",
        description: "Espresso murni dengan tambahan air dingin/panas, aroma kuat dan crema tebal mantap.",
        price: 10000,
        image: "/images/products/americano.png",
        isAvailable: true
    },
    // ==========================================
    // 4. NON-COFFEE SERIES
    // ==========================================
    {
        id: 21,
        name: "Matcha",
        category: "Non-Coffee Series",
        description: "Matcha premium berkualitas dengan susu segar creamy, kaya antioksidan tanpa kandungan kopi.",
        price: 12000,
        image: "/images/products/matcha.png",
        isAvailable: true,
        badge: "Best Seller"
    },
    {
        id: 22,
        name: "Chocolate",
        category: "Non-Coffee Series",
        description: "Cokelat pekat pilihan yang manis dan legit dipadukan dengan susu segar yang memanjakan.",
        price: 12000,
        image: "/images/products/Chocolate.png",
        isAvailable: true
    },
    // ==========================================
    // 5. BLIGUS GABIN
    // ==========================================
    {
        id: 23,
        name: "Double Choco",
        category: "BliGus Gabin",
        description: "Gabin renyah dengan isian double choco yang lumer dan nikmat.",
        price: 12000,
        image: "/images/products/Double_Choco.PNG",
        isAvailable: true
    },
    {
        id: 24,
        name: "Matcha Crunch",
        category: "BliGus Gabin",
        description: "Gabin dengan isian matcha crunch manis khas BliGus.",
        price: 12000,
        image: "/images/products/Matcha_Crunch.PNG",
        isAvailable: true
    },
    {
        id: 25,
        name: "Cookies & Cream",
        category: "BliGus Gabin",
        description: "Gabin dengan isian cookies & cream spesial.",
        price: 12000,
        image: "/images/products/Cookies&Cream.PNG",
        isAvailable: true
    },
    {
        id: 26,
        name: "Salted Caramel",
        category: "BliGus Gabin",
        description: "Gabin dengan isian salted caramel yang manis gurih.",
        price: 12000,
        image: "/images/products/Salted_Caramel.PNG",
        isAvailable: true
    },
    {
        id: 27,
        name: "Cheese Regal",
        category: "BliGus Gabin",
        description: "Gabin dengan isian cheese regal yang nikmat.",
        price: 12000,
        image: "/images/products/Cheese_Regal.PNG",
        isAvailable: true
    },
    {
        id: 28,
        name: "Tiramisu",
        category: "BliGus Gabin",
        description: "Gabin renyah dengan rasa tiramisu premium.",
        price: 12000,
        image: "/images/products/Tiramisu_Gabin.PNG",
        isAvailable: true
    },
    // ==========================================
    // 6. COMBO / BUNDLING
    // ==========================================
    {
        id: 29,
        name: "BliGus 1",
        category: "Combo / Bundling",
        description: "2 pcs Gabin + Kopi Susu BliGus",
        price: 40000,
        image: "/images/products/Double_Choco.PNG",
        isAvailable: true
    },
    {
        id: 30,
        name: "BliGus 2",
        category: "Combo / Bundling",
        description: "1 pcs Gabin + Golden Caramel",
        price: 30000,
        image: "/images/products/Double_Choco.PNG",
        isAvailable: true
    }
];
}),
"[project]/src/utils/orderId.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Generates an order ID adhering to format: BLG-YYYYMMDD-XXXX
 * Example: BLG-20260917-001 or BLG-20260917-4829
 */ __turbopack_context__.s([
    "generateOrderId",
    ()=>generateOrderId
]);
function generateOrderId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    // 3 to 4 digit random code
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    return `BLG-${year}${month}${day}-${randomSuffix}`;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0p7wv9h._.js.map