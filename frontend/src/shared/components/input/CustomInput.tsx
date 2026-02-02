/* eslint-disable @typescript-eslint/no-unused-vars */
import { CSSProperties, FC, forwardRef, ReactNode } from 'react';
import './CustomInput.css';
type Props = {
    children: ReactNode,
    label?:string,
    description?: string,
    className?:string,
    style?: CSSProperties,
    mandatory?: boolean,
    error?: string,
    capitalize?: boolean,
}


const CustomInput: FC<Props> = forwardRef(({ 
    children,
    label="",
    description,
    className="",
    style,
    error,
    mandatory = false,
    capitalize = true,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
}, ref) => {
    const labelStyles: CSSProperties = {};
    if (capitalize) labelStyles.textTransform = "capitalize";
    return (
        <div className={`custom-input ${className}`} style={style}>
            <label style={labelStyles}>
                {label}
                {mandatory &&
                    <span style={{color: 'red'}}> *</span>
                } 
            </label>
            {description && <span 
            style={{
                opacity: 0.5, 
                fontSize: '0.9rem'
            }}
            >
                {description || '\u00A0'} {/*\u00A0 non-collapsable blank space*/}
            </span>}
            {children}
            {error &&
                <p className='error'>
                    {error}
                </p>
            }
        </div>
    );
});

CustomInput.displayName = "CustomInput";

export default CustomInput;