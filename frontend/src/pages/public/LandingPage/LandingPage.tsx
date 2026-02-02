/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, Suspense, useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { NavLink, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import UtilService from 'src/services/UtilService';
import Section from 'src/shared/components/Section/Section';
import MainCarrousel from 'src/shared/components/carrousel/MainCarrousel';
import Footer from 'src/shared/components/footer/Footer';
import LazyYouTubeEmbed from 'src/shared/components/lazy_youtube_embed/LazyYouTubeEmbed';
import { OverlayAdvertisement } from 'src/shared/components/overlay_advertisement/OverlayAdvertisement';
import SlickCarrousel from 'src/shared/components/slick_carrousel/SlickCarrousel';
import useInitWeb from 'src/shared/hooks/useInitWeb';
import './LandingPage.css';
import { usePagePreparationActions } from 'src/shared/hooks/usePagePreparationActions';
import { useGlobal } from 'src/context/GlobalContext/useGlobal';
import { useLocalStorage } from 'src/shared/hooks/useLocalStorage';
const TWO_HOURS_MS = 2 * 60 * 60 * 10000;
const LandingPage: FC<any> = () => {
    const { isMobile } = useGlobal();
    const { init, news, ytVideos } = useInitWeb();
    const redirection = useNavigate();
    const [hideOverlay, setHideOverlay] = useState(false);
    const handleRedirection = (id: number | undefined) => {
        redirection(`/lanzamientos/${id}`)
    }
    const [overlayTimestamp, setOverlayTimestamp] = useLocalStorage<number | null>(
        "MAIN_OVERLAY_AD",
        null
    );
    useEffect(() => {
        init();
    }, [])

    usePagePreparationActions();
    return (
        <main className='page' >
            <Helmet>
                <title>Inicio | Motorizando</title>
                <meta name="description" content="Noticias, adelantos y lanzamientos del mundo automotor. Motorizando te trae la información más reciente y relevante sobre autos, motos y la industria automotriz." />
                <meta property="og:title" content="Motorizando | Inicio" />
                <meta property="og:description" content="Noticias, adelantos y lanzamientos del mundo automotor. Motorizando te trae la información más reciente y relevante sobre autos, motos y la industria automotriz." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.motorizando.com.ar/inicio" />
                <meta property="og:image" content={news.results.length > 0 ? news.results[0].mainImage.fileUrl : "https://www.motorizando.com.ar/logo-wallpaper.png"} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:site_name" content="Motorizando" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Motorizando | Inicio" />
                <meta name="twitter:description" content="Noticias, adelantos y lanzamientos del mundo automotor. Motorizando te trae la información más reciente y relevante sobre autos, motos y la industria automotriz." />
                <meta name="twitter:image" content={news.results.length > 0 ? news.results[0].mainImage.fileUrl : "https://www.motorizando.com.ar/logo-wallpaper.png"} />
                <link rel="canonical" href="https://www.motorizando.com.ar/inicio" />

            </Helmet>
            <Section classname='carrousel-section'>
                <MainCarrousel news={news.results ?? []} teasers={[]} releases={ []} />
            </Section>

            {ytVideos?.length > 0 && <Box margin={"50px 0"}>
                <Typography variant='h2' sx={{ width: "100%" }} className='pd' >Nuestros últimos videos</Typography>
                <SlickCarrousel isMobile={isMobile}>
                    {ytVideos.map((y, index) => (
                        <LazyYouTubeEmbed
                            key={index}
                            videoId={y.id}
                            title={y.title}
                        />
                    ))}

                </SlickCarrousel>
            </Box>}

            {news && news.total > 4 && <Section classname='most-recent-section'>
                <Typography variant='h2' sx={{ width: "100%" }} className='pd' >Noticias más recientes</Typography>
                <div>
                    {
                        news?.results?.slice(0, 4).map((n, index) => (
                            <div key={index} style={UtilService.createStyleImageAsBackground(UtilService.resolveFile(n.mainImage.fileUrl))}>
                                <NavLink to={`/noticias/${n.id}`}>
                                    <Typography variant='h6' sx={{ margin: 2 }}>{n.headline}</Typography>
                                </NavLink>
                            </div>
                        ))
                    }
                </div>
            </Section>}

            <Footer />


        </main>

    );
};

export default LandingPage;