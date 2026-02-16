import { TPaginatedPayload } from "src/models/response/TPaginatedPayload";
import TNewsState from "src/models/states/TNewsState";
import { TNews } from "src/models/TNews";

type usersAction =
    | { type: 'setNews', payload: TPaginatedPayload<TNews[]> }


export const NewsReducer = (state: TNewsState, action: usersAction): TNewsState => {

    switch (action.type) {
        case 'setNews':
            return {
                ...state,
                news: action.payload
            };
      default:
            return state;
    }
};