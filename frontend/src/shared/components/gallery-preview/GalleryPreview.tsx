import { FC } from "react";
import { TMediaFile } from "src/models/TMediaFile";
import UtilService from "src/services/UtilService";
import './GalleryPreview.css';
import { Typography } from "@mui/material";
export type TGalleryPreviewProps = {
        images: TMediaFile[];
        open: () => void;
        isMobile?:boolean
}
const GalleryPreview: FC<TGalleryPreviewProps> = ({ images, open,isMobile = false }) => {
        

        return (
                <>
                        <section className="gallery-preview">
                                <Typography variant="h1" className="pd">Galeria de fotos</Typography>
                                <div onClick={() => isMobile && open()} className={`gallery-preview-content grid-${images.length > 4 ? 4 : images.length}`}>
                                        {images.slice(0, 4).map((img, index) => (
                                                <div key={index} className={`gallery-preview-item galery-preview-img-as-btn ${(index + 1 === images.length ? ' galery-preview-img-as-btn' : '')}`} 
                                                onClick={open}>
                                                        <img loading="lazy" decoding="async"  src={UtilService.resolveFile(img.fileUrl)} alt={img.description} />
                                                </div>
                                        ))}

                                </div>
                        </section>
                </>
        );
}

export default GalleryPreview;