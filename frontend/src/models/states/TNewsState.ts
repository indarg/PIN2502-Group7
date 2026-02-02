
import { TPaginatedPayload } from '../response/TPaginatedPayload';
import { TNews } from '../TNews';



type TNewsState = {
    news: TPaginatedPayload<TNews[]>
}





export default TNewsState;

