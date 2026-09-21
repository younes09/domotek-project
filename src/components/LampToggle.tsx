import React, { useState } from "react";

interface LampToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

/**
 * Creative lamp-shaped theme toggle.
 * Light mode  → lamp is ON  (glowing bulb, warm rays)
 * Dark mode   → lamp is OFF (dim bulb, no rays)
 */
export const LampToggle: React.FC<LampToggleProps> = ({ isDark, onToggle }) => {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 300);
    onToggle();
  };

  // Color tokens depending on current theme
  const isOn = !isDark; // lamp ON = light mode

  return (
    <button
      onClick={handleClick}
      aria-label={isDark ? "Activer le thème clair" : "Activer le thème sombre"}
      title={isDark ? "Passer au thème clair 🌞" : "Passer au thème sombre 🌙"}
      className="relative group flex items-center justify-center"
      style={{ width: 44, height: 44, borderRadius: "50%", outline: "none", background: "transparent", border: "none", cursor: "pointer" }}
    >
      {/* Outer glow ring when ON */}
      {isOn && (
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,200,50,0.25) 0%, transparent 70%)",
            animation: "lampGlow 2.5s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
      )}

      <svg
        viewBox="0 0 44 44"
        width={44}
        height={44}
        style={{
          transform: pressed ? "scale(0.88)" : "scale(1)",
          transition: "transform 0.18s cubic-bezier(0.34,1.56,0.64,1)",
          overflow: "visible",
        }}
        aria-hidden="true"
      >
        {/* ── Light rays (visible only when ON) ── */}
        {isOn && (
          <g opacity={1} style={{ transition: "opacity 0.4s ease" }}>
            {/* Ray 1 – top */}
            <line x1="22" y1="4" x2="22" y2="0.5" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            {/* Ray 2 – top-right */}
            <line x1="29" y1="7" x2="32" y2="4" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            {/* Ray 3 – right */}
            <line x1="34" y1="14" x2="37.5" y2="12" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            {/* Ray 4 – top-left */}
            <line x1="15" y1="7" x2="12" y2="4" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            {/* Ray 5 – left */}
            <line x1="10" y1="14" x2="6.5" y2="12" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* ── Lamp shade ── */}
        <path
          d="M14 20 L10 10 Q10 8 12 8 L32 8 Q34 8 34 10 L30 20 Z"
          fill={isOn ? "#fcd34d" : "var(--surface-2)"}
          stroke={isOn ? "#f59e0b" : "var(--border)"}
          strokeWidth="1.2"
          style={{ transition: "fill 0.4s ease, stroke 0.4s ease" }}
        />

        {/* ── Shade rim ── */}
        <rect
          x="12" y="19" width="20" height="3" rx="1.5"
          fill={isOn ? "#f59e0b" : "var(--border)"}
          style={{ transition: "fill 0.4s ease" }}
        />

        {/* ── Bulb body ── */}
        <ellipse
          cx="22" cy="24" rx="5" ry="5.5"
          fill={isOn ? "#fffbeb" : "var(--surface)"}
          stroke={isOn ? "#fcd34d" : "var(--border)"}
          strokeWidth="1.2"
          style={{ transition: "fill 0.4s ease, stroke 0.4s ease" }}
        />

        {/* Bulb glow inner circle */}
        {isOn && (
          <ellipse
            cx="22" cy="23.5" rx="3" ry="3.3"
            fill="#fef3c7"
            opacity={0.9}
            className="lamp-glow"
          />
        )}

        {/* Filament lines */}
        <line
          x1="20" y1="26" x2="22" y2="24"
          stroke={isOn ? "#f59e0b" : "var(--text-faint)"}
          strokeWidth="1" strokeLinecap="round"
          style={{ transition: "stroke 0.4s ease" }}
        />
        <line
          x1="24" y1="26" x2="22" y2="24"
          stroke={isOn ? "#f59e0b" : "var(--text-faint)"}
          strokeWidth="1" strokeLinecap="round"
          style={{ transition: "stroke 0.4s ease" }}
        />

        {/* Bulb base */}
        <rect
          x="20" y="28.5" width="4" height="2.5" rx="0.8"
          fill={isOn ? "#f59e0b" : "var(--border)"}
          style={{ transition: "fill 0.4s ease" }}
        />

        {/* ── Lamp stand / neck ── */}
        <line
          x1="22" y1="31" x2="22" y2="38"
          stroke={isOn ? "#d97706" : "var(--text-faint)"}
          strokeWidth="2" strokeLinecap="round"
          style={{ transition: "stroke 0.4s ease" }}
        />

        {/* ── Lamp base ── */}
        <rect
          x="16" y="38" width="12" height="3" rx="1.5"
          fill={isOn ? "#d97706" : "var(--border)"}
          style={{ transition: "fill 0.4s ease" }}
        />

        {/* ── Cord & power button dot ── */}
        <circle
          cx="22" cy="41.5" r="1.2"
          fill={isOn ? "#fbbf24" : "var(--text-faint)"}
          style={{ transition: "fill 0.4s ease" }}
        />
      </svg>
    </button>
  );
};
