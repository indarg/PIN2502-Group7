import { createContext } from 'react';
import QueryOptions from 'src/helpers/QueryOptions';
import { TResponse } from 'src/models/response/TResponses';
import { TCRMYouTubeVideoState } from 'src/models/states/TYouTubeVideoState';
import { TUpdateOrder } from 'src/models/TUpdateOrder';
import { TYoutubeVideo } from 'src/models/TYoutubeVideo';


export type CRMYouTubeVideoContextType = {
  state: TCRMYouTubeVideoState,
  doSearch: (queryOptions?: QueryOptions<TYoutubeVideo>) => Promise<number | undefined>,
  addYouTubeVideo: (news: TYoutubeVideo) => void,
  getYouTubeVideoById: (id: string) => TYoutubeVideo | undefined,
  deleteYouTubeVideoById: (id: string) => Promise<TResponse<boolean>>,
  updateYoutubeVideoOrder: (ytVideosOrder: TUpdateOrder) => void,
}


export const CRMYouTubeVideoContext = createContext<CRMYouTubeVideoContextType>({} as CRMYouTubeVideoContextType);