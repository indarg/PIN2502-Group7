import { FC, ReactNode, useEffect, useReducer } from "react";
import QueryOptions from "src/helpers/QueryOptions";
import { useCRMCommon } from "../CRMCommonContext/useCRMCommon";
import { CRMYouTubeVideoReducer } from "./CRMYouTubeVideoReducer";
import CRMYouTubeVideoService from "src/services/CRMYouTubeVideoService";
import { TYoutubeVideo } from "src/models/TYoutubeVideo";
import { TCRMYouTubeVideoState } from "src/models/states/TYouTubeVideoState";
import { CRMYouTubeVideoContext } from "./CRMYouTubeVideoContext";
import { TUpdateOrder } from "src/models/TUpdateOrder";
import { resolveErrorMessage, resolveSuccessMessage } from "src/models/TSnackbarMessage";
import { TResponse } from "src/models/response/TResponses";

const INITIAL_STATE: TCRMYouTubeVideoState = {
    ytVideos: [],
    crmYTYoutubeService: new CRMYouTubeVideoService()
};
export const CRMYouTubeVideoProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(CRMYouTubeVideoReducer, INITIAL_STATE);
    const { setLoading, setSnackbarMessage } = useCRMCommon();
    const { crmYTYoutubeService } = state;
    const doSearch = async (queryOptions?: QueryOptions<TYoutubeVideo>) => {
        try {
            const response = await crmYTYoutubeService.getAllByQueryOptions<TYoutubeVideo>(queryOptions);
            setYouTubeVideos(response.payload.results)
            return response.payload.total;
        } catch (e) {
            return 0;
        }
    }

    const deleteYouTubeVideoById = async (id: string): Promise<TResponse<boolean>> => {
        setLoading(true);
        const response = await crmYTYoutubeService.delete<boolean>(id)
        if (response.payload)
            dispatch({ type: 'deleteYouTubeVideoById', payload: id });
        setLoading(false);
        return response;
    };

    const addYouTubeVideo = (ytVideos: TYoutubeVideo) => {
        dispatch({ type: 'addYouTubeVideo', payload: ytVideos });
    };


    const setYouTubeVideos = (ytVideos: TYoutubeVideo[]) => {
        dispatch({ type: 'setYouTubeVideo', payload: ytVideos });
    };

    const updateYoutubeVideoOrder = async (ytVideosOrder: TUpdateOrder) => {
        try {
            setLoading(true);
            const response = await crmYTYoutubeService.updateVideoOrder(ytVideosOrder);
            setSnackbarMessage(resolveSuccessMessage(response.message))
            dispatch({ type: 'updateYoutubeVideoOrder', payload: ytVideosOrder });
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);

        }
    };
    const getYouTubeVideoById = (id: string): TYoutubeVideo | undefined => {
        return state.ytVideos.find((n: TYoutubeVideo) => n.id === id)
    };

    useEffect(() => {
        doSearch();
    }, [])



    return (
        <CRMYouTubeVideoContext.Provider value={{ state, getYouTubeVideoById, doSearch, deleteYouTubeVideoById, addYouTubeVideo, updateYoutubeVideoOrder }}>
            {children}
        </CRMYouTubeVideoContext.Provider>
    )
}



