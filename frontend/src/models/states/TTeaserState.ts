
import { TPaginatedPayload } from '../response/TPaginatedPayload';
import { TTeaser } from '../TTeaser';


type TTeaserState = {
    teasers: TPaginatedPayload<TTeaser[]>,
}

export default TTeaserState;

