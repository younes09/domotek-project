import React from "react";
import { Truck, ShieldCheck, CheckCircle2, Headphones, Lightbulb, ToggleLeft, Plug, RadioTower, Cpu } from "lucide-react";
import { cx } from "../lib/format";
import type { IconType, StockStatus } from "../types";

export const IconTile: React.FC<{ Icon: IconType; variant?: 1 | 2 | 3 }> = ({ Icon, variant = 1 }) => (
  <div
    className="relative h-full w-full overflow-hidden rounded-2xl flex items-center justify-center"
    style={{
      background:
        "radial-gradient(circle at 30% 20%, rgba(52,201,184,0.18), transparent 60%), linear-gradient(160deg, var(--surface-2), var(--surface))",
    }}
  >
    <div
      className="absolute inset-0"
      style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "16px 16px", opacity: 0.05 }}
    />
    <Icon
      strokeWidth={1.3}
      style={{
        width: variant === 2 ? "32%" : "44%",
        height: variant === 2 ? "32%" : "44%",
        color: "var(--teal)",
        transform: variant === 3 ? "rotate(-10deg)" : "none",
      }}
    />
  </div>
);

export const ProductTile: React.FC<{ Icon: IconType; imageUrl?: string; images?: string[]; name?: string; variant?: 1 | 2 | 3 }> = ({ Icon, imageUrl, images, name, variant = 1 }) => {
  const finalImage = (images && images.length > 0 && images[0]) ? images[0] : imageUrl;
  if (finalImage) {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-xl dk-surface-2 flex items-center justify-center p-1 group">
        <img src={finalImage} alt={name || "Produit DomoTek"} className="max-h-full max-w-full object-contain rounded transform group-hover:scale-105 transition-transform duration-300" />
      </div>
    );
  }
  return <IconTile Icon={Icon} variant={variant} />;
};

export const StockLabel: React.FC<{ stock: StockStatus }> = ({ stock }) => {
  if (stock === "out") return <span className="text-xs font-medium" style={{ color: "var(--danger)" }}>Rupture de stock</span>;
  if (stock === "low") return <span className="text-xs font-medium" style={{ color: "var(--amber)" }}>Stock limité</span>;
  return (
    <span className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--success)" }}>
      <CheckCircle2 className="h-3.5 w-3.5" /> En stock
    </span>
  );
};

export const TrustBadges: React.FC<{ dense?: boolean }> = ({ dense }) => {
  const items = [
    { Icon: Truck, label: "Livraison en Algérie" },
    { Icon: ShieldCheck, label: "Paiement à la livraison" },
    { Icon: CheckCircle2, label: "Produit vérifié" },
    { Icon: Headphones, label: "Assistance client" },
  ];
  return (
    <div className={cx("grid gap-3", dense ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4")}>
      {items.map((it) => (
        <div key={it.label} className={cx("dk-surface rounded-xl flex items-center gap-2", dense ? "p-2.5" : "p-3")}>
          <it.Icon className="h-4 w-4 shrink-0" style={{ color: "var(--teal)" }} />
          <span className="text-xs leading-snug" style={{ color: "var(--text-dim)" }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
};

export const Toast: React.FC<{ message: string }> = ({ message }) => (
  <div
    className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 px-4 py-3 rounded-xl flex items-center gap-2 shadow-lg dk-surface-2"
    style={{ borderColor: "var(--teal)" }}
  >
    <CheckCircle2 className="h-4 w-4" style={{ color: "var(--teal)" }} />
    <span className="text-sm" style={{ color: "var(--text)" }}>{message}</span>
  </div>
);

export const TikTokIcon: React.FC<{ style?: React.CSSProperties }> = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
    <path d="M16.5 2h-3v13.2a2.8 2.8 0 1 1-2-2.68V9.4a6 6 0 1 0 5 5.92V9.1a7.5 7.5 0 0 0 4.5 1.5V7.4A4.5 4.5 0 0 1 16.5 2Z" />
  </svg>
);

export const WhatsAppIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = "h-5 w-5", style }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export const NetworkGraphic: React.FC = () => (
  <div className="dk-surface rounded-3xl p-6 sm:p-10 relative overflow-hidden">
    <div
      className="absolute inset-0"
      style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "20px 20px", opacity: 0.04 }}
    />
    <NetworkSvg />
  </div>
);

const NetworkSvg: React.FC = () => {
  const points: Array<{ x: number; y: number; Icon: IconType }> = [
    { x: 80, y: 60, Icon: Lightbulb },
    { x: 320, y: 55, Icon: ToggleLeft },
    { x: 60, y: 210, Icon: Plug },
    { x: 330, y: 215, Icon: ShieldCheck },
    { x: 200, y: 245, Icon: RadioTower },
  ];
  return (
    <svg viewBox="0 0 400 280" className="relative w-full h-auto" fill="none">
      <g stroke="var(--border)" strokeWidth="1.5">
        <line x1="200" y1="140" x2="80" y2="60" />
        <line x1="200" y1="140" x2="320" y2="55" />
        <line x1="200" y1="140" x2="60" y2="210" />
        <line x1="200" y1="140" x2="330" y2="215" />
        <line x1="200" y1="140" x2="200" y2="245" />
      </g>
      <g stroke="var(--teal)" strokeWidth="1.5" opacity={0.55}>
        <line x1="80" y1="60" x2="320" y2="55" strokeDasharray="4 5" />
        <line x1="60" y1="210" x2="330" y2="215" strokeDasharray="4 5" />
      </g>
      <circle cx="200" cy="140" r="26" fill="var(--surface-2)" stroke="var(--teal)" strokeWidth="2" />
      <foreignObject x="184" y="124" width="32" height="32">
        <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Cpu style={{ width: 18, height: 18, color: "var(--teal)" }} strokeWidth={1.6} />
        </div>
      </foreignObject>
      {points.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="20" fill="var(--surface-2)" stroke="var(--border)" strokeWidth="1.5" />
          <foreignObject x={n.x - 11} y={n.y - 11} width="22" height="22">
            <div style={{ width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <n.Icon style={{ width: 13, height: 13, color: "var(--amber)" }} strokeWidth={1.6} />
            </div>
          </foreignObject>
        </g>
      ))}
    </svg>
  );
};
