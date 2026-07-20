import { Search, Bell, Menu, ScanLine, Star, ShoppingCart, X, Plus, Minus, ChevronRight, CheckCircle } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import BarcodeScanner from "../components/BarcodeScanner";
import { cn } from "../lib/utils";
import { formatRupiah } from "../lib/format";
import DrawerMenu from "../components/DrawerMenu";
import Layout from "../components/Layout";
import "swiper/css";

const PAYMENT_METHODS = [
    { id: "Tunai", label: "Tunai", icon: "💵" },
    { id: "QRIS", label: "QRIS", icon: "📱" },
    { id: "Transfer Bank", label: "Transfer Bank", icon: "🏦" },
    { id: "Debit / EDC", label: "Debit/EDC", icon: "💳" },
    { id: "E-Wallet", label: "E-Wallet", icon: "👛" },
    { id: "Lainnya", label: "Lainnya", icon: "•••" },
];

const QUICK_AMOUNTS = [50000, 100000, 200000, 500000];

interface Product {
    id: number;
    barcode: string;
    name: string;
    categoryId: number;
    categoryName: string;
    price: number;
    stock: number;
    imageUrl?: string;
    isNew: boolean;
    isFavorite: boolean;
    isActive: boolean;
}

const allProducts: Product[] = [
    {
        id: 0,
        barcode: "1119872727",
        name: "Beras Premium",
        categoryId: 3,
        categoryName: "Sembako",
        price: 75000,
        stock: 20,
        imageUrl: 'uploads/product-1783060546472-2xz7x6.jpg',
        isNew: true,
        isFavorite: true,
        isActive: true,
    },
    {
        id: 1,
        barcode: "113456788",
        name: "Mie Sedaap Goreng",
        categoryId: 1,
        categoryName: "Makanan",
        price: 3000,
        stock: 20,
        imageUrl: 'uploads/product-1783060577364-54xti7.jpg',
        isNew: true,
        isFavorite: true,
        isActive: true,
    },
    {
        id: 2,
        barcode: "222162626",
        name: "Sprite 330 ml",
        categoryId: 2,
        categoryName: "Minuman",
        price: 7000,
        stock: 15,
        imageUrl: 'uploads/product-1783060682361-kgyuhr.jpg',
        isNew: false,
        isFavorite: false,
        isActive: true,
    },
    {
        id: 3,
        barcode: "333982822",
        name: "Indomie Goreng",
        categoryId: 5,
        categoryName: "Snack",
        price: 3500,
        stock: 5,
        imageUrl: 'uploads/product-1783060738571-twsbrh.jpg',
        isNew: false,
        isFavorite: false,
        isActive: true,
    },
    {
        id: 4,
        barcode: "44413123123",
        name: "Kopi Kapal Api",
        categoryId: 2,
        categoryName: "Minuman",
        price: 13000,
        stock: 20,
        imageUrl: 'uploads/product-1783060770275-hlz1jg.jpg',
        isNew: true,
        isFavorite: true,
        isActive: true,
    },
    {
        id: 5,
        barcode: "5555123123",
        name: "Teh Pucuk 350ml",
        categoryId: 2,
        categoryName: "Minuman",
        price: 4500,
        stock: 20,
        imageUrl: 'uploads/product-1783060851322-l3s80r.jpg',
        isNew: true,
        isFavorite: true,
        isActive: true,
    },
    {
        id: 6,
        barcode: "666313121",
        name: "Pocari Sweat 500ml",
        categoryId: 2,
        categoryName: "Minuman",
        price: 9000,
        stock: 20,
        imageUrl: 'uploads/product-1783060892162-a1ignt.jpg',
        isNew: true,
        isFavorite: true,
        isActive: true,
    },
    {
        id: 7,
        barcode: "7773424234",
        name: "Rokok Sampoerna",
        categoryId: 4,
        categoryName: "Rokok",
        price: 25000,
        stock: 10,
        imageUrl: 'uploads/product-1783060934668-6mwy0z.jpg',
        isNew: true,
        isFavorite: true,
        isActive: true,
    },
    {
        id: 8,
        barcode: "88872727",
        name: "Beras Sedap Wangi",
        categoryId: 3,
        categoryName: "Sembako",
        price: 95000,
        stock: 46,
        imageUrl: 'uploads/product-1783006807207-qzdzpe.jpg',
        isNew: true,
        isFavorite: true,
        isActive: true,
    },
    {
        id: 9,
        barcode: "9998282882",
        name: "Sabun Lifebuoy",
        categoryId: 6,
        categoryName: "Kebersihan",
        price: 5500,
        stock: 41,
        imageUrl: 'uploads/product-1783060477046-xqz3yq.jpg',
        isNew: true,
        isFavorite: true,
        isActive: true,
    },
    {
        id: 10,
        barcode: "9998282882",
        name: "Good Day 3in1",
        categoryId: 2,
        categoryName: "Minuman",
        price: 4000,
        stock: 58,
        imageUrl: 'uploads/product-1783060612370-38tklb.jpg',
        isNew: true,
        isFavorite: true,
        isActive: true,
    },
    {
        id: 11,
        barcode: "9998282882",
        name: "Oreo Original",
        categoryId: 5,
        categoryName: "Snack",
        price: 8500,
        stock: 33,
        imageUrl: 'uploads/product-1783060642229-ql28oc.jpg',
        isNew: true,
        isFavorite: true,
        isActive: true,
    },
];

interface CartItem {
    product: Product;
    quantity: number;
}

export default function Browse() {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("Tunai");
    const [amountPaid, setAmountPaid] = useState("");
    const [printReceipt, setPrintReceipt] = useState(true);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [qrisCountdown, setQrisCountdown] = useState(300);
    const [qrisTimerRef] = useState<{ current: ReturnType<typeof setInterval> | null }>({ current: null });

    const [scannerOpen, setScannerOpen] = useState(false);
    const scanned = useRef(false);
    const [items, setItems] = useState<CartItem[]>([]);
    const lastBarcode = useRef("");
    const lastScanTime = useRef(0);
    // const [scanMessage, setScanMessage] = useState("");

    const addToCart = (product: Product) => {
        setItems((prev) => {
            const existing = prev.find(
                (item) => item.product.id === product.id
            );

            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                        }
                        : item
                );
            }

            return [...prev, { product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: number) => {
        setItems((prev) =>
            prev.filter((item) => item.product.id !== productId)
        );
    };

    const updateQuantity = (
        productId: number,
        quantity: number
    ) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setItems((prev) =>
            prev.map((item) =>
                item.product.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    // const clearCart = () => setItems([]);
    const totalItems = items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const totalPrice = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    // const createTransaction = {
    //     isPending: false,
    //     mutateAsync: async (data: unknown) => {
    //         console.log("Dummy Transaction", data);
    //         return Promise.resolve();
    //     },
    // };

    const categories = [
        { id: 1, name: "Makanan" },
        { id: 2, name: "Minuman" },
        { id: 3, name: "Sembako" },
        { id: 4, name: "Rokok" },
        { id: 5, name: "Snack" },
        { id: 6, name: "Kebersihan" },
    ];

    const products = allProducts.filter((product) => {
        const matchSearch = product.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchCategory =
            selectedCategory === null ||
            product.categoryId === selectedCategory;

        return matchSearch && matchCategory;
    });

    const change = Number(amountPaid.replace(/\D/g, "")) - 0;

    function getCartQty(id: number) {
        const item = items.find(
            item => item.product.id === id
        );

        return item?.quantity ?? 0;
    }

    function openPayment() {
        setCartOpen(false);
        setTimeout(() => setPaymentOpen(true), 300);
    }

    function handlePaymentMethodChange(method: string) {
        setPaymentMethod(method);
        if (method === "QRIS") {
            setQrisCountdown(300);
            if (qrisTimerRef.current) clearInterval(qrisTimerRef.current);
            qrisTimerRef.current = setInterval(() => {
                setQrisCountdown((c) => {
                    if (c <= 1) { clearInterval(qrisTimerRef.current!); return 0; }
                    return c - 1;
                });
            }, 1000);
        }
    }

    async function handleConfirmPayment() {
        setPaymentOpen(false);
        setPaymentSuccess(true);
        setTimeout(() => setPaymentSuccess(false), 3000);
        setAmountPaid("");
    }

    function handleAddToCart(product: typeof products[0]) {
        if (!product.isActive || product.stock === 0) return;
        addToCart(product as any);
    }

    const formatQrisTime = () => {
        const m = Math.floor(qrisCountdown / 60).toString().padStart(2, "0");
        const s = (qrisCountdown % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const openScanner = () => {
        scanned.current = false;
        setScannerOpen(true);
    };

    const beepSound = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        beepSound.current = new Audio("/sounds/beep.mp3");
        beepSound.current.preload = "auto";
    }, []);

    const playBeep = () => {
        if (!beepSound.current) return;

        beepSound.current.currentTime = 0;
        beepSound.current.play().catch(() => { });
    };

    return (
        <Layout>
            {/* Header */}
            <div className="bg-primary px-4 pb-3" style={{ paddingTop: "max(12px, env(safe-area-inset-top, 0px))" }}>
                <div className="flex items-center mb-4">
                    {/* Left — fixed width so logo stays centered */}
                    <div className="w-10 flex justify-start">
                        <button onClick={() => setDrawerOpen(true)} className="text-white p-1 -ml-1">
                            <Menu size={24} />
                        </button>
                    </div>
                    {/* Center — logo */}
                    <div className="flex-1 flex justify-center">
                        <img
                            src={`assets/images/logos/narapos-logo.png`}
                            alt="Narapos"
                            className="h-11 w-auto object-contain"
                        />
                    </div>
                    {/* Right — fixed width matching left */}
                    <div className="w-10 flex justify-end">
                        <div className="relative">
                            <button className="text-white p-1 -mr-1">
                                <Bell size={24} />
                            </button>
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">1</span>
                        </div>
                    </div>
                </div>
                {/* Search bar */}
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari produk / SKU / Barcode..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white rounded-xl py-3 pl-9 pr-12 text-sm text-gray-700 outline-none shadow-sm"
                    />
                    <button
                        onClick={openScanner}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
                    >
                        <ScanLine size={18} />
                    </button>
                </div>
            </div>

            {/* Category chips */}
            <div className="bg-white border-b border-gray-100 px-4 py-3 overflow-x-auto flex gap-2 scrollbar-none">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors", selectedCategory === null ? "bg-primary text-white" : "bg-gray-100 text-gray-600")}
                >
                    <span className="text-base">&#9638;</span> Semua
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors", selectedCategory === cat.id ? "bg-primary text-white" : "bg-gray-100 text-gray-600")}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Products section */}
            <div className="flex-1 bg-gray-50 px-4 pt-4 pb-36 overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-800 text-sm">Semua Produk</span>
                    <button className="flex items-center gap-1 text-sm text-gray-500">Urutkan</button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {products.map((product) => {
                        const qty = getCartQty(product.id);
                        return (
                            <div key={product.id} className="bg-white rounded-2xl p-3 shadow-sm relative">
                                {product.isNew && (
                                    <span className="absolute top-2 right-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
                                )}
                                <button
                                    onClick={() => {/* toggle favorite */ }}
                                    className="absolute top-2 left-2"
                                >
                                    <Star size={16} fill={product.isFavorite ? "#F59E0B" : "none"} className={product.isFavorite ? "text-yellow-400" : "text-gray-300"} />
                                </button>
                                <div className="w-full aspect-square bg-gray-100 rounded-xl mb-2 flex items-center justify-center overflow-hidden mt-3">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary text-lg font-bold">
                                            {product.name[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="font-medium text-gray-800 text-xs leading-tight mb-0.5 truncate">{product.name}</div>
                                <div className="text-gray-400 text-[10px] mb-2">{product.categoryName}</div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-primary font-bold text-sm">{formatRupiah(product.price)}</div>
                                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", product.stock > 10 ? "bg-green-100 text-green-700" : product.stock > 0 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700")}>
                                            Stok {product.stock}
                                        </span>
                                    </div>
                                    {qty === 0 ? (
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={product.stock === 0}
                                            className="bg-primary text-white rounded-lg p-1.5 disabled:opacity-40"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => updateQuantity(product.id, qty - 1)} className="bg-gray-100 rounded-md p-0.5"><Minus size={12} /></button>
                                            <span className="text-xs font-bold w-5 text-center">{qty}</span>
                                            <button onClick={() => updateQuantity(product.id, qty + 1)} className="bg-primary text-white rounded-md p-0.5"><Plus size={12} /></button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Scan barcode banner */}
                <div className="mt-4 bg-primary/10 border border-primary/20 rounded-2xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ScanLine size={20} className="text-primary" />
                        <div>
                            <div className="text-xs font-semibold text-primary">Scan barcode lebih cepat</div>
                            <div className="text-[10px] text-gray-500">Gunakan tombol scan untuk menambah produk</div>
                        </div>
                    </div>
                    <button className="bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <ScanLine size={14} /> Scan Barcode
                    </button>
                </div>
            </div>

            {/* Cart bar */}
            {totalItems > 0 && (
                <div
                    className="fixed bottom-16 left-0 right-0 mx-auto max-w-[430px] bg-white border-t border-gray-100 px-4 py-2 shadow-lg cursor-pointer z-30"
                    onClick={() => setCartOpen(true)}
                >
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <ShoppingCart size={20} className="text-primary" />
                            <span className="absolute -top-2 -right-2 bg-primary text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">{totalItems}</span>
                        </div>
                        <div className="flex gap-1">
                            {items.slice(0, 3).map((item) => (
                                <div key={item.product.id} className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                                    {item.product.imageUrl ? <img src={item.product.imageUrl} className="w-full h-full object-cover" /> : item.product.name[0]}
                                </div>
                            ))}
                            {items.length > 3 && <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-500">+{items.length - 3}</div>}
                        </div>
                        <div className="text-xs text-gray-500">{totalItems} Item</div>
                        <div className="ml-auto flex items-center gap-1 text-primary font-bold text-sm">
                            {formatRupiah(totalPrice)} <ChevronRight size={16} />
                        </div>
                    </div>
                </div>
            )}

            {/* Cart Bottom Sheet */}
            {cartOpen && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
                    <div className="relative bg-white rounded-t-3xl max-h-[80vh] flex flex-col">
                        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4" />
                        <div className="flex items-center justify-between px-4 pb-3 border-b">
                            <span className="font-bold text-gray-800">Keranjang</span>
                            <button onClick={() => setCartOpen(false)}><X size={20} className="text-gray-400" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                            {items.map((item) => (
                                <div key={item.product.id} className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-sm font-bold text-primary overflow-hidden shrink-0">
                                        {item.product.imageUrl ? <img src={item.product.imageUrl} className="w-full h-full object-cover" /> : item.product.name[0]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-800 truncate">{item.product.name}</div>
                                        <div className="text-primary text-sm font-bold">{formatRupiah(item.product.price)}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="bg-gray-100 rounded-lg p-1"><Minus size={14} /></button>
                                        <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="bg-primary text-white rounded-lg p-1"><Plus size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-4 pb-4 pt-3 border-t">
                            <div className="flex justify-between mb-4">
                                <span className="text-gray-600 font-medium">Total</span>
                                <span className="font-bold text-gray-800 text-lg">{formatRupiah(totalPrice)}</span>
                            </div>
                            <button onClick={openPayment} className="w-full bg-primary text-white font-semibold py-4 rounded-2xl text-sm">
                                Bayar Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Bottom Sheet */}
            {paymentOpen && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setPaymentOpen(false)} />
                    <div className="relative bg-white rounded-t-3xl max-h-[90vh] flex flex-col overflow-y-auto">
                        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4 shrink-0" />
                        <div className="flex items-center justify-between px-4 pb-3 border-b shrink-0">
                            <span className="font-bold text-gray-800 text-lg">Pembayaran</span>
                            <button onClick={() => setPaymentOpen(false)}><X size={20} className="text-gray-400" /></button>
                        </div>
                        <div className="px-4 py-3 shrink-0">
                            <div className="text-sm text-gray-500 mb-1">Total Pembayaran</div>
                            <div className="text-3xl font-bold text-primary">{formatRupiah(100000)}</div>
                        </div>
                        <div className="px-4 pb-3 shrink-0">
                            <div className="text-sm font-medium text-gray-700 mb-3">Pilih Metode Pembayaran</div>
                            <div className="grid grid-cols-3 gap-2">
                                {PAYMENT_METHODS.map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => handlePaymentMethodChange(m.id)}
                                        className={cn("border-2 rounded-xl py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors", paymentMethod === m.id ? "border-primary bg-primary/5 text-primary" : "border-gray-200 text-gray-600")}
                                    >
                                        <span className="text-xl">{m.icon}</span>
                                        <span>{m.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tunai */}
                        {paymentMethod === "Tunai" && (
                            <div className="px-4 pb-4 border-t pt-3">
                                <div className="text-sm font-medium text-gray-700 mb-2">Uang Diterima</div>
                                <div className="relative mb-3">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                                    <input
                                        type="text"
                                        value={amountPaid ? Number(amountPaid.replace(/\D/g, "")).toLocaleString("id-ID") : ""}
                                        onChange={(e) => setAmountPaid(e.target.value.replace(/\D/g, ""))}
                                        placeholder="0"
                                        className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-primary"
                                    />
                                    {amountPaid && <button onClick={() => setAmountPaid("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={16} className="text-gray-400" /></button>}
                                </div>
                                <div className="flex gap-2 mb-3">
                                    {QUICK_AMOUNTS.map((a) => (
                                        <button key={a} onClick={() => setAmountPaid(String(a))} className="flex-1 border border-gray-200 rounded-lg py-2 text-xs font-medium text-gray-600 hover:border-primary hover:text-primary transition-colors">
                                            {a >= 1000 ? `${a / 1000}rb` : a}
                                        </button>
                                    ))}
                                </div>
                                {amountPaid && (
                                    <div className="flex justify-between mb-3 bg-green-50 rounded-xl p-3">
                                        <span className="text-sm text-gray-600">Kembalian</span>
                                        <span className={cn("text-sm font-bold", change >= 0 ? "text-green-600" : "text-red-600")}>{formatRupiah(Math.max(0, change))}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 mb-4">
                                    <input type="checkbox" id="print" checked={printReceipt} onChange={(e) => setPrintReceipt(e.target.checked)} className="w-4 h-4 accent-primary" />
                                    <label htmlFor="print" className="text-sm text-gray-600">Cetak Struk</label>
                                </div>
                                <button
                                    onClick={handleConfirmPayment}
                                    disabled={true}
                                    className="w-full bg-primary text-white font-semibold py-4 rounded-2xl text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                                >
                                    {true ? "Memproses..." : `Konfirmasi Pembayaran  ${formatRupiah(100000)}`}
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}

                        {/* QRIS */}
                        {paymentMethod === "QRIS" && (
                            <div className="px-4 pb-6 border-t pt-3">
                                <div className="flex gap-4 bg-gray-50 rounded-2xl p-4 mb-4">
                                    <div className="flex-1">
                                        <div className="text-primary font-bold text-sm mb-1">QRIS</div>
                                        <div className="text-xs text-gray-500 mb-3">Scan kode QR berikut menggunakan aplikasi pembayaran Anda</div>
                                        <div className="text-sm text-gray-600">Sisa Waktu</div>
                                        <div className="text-2xl font-bold text-gray-800">{formatQrisTime()}</div>
                                    </div>
                                    <div className="w-28 h-28 bg-white border border-gray-200 rounded-xl flex items-center justify-center">
                                        <div className="text-xs text-gray-400 text-center">QR Code</div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 text-center mb-4">Minta pelanggan untuk scan QR menggunakan aplikasi e-wallet / m-banking</div>
                                <button onClick={() => setPaymentOpen(false)} className="w-full border-2 border-gray-200 text-gray-600 font-medium py-3 rounded-2xl text-sm">
                                    Batalkan Pembayaran
                                </button>
                            </div>
                        )}

                        {/* E-Wallet */}
                        {paymentMethod === "E-Wallet" && (
                            <div className="px-4 pb-6 border-t pt-3">
                                <div className="text-sm font-medium text-gray-700 mb-3">Pilih E-Wallet</div>
                                {["GoPay", "OVO", "DANA", "ShopeePay", "LinkAja"].map((w) => (
                                    <button key={w} className="w-full border border-gray-200 rounded-xl py-3 px-4 flex items-center gap-3 mb-2 hover:border-primary transition-colors">
                                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-xs font-bold text-primary">{w[0]}</div>
                                        <span className="text-sm font-medium text-gray-700">{w}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Transfer Bank */}
                        {paymentMethod === "Transfer Bank" && (
                            <div className="px-4 pb-6 border-t pt-3">
                                <div className="text-sm font-medium text-gray-700 mb-3">Pilih Bank</div>
                                {["BCA", "BNI", "BRI", "Mandiri", "CIMB"].map((b) => (
                                    <button key={b} className="w-full border border-gray-200 rounded-xl py-3 px-4 flex items-center gap-3 mb-2 hover:border-primary transition-colors">
                                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-xs font-bold text-primary">{b[0]}</div>
                                        <span className="text-sm font-medium text-gray-700">Bank {b}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Debit/EDC */}
                        {paymentMethod === "Debit / EDC" && (
                            <div className="px-4 pb-6 border-t pt-3">
                                <div className="text-sm font-medium text-gray-700 mb-3">Pilih Mesin EDC</div>
                                {["EDC BCA", "EDC Mandiri", "EDC BNI"].map((e) => (
                                    <button key={e} className="w-full border border-gray-200 rounded-xl py-3 px-4 flex items-center gap-3 mb-2 hover:border-primary transition-colors">
                                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-xs font-bold text-primary">E</div>
                                        <span className="text-sm font-medium text-gray-700">{e}</span>
                                    </button>
                                ))}
                                <button onClick={handleConfirmPayment} disabled={true} className="w-full bg-primary text-white font-semibold py-4 rounded-2xl text-sm mt-4">
                                    {true ? "Memproses..." : "Konfirmasi Transaksi"}
                                </button>
                            </div>
                        )}

                        {/* Other methods */}
                        {paymentMethod === "Lainnya" && (
                            <div className="px-4 pb-6 border-t pt-3">
                                <button onClick={handleConfirmPayment} disabled={true} className="w-full bg-primary text-white font-semibold py-4 rounded-2xl text-sm">
                                    {false ? "Memproses..." : "Konfirmasi Pembayaran"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Payment success toast */}
            {paymentSuccess && (
                <div className="fixed top-6 left-0 right-0 mx-auto max-w-[390px] px-4 z-50">
                    <div className="bg-green-600 text-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg">
                        <CheckCircle size={20} />
                        <span className="font-medium text-sm">Pembayaran berhasil!</span>
                    </div>
                </div>
            )}


            {scannerOpen && (
                <div className="fixed inset-0 z-50 bg-black">

                    {/* Kamera */}
                    <BarcodeScanner
                        onScan={(barcode) => {
                            const now = Date.now();

                            if (
                                barcode === lastBarcode.current &&
                                now - lastScanTime.current < 500
                            ) {
                                return;
                            }

                            lastBarcode.current = barcode;
                            lastScanTime.current = now;

                            const product = allProducts.find(
                                p => p.barcode === barcode
                            );

                            if (!product) {
                                // setScanMessage("❌ Barcode tidak ditemukan");
                                return;
                            }

                            playBeep();

                            addToCart(product);
                            // setScanMessage(`✅ ${product.name} ditambahkan`);
                            console.log(product)

                            setTimeout(() => {
                                // setScanMessage("");
                            }, 1000);
                        }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 flex flex-col">

                        {/* Header */}
                        <div className="flex items-center justify-between p-6 text-white z-20">

                            <button
                                onClick={() => setScannerOpen(false)}
                                className="bg-black/40 backdrop-blur-md rounded-full p-3"
                            >
                                ✕
                            </button>

                            <h2 className="font-semibold text-lg">
                                Scan Barcode
                            </h2>

                            <div className="w-12" />

                        </div>

                        {/* Scanner */}
                        <div className="flex-1 flex items-center justify-center">

                            <div className="relative w-80 h-44">

                                {/* Shadow Atas */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-screen h-screen bg-black/60" />

                                {/* Shadow Bawah */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-screen h-screen bg-black/60" />

                                {/* Shadow Kiri */}
                                <div className="absolute right-full top-0 w-screen h-full bg-black/60" />

                                {/* Shadow Kanan */}
                                <div className="absolute left-full top-0 w-screen h-full bg-black/60" />

                                {/* Sudut */}
                                <div className="absolute inset-0">

                                    <span className="absolute left-0 top-0 w-8 h-8 border-l-4 border-t-4 border-green-400 rounded-tl-xl" />

                                    <span className="absolute right-0 top-0 w-8 h-8 border-r-4 border-t-4 border-green-400 rounded-tr-xl" />

                                    <span className="absolute left-0 bottom-0 w-8 h-8 border-l-4 border-b-4 border-green-400 rounded-bl-xl" />

                                    <span className="absolute right-0 bottom-0 w-8 h-8 border-r-4 border-b-4 border-green-400 rounded-br-xl" />

                                </div>
                                {/* <div className="absolute inset-0 rounded-xl border border-green-400 shadow-[0_0_30px_rgba(74,222,128,.6)]" /> */}

                                {/* Laser */}
                                <div className="absolute left-3 right-3 top-1/2 h-1 rounded-full bg-red-500 scanner-line shadow-[0_0_15px_red]" />
                            </div>

                        </div>

                        {/* Footer */}
                        {/* <div className="pb-10 px-8 text-center text-white space-y-5">

                             <p className="text-sm text-white/90">
                                {scanMessage}
                            </p>

                            <p className="text-sm text-white/90">
                                Arahkan barcode ke dalam area pemindaian
                            </p>

                            <div className="flex justify-center gap-4">

                                <button className="bg-white/20 backdrop-blur-md rounded-full px-5 py-3">
                                    🔦 Flash
                                </button>

                                <button
                                    onClick={() => setScannerOpen(false)}
                                    className="bg-red-500 rounded-full px-5 py-3"
                                >
                                    Tutup
                                </button>

                            </div>
                        </div> */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
                            <div className="relative bg-white rounded-t-3xl max-h-[80vh] flex flex-col">
                                <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4" />
                                <div className="flex items-center justify-between px-4 pb-3 border-b">
                                    <span className="font-bold text-gray-800">Keranjang</span>
                                </div>
                                <div className="flex-1 overflow-y-auto px-4 py-3">
                                    {items.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center">

                                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                                                <ShoppingCart
                                                    size={40}
                                                    className="text-gray-400"
                                                    strokeWidth={1.5}
                                                />
                                            </div>

                                            <h3 className="mt-5 text-lg font-semibold text-gray-700">
                                                Keranjang Kosong
                                            </h3>

                                            <p className="mt-2 text-sm text-gray-400 max-w-xs">
                                                Mulai scan barcode untuk menambahkan produk ke keranjang.
                                            </p>

                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {items.map((item) => (
                                                <div
                                                    key={item.product.id}
                                                    className="flex items-center gap-3"
                                                >
                                                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                                                        {item.product.imageUrl ? (
                                                            <img
                                                                src={item.product.imageUrl}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            item.product.name[0]
                                                        )}
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium text-gray-800 truncate">
                                                            {item.product.name}
                                                        </div>
                                                        <div className="text-primary text-sm font-bold">
                                                            {formatRupiah(item.product.price)}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(item.product.id, item.quantity - 1)
                                                            }
                                                            className="bg-gray-100 rounded-lg p-1"
                                                        >
                                                            <Minus size={14} />
                                                        </button>

                                                        <span className="text-sm font-bold w-6 text-center">
                                                            {item.quantity}
                                                        </span>

                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(item.product.id, item.quantity + 1)
                                                            }
                                                            className="bg-primary text-white rounded-lg p-1"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="px-4 pb-4 pt-3 border-t">
                                    <div className="flex justify-between mb-4">
                                        <span className="text-gray-600 font-medium">Total</span>
                                        <span className="font-bold text-gray-800 text-lg">{formatRupiah(totalPrice)}</span>
                                    </div>
                                    <button onClick={openPayment} className="w-full bg-primary text-white font-semibold py-4 rounded-2xl text-sm">
                                        Bayar Sekarang
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            )}

            <DrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        </Layout>
    );
}