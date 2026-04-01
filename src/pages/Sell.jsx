import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopHeader from "../components/TopHeader";
import BottomNav from "../components/BottomNav";
import Icon from "../components/Icon";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useLocationContext } from "../context/LocationContext";

const STEPS = [
  { icon: "directions_car", label: "Car Details", desc: "Make, model, year, variant" },
  { icon: "camera_alt", label: "Upload Photos", desc: "Min 8 photos required" },
  { icon: "description", label: "Documents", desc: "RC, insurance, PUC" },
  { icon: "payments", label: "Set Price", desc: "AI-powered pricing guide" },
  { icon: "verified_user", label: "Verification", desc: "Schedule inspection" },
];

const Sell = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addCar } = useData();
  const { selectedCity } = useLocationContext();

  const [wizardStep, setWizardStep] = useState(0); // 0 = overview, 1 = details, ...
  const [formData, setFormData] = useState({
    make: "", model: "", km: "", fuel: "Petrol", price: "", image: null
  });

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  if (!user) return null;

  const handlePublish = () => {
    const newCar = {
      id: "listing-" + Date.now(),
      make: formData.make || "Motriva Custom",
      model: formData.model || "Edition 1",
      year: new Date().getFullYear(),
      modelYear: new Date().getFullYear(),
      registeredYear: new Date().getFullYear(),
      variant: "Standard",
      km: formData.km || "0",
      kmRaw: parseInt(formData.km || "0", 10),
      fuel: formData.fuel,
      price: "₹" + formData.price,
      priceRaw: parseInt(formData.price.replace(/\D/g,'') || "0", 10),
      badge: "NEW LISTING",
      badgeType: "deal",
      image: formData.image || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
      transmission: "Manual",
      owner: "1st Owner",
      rcOwnerNumber: 1,
      location: selectedCity === "All Locations" ? "New Delhi" : selectedCity,
      bodyType: "Sedans",
      isFeatured: false,
    };
    addCar(newCar);
    navigate("/dashboard");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: URL.createObjectURL(file) });
    }
  };

  return (
    <>
      <TopHeader title={wizardStep === 0 ? "Sell Your Car" : STEPS[wizardStep-1].label} showBack />

      <main className="page-wrapper animate-fade-up">
        {wizardStep === 0 && (
          <div className="px-5 pt-6 pb-4">
            <p className="text-[10px] font-black text-on-surface-variant tracking-widest uppercase mb-2">
              New Listing
            </p>
            <h2 className="font-headline text-3xl font-black tracking-tight text-primary mb-2">
              Sell with Confidence
            </h2>
            <p className="font-body text-sm text-on-surface-variant mb-8">
              Our certified process gets you the best price and connects you with verified buyers.
            </p>

            {/* Steps Overview */}
            <div className="space-y-3 mb-8">
              {STEPS.map((step, i) => (
                <div
                  key={step.label}
                  className="bg-surface-container-lowest rounded-2xl p-4 editorial-shadow flex items-center gap-4 cursor-default"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center flex-none">
                    <Icon name={step.icon} filled size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-headline font-bold text-sm text-on-surface">{step.label}</p>
                    <p className="font-body text-xs text-on-surface-variant">{step.desc}</p>
                  </div>
                  <span className="font-headline font-black text-[10px] text-outline-variant">0{i + 1}</span>
                </div>
              ))}
            </div>

            <button
              className="w-full bg-secondary text-on-secondary py-4 rounded-full font-headline font-bold text-base btn-press flex items-center justify-center gap-2 mb-4"
              onClick={() => setWizardStep(1)}
            >
              <Icon name="add_circle" filled size={22} className="text-on-secondary" />
              Start Listing Now
            </button>
            <button
              className="w-full bg-surface-container text-on-surface-variant py-3.5 rounded-full font-headline font-semibold text-sm btn-press"
              onClick={() => navigate("/dashboard")}
            >
              View My Listings
            </button>
          </div>
        )}

        {wizardStep === 1 && (
          <div className="p-5">
            <h3 className="font-headline font-bold text-lg mb-4">Car Details</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Make (e.g., Honda)" value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} className="w-full bg-surface-container p-4 rounded-xl font-body text-sm" />
              <input type="text" placeholder="Model (e.g., City)" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full bg-surface-container p-4 rounded-xl font-body text-sm" />
              <input type="number" placeholder="Kilometers Driven" value={formData.km} onChange={e => setFormData({...formData, km: e.target.value})} className="w-full bg-surface-container p-4 rounded-xl font-body text-sm" />
              <select value={formData.fuel} onChange={e => setFormData({...formData, fuel: e.target.value})} className="w-full bg-surface-container p-4 rounded-xl font-body text-sm">
                <option>Petrol</option><option>Diesel</option><option>EV</option>
              </select>
            </div>
            <button onClick={() => setWizardStep(2)} className="w-full mt-8 bg-primary text-on-primary py-4 rounded-xl font-headline font-bold text-sm btn-press">Next: Upload Photos</button>
          </div>
        )}

        {wizardStep === 2 && (
          <div className="p-5">
            <h3 className="font-headline font-bold text-lg mb-4">Upload Photos</h3>
            <label className="border-2 border-dashed border-primary bg-primary/5 rounded-2xl flex flex-col items-center justify-center h-48 cursor-pointer overflow-hidden">
              {formData.image ? (
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Icon name="add_a_photo" size={32} className="text-primary mb-2" />
                  <span className="font-label text-sm text-primary font-bold">Tap to Upload Photo</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            <button onClick={() => setWizardStep(3)} className="w-full mt-8 bg-primary text-on-primary py-4 rounded-xl font-headline font-bold text-sm btn-press">Next: Set Price</button>
          </div>
        )}

        {wizardStep === 3 && (
          <div className="p-5">
            <h3 className="font-headline font-bold text-lg mb-4">Set Price</h3>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-headline font-bold text-on-surface">₹</span>
              <input type="number" placeholder="e.g., 550000" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-surface-container p-4 pl-10 rounded-xl font-headline text-lg" />
            </div>
            <p className="font-body text-xs text-on-surface-variant mt-2 text-center">Our AI suggests: ₹4,50,000 - ₹5,80,000</p>
            <button onClick={() => setWizardStep(4)} className="w-full mt-8 bg-primary text-on-primary py-4 rounded-xl font-headline font-bold text-sm btn-press">Next: Review & Publish</button>
          </div>
        )}

        {wizardStep === 4 && (
          <div className="p-5">
            <div className="bg-surface-container-low p-5 rounded-2xl editorial-shadow text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="check_circle" filled size={32} className="text-green-600" />
              </div>
              <h3 className="font-headline font-bold text-xl mb-2">Ready to list!</h3>
              <p className="font-body text-sm text-on-surface-variant mb-6">Your listing is complete and will be live on {selectedCity} marketplace once published.</p>
              
              <button onClick={handlePublish} className="w-full bg-secondary text-on-secondary py-4 rounded-full font-headline font-bold text-base btn-press">
                Publish Listing
              </button>
            </div>
          </div>
        )}

      </main>

      <BottomNav />
    </>
  );
};

export default Sell;
