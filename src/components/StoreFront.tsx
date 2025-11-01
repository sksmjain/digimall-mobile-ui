// src/components/StoreFront.tsx
import React from "react";
import { ArrowRight, Heart } from "lucide-react";
import WishToast, { type WishToastPayload } from "./WishToast";

export type StoreFrontItem = {
  id: string | number;
  title: string;
  price: string; // include currency in string (e.g. "$89.00")
  image: string;
};

interface StoreFrontProps {
  title?: string;
  items: StoreFrontItem[]; // expects 2–4 for this layout
  onSeeAll?: () => void;
}

export default function StoreFront({ title = "For you", items, onSeeAll }: StoreFrontProps) {
  // ---- WishToast state ----
  const [toastItem, setToastItem] = React.useState<WishToastPayload | null>(null);
  const [toastOpen, setToastOpen] = React.useState(false);

  const showToast = (it: StoreFrontItem) => {
    setToastItem({
      id: it.id,
      title: it.title,
      image: it.image,
      // subtitle: "Added to your wishlist", // optional if your WishToast supports it
    });
    setToastOpen(true);
  };

  return (
    <section className="w-full mb-6">
      <div className="rounded-[28px] bg-[oklch(0.62_0.03_180)] text-white/95 p-5 sm:p-6 md:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
          <button
            onClick={onSeeAll}
            className="h-10 w-10 grid place-items-center rounded-full bg-white/15 ring-1 ring-white/20 backdrop-blur hover:bg-white/20 transition"
            aria-label="See all"
          >
            <ArrowRight className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Products row */}
        <div className="grid grid-cols-2 gap-4">
          {items.slice(0, 4).map((it) => (
            <article key={it.id} className="group">
              <div className="relative overflow-hidden rounded-[22px] bg-white/10">
                <img
                  src={it.image}
                  alt={it.title}
                  className="h-40 w-full object-cover sm:h-44 md:h-48"
                />

                {/* Heart overlay */}
                <button
                  onClick={() => showToast(it)}
                  className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-black/80 ring-1 ring-black/10 backdrop-blur transition hover:bg-white"
                  aria-label="Save"
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-3">
                <h3 className="text-[15px] font-semibold text-white/95 leading-snug">
                  {it.title}
                </h3>
                <p className="mt-1 text-[15px] font-medium text-white/85">
                  {it.price}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* WishToast anchored to phone root; appears above BottomNav */}
      <WishToast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        item={toastItem ?? undefined}
      />
    </section>
  );
}
