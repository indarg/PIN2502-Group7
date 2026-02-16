import { useContext } from 'react';
import { AuthContext } from './AuthContext';





export const useAuth = () => {

    const {
        signIn,
        state,
        setAuthenticatedUser,
        signOut,
        updateUserProfile,
    } = useContext(AuthContext);

    return {
        signIn,
        updateUserProfile,
        setAuthenticatedUser,
        signOut,
        ...state,
    };
};


