import { JSX, useEffect, useReducer } from 'react';
import { TUser } from 'src/models/TUser';

import { UsersContext } from './UsersContext';
import { UsersReducer } from './UsersReducer';
import TUsersState from 'src/models/states/TUsersState';
import UserService from 'src/services/UserService';
import { useCRMCommon } from '../CRMCommonContext/useCRMCommon';




interface IProps {
    children: JSX.Element | JSX.Element[]
}
const INITIAL_STATE: TUsersState = {
    users: [],
};
const userService = new UserService();

export const UsersProvider = ({ children }: IProps) => {
    const [usersState, dispatch] = useReducer(UsersReducer, INITIAL_STATE);
    const { setSnackbarMessage } = useCRMCommon();


    const setUsersToContext = (users: TUser[]) => {
        dispatch({ type: 'setUsers', payload: users });
    };

    useEffect(() => {
        userService.getCsrfToken();
    }, [])

    return (
        <UsersContext.Provider value={{
            setUsersToContext,
            usersState,
        }}>
            {children}
        </UsersContext.Provider>
    );

};



