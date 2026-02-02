import { TAudit } from "src/models/TAudit";
import { TTag } from "src/models/TTag";

export type TTagForm = Partial<Omit<TTag, keyof TAudit>>;