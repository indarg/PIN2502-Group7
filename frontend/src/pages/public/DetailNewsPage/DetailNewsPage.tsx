import { Box, Stack, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { useCommon } from "src/context/CommonContext/useCommon";
import { TNews } from "src/models/TNews";
import NewsService from "src/services/NewsService";
import UtilService from "src/services/UtilService";
import GradientDivider from "src/shared/components/GradientDivider";
import Section from "src/shared/components/Section/Section";
import AuthorBubble from "src/shared/components/author_bubble/AuthorBubble";
import DisqusComments from "src/shared/components/disqus_comments/DisqusComments";
import Divider from "src/shared/components/divider/Divider";
import Footer from "src/shared/components/footer/Footer";
import GalleryPreview from "src/shared/components/gallery-preview/GalleryPreview";
import Gallery from "src/shared/components/gallery/Gallery";
import RelatedNewsCard from "src/shared/components/related-news-card/RelatedNewsCard";
import "../DetailNewsPage/DetailNewsPage.css";
import { useGlobal } from "src/context/GlobalContext/useGlobal";
import { BannerAdvertisement } from "src/shared/components/banner_advertisement/BannerAdvertisement";
import { usePagePreparationActions } from "src/shared/hooks/usePagePreparationActions";


const DetailNewsPage: FC<any> = () => {
  const { id } = useParams();
  const { setTransitionLoading } = useCommon();
  const [detailNews, setDetailNewsPage] = useState<TNews | null>(null);
  const [relatedNews, setRelatedNews] = useState<TNews[]>([]);
  const [openGalery, setOpenGalery] = useState<boolean>(false);
  const { setShowSplashScreen, isMobile } = useGlobal();
  const navigate = useNavigate();
  const newsService = new NewsService();
  usePagePreparationActions();

  const init = async () => {
    if (!id) {
      navigate("/noticias");
      return;
    }
    setTransitionLoading(true);
    try {
      const response = await newsService.get(id);
      setDetailNewsPage(response.payload);
      const { payload } = response;
      const tags = payload.tags.map(t => t.code);
      if (tags.length > 0) {
        const relatedNewsResponse = await newsService.getAllByQueryOptions<TNews>({
          pageSize: 20,
          pageNumber: 0,
          filters: {
            tags__code__in: tags
          }
        });
        setRelatedNews(relatedNewsResponse.payload.results.filter(t => t.id !== Number(id)));
      }
    } catch (error) {
      console.log(error);
    } finally {


      UtilService.scrollToTop();
      setTransitionLoading(false);
      setShowSplashScreen(false);
    }

  }
  useEffect(() => {
    try {
      init();
    } catch (error) {
      navigate("/")
    }
  }, [id]);

  return (
    <main className="page detail-news-page">
      <Helmet>
        <title>{detailNews?.headline ?? 'Noticia'} | Motorizando</title>
        <meta name="keywords" content={`${detailNews?.headline || 'noticia'}, auto noticia, motorizando, análisis automotriz`} />
        <meta name="description" content="Descubre el futuro del automovilismo. Te presentamos los prototipos, concepts y filtraciones que nos dan una idea de lo que está por venir en diseño, tecnología y motorización." />
        <meta property="og:title" content={`${detailNews?.headline ?? 'Noticia'} | Motorizando`} />
        <meta property="og:description" content="Descubre el futuro del automovilismo. Te presentamos los prototipos, concepts y filtraciones que nos dan una idea de lo que está por venir en diseño, tecnología y motorización." />
        <meta property="og:type" content="article" />
        <meta property="article:section" content="Noticias" />
        <meta property="og:url" content={`https://www.motorizando.com.ar/noticias/${detailNews?.id}`} />
        <meta property="og:image" content={detailNews?.mainImage.fileUrl ?? 'https://www.motorizando.com.ar/logo-wallpaper.png'} />
        <meta property="og:image:alt" content={`${detailNews?.headline ?? 'Nueva noticia'} - Imagen principal`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Motorizando" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${detailNews?.headline ?? 'Noticia'} | Motorizando`} />
        <meta name="twitter:description" content={detailNews?.lead} />
        <meta name="twitter:image" content={detailNews?.mainImage.fileUrl ?? 'https://www.motorizando.com.ar/logo-wallpaper.png'} />
        {detailNews?.createdAt && (
          <meta property="article:published_time" content={detailNews?.createdAt} />
        )}
        {detailNews?.updatedAt && (
          <meta property="article:modified_time" content={detailNews.updatedAt} />
        )}
        <link rel="canonical" href={`https://www.motorizando.com.ar/noticias/${detailNews?.id}`} />
        {detailNews && (
          <script type="application/ld+json">
            {`
  {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": "${UtilService.escapeJson(detailNews.headline)}",
    "image": ["${UtilService.resolveFile(detailNews.mainImage.fileUrl)}"],
    "datePublished": "${detailNews.createdAt}",
    "dateModified": "${detailNews.updatedAt ?? detailNews.createdAt}",
    "author": {
      "@type": "Person",
      "name": "${UtilService.escapeJson(detailNews.createdBy?.firstName ?? "Motorizando")}"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Motorizando",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.motorizando.com.ar/logo-wallpaper.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.motorizando.com.ar/noticias/${detailNews.id}"
    },
    "articleSection": "Noticias",
    "articleBody": "${UtilService.escapeJson(UtilService.stripHtml(detailNews.body))}"
  }
  `}
          </script>
        )}

      </Helmet>
      <Section classname="main-image">
        <article itemScope itemType="https://schema.org/NewsArticle">
          <img
            itemProp="image"
            src={UtilService.resolveFile(detailNews?.mainImage.fileUrl)}
            alt={detailNews?.headline}
            loading="eager"
            decoding="async"
          />
          <div itemProp="articleBody">
            <h1 itemProp="headline" className="headline">{detailNews?.headline}</h1>

            <Typography
              variant="body2"
              dangerouslySetInnerHTML={{
                __html: UtilService.decodeBase64Unicode(detailNews?.lead ?? ""),
              }}
            />
          </div>
        </article>


      </Section>
      <Divider classname="news-features">
        {detailNews && <div>
          <Typography variant="body2" dangerouslySetInnerHTML={{ __html: UtilService.decodeBase64Unicode(detailNews.body) }}></Typography >
        </div>}
      </Divider>
      {detailNews && detailNews.columns.length > 0 && (
        detailNews.columns.map((c, index) => (
          <Divider classname="news-divider" key={index}>
            {isMobile ? (
              <>
                <img src={UtilService.resolveFile(c.image.fileUrl)} alt="image" />
                <div className="news-content" style={{ textShadow: "0 0 3px black" }}>
                  <Typography variant="h2">{c.title}</Typography>

                  <Typography variant="body1" dangerouslySetInnerHTML={{ __html: UtilService.decodeBase64Unicode(c.body) }} />
                </div>
              </>
            ) : (
              <>
                <div className="news-content" style={{ textShadow: "0 0 3px black" }}>
                  <Typography variant="h2">{c.title}</Typography>
                  <Typography variant="body1" dangerouslySetInnerHTML={{ __html: UtilService.decodeBase64Unicode(c.body) }} />
                </div>
                <img src={UtilService.resolveFile(c.image.fileUrl)} alt="image" />
              </>
            )}
          </Divider>
        ))
      )}
      {detailNews && <Divider classname="closure pd">
        <Typography variant="body2" dangerouslySetInnerHTML={{ __html: UtilService.decodeBase64Unicode(detailNews.closure) }}></Typography >
      </Divider>}
      {detailNews?.images && detailNews?.images.length > 0 && <GalleryPreview isMobile={isMobile} images={detailNews.images} open={() => setOpenGalery(true)} />}
      {detailNews?.images && detailNews?.images.length > 0 && <Gallery open={openGalery} close={() => setOpenGalery(false)} images={detailNews.images} />}

      {relatedNews && relatedNews.length > 0 && <>
        <GradientDivider />
        <Typography variant='h2' sx={{ width: "100%" }} className='pd'>Noticias Relacionadas</Typography>
        <Stack display={"flex"} flexDirection={"row"} gap={2} flexWrap={"wrap"}>
          {relatedNews.length > 0 && relatedNews.map((_, index) => (
            <RelatedNewsCard key={index} news={_} />
          ))}
        </Stack>
      </>
      }
      <Stack direction={"row"} spacing={2} padding={!isMobile ? 10 : "5px"} flexWrap={"wrap"}>
        <Box width={"70%"} minWidth={"320px"} flexGrow={1}>
          {detailNews && detailNews.id && <DisqusComments articleId={detailNews.id.toString()} url="noticias/" articleTitle={detailNews.headline} />}
        </Box>
      </Stack>
      <Footer />
    </main>
  )
}

export default DetailNewsPage;