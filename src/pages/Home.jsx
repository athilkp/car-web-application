import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TopHeader from "../components/TopHeader";
import BottomNav from "../components/BottomNav";
import FilterChips from "../components/FilterChips";
import CarCard from "../components/CarCard";
import TrustGrid from "../components/TrustGrid";
import EditorialFeed from "../components/EditorialFeed";
import { filterCategories, matchesCategory } from "../data/cars";
import { useData } from "../context/DataContext";
import { useLocationContext } from "../context/LocationContext";
import Icon from "../components/Icon";
import AIChatBot from "../components/AIChatBot";
import { useAuth } from "../context/AuthContext";


const Home = () => {
  const navigate = useNavigate();
  const { cars } = useData();
  const { selectedCity } = useLocationContext();
  const [activeCategory, setActiveCategory] = useState("All Cars");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  
  const featuredCars = cars.filter(c => {
    const makeStr = c.make || "";
    const modelStr = c.model || "";
    const bodyTypeStr = c.bodyType || "";
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = makeStr.toLowerCase().includes(query) || 
                          modelStr.toLowerCase().includes(query) ||
                          bodyTypeStr.toLowerCase().includes(query);
                          
    return (selectedCity === "All Locations" || c.location === selectedCity) &&
           matchesCategory(c, "Luxury") &&
           matchesCategory(c, activeCategory) &&
           matchesSearch;
  });

  if (user && user.role === 'dealership') {
     return (
       <>
         <TopHeader showSearch={true} />
         <main className="page-wrapper animate-fade-up" style={{ paddingBottom: 80 }}>

            {/* ── Dealer Hero ─────────────────────────── */}
            <section className="relative px-5 pt-12 pb-16 min-h-[520px] flex flex-col justify-end bg-black overflow-hidden">
               <div className="absolute inset-0 z-0">
                 <img src="/dealer_hero_clean.png" alt="Motriva Dealership" className="w-full h-full object-cover opacity-90 scale-105" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#141414]/50 to-transparent"></div>
                 <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d]/95 via-[#141414]/30 to-transparent"></div>
               </div>
               <div className="relative z-10 max-w-2xl md:mt-8">
                 <span className="text-[10px] uppercase font-black tracking-[0.25em] text-[#aaa] mb-3 flex items-center gap-2">
                   <span className="w-4 h-px bg-[#aaa] inline-block"></span>
                   Motriva Dealership Portal
                 </span>
                 <h2 className="font-headline text-[2.8rem] md:text-5xl font-black tracking-tight leading-[1.05] mb-8 text-white drop-shadow-lg">
                   Sell with Trust.<br/>
                   <span className="text-[#d4d4d4]">Buy with Confidence.</span>
                 </h2>
                 <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => navigate('/sell')}
                      className="bg-white text-[#111] text-sm px-7 py-3.5 font-headline font-black rounded-full btn-press shadow-xl"
                    >
                      + List a Vehicle
                    </button>
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="bg-white/10 text-white text-sm px-7 py-3.5 font-headline font-bold rounded-full btn-press border border-white/20 backdrop-blur-sm"
                    >
                      Your Inventory
                    </button>
                 </div>
               </div>
            </section>

            {/* ── Trust / Transparency Strip ─────────── */}
            <section className="px-5 py-5 border-b border-[#e8e8e8] bg-white">
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { icon: 'verified_user', label: 'Verified Listings',   desc: 'Every car inspected' },
                  { icon: 'history',       label: 'Service History',     desc: 'Full transparency'   },
                  { icon: 'handshake',     label: 'Direct Negotiations', desc: 'No middlemen'        },
                ].map(t => (
                  <div key={t.label} className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-xl bg-[#f3f3f3] flex items-center justify-center mb-1">
                      <Icon name={t.icon} size={20} className="text-[#2c2c2c]" />
                    </div>
                    <p className="font-headline font-black text-[11px] text-[#1a1a1a]">{t.label}</p>
                    <p className="font-body text-[9px] text-[#888]">{t.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Buying from Others ─────────────────── */}
            <section className="mt-6 px-5">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h3 className="font-headline text-xl font-black tracking-tight text-[#1a1a1a]">
                    Buying from Others
                  </h3>
                  <p className="font-body text-[10px] text-[#888] uppercase tracking-wider mt-0.5">
                    Full Marketplace · Browse & Acquire
                  </p>
                </div>
                <button
                  className="text-[#2c2c2c] font-bold text-xs bg-[#f0f0f0] px-3 py-1.5 rounded-full btn-press border border-[#ddd]"
                  onClick={() => navigate("/search")}
                >
                  View All →
                </button>
              </div>
            </section>

            {/* ── Filter Chips ──────────────────────── */}
            <div className="flex overflow-x-auto gap-2 px-5 py-3 no-scrollbar">
              {["All Cars", "Electric", "Petrol", "Diesel", "SUV", "Sedans", "Luxury"].map(chip => (
                <button
                  key={chip}
                  onClick={() => setActiveCategory(chip)}
                  className={`flex-none px-4 py-1.5 rounded-full font-body text-xs font-semibold transition-all btn-press border ${
                    activeCategory === chip
                      ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                      : 'bg-white text-[#555] border-[#ddd]'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* ── Car Scroll ────────────────────────── */}
            {cars.length > 0 && (
              <div className="flex overflow-x-auto gap-5 px-5 pb-8 no-scrollbar mt-2">
                {cars
                  .filter(c => activeCategory === 'All Cars' || matchesCategory(c, activeCategory))
                  .slice(0, 12)
                  .map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))
                }
              </div>
            )}

         </main>
         <BottomNav />
       </>
     );
  }


  return (
    <>
      <TopHeader title="Motriva" showSearch />

      <main className="page-wrapper animate-fade-up">
        {/* ── Hero ─────────────────────────────────── */}
        <section className="relative px-5 pt-12 pb-14 min-h-[420px] flex flex-col justify-end bg-black">
          <div className="absolute inset-0 z-0">
            <img src="/hero-bg.png" alt="Motriva Luxury" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-2xl md:mt-8">
            <h2 className="font-headline text-[2.6rem] md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-2 text-white drop-shadow-lg">
              Find Your Next<br />Legendary Drive.
            </h2>
            <p className="font-body text-white/80 text-sm mb-6 drop-shadow-md">
              Curated selection of certified pre-owned excellence.
            </p>
          </div>
        </section>

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
      <AIChatBot />
    </>
  );
};

export default Home;
