import { Stack, Typography } from '@mui/material';
import React, { useState } from 'react';

interface LazyYouTubeEmbedProps {
    videoId: string;
    title: string;
    color?:string
}

const LazyYouTubeEmbed: React.FC<LazyYouTubeEmbedProps> = ({ videoId, title, color='white' }) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const handlePlayClick = (): void => {
        setIsPlaying(true);
    };

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    return (
        <Stack direction={"column"} spacing={1} position={"relative"} margin={"0 5px"} sx={{
            minWidth:"330px",
        }}>
            <div className="video-container" style={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%',
                cursor: 'pointer',
            }}>
                {!isPlaying ? (
                    <div
                        onClick={handlePlayClick}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${thumbnailUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        aria-label={`Reproducir video: ${title}`}
                    >
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <div style={{
                                width: 0,
                                height: 0,
                                borderTop: '15px solid transparent',
                                borderBottom: '15px solid transparent',
                                borderLeft: '25px solid white',
                                marginLeft: '5px',
                            }}></div>
                        </div>
                    </div>
                ) : (
                    <iframe
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                        }}
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title={title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                )}
            </div>
            <Typography variant='body2' color={color}>{title}</Typography>
        </Stack>

    );
};

export default LazyYouTubeEmbed;