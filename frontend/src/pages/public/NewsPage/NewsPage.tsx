import { Box, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCommon } from "src/context/CommonContext/useCommon";
import { useGlobal } from "src/context/GlobalContext/useGlobal";
import { useNews } from "src/context/NewsContext/useNews";
import { TPaginatedPayload } from "src/models/response/TPaginatedPayload";
import { TNews } from "src/models/TNews";
import NewsService from "src/services/NewsService";
import UtilService from "src/services/UtilService";
import Button from "src/shared/components/button/Button";
import Footer from "src/shared/components/footer/Footer";
import PagesSelector from "src/shared/components/pages_selector/PagesSelector";
import Section from "src/shared/components/Section/Section";
import { TagLinks } from "src/shared/components/tag_links/TagLinks";
import { usePagePreparationActions } from "src/shared/hooks/usePagePreparationActions";
import './NewsPage.css'



const NewsPage: FC<any> = () => {
    const { news, initNews } = useNews();
    const navigate = useNavigate();
    const [newsOnPage, setNewsOnPage] = useState<TPaginatedPayload<TNews[]>>({ results: [], total: 0 });
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1');
    const newsService = new NewsService();
    const { setTransitionLoading } = useCommon();
    const { setShowSplashScreen, isMobile } = useGlobal();

    const init = async () => {
        setTransitionLoading(true);
        try {
            if (page === 0) {
                if (!news || news.total === 0) {
                    try {
                        await initNews();
                    } catch (error) {
                        navigate("/");
                    }
                }
                else setNewsOnPage(news);
            } else {
                const response = await newsService.getAllByQueryOptions<TNews>({
                    pageNumber: page - 1,
                    pageSize: 10,
                    orderBy: {
                        created_at: 'desc',
                    },
                })
                setNewsOnPage(response.payload)
            }
        }
        catch (error) {
            console.error(error)
        } finally {
            UtilService.scrollToTop();
            setTransitionLoading(false);
            setShowSplashScreen(false);
        }

    }

    const moveTo = async (value: number) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', (value).toString());
        setSearchParams(newParams);
    }

    const handleRedirection = (id: number | undefined) => {
        navigate(`/noticias/${id}`);
    }

    usePagePreparationActions();


    useEffect(() => {
        try {
            init();
        } catch (error) {
            navigate("/")
        }
    }, [page]);
    useEffect(() => {
        news && setNewsOnPage(news)
    }, [news]);

    return (
        <>

            <main className="news-page page">
                <Helmet>
                    <title>Noticias | Motorizando</title>
                    <meta name="description" content="Mantente al día con las últimas novedades del sector automotor. Aquí encontrarás un resumen de los hechos más relevantes, análisis de mercado y tendencias que marcan el rumbo de la industria." />
                    <meta property="og:title" content="Motorizando | Noticias" />
                    <meta property="og:description" content="Mantente al día con las últimas novedades del sector automotor. Aquí encontrarás un resumen de los hechos más relevantes, análisis de mercado y tendencias que marcan el rumbo de la industria." />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://www.motorizando.com.ar/noticias" />
                    <meta property="og:image" content={news.results.length > 0 ? news.results[0]?.mainImage.fileUrl : 'https://www.motorizando.com.ar/logo-wallpaper.png'} />
                    <meta property="og:image:width" content="1200" />
                    <meta property="og:image:height" content="630" />
                    <meta property="og:site_name" content="Motorizando" />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="Motorizando | Noticias" />
                    <meta name="twitter:description" content="Mantente al día con las últimas novedades del sector automotor. Aquí encontrarás un resumen de los hechos más relevantes, análisis de mercado y tendencias que marcan el rumbo de la industria." />
                    <meta name="twitter:image" content={news.results.length > 0 ? news.results[0]?.mainImage.fileUrl : 'https://www.motorizando.com.ar/logo-wallpaper.png'} />
                    <link rel="canonical" href={`https://www.motorizando.com.ar/noticias`} />
                    <script type="application/ld+json">
                        {`
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Noticias automotrices | Motorizando",
  "description": "Listado de noticias y novedades del mundo automotor.",
  "url": "https://www.motorizando.com.ar/noticias",
  "mainEntity": [
    ${newsOnPage.results.slice(0, 10).map(n => `{
      "@type": "NewsArticle",
      "headline": "${UtilService.escapeJson(n.headline)}",
      "image": "${UtilService.resolveFile(n.mainImage.fileUrl)}",
      "datePublished": "${n.createdAt}",
      "url": "https://www.motorizando.com.ar/noticias/${n.id}",
      "publisher": {
        "@type": "Organization",
        "name": "Motorizando",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.motorizando.com.ar/logo-wallpaper.png"
        }
      }
    }`).join(",")}
  ]
}
`}
                    </script>
                    {page > 1 && <link rel="prev" href={`https://www.motorizando.com.ar/noticias?page=${page - 1}`} />}
                    {page < Math.ceil(newsOnPage.total / 10) && <link rel="next" href={`https://www.motorizando.com.ar/noticias?page=${page + 1}`} />}

                </Helmet>
                <Section classname="banner-news">
                    {newsOnPage.total > 0 && (
                        <>

                            <img
                                loading="lazy"
                                decoding="async"
                                src={UtilService.resolveFile(newsOnPage.results[0].mainImage.fileUrl)}
                                alt={newsOnPage.results[0].mainImage.mediaType}
                                className="image-news"
                            />
                            <div key={newsOnPage.results[0].id} style={{ textShadow: "0 0 3px black" }}>
                                <h2 className="headline">{newsOnPage.results[0].headline}</h2>
                                <Typography variant="body2" dangerouslySetInnerHTML={{ __html: UtilService.decodeBase64Unicode(newsOnPage.results[0].lead) }}></Typography>
                                <TagLinks tags={newsOnPage.results[0].tags} />
                                <Button action={() => handleRedirection(newsOnPage.results[0].id)}>
                                    Ver noticia
                                </Button>
                            </div>
                        </>
                    )}
                </Section>
                <Section classname="section-news">
                    {newsOnPage.results.slice(1).map((newsItem) => (
                        <Box component={"div"}
                            key={newsItem.id}
                            className="news-item pd">
                            <img loading="lazy"
                                decoding="async" src={UtilService.resolveFile(newsItem?.mainImage.fileUrl)} alt={newsItem?.mainImage.mediaType} />
                            <div className="news-item-content pd">
                                <h2 className="headline">{newsItem.headline}</h2>
                                <Typography variant="body1" dangerouslySetInnerHTML={{ __html: UtilService.decodeBase64Unicode(newsItem.lead) }}></Typography>
                                <TagLinks tags={newsItem.tags} />
                                <div>
                                    <Button action={() => handleRedirection(newsItem.id)}>
                                        Ver noticia
                                    </Button>
                                </div>
                            </div>
                        </Box>
                    ))}

                </Section>
                <Box>
                    <PagesSelector count={Math.ceil(newsOnPage.total / 10)} moveTo={moveTo} maxVisiblePages={isMobile ? 4 : 10} />
                </Box>
                <Footer />
            </main>
        </>
    );
};

export default NewsPage;