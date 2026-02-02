/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { useGlobal } from "src/context/GlobalContext/useGlobal";
import { useNews } from "src/context/NewsContext/useNews";
import { TYoutubeVideo } from "src/models/TYoutubeVideo";
import YouTubeVideoService from "src/services/YouTubeVideoService";

const useInitWeb = () => {
    const { news, initNews } = useNews();
    const {setShowSplashScreen} = useGlobal();
    const [ytVideos, setYtVideos] = useState<TYoutubeVideo[]>([]);

    useEffect(() => {

    }, []);

    const init = async () => {
        const videoService = new YouTubeVideoService();
        try {
            await initNews();
            const response = await videoService.getAll<TYoutubeVideo>();
            setYtVideos(response.payload)
        } catch (error) {
            console.error("Hubo un problema al intentar traer la información");
        }finally{
            setShowSplashScreen(false);
        }
    }

    return {
        init,
        news,
        ytVideos
    }
}

export default useInitWeb;