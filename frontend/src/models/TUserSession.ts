import { TTokens } from "./TTokens";
import { TUser } from "./TUser";


type TUserSession = {
    user: TUser,
    accessToken:string,
    refreshToken: string
}

export default TUserSession;