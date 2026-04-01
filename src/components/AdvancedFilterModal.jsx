import Icon from "./Icon";

const AdvancedFilterModal = ({ isOpen, onClose, filters, setFilters }) => {
  if (!isOpen) return null;

  const handleFuelChange = (fuel) => {
    setFilters(prev => ({ ...prev, fuel }));
  };

  const handleApply = () => {
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 animate-fade-in" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-surface z-50 shadow-2xl animate-fade-left flex flex-col">
        <div className="px-5 py-5 border-b border-surface-container-high flex justify-between items-center">
          <h2 className="font-headline font-black text-xl text-primary">Advanced Filters</h2>
          <button onClick={onClose} className="p-2 btn-press bg-surface-container rounded-full text-on-surface">
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Fuel Type */}
          <div>
            <h3 className="font-headline font-bold text-sm mb-3 text-on-surface">Fuel Type</h3>
            <div className="flex flex-wrap gap-2">
              {['All', 'Petrol', 'Diesel', 'EV'].map(f => (
                <button
                  key={f}
                  onClick={() => handleFuelChange(f)}
                  className={`px-4 py-2 rounded-full font-label text-sm transition-colors btn-press ${
                    filters.fuel === f ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* EV Specific */}
          {filters.fuel === 'EV' && (
            <div className="p-4 bg-tertiary/10 rounded-2xl border border-tertiary/20">
              <h3 className="font-headline font-bold text-sm mb-2 text-tertiary">EV Specifications</h3>
              <p className="font-body text-xs text-on-surface-variant">
                Only showing electric vehicles with advanced battery statistics.
              </p>
            </div>
          )}

          {/* Max Price */}
          <div>
            <h3 className="font-headline font-bold text-sm mb-3 text-on-surface">Maximum Price: ₹ {filters.maxPrice < 10000000 ? (filters.maxPrice/100000).toFixed(1) + ' Lakh' : (filters.maxPrice/10000000).toFixed(2) + ' Cr'}</h3>
            <input
              type="range"
              min="100000"
              max="50000000"
              step="100000"
              value={filters.maxPrice}
              onChange={e => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
              className="w-full accent-primary"
            />
          </div>

          {/* Max KM */}
          <div>
            <h3 className="font-headline font-bold text-sm mb-3 text-on-surface">Maximum Kilometers: {filters.maxKm.toLocaleString()} km</h3>
            <input
              type="range"
              min="0"
              max="100000"
              step="5000"
              value={filters.maxKm}
              onChange={e => setFilters(prev => ({ ...prev, maxKm: Number(e.target.value) }))}
              className="w-full accent-primary"
            />
          </div>

          {/* Year Range */}
          <div>
            <h3 className="font-headline font-bold text-sm mb-3 text-on-surface">Model Year</h3>
            <div className="flex gap-4">
              <select 
                className="flex-1 bg-surface-container py-3 px-4 rounded-xl font-body text-sm outline-none"
                value={filters.minYear} 
                onChange={e => setFilters(prev => ({...prev, minYear: Number(e.target.value)}))}
              >
                {[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <span className="self-center font-body text-on-surface-variant text-sm">to</span>
              <select 
                className="flex-1 bg-surface-container py-3 px-4 rounded-xl font-body text-sm outline-none"
                value={filters.maxYear} 
                onChange={e => setFilters(prev => ({...prev, maxYear: Number(e.target.value)}))}
              >
                {[2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-surface-container-high flex gap-3">
          <button 
            onClick={() => {
              setFilters({ fuel: 'All', maxKm: 100000, maxPrice: 50000000, minYear: 2015, maxYear: 2024 });
            }}
            className="flex-1 py-3.5 rounded-xl font-label font-bold text-on-surface text-sm btn-press bg-surface-container"
          >
            Clear All
          </button>
          <button 
            onClick={handleApply}
            className="flex-1 py-3.5 rounded-xl font-label font-bold text-on-primary text-sm btn-press bg-primary"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default AdvancedFilterModal;
