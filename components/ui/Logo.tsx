// Exact geometry from brand-guide §5. Do not redraw or recolour.
const ARCH = "M16 58V30A16 16 0 0 1 48 30V58ZM24 42a8 8 0 1 0 16 0a8 8 0 1 0-16 0Z";

type Variant = "icon-graphite" | "icon-ivory" | "symbol-on-light" | "symbol-on-dark";

const TILES = {
  "icon-graphite": { fill: "#15120F", edge: "#fff", edgeOpacity: ".16", arch: "#F2EEE8", dot: "#C8A86B" },
  "icon-ivory": { fill: "#F2EEE8", edge: "#000", edgeOpacity: ".12", arch: "#15120F", dot: "#9A7B3C" },
} as const;

export function Logo({
  variant = "icon-graphite",
  size = 32,
  withName = false,
}: {
  variant?: Variant;
  size?: number;
  withName?: boolean;
}) {
  const tile = variant === "icon-graphite" || variant === "icon-ivory" ? TILES[variant] : null;
  const onDark = variant === "symbol-on-dark";
  const arch = tile ? tile.arch : onDark ? "#F2EEE8" : "#15120F";
  const dot = tile ? tile.dot : onDark ? "#C8A86B" : "#9A7B3C";
  const s = Math.max(32, size); // 32px minimum (brand-guide §5)

  const mark = (
    <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="Hearth Audio">
      {tile && <rect width="64" height="64" rx="15" fill={tile.fill} />}
      {tile && (
        <rect x=".5" y=".5" width="63" height="63" rx="14.5" fill="none" stroke={tile.edge} strokeOpacity={tile.edgeOpacity} />
      )}
      <g transform="translate(0 -1.5)">
        <path fill={arch} fillRule="evenodd" d={ARCH} />
        <circle cx="32" cy="42" r="3.4" fill={dot} />
      </g>
    </svg>
  );

  if (!withName) return mark;
  return (
    <span className={`ha-logo${onDark ? " ha-logo--on-dark" : ""}`}>
      {mark}
      <span className="ha-logo__name" style={{ fontSize: Math.round(s * 0.62) }}>
        Hearth Audio
      </span>
    </span>
  );
}
