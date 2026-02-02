import { httpServer } from "src/clients/mw-server";
import { TAuthRoleResponse } from "src/models/response/TAuthRoleResponse";
import { TSignInCredentials } from "src/models/states/TSignInCredentials";
import { TUser } from "src/models/TUser";
import TUserSession from "src/models/TUserSession";
import HttpService from "./HttpService";
import { TResponse } from "src/models/response/TResponses";





export default class UserService extends HttpService<TUser> {
    constructor() {
        super("v1/user-management");
    }

    signUp(userRegistrationForm: any): Promise<TResponse<string>> {
        return httpServer.post(this.baseUrl + '/sign-up', userRegistrationForm)
            .then(({ data }: any): TResponse<string> => data as TResponse<string>)

    }

    verifySession(hash: string): Promise<TResponse<boolean>> {
        return httpServer.get(`${this.baseUrl}/crm/${hash}/users/verify`)
            .then(({ data }: any): TResponse<boolean> => data as TResponse<boolean>)
    }

    verifyToken(hash: string, token: string,userId:number): Promise<TResponse<boolean>> {
        return httpServer.post(`${this.baseUrl}/crm/${hash}/users/token`, { token,user_id:userId })
            .then(({ data }: any): TResponse<boolean> => data as TResponse<boolean>)
    }


    refreshSession(hash: string): Promise<TResponse<Omit<TUserSession, 'refreshToken'>>> {
        const refreshTokenStorage = localStorage.getItem('refresh_token')
        return httpServer.post(`${this.baseUrl}/crm/${hash}/users/refresh-session`, {
            refreshToken: refreshTokenStorage
        })
            .then(({ data }: any): TResponse<Omit<TUserSession, 'refreshToken'>> => data as TResponse<Omit<TUserSession, 'refreshToken'>>)
    }

    async signInCRM(hash: string, credentials: TSignInCredentials): Promise<TResponse<TUserSession>> {
        return httpServer.post(`${this.baseUrl}/crm/${hash}/users/sign-in`, credentials)
            .then(({ data }: any): TResponse<TUserSession> => data as TResponse<TUserSession>)
    }

    getRoles(): Promise<TResponse<TAuthRoleResponse>> {
        return httpServer.get(`${this.baseUrl}/roles/`)
            .then(({ data }: any): TResponse<TAuthRoleResponse> => data as TResponse<TAuthRoleResponse>)
    }

    getCsrfToken(): void {
        httpServer.get("mw-server/v1/csrf");
    }

    updateProfile(userProfile: TUser, hash: string): Promise<TResponse<TUser>> {
        return httpServer.put(`${this.baseUrl}/crm/${hash}/users/update-profile/${userProfile.id}`, userProfile)
            .then(({ data }: any): TResponse<TUser> => data as TResponse<TUser>)
    }



}
