import { useContext } from 'react';
import { CRMNewsContext } from './CRMNewsContext';




export const useCRMNews = () => {

    const {
        state,
        doSearch,
        addNews,
        getNewsById,
        deleteNewsById,
        restoreNewsById,
        softDeleteNewsById
    } = useContext(CRMNewsContext);
    const { news,crmNewsService } = state;

    return {
        news,
        doSearch,
        addNews,
        getNewsById,
        deleteNewsById,
        restoreNewsById,
        softDeleteNewsById
    };
};


