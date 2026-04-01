import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TopHeader from "../components/TopHeader";
import BottomNav from "../components/BottomNav";
import FilterChips from "../components/FilterChips";
import CarCard from "../components/CarCard";
import TrustGrid from "../components/TrustGrid";
import EditorialFeed from "../components/EditorialFeed";
import { filterCategories } from "../data/cars";
import { useData } from "../context/DataContext";
import { useLocationContext } from "../context/LocationContext";
import Icon from "../components/Icon";

const Home = () => {
  const navigate = useNavigate();
  const { cars } = useData();
  const { selectedCity } = useLocationContext();
  const [activeCategory, setActiveCategory] = useState("All Cars");
  const [searchQuery, setSearchQuery] = useState("");
  
  const featuredCars = cars.filter(c => {
    const makeStr = c.make || "";
    const modelStr = c.model || "";
    const bodyTypeStr = c.bodyType || "";
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = makeStr.toLowerCase().includes(query) || 
                          modelStr.toLowerCase().includes(query) ||
                          bodyTypeStr.toLowerCase().includes(query);
                          
    return (selectedCity === "All Locations" || c.location === selectedCity) &&
           (activeCategory === "All Cars" || c.bodyType === activeCategory) &&
           matchesSearch;
  });

  return (
    <>
      <TopHeader title="Motriva" showSearch />

      <main className="page-wrapper animate-fade-up">
        {/* ── Hero ─────────────────────────────────── */}
        <section className="px-5 pt-7 pb-6">
          <h2 className="font-headline text-[2.6rem] md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-2 text-primary max-w-2xl md:mt-8">
            Find Your Next<br />Legendary Drive.
          </h2>
          <p className="font-body text-on-surface-variant text-sm mb-6">
            Curated selection of certified pre-owned excellence.
          </p>
        </section>

        {/* ── Category Quick Links ─────────────────────────── */}
        <section className="px-5 mb-8">
          <div className="flex justify-between items-end mb-4">
            <h3 className="font-headline font-bold text-lg text-primary">Browse Categories</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "SUVs", icon: "tire_repair" },
              { label: "Sedans", icon: "directions_car" },
              { label: "Luxury", icon: "workspace_premium" },
              { label: "Electric", icon: "bolt" },
              { label: "Sports", icon: "speed" },
              { label: "All Cars", icon: "grid_view" }
            ].map((cat) => (
              <button 
                key={cat.label}
                onClick={() => {
                  setActiveCategory(cat.label);
                  if (cat.label === "All Cars") navigate("/search");
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${activeCategory === cat.label ? 'bg-primary-container border-primary text-primary shadow-sm' : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:border-primary/50'}`}
              >
                <Icon name={cat.icon} size={24} className={activeCategory === cat.label ? "text-primary" : "text-secondary"} />
                <span className="font-label text-[10px] font-bold mt-2">{cat.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Filter Chips ──────────────────────────── */}
        <div className="mb-8">
          <FilterChips items={filterCategories} onSelect={(item) => setActiveCategory(item)} />
        </div>

        {/* ── Featured Showroom ─────────────────────── */}
        <section className="mb-10">
          <div className="px-5 flex justify-between items-end mb-5">
            <div>
              <span className="text-secondary font-bold text-[10px] tracking-widest uppercase">
                Premium Selection
              </span>
              <h3 className="font-headline text-2xl font-bold tracking-tight text-primary">
                Featured Showroom
              </h3>
            </div>
            <button
              className="text-primary font-bold text-sm btn-press"
              onClick={() => navigate("/search")}
            >
              View all
            </button>
          </div>

          {/* Horizontal scroll */}
          {featuredCars.length > 0 ? (
            <div className="flex overflow-x-auto gap-5 px-5 pb-6 no-scrollbar">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="px-5 pb-6 text-center">
              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-dashed border-outline-variant/30 flex flex-col items-center">
                <span className="material-symbols-outlined text-outline text-4xl mb-2">search_off</span>
                <h4 className="font-headline font-bold text-on-surface">No cars found</h4>
                <p className="font-body text-sm text-on-surface-variant mt-1">Try adjusting your search or filters.</p>
                <button 
                  onClick={() => {setSearchQuery(""); setActiveCategory("All Cars");}}
                  className="mt-4 text-primary font-bold text-xs view-all-btn"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ── Trust Grid ────────────────────────────── */}
        <TrustGrid />

        {/* ── Editorial Feed ────────────────────────── */}
        <EditorialFeed />
      </main>

      <BottomNav />
    </>
  );
};

export default Home;
