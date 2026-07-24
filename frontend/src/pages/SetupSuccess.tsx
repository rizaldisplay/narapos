import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { CheckCircle2, Gift } from 'lucide-react';
import { Card } from '../components/ui/card';

export default function SetupSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col bg-white min-h-dvh items-center px-6 pt-32 pb-12 text-center">
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-50" />
        <CheckCircle2 className="w-24 h-24 text-green-500 relative z-10" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Toko Berhasil Dibuat!
      </h1>
      
      <Card className="w-full bg-blue-50/50 border-blue-100 p-5 rounded-2xl shadow-none mb-12">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Gift className="w-6 h-6 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-xs text-gray-500 font-medium mb-1">Status</p>
            <p className="font-bold text-primary">Trial Aktif 30 Hari</p>
          </div>
        </div>
      </Card>

      <div className="mt-auto w-full">
        <Button 
          className="w-full rounded-xl"
          onClick={() => navigate('/welcome-dashboard')}
        >
          Masuk ke Dashboard
        </Button>
      </div>
    </div>
  );
}
