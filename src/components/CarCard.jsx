import { useNavigate } from "react-router-dom";
import Badge from "./Badge";
import Icon from "./Icon";

const CarCard = ({ car }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex-none w-[82%] md:w-72 lg:w-80 bg-surface-container-lowest rounded-2xl overflow-hidden editorial-shadow car-card"
      onClick={() => navigate("/car/" + car.id)}
    >
      {/* Image */}
      <div className="relative h-52 bg-surface-container-high">
        {car.image ? (
          <img
            src={car.image}
            alt={`${car.year} ${car.make} ${car.model}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon name="directions_car" size={56} className="text-outline-variant" />
          </div>
        )}
        <div className="absolute top-3.5 left-3.5">
          <Badge type={car.badgeType} label={car.badge} />
        </div>
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
            alert("Test drive booked!");
          }}
        >
          Book Test Drive
        </button>
      </div>
    </div>
  );
};

export default CarCard;
