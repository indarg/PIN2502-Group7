// Defines the type for sorting options
export type TOrderBy = {
    [key: string]: 'asc' | 'desc'; // Allows dynamic keys, including nested keys like 'user__name'
};

// Converts the sorting options to a string format
export function orderByToString(orderBy: TOrderBy): string {
    return JSON.stringify(orderBy);
}

// New type for advanced filtering
export type TFilters = {
    [key: string]: string | number | boolean | string[];
};

// Defines the query options interface
interface QueryOptions<T> {
    pageNumber: number; // Current page number
    pageSize: number; // Number of items per page
    searchTerm?: string; // Search keyword
    orderBy?: TOrderBy; // Sorting options
    filters?: TFilters; // Advanced filters
    searchFields?: string[]
}

export default QueryOptions;


