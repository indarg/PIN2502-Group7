import { createContext } from 'react';
import { TSignInCredentials } from 'src/models/states/TSignInCredentials';
import TUsersState from 'src/models/states/TUsersState';
import { TUser } from 'src/models/TUser';
import TUserSession from 'src/models/TUserSession';
import UserService from 'src/services/UserService';


export type CRMUsersContextType = {
  setUsersToContext: (user: TUser[]) => void,
  state: TUsersState ,
  userService:UserService
}


export const CRMUsersContext = createContext<CRMUsersContextType>({} as CRMUsersContextType);