import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopHeader from "../components/TopHeader";
import BottomNav from "../components/BottomNav";
import Icon from "../components/Icon";
import Badge from "../components/Badge";
import CarCard from "../components/CarCard";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";

const TABS = ["Key Sections", "Specifications", "Features"];

const NegotiateModal = ({ car, onClose, onSubmit }) => {
  const [offer, setOffer] = useState("");
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-surface w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl animate-fade-up">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-headline font-black text-xl text-on-surface">Negotiate Price</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant">
            <Icon name="close" size={20} />
          </button>
        </div>
        
        <div className="bg-surface-container-low p-4 rounded-xl border border-surface-container-high mb-5">
          <p className="font-body text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-1">Fixed Asking Price (Max)</p>
          <p className="font-headline font-black text-2xl text-on-surface">{car.price}</p>
        </div>

        <div className="mb-6">
          <label className="font-body text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-2 flex">
            Your Offer (Min)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-headline font-bold text-lg text-on-surface-variant">₹</span>
            <input 
              type="number" 
              placeholder="e.g. 5,00,000"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant/50 focus:border-tertiary focus:ring-1 focus:ring-tertiary rounded-xl py-3.5 pl-9 pr-4 font-headline font-bold text-lg text-on-surface outline-none transition-all"
            />
          </div>
        </div>

        <button 
          disabled={!offer}
          onClick={() => onSubmit(offer)}
          className="w-full py-3.5 rounded-xl font-headline font-bold text-sm bg-tertiary text-on-tertiary shadow-lg shadow-tertiary/20 disabled:opacity-50 disabled:shadow-none btn-press"
        >
          Submit Offer
        </button>
      </div>
    </div>
  );
};

const KeySections = ({ car }) => (
  <div className="space-y-4 animate-fade-up">
    {/* Service History Timeline */}
    <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Icon name="history" filled size={20} className="text-secondary" />
          <h4 className="font-headline font-bold text-on-surface text-base">Service & Certification</h4>
        </div>
        {car.anyAccidents === 'No' && car.serviceHistory?.length > 0 && (
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black tracking-widest flex items-center gap-1.5 shadow-md shadow-blue-500/20">
            <Icon name="verified" filled size={11} />
            VERIFIED
          </span>
        )}
      </div>
      
      <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-emerald-500 before:via-emerald-300 before:to-emerald-100 before:rounded-full">
        {/* Real Dynamic History */}
        {car.serviceHistory && car.serviceHistory.length > 0 ? (
          car.serviceHistory.map((rec, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[20px] top-1 w-[10px] h-[10px] bg-emerald-500 rounded-full border-2 border-white shadow-sm shadow-emerald-500/40" />
              <p className="font-headline font-bold text-sm text-on-surface leading-none mb-1">{rec}</p>
              <p className="font-body text-[11px] text-on-surface-variant">Last reported at {car.lastServiceKm || "verified"} KM</p>
            </div>
          ))
        ) : (
          <div className="relative">
            <div className="absolute -left-[20px] top-1 w-[10px] h-[10px] bg-amber-500 rounded-full border-2 border-white shadow-sm" />
            <p className="font-headline font-bold text-sm text-on-surface leading-none mb-1">Self-Reported History</p>
            <p className="font-body text-[11px] text-on-surface-variant">Detailed records not uploaded to portal.</p>
          </div>
        )}
        
        {/* Stability info */}
        <div className="relative">
          <div className={`absolute -left-[20px] top-1 w-[10px] h-[10px] ${car.anyAccidents === 'No' ? 'bg-emerald-500' : car.anyAccidents === 'Minor' ? 'bg-amber-500' : 'bg-red-500'} rounded-full border-2 border-white shadow-sm`} />
          <p className="font-headline font-bold text-sm text-on-surface leading-none mb-1">Structure & Safety</p>
          <p className="font-body text-[11px] text-on-surface-variant">
            {car.anyAccidents === 'No' ? "No major accidents reported." : `${car.anyAccidents} accident history recorded.`}
          </p>
        </div>
      </div>
      
      <button 
        className="flex items-center gap-2 text-on-surface font-bold text-[11px] mt-6 bg-surface-container py-2.5 rounded-lg w-full justify-center border border-outline-variant/30 active:scale-[0.98] transition-transform"
        onClick={() => alert("Downloading secure Service Certificate...")}
      >
        <Icon name="verified_user" size={14} className="text-secondary" />
        View Verification Certificate
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
          <p className="font-headline font-bold text-sm text-on-surface">{car.sellerName || "Verified Seller"}</p>
          <p className="font-body text-[11px] text-on-surface-variant">
            {car.dealer.address} • {car.isDealership ? "Dealership Hub" : "Private Listing"}
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
  const { cars, pushNotification } = useData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [show360, setShow360] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [showNegotiate, setShowNegotiate] = useState(false);

  const rawCar = cars.find(c => c.id === id);
  const { incrementViewCount } = useData();

  useEffect(() => {
    if (rawCar) {
      incrementViewCount(id);
    }
    setImgIndex(0);
  }, [id, rawCar?.id]);

  if (!rawCar) return null;

  const images = rawCar.images && rawCar.images.length > 0 ? rawCar.images : (rawCar.image ? [rawCar.image] : []);

  // Enhance the raw car with exhaustive fallback data if not provided
  const car = {
    ...rawCar,
    totalImages: images.length,
    serviceHistory: rawCar.serviceHistory || [
      "Last Service: Oct 2023 - Authorized Center",
      "Major Service: Dec 2022 - Oil & Filter Change"
    ],
    anyAccidents: rawCar.anyAccidents || "No",
    lastServiceKm: rawCar.lastServiceKm || (rawCar.km ? parseInt(rawCar.km) - 2000 : "45,000"),
    emi: rawCar.priceRaw ? `₹${Math.round((rawCar.priceRaw * 0.8) / 60).toLocaleString()}/mo` : "₹ 45k/mo",
    validity: { insurance: `Nov ${new Date().getFullYear() + 1}`, registration: (rawCar.location || "National") + " RTO" },
    condition: { mechanical: "Mint", body: "No Dents" },
    dealer: {
      name: rawCar.isDealership ? (rawCar.sellerName || "Verified Dealer") : "Private Seller",
      address: rawCar.location || "Locality Hub",
      distance: "4.2 km away",
      rep: "Rajesh Malhotra",
      repTitle: "Certified Representative",
    },
    features: rawCar.features?.length > 0 ? rawCar.features : [
      "Panoramic Sunroof", "Burmester Audio", "360° Camera", "MBUX Infotainment",
      "Heated Front Seats", "Keyless Entry", "Driver Assist Package", "Wireless Charging",
    ],
  };

  const nextImg = () => setImgIndex((prev) => (prev + 1) % images.length);
  const prevImg = () => setImgIndex((prev) => (prev - 1 + images.length) % images.length);

  const relatedCars = cars.filter(c => c.bodyType === car.bodyType && c.id !== car.id).slice(0, 4);

  const tabContent = [
    <KeySections key="key" car={car} />,
    <Specifications key="spec" car={car} />,
    <Features key="feat" car={car} />,
  ];

  return (
    <>
      <TopHeader 
        showBack={true} 
        rightSlot={
          <div className="flex items-center gap-3">
            <button className="btn-press"><Icon name="share" size={22} className="text-on-surface hover:text-primary transition-colors" /></button>
            <button className="btn-press">
               <Icon name="favorite_border" size={22} className="text-on-surface hover:text-primary transition-colors" />
            </button>
          </div>
        }
      />

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
          ) : images.length > 0 ? (
            <>
              <img
                src={images[imgIndex]}
                alt={`${car.year} ${car.make} ${car.model}`}
                className="w-full h-full object-contain animate-fade-in"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              {images.length > 1 && (
                <>
                  <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all z-10">
                    <Icon name="chevron_left" size={28} />
                  </button>
                  <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all z-10">
                    <Icon name="chevron_right" size={28} />
                  </button>
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/30 px-3 py-1.5 rounded-full">
                    {images.map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i === imgIndex ? 'bg-white' : 'bg-white/40'}`} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : null}
          
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
          {car.badge === 'RESERVED' ? (
             <span className="bg-amber-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1.5 shadow-md shadow-amber-500/20">
               <Icon name="event_seat" filled size={13} />
               RESERVED
             </span>
          ) : (
             <Badge type={car.badgeType || (car.isDealership ? "certified" : "new")} label={car.badge || (car.isDealership ? "CERTIFIED" : "VERIFIED")} />
          )}
          
          <span className="bg-surface-container text-on-surface-variant px-3 py-1.5 rounded-full text-[10px] font-semibold flex items-center gap-1 border border-outline-variant/30">
            <Icon name="verified" filled size={12} className="text-tertiary" />
            Motriva {car.isDealership ? "Platinum" : "Direct"} Inspected
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

        {/* Financing strip - Dealership Only */}
        {car.isDealership && (
          <div className="px-5 pb-4">
            <div className="bg-surface-container-low rounded-xl p-4 flex justify-between items-center border border-outline-variant/20">
              <div>
                <p className="font-body text-[10px] text-on-surface-variant">Financing starts at</p>
                <p className="font-headline font-black text-on-surface text-xl">{car.emi}</p>
              </div>
              <button className="text-secondary font-bold text-sm btn-press">Check Eligibility</button>
            </div>
          </div>
        )}
        
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
        <button 
          className="w-full bg-[#25D366]/10 border border-[#25D366]/40 text-[#128C7E] py-3 rounded-full font-headline font-bold text-sm btn-press flex items-center justify-center gap-2 editorial-shadow-sm"
          onClick={() => {
            const text = `Hi! I saw your ${car.year} ${car.make} ${car.model} listed on Motriva for ${car.price} and I'm interested in finalizing a deal.`;
            // If dealership car — log the query to their inbox
            if (car.isDealership && car.owner) {
              pushNotification({
                type: 'WHATSAPP_QUERY',
                targetUserId: car.owner,
                buyerOwnerId: user?.uid || 'unauth-user',
                buyerPhone: user?.phone || '919000000000',
                carName: `${car.make} ${car.model}`,
                title: `WhatsApp Enquiry on ${car.make} ${car.model}`,
                message: `A buyer sent: "${text.slice(0, 120)}..."`,
              });
            }
            window.open(`https://wa.me/919000000000?text=${encodeURIComponent(text)}`, "_blank");
          }}
        >
          <Icon name="forum" filled size={18} className="text-[#25D366]" />
          {car.isDealership ? "Chat with Dealership via WhatsApp" : "Chat with Seller via WhatsApp"}
        </button>
        <button 
          onClick={() => setShowNegotiate(true)}
          className="w-full bg-secondary text-on-secondary py-3 rounded-full font-headline font-bold text-sm btn-press text-center"
        >
          Negotiate
        </button>
      </div>

      {showNegotiate && (
        <NegotiateModal 
          car={car} 
          onClose={() => setShowNegotiate(false)} 
          onSubmit={(offerAmt) => {
            // Push remote message targeted for the seller
            pushNotification({
              type: "OFFER_RECEIVED",
              targetUserId: car.owner || "dealership-internal", // Map to who uploaded the car
              buyerOwnerId: user?.uid || "unauth-user",
              carName: `${car.make} ${car.model}`,
              offerAmt: offerAmt,
              buyerPhone: "919000000000", // Dummy buyer phone
              title: `New Offer on your ${car.make} ${car.model}`,
              message: `A buyer has made an offer of ₹${offerAmt} for your listing.`,
            });
            setShowNegotiate(false);
            alert(`Thanks! The seller has been notified of your offer.`);
          }} 
        />
      )}
    </>
  );
};

export default CarDetail;
