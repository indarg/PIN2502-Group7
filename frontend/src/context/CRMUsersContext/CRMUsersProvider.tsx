import { JSX, useReducer } from 'react';
import { TUser } from 'src/models/TUser';
import TUsersState from 'src/models/states/TUsersState';
import UserService from 'src/services/UserService';
import { useCRMCommon } from '../CRMCommonContext/useCRMCommon';
import { CRMUsersContext } from './CRMUsersContext';
import { CRMUsersReducer } from './CRMUsersReducer';




interface IProps {
    children: JSX.Element | JSX.Element[]
}
const INITIAL_STATE: TUsersState = {
    users: [],
};

export const CRMUsersProvider = ({ children }: IProps) => {
    const [state, dispatch] = useReducer(CRMUsersReducer, INITIAL_STATE);
    const userService = new UserService();
    const setUsersToContext = (users: TUser[]) => {
        dispatch({ type: 'setUsers', payload: users });
    };

    return (
        <CRMUsersContext.Provider value={{
            setUsersToContext,
            userService,
            state,
        }}>
            {children}
        </CRMUsersContext.Provider>
    );

};



