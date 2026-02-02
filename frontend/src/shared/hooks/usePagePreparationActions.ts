import { useEffect } from "react"
import { useCommon } from "src/context/CommonContext/useCommon";
import { useGlobal } from "src/context/GlobalContext/useGlobal";
import UtilService from "src/services/UtilService";

export const usePagePreparationActions = () => {
    const {isMobile} = useGlobal();
    const { setGlobalSearchValue, setMobileNavCollapse } = useCommon();

    useEffect(() => {
        setMobileNavCollapse(true);
        setGlobalSearchValue('');
        UtilService.scrollToTop();
    }, [isMobile])

};