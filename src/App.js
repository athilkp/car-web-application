import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import CarDetail from "./pages/CarDetail";
import Dashboard from "./pages/Dashboard";
import Sell from "./pages/Sell";
import "./index.css";
import { DataProvider } from "./context/DataContext";
import { LocationProvider } from "./context/LocationContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <LocationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/car/:id" element={<CarDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sell" element={<Sell />} />
            </Routes>
          </BrowserRouter>
        </LocationProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
