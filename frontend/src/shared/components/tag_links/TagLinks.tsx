import { Typography } from "@mui/material";
import { FC } from "react";
import { useCommon } from "src/context/CommonContext/useCommon";
import { TTag } from "src/models/TTag";
import './TagLinks.css'
import { useGlobal } from "src/context/GlobalContext/useGlobal";
type TTagLinks = {
    tags: TTag[]
}
export const TagLinks: FC<TTagLinks> = ({ tags }) => {
    const {isMobile} = useGlobal();
    const { setGlobalSearchValue,
        setMobileNavCollapse} = useCommon();
    return (
        <Typography  className="tag-links">
            {tags.map((t, index) => (
                <>
                    <span className="tag-chip"  onClick={() => {setGlobalSearchValue(t.name); isMobile && setMobileNavCollapse(false);}} key={index}>{`${t.name}`}</span>
                    <span>{" / "}</span>
                </>
            ))}
        </Typography>
    )
}