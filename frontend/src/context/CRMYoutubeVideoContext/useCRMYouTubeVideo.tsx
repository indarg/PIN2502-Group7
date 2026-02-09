import { useContext } from 'react';
import { CRMYouTubeVideoContext } from './CRMYouTubeVideoContext';




export const useCRMYouTubeVideo = () => {

    const {
        state,
        doSearch,
        addYouTubeVideo,
        getYouTubeVideoById,
        deleteYouTubeVideoById,
        updateYoutubeVideoOrder
    } = useContext(CRMYouTubeVideoContext);
    const { ytVideos,crmYTYoutubeService} = state;

    return {
        ytVideos,
        crmYTYoutubeService,
        doSearch,
        addYouTubeVideo,
        getYouTubeVideoById,
        deleteYouTubeVideoById,
        updateYoutubeVideoOrder
    };
};


