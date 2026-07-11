import { useState } from "react";
import { TrendingUp, ShoppingBag, Package, DollarSign, Calendar, ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";
import { formatRupiah } from "../lib/format";
import {
  summary,
  chartData,
  topProducts,
  paymentStats,
  cashierData,
} from "../mock/reportData";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import Layout from "../components/Layout";

const PERIODS = [
  { label: "Hari Ini", value: "today" },
  { label: "Kemarin", value: "yesterday" },
  { label: "7 Hari", value: "7days" },
  { label: "30 Hari", value: "30days" },
  { label: "Bulan Ini", value: "thisMonth" },
  { label: "Custom", value: "custom" },
];

const CHART_GROUPS = ["Harian", "Mingguan", "Bulanan"];
const CHART_MAP: Record<string, "daily" | "weekly" | "monthly"> = { Harian: "daily", Mingguan: "weekly", Bulanan: "monthly" };

const PIE_COLORS = ["#1B4FD8", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#6B7280"];

export default function LaporanPage() {
  const [period, setPeriod] = useState("today");
  const [chartGroup, setChartGroup] = useState("Harian");
  const salesChart = chartData[CHART_MAP[chartGroup]];

  const kpiCards = [
    {
      label: "Total Penjualan",
      value: formatRupiah(summary?.totalSales ?? 0),
      growth: summary?.salesGrowth ?? 0,
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-blue-50",
    },
    {
      label: "Total Transaksi",
      value: String(summary?.totalTransactions ?? 0),
      growth: summary?.transactionGrowth ?? 0,
      icon: ShoppingBag,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Produk Terjual",
      value: String(summary?.totalItemsSold ?? 0),
      growth: summary?.itemsGrowth ?? 0,
      icon: Package,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      label: "Laba Kotor",
      value: formatRupiah(summary?.grossProfit ?? 0),
      growth: summary?.profitGrowth ?? 0,
      icon: DollarSign,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

//   const paymentIconMap: Record<string, string> = { Tunai: "💵", QRIS: "📱", "Transfer Bank": "🏦", "Debit / EDC": "💳", "E-Wallet": "👛" };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-primary px-4 pb-4" style={{ paddingTop: "max(12px, env(safe-area-inset-top, 0px))" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white font-bold text-xl">Laporan</h1>
            <p className="text-blue-200 text-xs">Pantau performa bisnis Anda</p>
          </div>
          <button className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-3 py-2 rounded-xl">
            <Calendar size={14} />
            1 - 3 Juli 2026
            <ChevronDown size={12} />
          </button>
        </div>
        {/* Period tabs */}
        <div className="overflow-x-auto flex gap-1.5 scrollbar-none">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors", period === p.value ? "bg-white text-primary" : "bg-white/20 text-white")}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 flex-1 overflow-y-auto pb-24">
        {/* KPI Cards 2x2 */}
        <div className="grid grid-cols-2 gap-3 px-4 mt-4 mb-4">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            const isPositive = card.growth >= 0;
            return (
              <div key={card.label} className="bg-white rounded-2xl p-3 shadow-sm">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", card.bg)}>
                  <Icon size={16} className={card.color} />
                </div>
                <div className="font-bold text-gray-800 text-base leading-tight mb-0.5">{card.value}</div>
                <div className="text-xs text-gray-500 mb-1">{card.label}</div>
                <div className={cn("text-[10px] font-medium", isPositive ? "text-green-600" : "text-red-500")}>
                  {isPositive ? "+" : ""}{card.growth.toFixed(1)}% vs kemarin
                </div>
              </div>
            );
          })}
        </div>

        {/* Sales Chart */}
        <div className="bg-white mx-4 rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-gray-800 text-sm">Grafik Penjualan</span>
          </div>
          <div className="flex gap-1 mb-4">
            {CHART_GROUPS.map((g) => (
              <button
                key={g}
                onClick={() => setChartGroup(g)}
                className={cn("px-3 py-1 rounded-lg text-xs font-medium transition-colors", chartGroup === g ? "bg-primary text-white" : "bg-gray-100 text-gray-600")}
              >
                {g}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={salesChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B4FD8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1B4FD8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${v / 1000}K` : v} />
              <Tooltip formatter={(v) => [formatRupiah(v as number), "Penjualan"]} labelStyle={{ fontSize: 11 }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: 11 }} />
              <Area type="monotone" dataKey="value" stroke="#1B4FD8" strokeWidth={2.5} fill="url(#blueGrad)" dot={{ r: 3, fill: "#1B4FD8" }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products + Payment Methods */}
        <div className="flex gap-3 px-4 mb-4">
          {/* Top Products */}
          <div className="flex-1 bg-white rounded-2xl p-3 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-800 text-xs">Produk Terlaris</span>
              <button className="text-[10px] text-primary">Lihat Semua</button>
            </div>
            <div className="space-y-2">
              {topProducts.slice(0, 5).map((p, i) => (
                <div key={p.productId} className="flex items-center gap-2">
                  <span className={cn("w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white shrink-0", i === 0 ? "bg-yellow-400" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-orange-400" : "bg-gray-200 text-gray-600")}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-medium text-gray-700 truncate">{p.productName}</div>
                    <div className="text-[9px] text-gray-400">{p.quantitySold} Pcs</div>
                  </div>
                  <div className="text-[10px] font-semibold text-gray-700 shrink-0">{formatRupiah(p.revenue)}</div>
                </div>
              ))}
              {topProducts.length === 0 && <div className="text-[10px] text-gray-400 text-center py-2">Belum ada data</div>}
            </div>
          </div>

          {/* Payment methods donut */}
          <div className="w-40 bg-white rounded-2xl p-3 shadow-sm">
            <span className="font-semibold text-gray-800 text-xs block mb-2">Metode Pembayaran</span>
            {paymentStats.length > 0 ? (
              <>
                <div className="flex justify-center mb-2">
                  <PieChart width={90} height={90}>
                    <Pie data={paymentStats} cx={45} cy={45} innerRadius={25} outerRadius={40} dataKey="total" stroke="none">
                      {paymentStats.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                  </PieChart>
                </div>
                <div className="space-y-1">
                  {paymentStats.map((s, i) => (
                    <div key={s.method} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-[9px] text-gray-500 truncate">{s.method}</span>
                      <span className="text-[9px] font-semibold text-gray-700 ml-auto">{s.percentage.toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : <div className="text-[10px] text-gray-400 text-center py-4">Belum ada data</div>}
          </div>
        </div>

        {/* Cashier performance */}
        <div className="bg-white mx-4 rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-gray-800 text-sm">Ringkasan Penjualan per Kasir</span>
            <button className="text-xs text-primary">Lihat Semua</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100">
                  <th className="text-left pb-2 font-medium">Kasir</th>
                  <th className="text-right pb-2 font-medium">Transaksi</th>
                  <th className="text-right pb-2 font-medium">Penjualan</th>
                  <th className="text-right pb-2 font-medium text-green-600">Laba Kotor</th>
                </tr>
              </thead>
              <tbody>
                {cashierData.map((c) => (
                  <tr key={c.cashierId} className="border-b border-gray-50 last:border-0">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">{c.cashierName[0]}</div>
                        <span className="font-medium text-gray-700">{c.cashierName}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-right text-gray-600">{c.transactionCount}</td>
                    <td className="py-2.5 text-right text-gray-700 font-medium">{formatRupiah(c.totalSales)}</td>
                    <td className="py-2.5 text-right text-green-600 font-semibold">{formatRupiah(c.grossProfit)}</td>
                  </tr>
                ))}
                {cashierData.length === 0 && (
                  <tr><td colSpan={4} className="py-4 text-center text-gray-400">Belum ada data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
