import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function OTP() {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const pending = (() => {
    try {
      const stored = sessionStorage.getItem('narapos_pending_registration');
      return stored ? JSON.parse(stored) as { name: string; email: string; phone: string } : null;
    } catch {
      return null;
    }
  })();

  const phone = pending?.phone ?? '';
  const maskedPhone = phone
    ? (() => {
        const digits = phone.replace(/\D/g, '');
        const visibleStart = digits.slice(0, 3);
        const visibleEnd = digits.slice(-2);
        return `+62 ${visibleStart}-****-**${visibleEnd}`;
      })()
    : '+62 ***-****-****';

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto submit on last digit
    if (index === 5 && value && newOtp.every(v => v !== '')) {
      verifyOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = (code: string) => {
    if (code.length === 6) {
      // Mock successful verification
      login({
        name: pending?.name || 'Pemilik Toko',
        phone: pending?.phone || '',
        email: pending?.email,
      });
      sessionStorage.removeItem('narapos_pending_registration');
      navigate('/success');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-h-dvh">
      <div className="px-6 pt-12 pb-4 flex items-center gap-3">
        <Link to="/register" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </Link>
        <span className="font-bold text-lg text-gray-900">Verifikasi OTP</span>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pt-8 pb-12">
        <img 
          src="/otp-illustration.png" 
          alt="OTP verification" 
          className="w-48 h-48 object-contain mb-8"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Masukkan Kode OTP</h2>
        <p className="text-gray-500 text-center mb-8 px-4">
          Kami telah mengirimkan kode OTP 6 digit ke nomor WhatsApp <span className="font-medium text-gray-900">{maskedPhone}</span>
        </p>

        <div className="flex justify-center gap-2 sm:gap-3 w-full max-w-[320px] mb-8">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center mb-4">
          Mode demo — masukkan 6 digit angka apa saja untuk melanjutkan
        </p>

        <div className="flex flex-col items-center gap-2">
          {timeLeft > 0 ? (
            <p className="text-sm text-gray-500">
              Kirim ulang kode dalam <span className="font-bold text-primary">{formatTime(timeLeft)}</span>
            </p>
          ) : (
            <button className="text-sm font-bold text-primary hover:underline">
              Kirim ulang kode OTP
            </button>
          )}
        </div>

        <div className="mt-auto w-full">
          <Button 
            className="w-full rounded-xl"
            disabled={otp.some(v => !v)}
            onClick={() => verifyOtp(otp.join(''))}
          >
            Verifikasi
          </Button>
        </div>
      </div>
    </div>
  );
}
