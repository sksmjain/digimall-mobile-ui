import { SlidersHorizontal, ChevronDown } from "lucide-react";
import SearchUI from "./ui/Search";
import Button from "./ui/Button";
/**
 * StoreControl — product listing controls with categories and filters
 * Tailwind + React, no external UI framework
 */
export default function StoreControl({
  name = "BYLT Basics",
  bgColor = "bg-[#7A8B7B]",
  productCount = 692,
  activeCategory = "All",
}: {
  name?: string;
  bgColor?: string;
  productCount?: number;
  activeCategory?: string;
}) {
  const categories = ["All", "Men", "Women", "Best Sellers", "New Releases"];

  return (
    <section className={`${bgColor}`}>
      <div className="mx-auto max-w-7xl py-2">
        {/* Header: Products title + Search */}
        <div className="flex items-center mb-4">
          <h1 className="basis-1/3 text-xl text-left font-bold">{name}</h1>
          <div className="basis-2/3">
            <SearchUI placeholder={`Search ${name}...`} />
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex items-center gap-1 mb-4">
          {categories.map((category) => (
            <Button variant="text" label={category} active={category == activeCategory} />
          ))}
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Filter icon button - circular */}
          <Button>
            <SlidersHorizontal className="h-5 w-5" />
          </Button>

          {/* Sort by (active/white with rounded corners) */}
          <Button>
            Sort by <ChevronDown className="h-4 w-4" />
          </Button>

          {/* On sale - rounded corners with border */}
          <Button>
            On sale
          </Button>

          {/* Price - rounded corners with border */}
          <Button>
            Price <ChevronDown className="h-4 w-4" />
          </Button>

          {/* In-stock - rounded corners with border */}
          <Button>
            In-stock
          </Button>

          {/* Product count */}
          <span className="ml-2 text-sm text-white/60">{productCount} products</span>
        </div>
      </div>
    </section>
  );
}
