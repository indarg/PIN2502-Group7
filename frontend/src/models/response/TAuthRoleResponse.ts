import TAuthGroup from "../TAuthGroup"
import TAuthPermission from "../TAuthPermission"

export type TAuthRoleResponse = {
    roles: TAuthGroup[],
    permissions: TAuthPermission[]
}