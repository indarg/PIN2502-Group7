import React, { FC, useEffect } from 'react';
import Slider, { Settings } from 'react-slick';

// Importa los estilos de react-slick
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

type TSlickCarrouselProps = {
  settings?: Settings;
  children: React.ReactNode;
  isMobile?: boolean;
}
const SlickCarrousel: FC<TSlickCarrouselProps> = ({ children, settings, isMobile = false }) => {
  const defaultSettings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipe: true,
    touchThreshold: 5,

  };
  const mobileDefaultSettings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    touchThreshold: 5,

  };
  useEffect(() => {},[isMobile])
  const finalSettings = settings || !isMobile ? defaultSettings : mobileDefaultSettings;
  return (
    <div style={{ maxWidth: '100%', margin: '0', padding: '30px', boxSizing:"border-box"  }}>
      <Slider {...finalSettings} >
        {children}
      </Slider>
    </div>
  );
};

export default SlickCarrousel;