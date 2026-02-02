import { useContext } from 'react';
import { CommonContext } from './CommonContext';





export const useCommon = () => {

    // eslint-disable-next-line no-empty-pattern
    const {
        transitionLoading,
        setTransitionLoading,
        globalSearchValue,
        setGlobalSearchValue,
        isMobileNavCollapsed,
        setMobileNavCollapse
    } = useContext(CommonContext);

    return {
        transitionLoading,
        setTransitionLoading,
        globalSearchValue,
        setGlobalSearchValue,
        isMobileNavCollapsed,
        setMobileNavCollapse
    };
};


