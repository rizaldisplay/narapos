import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Eye, EyeOff, CheckCircle2, ChevronDown, Gift, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      setError('Mohon isi nomor WhatsApp dan password');
      return;
    }
    
    // Mock login
    login({ name: 'Pemilik Toko', phone });
    navigate('/dashboard');
  };

  return (
    <div className="flex-1 flex flex-col bg-linear-to-b from-[#2452D8] via-[#1E45C2] to-[#1636A0] min-h-dvh relative overflow-hidden">
      <div className="px-6 pt-10 pb-8 relative z-10">
        <img src="/assets/images/logos/narapos-logo.png" alt="Narapos" className="h-10 object-contain mb-6" />

        <div>
          <h1 className="text-[26px] font-bold text-white leading-tight mb-3">
            Kelola Bisnis Lebih Mudah dengan <span className="text-amber-400">Narapos</span>
          </h1>
          <p className="text-white/80 text-sm leading-relaxed">
            Aplikasi kasir digital untuk UMKM yang membantu transaksi, stok, pelanggan, dan laporan penjualan dalam satu platform.
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-t-4xl px-6 pt-8 pb-8 relative z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.15)]">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Masuk ke Akun Anda</h2>
        <p className="text-gray-500 mb-6">Silakan masuk menggunakan nomor WhatsApp Anda.</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Nomor WhatsApp</label>
            <div className="flex rounded-xl bg-gray-50 overflow-hidden border border-transparent focus-within:border-primary">
              <div className="flex items-center gap-1 px-3 border-r border-gray-200 text-gray-600 text-sm font-medium shrink-0">
                +62 <ChevronDown className="w-3.5 h-3.5" />
              </div>
              <Input 
                type="tel" 
                placeholder="8xxxxxxxxxx" 
                className="rounded-none border-none bg-transparent shadow-none focus-visible:ring-0"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Masukkan password" 
                className="pr-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded text-primary focus:ring-primary w-4 h-4"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="text-sm text-gray-600">Ingat Saya</span>
            </label>
            <Link to="/forgot-password">
              <span className="text-sm text-primary font-medium">Lupa Password?</span>
            </Link>
          </div>

          <Button type="submit" className="w-full rounded-xl mt-2">Masuk</Button>
        </form>

        <div className="mt-6 mb-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Atau</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <p className="text-sm text-gray-500 mb-1">Belum punya akun?</p>
        <div className="flex items-center gap-2 mb-3">
          <Gift className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-primary">Uji Coba Gratis 30 Hari</h3>
        </div>
        <ul className="space-y-2 mb-4">
          <li className="flex items-center gap-2 text-sm text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>Semua fitur aktif</span>
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>Tanpa kartu kredit</span>
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>Siap digunakan kurang dari 1 menit</span>
          </li>
        </ul>
        <Button asChild variant="outline" className="w-full rounded-xl border-primary text-primary hover:bg-blue-50 bg-white gap-2">
          <Link to="/register">
            <Gift className="w-4 h-4" />
            Mulai Uji Coba Gratis
          </Link>
        </Button>
      </div>

      <div className="bg-[#1636A0] py-3 flex items-center justify-center gap-1.5 relative z-10">
        <ShieldCheck className="w-3.5 h-3.5 text-white/70" />
        <span className="text-xs text-white/70">Data Anda aman bersama Narapos</span>
      </div>
    </div>
  );
}
