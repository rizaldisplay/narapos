import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { ArrowLeft, Upload, Store, UserCircle, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Setup() {
  const navigate = useNavigate();
  const { completeOnboarding } = useAppContext();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    province: '',
    city: '',
    district: '',
    address: '',
    timezone: 'WIB',
    currency: 'IDR',
    tax: '0',
    printer: 'Bluetooth',
    cashierName: '',
    cashierUsername: '',
    cashierPassword: ''
  });

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate('/setup-loading');
      setTimeout(() => {
        completeOnboarding(formData);
      }, 100);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStepIcon = (s: number) => {
    const isCompleted = step > s;
    const isActive = step === s;
    
    return (
      <div className={`flex flex-col items-center relative z-10`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors
          ${isCompleted ? 'bg-primary border-primary text-white' : 
            isActive ? 'bg-white border-primary text-primary' : 
            'bg-white border-gray-200 text-gray-400'}`}>
          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : s}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-h-dvh">
      <div className="px-6 pt-12 pb-4 flex items-center gap-3">
        {step > 1 ? (
          <button onClick={prevStep} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
        ) : (
          <div className="w-10 h-10" /> // spacer
        )}
        <span className="font-bold text-lg text-gray-900">Setup Toko</span>
      </div>

      <div className="px-8 py-6 relative">
        <div className="absolute top-10 left-12 right-12 h-0.5 bg-gray-200 z-0">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
        <div className="flex justify-between relative">
          {[1, 2, 3, 4, 5].map(s => renderStepIcon(s))}
        </div>
      </div>

      <div className="flex-1 px-6 overflow-y-auto pb-24">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Informasi Toko</h2>
              <p className="text-sm text-gray-500">Lengkapi profil dasar toko Anda.</p>
            </div>
            
            <div className="flex flex-col items-center gap-2 mb-6">
              <div className="w-24 h-24 bg-gray-50 border border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors">
                <Upload className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium">Upload Logo</span>
              </div>
              <span className="text-xs text-gray-400">Opsional, max 2MB</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Nama Toko *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Store className="w-5 h-5" /></span>
                  <Input 
                    placeholder="Contoh: Kopi Kenangan" 
                    className="pl-10 rounded-xl bg-gray-50"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Jenis Usaha *</label>
                <select 
                  className="flex h-12 w-full rounded-xl border border-input bg-gray-50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="" disabled>Pilih jenis usaha</option>
                  <option value="fnb">Food & Beverage (F&B)</option>
                  <option value="retail">Retail / Minimarket</option>
                  <option value="jasa">Jasa / Servis</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Alamat Toko</h2>
              <p className="text-sm text-gray-500">Tentukan lokasi toko agar mudah ditemukan.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Provinsi</label>
                <select className="flex h-12 w-full rounded-xl border border-input bg-gray-50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.province}
                  onChange={(e) => setFormData({...formData, province: e.target.value})}
                >
                  <option value="">Pilih provinsi</option>
                  <option value="jabar">Jawa Barat</option>
                  <option value="jatim">Jawa Timur</option>
                  <option value="dkijakarta">DKI Jakarta</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Kota/Kabupaten</label>
                <select className="flex h-12 w-full rounded-xl border border-input bg-gray-50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                >
                  <option value="">Pilih kota/kabupaten</option>
                  <option value="bandung">Bandung</option>
                  <option value="jakarta">Jakarta</option>
                  <option value="surabaya">Surabaya</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Kecamatan</label>
                <Input 
                  placeholder="Masukkan kecamatan" 
                  className="rounded-xl bg-gray-50"
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Alamat Lengkap</label>
                <textarea 
                  className="flex min-h-20 w-full rounded-xl border border-input bg-gray-50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Nama jalan, nomor bangunan, detail lainnya..."
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Pengaturan</h2>
              <p className="text-sm text-gray-500">Sesuaikan sistem toko Anda.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Zona Waktu</label>
                <select className="flex h-12 w-full rounded-xl border border-input bg-gray-50 px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.timezone}
                  onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                >
                  <option value="WIB">WIB (Waktu Indonesia Barat)</option>
                  <option value="WITA">WITA (Waktu Indonesia Tengah)</option>
                  <option value="WIT">WIT (Waktu Indonesia Timur)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Mata Uang</label>
                <select className="flex h-12 w-full rounded-xl border border-input bg-gray-50 px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.currency}
                  onChange={(e) => setFormData({...formData, currency: e.target.value})}
                >
                  <option value="IDR">Rupiah (Rp)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Pajak (%)</label>
                <Input 
                  type="number"
                  placeholder="0" 
                  className="rounded-xl bg-gray-50"
                  value={formData.tax}
                  onChange={(e) => setFormData({...formData, tax: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Printer Kasir</label>
                <select className="flex h-12 w-full rounded-xl border border-input bg-gray-50 px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.printer}
                  onChange={(e) => setFormData({...formData, printer: e.target.value})}
                >
                  <option value="Bluetooth">Printer Bluetooth</option>
                  <option value="USB">Printer USB</option>
                  <option value="LAN">Printer LAN/Network</option>
                  <option value="None">Tidak pakai printer</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Kasir Pertama</h2>
              <p className="text-sm text-gray-500">Buat akun untuk kasir yang akan menggunakan alat.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Nama Kasir</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><UserCircle className="w-5 h-5" /></span>
                  <Input 
                    placeholder="Contoh: Budi" 
                    className="pl-10 rounded-xl bg-gray-50"
                    value={formData.cashierName}
                    onChange={(e) => setFormData({...formData, cashierName: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Username</label>
                <Input 
                  placeholder="budi_kasir" 
                  className="rounded-xl bg-gray-50"
                  value={formData.cashierUsername}
                  onChange={(e) => setFormData({...formData, cashierUsername: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Input 
                  type="password"
                  placeholder="Buat password kasir" 
                  className="rounded-xl bg-gray-50"
                  value={formData.cashierPassword}
                  onChange={(e) => setFormData({...formData, cashierPassword: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center pt-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Paket Trial 30 Hari</h2>
              <p className="text-sm text-gray-500 mb-8">Aktifkan trial Anda sekarang dan nikmati semua fitur premium tanpa batas.</p>
            </div>

            <Card className="bg-primary text-white border-none p-6 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
              
              <h3 className="text-xl font-bold mb-6 relative z-10">Premium Plan</h3>
              <ul className="space-y-4 relative z-10">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-300 shrink-0" />
                  <span className="text-sm font-medium">Manajemen Produk Unlimited</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-300 shrink-0" />
                  <span className="text-sm font-medium">Laporan Keuangan Lengkap</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-300 shrink-0" />
                  <span className="text-sm font-medium">Manajemen Stok & Inventori</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-300 shrink-0" />
                  <span className="text-sm font-medium">Dukungan Multi Outlet</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-300 shrink-0" />
                  <span className="text-sm font-medium">Prioritas Support 24/7</span>
                </li>
              </ul>
            </Card>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-center z-50 pointer-events-none">
        <div className="w-full max-w-107.5 pointer-events-auto">
          <Button 
            className="w-full rounded-xl"
            onClick={nextStep}
            disabled={step === 1 && (!formData.name || !formData.type)}
          >
            {step === 5 ? 'Aktifkan Trial' : 'Selanjutnya'}
          </Button>
        </div>
      </div>
    </div>
  );
}
