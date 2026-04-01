import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopHeader from "../components/TopHeader";
import BottomNav from "../components/BottomNav";
import Icon from "../components/Icon";
import Badge from "../components/Badge";
import CarCard from "../components/CarCard";
import { useData } from "../context/DataContext";

const TABS = ["Key Sections", "Specifications", "Features"];

const KeySections = ({ car }) => (
  <div className="space-y-4 animate-fade-up">
    {/* Service History */}
    <div className="bg-surface-container-lowest rounded-xl p-5 editorial-shadow">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="build_circle" filled size={20} className="text-primary" />
        <h4 className="font-headline font-bold text-on-surface text-base">Service History</h4>
      </div>
      <div className="space-y-3">
        {car.serviceHistory.map((s, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-0.5 bg-tertiary-fixed-dim rounded-full flex-none mt-1" />
            <div>
              <p className="font-body font-semibold text-sm text-on-surface">{s.label}</p>
              <p className="font-body text-[11px] text-on-surface-variant">{s.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <button 
        className="flex items-center gap-2 text-primary font-bold text-sm mt-5 bg-primary/10 px-4 py-2.5 rounded-lg btn-press w-full justify-center"
        onClick={() => alert("Downloading secure PDF service records...")}
      >
        <Icon name="picture_as_pdf" size={18} className="text-primary" />
        Download Service PDF
      </button>
    </div>

    {/* Validity & Owner Detail */}
    <div className="bg-surface-container-lowest rounded-xl p-5 editorial-shadow">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="shield" filled size={20} className="text-primary" />
        <h4 className="font-headline font-bold text-on-surface text-base">Validity & Ownership</h4>
      </div>
      <div className="space-y-2.5">
        <div className="flex justify-between">
          <span className="font-body text-sm text-on-surface-variant">Reg. Owner</span>
          <span className="font-body font-bold text-sm text-on-surface">
            {car.rcOwnerNumber ? `${car.rcOwnerNumber}${car.rcOwnerNumber === 1 ? 'st' : car.rcOwnerNumber === 2 ? 'nd' : 'rd'} Owner` : car.owner}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-body text-sm text-on-surface-variant">Model Year</span>
          <span className="font-body font-semibold text-sm text-on-surface">{car.modelYear || car.year}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-body text-sm text-on-surface-variant">Registered Year</span>
          <span className="font-body font-semibold text-sm text-on-surface">{car.registeredYear || car.year}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-body text-sm text-on-surface-variant">Insurance Valid Till</span>
          <span className="font-body font-semibold text-sm text-on-surface">{car.validity.insurance}</span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-outline-variant/20">
        <p className="font-label text-[10px] font-black text-on-surface-variant tracking-widest uppercase mb-2">
          Condition Report
        </p>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <Icon name="check_circle" filled size={16} className="text-tertiary" />
            <span className="font-body text-xs text-on-surface">Mechanical: {car.condition.mechanical}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon name="check_circle" filled size={16} className="text-tertiary" />
            <span className="font-body text-xs text-on-surface">Body: {car.condition.body}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Car Location */}
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden editorial-shadow">
      <div className="p-5 pb-3">
        <h4 className="font-headline font-bold text-on-surface text-base">Car Location</h4>
      </div>
      <div className="h-36 bg-surface-container-high relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 map-grid" />
        <div className="bg-primary w-9 h-9 rounded-full flex items-center justify-center shadow-lg z-10">
          <Icon name="location_on" filled size={18} className="text-on-primary" />
        </div>
      </div>
      <div className="p-5 pt-4 flex justify-between items-center">
        <div>
          <p className="font-headline font-bold text-sm text-on-surface">{car.dealer.name}</p>
          <p className="font-body text-[11px] text-on-surface-variant">
            {car.dealer.address} • {car.dealer.distance}
          </p>
        </div>
        <button className="bg-primary text-on-primary text-xs font-bold px-4 py-2 rounded-full btn-press">
          Directions
        </button>
      </div>
    </div>

  </div>
);

const Specifications = ({ car }) => (
  <div className="space-y-3 animate-fade-up">
    <div className="bg-surface-container-lowest rounded-xl p-5 editorial-shadow">
      <h4 className="font-headline font-bold text-sm text-on-surface mb-4">Engine & Performance</h4>
      <div className="space-y-3">
        {[
          ["Displacement", "1998 cc"],
          ["Power", "190 bhp"],
          ["Torque", "400 Nm"],
          ["0–100 km/h", "7.1 sec"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span className="font-body text-sm text-on-surface-variant">{k}</span>
            <span className="font-body font-semibold text-sm text-on-surface">{v}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Features = ({ car }) => (
  <div className="animate-fade-up">
    <div className="bg-surface-container-lowest rounded-xl p-5 editorial-shadow">
      <h4 className="font-headline font-bold text-sm text-on-surface mb-4">Comfort & Convenience</h4>
      <div className="grid grid-cols-2 gap-3">
        {car.features.map((feat) => (
          <div key={feat} className="flex items-center gap-2">
            <Icon name="check_circle" filled size={15} className="text-tertiary flex-none" />
            <span className="font-body text-xs text-on-surface">{feat}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars } = useData();
  const [activeTab, setActiveTab] = useState(0);
  const [show360, setShow360] = useState(false);

  const rawCar = cars.find(c => c.id === id);

  useEffect(() => {
    if (!rawCar) {
      navigate("/");
    }
  }, [rawCar, navigate]);

  if (!rawCar) return null;

  // Enhance the raw car with exhaustive fallback data if not provided (like in older mock data)
  const car = {
    ...rawCar,
    totalImages: 12,
    serviceHistory: [
      { label: `Last Service: Oct ${rawCar.year + 1 || 2023}`, detail: "Authorized Center" },
      { label: `Major Service: Dec ${rawCar.year || 2022}`, detail: "Oil & Filter Change" },
    ],
    emi: rawCar.priceRaw ? `₹${Math.round((rawCar.priceRaw * 0.8) / 60).toLocaleString()}/mo` : "₹ 45k/mo",
    validity: { insurance: `Nov ${new Date().getFullYear() + 1}`, registration: rawCar.location + " RTO" },
    condition: { mechanical: "Mint", body: "No Dents" },
    dealer: {
      name: "Verified Premium Dealer",
      address: rawCar.location,
      distance: "4.2 km away",
      rep: "Rajesh Malhotra",
      repTitle: "Certified Representative",
    },
    features: [
      "Panoramic Sunroof", "Burmester Audio", "360° Camera", "MBUX Infotainment",
      "Heated Front Seats", "Keyless Entry", "Driver Assist Package", "Wireless Charging",
    ],
  };

  const relatedCars = cars.filter(c => c.bodyType === car.bodyType && c.id !== car.id).slice(0, 4);

  const tabContent = [
    <KeySections key="key" car={car} />,
    <Specifications key="spec" car={car} />,
    <Features key="feat" car={car} />,
  ];

  return (
    <>
      {/* Header */}
      <header className="glass-nav fixed top-0 left-0 right-0 z-50 max-w-[430px] mx-auto shadow-sm shadow-blue-900/5">
        <div className="flex justify-between items-center px-5 py-4">
          <button className="btn-press" onClick={() => navigate(-1)}>
            <Icon name="arrow_back" size={22} className="text-on-surface" />
          </button>
          <span className="font-headline font-bold text-sm text-on-surface">Motriva Certified</span>
          <div className="flex items-center gap-3">
            <button className="btn-press"><Icon name="share" size={22} className="text-on-surface" /></button>
            <button className="btn-press"><Icon name="favorite_border" size={22} className="text-on-surface" /></button>
          </div>
        </div>
      </header>

      {/* Scrollable content */}
      <main style={{ paddingTop: 64, paddingBottom: 180 }}>
        {/* Gallery */}
        <div className="relative h-[280px] bg-surface-container-highest group">
          {show360 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-container-highest cursor-ew-resize select-none overflow-hidden group">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(0,6,102,0.3)_0%,transparent_70%)]" />
                <div className="relative animate-float flex flex-col items-center justify-center">
                   <div className="relative w-full h-full flex items-center justify-center">
                      <img 
                        src={car.image} 
                        alt="360 Rotation" 
                        className="w-4/5 h-4/5 object-contain -scale-x-100 opacity-40 brightness-110 grayscale blur-[2px]" 
                        style={{ transition: 'transform 0.5s ease-out' }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="bg-white/10 backdrop-blur-md rounded-full p-6 shadow-2xl border border-white/20">
                            <Icon name="360" size={64} className="text-primary animate-pulse" />
                         </div>
                      </div>
                   </div>
                   <p className="font-headline font-black text-[10px] text-primary tracking-[0.2em] uppercase mt-4 bg-primary/10 px-4 py-1.5 rounded-full z-10">
                      Interactive 360° View Enabled
                   </p>
                </div>
            </div>
          ) : (
            <img
              src={car.image}
              alt={`${car.year} ${car.make} ${car.model}`}
              className="w-full h-full object-cover animate-fade-in"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          )}
          
          <div className="absolute bottom-3 left-4 flex gap-2">
            <button 
              className={`text-[10px] font-bold px-3 py-1.5 rounded-full flex gap-1 items-center transition-all ${!show360 ? 'bg-primary text-on-primary' : 'bg-inverse-surface/75 text-inverse-on-surface'}`}
              onClick={() => setShow360(false)}
            >
              <Icon name="camera_alt" filled size={13} />
              Photos ({car.totalImages})
            </button>
            <button 
              className={`text-[10px] font-bold px-3 py-1.5 rounded-full flex gap-1 items-center transition-all ${show360 ? 'bg-primary text-on-primary' : 'bg-inverse-surface/75 text-inverse-on-surface'}`}
              onClick={() => setShow360(true)}
            >
              <Icon name="360" size={13} />
              360° View
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="px-5 pt-5 pb-3 flex gap-2 flex-wrap">
          <Badge type={car.badgeType || "certified"} label={car.badge || "CERTIFIED"} />
          <span className="bg-surface-container text-on-surface-variant px-3 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1">
            <Icon name="verified" filled size={12} className="text-tertiary" />
            Motriva Inspected
          </span>
        </div>

        {/* Title & Price */}
        <div className="px-5 pb-5">
          <h2 className="font-headline text-[1.9rem] font-black tracking-tight text-on-surface leading-tight mb-1">
            {car.make} {car.model}
          </h2>
          <p className="font-body text-on-surface-variant text-sm mb-4">{car.variant} • {car.year} Model</p>
          <p className="font-headline text-3xl font-black text-on-surface">{car.price}</p>
          <p className="font-body text-[11px] text-on-surface-variant mt-1">Fixed Price • Registration Extra</p>
        </div>

        {/* Specs grid */}
        <div className="px-5 mb-6">
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "speed", label: "Kms Driven", value: `${car.km} km` },
              { icon: "local_gas_station", label: "Fuel Type", value: car.fuel },
              { icon: "settings", label: "Transmission", value: car.transmission },
              { icon: "person", label: "Ownership", value: car.rcOwnerNumber ? `${car.rcOwnerNumber === 1 ? '1st' : car.rcOwnerNumber === 2 ? '2nd' : '3rd'} Owner` : car.owner },
            ].map((spec) => (
              <div key={spec.label} className="spec-chip">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon name={spec.icon} filled size={18} className="text-secondary" />
                  <span className="font-body text-[10px] text-on-surface-variant">{spec.label}</span>
                </div>
                <p className="font-headline font-bold text-on-surface text-base">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 border-b border-outline-variant/30">
          <div className="flex gap-6">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`tab-btn ${activeTab === i ? "active" : ""}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="px-5 py-5">{tabContent[activeTab]}</div>

        {/* Financing strip */}
        <div className="px-5 pb-4">
          <div className="bg-surface-container-low rounded-xl p-4 flex justify-between items-center border border-outline-variant/20">
            <div>
              <p className="font-body text-[10px] text-on-surface-variant">Financing starts at</p>
              <p className="font-headline font-black text-on-surface text-xl">{car.emi}</p>
            </div>
            <button className="text-secondary font-bold text-sm btn-press">Check Eligibility</button>
          </div>
        </div>
        
        {/* More Cars Section */}
        {relatedCars.length > 0 && (
          <div className="mt-6 pt-6 border-t border-outline-variant/20">
            <div className="px-5 mb-4 flex justify-between items-end">
              <h3 className="font-headline font-bold text-lg text-primary">Similar {car.bodyType}</h3>
            </div>
            <div className="flex overflow-x-auto gap-4 px-5 pb-4 no-scrollbar">
              {relatedCars.map(relatedCar => (
                 <div key={relatedCar.id} className="min-w-[240px]">
                    <CarCard car={relatedCar} />
                 </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Sticky CTA bar */}
      <div className="glass-nav fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto z-50 px-5 pt-3 pb-6 border-t border-outline-variant/20 space-y-2.5">
        <button className="w-full bg-surface-container-lowest border border-outline-variant/40 text-on-surface py-3 rounded-full font-headline font-bold text-sm btn-press flex items-center justify-center gap-2 editorial-shadow-sm">
          <Icon name="call" filled size={18} className="text-secondary" />
          Contact {car.dealer.name}
        </button>
        <div className="flex gap-3">
          <button className="flex-1 bg-secondary text-on-secondary py-3 rounded-full font-headline font-bold text-sm btn-press">
            Make Offer
          </button>
          <button className="flex-1 bg-primary text-on-primary py-3 rounded-full font-headline font-bold text-sm btn-press flex items-center justify-center gap-2">
            <Icon name="calendar_month" filled size={18} className="text-on-primary" />
            Book Test Drive
          </button>
        </div>
      </div>
    </>
  );
};

export default CarDetail;
