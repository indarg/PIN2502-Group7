import { TResponse } from "./response/TResponses";

type TConfirmationModalAsync = {
    message?:string,
    action: () => Promise<TResponse<unknown>>,
    show: boolean,
    redirectTo?:string
}

export default TConfirmationModalAsync;
