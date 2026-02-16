import { FC, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { TNews } from "src/models/TNews"
import UtilService from "src/services/UtilService"
import SwiperCore from 'swiper'
import 'swiper/css/autoplay'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from "swiper/react"
import 'swiper/swiper-bundle.css'
import Button from "../button/Button"
import '../carrousel/CarrouselNews.css'



type CarrouselNewsProps = {
    news: TNews[];
}

const slideDuration = 6000;

const CarrouselNew: FC<CarrouselNewsProps> = ({ news }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null);
    useEffect(() => {
        setProgress(0);
        const interval = setInterval(() => {
            setProgress((prev) => (prev >= 100 ? 100 : prev + 100 / (slideDuration / 100)));
        }, 100);
        return () => clearInterval(interval);
    }, [activeIndex]);

    const goToSlide = (index: number) => {
        if (swiperInstance) {
            swiperInstance.slideToLoop(index);
        }
    };


    const redirection = useNavigate()
    const handleRedirection = (id: number) => {
        redirection(`/noticias/${id}`)
    }

    return (
        <>
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                slidesPerView={1}
                autoplay={{
                    delay: 6000,
                }}
                loop={true}
                onSwiper={setSwiperInstance}
                onSlideChange={(swiper:SwiperCore) => setActiveIndex(swiper.realIndex)}
                className="carrousel"
            >
                {news.map((item, index) =>
                    <SwiperSlide key={`${index}`} className="slide">
                        <img src={UtilService.resolveFile(item.mainImage.fileUrl)} alt={`Imagen ${index}`} />
                        <div className="slide-div">
                            <h1 className="slide-div-title headline" >{`${item.headline}`}</h1>
                            <p className="slide-div-paragraph" dangerouslySetInnerHTML={{ __html: UtilService.decodeBase64Unicode(item.lead) }}></p>
                            <Button action={() => handleRedirection(item.id)} >
                                Ver noticia
                            </Button>
                        </div>
                    </SwiperSlide>
                )}
            </Swiper>

            <div className="pagination-container">
                {news.map((_, index) => (
                    <div
                        key={index}
                        className={`pagination-item ${index === activeIndex ? "active" : ""}`}
                        onClick={() => goToSlide(index)}
                    >
                        <span>{index + 1}.</span>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: index === activeIndex ? `${progress}%` : "0%" }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default CarrouselNew;