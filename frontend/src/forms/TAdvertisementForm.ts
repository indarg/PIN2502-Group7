import { TAudit } from "src/models/TAudit";
import { TAdvertisement } from "src/models/TAdvertisement";

export type TAdvertisementForm = Partial<Omit<TAdvertisement, keyof TAudit>> & {
    swap?:boolean
}; 