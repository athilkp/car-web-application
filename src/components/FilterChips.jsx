import { useState } from "react";

const FilterChips = ({ items, defaultActive = 0, onSelect }) => {
  const [active, setActive] = useState(defaultActive);

  const handleClick = (idx) => {
    setActive(idx);
    onSelect && onSelect(items[idx], idx);
  };

  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="flex gap-2.5 px-5 pb-1">
        {items.map((item, idx) => (
          <button
            key={item}
            onClick={() => handleClick(idx)}
            className={`px-5 py-2 rounded-full font-label text-sm font-semibold whitespace-nowrap btn-press transition-colors ${
              active === idx
                ? "bg-primary text-on-primary"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterChips;
