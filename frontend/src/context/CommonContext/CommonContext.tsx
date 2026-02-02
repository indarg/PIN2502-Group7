import { createContext, Dispatch, SetStateAction } from 'react';


// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type CommonContextType = {
    transitionLoading: boolean,
    setTransitionLoading: (value: boolean) => void,
    setGlobalSearchValue:Dispatch<SetStateAction<string>>,
    globalSearchValue:string,
    isMobileNavCollapsed:boolean, 
    setMobileNavCollapse:Dispatch<SetStateAction<boolean>>, 

}


export const CommonContext = createContext<CommonContextType>({} as CommonContextType);