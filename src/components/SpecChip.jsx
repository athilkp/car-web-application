import Icon from "./Icon";

const SpecChip = ({ icon, label, value, filled = true }) => (
  <div className="spec-chip flex-1">
    {icon && (
      <div className="flex items-center gap-1.5 mb-1">
        <Icon name={icon} filled={filled} size={18} className="text-secondary" />
        <span className="font-body text-[10px] text-on-surface-variant">{label}</span>
      </div>
    )}
    {!icon && (
      <p className="font-body text-[9px] text-on-surface-variant mb-0.5">{label}</p>
    )}
    <p className="font-headline font-bold text-on-surface text-sm">{value}</p>
  </div>
);

export default SpecChip;
