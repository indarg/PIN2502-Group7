import { createContext } from 'react';
import QueryOptions from 'src/helpers/QueryOptions';
import TCRMNewsState from 'src/models/states/TCRMNewsState';
import { TNews } from 'src/models/TNews';


export type CRMNewsContextType = {
  state: TCRMNewsState,
  doSearch: (queryOptions?: QueryOptions<TNews>) => Promise<number | undefined>,
  addNews: (news: TNews) => void,
  getNewsById: (id: number) => TNews | undefined,
  deleteNewsById: (id: string) => Promise<boolean>,
  softDeleteNewsById: (id: string) => Promise<void>
  restoreNewsById: (id: string) => Promise<void>,
}


export const CRMNewsContext = createContext<CRMNewsContextType>({} as CRMNewsContextType);