// import { Link, useLocation } from "wouter";
import { Link, useLocation } from "react-router-dom";
import { Home, Package, FileText, BarChart2, User } from "lucide-react";
import { cn } from "../lib/utils";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
}

export default function Layout({ children, showBottomNav = true }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Kasir" },
    { href: "/produk", icon: Package, label: "Produk" },
    { href: "/riwayat", icon: FileText, label: "Riwayat" },
    { href: "/laporan", icon: BarChart2, label: "Laporan" },
    { href: "/akun", icon: User, label: "Akun" },
  ];

  return (
    <div className="min-h-[100dvh] bg-gray-100 flex justify-center w-full">
      <div className="w-full max-w-[430px] bg-white min-h-[100dvh] relative flex flex-col shadow-xl">
        <main className="flex-1 pb-20 flex flex-col relative overflow-x-hidden">
          {children}
        </main>
        
        {showBottomNav && (
          <nav className="fixed bottom-0 w-full max-w-[430px] bg-white border-t border-gray-200 pb-safe z-40">
            <div className="flex justify-around items-center h-16">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.href} to={item.href} className="flex-1 flex flex-col items-center justify-center gap-1 h-full cursor-pointer">
                    <Icon
                      size={24}
                      className={cn(
                        "transition-colors",
                        isActive ? "text-primary" : "text-gray-400"
                      )}
                    />
                    <span
                      className={cn(
                        "text-[10px] font-medium",
                        isActive ? "text-primary" : "text-gray-400"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
