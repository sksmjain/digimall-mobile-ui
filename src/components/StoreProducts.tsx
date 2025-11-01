
import { openProductCardWithZoom } from "../lib/openProductWithZoom";
import { Heart, Star } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import type { WishToastPayload } from "./WishToast";
import WishToast from "./WishToast";

export type StoreProduct = {
  id: string | number;
  title: string;
  image: string;
  price: number; // current price
  compareAtPrice?: number; // old price (strikethrough)
  rating?: number; // e.g., 4.7
  ratingCount?: string | number; // e.g., "8.4K"
  discountLabel?: string; // e.g., "59% off"
};

interface StoreProductsProps {
  products: StoreProduct[];
  currency?: string; // default '$'
  onFav?: (id: StoreProduct["id"]) => void;
}

/**
 * StoreProducts — 2‑column product grid optimized for mobile
 * - Rounded images with wishlist heart overlay
 * - Discount badge
 * - Title, star rating, price + compare-at price
 * - Tailwind v4 friendly
 */
export default function StoreProducts({ products, currency = "$", onFav }: StoreProductsProps) {

  const [toastItem, setToastItem] = React.useState<WishToastPayload | null>(null);
  const [toastOpen, setToastOpen] = React.useState(false);

  const showToast = (item: WishToastPayload) => {
    setToastItem(item);
    setToastOpen(true);
  };


  return (
    <section className="w-full">
      <div className="grid grid-cols-2 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} currency={currency} onFav={(id) => {
            onFav?.(id);
            showToast({ title: p.title, image: p.image });
          }} />)
        )}
      </div>
      {/* Toast lives inside PhoneFrame via portal */}
      <WishToast open={toastOpen} item={toastItem} onClose={() => setToastOpen(false)} />
    </section>
  );
}

function ProductCard({
  p, currency, onFav,
}: {
  p: StoreProduct; currency: string; onFav?: (id: StoreProduct["id"]) => void;
}) {
  const navigate = useNavigate();
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    const cardEl = cardRef.current;
    if (!cardEl) return navigate(`/product/${p.id}`);
    openProductCardWithZoom(cardEl, `/product/${p.id}`, navigate);
  };

  const price = formatPrice(p.price, currency);
  const compare = p.compareAtPrice ? formatPrice(p.compareAtPrice, currency) : undefined;

  return (
    <article className="text-black/95">
      {/* media (use the WHOLE wrapper as the clickable card) */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-[22px] ring-1 ring-black/10 bg-white cursor-pointer select-none"
        onClick={handleOpen}
      >
        {!!p.discountLabel && (
          <span className="absolute left-3 top-3 rounded-full bg-black text-white text-[10px] px-2.5 py-1 font-semibold shadow">
            {p.discountLabel}
          </span>
        )}

        <img src={p.image} alt={p.title} className="h-44 w-full object-cover" />

        <div className="p-3">
          <h3 className="text-[15px] font-semibold leading-snug line-clamp-2">{p.title}</h3>
          {(p.rating || p.ratingCount) && (
            <div className="mt-1 flex items-center gap-1 text-[13px] text-black/85">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(p.rating ?? 0) ? "fill-current text-yellow-400" : "text-black/40"}`} />
              ))}
              {p.rating && <span className="ml-1 font-medium">{p.rating.toFixed(1)}</span>}
              {p.ratingCount && <span className="ml-1 text-black/70">({p.ratingCount})</span>}
            </div>
          )}
          <div className="mt-1 flex items-center gap-2 text-[15px]">
            <span className="font-semibold">{price}</span>
            {compare && <span className="text-black/60 line-through">{compare}</span>}
          </div>
        </div>

        {/* wishlist (prevent opening) */}
        <button
          onClick={(e) => { e.stopPropagation(); onFav?.(p.id); }}
          className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-white/85 text-black/80 ring-1 ring-black/10 backdrop-blur hover:bg-white transition"
          aria-label="Save"
        >
          <Heart className="h-5 w-5" />
        </button>
      </div>
    </article>
  );
}

function formatPrice(n: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: currencyMap[currency] ?? "USD" }).format(n);
  } catch {
    // If a symbol like "$" was passed, just prefix it
    return `${currency}${n.toFixed(2)}`;
  }
}

// Support passing either symbol or currency code
const currencyMap: Record<string, Intl.NumberFormatOptions["currency"]> = {
  "$": "USD",
  "USD": "USD",
  "€": "EUR",
  "EUR": "EUR",
  "₹": "INR",
  "INR": "INR",
  "£": "GBP",
  "GBP": "GBP",
};
