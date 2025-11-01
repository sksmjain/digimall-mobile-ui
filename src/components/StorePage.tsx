import FeatureCarousel from "./FeatureCarousel";
import StoreControl from "./StoreControl";
import StoreFront from "./StoreFront";
import StoreHero from "./StoreHero";
import StoreProducts, { type StoreProduct } from "./StoreProducts";

export default function StorePage() {
    const sections = [
        {
          title: "Men's Fall Collection",
          image: "https://cdn.shopify.com/shop-assets/shopify_brokers/bylt-apparel.myshopify.com/1760535571/fallshoptile.jpeg?width=512",
        },
        {
          title: "Men's Fall Golf",
          image: "https://cdn.shopify.com/shop-assets/shopify_brokers/bylt-apparel.myshopify.com/1759986783/plpbanner-mobile-Fall-Golf.jpeg?width=512",
        },
        {
          title: "Best Sellers",
          image: "https://cdn.shopify.com/shop-assets/shopify_brokers/bylt-apparel.myshopify.com/1748361504/Short-Sleeves.jpeg?width=512",
        },
        {
          title: "Women's Fall Styles",
          image: "https://cdn.shopify.com/shop-assets/shopify_brokers/bylt-apparel.myshopify.com/1760535467/Womens_Balm.jpeg?width=512",
        },
      ];
    
      const items = [
        { id: 1, title: "Palmera set",   price: "$110.00", image: "https://cdn.shopify.com/shop-assets/static_uploads/web/merchant_on_home/f7w5d2cbrz-background-image.jpg?width=360" },
        { id: 2, title: "Mirador short", price: "$89.00",  image: "https://cdn.shopify.com/shop-assets/static_uploads/web/merchant_on_home/r24kgn38d5-background-image.jpg?width=360" },
      ];

      const products: StoreProduct[] = [
        {
          id: 1,
          title: "Minimalist Hoodie",
          image: "https://cdn.shopify.com/s/files/1/0569/4029/8284/files/Crimson.jpg?v=1718878184&width=1500",
          price: 49,
          compareAtPrice: 120,
          rating: 4.8,
          ratingCount: "8.4K",
          discountLabel: "59% off",
        },
        {
          id: 2,
          title: "Signature Hoodie",
          image: "https://cdn.shopify.com/s/files/1/0569/4029/8284/files/1_2.jpg?v=1753391093&width=384",
          price: 49,
          compareAtPrice: 120,
          rating: 4.7,
          ratingCount: "17.1K",
          discountLabel: "59% off",
        },
        // ...
      ];

    return (
         <>
            <StoreHero image="https://cdn.shopify.com/shop-assets/shopify_brokers/comfrtclothing.myshopify.com/1725050789/DSC00791copy1.jpeg?crop=region&crop_left=0&crop_top=77&crop_width=2160&crop_height=1358&width=1000" logoImage="https://cdn.shopify.com/shop-assets/shopify_brokers/comfrtclothing.myshopify.com/1725047086/Untitleddesign1.png?crop=region&crop_left=0&crop_top=49&crop_width=1125&crop_height=277&width=640" />
            <StoreControl name="Comfrt" bgColor="white" productCount={692} />
            <FeatureCarousel items={sections} />
            <StoreFront items={items} onSeeAll={() => console.log("see all")} />
            <StoreProducts products={products} currency="$" onFav={(id) => console.log("fav", id)} />
         </>
    )
}