type FeatureItem = {
    title: string;
    image: string;
  };
  
  interface FeatureCarouselProps {
    items: FeatureItem[];
  }
  
  export default function FeatureCarousel({ items }: FeatureCarouselProps) {
    return (
      <div className="w-full">
        <div
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none px-4"
        >
          {items.map((item, idx) => (
            <div key={idx} className="flex-shrink-0 snap-start w-[75%] sm:w-[45%] lg:w-[30%]">
              <div className="rounded-3xl overflow-hidden aspect-[2.2] bg-gray-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-3 text-[15px] font-semibold text-gray-900/90">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  