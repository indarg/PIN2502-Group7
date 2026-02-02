import { TSoftDeleteResponse } from "src/models/response/TSoftDeleteResponse";
import TCRMNewsState from "src/models/states/TCRMNewsState";
import { TNews } from "src/models/TNews";

type usersAction =
    | { type: 'setNews', payload: TNews[] }
    | { type: 'addNews', payload: TNews }
    | { type: 'deleteNewsById', payload: number }
    | { type: 'restoreNewsById', payload: number }
    | { type: 'softDeleteNewsById', payload: TSoftDeleteResponse & { id: number } }


export const CRMNewsReducer = (state: TCRMNewsState, action: usersAction): TCRMNewsState => {

    switch (action.type) {
        case 'setNews':
            return {
                ...state,
                news: action.payload
            };
        case 'addNews':
            return {
                ...state,
                news: [...state.news, action.payload]
            };
        case 'deleteNewsById':
            return {
                ...state,
                news: state.news.filter((n) => n.id !== action.payload)
            };
        case 'restoreNewsById':
            return {
                ...state,
                news: state.news.filter((n) => n.id !== action.payload)
            };
        case 'softDeleteNewsById':
            return {
                ...state,
                news: state.news.filter((n) => n.id !== action.payload.id)
            };

        default:
            return state;
    }
};