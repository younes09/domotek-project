import React from "react";
import { ProductCard } from "./ProductCard";
import type { Product, Store } from "../types";

/** Mobile: horizontal snap-scroll carousel. Desktop/tablet: real grid. */
export const ProductGrid: React.FC<{ products: Product[]; s: Store; columns?: 3 | 4 }> = ({ products, s, columns = 4 }) => (
  <>
    <div className="flex md:hidden gap-3 overflow-x-auto pb-1 dk-scrollbar" style={{ scrollSnapType: "x mandatory" }}>
      {products.map((p) => (
        <div key={p.id} className="w-44 shrink-0" style={{ scrollSnapAlign: "start" }}>
          <ProductCard product={p} s={s} />
        </div>
      ))}
    </div>
    <div className={`hidden md:grid gap-5 ${columns === 3 ? "grid-cols-3" : "grid-cols-4"}`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} s={s} />
      ))}
    </div>
  </>
);
