import { createContext } from 'react';
import QueryOptions from 'src/helpers/QueryOptions';
import { TResponse } from 'src/models/response/TResponses';
import { TCRMTagState } from 'src/models/states/TTagState';
import { TTag } from 'src/models/TTag';


export type CRMTagContextType = {
  state: TCRMTagState,
  doSearch: (queryOptions?: QueryOptions<TTag>) => Promise<number | undefined>,
  addTag: (news: TTag) => void,
  getTagById: (id: number) => TTag | undefined,
  deleteTagById: (id: string) => Promise<TResponse<boolean>>,
}


export const CRMTagContext = createContext<CRMTagContextType>({} as CRMTagContextType);