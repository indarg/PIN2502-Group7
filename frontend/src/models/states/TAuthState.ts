
import TAuthGroup from '../TAuthGroup';
import TAuthPermission from '../TAuthPermission';
import { TUser } from '../TUser';



type TAuthState = {
    accessToken: string | null;
    refreshToken: string | null;
    hash: string | null;
    isValidHash: boolean | null;
    isAuthenticated: boolean | null;
    authenticatedUser?: TUser,
    roles: TAuthGroup[]
    permissions: TAuthPermission[]
}

export default TAuthState;

