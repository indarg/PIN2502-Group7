/* eslint-disable @typescript-eslint/no-unused-expressions */
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { Box, IconButton, LinearProgress, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { TNews } from 'src/models/TNews';
import { TRelease } from 'src/models/TRelease';
import { TTeaser } from 'src/models/TTeaser';
import HttpService from 'src/services/HttpService';
import UtilService from 'src/services/UtilService';
import { toggleButtonStyles } from 'src/shared/material_styles/ButtonStyles';
import './GlobalSearcher.css';
import { TGlobalSearchResult } from 'src/models/response/TGlobalSearchResult';
import { useCommon } from 'src/context/CommonContext/useCommon';
type Props = {
    value?: string,
    readonly?: boolean,
    placeholder?: string,
};
const GlobalSearcher = ({
    placeholder = 'Buscar',
}: Props) => {
    const { setGlobalSearchValue, globalSearchValue } = useCommon();
    const [loading, setLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<'all' | 'news' | 'teasers' | 'releases'>('all');
    const [results, setResults] = useState<TGlobalSearchResult>();
    const [resultNews, setResultNews] = useState<TNews[]>([]);
    const [resultTeasers, setResultTeasers] = useState<TTeaser[]>([]);
    const [resultReleases, setResultReleases] = useState<TRelease[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const httpService = new HttpService('v1/motor-insight/');
    const handleFilters = (event: any, newFilter: 'all' | 'news' | 'teasers' | 'releases' = 'all') => {
        setFilter(newFilter ?? 'all');
    };
    const clean = () => {
        setFilter('all')
        setResultNews([]);
        setResultTeasers([]);
        setResultReleases([]);
    }
    useEffect(() => { doSearch(globalSearchValue) }, [globalSearchValue]);
    const doSearch = async (searchValueParam: string) => {
        setLoading(true);
        if (!searchValueParam) {
            clean()
            setLoading(false);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            try {
                const response = await httpService.globalSearch(searchValueParam);
                setResults(response.payload);
                (filter === 'all' || filter === 'news' || searchValueParam !== '')
                    ? setResultNews(response.payload.news)
                    : setResultNews([]);

                (filter === 'all' || filter === 'teasers' || searchValueParam !== '')
                    ? setResultTeasers(response.payload.teasers)
                    : setResultTeasers([]);

                (filter === 'all' || filter === 'releases' || searchValueParam !== '')
                    ? setResultReleases(response.payload.releases)
                    : setResultReleases([]);
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);

            }

        }, searchValueParam !== '' ? 500 : 0);
        return () => clearTimeout(delayDebounce);
    };

    useEffect(() => {
        (filter === 'all' || filter === 'news')
            ? setResultNews(results?.news ?? [])
            : setResultNews([]);

        (filter === 'all' || filter === 'teasers')
            ? setResultTeasers(results?.teasers ?? [])
            : setResultTeasers([]);

        (filter === 'all' || filter === 'releases')
            ? setResultReleases(results?.releases ?? [])
            : setResultReleases([]);
    }, [filter, results]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setGlobalSearchValue('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='global-searcher' ref={wrapperRef}>
            <div className='searcher '>
                <IconButton className='btn-clean-searcher' onClick={() => {
                    setGlobalSearchValue('')
                }}>
                    {globalSearchValue !== '' &&
                        <CloseIcon sx={{ opacity: 0.5, width: 20 }} />
                    }
                </IconButton>
                <input type='text' placeholder={placeholder} value={globalSearchValue} onChange={(value) => {
                    return setGlobalSearchValue(value.target.value);
                }} />
                <SearchIcon width={25} height={25} sx={{ color: 'var(--m-c3)' }} />

                {
                    loading &&
                    <Box sx={{ width: '100%', position: "absolute", bottom: 0, left: 0 }} >
                        <LinearProgress color='error' />
                    </Box>
                }
            </div>
            <div className='global-searcher-results '>
                {globalSearchValue && <section className=''>
                    <ToggleButtonGroup
                        className='btn-filter-wrapper'
                        value={filter}
                        exclusive
                        onChange={handleFilters}
                        aria-label="text alignment"
                        sx={{ border: "none" }}
                        defaultValue={'all'}
                    >
                        <ToggleButton value="all" aria-label="left aligned" sx={toggleButtonStyles} >
                            Todos
                        </ToggleButton>
                        <ToggleButton value="news" aria-label="centered" sx={toggleButtonStyles}>
                            Noticias
                        </ToggleButton>
                        <ToggleButton value="releases" aria-label="right aligned" sx={toggleButtonStyles}>
                            Lanzamientos
                        </ToggleButton>
                        <ToggleButton value="teasers" aria-label="justified" sx={toggleButtonStyles}>
                            Adelantos
                        </ToggleButton>
                    </ToggleButtonGroup>
                </section>}
                <section>
                    {
                        (!loading && globalSearchValue) &&

                        <>
                            {resultNews.length > 0 && resultNews.map((r, index) => (
                                <NavLink to={`/noticias/${r.id}`} key={index} className={''}>
                                    <img src={UtilService.resolveFile(r.mainImage.fileUrl)} alt='miniature' />
                                    <p>{r.headline}</p>
                                    <p>Noticia</p>
                                </NavLink>
                            ))}
                            {resultTeasers.length > 0 && resultTeasers.map((r, index) => (
                                <NavLink to={`/adelantos/${r.id}`} key={index} className={''}>
                                    <img src={UtilService.resolveFile(r.mainImage.fileUrl)} alt='miniature' />
                                    <p>{r.headline}</p>
                                    <p>Adelanto</p>
                                </NavLink>
                            ))}
                            {resultReleases.length > 0 && resultReleases.map((r, index) => (
                                <NavLink to={`/lanzamientos/${r.id}`} key={index} className={''}>
                                    <img src={UtilService.resolveFile(r.mainImage.fileUrl)} alt='miniature' />
                                    <p>{r.headline}</p>
                                    <p>Lanzamiento</p>
                                </NavLink>
                            ))}
                        </>
                    }
                </section>
            </div>
        </div>
    );
};

export default GlobalSearcher;