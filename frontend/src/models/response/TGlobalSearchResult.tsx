import { TNews } from "../TNews";
import { TRelease } from "../TRelease";
import { TTeaser } from "../TTeaser";

export type TGlobalSearchResult = {
    news:TNews[],
    teasers:TTeaser[],
    releases:TRelease[]
};
