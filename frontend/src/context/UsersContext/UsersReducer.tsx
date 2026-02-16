import { TAuthRoleResponse } from "src/models/response/TAuthRoleResponse";
import TUsersState from "src/models/states/TUsersState";
import { TUser } from "src/models/TUser";
import TUserSession from "src/models/TUserSession";

type usersAction =
    | { type: 'setUsers', payload: TUser[] }

export const UsersReducer = (state: TUsersState, action: usersAction): TUsersState => {

    switch (action.type) {
        case 'setUsers':
            return {
                ...state,
                users: action.payload
            };




        default:
            return state;
    }
};