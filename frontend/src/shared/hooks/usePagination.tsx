
import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useCRMCommon } from 'src/context/CRMCommonContext/useCRMCommon';
import QueryOptions, { TOrderBy } from 'src/helpers/QueryOptions';

type TUsePaginationReturn<T> = {
  queryOptions: QueryOptions<T>,
  searchQuery: string | undefined,
  setPagination: (pagination: TPagination) => void,
  setSearchQuery: (value: string) => void,
  pagination: TPagination,
  paginate: (newPagination: TPagination) => void
  setTotalRecords: (value: number) => void
  totalRecords: number,
  setQueryOptions:Dispatch<SetStateAction<QueryOptions<T>>>
};
export type TPagination = {
  pageNumber: number,
  pageSize: number,
}


const usePagination = <T,>(searchFields: string[], orderBy?: TOrderBy, search?: (queryOptions?: QueryOptions<T>) => Promise<number | undefined>): TUsePaginationReturn<T> => {
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [pagination, setPagination] = useState<TPagination>({ pageNumber: 0, pageSize: 10 });
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const { setLoading } = useCRMCommon();
  const [queryOptions, setQueryOptions] = useState<QueryOptions<T>>({
    searchTerm: searchQuery,
    orderBy: orderBy ?? {
      id: 'asc',
    },
    searchFields,
    pageNumber: 0,
    pageSize: 10
  });

  useEffect(() => {
    // Set a timeout to trigger the search after 3 seconds
    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      if (search) {
        const total = await search(queryOptions)
        setTotalRecords(total || 0); // Execute the search function
        setLoading(false);
      }
    }, 600);
    return () => clearTimeout(delayDebounce);
  }, [queryOptions]);

  useEffect(() => {
    setQueryOptions({ ...queryOptions, searchTerm: searchQuery });
  }, [searchQuery]);

  const paginate = (newPagination: TPagination) => {
    if (pagination !== newPagination && search) {
      setPagination(newPagination);
      setQueryOptions({
        ...queryOptions,
        pageNumber: newPagination.pageNumber,
        pageSize: newPagination.pageSize
      });
    }
  };



  return {
    queryOptions,
    searchQuery,
    setPagination,
    setSearchQuery,
    pagination,
    paginate,
    setTotalRecords,
    totalRecords,
    setQueryOptions
  };
};

export default usePagination;
