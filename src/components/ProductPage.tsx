import { useEffect, useRef, useState } from "react";
import { Heart, MoreHorizontal, Star } from "lucide-react";
import ProductGallery from "./ProductGallery";
import WishToast, { type WishToastPayload } from "./WishToast";
import MenuPop from "./MenuPop"; // ✅ import MenuPop

interface ColorOption { id: number; color: string; }
interface SizeOption { id: number; label: string; }

const colors: ColorOption[] = [
  { id: 1, color: "#9b4a63" },
  { id: 2, color: "#d02926" },
  { id: 3, color: "#fe71a2" },
  { id: 4, color: "#aec4da" },
  { id: 5, color: "#f2c7dd" },
  { id: 6, color: "#55634b" },
  { id: 7, color: "#d2bfd0" },
  { id: 8, color: "#8eb4d8" },
];

const sizes: SizeOption[] = [
  { id: 1, label: "XS" },
  { id: 2, label: "S" },
  { id: 3, label: "M" },
  { id: 4, label: "L" },
  { id: 5, label: "XL" },
  { id: 6, label: "2X" },
  { id: 7, label: "3X" },
];

export default function ProductPage() {
  const [activeColor, setActiveColor] = useState(1);
  const [activeSize, setActiveSize] = useState(1);

  const ref = useRef<HTMLDivElement>(null);

  // 🍏 WishToast state
  const [toastItem, setToastItem] = useState<WishToastPayload | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const showToast = (item: WishToastPayload) => { 
    setToastItem(item);
    setToastOpen(true);
  };

  // 🍎 MenuPop state
  const [menuOpen, setMenuOpen] = useState(false);

  const images = [
    "https://cdn.shopify.com/s/files/1/0569/4029/8284/files/Crimson.jpg?v=1718878184&width=1500",
    "https://cdn.shopify.com/s/files/1/0569/4029/8284/files/Untitleddesign_97e5fbbe-690f-4fdf-8df2-a1e01cf4bc9b.jpg?v=1718878307&width=1500",
    "https://cdn.shopify.com/s/files/1/0569/4029/8284/files/Untitleddesign_7.jpg?v=1718878307&width=1500",
    "https://cdn.shopify.com/s/files/1/0569/4029/8284/files/Untitleddesign_4_bbfcb910-4292-4b68-a8e5-03149c530511.jpg?v=1718878307&width=1500"
  ];

  const productTitle = "Minimalist Sweatpants";
  const primaryImage = images[0];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(2px)";
    el.style.transition = "opacity .18s ease, transform .18s ease";
    requestAnimationFrame(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, []);

  return (
    <>
      <div ref={ref} className="flex flex-col gap-4">

        {/* Store header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-neutral-200" />
            <div>
              <p className="font-semibold">Comfrt</p>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span>4.8</span>
                <Star className="h-4 w-4 fill-black text-black" />
                <span>(200.8K)</span>
              </div>
            </div>
          </div>
          <button className="px-4 py-2 rounded-full bg-white shadow font-medium">Visit store</button>
        </div>

        <ProductGallery images={images} className="rounded-xl" />

        {/* Title + actions */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-lg font-semibold">{productTitle}</p>
            <div className="flex items-center gap-1 text-sm text-gray-700">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="h-4 w-4 fill-black text-black" />
              ))}
              <span className="ml-1 text-gray-500">4.9K ratings</span>
            </div>
          </div>

          <div className="flex gap-2">
            {/* ❤️ Wishlist */}
            <button
              className="h-10 w-10 grid place-items-center rounded-full bg-white shadow"
              onClick={() => showToast({ title: productTitle, image: primaryImage })}
            >
              <Heart className="h-5 w-5" />
            </button>

            {/* ⋯ Menu */}
            <button
              className="h-10 w-10 grid place-items-center rounded-full bg-white shadow"
              onClick={() => setMenuOpen(true)}
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="text-lg font-semibold">
          $39.00 <span className="text-gray-400 line-through ml-2">$60.00</span>
        </div>

        {/* Colors */}
        <div>
          <p className="font-medium mb-2">Color Berry</p>
          <div className="grid grid-cols-8 gap-2">
            {colors.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveColor(c.id)}
                className={`h-9 w-9 rounded-full border-2 transition ${activeColor === c.id ? "border-black" : "border-white"}`}
                style={{ backgroundColor: c.color }}
              />
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <p className="font-medium mb-2">Size XS</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSize(s.id)}
                className={`px-4 py-2 rounded-full border text-sm transition ${
                  activeSize === s.id ? "border-black font-semibold" : "border-gray-300 text-gray-600"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <button className="w-full bg-black text-white py-3 rounded-full font-semibold">
          Add to Bag
        </button>
      </div>

      {/* ✅ Menu bottom sheet */}
      <MenuPop
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        shopName="Comfrt"
        logo="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=200"
        rating={4.8}
        ratingCount="200.8K"
      />

      {/* 🍏 Wish toast */}
      <WishToast
        open={toastOpen}
        item={toastItem}
        onClose={() => setToastOpen(false)}
      />
    </>
  );
}
