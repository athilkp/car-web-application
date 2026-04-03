import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Badge from "./Badge";
import Icon from "./Icon";
import { useData } from "../context/DataContext";

// Standard vertical listing card
const StandardCard = ({ car, navigate }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const { favorites, toggleFavorite } = useData();
  const images = car.images && car.images.length > 0 ? car.images : (car.image ? [car.image] : []);
  const isFavorite = favorites?.includes(car.id);

  const nextImg = (e) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImg = (e) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className="bg-surface-container-lowest rounded-2xl overflow-hidden editorial-shadow car-card flex flex-col"
      onClick={() => navigate("/car/" + car.id)}
    >
      <div className="relative h-56 bg-surface-container-highest group">
        {images.length > 0 ? (
          <>
            <img
              src={images[imgIndex]}
              alt={`${car.year} ${car.make} ${car.model}`}
              className="w-full h-full object-contain"
            />
            {images.length > 1 && (
              <>
                <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                  <Icon name="chevron_left" size={24} />
                </button>
                <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all z-10">
                  <Icon name="chevron_right" size={24} />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/20 px-2 py-1 rounded-full">
                  {images.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === imgIndex ? 'bg-white' : 'bg-white/40'}`} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon name="directions_car" size={52} className="text-outline-variant" />
          </div>
        )}
        <div className="absolute top-3 left-3 z-10">
          <Badge type={car.badgeType} label={car.badge} />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(car.id);
          }}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm hover:scale-110 transition-transform"
        >
          <Icon name="favorite" filled={isFavorite} size={20} className={isFavorite ? "text-red-500" : "text-gray-400"} />
        </button>
      </div>
      <div className="p-4">
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-headline font-bold text-base text-on-surface">
          {car.year} {car.make} {car.model}
        </h4>
        <span className="font-headline font-black text-secondary text-base">{car.price}</span>
      </div>
      <p className="font-body text-xs text-on-surface-variant mb-3">
        {car.variant} • {car.fuel} • {car.km} km
      </p>
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {car.transmission && (
            <div className="spec-chip !py-1.5 !px-2.5">
              <p className="font-body text-[9px] text-on-surface-variant">Transmission</p>
              <p className="font-body font-semibold text-xs">{car.transmission}</p>
            </div>
          )}
          {car.battery && (
            <div className="spec-chip !py-1.5 !px-2.5">
              <p className="font-body text-[9px] text-on-surface-variant">Battery</p>
              <p className="font-body font-semibold text-xs">{car.battery}</p>
            </div>
          )}
          {car.range && (
            <div className="spec-chip !py-1.5 !px-2.5">
              <p className="font-body text-[9px] text-on-surface-variant">Range</p>
              <p className="font-body font-semibold text-xs">{car.range}</p>
            </div>
          )}
          {car.safety && (
            <div className="spec-chip !py-1.5 !px-2.5">
              <p className="font-body text-[9px] text-on-surface-variant">Safety</p>
              <p className="font-body font-semibold text-xs">{car.safety}</p>
            </div>
          )}
          {car.location && (
            <div className="spec-chip !py-1.5 !px-2.5">
              <p className="font-body text-[9px] text-on-surface-variant">Location</p>
              <p className="font-body font-semibold text-xs">{car.location}</p>
            </div>
          )}
          {car.driveMode && (
            <div className="spec-chip !py-1.5 !px-2.5">
              <p className="font-body text-[9px] text-on-surface-variant">Drive Mode</p>
              <p className="font-body font-semibold text-xs">AWD Terrain</p>
            </div>
          )}
          {car.owner && !car.transmission && (
            <div className="spec-chip !py-1.5 !px-2.5">
              <p className="font-body text-[9px] text-on-surface-variant">Owner</p>
              <p className="font-body font-semibold text-xs">{car.owner}</p>
            </div>
          )}
        </div>
        <button
          className="bg-secondary text-on-secondary px-4 py-2 rounded-full font-label text-xs font-bold btn-press flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          View Details
        </button>
      </div>
    </div>
  </div>
  );
};

// Featured editorial card (dark gradient)
const FeaturedCard = ({ car, navigate }) => (
  <div
    className="featured-gradient rounded-2xl p-5 car-card"
    onClick={() => navigate("/car/" + car.id)}
  >
    <p className="text-primary-fixed-dim text-[9px] font-black tracking-widest uppercase mb-1">
      Featured Listing
    </p>
    <h4 className="font-headline text-2xl font-black text-on-primary leading-tight mb-2">
      {car.make} {car.model}
    </h4>
    <p className="font-body text-primary-fixed-dim/80 text-sm mb-3">{car.description}</p>
    <p className="font-headline font-black text-tertiary-fixed text-2xl mb-4">{car.price}</p>
    <button
      className="w-full border border-primary-fixed-dim text-primary-fixed-dim py-3 rounded-full font-headline font-bold text-sm btn-press flex items-center justify-center gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      Explore Exclusive
      <Icon name="arrow_forward" size={16} className="text-primary-fixed-dim" />
    </button>
  </div>
);

const SearchListingCard = ({ car }) => {
  const navigate = useNavigate();
  if (car.type === "featured") return <FeaturedCard car={car} navigate={navigate} />;
  return <StandardCard car={car} navigate={navigate} />;
};

export default SearchListingCard;
