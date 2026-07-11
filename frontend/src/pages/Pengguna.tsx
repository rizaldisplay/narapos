import { User, Store, Printer, Shield, Tag, Users, Database, RefreshCw, Bell, Lock, Palette, Globe, HelpCircle, Info, LogOut, ChevronRight, Upload, Clock, ShoppingCart, TrendingUp, BarChart2 } from "lucide-react";
import { cn } from "../lib/utils";
import { formatRupiah } from "../lib/format";
import { profile, outlet, summary } from "../mock/accountData";
import Layout from "../components/Layout";

const SETTINGS_ITEMS = [
  { icon: User, label: "Profil Saya", desc: "Kelola informasi profil Anda" },
  { icon: Store, label: "Outlet Saya", desc: "Kelola outlet dan informasi bisnis" },
  { icon: Printer, label: "Printer & Perangkat", desc: "Kelola printer, scanner, dan perangkat" },
  { icon: Tag, label: "Pengaturan Pajak", desc: "Kelola pajak dan tarif" },
  { icon: BarChart2, label: "Diskon & Promo", desc: "Kelola diskon, promo dan voucher" },
  { icon: Users, label: "Pelanggan", desc: "Kelola data pelanggan" },
  { icon: Database, label: "Backup & Restore", desc: "Backup dan restore data" },
  { icon: RefreshCw, label: "Sinkronisasi Data", desc: "Sinkronisasi data ke cloud" },
  { icon: Bell, label: "Notifikasi", desc: "Pengaturan notifikasi" },
  { icon: Lock, label: "Keamanan", desc: "Ubah PIN & keamanan akun" },
  { icon: Palette, label: "Tema Aplikasi", desc: "Atur tampilan aplikasi" },
  { icon: Globe, label: "Bahasa", desc: "Bahasa aplikasi" },
  { icon: HelpCircle, label: "Bantuan", desc: "Pusat bantuan & panduan" },
  { icon: Info, label: "Tentang Aplikasi", desc: "Informasi versi aplikasi", extra: "v2.5.1" },
];

export default function AkunPage() {
  const avgPerTx = summary?.totalTransactions
    ? Math.round((summary?.totalSales ?? 0) / summary.totalTransactions)
    : 0;

  return (
    <Layout>
      {/* Header */}
      <div className="bg-primary px-4 pb-4" style={{ paddingTop: "max(12px, env(safe-area-inset-top, 0px))" }}>
        <h1 className="text-white font-bold text-xl">Akun</h1>
        <p className="text-blue-200 text-xs mt-0.5">Kelola akun dan pengaturan aplikasi</p>
      </div>

      <div className="bg-gray-50 flex-1 overflow-y-auto pb-20">
        {/* Profile card */}
        <div className="bg-white mx-4 mt-3 rounded-2xl shadow-sm p-4 mb-3">
          {/* Top row: avatar + profile info */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative shrink-0">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center overflow-hidden">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} className="w-full h-full object-cover" alt="avatar" />
                ) : (
                  <span className="text-xl font-bold text-primary">{profile?.name?.[0] ?? "A"}</span>
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-800 text-base truncate">{profile?.name ?? "Andi Pratama"}</div>
              <div className="inline-block bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5">
                {profile?.role ?? "Kasir"}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{profile?.role ?? "Kasir"} · Shift {profile?.shift ?? "Pagi"}</div>
            </div>
          </div>
          {/* Profile details */}
          <div className="text-xs text-gray-500 mb-0.5">{profile?.email ?? "andi.pratama@narapos.com"}</div>
          <div className="text-xs text-gray-500 mb-3">{profile?.phone ?? "0812 3456 7890"}</div>
          {/* Outlet info row */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Store size={14} className="text-primary shrink-0" />
              <div>
                <div className="text-[10px] text-gray-400">Outlet Aktif</div>
                <div className="font-bold text-gray-800 text-xs">{outlet?.name ?? "NARAPOS STORE"}</div>
                <div className="text-[10px] text-gray-400 truncate max-w-[160px]">{outlet?.address}, {outlet?.city}</div>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300 shrink-0" />
          </div>
        </div>

        {/* Shift stats */}
        <div className="bg-white mx-4 rounded-2xl shadow-sm p-4 mb-3">
          <div className="grid grid-cols-4 gap-1">
            <div className="flex flex-col items-center text-center">
              <Clock size={16} className="text-primary mb-1" />
              <div className="font-bold text-gray-800 text-[11px] leading-tight">08:00</div>
              <div className="font-bold text-gray-800 text-[11px] leading-tight">- 17:00</div>
              <div className="text-[9px] text-gray-400 mt-0.5 leading-tight">Shift Hari Ini</div>
              <div className="text-[9px] text-primary font-medium">Pagi</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <ShoppingCart size={16} className="text-green-600 mb-1" />
              <div className="font-bold text-gray-800 text-sm">{summary?.totalTransactions ?? 0}</div>
              <div className="text-[9px] text-gray-400 mt-0.5 leading-tight">Transaksi</div>
              <div className="text-[9px] text-gray-400">Hari ini</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <TrendingUp size={16} className="text-orange-500 mb-1" />
              <div className="font-bold text-gray-800 text-[11px] leading-tight">{formatRupiah(summary?.totalSales ?? 0)}</div>
              <div className="text-[9px] text-gray-400 mt-0.5 leading-tight">Total Penjualan</div>
              <div className="text-[9px] text-gray-400">Hari ini</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <BarChart2 size={16} className="text-purple-600 mb-1" />
              <div className="font-bold text-gray-800 text-[11px] leading-tight">{formatRupiah(avgPerTx)}</div>
              <div className="text-[9px] text-gray-400 mt-0.5 leading-tight">Rata-rata</div>
              <div className="text-[9px] text-gray-400">/Transaksi</div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white mx-4 rounded-2xl shadow-sm p-4 mb-3">
          <div className="font-semibold text-gray-800 text-sm mb-3">Pengaturan & Preferensi</div>
          <div className="space-y-0.5">
            {SETTINGS_ITEMS.map((s) => {
              const Icon = s.icon;
              return (
                <button key={s.label} className="w-full flex items-center gap-3 py-2.5 px-2 text-left hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-700 truncate">{s.label}</div>
                    <div className="text-[10px] text-gray-400 truncate">{s.desc}</div>
                    {s.extra && <div className="text-[10px] text-primary font-semibold">{s.extra}</div>}
                  </div>
                  <ChevronRight size={16} className="text-gray-300 shrink-0" />
                </button>
              );
            })}
            {/* Logout */}
            <button className="w-full flex items-center gap-3 py-2.5 px-2 text-left hover:bg-red-50 rounded-xl transition-colors">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                <LogOut size={15} className="text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-red-500">Keluar</div>
                <div className="text-[10px] text-red-300">Logout dari aplikasi</div>
              </div>
              <ChevronRight size={16} className="text-red-300 shrink-0" />
            </button>
          </div>
        </div>

        {/* Sync status */}
        <div className="bg-white mx-4 rounded-2xl shadow-sm p-4 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
            <Upload size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-800 text-sm">Sinkronisasi Otomatis Aktif</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Terakhir: 02 Juli 2026, 09:30 WIB</div>
          </div>
          <div className="flex flex-col gap-1.5 shrink-0">
            <div className="flex items-center gap-1 bg-green-50 border border-green-200 rounded-lg px-2 py-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span className="text-[10px] font-semibold text-green-600">Tersinkronisasi</span>
            </div>
            <button className="flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1">
              <RefreshCw size={10} className="text-gray-500" />
              <span className="text-[10px] text-gray-600">Sinkronisasi</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
