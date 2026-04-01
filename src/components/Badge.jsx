import Icon from "./Icon";

const BADGE_STYLES = {
  certified: {
    className: "bg-tertiary-fixed text-on-tertiary-fixed",
    icon: "verified",
  },
  deal: {
    className: "bg-secondary-fixed text-on-secondary-fixed",
    icon: "local_offer",
  },
  ev: {
    className: "bg-primary text-on-primary",
    icon: "electric_car",
  },
  featured: {
    className: "bg-secondary text-on-secondary",
    icon: "star",
  },
  default: {
    className: "bg-surface-container text-on-surface-variant",
    icon: "label",
  },
};

const Badge = ({ type = "default", label }) => {
  const style = BADGE_STYLES[type] || BADGE_STYLES.default;
  return (
    <span
      className={`${style.className} px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider flex items-center gap-1 shadow-sm`}
    >
      <Icon name={style.icon} filled size={11} />
      {label}
    </span>
  );
};

export default Badge;
