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
import './MainCarrousel.css'
import { TRelease } from "src/models/TRelease"
import { TTeaser } from "src/models/TTeaser"
import { Typography } from "@mui/material"
import { TagLinks } from "../tag_links/TagLinks"
import { TTag } from "src/models/TTag"
import { useGlobal } from "src/context/GlobalContext/useGlobal"

type MainCarrouselsProps = {
    news?: TNews[];
    teasers?: TTeaser[];
    releases?: TRelease[];
}

type TCarrouselItem = {
    id: number,
    title: string,
    description: string,
    url: string,
    imageUrl?: string,
    label: string,
    tags: TTag[]
}
const slideDuration = 6000;
const MainCarrousel: FC<MainCarrouselsProps> = ({ news = [], teasers = [], releases = [] }) => {
    const { showSplashScreen } = useGlobal();
    const [carrouselItems, setCarrouselItems] = useState<TCarrouselItem[]>([]);
    const getTop10RecentCarouselItems = (): TCarrouselItem[] => {

        const allItems: Array<TNews | TRelease | TTeaser> = [
            ...news,
            ...releases,
            ...teasers
        ];
        allItems.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime(); // Orden descendente
        });
        const top10Items = allItems.slice(0, 10);
        const carrouselItems: TCarrouselItem[] = top10Items.map((item) => {
            let url = "";
            let title = "";
            let description = "";
            let label = '';
            let imageUrl: string | undefined = undefined;

            if ('series' in item) {
                item = item as TRelease;
                url = `/lanzamientos/${item.id}`;
                title = item.headline
                description = item.lead; // O item.lead
                imageUrl = item.mainImage?.fileUrl;
                label = 'Ver lanzamiento';
            } else if ('launchDate' in item) {
                item = item as TTeaser;
                url = `/adelantos/${item.id}`;
                title = item.headline
                description = item.body;
                imageUrl = item.mainImage?.fileUrl;
                label = 'Ver adelanto';
            } else {

                item = item as TNews;
                url = `/noticias/${item.id}`;
                title = item.headline
                description = item.lead; // O item.description, según lo que quieras en el carrusel
                imageUrl = item.mainImage?.fileUrl; // Si quieres la imagen principal
                label = 'Ver noticia';
            }

            return {
                id: item.id,
                title,
                label,
                description,
                url,
                imageUrl, // Agrega la URL de la imagen si la necesitas
                createdAt: item.createdAt, // Mantén la fecha por si la necesitas para el carrusel
                tags: item.tags
            };
        });

        return carrouselItems;
    }
    const [activeIndex, setActiveIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null);
    useEffect(() => { setCarrouselItems(getTop10RecentCarouselItems()) }, [news, teasers, releases])
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

    const nav = useNavigate()

    useEffect(() => {
        if (!swiperInstance) return;

        if (!showSplashScreen) {
            // esperamos un poquito a que desaparezca visualmente
            const timer = setTimeout(() => {
                swiperInstance.update();     // recalcula tamaño
                swiperInstance.loopDestroy(); // resetea loop interno
                swiperInstance.loopCreate();  // lo vuelve a armar
                swiperInstance.slideToLoop(0, 0, false); // vuelve a la primera slide
                if (swiperInstance.autoplay && swiperInstance.autoplay.start) {
                    swiperInstance.autoplay.start(); // reactiva autoplay
                }
            }, 4000); // ajustá este valor al fade de tu splash (por ej. 500 ms)
            return () => clearTimeout(timer);
        }
        return;
    }, [showSplashScreen, swiperInstance]);


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
                onSlideChange={(swiper: SwiperCore) => setActiveIndex(swiper.realIndex)}
                className="carrousel"
            >
                {carrouselItems.map((item, index) =>
                    <SwiperSlide key={`${index}`} className="slide">
                        <img loading="lazy"
                            decoding="async" src={UtilService.resolveFile(item.imageUrl)} alt={`${item.title || "Imagen de noticia automotriz"}`} />
                        <div className="slide-div">
                            <h2 className="headline" >{`${item.title}`}</h2>
                            <Typography variant="body2" dangerouslySetInnerHTML={{ __html: UtilService.decodeBase64Unicode(item.description) }}></Typography>
                            <TagLinks tags={item.tags} />

                            <Button action={() => nav(item.url)} >
                                {item.label}
                            </Button>
                        </div>
                    </SwiperSlide>
                )}
            </Swiper>

            <div className="pagination-container">
                {carrouselItems.map((_, index) => (
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

export default MainCarrousel;