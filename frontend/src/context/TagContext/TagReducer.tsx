import { TTagState } from "src/models/states/TTagState";
import { TTag } from "src/models/TTag";

type tagsAction =
    | { type: 'setTag', payload: TTag[] }


export const TagReducer = (state: TTagState, action: tagsAction): TTagState => {

    switch (action.type) {
        case 'setTag':
            return {
                ...state,
                tags: action.payload
            };

        default:
            return state;
    }
};