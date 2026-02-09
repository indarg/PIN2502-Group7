import { Skeleton } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { useCRMCommon } from 'src/context/CRMCommonContext/useCRMCommon'
import { useCRMNews } from 'src/context/CRMNewsContext/useCRMNews'
import { TNews } from 'src/models/TNews'
import { CustomTable } from 'src/shared/components/custom_table/CustomTable'
import usePagination from 'src/shared/hooks/usePagination'
import './CRMNewsTablePage.css'
import useNewsTable from './useNewsTable'

const CRMNewsTablePage: FC<any> = () => {
    const { news, doSearch, deleteNewsById, restoreNewsById, softDeleteNewsById } = useCRMNews();
    const { setConfirmationModal, isLoading, setLoading } = useCRMCommon();
    const [newsColumns] = useNewsTable(
        (id: string) => setConfirmationModal({ action: () => softDeleteNewsById(id), show: true, message: "¿Seguro que quiere enviar esta noticia a la papelera?" }),
        (id: string) => setConfirmationModal({ action: () => deleteNewsById(id), show: true, message: "¿Seguro que quiere eliminar de manera permanente esta noticia?" }),
        (id: string) => setConfirmationModal({ action: () => restoreNewsById(id), show: true, message: "¿Seguro que quiere restaurar esta noticia?" })
    );
    const { pagination, queryOptions, searchQuery, setSearchQuery, paginate, totalRecords,setQueryOptions } = usePagination<TNews>(["headline", "lead"], {
        created_at: 'desc',
    }, doSearch);

    const reload = async () => {
        setLoading(true)
        await doSearch(queryOptions)
        setLoading(false)
    }
    const recycleTrash = () => {
        if(!queryOptions?.filters?.isDeleted)
            setQueryOptions({...queryOptions,filters:{...queryOptions.filters,isDeleted:true}})
        else
            setQueryOptions({...queryOptions,filters:{...queryOptions.filters,isDeleted:false}})
    }

    return (
        <div className='crm-view'>
            {isLoading && !news ?
                <Skeleton style={{ height: '50vh' }} /> :
                <CustomTable<TNews>
                    recycleTrash={recycleTrash}
                    queryOptions={queryOptions}
                    value={searchQuery}
                    onChange={(value) => {
                        setSearchQuery(value);
                    }}
                    loading={isLoading} title="Noticias" reload={() => reload()} doSearch={doSearch} showSearcher={true} columns={newsColumns} rows={news} {...pagination} totalRecords={totalRecords} showActions={true} paginate={paginate} />
            }
        </div>
    )
}

export default CRMNewsTablePage