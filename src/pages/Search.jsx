import TopHeader from "../components/TopHeader";
import { useState } from "react";
import BottomNav from "../components/BottomNav";
import FilterChips from "../components/FilterChips";
import SearchListingCard from "../components/SearchListingCard";
import Icon from "../components/Icon";
import AdvancedFilterModal from "../components/AdvancedFilterModal";
import { searchFilters } from "../data/cars";
import { useData } from "../context/DataContext";
import { useLocationContext } from "../context/LocationContext";

const Search = () => {
  const { cars } = useData();
  const { selectedCity } = useLocationContext();
  const [activeCategory, setActiveCategory] = useState("All Cars");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    fuel: "All",
    maxKm: 100000,
    maxPrice: 50000000,
    minYear: 2015,
    maxYear: 2024,
  });
  const [searchQuery, setSearchQuery] = useState("");
  
  const locationFilteredCars = cars.filter(c => {
    // 1. Location
    const matchLocation = selectedCity === "All Locations" || c.location === selectedCity;
    // 2. Body Type
    const matchCategory = activeCategory === "All Cars" || c.bodyType === activeCategory;
    // 3. Adv Filters: Fuel
    const matchFuel = advancedFilters.fuel === "All" || c.fuel === advancedFilters.fuel;
    // 4. Adv Filters: KM Driven
    const kmValue = parseInt((c.km || "0").replace(/,/g, ''), 10);
    const matchKm = kmValue <= advancedFilters.maxKm;
    // 5. Adv Filters: Price
    const matchPrice = (c.priceRaw || 0) <= advancedFilters.maxPrice;
    // 6. Adv Filters: Year
    const year = c.modelYear || c.year || 2020;
    const matchYear = year >= advancedFilters.minYear && year <= advancedFilters.maxYear;
    // 7. Search Query
    const makeStr = c.make || "";
    const modelStr = c.model || "";
    const bodyTypeStr = c.bodyType || "";
    const query = searchQuery.toLowerCase();
    
    const matchSearch = makeStr.toLowerCase().includes(query) || 
                          modelStr.toLowerCase().includes(query) ||
                          bodyTypeStr.toLowerCase().includes(query);
    
    return matchLocation && matchCategory && matchFuel && matchKm && matchPrice && matchYear && matchSearch;
  });
  return (
    <>
      <TopHeader title="The Editorial Marketplace" showSearch />

      <main className="page-wrapper animate-fade-up">
        {/* ── Page header ──────────────────────────── */}
        <div className="px-5 pt-5 pb-3 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black text-on-surface-variant tracking-widest uppercase">
              Discovery
            </p>
            <h2 className="font-headline text-2xl font-black tracking-tight text-primary">
              Find Your Next Drive
            </h2>
          </div>
          <button 
            onClick={() => setShowAdvancedFilters(true)}
            className="flex items-center gap-1.5 bg-surface-container px-4 py-2 rounded-full font-label text-sm text-on-surface-variant btn-press"
          >
            <Icon name="tune" size={17} />
            Filters
          </button>
        </div>

        {/* ── Search Input ────────────────────────── */}
        <div className="px-5 mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Icon name="search" size={20} className="text-outline" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search brands, models…"
              className="w-full bg-surface-container-high py-3.5 pl-11 pr-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-primary/30 font-body text-sm placeholder:text-outline-variant transition-all"
            />
          </div>
        </div>

        {/* ── Filter chips ──────────────────────────── */}
        <div className="mb-5">
          <FilterChips items={searchFilters} onSelect={(item) => setActiveCategory(item)} />
        </div>

        {/* ── Listing Feed ─────────────────────────── */}
        <div className="px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-5">
          {locationFilteredCars.length > 0 ? (
            locationFilteredCars.map((car) => (
              <SearchListingCard key={car.id} car={car} />
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/30">
                <Icon name="search_off" size={48} className="text-outline-variant mb-2 mx-auto block" />
                <h4 className="font-headline font-bold text-on-surface">No matches found</h4>
                <p className="font-body text-sm text-on-surface-variant mt-1">Try broadening your filters or clearing your search.</p>
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All Cars");
                    setAdvancedFilters({ fuel: 'All', maxKm: 100000, maxPrice: 50000000, minYear: 2015, maxYear: 2024 });
                  }}
                  className="mt-4 text-primary font-bold text-xs"
                >
                  Clear All Filters
                </button>
            </div>
          )}

          {/* Load more */}
          {locationFilteredCars.length > 0 && (
            <div className="md:col-span-2 lg:col-span-3">
            <button className="w-full bg-surface-container text-on-surface-variant py-4 rounded-2xl font-headline font-bold text-sm btn-press flex items-center justify-center gap-2">
              <Icon name="expand_more" size={18} />
              Show More Curated Listings
            </button>
          </div>
          )}
        </div>
      </main>

      <AdvancedFilterModal 
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        filters={advancedFilters}
        setFilters={setAdvancedFilters}
      />

      <BottomNav />
    </>
  );
};

export default Search;
