import { ReactNode, useEffect, useState } from 'react';

import { GlobalContext } from './GlobalContext';
import { useWindowWidth } from 'src/shared/hooks/useWindowWidth';





interface IProps {
    children: ReactNode
}



export const GlobalProvider = ({ children }: IProps) => {
    const [showSplashScreen, setShowSplashScreen] = useState<boolean>(true);
    const width = useWindowWidth();

    const [isMobile, setMobile] = useState<boolean>(false);
    const [isLoading,setLoading] = useState<boolean>(false);
    useEffect(() => {
        setMobile(width <= 768)
    }, [width]);

    return (
        <GlobalContext.Provider value={{
            showSplashScreen,
            setShowSplashScreen,
            isMobile,
            isLoading,
            setLoading
        }}>
            {children}
        </GlobalContext.Provider>
    );

};


