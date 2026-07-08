import { useState } from "react";
import {
  X, ChevronRight, ChevronDown, LayoutDashboard, ShoppingCart, Package, Boxes,
  Receipt, Users, BarChart2, Settings, LogOut
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
// import { useGetProfile, useGetOutlet } from "@workspace/api-client-react";

type MenuItem = {
  icon: typeof LayoutDashboard;
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

const MENU_ITEMS: MenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/laporan" },
  { icon: ShoppingCart, label: "Kasir (POS)", href: "/" },
  {
    icon: Package,
    label: "Master Data",
    children: [
      { label: "Daftar Produk", href: "/produk" },
      { label: "Kategori Produk", href: "/produk" },
    ],
  },
  {
    icon: Boxes,
    label: "Manajemen Stok",
    children: [
      { label: "Stok Produk", href: "/produk" },
      { label: "Stok Menipis", href: "/produk" },
    ],
  },
  {
    icon: Receipt,
    label: "Transaksi",
    children: [
      { label: "Riwayat Transaksi", href: "/riwayat" },
      { label: "Refund", href: "/riwayat" },
    ],
  },
  {
    icon: Users,
    label: "Manajemen Pengguna",
    children: [
      { label: "Daftar Kasir", href: "/akun" },
      { label: "Role & Akses", href: "/akun" },
    ],
  },
  {
    icon: BarChart2,
    label: "Laporan",
    children: [
      { label: "Ringkasan Penjualan", href: "/laporan" },
      { label: "Performa Kasir", href: "/laporan" },
    ],
  },
  {
    icon: Settings,
    label: "Pengaturan",
    children: [
      { label: "Profil Saya", href: "/akun" },
      { label: "Outlet Saya", href: "/akun" },
      { label: "Printer & Perangkat", href: "/akun" },
    ],
  },
];

export default function DrawerMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation();
  const profile = null;
  const outlet = null;
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!open) return null;

  function isActive(item: MenuItem) {
    if (item.href) return location.pathname === item.href;
    return item.children?.some((c) => c.href === location.pathname) ?? false;
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[300px] max-w-[82%] bg-white h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 pb-3 shrink-0"
          style={{ paddingTop: "max(16px, env(safe-area-inset-top, 0px))" }}
        >
          <div className="flex items-center gap-2">
            <img src={`assets/images/logos/narapos-logo.png`} alt="Narapos" className="h-8 w-auto object-contain" />
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={20} />
          </button>
        </div>

        {/* Store selector card */}
        <div className="px-4 pb-3 shrink-0">
          <button className="w-full flex items-center gap-3 border border-gray-200 rounded-2xl px-3 py-2.5 shadow-sm">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">
                {(profile ?? "KA").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-sm font-bold text-gray-800 truncate">{outlet ?? "Narapos Store"}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                <span className="truncate">Outlet {outlet ?? "Cirebon"}</span>
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                <span className="text-green-600 font-medium">Online</span>
              </div>
            </div>
            <ChevronDown size={16} className="text-gray-300 shrink-0" />
          </button>
        </div>

        {/* Menu items */}
        <div className="flex-1 overflow-y-auto px-3 pb-2">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            const isOpen = expanded === item.label;

            if (!item.children) {
              return (
                <Link key={item.label} to={item.href!} onClick={onClose}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-colors mb-0.5",
                      active ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-50",
                    )}
                  >
                    <Icon size={18} className={active ? "text-primary" : "text-gray-400"} />
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                  </div>
                </Link>
              );
            }

            return (
              <div key={item.label} className="mb-0.5">
                <button
                  onClick={() => setExpanded(isOpen ? null : item.label)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors",
                    active ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-50",
                  )}
                >
                  <Icon size={18} className={active ? "text-primary" : "text-gray-400"} />
                  <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                  <ChevronRight
                    size={16}
                    className={cn("shrink-0 transition-transform text-gray-300", isOpen && "rotate-90")}
                  />
                </button>
                {isOpen && (
                  <div className="ml-[46px] border-l border-gray-100 pl-3 py-1 space-y-0.5">
                    {item.children.map((child) => (
                      <Link key={child.label} to={child.href} onClick={onClose}>
                        <div
                          className={cn(
                            "px-3 py-2 rounded-lg text-[13px] cursor-pointer transition-colors",
                            location.pathname === child.href
                              ? "text-primary font-semibold bg-primary/5"
                              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                          )}
                        >
                          {child.label}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User card + logout */}
        <div className="shrink-0 border-t border-gray-100 px-3 pt-3 pb-4 space-y-2" style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom, 16px))" }}>
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <span className="text-primary text-xs font-bold">{profile ? profile[0] : "K"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-800 truncate">{profile ? profile : "Kasir Utama"}</div>
              <div className="text-[11px] text-gray-400 truncate">{profile ? profile : "Administrator"}</div>
            </div>
            <Link to="/akun" onClick={onClose}>
              <button className="p-1.5 text-gray-400 hover:text-gray-600">
                <Settings size={16} />
              </button>
            </Link>
          </div>
          <button className="w-full flex items-center gap-2 justify-center bg-red-50 text-red-500 font-semibold text-sm py-2.5 rounded-xl hover:bg-red-100 transition-colors">
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
