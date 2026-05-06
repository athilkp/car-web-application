import { useNavigate, useLocation } from "react-router-dom";
import Icon from "./Icon";
import { useState, useEffect } from "react";
import { useLocationContext } from "../context/LocationContext";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

const CITIES = ["All Locations", "Maharashtra", "Delhi", "Karnataka", "Kerala", "Tamil Nadu"];

const TopHeader = ({ title, showBack = false, showSearch = true, rightSlot }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCity, setSelectedCity } = useLocationContext();
  const { user, login, isLoginModalOpen, openLoginModal, closeLoginModal } = useAuth();
  const { notifications, pushNotification } = useData();
  
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  
  // Modal states for multi-step dealer login
  const [dealerStep, setDealerStep] = useState(false); 
  const [dealerCompany, setDealerCompany] = useState("");

  const handleCloseModal = () => {
    closeLoginModal();
    setDealerStep(false);
    setDealerCompany("");
  };

  useEffect(() => {
    if (user && isLoginModalOpen) {
      handleCloseModal();
      navigate('/dashboard');
    }
  }, [user, isLoginModalOpen, navigate]);

  return (
    <>
      <header className="glass-nav fixed top-0 left-0 right-0 z-50 w-full shadow-sm shadow-blue-900/5 transition-all">
        <div className="flex justify-between items-center px-5 py-4 max-w-screen-xl mx-auto w-full">
          {/* Left Side: Logo & Back */}
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                className="btn-press flex items-center gap-1 text-on-surface"
                onClick={() => navigate(-1)}
              >
                <Icon name="arrow_back" size={22} />
              </button>
            )}
            <div 
              className="flex flex-col cursor-pointer" 
              onClick={() => navigate('/')}
            >
              <h1 className="font-headline font-black text-primary text-2xl tracking-tight leading-none">
                Motriva
              </h1>
              {user?.role === 'dealership' && (
                 <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-secondary mt-0.5 ml-0.5">
                   Dealership
                 </span>
              )}
            </div>
          </div>

          {/* Desktop Nav Links (hidden on mobile) */}
          {!showBack && (
            <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {(user?.role === 'dealership' 
                ? [
                    { label: "Sell Your Cars", path: "/sell" },
                    { label: "Your Listed Cars", path: "/dashboard" },
                    { label: "Buying From Others", path: "/search" }
                  ]
                : [
                    { label: "Home page", path: "/" },
                    { label: "Browse cars", path: "/search" },
                    { label: "Sell your car", path: "/sell" },
                    { label: "Profile", path: "/dashboard" }
                  ]
              ).map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`font-headline text-sm font-semibold transition-colors ${
                    location.pathname === item.path ? "text-secondary" : "text-on-surface hover:text-primary"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}

          {/* Right */}
          {rightSlot || (
            <div className="flex items-center gap-3">
              {!showBack && (
                <div className="relative">
                  <div 
                    className="flex items-center gap-1.5 bg-surface-container py-1.5 px-3 rounded-full cursor-pointer hover:bg-surface-container-high transition-colors"
                    onClick={() => setShowLocDropdown(!showLocDropdown)}
                  >
                    <Icon name="location_on" filled size={16} className="text-primary" />
                    <span className="font-headline font-bold text-xs text-on-surface tracking-tight hidden md:inline">
                      {selectedCity}
                    </span>
                  </div>
                  {showLocDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-40 bg-surface rounded-xl shadow-lg border border-surface-container-high overflow-hidden py-1">
                      {CITIES.map(city => (
                        <button 
                          key={city}
                          onClick={() => {
                            setSelectedCity(city);
                            setShowLocDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 font-body text-sm hover:bg-surface-container ${selectedCity === city ? 'font-bold text-primary' : 'text-on-surface-variant'}`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <button className="btn-press" onClick={() => navigate('/favorites')}>
                <Icon name="favorite" size={22} className="text-on-surface hover:text-red-500 transition-colors" />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button className="btn-press relative" onClick={() => setShowNotifDropdown(!showNotifDropdown)}>
                  <Icon name="notifications" size={22} className="text-on-surface hover:text-primary transition-colors" />
                  {notifications?.length > 0 && (
                    <div className="absolute top-1 right-2 w-2 h-2 bg-error rounded-full pointer-events-none" />
                  )}
                </button>
                {showNotifDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-surface rounded-2xl shadow-2xl border border-surface-container overflow-hidden z-[100] animate-fade-up">
                    <div className="p-3 bg-surface-container-low border-b border-outline-variant/20 flex justify-between items-center">
                      <span className="font-headline font-bold text-sm text-on-surface">Notifications</span>
                      <span className="font-body text-[10px] bg-primary text-on-primary px-2 py-0.5 rounded-full">{notifications?.length || 0} New</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto w-full">
                      {notifications && notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div key={n.id} className="px-4 py-3 border-b border-surface-container-high hover:bg-surface-container-lowest transition-colors flex gap-3 text-left">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-1">
                              <Icon name="local_offer" size={16} className="text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-headline font-semibold text-xs text-on-surface">{n.title}</p>
                              <p className="font-body text-[11px] text-on-surface-variant mt-0.5 leading-snug">{n.message}</p>
                              {n.type === "OFFER_RECEIVED" && (
                                <button 
                                  onClick={() => {
                                    pushNotification({
                                        type: "REPLY_INITIATED",
                                        targetUserId: n.buyerOwnerId,
                                        title: `Seller Responding`,
                                        message: `The seller of ${n.carName} is contacting you soon via WhatsApp!`,
                                        timestamp: Date.now()
                                    });
                                    const text = `Hello! I received your offer of ₹${n.offerAmt} for my ${n.carName} on Motriva. Let's discuss!`;
                                    window.open(`https://wa.me/${n.buyerPhone}?text=${encodeURIComponent(text)}`, "_blank");
                                  }}
                                  className="mt-2 text-[10px] uppercase font-headline font-bold text-tertiary flex items-center gap-1 hover:text-primary transition-colors btn-press"
                                >
                                  <Icon name="forum" size={12} />
                                  Reply via WhatsApp
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-on-surface-variant">
                          <Icon name="notifications_off" size={24} className="mb-2 opacity-50 mx-auto block" />
                          <p className="font-body text-xs">You're all caught up!</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Auth Button */}
              {!user ? (
                <button 
                  onClick={openLoginModal}
                  className="bg-primary text-on-primary font-headline font-bold text-xs px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
                >
                  Login
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center cursor-pointer"
                  title="Go to Dashboard"
                >
                   {user.photo ? (
                      <img src={user.photo} alt="Profile" className="w-full h-full rounded-full" />
                   ) : (
                      <Icon name="person" filled size={18} className="text-on-secondary-container" />
                   )}
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-up">
            
            {!dealerStep ? (
              /* Step 1: Role Selection */
              <div className="p-6 relative">
                <button 
                  className="absolute top-4 right-4 text-on-surface-variant hover:bg-surface-container rounded-full p-1"
                  onClick={handleCloseModal}
                >
                  <Icon name="close" size={24} />
                </button>
                
                <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center mb-4">
                  <Icon name="lock" filled size={24} className="text-primary" />
                </div>
                <h2 className="font-headline text-2xl font-black text-on-surface mb-2">Welcome Back</h2>
                <p className="font-body text-sm text-on-surface-variant mb-6">Choose how you want to use the marketplace today.</p>

                <div className="space-y-3">
                  <button 
                    onClick={async () => {
                      const res = await login('individual');
                      if (res.success) {
                        closeLoginModal();
                        navigate('/dashboard');
                      } else {
                        alert('Login failed: ' + res.error);
                      }
                    }}
                    className="w-full relative group overflow-hidden bg-surface-container-low hover:bg-primary-container/20 border border-outline-variant/40 hover:border-primary/50 transition-all rounded-2xl p-4 flex items-center gap-4 text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-none group-hover:scale-110 transition-transform">
                       <Icon name="person" filled size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-sm text-on-surface">Individual Buyer/Seller</h3>
                      <p className="font-body text-[11px] text-on-surface-variant">Sign in with Google to buy or list your personal car.</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setDealerStep(true)}
                    className="w-full relative group overflow-hidden bg-surface-container-low hover:bg-tertiary-container/20 border border-outline-variant/40 hover:border-tertiary/50 transition-all rounded-2xl p-4 flex items-center gap-4 text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center flex-none group-hover:scale-110 transition-transform">
                       <Icon name="storefront" filled size={20} className="text-tertiary" />
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-sm text-on-surface">Verified Dealership</h3>
                      <p className="font-body text-[11px] text-on-surface-variant">Access pro merchant tools with your Google Account.</p>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              /* Step 2: Dealership Company Name */
              <div className="p-6 relative">
                <button 
                  className="absolute top-4 left-4 text-on-surface-variant hover:bg-surface-container rounded-full p-1"
                  onClick={() => setDealerStep(false)}
                >
                  <Icon name="arrow_back" size={24} />
                </button>
                <button 
                  className="absolute top-4 right-4 text-on-surface-variant hover:bg-surface-container rounded-full p-1"
                  onClick={handleCloseModal}
                >
                  <Icon name="close" size={24} />
                </button>
                
                <div className="w-12 h-12 bg-tertiary-fixed rounded-xl flex items-center justify-center mb-4 mt-8">
                  <Icon name="business_center" filled size={24} className="text-tertiary" />
                </div>
                <h2 className="font-headline text-2xl font-black text-on-surface mb-2">Dealership Identity</h2>
                <p className="font-body text-sm text-on-surface-variant mb-6">Enter your official dealership name to initialize your pro dashboard.</p>

                <div className="mb-6">
                  <label htmlFor="companyName" className="font-body text-[10px] uppercase font-bold text-on-surface-variant/80 tracking-widest pl-1 mb-1 block">
                    Company Name
                  </label>
                  <input 
                    id="companyName"
                    type="text" 
                    placeholder="e.g., Royal Motors Pvt Ltd" 
                    value={dealerCompany} 
                    onChange={(e) => setDealerCompany(e.target.value)}
                    autoFocus
                    className="w-full bg-surface-container border border-outline-variant/30 rounded-xl p-4 font-body text-sm text-on-surface outline-none focus:ring-2 focus:ring-tertiary/50 transition-all"
                  />
                </div>

                <button 
                  disabled={!dealerCompany.trim()}
                  onClick={async () => {
                    const res = await login('dealership', dealerCompany.trim());
                    if (res.success) {
                      handleCloseModal();
                      navigate('/dashboard');
                    } else {
                      alert('Login failed: ' + res.error);
                    }
                  }}
                  className="w-full bg-[#1a1a1a] text-white py-4 rounded-full font-headline font-black text-sm btn-press shadow-xl disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  <Icon name="login" size={18} />
                  Login through Google
                </button>

                <p className="font-body text-[10px] text-on-surface-variant text-center mt-4">
                  Existing dealers with the same email will have their profiles linked.
                </p>
              </div>
            )}

            <div className="bg-surface-container-lowest p-4 text-center border-t border-outline-variant/20">
               <p className="font-body text-[10px] text-on-surface-variant">
                 By continuing, you agree to our Terms of Service and Privacy Policy.
               </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopHeader;
