import { Modal, Typography } from "@mui/material"
import { FC, useState, useEffect } from "react"
import { TAdvertisement } from "src/models/TAdvertisement"
import './OverlayAdvertisement.css'
import UtilService from "src/services/UtilService"
import Button from "../button/Button"

type OverlayAdvertisement = {
    advertisement: TAdvertisement,
    overlay?:string,
}
export const OverlayAdvertisement: FC<OverlayAdvertisement> = ({ advertisement,overlay = 'MAIN_OVERLAY_AD' }) => {
    const [open, setOpen] = useState<boolean>(true);
    const [disabled, setDisabled] = useState<boolean>(advertisement.duration > 0);
    const [secondsLeft, setSecondsLeft] = useState<number>(advertisement.duration);
   
    useEffect(() => {
        if (advertisement.duration > 0) {
            const interval = setInterval(() => {
                setSecondsLeft(prev => {
                    if (prev <= 1) {
                        setDisabled(false);
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        } else {
            setDisabled(false);
            return;
        }
    }, [advertisement.duration]);

    const getButtonLabel = () => {
        if (disabled && secondsLeft > 0) {
            return `Cerrar (${secondsLeft}s)`;
        }
        return "Cerrar";
    };
    const openNewPage = () => {
       advertisement.ads.length > 0 && advertisement.ads[0].redirectUrl && window.open(advertisement.ads[0].redirectUrl, '_blank'); // Opens in new tab
       setSecondsLeft(0);
    };
    return (
        <Modal open={open} >
            <section className="overlay-advertisement" style={{ cursor: advertisement.ads[0].redirectUrl ? 'pointer' : 'default' }}>
                <div>
                    <img loading="lazy" src={UtilService.resolveFile(advertisement.ads[0].media.fileUrl)} alt={`${advertisement.ads[0].media.description}`} />
                    <section>
                        <h2 className="headline">{advertisement.title}</h2>
                        {advertisement.description &&
                            <Typography
                                variant='body2'
                                dangerouslySetInnerHTML={{
                                    __html: UtilService.decodeBase64Unicode(advertisement.description)
                                }}
                            />
                        }
                        <Button
                            disabled={disabled}
                            action={() => setOpen(false)}
                        >
                            {getButtonLabel()}
                        </Button>
                    </section>
                </div>
                {secondsLeft !== 0 && <div onClick={() => openNewPage()}>
                </div>}
            </section>
        </Modal>
    );
}