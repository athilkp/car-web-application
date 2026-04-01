import { useNavigate, useLocation } from "react-router-dom";
import Icon from "./Icon";
import { useState } from "react";
import { useLocationContext } from "../context/LocationContext";
import { useAuth } from "../context/AuthContext";

const CITIES = ["All Locations", "New Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad"];

const TopHeader = ({ title, showBack = false, showSearch = true, rightSlot }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCity, setSelectedCity } = useLocationContext();
  const { user, login } = useAuth();
  
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // If user clicks a protected route and isn't logged in, they get intercepted in those components.
  // We can just provide the login button here.

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
            <h1 
              className="font-headline font-black text-primary text-2xl tracking-tight cursor-pointer" 
              onClick={() => navigate('/')}
            >
              Motriva
            </h1>
          </div>

          {/* Desktop Nav Links (hidden on mobile) */}
          {!showBack && (
            <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {[
                { label: "Home", path: "/" },
                { label: "Search", path: "/search" },
                { label: "Sell", path: "/sell" },
                { label: "Profile", path: "/dashboard" }
              ].map((item) => (
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
              {showSearch && (
                <button className="btn-press" onClick={() => navigate('/search')}>
                  <Icon name="search" size={22} className="text-on-surface" />
                </button>
              )}
              
              {/* Auth Button */}
              {!user ? (
                <button 
                  onClick={() => setShowLoginModal(true)}
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
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-up">
            <div className="p-6 relative">
              <button 
                className="absolute top-4 right-4 text-on-surface-variant hover:bg-surface-container rounded-full p-1"
                onClick={() => setShowLoginModal(false)}
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
                  onClick={() => {
                    login('individual');
                    setShowLoginModal(false);
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
                  onClick={() => {
                    login('dealership');
                    setShowLoginModal(false);
                  }}
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
            <div className="bg-surface-container-lowest p-4 text-center border-t border-outline-variant/20">
               <p className="font-body text-[10px] text-on-surface-variant">
                 By continuing via Google Sign-In, you agree to our Terms of Service and Privacy Policy.
               </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopHeader;
