export default function HeroSearch() {
    const products = [
      "/img1.png","/img2.png","/img3.png","/img4.png",
      "/img5.png","/img6.png","/img7.png","/img8.png",
      "/img9.png","/img10.png","/img11.png","/img12.png",
      "/img13.png","/img14.png","/img15.png","/img16.png",
    ];
  
    return (
      <section className="relative w-full bg-white pb-20 pt-16">
        {/* Grid background images */}
        <div className="max-w-6xl mx-auto grid grid-cols-4 gap-4 opacity-90">
          {products.map((src, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border border-gray-200 bg-white h-40 w-full flex items-center justify-center"
            >
              <img
                src={src}
                alt="product"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
  
        {/* Center overlay container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          
          {/* Logo */}
          <h1 className="text-[56px] font-black text-[#6754F8] mb-6 pointer-events-auto">
            DigiMall
          </h1>
  
          {/* Search */}
          <div className="relative w-[480px]">
            <input
              type="text"
              placeholder="Compact cameras for travel"
              className="
                w-full py-4 px-6 rounded-full bg-white/80 backdrop-blur-xl
                border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.08)]
                text-gray-700 text-lg placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-[#6754F8]/40
                pointer-events-auto
              "
            />
          </div>
        </div>
      </section>
    );
  }
  