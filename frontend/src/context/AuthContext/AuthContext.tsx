import { createContext } from 'react';
import TAuthState from 'src/models/states/TAuthState';
import { TSignInCredentials } from 'src/models/states/TSignInCredentials';
import { TUser } from 'src/models/TUser';
import TUserSession from 'src/models/TUserSession';


// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type AuthContextType = {
    signIn:(hash: string, credentials: TSignInCredentials) => Promise<boolean>,
    setAuthenticatedUser:(userSession: TUserSession) => void,
    signOut:() => void,
    state:TAuthState,
    updateUserProfile:(user:TUser) => void
}


export const AuthContext = createContext<AuthContextType>({} as AuthContextType);