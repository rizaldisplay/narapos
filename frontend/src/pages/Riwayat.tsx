import { useState } from "react";
import { Search, ChevronRight, X, Printer, RefreshCw, MessageCircle, Mail, CheckCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { formatRupiah, formatDate, formatTime } from "../lib/format";
import Layout from "../components/Layout";

const PERIODS = [
  { label: "Hari Ini", value: "today" },
  { label: "Kemarin", value: "yesterday" },
  { label: "7 Hari", value: "7days" },
  { label: "Bulan Ini", value: "thisMonth" },
];

const PAYMENT_FILTERS = ["Semua", "Tunai", "QRIS", "Transfer Bank", "Debit / EDC", "E-Wallet"];

interface TransactionItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Transaction {
  id: number;
  invoiceNumber: string;
  createdAt: string;
  paymentMethod: string;
  cashierName: string;
  total: number;
  status: "Selesai" | "Refund";
  items: TransactionItem[];
}

const isLoading = false;

const transactions: Transaction[] = [
  {
    id: 1,
    invoiceNumber: "TRX-202507180001",
    createdAt: "2025-07-18T09:30:00",
    paymentMethod: "QRIS",
    cashierName: "Admin",
    total: 28500,
    status: "Selesai",
    items: [
      {
        productId: 1,
        productName: "Indomie Goreng",
        quantity: 2,
        price: 3500,
        subtotal: 7000,
      },
      {
        productId: 2,
        productName: "Aqua 600ml",
        quantity: 3,
        price: 4000,
        subtotal: 12000,
      },
      {
        productId: 3,
        productName: "Teh Botol",
        quantity: 1,
        price: 9500,
        subtotal: 9500,
      },
    ],
  },
  {
    id: 2,
    invoiceNumber: "TRX-202507180002",
    createdAt: "2025-07-18T10:15:00",
    paymentMethod: "Tunai",
    cashierName: "Admin",
    total: 15000,
    status: "Selesai",
    items: [
      {
        productId: 4,
        productName: "SilverQueen",
        quantity: 2,
        price: 7500,
        subtotal: 15000,
      },
    ],
  },
  {
    id: 3,
    invoiceNumber: "TRX-202507180003",
    createdAt: "2025-07-18T11:20:00",
    paymentMethod: "Debit / EDC",
    cashierName: "Admin",
    total: 42000,
    status: "Refund",
    items: [
      {
        productId: 5,
        productName: "Susu Ultra",
        quantity: 4,
        price: 10500,
        subtotal: 42000,
      },
    ],
  },
];



export default function RiwayatPage() {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("today");
  const [paymentFilter, setPaymentFilter] = useState("Semua");
  const [selectedTxId, setSelectedTxId] = useState<number | null>(null);

  const selectedTx =
  transactions.find((tx) => tx.id === selectedTxId) ?? null;

  const filteredTransactions = transactions.filter((tx) => {
  const matchSearch =
    tx.invoiceNumber.toLowerCase().includes(search.toLowerCase());

  const matchPayment =
    paymentFilter === "Semua" ||
    tx.paymentMethod === paymentFilter;

  return matchSearch && matchPayment;
});

  async function handleRefund(id: number) {
    // await refundTransaction.mutateAsync({ id });
    // queryClient.invalidateQueries({ queryKey: getListTransactionsQueryKey() });
    setSelectedTxId(null);
  }

  const paymentIcon: Record<string, string> = {
    "Tunai": "💵",
    "QRIS": "📱",
    "Transfer Bank": "🏦",
    "Debit / EDC": "💳",
    "E-Wallet": "👛",
    "Lainnya": "•••",
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-primary px-4 pb-4" style={{ paddingTop: "max(12px, env(safe-area-inset-top, 0px))" }}>
        <h1 className="text-white font-bold text-xl mb-3">Riwayat Transaksi</h1>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nomor transaksi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white rounded-xl py-3 pl-9 pr-4 text-sm text-gray-700 outline-none"
          />
        </div>
      </div>

      <div className="bg-gray-50 flex-1 overflow-y-auto pb-20">
        {/* Period filter */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 overflow-x-auto flex gap-2 scrollbar-none">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={cn("px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors", period === p.value ? "bg-primary text-white" : "bg-gray-100 text-gray-600")}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Payment method filter */}
        <div className="px-4 py-2 overflow-x-auto flex gap-2 scrollbar-none bg-white border-b border-gray-100">
          {PAYMENT_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setPaymentFilter(f)}
              className={cn("px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors", paymentFilter === f ? "bg-primary/10 border-primary text-primary" : "border-gray-200 text-gray-500")}
            >
              {f !== "Semua" && paymentIcon[f]} {f}
            </button>
          ))}
        </div>

        {/* Transactions */}
        <div className="px-4 pt-3 space-y-2">
          {isLoading && <div className="text-center py-8 text-gray-400 text-sm">Memuat...</div>}
          {transactions.length === 0 && !isLoading && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm">Belum ada transaksi</p>
            </div>
          )}
          {filteredTransactions.map((tx) => (
            <button
              key={tx.id}
              onClick={() => setSelectedTxId(tx.id)}
              className="w-full bg-white rounded-2xl p-4 flex items-center justify-between text-left shadow-sm"
            >
              <div className="flex-1">
                <div className="font-bold text-gray-800 text-sm">{tx.invoiceNumber}</div>
                <div className="text-xs text-gray-400 mt-0.5">{formatDate(tx.createdAt)} · {formatTime(tx.createdAt)}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{paymentIcon[tx.paymentMethod] ?? ""} {tx.paymentMethod}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="font-bold text-gray-800">{formatRupiah(tx.total)}</div>
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", tx.status === "Selesai" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                  {tx.status}
                </span>
              </div>
              <ChevronRight size={16} className="text-gray-300 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Transaction detail sheet */}
      {selectedTxId && selectedTx && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedTxId(null)} />
          <div className="relative bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-4" />
            <div className="flex items-center justify-between px-4 pb-3 border-b">
              <div>
                <div className="font-bold text-gray-800">{selectedTx.invoiceNumber}</div>
                <div className="text-xs text-gray-400">{formatDate(selectedTx.createdAt)}</div>
              </div>
              <button onClick={() => setSelectedTxId(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="px-4 py-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Kasir</span>
                <span className="text-sm font-medium">{selectedTx.cashierName}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-sm text-gray-500">Pembayaran</span>
                <span className="text-sm font-medium">{selectedTx.paymentMethod}</span>
              </div>
              {/* Items */}
              <div className="bg-gray-50 rounded-xl p-3 mb-3">
                {selectedTx.items?.map((item, i) => (
                  <div key={i} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
                    <div>
                      <div className="text-sm font-medium">{item.productName || `Produk #${item.productId}`}</div>
                      <div className="text-xs text-gray-400">{item.quantity}x {formatRupiah(item.price)}</div>
                    </div>
                    <div className="font-semibold text-sm">{formatRupiah(item.subtotal)}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-800 mb-4">
                <span>Total</span>
                <span>{formatRupiah(selectedTx.total)}</span>
              </div>
              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button className="border border-gray-200 rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm text-gray-700">
                  <Printer size={16} /> Cetak Ulang
                </button>
                <button
                  onClick={() => handleRefund(selectedTx.id)}
                  disabled={selectedTx.status === "Refund"}
                  className="border border-red-200 rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm text-red-500 disabled:opacity-40"
                >
                  <RefreshCw size={16} /> Refund
                </button>
                <button className="border border-gray-200 rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm text-gray-700">
                  <MessageCircle size={16} /> WhatsApp
                </button>
                <button className="border border-gray-200 rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm text-gray-700">
                  <Mail size={16} /> Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
