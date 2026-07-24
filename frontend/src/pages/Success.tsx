import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function Success() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col bg-white min-h-[100dvh] items-center px-6 pt-24 pb-12 text-center">
      <div className="mb-12 relative w-48 h-48">
        <div className="absolute inset-0 bg-blue-50 rounded-full animate-pulse opacity-50" />
        <img 
          src="/confetti-illustration.png" 
          alt="Success" 
          className="w-full h-full object-contain relative z-10"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Selamat Datang di Narapos!
      </h1>
      
      <p className="text-gray-500 mb-12 max-w-[280px]">
        Akun Anda telah berhasil dibuat. Langkah selanjutnya, mari siapkan toko pertama Anda untuk mulai berjualan.
      </p>

      <div className="mt-auto w-full">
        <Button 
          className="w-full rounded-xl"
          onClick={() => navigate('/setup')}
        >
          Lanjut
        </Button>
      </div>
    </div>
  );
}
