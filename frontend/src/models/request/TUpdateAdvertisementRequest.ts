import { TAdvertisement } from "../TAdvertisement"

export type TUpdateAdvertisementRequest = TAdvertisement & {
    swap:boolean
}
