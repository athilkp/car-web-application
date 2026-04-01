import TopHeader from "../components/TopHeader";
import BottomNav from "../components/BottomNav";
import Icon from "../components/Icon";
import { sellerListings } from "../data/cars";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

/* ── Progress Ring ─────────────────────────────────────── */
const ProgressRing = ({ pct = 90 }) => {
  const r = 24;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div className="relative w-16 h-16">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#eceef0" strokeWidth="5" />
        <circle
          cx="28" cy="28" r={r} fill="none"
          stroke="#000666" strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-headline font-black text-sm text-primary">{pct}%</span>
      </div>
    </div>
  );
};

/* ── Mini Bar Chart ────────────────────────────────────── */
const MiniBarChart = () => {
  const bars = [
    { h: 18, opacity: 0.35 },
    { h: 28, opacity: 0.5 },
    { h: 22, opacity: 0.65 },
    { h: 38, opacity: 1 },
  ];
  return (
    <div className="flex items-end gap-1.5">
      {bars.map((b, i) => (
        <div
          key={i}
          className="w-4 rounded-sm"
          style={{
            height: b.h,
            backgroundColor: i === bars.length - 1 ? "#a3f69c" : `rgba(189,194,255,${b.opacity})`,
          }}
        />
      ))}
    </div>
  );
};

/* ── Listing Card ──────────────────────────────────────── */
const ListingCard = ({ listing }) => {
  const isActive = listing.status === "active";
  return (
    <div className={`bg-surface-container-lowest rounded-2xl overflow-hidden editorial-shadow ${!isActive ? "opacity-70" : ""}`}>
      {/* Image */}
      <div className="relative h-36 bg-surface-container-high flex items-center justify-center">
        {listing.image ? (
          <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <Icon name="directions_car" size={52} className="text-outline-variant" />
        )}

        {/* Status badge */}
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider flex items-center gap-1 ${isActive ? "badge-active" : "badge-sold"}`}>
          <span className={`w-1.5 h-1.5 rounded-full inline-block ${isActive ? "bg-green-500" : "bg-gray-400"}`} />
          {listing.statusLabel}
        </div>

        {/* Side note */}
        {isActive && listing.listedNote && (
          <div className="absolute top-3 right-3 bg-inverse-surface/70 text-inverse-on-surface text-[9px] font-semibold px-2 py-0.5 rounded-full">
            {listing.listedNote}
          </div>
        )}
        {!isActive && listing.removingIn && (
          <div className="absolute bottom-2 right-2 bg-error-container text-on-error-container text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Icon name="timer" size={11} className="text-on-error-container" />
            Removing in {listing.removingIn}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h4 className={`font-headline font-bold text-sm mb-0.5 ${isActive ? "text-on-surface" : "text-on-surface-variant"}`}>
          {listing.title}
        </h4>
        <p className="font-body text-xs text-on-surface-variant mb-2">{listing.subtitle}</p>
        <div className="flex justify-between items-center mb-3">
          <span className={`font-headline font-black text-base ${isActive ? "text-on-surface" : "line-through text-outline"}`}>
            {listing.price}
          </span>
          {isActive && listing.leads && (
            <span className="font-body text-xs text-on-surface-variant">{listing.leads} Leads Received</span>
          )}
          {!isActive && listing.finalizedNote && (
            <span className="bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-0.5 rounded-full text-[9px] font-black">
              {listing.finalizedNote}
            </span>
          )}
        </div>

        {isActive && (
          <div className="flex gap-2">
            <button className="flex-1 border border-outline-variant/50 text-on-surface py-2 rounded-full font-label text-xs font-semibold btn-press">
              Edit
            </button>
            <button className="flex-1 bg-surface-container text-on-surface-variant py-2 rounded-full font-label text-xs font-semibold btn-press">
              Mark Sold
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Document Row ──────────────────────────────────────── */
const DocRow = ({ doc }) => (
  <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
    <div className="flex items-center gap-3">
      <Icon name={doc.icon} filled size={20} className="text-secondary" />
      <div>
        <p className="font-body font-semibold text-sm text-on-surface">{doc.label}</p>
        <p className="font-body text-[10px] text-on-surface-variant">{doc.detail}</p>
      </div>
    </div>
    {doc.status === "verified" ? (
      <Icon name="check_circle" filled size={20} className="text-tertiary" />
    ) : (
      <Icon name="pending" size={20} className="text-outline" />
    )}
  </div>
);

/* ── Dashboard Page ────────────────────────────────────── */
const Dashboard = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return <div className="min-h-screen bg-surface flex items-center justify-center">Loading...</div>;

  const isDealership = user.role === 'dealership';
  const isKycVerified = user.kycVerified;

  const currentDocs = isDealership ? [
    { id: "trade-license", label: "Trade/Business License", detail: "Expires: Dec 2026", icon: "description", status: isKycVerified ? "verified" : "pending" },
    { id: "kyc-gst", label: "KYC / GST / Business Pan", detail: "Verified for EMI processing", icon: "receipt_long", status: isKycVerified ? "verified" : "pending" },
  ] : [
    { id: "phone-verify", label: "Mobile Number", detail: "Verified via OTP", icon: "phone", status: "verified" },
    { id: "kyc-pan", label: "PAN & Aadhaar KYC", detail: "Mandatory for Selling & EMI Eligibility", icon: "fingerprint", status: isKycVerified ? "verified" : "pending" },
  ];

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
            <button className="btn-press">
              <Icon name="search" size={22} className="text-on-surface" />
            </button>
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

      <main className="page-wrapper animate-fade-up">
        {/* ── Page title ────────────────────────────── */}
        <div className="px-5 pt-6 pb-4">
          <h2 className="font-headline text-3xl font-black tracking-tight text-on-surface mb-3">
            <span className="text-secondary">{user.name}</span> Dashboard
          </h2>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-[10px] font-black tracking-wider flex items-center gap-1">
              <Icon name={isDealership ? "storefront" : "person"} filled size={11} className="text-on-tertiary-fixed" />
              {isDealership ? "Verified Dealership" : "Verified Individual"}
            </span>
          </div>
          <p className="font-body text-sm text-on-surface-variant">
            Manage your vehicle listings, verification documents, and sales performance.
          </p>
        </div>

        {/* ── Add Listing CTA ───────────────────────── */}
        <div className="px-5 mb-6">
          <button className="w-full bg-secondary text-on-secondary py-3.5 rounded-full font-headline font-bold text-sm btn-press flex items-center justify-center gap-2">
            <Icon name="add_circle" filled size={20} className="text-on-secondary" />
            Add New Listing
          </button>
        </div>

        {/* ── Verification Status ───────────────────── */}
        <div className="mx-5 bg-surface-container-lowest rounded-2xl p-5 editorial-shadow mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="verified_user" filled size={20} className="text-primary" />
            <span className="font-label font-black text-[10px] text-on-surface-variant tracking-widest uppercase">
              Verification Status
            </span>
          </div>
          <h4 className="font-headline font-bold text-base text-on-surface mb-1">Premium Certified Seller</h4>
          <p className="font-body text-xs text-on-surface-variant mb-4">
            Your business credentials and identity are verified. You have access to priority listing
            slots and trust badges.
          </p>
          <div className="flex gap-2 mb-5 flex-wrap">
            {isDealership ? [
              { icon: "description", label: "License/RC • Verified" },
              { icon: "check_circle", label: "KYC/GST • Valid" },
            ].map((tag) => (
              <span
                key={tag.label}
                className="bg-surface-container flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-on-surface"
              >
                <Icon name={tag.icon} filled size={13} className="text-tertiary" />
                {tag.label}
              </span>
            )) : [
              { icon: "phone", label: "Phone • Verified" },
              { icon: "fingerprint", label: "Aadhaar • Valid" },
            ].map((tag) => (
              <span
                key={tag.label}
                className="bg-surface-container flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-on-surface"
              >
                <Icon name={tag.icon} filled size={13} className="text-primary" />
                {tag.label}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <ProgressRing pct={90} />
            <div>
              <p className="font-headline font-bold text-sm text-on-surface">Profile Complete</p>
              <p className="font-body text-xs text-on-surface-variant">Add bank details to reach 100%</p>
            </div>
          </div>
        </div>

        {/* ── Stats card ────────────────────────────── */}
        <div className="mx-5 featured-gradient rounded-2xl p-5 mb-4">
          <p className="font-body text-primary-fixed-dim text-[10px] font-semibold tracking-widest uppercase mb-1">
            Total Sales Value
          </p>
          <p className="font-headline font-black text-on-primary text-3xl mb-3">₹1.28 Cr</p>
          <div className="flex items-end justify-between">
            <div>
              <p className="font-body text-primary-fixed-dim text-[11px]">Active Listings</p>
              <p className="font-headline font-black text-on-primary text-2xl">14</p>
            </div>
            <MiniBarChart />
          </div>
        </div>

        {/* ── Current Listings ──────────────────────── */}
        <div className="px-5 mb-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-headline font-bold text-base text-on-surface">Current Listings</h3>
            <div className="flex gap-2">
              <button className="bg-surface-container text-on-surface-variant px-3 py-1.5 rounded-full text-xs font-semibold btn-press">
                Sort: Newest
              </button>
              <button className="bg-surface-container text-on-surface-variant px-3 py-1.5 rounded-full text-xs font-semibold btn-press">
                Filters
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {sellerListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <button className="w-full mt-3 bg-surface-container-low text-on-surface-variant py-3 rounded-xl font-label text-sm font-semibold btn-press flex items-center justify-center gap-1">
            <Icon name="archive" size={16} className="text-on-surface-variant" />
            View Archived Listings
          </button>
        </div>

        {/* ── Document Vault ────────────────────────── */}
        <div className="px-5 mb-6">
          <div className="bg-surface-container-lowest rounded-2xl p-5 editorial-shadow">
            <h3 className="font-headline font-bold text-base text-on-surface mb-1">Document Vault</h3>
            <p className="font-body text-xs text-on-surface-variant mb-4">
              Maintain your compliance and trust score by keeping your legal documents and identity proof up to date.
            </p>

            {/* Security badge */}
            <div className="bg-tertiary-fixed/20 border border-tertiary-fixed-dim/40 rounded-xl px-4 py-2.5 flex items-center gap-2 mb-4">
              <Icon name="lock" filled size={16} className="text-tertiary" />
              <span className="font-label font-black text-[9px] tracking-widest uppercase text-tertiary">
                Bank-Level Security
              </span>
            </div>

            {/* Docs */}
            <div className="space-y-3">
              {currentDocs.map((doc) => (
                <DocRow key={doc.id} doc={doc} />
              ))}
            </div>

            <button onClick={handleKycUpload} className={`w-full mt-4 border ${isKycVerified ? 'border-primary/20 text-primary' : 'border-outline-variant/50 text-on-surface'} py-3 rounded-full font-label font-semibold text-sm btn-press flex items-center justify-center gap-2`}>
              <Icon name="upload" size={18} className={isKycVerified ? "text-primary" : "text-on-surface"} />
              {isKycVerified ? "Re-upload Documents" : "Upload KYC Documents"}
            </button>
          </div>
        </div>

        {/* ── EMI Eligibility ───────────────────────── */}
        <div className="px-5 mb-8">
          <div className={`rounded-2xl p-5 border ${isKycVerified ? 'bg-secondary-container/20 border-secondary' : 'bg-surface-container-low border-outline-variant/30'}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-headline font-bold text-base text-on-surface">EMI Eligibility</h3>
              <Icon name={isKycVerified ? "check_circle" : "lock"} filled size={20} className={isKycVerified ? "text-secondary" : "text-outline"} />
            </div>
            
            {isKycVerified ? (
               <p className="font-body text-xs text-on-surface-variant mb-4">
                 Based on your strong customer profile, you are pre-approved to offer up to <strong>90% On-Road Financing</strong> via our partner banks.
               </p>
            ) : (
               <p className="font-body text-xs text-on-surface-variant mb-4">
                 Your KYC is pending. Please upload your PAN and Aadhaar to unlock Bank Loan and EMI capabilities for your buyers.
               </p>
            )}
            
            <button className={`w-full py-3 rounded-full font-headline font-bold text-sm btn-press ${isKycVerified ? 'bg-secondary text-on-secondary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
              {isKycVerified ? 'View Loan Partners' : 'Complete KYC to Unlock'}
            </button>
          </div>
        </div>
      </main>

      <BottomNav />
    </>
  );
};

export default Dashboard;
