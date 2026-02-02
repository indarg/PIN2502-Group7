import { FC } from "react"
import { TNews } from "src/models/TNews";
import './RelatedNewsCard.css'
import UtilService from "src/services/UtilService";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
type TPropsNewsCard = {
        news: TNews;
}

const RelatedNewsCard: FC<TPropsNewsCard> = ({ news }) => {
        const nav = useNavigate();
        return (
                <div className="related-news" onClick={() => nav(`/noticias/${news.id}`)}>
                        <img src={UtilService.resolveFile(news.mainImage.fileUrl)} alt={news.mainImage.mediaType} />
                        <div>
                                <Typography variant="h6">{news.headline}</Typography>
                                <Typography variant="body2" dangerouslySetInnerHTML={{ __html: UtilService.decodeBase64Unicode(news.lead) }}></Typography>
                        </div>
                </div>
        )
}

export default RelatedNewsCard;