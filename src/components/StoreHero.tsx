
interface StoreHeroProps {
  image: string;
  logoText?: string;
  logoImage?: string; // optional if store uses logo image instead of text
}

export default function StoreHero({ image, logoText = "Comfrt", logoImage }: StoreHeroProps) {
  return (
    <div className="relative w-full h-48 sm:h-60 overflow-hidden rounded-xl">
      {/* Background Image */}
      <img
        src={image}
        alt="Store Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30"></div>

      {/* Center Logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        {logoImage ? (
          <img
            src={logoImage}
            alt="Store Logo"
            className="h-12 sm:h-16 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
          />
        ) : (
          <span className="text-white font-[600] text-3xl sm:text-4xl tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]">
            {logoText}
          </span>
        )}
      </div>
    </div>
  );
}
