// Icon.jsx — wrapper for Material Symbols Outlined
const Icon = ({ name, filled = false, size = 24, className = "" }) => {
  const style = {
    fontSize: size,
    fontVariationSettings: filled
      ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
      : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
  };
  return (
    <span
      className={`material-symbols-outlined select-none leading-none ${className}`}
      style={style}
      aria-hidden="true"
    >
      {name}
    </span>
  );
};

export default Icon;
