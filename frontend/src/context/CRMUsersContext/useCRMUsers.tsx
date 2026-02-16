import { useContext } from 'react';
import { CRMUsersContext } from './CRMUsersContext';




export const useCRMUsers = () => {

    const {
        setUsersToContext,
        state,
    } = useContext(CRMUsersContext);
    const { users} = state;

    return {
        setUsersToContext,
        users,
    };
};


