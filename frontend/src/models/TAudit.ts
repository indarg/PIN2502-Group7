import { TUser } from "./TUser";

export type TAudit = {
    createdBy: TUser;
    createdAt: string;
    updatedBy: TUser;
    updatedAt: string;
}