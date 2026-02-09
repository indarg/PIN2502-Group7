import { FC } from "react";
import './Section.css'
type TSection = {
    classname: string,
    children?: React.ReactNode
}

const Section: FC<TSection> = ({classname, children}) => {
    return (
        <section className={"section pd " + classname}>
            {children}
        </section>
    )
}

export default Section; 