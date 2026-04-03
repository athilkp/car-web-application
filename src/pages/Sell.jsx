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
  { icon: "description", label: "Description & Features", desc: "Short description and highlights" },
  { icon: "camera_alt", label: "Upload Photos", desc: "Upload exactly 4 to 6 photos" },
  { icon: "build", label: "Service History", desc: "Maintenance records for buyer trust" },
  { icon: "payments", label: "Set Price", desc: "Set your selling price" },
  { icon: "verified_user", label: "Publish", desc: "Ready for buyers" },
];

const CAR_FEATURES = ["Sunroof", "Premium Audio", "Cruise Control", "360 Camera", "Ventilated Seats", "ADAS", "Alloy Wheels", "Automatic Climate Control"];

const Sell = () => {
  const navigate = useNavigate();
  const { user, login, openLoginModal } = useAuth();
  const { addCar } = useData();
  const { selectedCity } = useLocationContext();
  const isDealership = user?.role === 'dealership';


  const [wizardStep, setWizardStep] = useState(0); // 0 = CTA, 1+ = steps
  const [customFeature, setCustomFeature] = useState("");
  const [formData, setFormData] = useState({
    make: "", model: "", km: "", fuel: "Petrol", price: "", images: [],
    year: "", owners: "1st", description: "", features: [],
    serviceHistory: [], lastServiceKm: "", lastServiceDate: "", anyAccidents: "No"
  });

  if (!user) return (
    <>
      <TopHeader title="Sell Your Car" />
      <main className="page-wrapper flex flex-col items-center justify-center p-5 text-center min-h-[80vh]">
         <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="lock" size={36} className="text-secondary" />
         </div>
         <h2 className="font-headline text-2xl font-black mb-2 text-on-surface">Sign In Required</h2>
         <p className="font-body text-sm text-on-surface-variant mb-8 px-4">Please log in to list your car on the Motriva marketplace.</p>
         <button onClick={openLoginModal} className="bg-primary text-on-primary font-headline font-bold text-base py-4 w-full rounded-full flex items-center justify-center gap-2 btn-press">
           Sign In with Google
         </button>
      </main>
      <BottomNav />
    </>
  );

  const handlePublish = () => {
    const newCar = {
      id: "listing-" + Date.now(),
      make: formData.make || "Custom",
      model: formData.model || "Car",
      year: parseInt(formData.year || new Date().getFullYear(), 10),
      modelYear: parseInt(formData.year || new Date().getFullYear(), 10),
      km: formData.km || "0",
      kmRaw: parseInt(formData.km || "0", 10),
      fuel: formData.fuel,
      price: "₹" + formData.price,
      priceRaw: parseInt(formData.price.replace(/\D/g,'') || "0", 10),
      images: formData.images.length > 0 ? formData.images : ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"],
      image: formData.images.length > 0 ? formData.images[0] : "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
      description: formData.description,
      features: formData.features,
      owner: formData.owners,
      location: selectedCity === "All Locations" ? "National" : selectedCity,
      bodyType: "Sedans",
      badge: isDealership ? "DEALER" : "NEW LISTING",
      isDealership: isDealership,
      sellerOwner: user.uid || user.id,
      // Service History
      serviceHistory: formData.serviceHistory,
      lastServiceKm: formData.lastServiceKm,
      lastServiceDate: formData.lastServiceDate,
      anyAccidents: formData.anyAccidents,
    };
    addCar(newCar);
    navigate("/dashboard");
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    setFormData(prev => {
      const remainingSlots = 6 - prev.images.length;
      const allowedFiles = files.slice(0, remainingSlots);
      const newImages = allowedFiles.map(file => URL.createObjectURL(file));
      return { ...prev, images: [...prev.images, ...newImages].slice(0, 6) };
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev, images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const toggleFeature = (feat) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feat) ? prev.features.filter(f => f !== feat) : [...prev.features, feat]
    }));
  };

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/);
    if (words.length <= 100) {
      setFormData({ ...formData, description: text });
    }
  };

  const wordCount = formData.description.trim() === "" ? 0 : formData.description.trim().split(/\s+/).length;

  return (
    <>
      <TopHeader title={wizardStep === 0 ? "Sell Your Car" : STEPS[wizardStep-1].label} showBack />

      <main className="page-wrapper animate-fade-up" style={{ paddingBottom: 100 }}>
        {wizardStep === 0 && (
          <div className="px-5 pt-6 pb-4 text-center h-full flex flex-col justify-center mt-12">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
               <Icon name="sell" filled size={48} className="text-primary" />
            </div>
            <h2 className="font-headline text-3xl font-black tracking-tight text-on-surface mb-2">
              Sell your car fast.
            </h2>
            <p className="font-body text-sm text-on-surface-variant mb-12">
              List your car directly to our premium buyer network in just a few verified steps.
            </p>

            <button
              className="w-full bg-secondary text-on-secondary py-4 rounded-full font-headline font-bold text-base btn-press flex items-center justify-center gap-2 mb-4"
              onClick={() => setWizardStep(1)}
            >
              <Icon name="add" size={24} className="text-on-secondary" />
              List Your Car
            </button>
            <button
              className="w-full text-secondary py-3.5 rounded-full font-headline font-bold text-sm btn-press"
              onClick={() => navigate("/dashboard")}
            >
              View My Existing Listings
            </button>
          </div>
        )}

        {wizardStep === 1 && (
          <div className="p-5">
            <h3 className="font-headline font-bold text-lg mb-4 text-on-surface">Step 1: Car Details</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Brand / Make (e.g., Honda)" value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} className="w-full bg-surface-container p-4 rounded-xl font-body text-sm outline-none focus:ring-2 focus:ring-primary/40" />
              <input type="text" placeholder="Model (e.g., City)" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full bg-surface-container p-4 rounded-xl font-body text-sm outline-none focus:ring-2 focus:ring-primary/40" />
              <div className="flex gap-4">
                 <input type="number" placeholder="Year" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="flex-1 bg-surface-container p-4 rounded-xl font-body text-sm outline-none focus:ring-2 focus:ring-primary/40" />
                 <select value={formData.owners} onChange={e => setFormData({...formData, owners: e.target.value})} className="flex-1 bg-surface-container p-4 rounded-xl font-body text-sm outline-none focus:ring-2 focus:ring-primary/40">
                   <option value="1st">1st Owner</option>
                   <option value="2nd">2nd Owner</option>
                   <option value="3rd">3rd Owner</option>
                   <option value="4th+">4th+ Owner</option>
                 </select>
              </div>
              <input type="number" placeholder="Kilometers Driven" value={formData.km} onChange={e => setFormData({...formData, km: e.target.value})} className="w-full bg-surface-container p-4 rounded-xl font-body text-sm outline-none focus:ring-2 focus:ring-primary/40" />
              <select value={formData.fuel} onChange={e => setFormData({...formData, fuel: e.target.value})} className="w-full bg-surface-container p-4 rounded-xl font-body text-sm outline-none focus:ring-2 focus:ring-primary/40">
                <option>Petrol</option><option>Diesel</option><option>Electric</option>
              </select>
            </div>
            <button 
              disabled={!formData.make || !formData.model || !formData.year} 
              onClick={() => setWizardStep(2)} 
              className="w-full mt-8 bg-primary text-on-primary py-4 rounded-xl font-headline font-bold text-sm btn-press disabled:opacity-50"
            >
              Next: Description
            </button>
          </div>
        )}

        {wizardStep === 2 && (
          <div className="p-5">
            <h3 className="font-headline font-bold text-lg mb-2 text-on-surface">Step 2: Description & Features</h3>
            
            <p className="font-body text-xs font-bold text-on-surface-variant mb-2 mt-4">Features (Select all that apply)</p>
            <div className="flex flex-wrap gap-2 mb-6">
               {CAR_FEATURES.map(feat => (
                 <button 
                   key={feat}
                   onClick={() => toggleFeature(feat)}
                   className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${formData.features.includes(feat) ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface-variant border border-outline-variant/30'}`}
                 >
                   {feat}
                 </button>
               ))}
               {formData.features.filter(f => !CAR_FEATURES.includes(f)).map(feat => (
                 <button 
                   key={feat}
                   onClick={() => toggleFeature(feat)}
                   className="px-3 py-1.5 rounded-full text-xs font-bold transition-colors bg-secondary text-on-secondary"
                 >
                   {feat}
                 </button>
               ))}
               <div className="flex gap-2 w-full mt-2">
                 <input type="text" value={customFeature} onChange={e => setCustomFeature(e.target.value)} placeholder="Add custom feature..." className="flex-1 bg-surface-container px-4 py-2 rounded-xl font-body text-sm outline-none focus:ring-2 focus:ring-primary/40" />
                 <button onClick={() => { if(customFeature.trim()){ toggleFeature(customFeature.trim()); setCustomFeature(''); } }} className="bg-secondary text-on-secondary px-4 py-2 rounded-xl font-bold text-xs btn-press">Add</button>
               </div>
            </div>

            <p className="font-body text-xs font-bold text-on-surface-variant mb-2">Short Description (Max 100 words)</p>
            <textarea 
              rows="5"
              placeholder="Tell buyers why your car is special..."
              value={formData.description}
              onChange={handleDescriptionChange}
              className="w-full bg-surface-container p-4 rounded-xl font-body text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
            <p className="text-right text-[10px] text-on-surface-variant mt-1 font-bold">{wordCount} / 100 words</p>

            <div className="flex gap-3 mt-8">
               <button onClick={() => setWizardStep(1)} className="flex-1 bg-surface-container text-on-surface py-4 rounded-xl font-headline font-bold text-sm btn-press">Back</button>
               <button onClick={() => setWizardStep(3)} className="flex-[2] bg-primary text-on-primary py-4 rounded-xl font-headline font-bold text-sm btn-press">Next: Photos</button>
            </div>
          </div>
        )}

        {wizardStep === 3 && (
          <div className="p-5">
            <h3 className="font-headline font-bold text-lg mb-1 text-on-surface">Step 3: Upload Photos</h3>
            <p className="font-body text-xs text-on-surface-variant mb-4">Required: Min 4, Max 6 photos of your car.</p>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {formData.images.map((imgUrl, idx) => (
                 <div key={idx} className="relative h-28 rounded-xl overflow-hidden bg-surface-container border border-outline-variant/20 shadow-sm">
                   <img src={imgUrl} alt={`Car upload ${idx+1}`} className="w-full h-full object-cover" />
                   <button 
                     onClick={() => removeImage(idx)}
                     className="absolute top-1 right-1 w-6 h-6 bg-error text-on-error rounded-full flex items-center justify-center font-bold"
                   >
                      <Icon name="close" size={14} />
                   </button>
                 </div>
              ))}
              
              {formData.images.length < 6 && (
                <label className="h-28 border-2 border-dashed border-primary/50 bg-primary/5 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors">
                  <Icon name="add_a_photo" size={24} className="text-primary mb-1" />
                  <span className="font-label text-[10px] text-primary font-bold uppercase tracking-wider">Add Photo</span>
                  <p className="text-[9px] text-on-surface-variant mt-1">{formData.images.length}/6 uploaded</p>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>

            <div className="flex gap-3 mt-8">
               <button onClick={() => setWizardStep(2)} className="flex-1 bg-surface-container text-on-surface py-4 rounded-xl font-headline font-bold text-sm btn-press">Back</button>
               <button 
                 disabled={formData.images.length < 4}
                 onClick={() => setWizardStep(4)} 
                 className="flex-[2] bg-primary text-on-primary py-4 rounded-xl font-headline font-bold text-sm btn-press disabled:opacity-50"
               >
                 Next: Service History
               </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Service History ─────────────────── */}
        {wizardStep === 4 && (
          <div className="p-5">
            <h3 className="font-headline font-bold text-lg mb-1 text-on-surface">Step 4: Service History</h3>
            <p className="font-body text-xs text-on-surface-variant mb-5">Adding service records builds trust and can increase buyer confidence significantly.</p>

            <div className="space-y-4">
              {/* Last Service KM */}
              <div>
                <label className="font-body text-xs font-bold text-on-surface-variant mb-1 block">Last Service at (KM)</label>
                <input
                  type="number"
                  placeholder="e.g. 45000"
                  value={formData.lastServiceKm}
                  onChange={e => setFormData({...formData, lastServiceKm: e.target.value})}
                  className="w-full bg-surface-container p-4 rounded-xl font-body text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              {/* Last Service Date */}
              <div>
                <label className="font-body text-xs font-bold text-on-surface-variant mb-1 block">Last Service Date</label>
                <input
                  type="date"
                  value={formData.lastServiceDate}
                  onChange={e => setFormData({...formData, lastServiceDate: e.target.value})}
                  className="w-full bg-surface-container p-4 rounded-xl font-body text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              {/* Accidents */}
              <div>
                <label className="font-body text-xs font-bold text-on-surface-variant mb-2 block">Any accident history?</label>
                <div className="flex gap-3">
                  {["No", "Minor", "Major"].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFormData({...formData, anyAccidents: opt})}
                      className={`flex-1 py-3 rounded-xl font-headline font-bold text-sm btn-press transition-colors ${
                        formData.anyAccidents === opt
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container text-on-surface-variant border border-outline-variant/30'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              {/* Service Record Tags */}
              <div>
                <label className="font-body text-xs font-bold text-on-surface-variant mb-2 block">Service Records Available</label>
                <div className="flex flex-wrap gap-2">
                  {["Manufacturer Service Book", "Dealer Stamped", "Invoice Records", "No Records"].map(rec => (
                    <button
                      key={rec}
                      onClick={() => {
                        const existing = formData.serviceHistory;
                        setFormData({...formData, serviceHistory: existing.includes(rec) ? existing.filter(r => r !== rec) : [...existing, rec]});
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                        formData.serviceHistory.includes(rec)
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-surface-container text-on-surface-variant border border-outline-variant/30'
                      }`}
                    >
                      {rec}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setWizardStep(3)} className="flex-1 bg-surface-container text-on-surface py-4 rounded-xl font-headline font-bold text-sm btn-press">Back</button>
              <button onClick={() => setWizardStep(5)} className="flex-[2] bg-primary text-on-primary py-4 rounded-xl font-headline font-bold text-sm btn-press">Next: Set Price</button>
            </div>
          </div>
        )}

        {/* ── Step 5: Price ──────────────────────────── */}
        {wizardStep === 5 && (
          <div className="p-5">
            <h3 className="font-headline font-bold text-lg mb-4 text-on-surface">Step 5: Set Price</h3>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-headline font-bold text-on-surface">₹</span>
              <input type="number" placeholder="e.g., 550000" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-surface-container p-4 pl-10 rounded-xl font-headline text-lg outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div className="flex gap-3 mt-8">
               <button onClick={() => setWizardStep(4)} className="flex-1 bg-surface-container text-on-surface py-4 rounded-xl font-headline font-bold text-sm btn-press">Back</button>
               <button onClick={() => setWizardStep(6)} className="flex-[2] bg-primary text-on-primary py-4 rounded-xl font-headline font-bold text-sm btn-press">Finalize</button>
            </div>
          </div>
        )}

        {/* ── Step 6: Publish ────────────────────────── */}
        {wizardStep === 6 && (
          <div className="p-5 flex flex-col justify-center h-full text-center mt-8">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Icon name="check_circle" filled size={40} className="text-green-600" />
            </div>
            <h3 className="font-headline font-bold text-2xl mb-2 text-on-surface">Ready to go live!</h3>
            <p className="font-body text-sm text-on-surface-variant mb-8 px-4">
              Your {formData.make} {formData.model} with {formData.images.length} photos, selected features, and service history will be listed on the verified Motriva marketplace immediately.
            </p>
            <button onClick={handlePublish} className="w-full bg-secondary text-on-secondary py-4 rounded-full font-headline font-bold text-base btn-press">
              Publish Listing Immediately
            </button>
          </div>
        )}

      </main>

      <BottomNav />
    </>
  );
};

export default Sell;
