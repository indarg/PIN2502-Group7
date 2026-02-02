import { FC, useEffect, useRef, useState } from "react";
import { TAdvertisement } from "src/models/TAdvertisement";
import UtilService from "src/services/UtilService";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./BannerAdvertisement.css";

type BannerAdvertisementProps = {
  advertisement: TAdvertisement;
};

export const BannerAdvertisement: FC<BannerAdvertisementProps> = ({
  advertisement,
}) => {
  SwiperCore.use([Autoplay, Pagination, Navigation]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [slidesPerView, setSlidesPerView] = useState<number>(1);

  const evaluateLayout = () => {
    const containerWidth = window.innerWidth;

    if (advertisement?.ads?.length === 1) {
      setSlidesPerView(1); // Una sola imagen → siempre una por slide (full width)
    } else {
      // Múltiples imágenes → adaptativo
      if (containerWidth >= 1400) setSlidesPerView(1);
      else if (containerWidth >= 900) setSlidesPerView(2);
      else setSlidesPerView(1);
    }
  };

  useEffect(() => {
    evaluateLayout();
    window.addEventListener("resize", evaluateLayout);
    return () => window.removeEventListener("resize", evaluateLayout);
  }, [advertisement]);

  const openNewPage = (redirectUrl?: string) => {
    if (redirectUrl) window.open(redirectUrl, "_blank");
  };

  if (!advertisement?.ads?.length) return null;

  return (
    <section className="banner-advertisement" ref={containerRef}>
      <Swiper
        slidesPerView={slidesPerView}
        spaceBetween={20}
        loop={advertisement.ads.length > 1}
        autoplay={
          advertisement.ads.length > 1
            ? {
                delay: 4000,
                disableOnInteraction: false,
              }
            : false
        }
        pagination={{ clickable: true }}
        navigation={advertisement.ads.length > 1}
        className={`banner-swiper ${
          advertisement.ads.length === 1 ? "single-image" : ""
        }`}
      >
        {advertisement.ads.map((ad, index) => (
          <SwiperSlide key={index}>
            <img
              src={UtilService.resolveFile(ad.media.fileUrl)}
              alt={`ad-${index}`}
              onClick={() => openNewPage(ad.redirectUrl)}
              style={{
                cursor: ad.redirectUrl ? "pointer" : "default",
                width: advertisement.ads.length === 1 ? "100vw" : "100%",
                maxHeight: "350px",
                objectFit: "cover",
                display: "block",
                margin: advertisement.ads.length === 1 ? "0 auto" : undefined,
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
