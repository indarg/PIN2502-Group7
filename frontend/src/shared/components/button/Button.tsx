import { FC } from 'react'
import './Button.css'
type Props = {
    action: () => void,
    className?: string,
    children: any,
    disabled?:boolean
}

const Button: FC<Props> = ({ action, className = 'type-1', children,disabled=false }) => {
    return (
        <>

            <div className={`btn ${className}`} >
                <button onClick={() => action()} disabled={disabled} >
                    <span>{children}</span>
                </button>
            </div>


        </>
    )
}

export default Button;