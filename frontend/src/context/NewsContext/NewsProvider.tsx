import { FC, ReactNode, useEffect, useReducer } from "react";
import { TNews } from "src/models/TNews";
import NewsService from "src/services/NewsService";
import { NewsContext } from "./NewsContext";
import TNewsState from "src/models/states/TNewsState";
import { NewsReducer } from "./NewsReducer";
import { TPaginatedPayload } from "src/models/response/TPaginatedPayload";

const INITIAL_STATE: TNewsState = {
    news: {
        results:[],
        total:0
    },

};
const newsService = new NewsService();
export const NewsProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [newsState, dispatch] = useReducer(NewsReducer, INITIAL_STATE);
    const initNews = async () => {
        const response = await newsService.getAllByQueryOptions<TNews>({
            pageNumber:0,
            pageSize:10,
            orderBy: {
                created_at: 'desc',
            },
        });
        setNews(response.payload)
    }

    const setNews = (news: TPaginatedPayload<TNews[]>) => {
        dispatch({ type: 'setNews', payload: news });
    };


    return (
        <NewsContext.Provider value={{
            initNews,
            newsState,
        }}>
            {children}
        </NewsContext.Provider>
    )
}



