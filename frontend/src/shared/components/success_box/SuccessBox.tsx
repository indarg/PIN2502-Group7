import { Box, Button, Typography } from "@mui/material";

import { useNavigate } from "react-router-dom";
import './SuccessBox.css'
type Props = {
    goTo?: string,
    successLabel: string,
    gotoLabel?: string
}

const SuccessBox = ({ goTo = '', gotoLabel, successLabel }: Props) => {
    const nav = useNavigate();
    return (
        <Box className='success-box'>
            <img src="/icons/check.png" width={50} />
            <Typography variant="h4" >{successLabel}</Typography>
            <div>
                <Button onClick={() => nav(-1)}>
                    Cerrar
                </Button>
                {goTo && <Button variant="outlined" onClick={() => nav(goTo)}>
                    {gotoLabel}
                </Button>}
            </div>

        </Box>
    )
}

export default SuccessBox;
