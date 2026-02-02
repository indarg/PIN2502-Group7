import { FC, ReactNode, useEffect, useReducer } from "react";
import QueryOptions from "src/helpers/QueryOptions";
import { TCRMTagState } from "src/models/states/TTagState";
import { TTag } from "src/models/TTag";
import CRMTagService from "src/services/CRMTagsService";
import { useCRMCommon } from "../CRMCommonContext/useCRMCommon";
import { CRMTagContext } from "./CRMTagContext";
import { CRMTagReducer } from "./CRMTagReducer";
import { TResponse } from "src/models/response/TResponses";

const INITIAL_STATE: TCRMTagState = {
    tags: [],
    allTags: [],
    crmTagService: new CRMTagService()
};
export const CRMTagProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(CRMTagReducer, INITIAL_STATE);
    const { setLoading } = useCRMCommon();
    const { crmTagService } = state;

    const doSearch = async (queryOptions?: QueryOptions<TTag>) => {
        try {
            const response = await crmTagService.getAllByQueryOptions<TTag>(queryOptions);
            setTags(response.payload.results)
            return response.payload.total;
        } catch (e) {
            return 0;
        }
    }

    const deleteTagById = async (id: string): Promise<TResponse<boolean>> => {
        setLoading(true);
        const response = await crmTagService.delete<boolean>(id)
        response.payload
        dispatch({ type: 'deleteTagById', payload: Number(id) });
        setLoading(false);
        return response;

    };

    const addTag = (tag: TTag) => {
        dispatch({ type: 'addTag', payload: tag });
        init();
    };


    const setTags = (tag: TTag[]) => {
        dispatch({ type: 'setTag', payload: tag });
    };


    const setAllTags = (tags: TTag[]) => {
        dispatch({ type: 'setAllTags', payload: tags });
    };



    const getTagById = (id: number): TTag | undefined => {
        return state.tags.find((n: TTag) => n.id === id)
    };
    const init = async () => {
        try {
            const response = await crmTagService.getAllTags();
            setAllTags(response.payload)
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        doSearch();
        init();
    }, [])



    return (
        <CRMTagContext.Provider value={{ state, getTagById, doSearch, deleteTagById, addTag }}>
            {children}
        </CRMTagContext.Provider>
    )
}



