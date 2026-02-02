import { TResponse } from "./response/TResponses";

type TLoader<T> = {
    [x:string]: Promise<TResponse<T>>
}

export default TLoader;