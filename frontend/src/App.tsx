import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppProvider } from "./context/AppContext";
import { MobileLayout, PageTransition } from "./components/MobileLayout";

import Browse from "./pages/Browse";
import ProdukPage from "./pages/Product";
import RiwayatPage from "./pages/Riwayat";
import LaporanPage from "./pages/Laporan";
import AkunPage from "./pages/Pengguna";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import OTP from "./pages/OTP";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import Setup from "./pages/Setup";
import Success from "./pages/Success";
import SetupLoading from "./pages/SetupLoading";
import SetupSuccess from "./pages/SetupSuccess";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router>
          <MobileLayout>
            <PageTransition keyName="">
              <Routes>
                <Route path="/" element={<Browse />} />
                <Route path="/produk" element={<ProdukPage />} />
                <Route path="/riwayat" element={<RiwayatPage />} />
                <Route path="/laporan" element={<LaporanPage />} />
                <Route path="/akun" element={<AkunPage />} />
                <Route path="/splash" element={<Splash />} />
                <Route path="/login" element={<Login/>} />
                <Route path="/otp" element={<OTP/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/welcome" element={<Welcome/>} />

                <Route path="/setup" element={<Setup/>} />
                <Route path="/success" element={<Success/>} />
                <Route path="/setup-loading" element={<SetupLoading/>} />
                <Route path="/setup-success" element={<SetupSuccess/>} />
              </Routes>
            </PageTransition>
          </MobileLayout>
        </Router>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;