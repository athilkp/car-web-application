import TopHeader from "../components/TopHeader";
import BottomNav from "../components/BottomNav";
import Icon from "../components/Icon";
import { sellerListings } from "../data/cars";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { useData } from "../context/DataContext";

/* ── Dashboard Page ────────────────────────────────────── */
const Dashboard = () => {
  const { user, login, logout, updateUserProfile, openLoginModal } = useAuth();
  const { cars, favorites, notifications, deleteCar, updateCar, updateNotificationStatus } = useData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  if (!user) return (
    <>
      <TopHeader title="Motriva Profile" />
      <main className="page-wrapper flex flex-col items-center justify-center p-5 text-center min-h-[80vh]">
         <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="lock" size={36} className="text-secondary" />
         </div>
         <h2 className="font-headline text-2xl font-black mb-2 text-on-surface">Sign In Required</h2>
         <p className="font-body text-sm text-on-surface-variant mb-8 px-4">Please log in to manage your vehicle listings, check negotiation offers, and access your verified profile.</p>
         <button onClick={openLoginModal} className="bg-primary text-on-primary font-headline font-bold text-base py-4 w-full rounded-full flex items-center justify-center gap-2 btn-press">
           Sign In with Google
         </button>
      </main>
      <BottomNav />
    </>
  );

  const isDealership = user.role === 'dealership';
  const isKycVerified = user.kycVerified;

  const myFavorites = cars.filter(c => favorites.includes(c.id));
  
  // Central filtering logic for dashboard
  const filterListings = (list) => {
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(c => 
      c.make.toLowerCase().includes(q) || 
      c.model.toLowerCase().includes(q) || 
      c.price.toLowerCase().includes(q)
    );
  };

  const activeListings = filterListings(cars.filter(c => c.id.startsWith("listing-") && c.badge !== 'SOLD'));
  const soldListings = filterListings(cars.filter(c => c.id.startsWith("listing-") && c.badge === 'SOLD'));

  const handlePriceAdj = (listing) => {
    const newPrice = window.prompt(`Adjust Price for ${listing.make} ${listing.model}:`, listing.price);
    if (newPrice && newPrice !== listing.price) {
      updateCar(listing.id, { price: newPrice });
    }
  };

  const handleBoost = (listing) => {
    const isFeatured = listing.isFeatured;
    updateCar(listing.id, { isFeatured: !isFeatured });
    alert(isFeatured ? "Listing boosted to top!" : "Boost removed.");
  };

  const handleShare = (listing) => {
    const text = `Check out this ${listing.make} ${listing.model} on Motriva!\nPrice: ${listing.price}\nLocation: ${listing.location}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  /* ── Dealer Dashboard ─────────────────────────────── */
  if (isDealership) {
    const offerNotifs   = notifications.filter(n => n.type === 'OFFER_RECEIVED');
    const waNotifs      = notifications.filter(n => n.type === 'WHATSAPP_QUERY');
    const allEnquiries  = notifications; // show everything in unified inbox

    return (
      <>
        <TopHeader
          rightSlot={
            <div className="flex items-center gap-3">
              <div
                onClick={logout}
                className="w-8 h-8 rounded-full bg-[#2c2c2c]/10 flex items-center justify-center cursor-pointer hover:bg-[#2c2c2c]/20 transition-colors"
                title="Logout"
              >
                <Icon name="logout" filled size={18} className="text-[#2c2c2c]" />
              </div>
            </div>
          }
        />

        <main className="page-wrapper animate-fade-up" style={{ paddingBottom: 100 }}>

          {/* ── Dealer Identity Strip ─────────── */}
          <div className="px-5 pt-6 pb-6 mb-6 border-b border-[#e2e2e2] bg-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-black tracking-[0.18em] text-[#5a5a5a]">Motriva Dealership</span>
                </div>
                <h2 className="font-headline text-3xl font-black tracking-tight text-[#1a1a1a] mb-1">
                  {user.companyName || user.name}
                </h2>
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="email" size={13} className="text-[#888]" />
                  <span className="font-body text-xs text-[#666]">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="bg-[#1a1a1a] text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1">
                    <Icon name="storefront" filled size={12} className="text-white" /> Verified Dealer
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider ${isKycVerified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {isKycVerified ? '✓ KYC Approved' : '⚠ KYC Pending'}
                  </span>
                </div>
              </div>
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center text-white font-headline font-black text-xl shadow-lg">
                {(user.companyName || user.name || 'D').charAt(0).toUpperCase()}
              </div>
            </div>

            {/* BI Analytics Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {[
                { 
                  label: 'Inventory Value', 
                  val: `₹${(activeListings.reduce((acc, c) => acc + (c.priceRaw || 0), 0) / 10000000).toFixed(2)} Cr`, 
                  icon: 'payments',
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50'
                },
                { 
                  label: 'Market Reach',    
                  val: activeListings.reduce((acc, c) => acc + (c.viewCount || 0), 0), 
                  icon: 'visibility',
                  color: 'text-blue-600',
                  bg: 'bg-blue-50'
                },
                { 
                  label: 'Avg. Enquiry',    
                  val: (allEnquiries.length / Math.max(activeListings.length, 1)).toFixed(1), 
                  icon: 'trending_up',
                  color: 'text-purple-600',
                  bg: 'bg-purple-50'
                },
                { 
                  label: 'Sold Units',      
                  val: soldListings.length,  
                  icon: 'check_circle',
                  color: 'text-amber-600',
                  bg: 'bg-amber-50'
                },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-black/5 shadow-sm`}>
                  <div className="flex justify-between items-start mb-2">
                    <Icon name={s.icon} size={20} className={s.color} />
                    <Icon name="north_east" size={12} className="text-black/20" />
                  </div>
                  <p className="font-headline font-black text-lg text-[#1a1a1a]">{s.val}</p>
                  <p className="font-body text-[9px] text-[#888] uppercase tracking-widest font-black">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Enquiries & Negotiations Inbox ─── */}
          <div className="px-5 mb-8">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="font-headline font-bold text-lg text-[#1a1a1a]">Sales Inbox</h3>
                <p className="font-body text-xs text-[#888]">Active leads & price negotiations</p>
              </div>
              <div className="flex gap-1.5 p-1 bg-black/5 rounded-full">
                {['All', 'Offers'].map(t => (
                  <button key={t} className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${t === 'All' ? 'bg-white text-black shadow-sm' : 'text-black/40'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {allEnquiries.length > 0 ? (
              <div className="space-y-3">
                {allEnquiries.map((notif, index) => (
                  <div key={index} className="bg-white p-4 rounded-2xl border border-[#e0e0e0] shadow-sm flex gap-4 items-start relative overflow-hidden group">
                    {notif.replied && (
                      <div className="absolute top-0 right-0 bg-emerald-500 text-white p-1 rounded-bl-xl">
                        <Icon name="check" size={14} />
                      </div>
                    )}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-none mt-0.5 ${notif.type === 'WHATSAPP_QUERY' ? 'bg-[#25D366]/10' : 'bg-[#2c2c2c]/10'}`}>
                      <Icon
                        name={notif.type === 'WHATSAPP_QUERY' ? 'forum' : 'local_offer'}
                        filled size={20}
                        className={notif.type === 'WHATSAPP_QUERY' ? 'text-[#25D366]' : 'text-[#2c2c2c]'}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-headline font-bold text-sm text-[#1a1a1a]">{notif.title}</h4>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full flex-none ${notif.type === 'WHATSAPP_QUERY' ? 'bg-[#25D366]/10 text-[#128C7E]' : 'bg-[#2c2c2c]/10 text-[#2c2c2c]'}`}>
                          {notif.type === 'WHATSAPP_QUERY' ? 'WhatsApp' : 'Offer'}
                        </span>
                      </div>
                      <p className="font-body text-xs text-[#666] my-1 line-clamp-2">{notif.message}</p>
                      {notif.offerAmt && (
                        <div className="flex items-center gap-2 mb-2">
                           <p className="font-headline font-black text-sm text-[#1a1a1a]">
                            ₹{notif.offerAmt}
                           </p>
                           <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-black tracking-tighter uppercase">High Intent</span>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          window.open(`https://wa.me/${notif.buyerPhone || '919000000000'}`, '_blank');
                          updateNotificationStatus(notif.id, { replied: true });
                        }}
                        className="mt-1 text-[#25D366] font-bold text-xs flex items-center gap-1.5 bg-[#25D366]/10 px-3 py-1.5 rounded-full w-fit btn-press border border-[#25D366]/20 group-hover:bg-[#25D366] group-hover:text-white transition-all"
                      >
                        <Icon name="forum" filled size={12} />
                        {notif.replied ? 'Contact Again' : 'Reply via WhatsApp'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#f6f6f6] p-8 rounded-2xl border border-dashed border-[#ccc] text-center text-[#888]">
                <Icon name="inbox" size={36} className="opacity-40 mb-3" />
                <p className="font-body text-sm font-bold text-[#555]">No enquiries yet.</p>
                <p className="font-body text-xs mt-1">Offers and WhatsApp queries from buyers will appear here.</p>
              </div>
            )}
          </div>

          {/* ── Active Inventory ─────────────────── */}
          <div className="px-5 mb-8">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-headline font-bold text-lg text-[#1a1a1a]">Active Inventory</h3>
              <button
                onClick={() => navigate('/sell')}
                className="text-[#2c2c2c] font-bold text-xs bg-[#2c2c2c]/10 px-3 py-1.5 rounded-full btn-press border border-[#2c2c2c]/10"
              >
                + List a Car
              </button>
            </div>
            
            {/* Pro Search Bar */}
            <div className="relative mb-4 mt-2">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Icon name="search" size={16} className="text-[#888]" />
              </div>
              <input 
                type="text" 
                placeholder="Find in inventory (Make, Model, Price)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f6f6f6] border border-[#e2e2e2] rounded-xl py-2.5 pl-10 pr-4 font-body text-xs text-[#1a1a1a] outline-none focus:ring-2 focus:ring-[#1a1a1a]/10 transition-all shadow-inner"
              />
            </div>

            {activeListings.length > 0 ? (
              <div className="space-y-3">
                {activeListings.map(listing => (
                  <div key={listing.id} className="bg-white rounded-2xl overflow-hidden border border-[#e0e0e0] shadow-sm flex gap-3 p-3 relative">
                    {listing.badge === 'RESERVED' && (
                      <div className="absolute top-3 right-3 bg-amber-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full z-10 shadow-sm uppercase tracking-widest">
                        Reserved
                      </div>
                    )}
                    {/* thumb */}
                    <div className="w-24 h-20 rounded-xl overflow-hidden flex-none bg-[#f0f0f0]">
                      <img
                        src={(listing.images && listing.images[0]) || listing.image || ''}
                        alt={listing.model}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-headline font-bold text-sm text-[#1a1a1a] truncate">{listing.make} {listing.model}</h4>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-body text-[10px] text-[#888]">{listing.year} · {listing.km} km</p>
                        <span className="w-1 h-1 bg-[#ccc] rounded-full" />
                        <div className="flex items-center gap-1">
                          <Icon name="visibility" size={10} className="text-[#888]" />
                          <span className="font-body text-[10px] text-[#888] font-bold">{listing.viewCount || 0} views</span>
                        </div>
                      </div>
                      <p className="font-headline font-black text-sm text-[#1a1a1a] mt-0.5">{listing.price}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <div className={`flex items-center gap-1 ${listing.serviceHistory && listing.serviceHistory.length > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          <Icon name={listing.serviceHistory && listing.serviceHistory.length > 0 ? 'check_circle' : 'error_outline'} size={12} />
                          <span className="text-[9px] font-black uppercase tracking-tighter">
                            {listing.serviceHistory && listing.serviceHistory.length > 0 ? 'Service Logs OK' : 'No Service Logs'}
                          </span>
                        </div>
                        {(!listing.anyAccidents || listing.anyAccidents === 'No') && listing.serviceHistory?.length > 0 && (
                          <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-black tracking-tighter uppercase border border-blue-100">Certified</span>
                        )}
                      </div>

                      {/* Dashboard Pro Action Row */}
                      <div className="flex gap-2 mt-4 pt-3 border-t border-[#f0f0f0]">
                        <button
                          onClick={() => { if (window.confirm('Mark as SOLD?')) updateCar(listing.id, { badge: 'SOLD', badgeType: 'alert' }); }}
                          className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider btn-press border border-emerald-100/50"
                        >
                          Sold
                        </button>
                        
                        <button
                          onClick={() => handleBoost(listing)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider btn-press border flex items-center gap-1 ${listing.isFeatured ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-white text-[#555] border-[#ddd]'}`}
                        >
                          <Icon name="bolt" size={11} filled={listing.isFeatured} />
                          {listing.isFeatured ? 'Boosted' : 'Boost'}
                        </button>

                        <button
                          onClick={() => handlePriceAdj(listing)}
                          className="bg-white text-[#555] px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider btn-press border border-[#ddd] flex items-center gap-1"
                        >
                          <Icon name="edit" size={11} />
                          Price
                        </button>

                        <div className="ml-auto flex gap-2">
                          <button
                            onClick={() => handleShare(listing)}
                            className="w-8 h-8 rounded-lg bg-[#25D366]/10 text-[#128C7E] flex items-center justify-center btn-press border border-[#25D366]/20"
                            title="Share to WhatsApp"
                          >
                            <Icon name="share" size={13} />
                          </button>
                          <button
                           onClick={() => { 
                             const isReserved = listing.badge === 'RESERVED';
                             updateCar(listing.id, { 
                               badge: isReserved ? '' : 'RESERVED', 
                               badgeType: isReserved ? '' : 'warning' 
                             }); 
                           }}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center btn-press border ${listing.badge === 'RESERVED' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-white text-[#555] border-[#ddd]'}`}
                            title={listing.badge === 'RESERVED' ? 'Unreserve' : 'Reserve'}
                          >
                            <Icon name="event_seat" size={13} filled={listing.badge === 'RESERVED'} />
                          </button>
                          <button
                            onClick={() => { const a = window.prompt("Type 'remove' to delete:"); if (a?.trim().toLowerCase() === 'remove') deleteCar(listing.id); }}
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center btn-press border border-red-100"
                            title="Delete"
                          >
                            <Icon name="delete" size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#f6f6f6] p-6 rounded-2xl border border-dashed border-[#ccc] text-center text-[#888]" onClick={() => navigate('/sell')}>
                <Icon name="add_circle" size={32} className="opacity-40 mb-2" />
                <p className="font-body text-sm font-bold text-[#555]">No active inventory.</p>
                <p className="font-body text-xs mt-1">Tap to list your first vehicle.</p>
              </div>
            )}
          </div>

          {/* ── Sold History ─────────────────────── */}
          {soldListings.length > 0 && (
            <div className="px-5 mb-8">
              <h3 className="font-headline font-bold text-lg text-[#1a1a1a] mb-4">Sold History</h3>
              <div className="space-y-3">
                {soldListings.map(listing => (
                  <div key={listing.id} className="bg-white rounded-2xl overflow-hidden border border-[#e0e0e0] shadow-sm flex gap-3 p-3 opacity-70">
                    <div className="w-24 h-20 rounded-xl overflow-hidden flex-none bg-[#f0f0f0] grayscale relative">
                      <img src={(listing.images && listing.images[0]) || listing.image || ''} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="text-white text-[9px] font-black bg-[#ff3b30] px-2 py-0.5 rounded-full -rotate-12">SOLD</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-headline font-bold text-sm text-[#1a1a1a] line-through truncate">{listing.make} {listing.model}</h4>
                      <p className="font-body text-[10px] text-[#888]">{listing.year} · {listing.km} km</p>
                      <p className="font-headline font-black text-sm text-[#888] mt-0.5">{listing.price}</p>
                      <button
                        onClick={() => { if (window.confirm('Restore to active inventory?')) updateCar(listing.id, { badge: '', badgeType: '' }); }}
                        className="mt-2 text-[10px] font-bold px-3 py-1 rounded-full bg-[#f0f0f0] text-[#555] btn-press border border-[#ddd]"
                      >
                        Revert to Active
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
        <BottomNav />
      </>
    );
  }

  const handleKycUpload = async () => {
    alert("Simulating secure document upload securely to Firestore Backend...");
    await updateUserProfile({ kycVerified: true, documentsPending: false });
  };

  return (
    <>
      <TopHeader
        title="Motriva Profile"
        rightSlot={
          <div className="flex items-center gap-3">
            <div 
              onClick={logout}
              className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors"
              title="Logout"
            >
              <Icon name="logout" filled size={18} className="text-on-primary" />
            </div>
          </div>
        }
      />

      <main className="page-wrapper animate-fade-up" style={{ paddingBottom: 100 }}>
        {/* ── Page Header / Verification ───────────────── */}
        <div className="px-5 pt-6 pb-6 bg-surface-container-lowest border-b border-surface-container mb-6">
          <div className="flex justify-between items-start mb-4">
             <div>
                <h2 className="font-headline text-3xl font-black tracking-tight text-on-surface mb-1">
                  {user.name}
                </h2>
                <div className="flex items-center gap-2 mb-2">
                   <Icon name="phone" size={14} className="text-on-surface-variant" />
                   <span className="font-body text-xs text-on-surface-variant">+91 {user.phone || "90000 00000"}</span>
                </div>
                <div className="flex items-center gap-2">
                   <Icon name="location_on" size={14} className="text-on-surface-variant" />
                   <span className="font-body text-xs text-on-surface-variant">{user.state || "Kerala, India"}</span>
                </div>
             </div>
             <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-headline font-black text-xl">
               {user.name.charAt(0)}
             </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider flex items-center gap-1">
              <Icon name={isDealership ? "storefront" : "person"} filled size={13} className="text-on-tertiary-fixed" />
              {isDealership ? "Verified Dealership" : "Verified Individual"}
            </span>
            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider flex items-center gap-1 ${isKycVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
               <Icon name={isKycVerified ? "verified_user" : "gpp_bad"} filled size={13} />
               {isKycVerified ? "Aadhaar Verified" : "Verification Pending"}
            </span>
          </div>

          {!isKycVerified && (
             <button onClick={handleKycUpload} className="w-full mt-5 bg-primary text-on-primary font-bold text-xs py-3 rounded-xl transition-transform active:scale-[0.98]">
                Complete Mobile Aadhaar Verification
             </button>
          )}
        </div>

        {/* ── Inbox / Notifications ───────────────────── */}
        <div className="px-5 mb-8">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-headline font-bold text-lg text-on-surface">Inbox Options</h3>
           </div>
           {notifications.length > 0 ? (
             <div className="space-y-3">
               {notifications.map((notif, index) => (
                 <div key={index} className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 editorial-shadow-sm flex gap-4 items-start">
                   <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center flex-none mt-1">
                      <Icon name="local_offer" filled size={20} />
                   </div>
                   <div className="flex-1">
                      <h4 className="font-headline font-bold text-sm text-on-surface">{notif.title}</h4>
                      <p className="font-body text-xs text-on-surface-variant my-1 line-clamp-2">{notif.message}</p>
                      <button 
                        onClick={() => window.open(`https://wa.me/${notif.buyerPhone}`, "_blank")}
                        className="mt-2 text-[#25D366] font-bold text-xs flex items-center gap-1 bg-[#25D366]/10 px-3 py-1.5 rounded-full w-fit btn-press"
                      >
                         <Icon name="forum" filled size={12} />
                         Reply via WhatsApp
                      </button>
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="bg-surface-container-lowest p-6 rounded-2xl border border-dashed border-outline-variant/50 text-center text-on-surface-variant h-full">
                <Icon name="inbox" size={32} className="opacity-50 mb-2" />
                <p className="font-body text-sm">No new messages or offers right now.</p>
             </div>
           )}
        </div>

        {/* ── Your Active Listings ───────────────────── */}
        <div className="px-5 mb-8">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-headline font-bold text-lg text-on-surface">Your Active Listings</h3>
            <button onClick={() => navigate('/sell')} className="text-secondary font-bold text-xs bg-secondary/10 px-3 py-1.5 rounded-full">
               + Create New
            </button>
          </div>

          <div className="relative mb-6 mt-3">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Icon name="search" size={16} className="text-on-surface-variant/70" />
            </div>
            <input 
              type="text" 
              placeholder="Search your listings..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-highest border border-outline-variant/30 rounded-xl py-3 pl-10 pr-4 font-body text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          
          {activeListings.length > 0 ? (
            <div className="space-y-4">
               {activeListings.map(listing => (
                 <div key={listing.id} className={`bg-surface-container-lowest rounded-2xl overflow-hidden editorial-shadow`}>
                   <div className="relative h-36 bg-surface-container-high flex items-center justify-center">
                     {listing.images && listing.images[0] ? (
                       <img src={listing.images[0]} alt={listing.model} className="w-full h-full object-cover" />
                     ) : (
                       <img src={listing.image} alt={listing.model} className="w-full h-full object-cover" />
                     )}
                     <div className="absolute top-3 right-3 px-2.5 py-1 text-white bg-black/60 backdrop-blur-sm rounded-full text-[9px] font-black tracking-wider shadow-md">
                        {listing.price}
                     </div>
                   </div>
                   <div className="p-4">
                     <h4 className="font-headline font-bold text-sm text-on-surface mb-1">
                       {listing.make} {listing.model}
                     </h4>
                     <p className="font-body text-[11px] text-on-surface-variant flex gap-2">
                        <span>{listing.year}</span> • 
                        <span>{listing.km} km</span> • 
                        <span>{listing.fuel}</span>
                     </p>
                     
                     <div className="mt-3 flex items-center gap-2">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${listing.serviceHistory?.length > 0 ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                           <Icon name={listing.serviceHistory?.length > 0 ? "verified" : "history"} size={10} />
                           {listing.serviceHistory?.length > 0 ? "Records Verified" : "Add Service Logs"}
                        </span>
                        {listing.anyAccidents === 'No' && (
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 flex items-center gap-1 border border-blue-200">
                             <Icon name="verified_user" size={10} />
                             No Accidents
                          </span>
                        )}
                     </div>
                     
                     <div className="flex gap-2 mt-4">
                       <button 
                         onClick={() => {
                           if(window.confirm("Are you sure you want to mark this listing as sold?")) {
                             updateCar(listing.id, { badge: 'SOLD', badgeType: 'alert' });
                           }
                         }}
                         className={`flex-1 bg-surface-container text-on-surface-variant py-2.5 rounded-full font-label text-xs font-semibold btn-press border border-outline-variant/20`}
                       >
                         Mark Sold
                       </button>
                       <button 
                         className="flex-1 bg-secondary text-on-secondary py-2.5 rounded-full font-label text-xs font-semibold btn-press"
                         onClick={() => {
                           const action = window.prompt("Type 'remove' to remove this listing, or click Cancel to do nothing:");
                           if (action && action.trim().toLowerCase() === 'remove') {
                              deleteCar(listing.id);
                           }
                         }}
                       >
                         Edit / Remove
                       </button>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          ) : (
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-dashed border-outline-variant/50 text-center text-on-surface-variant h-full" onClick={() => navigate('/sell')}>
               <Icon name="add_circle" size={32} className="opacity-50 mb-2" />
               <p className="font-body text-sm font-bold">No active listings.</p>
               <p className="font-body text-xs mt-1">Tap to list your car for sale!</p>
            </div>
          )}
        </div>

        {/* ── Sold Vehicles History ───────────────────── */}
        {soldListings.length > 0 && (
          <div className="px-5 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline font-bold text-lg text-on-surface">Sold Vehicles History</h3>
            </div>
            <div className="space-y-4">
               {soldListings.map(listing => (
                 <div key={listing.id} className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm opacity-70">
                   <div className="relative h-20 bg-surface-container-high grayscale flex items-center justify-center">
                     {listing.images && listing.images[0] ? (
                       <img src={listing.images[0]} alt={listing.model} className="w-full h-full object-cover" />
                     ) : (
                       <img src={listing.image} alt={listing.model} className="w-full h-full object-cover" />
                     )}
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="px-3 py-1 bg-error text-white text-xs font-black tracking-widest rounded-full transform -rotate-12 border border-white/30">SOLD</span>
                     </div>
                   </div>
                   <div className="p-3">
                     <h4 className="font-headline font-bold text-sm text-on-surface line-through decoration-on-surface-variant/40 mb-1">
                       {listing.make} {listing.model}
                     </h4>
                     <button 
                       onClick={() => {
                         if (window.confirm("Restore this vehicle to active listings?")) {
                            updateCar(listing.id, { badge: '', badgeType: '' });
                         }
                       }}
                       className="w-full mt-2 bg-surface-container text-on-surface-variant py-2 rounded-full font-label text-[10px] font-bold uppercase btn-press border border-outline-variant/20"
                     >
                       Revert to Active
                     </button>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* ── Saved Favorites ───────────────────── */}
        <div className="px-5 mb-8">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-headline font-bold text-lg text-on-surface">Saved Favorites</h3>
           </div>
           
           {myFavorites.length > 0 ? (
             <div className="flex overflow-x-auto gap-4 no-scrollbar pb-4">
                {myFavorites.map(favCar => (
                  <div key={favCar.id} className="min-w-[240px] max-w-[240px]" onClick={() => navigate(`/car/${favCar.id}`)}>
                    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden editorial-shadow">
                      <div className="h-28 relative">
                        <img src={favCar.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="p-3">
                         <h4 className="font-headline font-bold text-xs truncate">{favCar.make} {favCar.model}</h4>
                         <p className="font-body font-black text-xs text-primary mt-1">{favCar.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="bg-surface-container-lowest p-6 rounded-2xl border border-dashed border-outline-variant/50 text-center text-on-surface-variant h-full" onClick={() => navigate('/search')}>
               <Icon name="favorite_border" size={32} className="opacity-50 mb-2" />
               <p className="font-body text-sm font-bold">No saved cars.</p>
               <p className="font-body text-xs mt-1">Explore our inventory and save your favorites!</p>
             </div>
           )}
        </div>
      </main>

      <BottomNav />
    </>
  );
};

export default Dashboard;
