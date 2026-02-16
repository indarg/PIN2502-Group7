import { createContext } from 'react';


// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TGlobalContext = {
    showSplashScreen: boolean,
    setShowSplashScreen: (value: boolean) => void,
    isMobile:boolean,
    setLoading:(value:boolean) => void, 
    isLoading:boolean
}


export const GlobalContext = createContext<TGlobalContext>({} as TGlobalContext);