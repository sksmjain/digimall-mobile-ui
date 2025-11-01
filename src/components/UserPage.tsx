// src/components/UserPage.tsx
import React from "react";
import {
  Cog,
  Heart,
  Store as StoreIcon,
  ChevronRight,
  Heart as HeartIcon,
} from "lucide-react";

// ⬇️ Bring in your toast component + payload type
import WishToast, { type WishToastPayload } from "./WishToast";

type ViewedItem = {
  id: string | number;
  title: string;
  image: string;
  price: string;
  compareAt?: string;
};

const viewed: ViewedItem[] = [
  {
    id: 1,
    title: "Pink set",
    image:
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=1200&auto=format&fit=crop",
    price: "$34.99",
    compareAt: "$49.99",
  },
  {
    id: 2,
    title: "Cozy fleece",
    image:
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop",
    price: "$34.99",
    compareAt: "$49.99",
  },
  {
    id: 3,
    title: "Leopard hoodie",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop",
    price: "$55.00",
    compareAt: "$120.00",
  },
  {
    id: 4,
    title: "Crew in grey",
    image:
      "https://images.unsplash.com/photo-1520975922215-230a090b96c8?q=80&w=1200&auto=format&fit=crop",
    price: "$39.99",
  },
];

export default function UserPage() {
  // ---- WishToast state ----
  const [toastItem, setToastItem] = React.useState<WishToastPayload | null>(
    null
  );
  const [toastOpen, setToastOpen] = React.useState(false);

  const notifyWish = (item: { id: ViewedItem["id"]; title: string; image: string }) => {
    setToastItem({
      id: item.id,
      title: item.title,
      image: item.image,
      // optional fields supported by your WishToast can be added here:
      // subtitle: "Added to your wishlist",
    });
    setToastOpen(true);
  };

  return (
    <div className="px-4 pt-6 pb-28 text-black"> {/* extra bottom space so content doesn't sit under nav/toast */}
      {/* Floating settings */}
      <button
        className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow ring-1 ring-black/10"
        aria-label="Settings"
      >
        <Cog className="h-5 w-5" />
      </button>

      {/* Tiles: Saved / Following */}
      <div className="grid grid-cols-2 gap-3">
        <Tile
          icon={<Heart className="h-6 w-6" />}
          label="Saved"
          onClick={() => {}}
        />
        <Tile
          icon={<StoreIcon className="h-6 w-6" />}
          label="Following"
          onClick={() => {}}
        />
      </div>

      {/* Order history */}
      <section className="mt-6">
        <h2 className="text-xl text-left font-semibold tracking-tight">Order history</h2>

        <div className="mt-3 rounded-2xl bg-white shadow-sm ring-1 ring-black/10 p-4 flex gap-3">
          <img
            alt="Package"
            className="h-16 w-16 rounded-xl object-cover"
            src="https://images.unsplash.com/photo-1591549709068-2a1f2e3b6b3e?q=80&w=600&auto=format&fit=crop"
          />
          <div className="flex-1">
            <p className="text-md text-left font-semibold">No orders yet</p>
            <p className="text-black/60 text-[15px] text-left leading-5">
              Orders you place in Shop or sync from your emails will show up
              here
            </p>
          </div>
        </div>
      </section>

      {/* Recently viewed */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            Recently viewed
          </h2>
          <button className="grid h-8 w-8 place-items-center rounded-full bg-black/5">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div
          className="flex gap-3 overflow-x-auto scroll-smooth pb-1 no-scrollbar"
          style={{ scrollbarWidth: "none" } as React.CSSProperties}
        >
          {/* Hide scrollbar (WebKit) */}
          <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>

          {viewed.map((v) => (
            <div
              key={v.id}
              className="min-w-[180px] max-w-[180px] select-none"
            >
              <div className="relative rounded-2xl overflow-hidden bg-white ring-1 ring-black/10">
                {/* Price badge */}
                <div className="absolute left-2 top-2 rounded-full bg-black/80 text-white text-xs px-2 py-1">
                  <span className="font-semibold">{v.price}</span>
                  {v.compareAt && (
                    <span className="ml-1 text-white/70 line-through">
                      {v.compareAt}
                    </span>
                  )}
                </div>

                {/* Heart bubble */}
                <button
                  aria-label="Save"
                  onClick={() => notifyWish(v)}
                  className="absolute bottom-2 right-2 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow ring-1 ring-black/10 hover:bg-white"
                >
                  <HeartIcon className="h-5 w-5" />
                </button>

                <img
                  src={v.image}
                  alt={v.title}
                  className="h-44 w-full object-cover"
                />
              </div>

              <p className="mt-2 line-clamp-1 text-[15px] font-medium">
                {v.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sign-in / create account card */}
      <section className="mt-8">
        <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/10 p-5">
          <h3 className="text-xl font-semibold">
            Sign in or create an account
          </h3>
          <p className="mt-2 text-[15px] leading-6 text-black/70">
            Shop from your favorite stores, speed through checkout, and track
            your orders.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <button className="flex-1 rounded-full bg-violet-600 px-5 py-3 text-white font-semibold shadow">
              Sign in
            </button>
          </div>
        </div>
      </section>

      {/* WishToast anchored to phone root; appears above BottomNav */}
      <WishToast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        item={toastItem ?? undefined}
      />
    </div>
  );
}

/* --------- tiny subcomponents --------- */

function Tile({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-col w-full items-center gap-3 rounded-3xl bg-white p-4 text-left shadow-sm ring-1 ring-black/10"
    >
      <div className="grid h-12 w-12 place-items-center rounded-full bg-black/5">
        {icon}
      </div>
      <span className="text-md font-semibold">{label}</span>
    </button>
  );
}
