import { FC } from "react"
import './Divider.css'

type TDivider = {
    classname:string
    children:React.ReactNode
}


const Divider: FC<TDivider> = ({classname, children}) => {
    return (
        <div className={"divider " + classname}>
            {children}
        </div>
    )
}

export default Divider;