import React from "react";

interface AndersonLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export const AndersonLogo: React.FC<AndersonLogoProps> = ({
  className = "",
  size = "md",
  showTagline = true,
}) => {
  // Dimension ratios
  const dimensions = {
    sm: { width: 140, height: 42, fontSizeName: 28, fontSizeTag: 11 },
    md: { width: 190, height: 56, fontSizeName: 38, fontSizeTag: 14 },
    lg: { width: 240, height: 72, fontSizeName: 48, fontSizeTag: 18 },
  }[size];

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <svg
        viewBox="0 0 240 70"
        className="w-auto"
        style={{ height: dimensions.height }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Anderson E-Commerce Logistics"
      >
        {/* Yellow highlighter mark behind 'And' */}
        <rect
          x="4"
          y="6"
          width="92"
          height="38"
          rx="3"
          fill="#FFE600"
          className="transition-colors"
        />

        {/* 'Anderson' wordmark */}
        <text
          x="6"
          y="38"
          fill="#E01E26"
          fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
          fontWeight="800"
          fontSize="42"
          letterSpacing="-0.5px"
        >
          Anderson
        </text>

        {/* 'E-Commerce Logistics' subtitle */}
        {showTagline && (
          <text
            x="8"
            y="60"
            fill="currentColor"
            className="text-slate-800 dark:text-slate-200"
            fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
            fontWeight="500"
            fontStyle="italic"
            fontSize="15"
            letterSpacing="0.2px"
          >
            E-Commerce Logistics
          </text>
        )}
      </svg>
    </div>
  );
};
