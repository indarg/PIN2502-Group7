import { FC, ReactNode, useEffect, useReducer } from "react";
import QueryOptions from "src/helpers/QueryOptions";
import TCRMNewsState from "src/models/states/TCRMNewsState";
import { TNews } from "src/models/TNews";
import { resolveErrorMessage, resolveSuccessMessage } from "src/models/TSnackbarMessage";
import CRMNewsService from "src/services/CRMNewsService";
import { useCRMCommon } from "../CRMCommonContext/useCRMCommon";
import { CRMNewsContext } from "./CRMNewsContext";
import { CRMNewsReducer } from "./CRMNewsReducer";

const INITIAL_STATE: TCRMNewsState = {
    news: [],
    crmNewsService: new CRMNewsService()
};
export const CRMNewsProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(CRMNewsReducer, INITIAL_STATE);
    const { setSnackbarMessage, setLoading } = useCRMCommon();
    const { crmNewsService } = state;
    const doSearch = async (queryOptions?: QueryOptions<TNews>) => {
        try {
            const response = await crmNewsService.getAllByQueryOptions<TNews>(queryOptions);
            setNews(response.payload.results)
            return response.payload.total;
        } catch (e) {
            return 0;
        }
    }

    const setNews = (news: TNews[]) => {
        dispatch({ type: 'setNews', payload: news });
    };

    const deleteNewsById = async (id: string): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await crmNewsService.delete<boolean>(id)
            setSnackbarMessage(resolveSuccessMessage(response.message));
            dispatch({ type: 'deleteNewsById', payload: Number(id) });
            setLoading(false);
            return response.payload;

        } catch (error) {
            setLoading(false);
            console.error(error);
            return false;
        }


    };

    const softDeleteNewsById = async (id: string): Promise<void> => {
        try {
            const response = await crmNewsService.softDelete(id)

            setSnackbarMessage(resolveSuccessMessage(response.message));
            dispatch({ type: 'softDeleteNewsById', payload: { ...response.payload, id: Number(id) } });
        } catch (error) {
            console.log(error);
        }

    };

    const restoreNewsById = async (id: string): Promise<void> => {
        try {
            const response = await crmNewsService.restore<boolean>(id)
            setSnackbarMessage(resolveSuccessMessage(response.message));
            dispatch({ type: 'restoreNewsById', payload: Number(id) });
        } catch (error) {
            console.error(error);
        }

    };

    const addNews = (news: TNews) => {
        dispatch({ type: 'addNews', payload: news });
    };

    const getNewsById = (id: number): TNews | undefined => {
        return state.news.find((n: TNews) => n.id === id)
    };


    useEffect(() => {
        doSearch();
    }, [])

    return (
        <CRMNewsContext.Provider value={{
            state,
            doSearch,
            addNews,
            getNewsById,
            deleteNewsById,
            softDeleteNewsById,
            restoreNewsById
        }}>
            {children}
        </CRMNewsContext.Provider>
    )
}



