import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TYoutubeVideo } from 'src/models/TYoutubeVideo';
import CRMYouTubeVideoService from 'src/services/CRMYouTubeVideoService';
import CRMNavToolbar from 'src/shared/components/crm-nav-toolbar/CRMNavToolbar';
import './CRMYouTubeVideoEditPage.css';
import YoutubeVideoForm from 'src/shared/components/youtube_form/YoutubeVideoForm';

const CRMYouTubeVideoEditPage: FC<any> = () => {
    const { id } = useParams();
    const nav = useNavigate();
    const [youtubeVideo, setYouTubeVideo] = useState<TYoutubeVideo | undefined>();
    useEffect(() => {
        id && init(id);
    }, [id]);

    const init = async (id: string) => {
        const service = new CRMYouTubeVideoService();
        try {
            const response = await service.get(id);
            setYouTubeVideo(response.payload);
        }
        catch (error) {
            nav(-1);
        }

    }
    return (
        <div className='crm-view'>
            <CRMNavToolbar title='Editar Video YT' />
            {youtubeVideo && <YoutubeVideoForm createOrUpdate='update' ytVideo={youtubeVideo} />}
        </div>
    )
}

export default CRMYouTubeVideoEditPage;