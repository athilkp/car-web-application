import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Badge from "./Badge";
import Icon from "./Icon";
import { useData } from "../context/DataContext";

const CarCard = ({ car }) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useData();
  const [imgIndex, setImgIndex] = useState(0);

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
      className="flex-none w-[82%] md:w-72 lg:w-80 bg-surface-container-lowest rounded-2xl overflow-hidden editorial-shadow car-card flex flex-col"
      onClick={() => navigate("/car/" + car.id)}
    >
      {/* Image */}
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
            <Icon name="directions_car" size={56} className="text-outline-variant" />
          </div>
        )}
        <div className="absolute top-3.5 left-3.5 z-10">
          <Badge type={car.badgeType} label={car.badge} />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(car.id);
          }}
          className="absolute top-3.5 right-3.5 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm hover:scale-110 transition-transform"
        >
          <Icon name="favorite" filled={isFavorite} size={20} className={isFavorite ? "text-red-500" : "text-gray-400"} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-1.5">
          <h4 className="font-headline text-base font-bold text-on-surface">
            {car.year} {car.make} {car.model}
          </h4>
          <span className="text-secondary font-black text-base">₹{car.price}</span>
        </div>
        <p className="font-body text-on-surface-variant text-xs mb-5">
          {car.variant} • {car.km} km • {car.fuel}
        </p>
        <button
          className="w-full bg-secondary text-on-secondary py-3 rounded-full font-headline font-bold text-sm btn-press"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/car/" + car.id);
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default CarCard;
