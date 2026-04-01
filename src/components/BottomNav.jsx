import { useNavigate, useLocation } from "react-router-dom";
import Icon from "./Icon";

const NAV_ITEMS = [
  { label: "Home", icon: "home", path: "/" },
  { label: "Search", icon: "search", path: "/search" },
  { label: "Sell", icon: "add_circle", path: "/sell" },
  { label: "Profile", icon: "person", path: "/dashboard" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="glass-nav fixed bottom-0 left-0 right-0 w-full z-50 rounded-t-2xl shadow-2xl shadow-blue-900/10 border-t border-outline-variant/20 md:hidden transition-all">
      <div className="flex justify-around items-center px-2 pt-3 pb-5">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-full btn-press transition-colors ${
                isActive
                  ? "bg-orange-50 text-secondary"
                  : "text-outline hover:text-on-surface"
              }`}
            >
              <Icon name={item.icon} filled={isActive} size={22} />
              <span
                className={`text-[10px] ${
                  isActive ? "font-semibold" : "font-medium"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
