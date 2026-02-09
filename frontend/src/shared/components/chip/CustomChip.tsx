import { Chip } from "@mui/material";
import { CSSProperties, FC, ReactElement } from "react";

interface CustomChipProps {
    text: string;
    style?: CSSProperties;
    className?: string;
    handleClick?: (value: string) => void;
    icon?: ReactElement;
    active?: boolean;
    activeColor?:string,
}

const CustomChip: FC<CustomChipProps> = ({
    text = "",
    className="",
    active = false,
    handleClick,
    style,
    icon,
    activeColor
}) => {
    const activeStyles: CSSProperties = {
        backgroundColor: !activeColor ? "var(--light-purple)": `var(${activeColor})` ,
        color:"var(--m-c)",
    };

    return (
        <Chip sx={{
            backgroundColor: 'var(--lightgray)',
            color:"rgba(0,0,0,0.3)",
            ...style
        }} 
        className={className}
        style={active ? activeStyles : undefined}
        label={text}
        onClick={() => {
            if (handleClick) 
                handleClick(text);
        }}
        icon={icon ?? undefined}
        />
    );
};

export default CustomChip;