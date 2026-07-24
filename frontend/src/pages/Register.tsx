import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Nama lengkap wajib diisi';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email tidak valid';
    if (!formData.phone || formData.phone.length < 9) newErrors.phone = 'Nomor WhatsApp tidak valid';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Password minimal 6 karakter';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Password tidak cocok';
    if (!agreed) newErrors.agreed = 'Anda harus menyetujui syarat & ketentuan';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      sessionStorage.setItem('narapos_pending_registration', JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      }));
      navigate('/otp');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-h-dvh">
      <div className="px-6 pt-12 pb-4 flex items-center gap-3">
        <Link to="/welcome" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </Link>
        <span className="font-bold text-lg text-gray-900">Daftar Akun</span>
      </div>

      <div className="px-6 flex-1 pb-8">
        <p className="text-gray-500 mb-6">Lengkapi data diri Anda untuk memulai trial gratis 30 hari.</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
            <Input 
              type="text" 
              placeholder="Masukkan nama lengkap" 
              className="rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input 
              type="email" 
              placeholder="contoh@email.com" 
              className="rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Nomor WhatsApp</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">+62</span>
              <Input 
                type="tel" 
                placeholder="81234567890" 
                className="pl-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Buat password" 
                className="pr-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button" 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Konfirmasi Password</label>
            <div className="relative">
              <Input 
                type={showConfirm ? "text" : "password"} 
                placeholder="Ulangi password" 
                className="pr-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
              <button 
                type="button" 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>

          <label className="flex items-start gap-3 mt-6 mb-8">
            <input 
              type="checkbox" 
              className="mt-1 rounded text-primary focus:ring-primary w-5 h-5" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className="text-sm text-gray-600 leading-relaxed">
              Saya menyetujui <span className="text-primary font-medium">Syarat & Ketentuan</span> dan <span className="text-primary font-medium">Kebijakan Privasi</span> Narapos.
            </span>
          </label>
          {errors.agreed && <p className="text-xs text-red-500 -mt-6 mb-6">{errors.agreed}</p>}

          <Button type="submit" className="w-full rounded-xl">Mulai Trial Gratis</Button>
        </form>
        
        <p className="text-center mt-6 text-sm text-gray-500">
          Sudah punya akun?{' '}
          <Link to="/login">
            <span className="text-primary font-bold">Masuk</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
