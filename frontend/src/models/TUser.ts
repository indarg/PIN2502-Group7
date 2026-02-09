import { TMediaFile } from './TMediaFile';

export type TUser = {
    id: number,
    firstName: string
    lastName: string
    email: string,
    profileImage: TMediaFile
}