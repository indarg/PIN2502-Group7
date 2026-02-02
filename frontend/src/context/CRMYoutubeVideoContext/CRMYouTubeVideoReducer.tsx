import { TCRMYouTubeVideoState } from "src/models/states/TYouTubeVideoState";
import { TUpdateOrder } from "src/models/TUpdateOrder";
import { TYoutubeVideo } from "src/models/TYoutubeVideo";

type ytVideosAction =
    | { type: 'setYouTubeVideo', payload: TYoutubeVideo[] }
    | { type: 'setAllYouTubeVideos', payload: TYoutubeVideo[] }
    | { type: 'addYouTubeVideo', payload: TYoutubeVideo }
    | { type: 'deleteYouTubeVideoById', payload: string }
    | { type: 'updateYoutubeVideoOrder', payload: TUpdateOrder }



export const CRMYouTubeVideoReducer = (state: TCRMYouTubeVideoState
    , action: ytVideosAction): TCRMYouTubeVideoState => {

    switch (action.type) {
        case 'setYouTubeVideo':
            return {
                ...state,
                ytVideos: action.payload
            };
        case 'updateYoutubeVideoOrder':
            const ytVideos = state.ytVideos.map((y,i) => {
                const ytVideoOrder = action.payload.find((p) => p.id === y.id);
                if(ytVideoOrder)
                    y.order = ytVideoOrder.order;
                return y;
            })
            return {
                ...state,
                ytVideos
            };
        case 'addYouTubeVideo':
            return {
                ...state,
                ytVideos: [...state.ytVideos, action.payload]
            };
        case 'deleteYouTubeVideoById':
            return {
                ...state,
                ytVideos: state.ytVideos.filter((n) => n.id !== action.payload)
            };

        default:
            return state;
    }
};