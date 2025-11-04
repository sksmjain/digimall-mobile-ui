import { type CardItem } from "./CardDeck";
import CardPager from "./CardPager";


const feed: CardItem[] = [
  {
    id: 1,
    title: "Fall Collection: Minimalist Layers",
    summary: "Premium fleece, muted tones, and clean silhouettes. Tap to shop the edit.",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1600&auto=format&fit=crop",
    source: "Comfrt",
    ctaLabel: "Shop collection",
  },
  {
    id: 2,
    title: "Behind the seams — 100% combed cotton",
    kind: "video",
    videoSrc: "https://cdn.coverr.co/videos/coverr-running-through-the-city-6288/1080p.mp4",
    poster: "https://images.unsplash.com/photo-1587613865763-4b8b0b923fbe?q=80&w=1400&auto=format&fit=crop",
    summary: "Why fabric choice matters for drape, breathability, and longevity.",
    source: "BYLT Basics",
  },
  {
    id: 3,
    title: "Hoodies under $40 — this weekend only",
    summary: "Top picks from the minimalist line. Limited colors left.",
    image: "https://images.unsplash.com/photo-1520975922215-230a090b96c8?q=80&w=1600&auto=format&fit=crop",
    source: "Deals",
    ctaLabel: "View offers",
  },
];

export default function InshortsPage() {
  return (
    <div className="relative h-[100dvh] w-full" style={
        {
          "--dock-space": "0px",
          "--frame-pad-bottom": "0px",
          // optional if you want tighter top on desktop:
          // "--frame-pad-top": "0px",
        } as React.CSSProperties
      }>
      <CardPager
        items={feed}
        onIndexChange={(_i) => {
          // analytics / prefetch hooks
          // console.log("Active card:", _i);
        }}
      />
    </div>
  );
}
