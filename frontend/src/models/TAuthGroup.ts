import TAuthPermission from "./TAuthPermission";

type TAuthGroup = {
    id?:number,
    name:string,
    authPermissions:TAuthPermission[],
    
}


export default TAuthGroup;