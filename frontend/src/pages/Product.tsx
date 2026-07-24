import { useState, useRef } from "react";
import { Plus, Search, Filter, MoreHorizontal, Download, Upload, ScanLine, Trash2, Edit, Package, AlertTriangle, X, Camera, ImagePlus } from "lucide-react";
import { cn } from "../lib/utils";
import { formatRupiah } from "../lib/format";
// import { useListProducts, useListCategories, useGetProductStats, useDeleteProduct, useCreateProduct, useUpdateProduct, getListProductsQueryKey, getGetProductStatsQueryKey } from "@workspace/api-client-react";
import Layout from "../components/Layout";
import FilterButton from "../components/FilterButton";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function uploadImage(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch(`${BASE}/api/uploads/product-image`, { method: "POST", body: fd });
    if (!res.ok) throw new Error("Upload gagal");
    const json = await res.json() as { url: string };
    return json.url;
}

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

interface Stats {
    total: number,
    lowStock: number,
    outOfStock: number,
    inactive: number,
}

const stats: Stats = {
    total: 12,
    lowStock: 1,
    outOfStock: 0,
    inactive: 0,
};

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

export default function ProdukPage() {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editProduct, setEditProduct] = useState<unknown>(null);
    const [menuOpen, setMenuOpen] = useState<number | null>(null);
    const [form, setForm] = useState({
        name: "", sku: "", price: "", costPrice: "", stock: "",
        categoryId: "", barcode: "", isActive: true, imageUrl: null as string | null,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading] = useState(false);

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

    //   const deleteProduct = useDeleteProduct();
    //   const createProduct = useCreateProduct();
    //   const updateProduct = useUpdateProduct();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async function handleDelete(_id: number) {
        // await deleteProduct.mutateAsync({ id });
        // queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        // queryClient.invalidateQueries({ queryKey: getGetProductStatsQueryKey() });
        setMenuOpen(null);
    }

    function openCreate() {
        setForm({ name: "", sku: "", price: "", costPrice: "", stock: "", categoryId: String(categories[0]?.id ?? ""), barcode: "", isActive: true, imageUrl: null });
        setImagePreview(null);
        setEditProduct(null);
        setShowForm(true);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function openEdit(product: any) {
        setForm({ name: product.name, sku: product.sku ?? "", price: String(product.price), costPrice: String(product.costPrice), stock: String(product.stock), categoryId: String(product.categoryId), barcode: product.barcode ?? "", isActive: product.isActive, imageUrl: product.imageUrl ?? null });
        setImagePreview(product.imageUrl ?? null);
        setEditProduct(product);
        setShowForm(true);
        setMenuOpen(null);
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const localPreview = URL.createObjectURL(file);
        setImagePreview(localPreview);
        setUploading(true);
        try {
            const url = await uploadImage(file);
            setForm((prev) => ({ ...prev, imageUrl: url }));
        } catch {
            setImagePreview(null);
            setForm((prev) => ({ ...prev, imageUrl: null }));
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    function removeImage() {
        setImagePreview(null);
        setForm((prev) => ({ ...prev, imageUrl: null }));
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    async function handleSubmit() {
        if (editProduct) {
            //   await updateProduct.mutateAsync({ id: editProduct.id, data });
        } else {
            //   await createProduct.mutateAsync({ data });
        }
        // queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        // queryClient.invalidateQueries({ queryKey: getGetProductStatsQueryKey() });
        setShowForm(false);
    }

    const statCards = [
        { label: "Total Produk", value: stats?.total ?? 0, color: "text-primary", bg: "bg-blue-50", icon: Package },
        { label: "Stok Menipis", value: stats?.lowStock ?? 0, color: "text-orange-500", bg: "bg-orange-50", icon: AlertTriangle },
        { label: "Stok Habis", value: stats?.outOfStock ?? 0, color: "text-red-500", bg: "bg-red-50", icon: X },
        { label: "Tidak Aktif", value: stats?.inactive ?? 0, color: "text-purple-500", bg: "bg-purple-50", icon: Filter },
    ];

    return (
        <Layout>
            {/* Header */}
            <div className="bg-primary px-4 pb-4" style={{ paddingTop: "max(12px, env(safe-area-inset-top, 0px))" }}>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-white font-bold text-xl">Produk</h1>
                        <p className="text-blue-200 text-xs mt-0.5">Kelola semua produk Anda</p>
                    </div>
                    <button onClick={openCreate} className="bg-white text-primary font-semibold text-sm px-3 py-2 rounded-xl flex items-center gap-1.5">
                        <Plus size={16} /> Tambah Produk
                    </button>
                </div>
            </div>

            <div className="bg-gray-50 flex-1 overflow-y-auto pb-24">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 px-4 mt-4 mb-4">
                    {statCards.map((s) => {
                        const Icon = s.icon;

                        return (
                            <div
                                key={s.label}
                                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-95 transition-all"
                            >
                                <div className="flex items-center justify-between">

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            {s.label}
                                        </p>

                                        <h2 className={cn("text-2xl font-bold mt-1", s.color)}>
                                            {s.value}
                                        </h2>
                                    </div>

                                    <div
                                        className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center",
                                            s.bg
                                        )}
                                    >
                                        <Icon
                                            size={22}
                                            className={s.color}
                                        />
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Search + filter */}
                <div className="px-4 mb-3 flex gap-2">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari produk / SKU / Barcode..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl py-2.5 pl-8 pr-3 text-sm outline-none focus:border-primary bg-white"
                        />
                    </div>
                     <FilterButton />
                </div>

                {/* Category chips */}
                <div className="px-4 mb-3 overflow-x-auto flex gap-2 scrollbar-none">
                    <button onClick={() => setSelectedCategory(null)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors", selectedCategory === null ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-600")}>
                        Semua
                    </button>
                    {categories.map((cat) => (
                        <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors", selectedCategory === cat.id ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-600")}>
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Products count header */}
                <div className="px-4 flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Semua Produk ({products.length})</span>
                    <button className="text-xs text-gray-500">Urutkan Terbaru</button>
                </div>

                {/* Product list */}
                <div className="px-4 space-y-2">
                    {isLoading && <div className="text-center py-8 text-gray-400 text-sm">Memuat...</div>}
                    {products.map((product) => (
                        <div key={product.id} className="bg-white rounded-2xl p-3 flex gap-3 relative">
                            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                                {product.imageUrl
                                    ? <img src={product.imageUrl.startsWith("/api/") ? product.imageUrl : product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
                                    : <div className="text-lg font-bold text-primary">{product.name[0]}</div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-800 truncate">{product.name}</div>
                                <div className="text-[10px] text-gray-400">SKU: {"-"}</div>
                                <div className="text-[10px] text-gray-400">{product.categoryName}</div>
                                <div className="text-[10px] text-gray-400 font-mono">{product.barcode || "-"}</div>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                                <div className="text-primary font-bold text-sm">{formatRupiah(product.price)}</div>
                                <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", product.stock > 10 ? "bg-green-100 text-green-700" : product.stock > 0 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700")}>
                                    Stok {product.stock}
                                </span>
                                <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", product.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500")}>
                                    {product.isActive ? "Aktif" : "Nonaktif"}
                                </span>
                            </div>
                            <div className="relative">
                                <button onClick={() => setMenuOpen(menuOpen === product.id ? null : product.id)} className="p-1 text-gray-400">
                                    <MoreHorizontal size={16} />
                                </button>
                                {menuOpen === product.id && (
                                    <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-100 z-20 w-36 overflow-hidden">
                                        <button onClick={() => openEdit(product)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 w-full hover:bg-gray-50">
                                            <Edit size={14} /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-red-500 w-full hover:bg-red-50">
                                            <Trash2 size={14} /> Hapus
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom actions */}
            <div className="fixed bottom-16 left-0 right-0 mx-auto max-w-107.5 bg-white border-t border-gray-100 px-4 py-3 flex gap-2">
                <button className="flex-1 border border-gray-200 rounded-xl py-2.5 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600">
                    <Download size={14} /> Import Excel
                </button>
                <button className="flex-1 border border-gray-200 rounded-xl py-2.5 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600">
                    <Upload size={14} /> Export Excel
                </button>
                <button className="flex-1 border border-gray-200 rounded-xl py-2.5 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600">
                    <ScanLine size={14} /> Scan Barcode
                </button>
            </div>

            {/* Add/Edit form bottom sheet */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
                    <div className="relative bg-white rounded-t-3xl max-h-[92vh] flex flex-col">
                        {/* Handle + title */}
                        <div className="shrink-0 px-4 pt-3 pb-3 border-b border-gray-100">
                            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3" />
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-800 text-base">{editProduct ? "Edit Produk" : "Tambah Produk"}</span>
                                <button onClick={() => setShowForm(false)} className="p-1 text-gray-400 hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable form content */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

                            {/* Image upload area */}
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-2 block">Foto Produk</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />

                                {imagePreview ? (
                                    <div className="relative w-full aspect-square max-h-48 rounded-2xl overflow-hidden bg-gray-100">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        {uploading && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <div className="text-white text-sm font-medium">Mengupload...</div>
                                            </div>
                                        )}
                                        {!uploading && (
                                            <div className="absolute top-2 right-2 flex gap-2">
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow"
                                                >
                                                    <Camera size={14} className="text-white" />
                                                </button>
                                                <button
                                                    onClick={removeImage}
                                                    className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center shadow"
                                                >
                                                    <X size={14} className="text-white" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-8 flex flex-col items-center gap-2 hover:border-primary hover:bg-blue-50/50 transition-colors"
                                    >
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                            <ImagePlus size={22} className="text-gray-400" />
                                        </div>
                                        <div className="text-sm font-medium text-gray-500">Ketuk untuk pilih foto</div>
                                        <div className="text-xs text-gray-400">JPG, PNG, WebP • Maks 5MB</div>
                                    </button>
                                )}
                            </div>

                            {/* Text fields */}
                            {[
                                { key: "name", label: "Nama Produk", placeholder: "Nama produk" },
                                { key: "sku", label: "SKU", placeholder: "SKU001" },
                                { key: "price", label: "Harga Jual (Rp)", placeholder: "0", type: "number" },
                                { key: "costPrice", label: "Harga Modal (Rp)", placeholder: "0", type: "number" },
                                { key: "stock", label: "Stok", placeholder: "0", type: "number" },
                                { key: "barcode", label: "Barcode", placeholder: "8992759100000" },
                            ].map((f) => (
                                <div key={f.key}>
                                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{f.label}</label>
                                    <input
                                        type={f.type || "text"}
                                        inputMode={f.type === "number" ? "numeric" : undefined}
                                        placeholder={f.placeholder}
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        value={(form as any)[f.key]}
                                        onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl py-3 px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                                    />
                                </div>
                            ))}

                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Kategori</label>
                                <select
                                    value={form.categoryId}
                                    onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-xl py-3 px-3 text-sm outline-none focus:border-primary bg-white"
                                >
                                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="flex items-center justify-between py-1">
                                <div>
                                    <div className="text-sm font-medium text-gray-700">Status Aktif</div>
                                    <div className="text-xs text-gray-400">Produk tampil di kasir</div>
                                </div>
                                <button
                                    onClick={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                                    className={cn("w-12 h-6 rounded-full transition-colors", form.isActive ? "bg-primary" : "bg-gray-300")}
                                >
                                    <div className={cn("w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5", form.isActive ? "translate-x-6" : "translate-x-0")} />
                                </button>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={uploading}
                                className="w-full bg-primary text-white font-semibold py-4 rounded-2xl text-sm disabled:opacity-60"
                            >
                                {uploading ? "Mengupload foto..." : editProduct ? "Simpan Perubahan" : "Tambah Produk"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
