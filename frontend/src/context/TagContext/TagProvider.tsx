import { FC, ReactNode, useEffect, useReducer } from "react";
import { TTag } from "src/models/TTag";
import { TagContext } from "./TagContext";
import { TagReducer } from "./TagReducer";
import TagService from "src/services/TagService";
import { TTagState } from "src/models/states/TTagState";

const INITIAL_STATE: TTagState = {
    tags: [],
};
export const TagProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [tagsState, dispatch] = useReducer(TagReducer, INITIAL_STATE);
    const init = async () => {
        const tagService = new TagService();
        const response = await tagService.getAll<TTag>();
        setTag(response.payload)
    }


    const setTag = (tag: TTag[]) => {
        dispatch({ type: 'setTag', payload: tag });
    };
    
    useEffect(() => {
        init();
    }, [])


    return (
        <TagContext.Provider value={{ tagsState }}>
            {children}
        </TagContext.Provider>
    )
}



