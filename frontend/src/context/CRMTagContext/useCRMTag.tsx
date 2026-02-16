import { useContext } from 'react';
import { CRMTagContext } from './CRMTagContext';




export const useCRMTag = () => {

    const {
        state,
        doSearch,
        addTag,
        getTagById,
        deleteTagById
    } = useContext(CRMTagContext);
    const { tags,allTags,crmTagService} = state;

    return {
        tags,
        crmTagService,
        allTags,
        doSearch,
        addTag,
        getTagById,
        deleteTagById
    };
};


