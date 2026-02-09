import { FC, useState } from 'react'
import './CRMTagsTablePage.css'
import { Skeleton } from '@mui/material';
import { CustomTable } from 'src/shared/components/custom_table/CustomTable';
import { TTag } from 'src/models/TTag';
import usePagination from 'src/shared/hooks/usePagination';
import { useCRMTag } from 'src/context/CRMTagContext/useCRMTag';
import useTagTable from './useTagTable';
import { useCRMCommon } from 'src/context/CRMCommonContext/useCRMCommon';

const CRMTagsTablePage: FC<any> = () => {
    const { isLoading, setLoading,setConfirmationModal } = useCRMCommon();
    const { tags, doSearch,deleteTagById} = useCRMTag();
    const [tagColumns] = useTagTable(
        (id: string) => setConfirmationModal({ action: () => deleteTagById(id), show: true, message: "¿Seguro que quiere eliminar esta etiqueta?" }))
    const { pagination, queryOptions, searchQuery, setSearchQuery, paginate, totalRecords } = usePagination<TTag>(["name"], {
        name: 'asc',
    }, doSearch);
    const reload = async () => {
        setLoading(true)
        await doSearch(queryOptions)
        setLoading(false)
    }
    return (
        <div className='crm-view'>
            <div>
                {isLoading && !tags ?
                    <Skeleton style={{ height: '50vh' }} /> :
                    <CustomTable<TTag>
                        queryOptions={queryOptions}
                        value={searchQuery}
                        onChange={(value) => {
                            setSearchQuery(value);
                        }}
                        loading={isLoading} title="Etiquetas" reload={reload} doSearch={doSearch} showSearcher={true} columns={tagColumns} rows={tags} {...pagination} totalRecords={totalRecords} showActions={true} paginate={paginate} />
                }
            </div>
        </div>
    )
}

export default CRMTagsTablePage