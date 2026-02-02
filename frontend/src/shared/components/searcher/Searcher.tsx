import './Searcher.css';

import QueryOptions from 'src/helpers/QueryOptions';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { Box, LinearProgress } from '@mui/material';
type Props<T> = {
    value?: string,
    onChange?: (value: string) => void,
    readonly?: boolean,
    placeholder?: string,
    queryOptions?: QueryOptions<T>,
    doSearch?: (queryOptions?: QueryOptions<T>) => void;
};

const Searcher = <T,>({
    value = "",
    onChange = (e) => e,
    placeholder = 'Buscar...',
    queryOptions,
    doSearch
}: Props<T>) => {

    return (
        <div className='searcher'>
            <SearchIcon width={25} height={25} sx={{ color: 'var(--m-c3)' }} onClick={() => {
                if (doSearch)
                    doSearch(queryOptions);
            }} />

            <input type='text' placeholder={placeholder} value={value} onChange={(value) => {
                return onChange(value.target.value);
            }} />

        </div>
    );
};

export default Searcher;