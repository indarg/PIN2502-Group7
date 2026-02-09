import { useContext } from 'react';
import { TagContext } from './TagContext';




export const useTag = () => {

    const {
        tagsState
    } = useContext(TagContext);
    const { tags } = tagsState;

    return {
        tags
    };
};


