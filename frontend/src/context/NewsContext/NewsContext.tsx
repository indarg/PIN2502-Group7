import { createContext } from 'react';
import TNewsState from 'src/models/states/TNewsState';


export type NewsContextType = {
  newsState: TNewsState,
  initNews: () => Promise<void>
}


export const NewsContext = createContext<NewsContextType>({} as NewsContextType);