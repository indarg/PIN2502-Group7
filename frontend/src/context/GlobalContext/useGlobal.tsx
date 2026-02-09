import { useContext } from 'react';
import { GlobalContext } from './GlobalContext';





export const useGlobal = () => {

    // eslint-disable-next-line no-empty-pattern
    const {
        setShowSplashScreen,
        showSplashScreen,
        isMobile,
        setLoading,
        isLoading
    } = useContext(GlobalContext);

    return {
        setShowSplashScreen,
        showSplashScreen,
        isMobile,
        isLoading,
        setLoading
    };
};


