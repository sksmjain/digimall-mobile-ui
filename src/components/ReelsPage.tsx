// src/pages/ReelsPage.tsx
import SwipeDeck, { type DeckItem } from "@/components/SwipeDeck";

const reels: DeckItem[] = [
  {
    id: 1,
    kind: "video",
    src: "https://cdn.coverr.co/videos/coverr-a-man-in-a-red-shirt-2682/1080p.mp4",
    poster: "https://images.unsplash.com/photo-1587613865763-4b8b0b923fbe?q=80&w=1200&auto=format&fit=crop",
    caption: "Minimalist Hoodie • $39",
  },
  {
    id: 2,
    kind: "image",
    src: "https://images.unsplash.com/photo-1520975922215-230a090b96c8?q=80&w=1500&auto=format&fit=crop",
    caption: "FW’25 Look • Comfrt",
  },
  {
    id: 3,
    kind: "video",
    src: "https://cdn.coverr.co/videos/coverr-running-through-the-city-6288/1080p.mp4",
    caption: "Run collection • 20% off",
  },
];

export default function ReelsPage() {
  return (
    <div className="relative h-[calc(100dvh)] w-full bg-black">
      <SwipeDeck
        items={reels}
        onIndexChange={(_i) => {
          // analytics / prefetch next
          // console.log("Active reel:", _i);
        }}
      />
    </div>
  );
}
