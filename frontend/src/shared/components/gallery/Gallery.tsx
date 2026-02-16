import { FC, useEffect, useRef, useState } from "react";
import { TMediaFile } from "src/models/TMediaFile";

import UtilService from "src/services/UtilService";
import './Gallery.css';
import { Box, Button, Modal } from "@mui/material";
export type TGalleryProps = {
        images: TMediaFile[];
        close: () => void;
        open: boolean
}
import CloseIcon from '@mui/icons-material/Close';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
const Gallery: FC<TGalleryProps> = ({ images, close, open }) => {
        const [mainImage, setMainImage] = useState<string | null>(null);
        const [mainIndex, setMainIndex] = useState<number>(0);
        useEffect(() => {
                if (images.length > 0) {
                        setMainImage(images[0].fileUrl);
                        setMainIndex(0);
                }
        }, [images]);

        const scrollRef = useRef<HTMLDivElement>(null)
        const moveWidht = 300;
        const scrollTo = (orientation: 'left' | 'right') => {
                if (!scrollRef.current) return
                setMainIndex(prev => {
                        const newIndex = orientation === 'left' ? Math.max(prev - 1, 0) : Math.min(prev + 1, images.length - 1);
                        setMainImage(images[newIndex].fileUrl);
                        return newIndex;
                });
                scrollRef.current.scrollBy({ left: orientation === 'left' ? -moveWidht : moveWidht })
        }
        return (
                <Modal open={open} onClose={close} sx={{ animation: "show-in 300ms", animationFillMode: "both", }}>

                        <Box className="gallery-complete">
                                <div>
                                        <div>
                                                <Button color="inherit" onClick={close}>
                                                        <CloseIcon />
                                                </Button>
                                        </div>
                                        <Button color="inherit" onClick={() => scrollTo('left')}>
                                                <KeyboardDoubleArrowLeftIcon sx={{ width: 40, height: 40 }} />
                                        </Button>
                                        <img loading="lazy" decoding="async" src={UtilService.resolveFile(mainImage ?? images[0].fileUrl)} alt={images[mainIndex]?.description} />
                                        <Button color="inherit" onClick={() => scrollTo('right')} >
                                                <KeyboardDoubleArrowLeftIcon sx={{ width: 40, height: 40, transform: "rotate(180deg)" }} />
                                        </Button>
                                </div>
                                <div ref={scrollRef}>
                                        {images.map((img) => (
                                                <div key={img.id} className={mainImage === img.fileUrl ? "gallery-item-selected" : " "}>
                                                        <img
                                                                loading="lazy" decoding="async"
                                                                src={UtilService.resolveFile(img.fileUrl)}
                                                                alt={img.description}
                                                                key={img.id}
                                                                onClick={() => {
                                                                        setMainImage(img.fileUrl);
                                                                        setMainIndex(images.findIndex(i => i.fileUrl === img.fileUrl));
                                                                }}

                                                        />
                                                </div>
                                        ))}
                                </div>
                        </Box>
                </Modal>
        )
}

export default Gallery;