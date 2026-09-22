import React from "react";

interface LogoProps {
  onClick?: () => void;
  className?: string;
  /** Pass the current app theme to auto-select the correct logo */
  theme?: "light" | "dark";
  /** Legacy manual override if needed */
  variant?: "white" | "dark";
}

export const Logo: React.FC<LogoProps> = ({
  onClick,
  className = "h-12 sm:h-14",
  theme,
  variant = "white",
}) => {
  // Determine which logo file to use:
  // - light theme  → logo-light.png (navy text, for white backgrounds)
  // - dark theme   → logo-white.png (white text, for dark backgrounds)
  // - fallback to legacy variant prop
  const resolvedBase = (() => {
    if (theme === "light") return "logo-dark";
    if (theme === "dark") return "logo-white";
    return variant === "white" ? "logo-white" : "logo-dark";
  })();

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 dk-focus rounded-lg group transition-transform active:scale-95 text-left"
      aria-label="DomoTek — Accueil"
    >
      <picture>
        <source type="image/webp" srcSet={`/images/${resolvedBase}.webp`} />
        <img
          src={`/images/${resolvedBase}.png`}
          alt="DomoTek"
          width={180}
          height={48}
          decoding="async"
          className={`${className} w-auto object-contain transition-all duration-500 group-hover:opacity-90`}
          style={{ transition: "opacity 0.5s ease, filter 0.5s ease" }}
        />
      </picture>
    </button>
  );
};
