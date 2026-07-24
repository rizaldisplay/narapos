import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Splash() {
  const navigate = useNavigate();
  const { state } = useAppContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.isAuthenticated) {
        if (state.isOnboarded) {
          if (state.hasSeenWelcomeDashboard) {
            navigate ('/dashboard');
          } else {
            navigate ('/welcome-dashboard');
          }
        } else {
          navigate ('/setup');
        }
      } else {
        navigate ('/welcome');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [state, navigate]);

  return (
    <div className="relative flex-1 flex flex-col items-center bg-linear-to-b from-[#2452D8] via-[#1E45C2] to-[#1636A0] text-white overflow-hidden min-h-[100dvh]">
      <div className="flex flex-col items-center pt-28 px-6">
        <img
          src="/assets/images/logos/narapos-logo.png"
          alt="Narapos"
          className="w-64 object-contain mb-4 drop-shadow-lg"
        />
        <p className="text-white/70 text-xs font-medium tracking-wide">
          Mudah &bull; Cepat &bull; Aman &bull; Praktis
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center w-full px-10">
        <img
          src="/assets/images/logos/splash-storefront.png"
          alt="Toko Narapos"
          className="w-full max-w-65 object-contain"
        />
      </div>

      <div className="pb-14 flex flex-col items-center gap-4">
        <div className="w-7 h-7 border-[3px] border-white/40 border-t-white rounded-full animate-spin" />
        <p className="text-sm font-medium text-white/90">Memuat...</p>
      </div>
    </div>
  );
}
