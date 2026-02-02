import { FC, useEffect, useState } from "react";
import { useCRMNews } from "src/context/CRMNewsContext/useCRMNews";
import { TNews } from "src/models/TNews";
import UtilService from "src/services/UtilService";
import Section from "src/shared/components/Section/Section";
import Divider from "src/shared/components/divider/Divider";
import Footer from "src/shared/components/footer/Footer";
import GalleryPreview from "src/shared/components/gallery-preview/GalleryPreview";
import Gallery from "src/shared/components/gallery/Gallery";
import RelatedNewsCard from "src/shared/components/related-news-card/RelatedNewsCard";
import '../../../public/DetailNewsPage/DetailNewsPage.css';
import { Stack, Typography } from "@mui/material";
import AuthorBubble from "src/shared/components/author_bubble/AuthorBubble";
import GradientDivider from "src/shared/components/GradientDivider";

type TProps = {
  detailNews?: TNews,
  adds?: boolean
};
const CRMDetailNewsPage: FC<TProps> = ({ detailNews, adds = false }) => {
  const [relatedNews, setRelatedNews] = useState<TNews[]>([]);
  const [openGalery, setOpenGalery] = useState<boolean>(false);
  const { news } = useCRMNews();
  const init = async () => {
    if (!detailNews) return;
    const selectedNewsTagIds = new Set(
      detailNews.tags.map((tag) => tag.id)
    );
    if (selectedNewsTagIds.size === 0) {
      setRelatedNews([]);
    }
    const filteredNews = news.filter((newsItem) => {
      if (newsItem.id === detailNews.id) {
        return false;
      }
      return newsItem.tags.some((tagOfNewsItem) =>
        selectedNewsTagIds.has(tagOfNewsItem.id)
      );
    });
    setRelatedNews(filteredNews);
  }
  useEffect(() => {
    init();
  }, [detailNews])


  return (
    <main className="page detail-news-page">
      <Section classname="main-image">
        <img src={UtilService.resolveFile(detailNews?.mainImage.fileUrl)} alt={detailNews?.headline} />
        <div>
          <h1 className="headline">{detailNews?.headline}</h1>
          <Typography variant="body2" dangerouslySetInnerHTML={{ __html: UtilService.decodeBase64Unicode(detailNews?.lead ?? '') }}></Typography >
        </div>
        <section className='banner-detail-audit'>
          {detailNews?.createdBy && <AuthorBubble author={detailNews?.createdBy} creationDate={detailNews?.createdAt ?? ''} updateDate={detailNews?.updatedAt} />}
        </section>
      </Section>
      <Divider classname="news-features">
        {detailNews && <div>
          <Typography variant="body2" dangerouslySetInnerHTML={{ __html: UtilService.decodeBase64Unicode(detailNews.body) }}></Typography >
        </div>}
      </Divider>
      {detailNews && detailNews.columns.length > 0 && (
        detailNews.columns.map((c, index) => (
          <Divider classname="news-divider" key={index}>
            <>
              <div className="news-content" style={{ textShadow: "0 0 3px black" }}>
                <Typography variant="h2">{c.title}</Typography>
                <Typography variant="body1" dangerouslySetInnerHTML={{ __html: UtilService.decodeBase64Unicode(c.body) }} />
              </div>
              <img src={UtilService.resolveFile(c.image.fileUrl)} alt="image" />
            </>
          </Divider>

        ))
      )}
      {detailNews && <Divider classname="closure pd">
        <Typography variant="body2" dangerouslySetInnerHTML={{ __html: UtilService.decodeBase64Unicode(detailNews.closure) }}></Typography >
      </Divider>}
      {detailNews?.images && detailNews?.images.length > 0 && <GalleryPreview images={detailNews.images} open={() => setOpenGalery(true)} />}
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

      <Footer />
    </main>
  )
}

export default CRMDetailNewsPage;