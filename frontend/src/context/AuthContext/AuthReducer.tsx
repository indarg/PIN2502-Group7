import { TAuthRoleResponse } from "src/models/response/TAuthRoleResponse";
import TAuthState from "src/models/states/TAuthState";
import { TUser } from "src/models/TUser";
import TUserSession from "src/models/TUserSession";

type usersAction =
    | { type: 'setAuthenticatedUser', payload: TUserSession }
    | { type: 'updateAuthenticatedUser', payload: TUser }
    | { type: 'setRolesAndPermissions', payload: TAuthRoleResponse }
    | { type: 'signOut' }
    | { type: 'refreshSession', payload: Omit<TUserSession, 'refreshToken'> }
    | { type: 'setIsAuthenticated', payload: boolean }
    | { type: 'setValidHash', payload: boolean }
    | { type: 'setHash', payload: string }
    




export const AuthReducer = (state: TAuthState, action: usersAction): TAuthState => {

    switch (action.type) {
        case 'setRolesAndPermissions':
            return {
                ...state,
                roles: action.payload.roles,
                permissions: action.payload.permissions
            };

        case 'refreshSession':
            localStorage.setItem("access_token", action.payload.accessToken);
            return {
                ...state,
                authenticatedUser: action.payload.user,
                accessToken: action.payload.accessToken

            };
        case 'setAuthenticatedUser':
            if (action.payload) {
                localStorage.setItem("authenticatedUser", JSON.stringify(action.payload.user));
                localStorage.setItem("access_token", action.payload.accessToken);
                localStorage.setItem("refresh_token", action.payload.refreshToken);
                return {
                    ...state,
                    authenticatedUser: action.payload.user,
                    isAuthenticated:true
                };
            }
            return {
                ...state
            };

        case 'updateAuthenticatedUser': {
            const updatedUser = action.payload;
            localStorage.setItem("authenticatedUser", JSON.stringify(updatedUser));
            return {
                ...state,
                authenticatedUser: updatedUser,
            };
        }

        case 'signOut':
            localStorage.clear();
            return {
                ...state,
                authenticatedUser: undefined,
                isAuthenticated: false,
                accessToken: null,
                refreshToken: null,
            };
        case 'setHash':
            return {
                ...state,
                hash: action.payload
            };

        case 'setIsAuthenticated':
            return {
                ...state,
                isAuthenticated: action.payload
            };
        case 'setValidHash':
            return {
                ...state,
                isValidHash: action.payload
            };
        default:
            return state;
    }
};