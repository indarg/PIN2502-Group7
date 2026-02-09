import { ReactNode, useEffect, useState } from 'react';

import { CommonContext } from './CommonContext';





interface IProps {
    children: ReactNode
}



export const CommonProvider = ({ children }: IProps) => {
    const [transitionLoading, setTransitionLoading] = useState<boolean>(false);
    const [globalSearchValue, setGlobalSearchValue] = useState<string>('');
    const [isMobileNavCollapsed, setMobileNavCollapse] = useState<boolean>(true);

    return (
        <CommonContext.Provider value={{
            transitionLoading,
            setTransitionLoading,
            globalSearchValue,
            setGlobalSearchValue,
            isMobileNavCollapsed, 
            setMobileNavCollapse
        }}>
            {children}
        </CommonContext.Provider>
    );

};


