import { FC, useEffect, useState } from "react";
import { useCommon } from "src/context/CommonContext/useCommon";
import Logo from "src/shared/components/Logo";
import './TransitionPage.css';
const TransitionPage: FC<any> = ({time}) => {
    const { transitionLoading } = useCommon();
    const [hide, setHide] = useState<boolean>(false);
    useEffect(() => { 
        setHide(false);
        transitionLoading && setTimeout(() => setHide(true),time ?? 1000);
    }, [transitionLoading]);
    return (
        !hide ? <main className={`transition-page ${transitionLoading ? '' : 'hide'}`}>
            <div className="logo-wrapper">
                <div className="rotating-circle"></div>
                <Logo logo={false} />
            </div>
        </main> : <></>
    )
}

export default TransitionPage;