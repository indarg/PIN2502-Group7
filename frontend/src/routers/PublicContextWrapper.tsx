import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CommonProvider } from "src/context/CommonContext/CommonProvider";
import { useGlobal } from "src/context/GlobalContext/useGlobal";
import { NewsProvider } from "src/context/NewsContext/NewsProvider";
import { TagProvider } from "src/context/TagContext/TagProvider";
import NavBar from "src/shared/components/navbar/NavBar";
import NavBarMobile from "src/shared/components/navbar_mobile/NavBarMobile";
import SplashScreen from "src/shared/components/splash_screen/SplashScreen";

const PublicContextWrapper = ({ children }: { children: React.ReactNode}) => {
    const { showSplashScreen,isMobile } = useGlobal();

    return (
        <CommonProvider>
            <NewsProvider>
                        <TagProvider>
                            <>
                            <SplashScreen isLoading={showSplashScreen}/>
                            {isMobile ? <NavBarMobile /> : <NavBar />}
                            {children}
                            </>
                        </TagProvider>
            </NewsProvider>
        </CommonProvider>
    );
};

export default PublicContextWrapper;