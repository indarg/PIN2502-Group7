import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, ImageList, ImageListItem, Modal, Skeleton, Stack, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TNews } from 'src/models/TNews';
import CRMNewsService from 'src/services/CRMNewsService';
import CRMNavToolbar from 'src/shared/components/crm-nav-toolbar/CRMNavToolbar';
import NewsForm from 'src/shared/components/news_form/NewsForm';
import './CRMNewsEditPage.css';
import { useCRMCommon } from 'src/context/CRMCommonContext/useCRMCommon';
import UtilService from 'src/services/UtilService';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import CRMDetailNewsPage from '../CRMDetailNewsPage/CRMDetailNewsPage';

const CRMNewsEditPage: FC<any> = () => {
    const nav = useNavigate();
    const { id } = useParams();
    const { isLoading, setLoading } = useCRMCommon();
    const [news, setNews] = useState<TNews | undefined>(undefined);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const newsService = new CRMNewsService()
    useEffect(() => {
        id && init(id);
    }, [id])
    useEffect(() => { }, [news])
    const init = async (id: string) => {
        setLoading(true);
        try {
            const response = await newsService.get(id);
            setNews(response.payload);
        }
        catch (error) {
            nav(-1);
        }

        setLoading(false);
    }
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "90vw",
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 4,
        p: 4,
    };
    return (
        <div className='crm-view crm-news-edit-page'>
            {isLoading ? <Skeleton variant="rounded" height={"40px"} width={"99%"} /> : <CRMNavToolbar title={`Noticia ${news?.headline}`} />}
            <Stack direction={"row"} >
                {!isLoading ? <>
                    {editMode ? <Button variant='contained' color='primary' onClick={() => setEditMode(false)}>Cerrar edición</Button> :
                        <>
                            <Button variant='contained' color='primary' onClick={() => setEditMode(true)}>Editar</Button>
                            <Button sx={{ marginLeft: "20px" }} onClick={handleOpen}>Visualizar</Button>
                            <div style={{ marginLeft: "auto" }}>
                                {news?.published ? <Chip label="Publicada" color='success' /> : <Chip label="No publicada" color='error' />}
                            </div>

                        </>}
                </>
                    : <Skeleton variant="rounded" height={"40px"} width={"150px"} />
                }
            </Stack>
            <div>
                {news && <>{!editMode ?
                    <div className='news-info'>
                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<GridExpandMoreIcon />}
                                aria-controls="panel1-content"
                            >
                                <Typography color='info' fontWeight={900}>Información principal</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Stack direction={"row"} className="news-main-info">
                                    <Stack direction={"column"} spacing={2} minWidth={"330px"} width={"50%"}>
                                        <Box>
                                            <Typography variant='caption' >Título</Typography>
                                            <Typography color="info" variant="body1" >{news.headline}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant='caption' >Encabezado</Typography>
                                            <p dangerouslySetInnerHTML={{ __html: UtilService.decodeBase64Unicode(news.lead) }}></p>
                                        </Box>
                                        <Box>
                                            <Typography variant='caption' >Cuerpo</Typography>
                                            <p dangerouslySetInnerHTML={{ __html: UtilService.decodeBase64Unicode(news.body) }}></p>
                                        </Box>
                                    </Stack>
                                    <Box width={"40%"}>
                                        <Typography variant='caption' >Portada</Typography>
                                        {news?.mainImage && <img src={UtilService.resolveFile(news?.mainImage.fileUrl)} />}
                                    </Box>
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<GridExpandMoreIcon />}
                                aria-controls="panel1-content"
                            >
                                <Typography color='info' fontWeight={900}>Columnas</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box className="news-columns">
                                    {news.columns.map((c, index) => (
                                        <Accordion key={index}>
                                            <AccordionSummary
                                                expandIcon={<GridExpandMoreIcon />}
                                                aria-controls="panel1-content"
                                            >
                                                <Typography color="info" variant="body1">Columna {index + 1}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails className='news-column'>
                                                <Stack spacing={2}>
                                                    <Box>
                                                        <Typography variant='caption' >Título</Typography>
                                                        <Typography color="info" variant="body1" >{c.title}</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant='caption' >Cuerpo</Typography>
                                                        <p dangerouslySetInnerHTML={{ __html: UtilService.decodeBase64Unicode(c.body) }}></p>
                                                    </Box>
                                                </Stack>
                                                <Box >
                                                    <Typography variant='caption' >Imagen</Typography>
                                                    <img src={UtilService.resolveFile(c.image.fileUrl)} />
                                                </Box>
                                            </AccordionDetails>

                                        </Accordion>
                                    ))}

                                </Box>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion >
                            <AccordionSummary
                                expandIcon={<GridExpandMoreIcon />}
                                aria-controls="panel1-content"
                            >
                                <Typography color='info' fontWeight={900}>Galeria</Typography>

                            </AccordionSummary>
                            <AccordionDetails>
                                <Box className="news-main-galery">
                                    {news && <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                                        {news.images.map((item) => (
                                            <ImageListItem key={item.id}>
                                                <img
                                                    srcSet={`${UtilService.resolveFile(item.fileUrl)}`}
                                                    src={`${UtilService.resolveFile(item.fileUrl)}`}
                                                    alt={item.title}
                                                    loading="lazy"
                                                />
                                            </ImageListItem>
                                        ))}
                                    </ImageList>
                                    }
                                </Box>

                            </AccordionDetails>
                        </Accordion>
                        <Accordion >
                            <AccordionSummary
                                expandIcon={<GridExpandMoreIcon />}
                                aria-controls="panel1-content"
                            >
                                <Typography color='info' fontWeight={900}>Etiquetas</Typography>

                            </AccordionSummary>
                            <AccordionDetails>
                                <Box className="news-tags">
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                                        {news.tags.map((tag) => (
                                            <Chip
                                                sx={{ textTransform: "capitalize" }}
                                                key={tag.id}
                                                label={tag.name}
                                            />
                                        ))}
                                    </Box>
                                </Box>

                            </AccordionDetails>
                        </Accordion>

                    </div>
                    : <NewsForm setUpdatedNews={setNews} mode='update' initialData={news} />}</>}
            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography color='info' variant='h5'>Previsualización</Typography>
                    <Box className='crm-detail-wrapper' >

                        {news && <CRMDetailNewsPage adds={false} detailNews={news} />
                        }

                    </Box>
                </Box>
            </Modal>

        </div >
    )
}

export default CRMNewsEditPage;