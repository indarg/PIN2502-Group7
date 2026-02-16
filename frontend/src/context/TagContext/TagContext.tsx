import { createContext } from 'react';
import { TTagState } from 'src/models/states/TTagState';


export type TagContextType = {
  tagsState: TTagState,
}


export const TagContext = createContext<TagContextType>({} as TagContextType);