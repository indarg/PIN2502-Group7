
import { TPaginatedPayload } from '../response/TPaginatedPayload';
import { TRelease } from '../TRelease';



type TReleaseState = {
    releases: TPaginatedPayload<TRelease[]>,


}

export default TReleaseState;

