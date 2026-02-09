import { useContext } from 'react';
import { UsersContext } from './UsersContext';




export const useUsers = () => {

    const {
        setUsersToContext,
        usersState,
    } = useContext(UsersContext);
    const { users } = usersState;

    return {
        setUsersToContext,
        users,
    };
};


