import React, { useState } from "react";
import { IconTile } from "./ui";
import type { IconType } from "../types";

export const ProductGallery: React.FC<{ icon: IconType }> = ({ icon }) => {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="aspect-square rounded-2xl overflow-hidden">
        <IconTile Icon={icon} variant={((active + 1) as 1 | 2 | 3)} />
      </div>
      <div className="flex gap-2 mt-3">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="h-16 w-16 rounded-xl overflow-hidden dk-focus"
            style={{ outline: active === i ? "2px solid var(--teal)" : "1px solid var(--border)" }}
          >
            <IconTile Icon={icon} variant={((i + 1) as 1 | 2 | 3)} />
          </button>
        ))}
      </div>
    </div>
  );
};
