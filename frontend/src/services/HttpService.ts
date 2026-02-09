
import { httpServer } from "src/clients/mw-server";
import { TResponse } from "src/models/response/TResponses";
import QueryOptions, { orderByToString } from "src/helpers/QueryOptions";
import { TPaginatedPayload } from "src/models/response/TPaginatedPayload";
import { TSoftDeleteResponse } from "src/models/response/TSoftDeleteResponse";
import { TGlobalSearchResult } from "src/models/response/TGlobalSearchResult";
export default class HttpService<T> {
    baseUrl: string;

    constructor(endpoint: string) {
        this.baseUrl = "mw-server/" + endpoint;
    }
    camelToSnakeCase(camelCaseString: string) {
        if (camelCaseString.length === 0) {
            return ''; // Devuelve un string vacío si la entrada no es válida
        }
        return camelCaseString.replace(/[A-Z]/g, (letter, index) => {
            return (index === 0 ? '' : '_') + letter.toLowerCase();
        });
    }
    protected createQueryOptionsParam<T>(queryOptions: QueryOptions<T>): string {
        const params = new URLSearchParams();
        // Adds search term to query parameters
        if (queryOptions.searchTerm)
            params.append('search_term', queryOptions.searchTerm);

        // Adds sorting options to query parameters
        if (queryOptions.orderBy)
            params.append('order_by', orderByToString(queryOptions.orderBy));

        // Adds pagination options
        params.append('page_number', queryOptions.pageNumber.toString());
        if (queryOptions.pageSize)
            params.append('page_size', queryOptions.pageSize.toString());

        // Adds advanced filters to query parameters

        if (queryOptions.filters) {
            params.append('filters', JSON.stringify(queryOptions.filters));
        }

        // Adds search fields to query parameters
        if (queryOptions.searchFields) {
            params.append('search_fields', queryOptions.searchFields.join(',')); // Join fields with commas
        }

        // Returns the full query string
        return `?${params.toString()}`;
    }

    getPaginated<T>(value?: string, queryOptions?: QueryOptions<T>): Promise<TResponse<T[]>> {
        let endpoint = `/${this.baseUrl}/${value}`;
        if (queryOptions)
            endpoint += `${this.createQueryOptionsParam(queryOptions)}`;

        return httpServer.get(endpoint)
            .then(({ data }: any): TResponse<T[]> => data as TResponse<T[]>)
    }


    getAll<T>(): Promise<TResponse<T[]>> {
        const endpoint = `/${this.baseUrl}`;
        return httpServer.get(endpoint)
            .then(({ data }: any): TResponse<T[]> => data as TResponse<T[]>)
    }

    getAllByQueryOptions<T>(queryOptions?: QueryOptions<T>): Promise<TResponse<TPaginatedPayload<T[]>>> {
        const endpoint = `/${this.baseUrl}`;
        const queryOptString = queryOptions ? this.createQueryOptionsParam(queryOptions) : "";
        return httpServer.get(endpoint + queryOptString)
            .then(({ data }: any): TResponse<TPaginatedPayload<T[]>> => data as TResponse<TPaginatedPayload<T[]>>)
    }

    get(value: string): Promise<TResponse<T>> {
        return httpServer.get(`/${this.baseUrl}${value}`)
            .then(({ data }: any): TResponse<T> => data as TResponse<T>)
    }

    delete<T>(id: string, endpoint?: string): Promise<TResponse<T>> {
        const endpointAux = endpoint ? `/${this.baseUrl}/${endpoint}/delete/${id}` : `/${this.baseUrl}delete/${id}`;
        return httpServer.delete(endpointAux)
            .then(({ data }: any): TResponse<T> => data as TResponse<T>)
    }

    softDelete(id: string, endpoint?: string): Promise<TResponse<TSoftDeleteResponse>> {
        const endpointAux = endpoint ? `/${this.baseUrl}/${endpoint}/delete/soft/${id}` : `/${this.baseUrl}delete/soft/${id}`;
        return httpServer.put(endpointAux)
            .then(({ data }: any): TResponse<TSoftDeleteResponse> => data as TResponse<TSoftDeleteResponse>)
    }

    restore<T>(id: string, endpoint?: string): Promise<TResponse<T>> {
        const endpointAux = endpoint ? `/${this.baseUrl}/${endpoint}/restore/${id}` : `/${this.baseUrl}restore/${id}`;
        return httpServer.put(endpointAux)
            .then(({ data }: any): TResponse<T> => data as TResponse<T>)
    }

    update<T, R = T>(value: T, id: string, endpoint?: string): Promise<TResponse<R>> {
        const endpointAux = endpoint ? `/${this.baseUrl}${endpoint}/update/${id}` : `/${this.baseUrl}update/${id}`;
        return httpServer.put(
            endpointAux,
            value)
            .then(({ data }: any): TResponse<R> => data as TResponse<R>)
    }

    create<T, R = T>(value: T, endpoint?: string): Promise<TResponse<R>> {
        const endpointAux = endpoint ? `/${this.baseUrl}${endpoint}/create/` : `/${this.baseUrl}create/`;
        return httpServer.post(
            endpointAux,
            value)
            .then(({ data }: any): TResponse<R> => data as TResponse<R>)
    }

    globalSearch(searchValue: string):Promise<TResponse<TGlobalSearchResult>> {
        return httpServer.post(`/${this.baseUrl}global-search/`,{searchValue})
            .then(({ data }: any): TResponse<TGlobalSearchResult> => data as TResponse<TGlobalSearchResult>)

    }

}
