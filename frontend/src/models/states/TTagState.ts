
import CRMTagService from 'src/services/CRMTagsService';
import { TTag } from '../TTag';


export type TTagState = {
    tags: TTag[],
}




export type TCRMTagState = {
    tags: TTag[],
    allTags: TTag[],
    crmTagService:CRMTagService
}

