import { Link } from "react-router-dom";
import { Button } from '../components/ui/button';

export default function Welcome() {
  return (
    <div className="flex-1 flex flex-col bg-white px-6 pb-10 pt-14">
      <div className="flex items-center mb-8">
        <img src="/assets/images/logos/logo-narapos-blue.png" alt="Narapos" className="h-11 object-contain" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
        Kelola Bisnis Lebih Mudah dengan Narapos
      </h1>

      <p className="text-gray-500 mb-8">
        Aplikasi kasir digital yang membantu mengelola transaksi, stok, pelanggan, dan laporan penjualan dalam satu aplikasi untuk semua kebutuhan bisnis.
      </p>

      <div className="flex-1 flex items-center justify-center mb-8">
        <img 
          src="/assets/images/logos/cashier-illustration.jpg" 
          alt="Cashier illustration" 
          className="w-full max-w-75 object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      <div className="flex flex-col gap-3 mt-auto">
        <Button asChild className="w-full rounded-xl h-12 text-base font-bold">
          <Link to="/login">Masuk</Link>
        </Button>
        <Button asChild variant="outline" className="w-full rounded-xl h-12 text-base font-bold border-primary text-primary hover:bg-blue-50">
          <Link to="/register">Daftar Gratis</Link>
        </Button>
      </div>
    </div>
  );
}
