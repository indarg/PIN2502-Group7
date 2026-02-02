import { createContext } from 'react';
import { TSignInCredentials } from 'src/models/states/TSignInCredentials';
import TUsersState from 'src/models/states/TUsersState';
import { TUser } from 'src/models/TUser';
import TUserSession from 'src/models/TUserSession';


export type UsersContextType = {
  setUsersToContext: (user: TUser[]) => void,
  usersState: TUsersState,
}


export const UsersContext = createContext<UsersContextType>({} as UsersContextType);