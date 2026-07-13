import { type FC, useState } from "react"
import { X } from "lucide-react"

interface FilterSheetProps {
    open: boolean;
    onClose: () => void;
}

const statusList = ["Semua", "Aktif", "Tidak Aktif"];

const stockList = [
    "Semua",
    "Stok Aman",
    "Stok Menipis",
    "Stok Habis"
];

const FilterSheet: FC<FilterSheetProps> = ({
    open,
    onClose
}) => {
    if(!open) return null;
    
    const [selectedStatus, setSelectedStatus] = useState("Semua");
    const [selectedStock, setSelectedStock] = useState("Semua");

    return(
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 z-40 bg-black/40"
            />


            {/* Bottom Sheet */}
            <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white p-5 animate-slide-up">
                <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-gray-300"/>
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-bold">Filter Produk</h2>
                    <button onClick={onClose}>
                        <X size={22} />
                    </button>
                </div>

                {/* Status */}
                <div className="mb-6">
                    <h3 className="mb-3 font-semibold">
                        Status
                    </h3>

                    <div className="flex flex-wrap gap-2">
                        {statusList.map((item) => (
                            <button
                                key={item}
                                onClick={() => setSelectedStatus(item)}
                                className={`rounded-full px-4 py-2 transition-colors ${
                                    selectedStatus === item
                                        ? "bg-blue-600 text-white border border-blue-600"
                                        : "border border-gray-300 bg-white text-gray-700"
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Kondisi Stok */}
                <div className="mb-6">
                    <h3 className="mb-3 font-semibold">
                        Kondisi Stok
                    </h3>

                    <div className="flex flex-wrap gap-2">
                        {stockList.map((item) => (
                            <button
                                key={item}
                                onClick={() => setSelectedStock(item)}
                                className={`rounded-full px-4 py-2 transition-colors ${
                                    selectedStock === item
                                        ? "bg-blue-600 text-white border border-blue-600"
                                        : "border border-gray-300 bg-white text-gray-700"
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Harga */}
                <div className="mb-6">
                    <h3 className="mb-3 font-semibold">
                        Rentang Harga
                    </h3>

                    <div className="flex gap-3">
                        <input 
                            type="number"
                            placeholder="Minimum"
                            className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                         <input 
                            type="number"
                            placeholder="Maksimum"
                            className="w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3">
                    <button className="w-1/2 rounded-xl border py-3 font-semibold">
                        Reset
                    </button>
                    <button className="w-1/2 rounded-xl bg-blue-600 py-3 font-semibold text-white">
                        Terapkan
                    </button>
                </div>
            </div>
        </>
    );
};

export default FilterSheet;