"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Order, OrderItem, Product, AddOn, ProductCategory } from "@/types";
import { PRODUCTS } from "@/data/products";
import { getAddOnsForProduct, getAddOnsForCategory } from "@/data/addons";
import { formatRupiah } from "@/utils/formatters";
import {
  Coffee,
  ShoppingBag,
  Clock,
  User,
  Phone,
  MessageCircle,
  FileText,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  DollarSign,
  ArrowLeft,
  Eye,
  EyeOff,
  X,
  Sparkles,
  Download,
  Plus,
  Minus,
  Trash2,
  Printer,
  QrCode,
  CreditCard,
  Banknote,
  Volume2,
  VolumeX,
  Receipt,
  LayoutGrid,
  ClipboardList,
  BarChart3,
  Check,
  Lock,
  Unlock,
  KeyRound,
  LogOut,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Initial sample orders for fresh view
const INITIAL_SAMPLE_ORDERS: Order[] = [
  {
    id: "BLG-20260917-001",
    customerName: "Budi Santoso",
    whatsapp: "081234567890",
    notes: "Less ice, gula sedikit ya",
    items: [
      {
        id: 1,
        name: "Kopi Susu BliGus",
        price: 18000,
        unitTotalPrice: 21000,
        quantity: 2,
        subtotal: 42000,
        addOns: ["+1 Shot Espresso (+Rp3.000)"],
      },
      {
        id: 17,
        name: "Berry-Cano",
        price: 15000,
        unitTotalPrice: 15000,
        quantity: 1,
        subtotal: 15000,
      },
    ],
    total: 57000,
    status: "Sedang Diproses",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "BLG-20260917-002",
    customerName: "Dina Lestari",
    whatsapp: "081298765432",
    notes: "Ambil jam 14.30 WITA",
    items: [
      {
        id: 21,
        name: "Matcha",
        price: 12000,
        unitTotalPrice: 17000,
        quantity: 1,
        subtotal: 17000,
        addOns: ["Sea Salt Cream (+Rp5.000)"],
      },
      {
        id: 2,
        name: "Golden Caramel",
        price: 20000,
        unitTotalPrice: 20000,
        quantity: 1,
        subtotal: 20000,
      },
    ],
    total: 37000,
    status: "Menunggu Diproses",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
];

type PosCartItem = {
  cartItemId: string;
  product: Product;
  quantity: number;
  selectedAddOns: AddOn[];
  unitTotalPrice: number;
  subtotal: number;
};

// Default valid credentials (can be customized by store owner)
const VALID_CREDENTIALS = [
  { username: "admin", password: "bligus2026" },
  { username: "kasir", password: "bligus2026" },
  { username: "bligus", password: "bligus2026" },
  { username: "owner", password: "bligus2026" },
];

export default function CashierDashboardPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Navigation / View Tabs
  const [activeTab, setActiveTab] = useState<"orders" | "pos" | "reports" | "menu">("orders");

  // Menu Availability State
  const [menuAvailability, setMenuAvailability] = useState<Record<number, boolean>>({});
  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Selected Order for Receipt / Print
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // Inline cancel confirmation (which order is pending cancel)
  const [cancelingOrderId, setCancelingOrderId] = useState<string | null>(null);

  // POS State
  const [posCategory, setPosCategory] = useState<ProductCategory | "Semua">("Semua");
  const [posSearch, setPosSearch] = useState("");
  const [posCart, setPosCart] = useState<PosCartItem[]>([]);
  const [posCustomerName, setPosCustomerName] = useState("");
  const [posCustomerPhone, setPosCustomerPhone] = useState("");
  const [posNotes, setPosNotes] = useState("");
  const [posPaymentMethod, setPosPaymentMethod] = useState<"QRIS" | "Tunai">("QRIS");
  const [posCashAmount, setPosCashAmount] = useState<number>(0);

  // Product Add-on Customization Modal for POS
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [customAddOns, setCustomAddOns] = useState<AddOn[]>([]);
  const [customQuantity, setCustomQuantity] = useState(1);

  // Check auth session on mount
  useEffect(() => {
    try {
      const auth = localStorage.getItem("bligus_admin_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    setTimeout(() => {
      const user = loginUsername.trim().toLowerCase();
      const pass = loginPassword.trim();

      // Check against credentials list or shortcut PIN '2026'
      const match =
        VALID_CREDENTIALS.some(
          (c) => c.username === user && c.password === pass
        ) ||
        (user === "admin" && pass === "2026") ||
        (user === "kasir" && pass === "2026");

      if (match) {
        try {
          localStorage.setItem("bligus_admin_auth", "true");
        } catch {
          // ignore
        }
        setIsAuthenticated(true);
        setLoginError("");
      } else {
        setLoginError("Username atau Password salah. Silakan coba lagi.");
      }
      setLoginLoading(false);
    }, 400);
  };

  // Handle Logout (Instant lock & return to login screen)
  const handleLogout = () => {
    try {
      localStorage.removeItem("bligus_admin_auth");
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setLoginPassword("");
    setLoginError("");
  };

  // Play audio chime for new orders
  const playChime = () => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio context might be restricted before user interaction
    }
  };

  // Load orders from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bligus_orders");
      if (stored !== null) {
        // Key exists in localStorage (even if empty array — user has cleared before)
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setOrders(parsed); // Respect cleared state — don't reload sample
        }
      } else {
        // First visit — no key yet, load sample orders as demo
        setOrders(INITIAL_SAMPLE_ORDERS);
        localStorage.setItem(
          "bligus_orders",
          JSON.stringify(INITIAL_SAMPLE_ORDERS)
        );
      }
    } catch (e) {
      console.error(e);
      setOrders(INITIAL_SAMPLE_ORDERS);
    }
  }, []);

  // Load menu availability from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bligus_menu_availability");
      if (stored) {
        setMenuAvailability(JSON.parse(stored));
      } else {
        const defaultAvail = PRODUCTS.reduce((acc, p) => ({ ...acc, [p.id]: p.isAvailable }), {});
        setMenuAvailability(defaultAvail);
        localStorage.setItem("bligus_menu_availability", JSON.stringify(defaultAvail));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);


  // Live time ticker
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " WITA"
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const saveOrders = (updated: Order[]) => {
    setOrders(updated);
    try {
      localStorage.setItem("bligus_orders", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatus = (orderId: string, newStatus: Order["status"]) => {
    const updated = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    saveOrders(updated);
  };

  const handleClearHistory = () => {
    if (confirm("Kosongkan seluruh riwayat pesanan?")) {
      saveOrders([]);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    saveOrders(orders.filter((o) => o.id !== orderId));
    setCancelingOrderId(null);
  };

  const handleAddSample = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newSample: Order = {
      id: `BLG-20260917-${randomSuffix}`,
      customerName: "Pelanggan Online " + randomSuffix,
      whatsapp: "081234567890",
      notes: "Extra sedap, es sedang",
      items: [
        {
          id: 1,
          name: "Kopi Susu BliGus",
          price: 18000,
          unitTotalPrice: 21000,
          quantity: 1,
          subtotal: 21000,
          addOns: ["+1 Shot Espresso (+Rp3.000)"],
        },
        {
          id: 6,
          name: "Cappuccino",
          price: 15000,
          unitTotalPrice: 15000,
          quantity: 1,
          subtotal: 15000,
        },
      ],
      total: 36000,
      status: "Menunggu Diproses",
      createdAt: new Date().toISOString(),
    };
    saveOrders([newSample, ...orders]);
    playChime();
  };

  // Helper: detect if order was from POS / Kasir
  const isPosOrder = (o: Order) =>
    typeof o.notes === "string" &&
    (o.notes.startsWith("[Kasir") || o.notes.startsWith("[Pesanan Kasir"));

  // Filtered orders — antrean ONLY shows online orders (POS orders are auto-completed)
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (isPosOrder(order)) return false; // POS orders never in antrean
      const matchStatus =
        filterStatus === "Semua" || order.status === filterStatus;
      const matchSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.whatsapp.includes(searchQuery);
      return matchStatus && matchSearch;
    });
  }, [orders, filterStatus, searchQuery]);

  // Report filter state (period mode for reports tab)
  const [reportPeriod, setReportPeriod] = useState<"harian" | "bulanan" | "tahunan">("harian");
  const [reportExportMode, setReportExportMode] = useState<"semua" | "online" | "kasir">("semua");

  // Statistics
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const waitingCount = orders.filter(
      (o) => o.status === "Menunggu Diproses" || !o.status
    ).length;
    const processingCount = orders.filter(
      (o) => o.status === "Sedang Diproses"
    ).length;
    const readyCount = orders.filter((o) => o.status === "Siap Diambil").length;
    const completedCount = orders.filter((o) => o.status === "Selesai").length;

    // Separate online vs kasir
    const posOrders = orders.filter(isPosOrder);
    const onlineOrders = orders.filter((o) => !isPosOrder(o));

    const posRevenue = posOrders.reduce((s, o) => s + (o.total || 0), 0);
    const onlineRevenue = onlineOrders.reduce((s, o) => s + (o.total || 0), 0);

    // Item popularity count
    const itemSales: Record<string, { count: number; revenue: number }> = {};
    orders.forEach((ord) => {
      ord.items.forEach((it) => {
        if (!itemSales[it.name]) {
          itemSales[it.name] = { count: 0, revenue: 0 };
        }
        itemSales[it.name].count += it.quantity;
        itemSales[it.name].revenue += it.subtotal;
      });
    });

    const topItems = Object.entries(itemSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count);

    // Group orders by day / month / year
    type DayData = {
      online: number; kasir: number; total: number; count: number;
      items: Record<string, { onlineQty: number; kasirQty: number; onlineRev: number; kasirRev: number }>;
    };
    const groupByDay: Record<string, DayData> = {};
    const groupByMonth: Record<string, { online: number; kasir: number; total: number; count: number }> = {};
    const groupByYear: Record<string, { online: number; kasir: number; total: number; count: number }> = {};

    orders.forEach((ord) => {
      const d = new Date(ord.createdAt);
      const dayKey = d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
      const monthKey = d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
      const yearKey = String(d.getFullYear());
      const isPos = isPosOrder(ord);
      const rev = ord.total || 0;

      // Day grouping (with item breakdown)
      if (!groupByDay[dayKey]) groupByDay[dayKey] = { online: 0, kasir: 0, total: 0, count: 0, items: {} };
      if (isPos) groupByDay[dayKey].kasir += rev;
      else groupByDay[dayKey].online += rev;
      groupByDay[dayKey].total += rev;
      groupByDay[dayKey].count += 1;
      // Item detail per day
      ord.items.forEach((it) => {
        if (!groupByDay[dayKey].items[it.name]) {
          groupByDay[dayKey].items[it.name] = { onlineQty: 0, kasirQty: 0, onlineRev: 0, kasirRev: 0 };
        }
        if (isPos) {
          groupByDay[dayKey].items[it.name].kasirQty += it.quantity;
          groupByDay[dayKey].items[it.name].kasirRev += it.subtotal;
        } else {
          groupByDay[dayKey].items[it.name].onlineQty += it.quantity;
          groupByDay[dayKey].items[it.name].onlineRev += it.subtotal;
        }
      });

      // Month & Year grouping (no item breakdown needed)
      for (const [key, map] of [
        [monthKey, groupByMonth],
        [yearKey, groupByYear],
      ] as [string, typeof groupByMonth][]) {
        if (!map[key]) map[key] = { online: 0, kasir: 0, total: 0, count: 0 };
        if (isPos) map[key].kasir += rev;
        else map[key].online += rev;
        map[key].total += rev;
        map[key].count += 1;
      }
    });

    return {
      totalOrders: orders.length,
      totalRevenue,
      waitingCount,
      processingCount,
      readyCount,
      completedCount,
      topItems,
      posOrders: posOrders.length,
      onlineOrders: onlineOrders.length,
      posRevenue,
      onlineRevenue,
      groupByDay,
      groupByMonth,
      groupByYear,
    };
  }, [orders]);

  // ==========================================
  // POS ACTIONS & LOGIC
  // ==========================================
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = posCategory === "Semua" || p.category === posCategory;
      const matchSearch = p.name
        .toLowerCase()
        .includes(posSearch.toLowerCase());
      
      const isAvail = menuAvailability[p.id] !== undefined ? menuAvailability[p.id] : p.isAvailable;
      
      return matchCat && matchSearch && isAvail;
    });
  }, [posCategory, posSearch, menuAvailability]);

  const toggleMenuAvailability = (productId: number) => {
    setMenuAvailability((prev) => {
      const updated = {
        ...prev,
        [productId]: prev[productId] !== undefined ? !prev[productId] : false,
      };
      try {
        localStorage.setItem("bligus_menu_availability", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleOpenCustomization = (product: Product) => {
    setCustomizingProduct(product);
    setCustomAddOns([]);
    setCustomQuantity(1);
  };

  const handleToggleAddOn = (addon: AddOn) => {
    if (customAddOns.some((a) => a.id === addon.id)) {
      setCustomAddOns(customAddOns.filter((a) => a.id !== addon.id));
    } else {
      setCustomAddOns([...customAddOns, addon]);
    }
  };

  const handleAddCustomToPosCart = () => {
    if (!customizingProduct) return;
    const addOnTotal = customAddOns.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = customizingProduct.price + addOnTotal;
    const subtotal = unitPrice * customQuantity;

    // Generate unique ID for variant
    const addOnKey = customAddOns
      .map((a) => a.id)
      .sort()
      .join("-");
    const cartItemId = `${customizingProduct.id}-${addOnKey}`;

    const existingIdx = posCart.findIndex((i) => i.cartItemId === cartItemId);
    if (existingIdx > -1) {
      const updated = [...posCart];
      updated[existingIdx].quantity += customQuantity;
      updated[existingIdx].subtotal =
        updated[existingIdx].quantity * updated[existingIdx].unitTotalPrice;
      setPosCart(updated);
    } else {
      setPosCart([
        ...posCart,
        {
          cartItemId,
          product: customizingProduct,
          quantity: customQuantity,
          selectedAddOns: customAddOns,
          unitTotalPrice: unitPrice,
          subtotal,
        },
      ]);
    }

    setCustomizingProduct(null);
  };

  const handleQuickAddProduct = (product: Product) => {
    const allowedAddons = getAddOnsForProduct(product);
    if (allowedAddons.length > 0) {
      handleOpenCustomization(product);
    } else {
      const cartItemId = `${product.id}-default`;
      const existingIdx = posCart.findIndex((i) => i.cartItemId === cartItemId);
      if (existingIdx > -1) {
        const updated = [...posCart];
        updated[existingIdx].quantity += 1;
        updated[existingIdx].subtotal =
          updated[existingIdx].quantity * updated[existingIdx].unitTotalPrice;
        setPosCart(updated);
      } else {
        setPosCart([
          ...posCart,
          {
            cartItemId,
            product,
            quantity: 1,
            selectedAddOns: [],
            unitTotalPrice: product.price,
            subtotal: product.price,
          },
        ]);
      }
    }
  };

  const handleUpdatePosQuantity = (cartItemId: string, delta: number) => {
    setPosCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              subtotal: newQty * item.unitTotalPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as PosCartItem[]
    );
  };

  const handleRemovePosItem = (cartItemId: string) => {
    setPosCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const posTotal = useMemo(() => {
    return posCart.reduce((sum, i) => sum + i.subtotal, 0);
  }, [posCart]);

  const posChange = useMemo(() => {
    if (posPaymentMethod === "Tunai" && posCashAmount >= posTotal) {
      return posCashAmount - posTotal;
    }
    return 0;
  }, [posCashAmount, posTotal, posPaymentMethod]);

  const handleProcessPosOrder = () => {
    if (posCart.length === 0) {
      alert("Pilih minimal satu menu untuk membuat pesanan!");
      return;
    }

    const orderNumber = `BLG-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`;
    const orderItems: OrderItem[] = posCart.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      unitTotalPrice: item.unitTotalPrice,
      quantity: item.quantity,
      subtotal: item.subtotal,
      addOns: item.selectedAddOns.map(
        (a) => `${a.name} (+${formatRupiah(a.price)})`
      ),
    }));

    const newOrder: Order = {
      id: orderNumber,
      customerName: posCustomerName.trim() || "Pelanggan Kasir Outlet",
      whatsapp: posCustomerPhone.trim() || "085714210505",
      notes: posNotes.trim()
        ? `[Kasir - ${posPaymentMethod}] ${posNotes}`
        : `[Pesanan Kasir - ${posPaymentMethod}]`,
      items: orderItems,
      total: posTotal,
      status: "Selesai", // POS orders are auto-completed immediately
      createdAt: new Date().toISOString(),
    };

    saveOrders([newOrder, ...orders]);
    playChime();

    // Open receipt modal
    setReceiptOrder(newOrder);

    // Reset POS form
    setPosCart([]);
    setPosCustomerName("");
    setPosCustomerPhone("");
    setPosNotes("");
    setPosCashAmount(0);
  };

  const handlePrintReceipt = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Export orders to CSV (with source filter)
  const handleExportCSV = (source: "semua" | "online" | "kasir" = "semua") => {
    let filtered = orders;
    if (source === "kasir") filtered = orders.filter(isPosOrder);
    else if (source === "online") filtered = orders.filter((o) => !isPosOrder(o));

    if (filtered.length === 0) {
      alert("Tidak ada data pesanan untuk diekspor!");
      return;
    }
    const headers = [
      "No Pesanan",
      "Waktu",
      "Tanggal",
      "Bulan",
      "Tahun",
      "Sumber",
      "Nama Pelanggan",
      "WhatsApp",
      "Menu",
      "Total",
      "Status",
      "Catatan",
    ];
    const rows = filtered.map((o) => {
      const d = new Date(o.createdAt);
      return [
        o.id,
        d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        `"${d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}"`,
        `"${d.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}"`,
        d.getFullYear(),
        isPosOrder(o) ? "Kasir/POS" : "Online",
        `"${o.customerName}"`,
        `"${o.whatsapp}"`,
        `"${o.items.map((i) => `${i.name} (${i.quantity}x)`).join(", ")}"`,
        o.total,
        o.status,
        `"${o.notes || "-"}"`,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `laporan-bligus-${source}-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // =========================================================================
  // RENDER: LOADING STATE DURING INITIAL AUTH CHECK
  // =========================================================================
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#EEEBE7] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#352519] flex items-center justify-center p-2 animate-pulse">
            <Coffee className="w-6 h-6 text-[#EEEBE7]" />
          </div>
          <p className="text-xs font-bold text-[#352519]/70">
            Memuat Portal Kasir BliGus...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: LOGIN FORM SCREEN (WHEN NOT AUTHENTICATED)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#EEEBE7] flex flex-col justify-between p-4 sm:p-6 font-sans">
        
        {/* Top bar back link */}
        <div className="max-w-md w-full mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#352519] hover:underline p-2 rounded-xl hover:bg-[#352519]/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Menu Pembeli</span>
          </Link>

          <span className="text-[11px] font-semibold text-[#352519]/60">
            Karangasem, Bali
          </span>
        </div>

        {/* Center Login Box */}
        <div className="max-w-md w-full mx-auto my-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#352519]/15 space-y-6 animate-scale-up">
            
            {/* Header / Brand */}
            <div className="text-center space-y-2">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-[#352519] overflow-hidden flex items-center justify-center border-2 border-[#352519]/20 shadow-lg p-1">
                <Image
                  src="/images/Logo/Logo_BliGus.PNG"
                  alt="Logo BliGus Coffee"
                  fill
                  className="object-contain p-0.5"
                  priority
                />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#352519] tracking-tight">
                  Login Kasir & Admin
                </h1>
                <p className="text-xs text-[#352519]/70 font-medium mt-0.5">
                  Portal Khusus Pengelola & Barista BliGus Coffee
                </p>
              </div>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-700 font-bold animate-shake">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Username */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#352519]/80">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#352519]/50" />
                  <input
                    type="text"
                    required
                    placeholder="Masukkan username (contoh: admin)"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#EEEBE7] border border-[#352519]/15 text-xs text-[#352519] placeholder:text-[#352519]/40 focus:outline-none focus:ring-2 focus:ring-[#352519]/30 font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#352519]/80">
                  Password / PIN
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#352519]/50" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Masukkan password / PIN"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#EEEBE7] border border-[#352519]/15 text-xs text-[#352519] placeholder:text-[#352519]/40 focus:outline-none focus:ring-2 focus:ring-[#352519]/30 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#352519]/50 hover:text-[#352519]"
                    title={showPassword ? "Sembunyikan" : "Tampilkan"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 rounded-2xl bg-[#352519] text-[#EEEBE7] text-sm font-black hover:bg-[#251910] active:scale-95 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2 mt-2"
              >
                {loginLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Masuk ke Dashboard</span>
                  </>
                )}
              </button>

            </form>


          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-[#352519]/60">
          <p>© {new Date().getFullYear()} BliGus Coffee. Seluruh hak cipta dilindungi.</p>
        </div>

      </div>
    );
  }

  // =========================================================================
  // RENDER: AUTHENTICATED DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#EEEBE7] text-[#352519] flex flex-col font-sans selection:bg-[#352519] selection:text-[#EEEBE7]">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#352519] text-[#EEEBE7] px-4 sm:px-8 py-3 shadow-md flex items-center justify-between border-b border-[#352519]/20">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl bg-white/10 overflow-hidden flex items-center justify-center p-1 border border-white/20 shadow-sm shrink-0">
            <Image
              src="/images/Logo/Logo_BliGus.PNG"
              alt="Logo BliGus Coffee"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
                BliGus Coffee
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#EEEBE7] text-[#352519]">
                Live Outlet
              </span>
            </div>
            <p className="text-[11px] text-[#EEEBE7]/70 font-medium">
              BliGus Coffee • Jl. K.H. Samanhudi No.20 Subagan, Karangasem
            </p>
          </div>
        </div>

        {/* View Switcher Tabs (Desktop & Tablet) */}
        <div className="hidden md:flex items-center bg-white/10 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "orders"
                ? "bg-[#EEEBE7] text-[#352519] shadow-sm"
                : "text-[#EEEBE7]/80 hover:text-white"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Antrean Pesanan</span>
            {stats.waitingCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center">
                {stats.waitingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("pos")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "pos"
                ? "bg-[#EEEBE7] text-[#352519] shadow-sm"
                : "text-[#EEEBE7]/80 hover:text-white"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>KAP — Input Pesanan</span>
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "reports"
                ? "bg-[#EEEBE7] text-[#352519] shadow-sm"
                : "text-[#EEEBE7]/80 hover:text-white"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Laporan & Omset</span>
          </button>

          <button
            onClick={() => setActiveTab("menu")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "menu"
                ? "bg-[#EEEBE7] text-[#352519] shadow-sm"
                : "text-[#EEEBE7]/80 hover:text-white"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Kelola Menu</span>
          </button>
        </div>

        {/* Right Tools: Clock, Sound Toggle, Back to Store, Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Sound Notification Alert Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-colors ${
              soundEnabled
                ? "bg-white/10 border-white/20 text-[#EEEBE7] hover:bg-white/20"
                : "bg-red-500/20 border-red-400 text-red-300"
            }`}
            title={
              soundEnabled
                ? "Notifikasi Suara Aktif"
                : "Notifikasi Suara Dimatikan"
            }
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Time Clock */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-xs font-mono font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{currentTime || "09.00 WITA"}</span>
          </div>

          {/* Link back to Main Menu */}
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EEEBE7] text-[#352519] text-xs font-bold hover:bg-white active:scale-95 transition-all shadow-sm shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Menu Pembeli</span>
            <span className="sm:hidden">Menu</span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/20 text-red-200 border border-red-400/30 hover:bg-red-500 hover:text-white text-xs font-bold transition-all shadow-sm"
            title="Keluar / Kunci Layar"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>

        </div>

      </header>

      {/* Mobile Switcher Tab Bar */}
      <div className="md:hidden flex items-center justify-around bg-[#352519] text-[#EEEBE7] px-2 py-2 border-t border-white/10">
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "orders"
              ? "bg-[#EEEBE7] text-[#352519]"
              : "text-white/70"
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Antrean ({stats.waitingCount})</span>
        </button>
        <button
          onClick={() => setActiveTab("pos")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "pos" ? "bg-[#EEEBE7] text-[#352519]" : "text-white/70"
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>KAP POS</span>
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "reports"
              ? "bg-[#EEEBE7] text-[#352519]"
              : "text-white/70"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Laporan</span>
        </button>
        <button
          onClick={() => setActiveTab("menu")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "menu"
              ? "bg-[#EEEBE7] text-[#352519]"
              : "text-white/70"
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Menu</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ANTREAN & KITCHEN DISPLAY SYSTEM (ORDERS)                         */}
      {/* ========================================================================= */}
      {activeTab === "orders" && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
          
          {/* KPI Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            
            {/* Total Revenue */}
            <div className="p-4 rounded-2xl bg-white border border-[#352519]/15 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-[#352519]/60 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Total Omset
                </span>
                <DollarSign className="w-4 h-4 text-[#352519]" />
              </div>
              <span className="text-xl sm:text-2xl font-black text-[#352519] tracking-tight">
                {formatRupiah(stats.totalRevenue)}
              </span>
              <span className="text-[10px] text-[#352519]/60 mt-1">
                {stats.totalOrders} total transaksi
              </span>
            </div>

            {/* Menunggu Diproses */}
            <div className="p-4 rounded-2xl bg-white border border-[#352519]/15 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#352519]/60 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Pesanan Baru
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <span className="text-2xl font-black text-[#352519]">
                {stats.waitingCount}
              </span>
              <span className="text-[10px] text-amber-700 font-bold">
                Perlu Dibuat
              </span>
            </div>

            {/* Sedang Diproses */}
            <div className="p-4 rounded-2xl bg-white border border-[#352519]/15 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#352519]/60 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Sedang Diseduh
                </span>
                <Coffee className="w-4 h-4 text-[#352519]" />
              </div>
              <span className="text-2xl font-black text-[#352519]">
                {stats.processingCount}
              </span>
              <span className="text-[10px] text-[#352519]/70 font-bold">
                Di Barista
              </span>
            </div>

            {/* Siap Diambil */}
            <div className="p-4 rounded-2xl bg-white border border-[#352519]/15 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#352519]/60 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Siap Diambil
                </span>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-2xl font-black text-green-700">
                {stats.readyCount}
              </span>
              <span className="text-[10px] text-green-700 font-bold">
                Hubungi WA Pembeli
              </span>
            </div>

            {/* Selesai */}
            <div className="p-4 rounded-2xl bg-white border border-[#352519]/15 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#352519]/60 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Selesai
                </span>
                <CheckCircle2 className="w-4 h-4 text-[#352519]/40" />
              </div>
              <span className="text-2xl font-black text-[#352519]/60">
                {stats.completedCount}
              </span>
              <span className="text-[10px] text-[#352519]/50 font-bold">
                Sudah Diserahkan
              </span>
            </div>

          </div>

          {/* Filter & Action Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#352519]/15 shadow-sm">
            
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {[
                "Semua",
                "Menunggu Diproses",
                "Sedang Diproses",
                "Siap Diambil",
                "Selesai",
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    filterStatus === status
                      ? "bg-[#352519] text-[#EEEBE7] shadow-sm"
                      : "bg-[#EEEBE7] text-[#352519] hover:bg-[#352519]/10"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Search & Actions */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#352519]/50 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari nama / WA / No. Pesanan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#EEEBE7] border border-[#352519]/15 text-xs text-[#352519] placeholder:text-[#352519]/40 focus:outline-none focus:ring-2 focus:ring-[#352519]/20"
                />
              </div>

              <button
                onClick={handleAddSample}
                title="Simulasi Pesanan Masuk"
                className="p-2 sm:px-3 rounded-xl bg-[#352519]/8 hover:bg-[#352519]/15 text-[#352519] text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Simulasi Order</span>
              </button>

              {orders.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  title="Hapus Riwayat"
                  className="p-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>

          </div>

          {/* Orders Cards Grid */}
          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-[#352519]/15 p-8">
              <ShoppingBag className="w-12 h-12 text-[#352519]/30 mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#352519]">
                Belum ada antrean pesanan online
              </h3>
              <p className="text-xs text-[#352519]/60 mt-1 max-w-sm mx-auto">
                Pesanan baru dari website akan muncul di sini. Pesanan lewat kasir (KAP) langsung selesai otomatis dan tidak masuk antrean.
              </p>
              <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={() => setActiveTab("pos")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#352519] text-[#EEEBE7] text-xs font-bold shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buka KAP POS</span>
                </button>
                {orders.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-bold hover:bg-red-100 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Semua Pesanan</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {filteredOrders.map((order) => {
                const currentStatus = order.status || "Menunggu Diproses";
                
                // WhatsApp notification message when order is ready for pickup
                const waReadyMessage = encodeURIComponent(
                  `Halo Kak *${order.customerName}*! ☕\n\nPesananmu di *BliGus Coffee* dengan No. Pesanan *${order.id}* sudah *SELESAI & SIAP DIAMBIL* di outlet kami ya!\n\nAlamat: Jl. K.H. Samanhudi No.20 Subagan, Karangasem\n\nTerima kasih, sampai jumpa! 😊`
                );

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-5 border border-[#352519]/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Card Header */}
                      <div className="flex items-start justify-between pb-3 border-b border-[#352519]/10">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-mono font-black text-[#352519] bg-[#EEEBE7] px-2.5 py-1 rounded-lg border border-[#352519]/10">
                              {order.id}
                            </span>
                            <button
                              onClick={() => setReceiptOrder(order)}
                              title="Cetak Struk"
                              className="p-1 rounded-lg text-[#352519]/60 hover:text-[#352519] hover:bg-[#EEEBE7] transition-colors"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[10px] text-[#352519]/60 mt-1.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(order.createdAt).toLocaleTimeString(
                                "id-ID",
                                { hour: "2-digit", minute: "2-digit" }
                              )}{" "}
                              WITA
                            </span>
                          </p>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${
                            currentStatus === "Menunggu Diproses"
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : currentStatus === "Sedang Diproses"
                              ? "bg-[#352519] text-[#EEEBE7]"
                              : currentStatus === "Siap Diambil"
                              ? "bg-green-100 text-green-900 border border-green-300 animate-pulse"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {currentStatus}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="p-3 bg-[#EEEBE7]/60 rounded-2xl space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#352519] flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#352519]/60" />
                            {order.customerName}
                          </span>
                          <a
                            href={`https://wa.me/${order.whatsapp.replace(
                              /^0/,
                              "62"
                            )}?text=${waReadyMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-lg hover:bg-green-100 border border-green-200 transition-colors"
                            title="Chat WA Pembeli"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{order.whatsapp}</span>
                          </a>
                        </div>

                        {order.notes && (
                          <div className="pt-1.5 border-t border-[#352519]/10 text-[11px] text-[#352519]/80 italic flex items-start gap-1">
                            <FileText className="w-3 h-3 mt-0.5 shrink-0 text-[#352519]/50" />
                            <span>"{order.notes}"</span>
                          </div>
                        )}
                      </div>

                      {/* Items Breakdown */}
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-bold text-[#352519]/70 uppercase tracking-wider">
                          Item Pesanan ({order.items.length})
                        </h4>
                        <div className="space-y-1.5">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="text-xs flex items-start justify-between"
                            >
                              <div className="flex-1 pr-2">
                                <span className="font-bold text-[#352519]">
                                  {item.name}
                                </span>
                                <span className="text-[#352519]/60 ml-1">
                                  × {item.quantity}
                                </span>
                                {item.addOns && item.addOns.length > 0 && (
                                  <p className="text-[10px] text-[#352519]/70 pl-2">
                                    + {item.addOns.join(", ")}
                                  </p>
                                )}
                              </div>
                              <span className="font-bold text-[#352519]">
                                {formatRupiah(item.subtotal)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bukti Transfer Box */}
                      <div className="pt-2 border-t border-[#352519]/10 flex items-center justify-between">
                        <span className="text-xs text-[#352519]/70 font-semibold">
                          Bukti Bayar:
                        </span>
                        {order.proofImage ? (
                          <button
                            onClick={() =>
                              setSelectedProof(order.proofImage || null)
                            }
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#352519] bg-[#352519]/8 hover:bg-[#352519] hover:text-[#EEEBE7] px-2.5 py-1 rounded-xl transition-all border border-[#352519]/15"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat Foto Bukti</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-[#352519]/70 bg-[#EEEBE7] px-2 py-0.5 rounded-lg border border-[#352519]/10">
                            Kasir / QRIS Langsung
                          </span>
                        )}
                      </div>

                    </div>

                    {/* Card Bottom / Action Stepper for Barista */}
                    <div className="mt-5 pt-3.5 border-t border-[#352519]/10 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#352519]/70 font-medium">
                          Total Pesanan
                        </span>
                        <span className="text-lg font-black text-[#352519]">
                          {formatRupiah(order.total)}
                        </span>
                      </div>

                      {/* Workflow Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        {currentStatus === "Menunggu Diproses" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(order.id, "Sedang Diproses")
                            }
                            className="col-span-2 py-2.5 rounded-xl bg-[#352519] text-[#EEEBE7] text-xs font-bold hover:bg-[#251910] active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <Coffee className="w-3.5 h-3.5" />
                            <span>Mulai Racik (Di Barista)</span>
                          </button>
                        )}

                        {currentStatus === "Sedang Diproses" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(order.id, "Siap Diambil")
                            }
                            className="col-span-2 py-2.5 rounded-xl bg-green-700 text-white text-xs font-bold hover:bg-green-800 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Tandai Siap Diambil</span>
                          </button>
                        )}

                        {currentStatus === "Siap Diambil" && (
                          <>
                            <a
                              href={`https://wa.me/${order.whatsapp.replace(
                                /^0/,
                                "62"
                              )}?text=${waReadyMessage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-2.5 rounded-xl bg-green-600 text-white text-xs font-bold hover:bg-green-700 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5 text-center"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Hubungi WA</span>
                            </a>

                            <button
                              onClick={() =>
                                handleUpdateStatus(order.id, "Selesai")
                              }
                              className="py-2.5 rounded-xl bg-[#352519] text-[#EEEBE7] text-xs font-bold hover:bg-[#251910] active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Pesanan Selesai</span>
                            </button>
                          </>
                        )}

                        {currentStatus === "Selesai" && (
                          <div className="col-span-2 py-2 rounded-xl bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                            <span>Pesanan Telah Diserahkan</span>
                          </div>
                        )}
                      </div>

                      {/* Cancel Button — only for non-completed orders */}
                      {currentStatus !== "Selesai" && (
                        cancelingOrderId === order.id ? (
                          // Inline confirmation
                          <div className="mt-1 p-3 rounded-xl bg-red-50 border border-red-200 space-y-2">
                            <p className="text-xs font-bold text-red-700 text-center">
                              Yakin batalkan pesanan <span className="font-mono">{order.id}</span>?
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-black hover:bg-red-700 active:scale-95 transition-all"
                              >
                                Ya, Batalkan
                              </button>
                              <button
                                onClick={() => setCancelingOrderId(null)}
                                className="flex-1 py-2 rounded-xl bg-white text-[#352519] border border-[#352519]/20 text-xs font-bold hover:bg-[#EEEBE7] active:scale-95 transition-all"
                              >
                                Tidak
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setCancelingOrderId(order.id)}
                            className="w-full mt-1 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-bold hover:bg-red-100 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Batalkan Pesanan</span>
                          </button>
                        )
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </main>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KASIR POS (POINT OF SALE - INPUT PESANAN WALK-IN)                  */}
      {/* ========================================================================= */}
      {activeTab === "pos" && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Menu Catalog (Cols 1-7) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Search & Category Filter */}
            <div className="bg-white p-4 rounded-3xl border border-[#352519]/15 shadow-sm space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#352519]/50 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari menu kopi, americano, matcha..."
                  value={posSearch}
                  onChange={(e) => setPosSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#EEEBE7] border border-[#352519]/15 text-xs text-[#352519] placeholder:text-[#352519]/40 focus:outline-none focus:ring-2 focus:ring-[#352519]/20"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {(
                  [
                    "Semua",
                    "Signature Series",
                    "Coffee Series",
                    "Americano Series",
                    "Non-Coffee Series",
                    "BliGus Gabin",
                    "Combo / Bundling",
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPosCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      posCategory === cat
                        ? "bg-[#352519] text-[#EEEBE7] shadow-sm"
                        : "bg-[#EEEBE7] text-[#352519] hover:bg-[#352519]/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredProducts.map((product) => {
                const hasAddons =
                  getAddOnsForProduct(product).length > 0;
                return (
                  <button
                    key={product.id}
                    onClick={() => handleQuickAddProduct(product)}
                    className="group bg-white p-3 rounded-2xl border border-[#352519]/15 shadow-sm hover:shadow-md hover:border-[#352519] text-left transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#EEEBE7]">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        {product.badge && (
                          <span className="absolute top-1.5 left-1.5 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#352519] text-[#EEEBE7] shadow-sm">
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#352519] line-clamp-1 group-hover:underline">
                          {product.name}
                        </h4>
                        <span className="text-[10px] text-[#352519]/60">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#352519]/10 flex items-center justify-between">
                      <span className="text-xs font-black text-[#352519]">
                        {formatRupiah(product.price)}
                      </span>
                      <span className="p-1 rounded-lg bg-[#352519]/8 text-[#352519] text-[10px] font-bold group-hover:bg-[#352519] group-hover:text-[#EEEBE7] transition-colors">
                        {hasAddons ? "+ Add On" : "+ Tambah"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Column: POS Cart & Checkout (Cols 8-12) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-[#352519]/15 shadow-sm space-y-4 sticky top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#352519]/10">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#352519]" />
                <h3 className="text-sm font-bold text-[#352519]">
                  Struk Pesanan Kasir
                </h3>
              </div>
              {posCart.length > 0 && (
                <button
                  onClick={() => setPosCart([])}
                  className="text-[11px] font-bold text-red-600 hover:underline"
                >
                  Kosongkan
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1">
              {posCart.length === 0 ? (
                <div className="py-8 text-center text-[#352519]/50 text-xs">
                  <Coffee className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <span>Klik menu di sebelah kiri untuk menambah pesanan</span>
                </div>
              ) : (
                posCart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-2.5 bg-[#EEEBE7]/50 rounded-2xl border border-[#352519]/10 flex items-center justify-between text-xs gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-[#352519] truncate block">
                        {item.product.name}
                      </span>
                      {item.selectedAddOns.length > 0 && (
                        <span className="text-[10px] text-[#352519]/70 block truncate">
                          + {item.selectedAddOns.map((a) => a.name).join(", ")}
                        </span>
                      )}
                      <span className="text-[11px] font-semibold text-[#352519]/80">
                        {formatRupiah(item.subtotal)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-[#352519]/10 shrink-0">
                      <button
                        onClick={() =>
                          handleUpdatePosQuantity(item.cartItemId, -1)
                        }
                        className="p-1 hover:bg-[#EEEBE7] rounded text-[#352519]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-xs min-w-[14px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdatePosQuantity(item.cartItemId, 1)
                        }
                        className="p-1 hover:bg-[#EEEBE7] rounded text-[#352519]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemovePosItem(item.cartItemId)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Customer Details Form */}
            <div className="space-y-2.5 pt-2 border-t border-[#352519]/10">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#352519]/70 mb-1">
                    Nama Pelanggan (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Kak Wahyu"
                    value={posCustomerName}
                    onChange={(e) => setPosCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#EEEBE7] border border-[#352519]/15 text-xs text-[#352519] focus:outline-none focus:ring-1 focus:ring-[#352519]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#352519]/70 mb-1">
                    No. WhatsApp (Opsional)
                  </label>
                  <input
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={posCustomerPhone}
                    onChange={(e) => setPosCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#EEEBE7] border border-[#352519]/15 text-xs text-[#352519] focus:outline-none focus:ring-1 focus:ring-[#352519]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#352519]/70 mb-1">
                  Catatan Meja / Permintaan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Meja 03 / Less Sweet"
                  value={posNotes}
                  onChange={(e) => setPosNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#EEEBE7] border border-[#352519]/15 text-xs text-[#352519] focus:outline-none focus:ring-1 focus:ring-[#352519]"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2 border-t border-[#352519]/10">
              <label className="block text-[10px] font-bold uppercase text-[#352519]/70">
                Metode Pembayaran
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPosPaymentMethod("QRIS")}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    posPaymentMethod === "QRIS"
                      ? "bg-[#352519] text-[#EEEBE7] border-[#352519] shadow-sm"
                      : "bg-[#EEEBE7] text-[#352519] border-[#352519]/15 hover:bg-[#352519]/10"
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>QRIS BliGus</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPosPaymentMethod("Tunai")}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    posPaymentMethod === "Tunai"
                      ? "bg-[#352519] text-[#EEEBE7] border-[#352519] shadow-sm"
                      : "bg-[#EEEBE7] text-[#352519] border-[#352519]/15 hover:bg-[#352519]/10"
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  <span>Uang Tunai / Cash</span>
                </button>
              </div>

              {/* Cash Calculator if Cash is selected */}
              {posPaymentMethod === "Tunai" && (
                <div className="p-3 bg-[#EEEBE7] rounded-2xl border border-[#352519]/15 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#352519]/70">
                      Uang Diterima:
                    </span>
                    <input
                      type="number"
                      value={posCashAmount || ""}
                      placeholder="0"
                      onChange={(e) => setPosCashAmount(Number(e.target.value))}
                      className="w-28 text-right px-2 py-1 rounded-lg bg-white border border-[#352519]/20 font-bold text-[#352519]"
                    />
                  </div>

                  {/* Quick Cash Buttons */}
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                    {[posTotal, 20000, 50000, 100000].map((nominal) => (
                      <button
                        key={nominal}
                        type="button"
                        onClick={() => setPosCashAmount(nominal)}
                        className="px-2 py-1 rounded-lg bg-white text-[10px] font-bold text-[#352519] border border-[#352519]/15 hover:bg-[#352519] hover:text-white transition-colors"
                      >
                        {nominal === posTotal
                          ? "Uang Pas"
                          : formatRupiah(nominal)}
                      </button>
                    ))}
                  </div>

                  {posCashAmount > 0 && (
                    <div className="flex items-center justify-between pt-1 border-t border-[#352519]/10 font-bold">
                      <span>Kembalian:</span>
                      <span
                        className={
                          posCashAmount >= posTotal
                            ? "text-green-700"
                            : "text-red-600"
                        }
                      >
                        {posCashAmount >= posTotal
                          ? formatRupiah(posChange)
                          : "Kurang " + formatRupiah(posTotal - posCashAmount)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Total Calculation & Submit */}
            <div className="pt-3 border-t border-[#352519]/15 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#352519]/70 uppercase tracking-wider">
                  Total Tagihan
                </span>
                <span className="text-xl font-black text-[#352519]">
                  {formatRupiah(posTotal)}
                </span>
              </div>

              <button
                type="button"
                disabled={posCart.length === 0}
                onClick={handleProcessPosOrder}
                className="w-full py-3 rounded-2xl bg-[#352519] text-[#EEEBE7] text-sm font-black hover:bg-[#251910] active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Pesanan & Cetak Struk</span>
              </button>
            </div>

          </div>

        </main>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LAPORAN & RINGKASAN OMSET (REPORTS)                                */}
      {/* ========================================================================= */}
      {activeTab === "reports" && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">

          {/* Header + Download */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-[#352519]/15 shadow-sm">
            <div>
              <h2 className="text-lg font-black text-[#352519]">
                Laporan Omset & Rekap Penjualan
              </h2>
              <p className="text-xs text-[#352519]/60">
                Data penjualan dari pesanan online dan kasir POS — dapat difilter & diunduh
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => handleExportCSV("semua")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#352519] text-[#EEEBE7] text-xs font-bold hover:bg-[#251910] transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Semua</span>
              </button>
              <button
                onClick={() => handleExportCSV("online")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Online saja</span>
              </button>
              <button
                onClick={() => handleExportCSV("kasir")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Kasir saja</span>
              </button>
            </div>
          </div>

          {/* Online vs Kasir KPI Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-3xl border border-[#352519]/15 shadow-sm">
              <span className="text-xs font-bold uppercase text-[#352519]/60">Total Omset</span>
              <p className="text-2xl font-black text-[#352519] mt-1">{formatRupiah(stats.totalRevenue)}</p>
              <span className="text-[11px] text-[#352519]/60 mt-2 block">Dari {stats.totalOrders} transaksi</span>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-blue-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 bg-blue-50 rounded-bl-3xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-xs font-bold uppercase text-blue-600">Pesanan Online</span>
              <p className="text-2xl font-black text-blue-700 mt-1">{formatRupiah(stats.onlineRevenue)}</p>
              <span className="text-[11px] text-blue-600/70 mt-2 block">{stats.onlineOrders} transaksi dari website</span>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-amber-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 bg-amber-50 rounded-bl-3xl flex items-center justify-center">
                <Receipt className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-xs font-bold uppercase text-amber-700">Pesanan Kasir POS</span>
              <p className="text-2xl font-black text-amber-800 mt-1">{formatRupiah(stats.posRevenue)}</p>
              <span className="text-[11px] text-amber-700/70 mt-2 block">{stats.posOrders} transaksi dari outlet</span>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-[#352519]/15 shadow-sm">
              <span className="text-xs font-bold uppercase text-[#352519]/60">Rata-rata / Transaksi</span>
              <p className="text-2xl font-black text-[#352519] mt-1">
                {stats.totalOrders > 0 ? formatRupiah(Math.round(stats.totalRevenue / stats.totalOrders)) : "Rp0"}
              </p>
              <span className="text-[11px] text-green-700 font-bold mt-2 block">{stats.completedCount} pesanan selesai</span>
            </div>
          </div>

          {/* Period Recap Tables — split Online vs Offline */}
          <div className="space-y-4">

            {/* Period Selector shared */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-5 py-4 rounded-3xl border border-[#352519]/15 shadow-sm">
              <h3 className="text-sm font-bold text-[#352519] flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span>Rekap Penjualan Per Periode</span>
              </h3>
              <div className="flex items-center bg-[#EEEBE7] p-1 rounded-xl gap-1">
                {(["harian", "bulanan", "tahunan"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setReportPeriod(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                      reportPeriod === p
                        ? "bg-[#352519] text-[#EEEBE7] shadow-sm"
                        : "text-[#352519] hover:bg-[#352519]/10"
                    }`}
                  >
                    {p === "harian" ? "Per Hari" : p === "bulanan" ? "Per Bulan" : "Per Tahun"}
                  </button>
                ))}
              </div>
            </div>

            {/* Two tables side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* TABLE 1: ONLINE */}
              {(() => {
                const map =
                  reportPeriod === "harian"
                    ? stats.groupByDay
                    : reportPeriod === "bulanan"
                    ? stats.groupByMonth
                    : stats.groupByYear;
                const entries = Object.entries(map)
                  .filter(([, d]) => d.online > 0)
                  .sort((a, b) => b[0].localeCompare(a[0]));

                return (
                  <div className="bg-white rounded-3xl border border-blue-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-blue-100 flex items-center justify-between bg-blue-50/50">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-black text-blue-800">Pesanan Online</span>
                      </div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full">
                        {stats.onlineOrders} transaksi
                      </span>
                    </div>
                    {entries.length === 0 ? (
                      <div className="py-10 text-center text-xs text-[#352519]/50">
                        Belum ada pesanan online.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="bg-blue-50/60 text-blue-700/70 text-[11px] uppercase tracking-wider">
                              <th className="py-2.5 px-4">Periode</th>
                              <th className="py-2.5 px-4 text-center">Order</th>
                              <th className="py-2.5 px-4 text-right">Omset</th>
                            </tr>
                          </thead>
                          <tbody>
                            {entries.map(([period, data], idx) => (
                              <React.Fragment key={idx}>
                                {/* Date row */}
                                <tr className="border-b border-blue-50 bg-blue-50/20">
                                  <td className="py-2.5 px-4 font-black text-[#352519]">{period}</td>
                                  <td className="py-2.5 px-4 text-center">
                                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[11px]">
                                      {data.count > 0 ? data.count : "—"}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-4 text-right font-black text-blue-700">
                                    {formatRupiah(data.online)}
                                  </td>
                                </tr>
                                {/* Product sub-rows — only for daily view */}
                                {reportPeriod === "harian" && "items" in data && Object.entries((data as any).items as Record<string, any>)
                                  .filter(([, itd]) => itd.onlineQty > 0)
                                  .sort((a, b) => b[1].onlineQty - a[1].onlineQty)
                                  .map(([itemName, itd], iIdx) => (
                                    <tr key={`item-${iIdx}`} className="border-b border-blue-50/60 bg-white hover:bg-blue-50/20 transition-colors">
                                      <td className="py-1.5 pl-8 pr-4 text-[11px] text-[#352519]/80 flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-blue-300 shrink-0 mt-0.5" />
                                        {itemName}
                                      </td>
                                      <td className="py-1.5 px-4 text-center">
                                        <span className="text-[11px] font-bold text-blue-600">{itd.onlineQty}x</span>
                                      </td>
                                      <td className="py-1.5 px-4 text-right text-[11px] font-semibold text-blue-500">
                                        {formatRupiah(itd.onlineRev)}
                                      </td>
                                    </tr>
                                  ))
                                }
                              </React.Fragment>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-blue-50 font-black text-blue-800 text-xs border-t border-blue-200">
                              <td className="py-3 px-4 uppercase tracking-wider">Total</td>
                              <td className="py-3 px-4 text-center">{stats.onlineOrders} order</td>
                              <td className="py-3 px-4 text-right">{formatRupiah(stats.onlineRevenue)}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* TABLE 2: KASIR/OFFLINE */}
              {(() => {
                const map =
                  reportPeriod === "harian"
                    ? stats.groupByDay
                    : reportPeriod === "bulanan"
                    ? stats.groupByMonth
                    : stats.groupByYear;
                const entries = Object.entries(map)
                  .filter(([, d]) => d.kasir > 0)
                  .sort((a, b) => b[0].localeCompare(a[0]));

                return (
                  <div className="bg-white rounded-3xl border border-amber-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-amber-100 flex items-center justify-between bg-amber-50/50">
                      <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-amber-700" />
                        <span className="text-sm font-black text-amber-900">Kasir / Offline (KAP)</span>
                      </div>
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                        {stats.posOrders} transaksi
                      </span>
                    </div>
                    {entries.length === 0 ? (
                      <div className="py-10 text-center text-xs text-[#352519]/50">
                        Belum ada transaksi kasir.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="bg-amber-50/60 text-amber-700/70 text-[11px] uppercase tracking-wider">
                              <th className="py-2.5 px-4">Periode</th>
                              <th className="py-2.5 px-4 text-center">Order</th>
                              <th className="py-2.5 px-4 text-right">Omset</th>
                            </tr>
                          </thead>
                          <tbody>
                            {entries.map(([period, data], idx) => (
                              <React.Fragment key={idx}>
                                {/* Date row */}
                                <tr className="border-b border-amber-50 bg-amber-50/20">
                                  <td className="py-2.5 px-4 font-black text-[#352519]">{period}</td>
                                  <td className="py-2.5 px-4 text-center">
                                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                                      {data.count > 0 ? data.count : "—"}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-4 text-right font-black text-amber-800">
                                    {formatRupiah(data.kasir)}
                                  </td>
                                </tr>
                                {/* Product sub-rows — only for daily view */}
                                {reportPeriod === "harian" && "items" in data && Object.entries((data as any).items as Record<string, any>)
                                  .filter(([, itd]) => itd.kasirQty > 0)
                                  .sort((a, b) => b[1].kasirQty - a[1].kasirQty)
                                  .map(([itemName, itd], iIdx) => (
                                    <tr key={`item-${iIdx}`} className="border-b border-amber-50/60 bg-white hover:bg-amber-50/20 transition-colors">
                                      <td className="py-1.5 pl-8 pr-4 text-[11px] text-[#352519]/80 flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-amber-300 shrink-0 mt-0.5" />
                                        {itemName}
                                      </td>
                                      <td className="py-1.5 px-4 text-center">
                                        <span className="text-[11px] font-bold text-amber-700">{itd.kasirQty}x</span>
                                      </td>
                                      <td className="py-1.5 px-4 text-right text-[11px] font-semibold text-amber-600">
                                        {formatRupiah(itd.kasirRev)}
                                      </td>
                                    </tr>
                                  ))
                                }
                              </React.Fragment>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-amber-50 font-black text-amber-900 text-xs border-t border-amber-200">
                              <td className="py-3 px-4 uppercase tracking-wider">Total</td>
                              <td className="py-3 px-4 text-center">{stats.posOrders} order</td>
                              <td className="py-3 px-4 text-right">{formatRupiah(stats.posRevenue)}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })()}

            </div>
          </div>

          {/* Top Products Table */}
          <div className="bg-white p-5 rounded-3xl border border-[#352519]/15 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#352519] flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Menu Paling Laris (Top Seller Ranking)</span>
            </h3>

            {stats.topItems.length === 0 ? (
              <p className="text-xs text-[#352519]/60 py-4 text-center">
                Belum ada data penjualan tercatat.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#352519]/10 text-[#352519]/60">
                      <th className="py-2.5 px-3">No</th>
                      <th className="py-2.5 px-3">Nama Menu</th>
                      <th className="py-2.5 px-3 text-center">Jumlah Terjual</th>
                      <th className="py-2.5 px-3 text-right">Total Pendapatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topItems.map((item, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-[#352519]/5 hover:bg-[#EEEBE7]/40 transition-colors"
                      >
                        <td className="py-2.5 px-3 font-bold text-[#352519]/50">#{idx + 1}</td>
                        <td className="py-2.5 px-3 font-bold text-[#352519]">{item.name}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-[#EEEBE7] font-bold">{item.count} cup</span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-[#352519]">
                          {formatRupiah(item.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CUSTOMIZE ADD-ON (FOR POS)                                         */}
      {/* ========================================================================= */}
      {customizingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setCustomizingProduct(null)}
          />

          <div className="min-h-screen px-4 py-8 flex items-center justify-center">
            <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl p-5 border border-gray-200 z-10 space-y-4 animate-scale-up">
              
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-[#352519]" />
                  <h3 className="text-sm font-bold text-[#352519]">
                    Opsi Tambahan (Add-On)
                  </h3>
                </div>
                <button
                  onClick={() => setCustomizingProduct(null)}
                  className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#EEEBE7]/60 rounded-2xl">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#EEEBE7] shrink-0">
                  <Image
                    src={customizingProduct.image}
                    alt={customizingProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#352519]">
                    {customizingProduct.name}
                  </h4>
                  <span className="text-[11px] font-black text-[#352519]">
                    {formatRupiah(customizingProduct.price)}
                  </span>
                </div>
              </div>

              {/* Add-on options */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#352519]/70 uppercase tracking-wider">
                  Pilih Add-On ({customizingProduct.name})
                </span>
                <div className="space-y-1.5">
                  {getAddOnsForProduct(customizingProduct).map(
                    (addon) => {
                      const isSelected = customAddOns.some(
                        (a) => a.id === addon.id
                      );
                      return (
                        <button
                          key={addon.id}
                          type="button"
                          onClick={() => handleToggleAddOn(addon)}
                          className={`w-full p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                            isSelected
                              ? "bg-[#352519] text-[#EEEBE7] border-[#352519]"
                              : "bg-[#EEEBE7]/50 text-[#352519] border-[#352519]/15 hover:bg-[#352519]/10"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                                isSelected
                                  ? "bg-white text-[#352519] border-white"
                                  : "border-[#352519]/30"
                              }`}
                            >
                              {isSelected && (
                                <Check className="w-3 h-3 stroke-[3]" />
                              )}
                            </div>
                            <span>{addon.name}</span>
                          </div>
                          <span className="font-bold">
                            +{formatRupiah(addon.price)}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs font-bold text-[#352519]">
                  Jumlah Cup
                </span>
                <div className="flex items-center gap-2 bg-[#EEEBE7] px-3 py-1.5 rounded-xl border border-[#352519]/15">
                  <button
                    onClick={() => setCustomQuantity((q) => Math.max(1, q - 1))}
                    className="p-0.5 text-[#352519]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-xs min-w-[20px] text-center">
                    {customQuantity}
                  </span>
                  <button
                    onClick={() => setCustomQuantity((q) => q + 1)}
                    className="p-0.5 text-[#352519]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Submit to POS Cart */}
              <button
                type="button"
                onClick={handleAddCustomToPosCart}
                className="w-full py-2.5 rounded-xl bg-[#352519] text-[#EEEBE7] text-xs font-bold hover:bg-[#251910] transition-colors shadow-sm"
              >
                Tambahkan ke Struk Kasir
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: KELOLA MENU (On/Off)                                             */}
      {/* ========================================================================= */}
      {activeTab === "menu" && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-[#352519]/15 shadow-sm">
            <div>
              <h2 className="text-lg font-black text-[#352519]">Kelola Ketersediaan Menu</h2>
              <p className="text-xs text-[#352519]/70 mt-1">
                Atur status (Tersedia / Tidak Tersedia) untuk setiap menu.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {PRODUCTS.map((product) => {
              const isAvailable = menuAvailability[product.id] !== undefined ? menuAvailability[product.id] : product.isAvailable;

              return (
                <div key={product.id} className={`bg-white p-4 rounded-3xl border ${isAvailable ? 'border-[#352519]/20' : 'border-red-500/30 opacity-75'} shadow-sm flex flex-col justify-between transition-all`}>
                  <div className="flex items-start gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#EEEBE7] shrink-0 border border-[#352519]/10">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#352519] leading-tight">{product.name}</h4>
                      <p className="text-[10px] font-semibold text-[#352519]/60">{product.category}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-[#352519]/10 flex items-center justify-between">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {isAvailable ? "Tersedia" : "Tidak Tersedia"}
                    </span>
                    <button
                      onClick={() => toggleMenuAvailability(product.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                        isAvailable 
                          ? "bg-[#352519]/10 text-[#352519] hover:bg-[#352519]/20" 
                          : "bg-[#352519] text-[#EEEBE7] shadow-sm hover:bg-[#251910]"
                      }`}
                    >
                      {isAvailable ? "Matikan" : "Hidupkan"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PRINT / RECEIPT STRUK THERMAL                                      */}
      {/* ========================================================================= */}
      {receiptOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setReceiptOrder(null)}
          />

          <div className="min-h-screen px-4 py-8 flex items-center justify-center">
            <div className="relative max-w-sm w-full bg-white rounded-3xl shadow-2xl p-6 border border-gray-200 z-10 space-y-4 font-mono animate-scale-up text-xs text-black">
              
              {/* Receipt Header */}
              <div className="text-center space-y-1 pb-3 border-b border-dashed border-gray-300">
                <h3 className="text-base font-black tracking-wider uppercase">
                  BLIGUS COFFEE
                </h3>
                <p className="text-[10px] text-gray-600">
                  Jl. K.H. Samanhudi No.20 Subagan
                </p>
                <p className="text-[10px] text-gray-600">
                  Karangasem, Bali • 085714210505
                </p>
                <div className="pt-2 text-[10px] text-gray-700 flex justify-between">
                  <span>No: {receiptOrder.id}</span>
                  <span>
                    {new Date(receiptOrder.createdAt).toLocaleTimeString(
                      "id-ID",
                      { hour: "2-digit", minute: "2-digit" }
                    )}{" "}
                    WITA
                  </span>
                </div>
                <div className="text-[10px] text-left text-gray-700">
                  <span>Pelanggan: {receiptOrder.customerName}</span>
                </div>
                {isPosOrder(receiptOrder) && (
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black border border-amber-300 font-sans">
                    <Receipt className="w-2.5 h-2.5" />
                    PESAN LEWAT KASIR — KAP
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-2 py-2 border-b border-dashed border-gray-300">
                {receiptOrder.items.map((item, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between font-bold">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span>{formatRupiah(item.subtotal)}</span>
                    </div>
                    {item.addOns && item.addOns.length > 0 && (
                      <p className="text-[10px] text-gray-600 pl-2">
                        + {item.addOns.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="space-y-1 py-1 border-b border-dashed border-gray-300 font-bold">
                <div className="flex justify-between text-sm">
                  <span>TOTAL:</span>
                  <span>{formatRupiah(receiptOrder.total)}</span>
                </div>
                {receiptOrder.notes && (
                  <p className="text-[10px] text-gray-600 italic font-normal">
                    Catatan: {receiptOrder.notes}
                  </p>
                )}
              </div>

              {/* Receipt Footer */}
              <div className="text-center space-y-1 text-[10px] text-gray-600 pt-1">
                <p className="italic font-serif">“Kopi dulu, dunia nanti.”</p>
                <p>Terima kasih atas kunjungan Anda!</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 font-sans">
                <button
                  onClick={handlePrintReceipt}
                  className="flex-1 py-2 rounded-xl bg-[#352519] text-[#EEEBE7] text-xs font-bold hover:bg-[#251910] flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Nota</span>
                </button>
                <button
                  onClick={() => setReceiptOrder(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200"
                >
                  Tutup
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BUKTI TRANSFER FULL VIEWER                                         */}
      {/* ========================================================================= */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedProof(null)}
          />

          <div className="min-h-screen px-4 py-8 flex items-center justify-center">
            <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl p-5 border border-gray-200 z-10 space-y-4 animate-scale-up">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h3 className="text-sm font-bold text-[#352519] flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  Foto Bukti Pembayaran QRIS
                </h3>
                <button
                  onClick={() => setSelectedProof(null)}
                  className="p-1.5 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 border border-gray-200">
                <Image
                  src={selectedProof}
                  alt="Bukti Transfer Pembeli"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <a
                  href={selectedProof}
                  download="bukti-transfer-bligus.png"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#352519] text-[#EEEBE7] text-xs font-bold hover:bg-[#251910] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Bukti</span>
                </a>

                <button
                  onClick={() => setSelectedProof(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
