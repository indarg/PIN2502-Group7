import { useContext } from 'react';
import { NewsContext } from './NewsContext';




export const useNews = () => {

    const {
        newsState,
        initNews
    } = useContext(NewsContext);
    const { news } = newsState;

    return {
        news,
        initNews
    };
};


