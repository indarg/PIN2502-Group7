import { TCRMTagState } from "src/models/states/TTagState";
import { TTag } from "src/models/TTag";

type tagsAction =
    | { type: 'setTag', payload: TTag[] }
    | { type: 'setAllTags', payload: TTag[] }
    | { type: 'addTag', payload: TTag }
    | { type: 'deleteTagById', payload: number }


export const CRMTagReducer = (state: TCRMTagState
    , action: tagsAction): TCRMTagState => {

    switch (action.type) {
        case 'setTag':
            return {
                ...state,
                tags: action.payload
            };

        case 'addTag':
            return {
                ...state,
                tags: [...state.tags, action.payload]
            };
        case 'deleteTagById':
            return {
                ...state,
                tags: state.tags.filter((n) => n.id !== action.payload)
            };
        case 'setAllTags':
            return {
                ...state,
                allTags: action.payload
            }
        default:
            return state;
    }
};