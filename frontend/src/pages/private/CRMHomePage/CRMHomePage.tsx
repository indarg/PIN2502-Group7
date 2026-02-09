import { Box, Button, Skeleton } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'

import { useCRMCommon } from 'src/context/CRMCommonContext/useCRMCommon'
import { TAdvertisement } from 'src/models/TAdvertisement'
import { TNews } from 'src/models/TNews'
import { resolveErrorMessage } from 'src/models/TSnackbarMessage'
import { TTag } from 'src/models/TTag'
import { TYoutubeVideo } from 'src/models/TYoutubeVideo'
import CRMTagService from 'src/services/CRMTagsService'
import CRMYouTubeVideoService from 'src/services/CRMYouTubeVideoService'
import CRMNavToolbar from 'src/shared/components/crm-nav-toolbar/CRMNavToolbar'
import './CRMHomePage.css'
import CRMNewsService from 'src/services/CRMNewsService'
import { useAuth } from 'src/context/AuthContext/useAuth'

const CRMHomePage: FC<any> = () => {
    const [news, setNews] = useState<TNews[]>([]);
    const [tags, setTags] = useState<TTag[]>([]);
    const [ytVideos, setYoutubeVideos] = useState<TYoutubeVideo[]>([]);
    const [advertisements, setAdvertisements] = useState<TAdvertisement[]>([])
    const { signOut } = useAuth();
    const { hash } = useParams();
    const { setSnackbarMessage, setLoading, isLoading } = useCRMCommon();
    const nav = useNavigate();
    const crmNewsService = new CRMNewsService();
    const crmTagService = new CRMTagService();
    const crmYTYoutubeService = new CRMYouTubeVideoService();
    const init = async () => {
        setLoading(true);
        try {
            const newsResponse = await crmNewsService.getAllByQueryOptions<TNews>({
                pageNumber: 0,
                pageSize: 1000,
            });
            const tagsResponse = await crmTagService.getAllByQueryOptions<TTag>({
                pageNumber: 0,
                pageSize: 1000,
            });
            const ytVideosResponse = await crmYTYoutubeService.getAllByQueryOptions<TYoutubeVideo>({
                pageNumber: 0,
                pageSize: 1000,
            });
            setNews(newsResponse.payload.results);
            setTags(tagsResponse.payload.results);
            setYoutubeVideos(ytVideosResponse.payload.results);

        } catch (e:any) {
                if (e.status === 401) {
                    await signOut();
                    nav("/inicio")
                    setSnackbarMessage(resolveErrorMessage("Hubo un problema al intentar traer la información, por favor intente de nuevo o contacte a soporte"))
                }
        }finally{
                setLoading(false);
        }
    }
    useEffect(() => {
        init();
    }, [])
    return (
        <section className='home-page crm-page'>
            {
                isLoading ?
                    <Skeleton variant="rounded" height={60} width={"100%"} /> : <CRMNavToolbar title='Inicio' />
            }
            <div>
                {
                    isLoading ?
                        <>
                            <Skeleton variant="rounded" className='box-metric-skeleton' />
                            <Skeleton variant="rounded" className='box-metric-skeleton' />
                            <Skeleton variant="rounded" className='box-metric-skeleton' />
                            <Skeleton variant="rounded" className='box-metric-skeleton' />
                        </>
                        :
                        <>
                            <Box className="box-metric">
                                <Button variant='contained' sx={{ boxShadow: 'none' }} onClick={() => nav(`/crm/${hash}/dashboard/news/create`)}>
                                    Crear Noticia
                                </Button>
                                <NavLink to={`/crm/${hash}/dashboard/news`}>
                                    <h4 className='box-title'>Noticias</h4>
                                    <div>
                                        <section>
                                            <p>{news?.filter((n) => n.published).length === 0 ? 0 : news.filter((n) => n.published).length}</p>
                                            <span>Publicadas</span>
                                        </section>
                                        <section>
                                            <p>{news?.filter((n) => !n.published).length === 0 ? 0 : news.filter((n) => !n.published).length}</p>
                                            <span>No publicadas</span>
                                        </section>
                                    </div>
                                    <p>Ir hacia sección noticias</p>
                                </NavLink>
                            </Box>


                            <Box className="box-metric">
                                <Button variant='contained' sx={{ boxShadow: 'none' }} onClick={() => nav(`/crm/${hash}/dashboard/tags/create`)}>
                                    Crear Etiqueta
                                </Button>
                                <NavLink to={`/crm/${hash}/dashboard/tags`}>
                                    <h4 className='box-title'>Etiquetas</h4>
                                    <div>
                                        <section>
                                            <p>{tags.length === 0 ? 0 : tags.length}</p>
                                        </section>
                                    </div>
                                    <p>Ir hacia sección etiquetas</p>
                                </NavLink>

                            </Box>
                            <Box className="box-metric">
                                <Button variant='contained' sx={{ boxShadow: 'none' }} onClick={() => nav(`/crm/${hash}/dashboard/yt-videos/create`)}>
                                    Crear video YT
                                </Button>
                                <NavLink to={`/crm/${hash}/dashboard/yt-videos`}>
                                    <h4 className='box-title'>Videos YT</h4>
                                    <div>
                                        <section>
                                            <p>{ytVideos?.filter((n) => n.active).length === 0 ? 0 : ytVideos.filter((n) => n.active).length}</p>
                                            <span>Activos</span>
                                        </section>
                                        <section>
                                            <p>{ytVideos?.filter((n) => !n.active).length === 0 ? 0 : ytVideos.filter((n) => !n.active).length}</p>
                                            <span>No activos</span>
                                        </section>

                                    </div>
                                    <p>Ir hacia sección videos YT</p>
                                </NavLink>

                            </Box>
                            <Box className="box-metric">
                                <Button variant='contained' sx={{ boxShadow: 'none' }} onClick={() => nav(`/crm/${hash}/dashboard/advertisements/create`)}>
                                    Crear publicidad
                                </Button>
                                <NavLink to={`/crm/${hash}/dashboard/advertisements`}>
                                    <h4 className='box-title'>Publicidades</h4>
                                    <div>
                                        <section>
                                            <p>{advertisements?.filter((n) => n.active).length === 0 ? 0 : advertisements.filter((n) => n.active).length}</p>
                                            <span>Activas</span>
                                        </section>
                                        <section>
                                            <p>{advertisements?.filter((n) => !n.active).length === 0 ? 0 : advertisements.filter((n) => !n.active).length}</p>
                                            <span>No activas</span>
                                        </section>

                                    </div>
                                    <p>Ir hacia sección de publicidades</p>
                                </NavLink>

                            </Box>

                        </>
                }
            </div>


        </section>
    )
}

export default CRMHomePage