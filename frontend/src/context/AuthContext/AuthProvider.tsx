// AuthContext.tsx
import React, { createContext, useEffect, useMemo, useReducer, useState } from "react";
import HttpService from "src/services/HttpService";
import { AuthContext } from "./AuthContext";
import TAuthState from "src/models/states/TAuthState";
import { useLocation, useParams } from "react-router-dom";
import UserService from "src/services/UserService";
import { AuthReducer } from "./AuthReducer";
import { TSignInCredentials } from "src/models/states/TSignInCredentials";
import TUserSession from "src/models/TUserSession";
import { ErrorResponse } from "src/models/response/TResponses";
import { useGlobal } from "../GlobalContext/useGlobal";
import { useSnackbar } from "../snackbar-context/snackbar.provider";
import { TUser } from "src/models/TUser";



const authenticatedUserStorage = localStorage.getItem('authenticatedUser');


const INITIAL_STATE: TAuthState = {
    hash: null,
    isAuthenticated: null,
    accessToken: '',
    refreshToken: '',
    permissions: [],
    roles: [],
    authenticatedUser: (authenticatedUserStorage !== null) ? JSON.parse(authenticatedUserStorage) : undefined,
    isValidHash: null
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    const { setLoading } = useGlobal();
    const { setSnackbarMessage } = useSnackbar();
    const { pathname } = useLocation();

    const userService = new UserService();
    const hash = useMemo(() => {
        const parts = pathname.split('/').filter(Boolean);
        return parts[0] === 'crm' ? parts[1] ?? null : null;
    }, [pathname]);
    const refreshSession = async (): Promise<boolean> => {
        try {
            const refreshResponse = await userService.refreshSession(hash ?? '');
            dispatch({ type: 'refreshSession', payload: refreshResponse.payload });
            dispatch({ type: 'setIsAuthenticated', payload: true });
            return true;
        } catch (error) {
            dispatch({ type: 'setIsAuthenticated', payload: false });

            return false;

        }

    }
    const updateUserProfile = (data: TUser) => {
        dispatch({ type: 'updateAuthenticatedUser', payload: data });
    };
    
    const signIn = async (hash: string, credentials: TSignInCredentials): Promise<boolean> => {
        try {
            const response = await userService.signInCRM(hash, credentials);
            const { payload: { user, accessToken, refreshToken } } = response;
            setAuthenticatedUser({ user, accessToken, refreshToken });
            setSnackbarMessage({
                message: response.message,
                severity: "success",
                show: true,
                title: ''
            })

        } catch (e) {
            if (e instanceof ErrorResponse) {
                setSnackbarMessage({
                    message: e.message,
                    severity: "error",
                    show: true,
                    title: ''
                })
            } else
                setSnackbarMessage({
                    message: "Ha ocurrido un problema, por favor inténtelo en otro momento o contacte a soporte.",
                    severity: "error",
                    show: true,
                    title: ''
                })
            signOut();
            return false;
        }
        return true;
    };

    const signOut = () => {
        dispatch({ type: 'signOut' });
    }
    const setAuthenticatedUser = (userSession: TUserSession) => {
        dispatch({ type: 'setAuthenticatedUser', payload: userSession });
    };

    const init = async () => {
        if (!hash) return;
        try {
            userService.getCsrfToken();
            setLoading(true);
            const http = new HttpService<{ message: string, valid: boolean }>("v1/hash/");
            const response = await http.get(hash);
            dispatch({ type: 'setValidHash', payload: response.payload.valid });
            dispatch({ type: 'setHash', payload: hash });
            await userService.verifySession(hash);
            dispatch({ type: 'setIsAuthenticated', payload: true });
            // navigate(pathname && pathname.includes("/login") ? `/crm/${hash}/dashboard/home` : pathname);
        } catch (error: any) {
            if (error.status === 401 && hash) {
                const refreshResponse = await refreshSession();
                if (refreshResponse) return;
                // refreshResponse ? navigate(pathname && pathname.includes("/login") ? `/crm/${hash}/dashboard/home` : pathname) : navigate(`/crm/${hash}/login`);
            }
            else if (error.status === 403) {
                dispatch({ type: 'setValidHash', payload: false });
                dispatch({ type: 'setIsAuthenticated', payload: false });
            }
            signOut();
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        init();
    }, [hash]);
    return (
        <AuthContext.Provider value={{ signIn, state, setAuthenticatedUser, signOut,updateUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
};


