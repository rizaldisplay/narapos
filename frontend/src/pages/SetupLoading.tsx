import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function SetupLoading() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/setup-success');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white min-h-dvh">
      <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg mb-8 animate-pulse">
        <span className="text-white text-3xl font-bold">N</span>
      </div>
      
      <div className="w-64 h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-primary animate-[progress_2s_ease-in-out_infinite]" style={{ width: '100%', transformOrigin: 'left' }} />
      </div>

      <p className="text-gray-500 font-medium">Sedang menyiapkan toko Anda...</p>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.5); }
          100% { transform: scaleX(1); }
        }
      `}} />
    </div>
  );
}
