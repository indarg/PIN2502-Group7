import { Box, Button, Modal, Skeleton, Stack, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useCRMCommon } from 'src/context/CRMCommonContext/useCRMCommon';
import { useCRMYouTubeVideo } from 'src/context/CRMYoutubeVideoContext/useCRMYouTubeVideo';
import { TYoutubeVideo } from 'src/models/TYoutubeVideo';
import usePagination from 'src/shared/hooks/usePagination';
import './CRMYouTubeVideoTablePage.css';
import useYoutubeVideoTable from './useYoutubeVideoTable';
import { CustomTable } from 'src/shared/components/custom_table/CustomTable';
import { GridColDef } from '@mui/x-data-grid';
import { DragableLightTable } from 'src/shared/components/dragable_table/DragableLightTable';
import YouTubeVideoService from 'src/services/YouTubeVideoService';
import { resolveErrorMessage } from 'src/models/TSnackbarMessage';

const CRMYouTubeVideoTablePage: FC<any> = () => {
    const { isLoading, setLoading, setConfirmationModal, setSnackbarMessage } = useCRMCommon();
    const [activeVideos, setActiveVideos] = useState<TYoutubeVideo[]>([]);
    const { ytVideos, doSearch, deleteYouTubeVideoById, updateYoutubeVideoOrder } = useCRMYouTubeVideo();
    const [ytColumns] = useYoutubeVideoTable(
        (id: string) => setConfirmationModal({ action: () => deleteYouTubeVideoById(id), show: true, message: "¿Seguro que quiere eliminar este video?" }))
    const { pagination, queryOptions, searchQuery, setSearchQuery, paginate, totalRecords } = usePagination<TYoutubeVideo>(["title"], {
        title: 'asc',
    }, doSearch);
    const reload = async () => {
        setLoading(true)
        await doSearch(queryOptions)
        setLoading(false)
    }

    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false)
    };

    const columnsForDraggleTable: GridColDef<TYoutubeVideo>[] = [{
        field: 'order',
        headerName: 'Orden',
        minWidth: 180,
        valueGetter: (value, row) => row.order
    }]
    const init = async () => {
        const service = new YouTubeVideoService();
        try {
            const response = await service.getAll<TYoutubeVideo>();
            setActiveVideos(response.payload);
        } catch (error) {
            setSnackbarMessage(resolveErrorMessage())
        }
    }

    useEffect(() => {
        init();
    }, [ytVideos])

    return (
        <div className='crm-view'>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <Box component="section" sx={{
                    width: "80%",
                    minWidth:"330px",
                    height:"80vh",
                    hyphenateLimitCharseight: "80vh",
                    background: "white",
                    boxSizing: "border-box",
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius:"2px",
                    overflowY:"scroll"
                }}>
                    <DragableLightTable<TYoutubeVideo> updateOrderAction={(updateOrder) => updateYoutubeVideoOrder(updateOrder)} orderField='order' columns={[...columnsForDraggleTable, ...Object.assign([], ytColumns).splice(0, 2)]} data={activeVideos} title='Videos YT' loading={isLoading} />

                </Box>
            </Modal>
            <div>
                {isLoading && !ytVideos ?
                    <Skeleton style={{ height: '50vh' }} /> :
                    <CustomTable<TYoutubeVideo>
                        queryOptions={queryOptions}
                        value={searchQuery}
                        onChange={(value) => {
                            setSearchQuery(value);
                        }}
                        customActions={<Button variant='outlined' onClick={() => setOpen(true)}>Configurar orden</Button>}
                        loading={isLoading} title="Videos YouTube" reload={reload} doSearch={doSearch} showSearcher={true} columns={ytColumns} rows={ytVideos} {...pagination} totalRecords={totalRecords} showActions={true} paginate={paginate} />
                }

            </div>
        </div>
    )
}

export default CRMYouTubeVideoTablePage