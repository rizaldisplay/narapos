import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Browse from "./pages/Browse";
import ProdukPage from "./pages/Product";
import RiwayatPage from "./pages/Riwayat";
import LaporanPage from "./pages/Laporan";
import AkunPage from "./pages/Pengguna";
// import RecipeDetails from "./pages/RecipeDetails";
// import CategoryDetails from "./pages/CategoryDetails";
// import SearchDetails from "./pages/SearchDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Browse />} />
        <Route path="/produk" element={<ProdukPage />} />
        <Route path="/riwayat" element={<RiwayatPage />} />
        <Route path="/laporan" element={<LaporanPage />} />
         <Route path="/akun" element={<AkunPage />} />
        {/* <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route path="/category/:id" element={<CategoryDetails />} />
        <Route path="/search/:query" element={<SearchDetails />} /> */}
      </Routes>
    </Router>
  );
}

export default App;